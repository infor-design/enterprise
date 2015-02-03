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
    Disabled: function(row, cell, value) {
      return '<span class="is-disabled">' + ((value === null || value === undefined) ? '--' : value) + '</span>';
    }
  };

  //TODO: resize cols - http://dobtco.github.io/jquery-resizable-columns/
  $.fn.datagrid = function(options) {

    // Settings and Options
    var pluginName = 'datagrid',
        defaults = {
          dataset: [],
          columns: [],
          showDrillDown: false
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
       this.render();
       this.handleEvents();
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

        self.table.append(headerRow);
      },

      //Render the Rows
      renderRows: function() {
        var rowHtml, tableHtml = '',
          self=this;

        self.table.find('tbody').remove();

        for (var i = 0; i < settings.dataset.length; i++) {
          rowHtml = '<tbody><tr>';

          if (settings.showDrillDown) {
            rowHtml += '<td>' + '<a href="#" class="drilldown"><span></span></a>' + '</td>';
          }

          for (var j = 0; j < settings.columns.length; j++) {
            var formatter = (settings.columns[j].formatter ? settings.columns[j].formatter : self.defaultFormatter);

            rowHtml += '<td>';
            rowHtml += formatter(i, j, settings.dataset[i][settings.columns[j].field], settings.columns[j], settings.dataset[i]) + '</td>';

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
        var sort = this.sortFunction(columnId, false, function(a){return (typeof a === 'string' ? a.toUpperCase() : a);});
        settings.dataset.sort(sort);
        this.renderRows();
      },

      //Overridable function to conduct sorting
      sortFunction: function(field, reverse, primer) {
        //Can Override Sort Function.
        var key = primer ?
          function(x) {return primer(x[field]);} :
          function(x) {return x[field];};

        reverse = [-1, 1][+!!reverse];
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
