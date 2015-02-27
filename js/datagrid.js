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
      return ((value === null || value === undefined || value === '') ? '--' : value);
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

    Hyperlink: function(row, cell, value) {
      //TODO - Click Events, Confirm Styling
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

    // TODOs
    // DrillDown
    // Checkbox
    // Button
    // Action Button
    // Toggle Button ??
    // Detail Template
    // Re Order ??
    // Multi Line TextArea
    // Select
    // Lookup
    // Text
    // Int
    // Decimal
    // Status Indicator
    // Tree
    // Percent
    // Progress Indicator (n of 100%)
    // Process Indicators
    // Currency
  };

  //TODO: resize cols - http://dobtco.github.io/jquery-resizable-columns/
  $.fn.datagrid = function(options) {

    // Settings and Options
    var pluginName = 'datagrid',
        defaults = {
          dataset: [],
          columns: [],
          showDrillDown: false,
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

        if (this.settings.showDrillDown) {
          self.element.on('click', '.drilldown', function(e) {
            self.element.trigger('drilldown', e);
          });
        }
      },

      //Render the Header
      renderHeader: function() {
        var self = this,
          headerRow;

        for (var i = 0; i < this.settings.dataset.length; i++) {
          headerRow = '<thead><tr>';

          if (settings.showDrillDown) {
            headerRow += '<th></th>';
          }

          for (var j = 0; j < settings.columns.length; j++) {
            var column = settings.columns[j],
              isSortable = (column.sortable === undefined ? true : column.sortable);

            headerRow += '<th scope="col" class="' + (isSortable ? 'is-sortable' : '') + '"' + ' data-columnid="'+ column.id +'">';
            headerRow += '<span class="datagrid-header-text">' + settings.columns[j].name + '</span>';

            if (isSortable) {
              headerRow += '<div class="sort-indicator"><span class="sort-asc"><svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="#icon-caret-up"></svg></span><span class="sort-desc"><svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="#icon-caret-down"></svg></span></div>';
            }

            headerRow += '</th>';
          }
          headerRow += '</tr></thead>';
        }

        self.headerRow = $(headerRow);
        self.table.append(self.headerRow);
      },

      //Render the Rows
      renderRows: function() {
        var rowHtml, tableHtml = '',
          self=this;

        self.table.find('tbody').remove();

        for (var i = 0; i < settings.dataset.length; i++) {
          rowHtml = '<tbody><tr '+ (settings.rowHeight !== 'medium' ? 'class="' + settings.rowHeight + '-rowheight"' : '') +'>';

          if (settings.showDrillDown) {
            rowHtml += '<td>' + '<a href="#" class="drilldown"><span></span></a>' + '</td>';
          }

          for (var j = 0; j < settings.columns.length; j++) {
            var col = settings.columns[j],
                formatter = (col.formatter ? col.formatter : self.defaultFormatter),
                formatted = '';

            formatted = formatter(i, j, settings.dataset[i][settings.columns[j].field], settings.columns[j], settings.dataset[i]) + '</td>';
            if (formatted.indexOf('<span class="is-readonly">') === 0) {
              col.readonly = true;
            }

            rowHtml += '<td' + (col.readonly ? ' class="is-readonly"' : '') + '>';
            rowHtml += formatted;
          }

          rowHtml += '</tr></tbody>';
          tableHtml += rowHtml;
        }
        self.table.append(tableHtml);
      },

      // Attach All relevant events
      handleEvents: function() {
        var self = this;

        //Sorting - If Shift is Down then Multiples
        this.element.on('click.datagrid', 'th.is-sortable', function () {
          self.setSortColumn($(this).attr('data-columnid'));
        });
      },

      //Api Event to set the sort Column
      setSortColumn: function(columnId) {
        var sort;

        //Set Internal Variables
        this.sortColumn.sortAsc = (this.sortColumn.columnId === columnId ? !this.sortColumn.sortAsc : true);
        this.sortColumn.columnId = columnId;

        //Do Sort on Data Set
        sort = this.sortFunction(this.sortColumn.columnId, this.sortColumn.sortAsc);
        settings.dataset.sort(sort);

        //Set Visual Indicator
        this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc');
        this.headerRow.find('[data-columnid="' +columnId + '"]').addClass((this.sortColumn.sortAsc ? 'is-sorted-asc' : 'is-sorted-desc'));
        this.renderRows();
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
