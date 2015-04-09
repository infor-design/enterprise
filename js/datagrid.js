/**
* Datagrid Control
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  /* Formatters */
  window.Formatters = {
    Text: function(row, cell, value) {
      return ((value === null || value === undefined || value === '') ? '--' : value.toString());
    },

    Readonly: function(row, cell, value) {
      return '<span class="is-readonly">' + ((value === null || value === undefined) ? '--' : value) + '</span>';
    },

    Date: function(row, cell, value, col) {
      var formatted = ((value === null || value === undefined) ? '' : value);

      if (typeof Locale !== undefined && true) {
         formatted = Locale.formatDate(value, (col.dateFormat ? {pattern: col.dateFormat}: null));
      }
      return formatted;
    },

    Decimal:  function(row, cell, value, col) {
      var formatted = ((value === null || value === undefined) ? '' : value);

      if (typeof Locale !== undefined && true) {
         formatted = Locale.formatNumber(value, (col.numberFormat ? col.numberFormat : null));
      }
      return formatted;
    },

    Integer:  function(row, cell, value, col) {
      var formatted = ((value === null || value === undefined) ? '' : value);

      if (typeof Locale !== undefined && true) {
        formatted = Locale.formatNumber(value, (col.numberFormat ? col.numberFormat : {style: 'integer'}));
      }
      return formatted;
    },

    Hyperlink: function(row, cell, value) {
      return '<a href="#" class="hyperlink">' + value + '</a>';
    },

    Template: function(row, cell, value, col, item) {
      var tmpl = col.template,
        renderedTmpl = '';

      if (Tmpl && item && tmpl) {
        var compiledTmpl = Tmpl.compile('{{#dataset}}'+tmpl+'{{/dataset}}');
        renderedTmpl = compiledTmpl.render({dataset: item});
      }

      return renderedTmpl;
    },

    Drilldown: function () {
      var text = Locale.translate('Drilldown');
      if (text === undefined) {
        text = '';
      }

      return '<button class="btn-icon small datagrid-drilldown">' +
           '<svg aria-hidden="true" focusable="false" class="icon">'+
           '<use xlink:href="#icon-drilldown"/></svg><span>'+ text +'</span>'+
           '</button>';
    },

    Checkbox: function (row, cell, value, col) {
      //treat 1, true or '1' as checked
      var isChecked = (value==undefined ? false : value == true); // jshint ignore:line
      return '<span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
       (isChecked ? 'is-checked' : '') +'" aria-checked="'+isChecked+'"></span>';
    },

    Actions: function (row, cell, value, col) {
      //Render an Action Formatter
      return '<button class="btn-actions" aria-haspopup="true" aria-expanded="false" aria-owns="popupmenu-1">' +
            '<span class="audible">'+ col.title +'</span>' +
            '<svg class="icon" aria-hidden="false" focusable="false">' +
            '<use xlink:href="#action-button"></svg></button>';
    },

    // Multi Line TextArea
    TextArea: function (row, cell, value) {
      var formatted = ((value === null || value === undefined) ? '' : value);
      return '<span class="datagrid-textarea">'+ formatted + '</span>';
    },

    // Expand / Collapse Button
    Expander: function (row, cell, value) {
      var button = '<button class="btn-icon datagrid-expand-btn">'+
        '<svg class="icon" aria-hidden="true" focusable="false">'+
        '<use xlink:href="#icon-caret-down"></use>'+
        '</svg><span>Expand/Collapse</span>'+
        '</button>' + '<span> ' + value + '</span>';

      return button;
    }

    // TODOs
    // Badge
    // Status Error, Ok, Alert
    // Tags
    // Status Indicator - Validation, New, Editing,
    // Select
    // Multi Select
    // Color Picker
    // File Upload
    // Lookup
    // Currency
    // Percent
    // Progress Indicator (n of 100%)
    // Process Indicator
    // Tree
    // Button ??
    // Toggle Button ??
    // Re Order ??
    // Sparkline
  };

  $.fn.datagrid = function(options) {

    // Settings and Options
    var pluginName = 'datagrid',
        defaults = {
          dataset: [],
          columns: [],
          rowHeight: 'medium' //(short, medium or tall)
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {

      init: function(){
       this.settings = settings;
       this.initSettings();
       this.render();
       this.createResizeHandle();
       this.handleEvents();
      },

      initSettings: function () {
        this.sortColumn = {columnId: null, sortAsc: true};
      },

      //Render the Header and Rows
      render: function () {
        var self = this;

        self.table = $('<table></table>').addClass('datagrid');
        self.table.empty();
        self.renderHeader();
        self.renderRows();
        self.element.addClass('datagrid-container').append(self.table);
      },

      //Render the Header
      renderHeader: function() {
        var self = this,
          headerRow = '<thead><tr>';

        for (var j = 0; j < settings.columns.length; j++) {
          var column = settings.columns[j],
            isSortable = (column.sortable === undefined ? true : column.sortable),
            isResizable = (column.resizable === undefined ? true : column.resizable);

          headerRow += '<th scope="col" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') + '"' +
           ' data-column-id="'+ column.id + '" data-field="'+ column.field +'"'+ (column.width ? ' style="width:'+ (typeof column.width ==='number' ? column.width+'px': column.width) +'"' : '') + '>';
          headerRow += '<div class="datagrid-column-wrapper"><span class="datagrid-header-text">' + settings.columns[j].name + '</span>';

          if (isSortable) {
            headerRow += '<div class="sort-indicator"><span class="sort-asc"><svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="#icon-arrow-up"></svg></span><span class="sort-desc"><svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="#icon-arrow-down"></svg></div>';
          }

          headerRow += '</div></th>';
        }
        headerRow += '</tr></thead>';

        self.headerRow = $(headerRow);
        self.table.append(self.headerRow);

      },

      //Explicitly Set the Width of a column.
      setColumnWidth: function(id, width) {
        var self = this,
          total = 0;

        self.headerRow.find('th').each(function () {
          var col = $(this);

          if (col.attr('data-column-id') === id) {
            col.css('width', width);
            total += width;  //as percentage??
          } else {
            total += col.outerWidth();
          }

        });

        /*for (var i = 0; i < settings.columns.length; i++) {
          if (settings.columns[i].id === id) {
            settings.columns[i].width = width;
            self.headerRow.find('th[data-column-id="'+ id +'"]').css('width', width);
          }
        }*/
        self.table.css('width', total);
      },

      //Return Value from the Object handling dotted notation
      fieldValue: function (obj, field) {
        if (field.indexOf('.') > -1) {
          return field.split('.').reduce(function(o, x) { return (o ? o[x] : ''); }, obj);
        }
        return obj[field];
      },

      //Render the Rows
      renderRows: function() {
        var rowHtml, tableHtml = '<tbody>',
          self=this;

        self.table.find('tbody').remove();

        for (var i = 0; i < settings.dataset.length; i++) {
          rowHtml = '<tr '+ (settings.rowHeight !== 'medium' ? 'class="' + settings.rowHeight + '-rowheight"' : '') +'>';

          for (var j = 0; j < settings.columns.length; j++) {
            var col = settings.columns[j],
                cssClass = '',
                formatter = (col.formatter ? col.formatter : self.defaultFormatter),
                formatted = '';

            formatted = formatter(i, j, self.fieldValue(settings.dataset[i], settings.columns[j].field), settings.columns[j], settings.dataset[i]).toString();
            if (formatted.indexOf('<span class="is-readonly">') === 0) {
              col.readonly = true;
            }

            if (formatted.indexOf('datagrid-checkbox') > -1 ||
              formatted.indexOf('btn-actions') > -1) {
              cssClass += ' l-center-text';
            }

            // Add Column Css Classes
            cssClass += (col.readonly ? 'is-readonly ' : '');
            cssClass += (col.cssClass ? col.cssClass : '');

            rowHtml += '<td' + (cssClass ? ' class="' + cssClass + '"' : '') + '>';
            rowHtml += formatted + '</td>';
          }

          rowHtml += '</tr>';


          if (settings.rowTemplate) {
            var tmpl = settings.rowTemplate,
              item = settings.dataset[i],
              renderedTmpl = '';

            if (Tmpl && item) {
              var compiledTmpl = Tmpl.compile('{{#dataset}}'+tmpl+'{{/dataset}}');
              renderedTmpl = compiledTmpl.render({dataset: item});
            }

            rowHtml += '<tr class="datagrid-expandable-row"><td colspan="100%">' +
              '<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding">'+ renderedTmpl + '</div></div>' +
              '</td></tr>';
          }
          tableHtml += rowHtml;
        }

        tableHtml += '</tbody>';
        self.table.append(tableHtml);
      },

      // Attach All relevant events
      handleEvents: function() {
        var self = this;

        //Sorting - If Shift is Down then Multiples
        this.element.on('click.datagrid', 'th.is-sortable', function () {
          self.setSortColumn($(this).attr('data-field'));
        });

        //Handle Clicking Buttons and links in formatters
        this.table.on('click.datagrid', 'a, button', function (e) {
          var elem = $(this).closest('td'),
            btn = $(this),
            cell = elem.index(),
            row = $(this).closest('tr').index(),
            col = self.settings.columns[cell];

          if (col.click) {
            col.click(e, [row, cell, col, e.currentTarget]);
          }

          if (btn.is('.datagrid-expand-btn')) {
            self.expandRow(row+1);
          }
        });

        // Move the drag handle to the end or start of the column
        this.headerRow.on('mousemove.datagrid touchstart.datagrid touchmove.datagrid', 'th', function (e) {
          if (self.dragging) {
            return;
          }

          self.currentHeader = $(e.target).closest('th');

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          var leftEdge = parseInt(self.currentHeader.position().left),
            rightEdge = leftEdge + self.currentHeader.outerWidth(),
            leftPos = 0;

          //TODO: Test Touch support - may need handles on each column
          leftPos = ((e.pageX - leftEdge > rightEdge - e.pageX) ? (rightEdge - 6): (leftEdge - 6));
          self.resizeHandle.css('left', leftPos + 'px');
        });

      },

      //TODO: Views
      saveView: function () {
        // Save - Expanded Rows
        // Columns
        // Search
      },

      expandRow: function(row) {
        var expandRow = this.table.find('tr').eq(row+1),
          expandButton = this.table.find('tr').eq(row).find('.datagrid-expand-btn'),
          detail = expandRow.find('.datagrid-row-detail');

        if (expandRow.hasClass('is-expanded')) {
          expandRow.removeClass('is-expanded');
          expandButton.removeClass('is-expanded');
          detail.height(0);
        } else {
          expandRow.addClass('is-expanded');
          expandButton.addClass('is-expanded');
          detail.height(190);
        }
      },

      //Api Event to set the sort Column
      setSortColumn: function(field) {
        var sort;
        //Set Internal Variables
        this.sortColumn.sortAsc = (this.sortColumn.sortField === field ? !this.sortColumn.sortAsc : true);
        this.sortColumn.sortField = field;

        //Do Sort on Data Set
        sort = this.sortFunction(this.sortColumn.sortField, this.sortColumn.sortAsc);
        settings.dataset.sort(sort);

        //Set Visual Indicator
        this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc');
        this.headerRow.find('[data-field="' +field + '"]').addClass((this.sortColumn.sortAsc ? 'is-sorted-asc' : 'is-sorted-desc'));
        this.renderRows();
      },

      //Generate Resize Handles
      createResizeHandle: function() {
        var self = this;

        this.resizeHandle = $('<div class="resize-handle" aria-hidden="true"></div>');
        this.table.before(this.resizeHandle);

        this.resizeHandle.drag({axis: 'x', containment: 'parent'}).on('drag.datagrid', function (e, ui) {
          var id = self.currentHeader.attr('data-column-id');

          if (!self.currentHeader) {
            return;
          }

          self.dragging = true;
          self.setColumnWidth(id, ui.left - self.currentHeader.offset().left + 6);
        }).on('dragend.datagrid', function () {
          self.dragging = false;
        });
      },

      //Overridable function to conduct sorting
      sortFunction: function(field, reverse, primer) {

        if (!primer) {
          primer = function(a) {
            a = (a === undefined || a === null ? '' : a);
            return (typeof a === 'string' ? a.toUpperCase() : a);
          };
        }

        var key = primer ?
          function(x) {return primer(x[field]);} :
          function(x) {return x[field];};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
      },

      //Default formatter just plain text style
      defaultFormatter: function(row, cell, value) {
        return ((value === null || value === undefined) ? '' : value);
      }
    };

    // Initialize the plugin (Once) or set settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });

  };
}));
