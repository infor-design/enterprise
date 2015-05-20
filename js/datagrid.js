/**
* Datagrid Control
*/

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
    return '<a href="#" tabindex="-1" class="hyperlink">' + value + '</a>';
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
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
     (isChecked ? 'is-checked' : '') +'" aria-checked="'+isChecked+'"></span></div>';
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
      '<span class="icon plus-minus"></span>' +
      '</button>' + '<span> ' + value + '</span>';

    return button;
  },

  // Badge / Tags and Visual Indictors
  ClassRange: function (row, cell, value, col) {
    var ranges = col.ranges,
      classes = '', text='';

    for (var i = 0; i < ranges.length; i++) {
      classes = (value >= ranges[i].min && value <= ranges[i].max ? ranges[i].classes : classes);
      text = (ranges[i].text ? ranges[i].text :classes.split(' ')[0]);
    }

    return {'classes': classes, 'text': text};
  },

  Badge: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);
    return '<span class="' + ranges.classes +'"><span class="audible">'+ ranges.text + '</span></span>';
  },

  Tag: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);
    return '<span class="tag ' + ranges.classes +'">'+ value + '</span>';
  },

  // TODOs
  // Badge (Visual Indictors)
  // Tags (low priority)
  // Status Indicator - Error (Validation), Ok, Alert, New, Dirty (if submit)
  // Select (Drop Down)
  // Multi Select
  // Color Picker (Low)
  // File Upload (Simple)
  // Lookup
  // Currency
  // Percent
  // Progress Indicator (n of 100%)
  // Process Indicator
  // Tree
  // Text Button (1 or 2)
  // Menu Button
  // Icon Button (Approved and SoHo Xi Standard)
  // Toggle Button (No)
  // Re Order - Drag Indicator
  // Sparkline
};

$.fn.datagrid = function(options) {

  // Settings and Options
  var pluginName = 'datagrid',
      defaults = {
        dataset: [],
        columns: [],
        rowHeight: 'medium', //(short, medium or tall)
        menuId: null,  //Id to the right click context menu
        selectable: false //false, 'single' or 'multiple'
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
     this.handleKeys();
    },

    initSettings: function () {
      this.sortColumn = {columnId: null, sortAsc: true};
      this.gridCount = $('.datagrid').length + 1;
    },

    //Render the Header and Rows
    render: function () {
      var self = this;

      self.table = $('<table role="grid"></table>').addClass('datagrid');
      self.table.empty();
      self.renderHeader();
      self.renderRows();
      self.element.addClass('datagrid-container').append(self.table);
    },

    uniqueID: function (gridCount, suffix) {
      return 'datagrid-' + gridCount + suffix;
    },

    //Render the Header
    renderHeader: function() {
      var self = this,
        headerRow = '<thead><tr>';

      for (var j = 0; j < settings.columns.length; j++) {
        var column = settings.columns[j],
          uniqueId = self.uniqueID(self.gridCount, '-header-' + j),
          isSortable = (column.sortable === undefined ? true : column.sortable),
          isResizable = (column.resizable === undefined ? true : column.resizable),
          isCentered = (column.centered === undefined ? false : column.centered);

        if (column.hidden) {
          continue;
        }

        if (j === settings.columns.length-1) {
          //Ignore width on last column
          column.width = undefined;
        }

        headerRow += '<th scope="col" role="columnheader" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') + '"' +
         ' id="' + uniqueId + '" data-column-id="'+ column.id + '" data-field="'+ column.field +'"'+
         (column.width ? ' style="width:'+ (typeof column.width ==='number' ? column.width+'px': column.width) +'"' : '') + '>';
         headerRow += '<div class="datagrid-column-wrapper '+ (isCentered ? ' l-center-text' : '') +'"><span class="datagrid-header-text">' + settings.columns[j].name + '</span>';

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
      var rowHtml, tableHtml = '',
        self=this;

      var body = self.table.find('tbody');
      if (body.length === 0) {
        self.tableBody = $('<tbody></tbody>');
        self.table.append(self.tableBody);
      }

      self.tableBody.empty();

      for (var i = 0; i < settings.dataset.length; i++) {
        rowHtml = '<tr role="row" aria-rowindex="' + (i+1) + '" '+
                  (settings.rowHeight !== 'medium' ? 'class="' + settings.rowHeight +
                   '-rowheight"' : '') +'>';

        for (var j = 0; j < settings.columns.length; j++) {
          var col = settings.columns[j],
              cssClass = '',
              formatter = (col.formatter ? col.formatter : self.defaultFormatter),
              formatted = '';

          if (col.hidden) {
            continue;
          }

          formatted = formatter(i, j, self.fieldValue(settings.dataset[i], settings.columns[j].field), settings.columns[j], settings.dataset[i]).toString();
          if (formatted.indexOf('<span class="is-readonly">') === 0) {
            col.readonly = true;
          }

          if (formatted.indexOf('datagrid-checkbox') > -1 ||
            formatted.indexOf('btn-actions') > -1 || formatted.indexOf('badge') > -1) {
            cssClass += ' l-center-text';
          }

          // Add Column Css Classes
          cssClass += (col.readonly ? 'is-readonly ' : '');
          cssClass += (col.cssClass ? col.cssClass : '');

          rowHtml += '<td role="gridcell" aria-colindex="' + (j+1) + '" '+
              ' aria-describedby="' + self.uniqueID(self.gridCount, '-header-' + j) + '"' +
             (cssClass ? ' class="' + cssClass + '"' : '') +
              '><div class="datagrid-cell-wrapper">';
          rowHtml += formatted + '</div></td>';
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

      self.tableBody.append(tableHtml);
      self.displayCounts();
    },

    //Show Summary and any other count info
    displayCounts: function() {
      this.element.prev('.toolbar').find('.datagrid-result-count').text('(' + this.settings.dataset.length + ' ' + Locale.translate('Results') + ')');
    },

    //Trigger event on parent and compose the args
    triggerRowEvent: function (eventName, e, stopPropagation) {
      var self = this,
          row = $(e.currentTarget).index(),
          cell = $(e.target).closest('td').index(),
          item = self.settings.dataset[row];

      if (stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }

      self.element.trigger(eventName, [{row: row, cell: cell, item: item, originalEvent: e}]);
      return false;
    },

    //Returns a cell node
    cellNode: function (row, cell) {
      var rowNode = this.table.find('tr:visible').eq(row);

      return rowNode.find('td:visible').eq(cell);
    },

    // Attach All relevant events
    handleEvents: function() {
      var self = this;

      //Sorting - If Shift is Down then Multiples

      this.element.on('touchcancel.datagrid touchend.datagrid', 'th.is-sortable', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger('click');
      }).on('click.datagrid', 'th.is-sortable', function () {
        self.setSortColumn($(this).attr('data-field'));
      });

      //Handle Clicking Buttons and links in formatters
      this.table.on('mouseup.datagrid', 'td', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var elem = $(this).closest('td'),
          btn = $(this).find('button'),
          cell = elem.index(),
          row = $(this).closest('tr').index(),
          col = self.settings.columns[cell],
          item = self.settings.dataset[row];

        if (col.click) {
          col.click(e, [{row: row, cell: cell, item: item, originalEvent: e}]);
        }

        if (col.menuId) {
          btn.popupmenu({menuId: col.menuId, trigger: 'immediate'});
        }

        if (btn.is('.datagrid-expand-btn')) {
          self.expandRow(row+1);
        }

        return false;
      });

      var body = this.table.find('tbody');
      body.on('touchcancel.datagrid touchend.datagrid', 'td', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger('click');
      }).on('click.datagrid', 'td', function (e) {
        var target = $(e.target);

        self.triggerRowEvent('click', e, true);
        self.setActiveCell(target.closest('td'));
        self.selectedRows(target.closest('tr'));
      });

      body.on('dblclick.datagrid', 'tr', function (e) {
        self.triggerRowEvent('dblclick', e, true);
      });

      //Handle Context Menu Option
      body.on('contextmenu.datagrid', 'tr', function (e) {
        self.triggerRowEvent('contextmenu', e, (self.settings.menuId ? true : false));

        if (self.settings.menuId) {
          e.preventDefault();
          $(e.currentTarget).popupmenu({menuId: self.settings.menuId, eventObj: e, trigger: 'immediate'});
          return false;
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
          alignToLeft = (e.pageX - leftEdge > rightEdge - e.pageX),
          leftPos = 0;

        //TODO: Test Touch support - may need handles on each column
        leftPos = (alignToLeft ? (rightEdge - 6): (leftEdge - 6));

        if (self.currentHeader.index() === 0 && !alignToLeft) {
          leftPos = '-999';
        }

        if (!alignToLeft) {
           self.currentHeader = self.currentHeader.prev();
        }

        self.resizeHandle.css('left', leftPos + 'px');
      });

    },

    //Get or Set Selected Rows
    _selectedRows: [],
    selectedRows: function (row) {

      if (row && this.settings.selectable === 'single') {
        var idx = row.index();

        if (row.hasClass('is-selected')) {
          this._selectedRows = [];
          row.removeClass('is-selected').removeAttr('aria-selected');
          this.element.trigger('selected', [this._selectedRows]);
          return;
        }

        this._lastSelectedRow = idx;
        this._selectedRows = [];
        this._selectedRows.push({idx: idx, data: settings.dataset[idx], elem: row});

        var selectedRows = row.closest('tbody').find('tr.is-selected');
        selectedRows.removeClass('is-selected').removeAttr('aria-selected');
        selectedRows.find('td').removeAttr('aria-selected');

        row.addClass('is-selected').attr('aria-selected', 'true');
        row.find('td').attr('aria-selected', 'true');
      }

      this.element.trigger('selected', [this._selectedRows]);
      return this._selectedRows;
    },

    // Handle all keyboard behavior
    activeCell: {node: null, cell: null, row: null},

    handleKeys: function () {
      var self = this;

      // Set tab index to first cell
      self.activeCell = {node: self.cellNode(1, 0).attr('tabindex', '0'), cell: 0, row: 1};
      self.table.on('keyup.datagrid', 'td', function (e) {
        var key = e.which, row,
          handled = false;

        //Left and Right to navigate by cell.
        if (key === 37 && !e.altKey) {
          self.setActiveCell(self.activeCell.row, self.activeCell.cell-1);
        }

        if (key === 39 && !e.altKey) {
          self.setActiveCell(self.activeCell.row, self.activeCell.cell+1);
        }

        //Up and Down to navigate by row.
        if (key === 38 && !e.altKey) {
          self.setActiveCell(self.activeCell.row-1, self.activeCell.cell);
          handled = true;
        }

        if (key === 40 && !e.altKey) {
          self.setActiveCell(self.activeCell.row+1, self.activeCell.cell);
          handled = true;
        }

        //Press Control+Home or Control+End to move to the first row on the first page or the last row on the last page.
        if (key === 38 && e.altKey) {
          self.setActiveCell(1, self.activeCell.cell);
        }
        if (key === 40 && e.altKey) {
          row = self.activeCell.node.closest('tbody').find('tr:last').index();
          self.setActiveCell(row+1, self.activeCell.cell);
        }

        //Press Control+Spacebar to announce the current row when using a screen reader.
        if (key === 32 && e.ctrlKey && self.activeCell.node) {
          var string = '';
          row = self.activeCell.node.closest('tr');

          row.children().each(function () {
            var cell = $(this);
            //Read Header
            //string += $('#' + cell.attr('aria-describedby')).text() + ' ' + cell.text() + ' ';
            string += cell.text() + ' ';
          });

          $('body').toast({title: '', audibleOnly: true, message: string});
          handled = true;
        }

        //TODO: Press Alt+Up or Alt+Down to set focus to the first or last row on the current page.
        //Press PageUp or PageDown to open the previous or next page and set focus to the first row.
        //Press Alt+PageUp or Alt+PageDown to open the first or last page and set focus to the first row.
        if (key === 37 && e.altKey) {
          self.setActiveCell(self.activeCell.row, 0);
        }

        if (key === 39 && e.altKey) {
        }

        //Press Home or End to move to the first or last cell on the current row.
        if (key === 36) {
          self.setActiveCell(self.activeCell.row, 0);
        }

        if (key === 35) {
          var lastCell = self.activeCell.node.closest('tr').find('td:last').index();
          self.setActiveCell(self.activeCell.row, lastCell);
        }

        // For mode 'Selectable':
        // Press Space to toggle row selection, or click to activate using a mouse.
        if (key === 32 || key ===13) {
          row = self.activeCell.node.closest('tr');
          self.selectedRows(row);
        }

        //TODO: If multiSelect is enabled, press Control+A to select all rows on the current page.
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        /*
        For mode 'Editable':
        Press Enter or Space to edit or toggle a cell, or click to activate using a mouse.
        */
      });
    },

    setActiveCell: function (row, cell) {
      var self = this,
        prevCell = self.activeCell;

      //Support passing the td in
      if (row instanceof jQuery) {
        cell = row.index();
        row = row.parent().index()+1;
      }

      if (row < 0 || cell < 0) {
        return;
      }

      //Remove previous tab index
      if (prevCell.node && prevCell.node.length ===1) {
        self.activeCell.node.removeAttr('tabindex');
      }

      //Find the cell if it exists
      self.activeCell.node = self.cellNode(row, cell).attr('tabindex', '0');

      if (self.activeCell.node && prevCell.node.length === 1) {
        self.activeCell.row = row;
        self.activeCell.cell = cell;
      } else {
        self.activeCell = prevCell;
      }

      self.activeCell.node.focus();
    },

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
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');
        detail.height(0);
      } else {
        expandRow.addClass('is-expanded');
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');
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

      if (this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }
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

