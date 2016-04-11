/**
* Datagrid Control
*/

window.Formatters = {
  Text: function(row, cell, value) {
    return ((value === null || value === undefined || value === '') ? '' : value.toString());
  },

  Readonly: function(row, cell, value) {
    return '<span class="is-readonly">' + ((value === null || value === undefined) ? '' : value) + '</span>';
  },

  Date: function(row, cell, value, col) {
    var formatted = ((value === null || value === undefined) ? '' : value);

    if (!value) {
       return '';
    }

    if (typeof Locale !== undefined) {
       formatted = Locale.formatDate(value, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
    }

    if (typeof value === 'string') {
      var value2 = Locale.parseDate(value, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
      if (value2) {
        formatted = Locale.formatDate(value2, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
      }
    }

    if (!col.editor) {
      return formatted;
    }
    return '<span class="trigger">' + formatted + '</span><svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-calendar"><use xlink:href="#icon-calendar"/></svg>';
  },

  Decimal:  function(row, cell, value, col) {
    var formatted;

    formatted = value;

    if (typeof Locale !== undefined) {
       formatted = Locale.formatNumber(value, (col.numberFormat ? col.numberFormat : null));
    }

    formatted = ((formatted === null || formatted === undefined) ? '' : formatted);
    return formatted;
  },

  Integer:  function(row, cell, value, col) {
    var formatted;

    formatted = value;

    if (typeof Locale !== undefined) {
      formatted = Locale.formatNumber(value, (col.numberFormat ? col.numberFormat : {style: 'integer'}));
    }

    formatted = ((formatted === null || formatted === undefined) ? '' : formatted);
    return formatted;
  },

  Hyperlink: function(row, cell, value, col) {
    return '<a href="' + (col.href ? col.href : '#') +'" tabindex="-1" role="presentation" class="hyperlink">' + value + '</a>';
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
         '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">'+
         '<use xlink:href="#icon-drilldown"/></svg><span>'+ text +'</span>'+
         '</button>';
  },

  Checkbox: function (row, cell, value, col) {
    var isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      //treat 1, true or '1' as checked
      isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    }

    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
     (isChecked ? 'is-checked' : '') +'" aria-checked="'+isChecked+'"></span></div>';
  },

  SelectionCheckbox: function (row, cell, value, col) {
    var isChecked = (value==undefined ? false : value == true); // jshint ignore:line
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox datagrid-selection-checkbox' +
     (isChecked ? 'is-checked' : '') +'" aria-checked="'+isChecked+'"></span></div>';
  },

  Actions: function (row, cell, value, col) {
    //Render an Action Formatter
    return '<button class="btn-actions" aria-haspopup="true" aria-expanded="false" aria-owns="popupmenu-1">' +
          '<span class="audible">'+ col.title +'</span>' +
          '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">' +
          '<use xlink:href="#icon-more"></svg></button>';
  },

  // Multi Line TextArea
  Textarea: function (row, cell, value) {
    var formatted = ((value === null || value === undefined) ? '' : value);
    return '<span class="datagrid-textarea">'+ formatted + '</span>';
  },

  // Expand / Collapse Button
  Expander: function (row, cell, value) {
    var button = '<button class="btn-icon datagrid-expand-btn" tabindex="-1">'+
      '<span class="icon plus-minus"></span>' +
      '<span class="audible">' + Locale.translate('ExpandCollapse') + '</span>' +
      '</button>' + ( value ? '<span> ' + value + '</span>' : '');

    return button;
  },

  // Badge / Tags and Visual Indictors
  ClassRange: function (row, cell, value, col) {
    var ranges = col.ranges,
      classes = '', text='';

    if (!ranges) {
      return {};
    }

    for (var i = 0; i < ranges.length; i++) {
      if (value >= ranges[i].min && value <= ranges[i].max) {
        classes = ranges[i].classes;
        text = (ranges[i].text ? ranges[i].text : classes.split(' ')[0]);
      }

      if (value === ranges[i].value) {
        classes = ranges[i].classes;
        text = (ranges[i].text ? ranges[i].text : value);
      }
    }

    return {'classes': classes, 'text': text};
  },

  // Badge (Visual Indictors)
  Badge: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);

    return '<span class="badge ' + ranges.classes +'">' + value +' <span class="audible">'+ ranges.text+ '</span></span>';
  },

  // Tags (low priority)
  Tag: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);
    return '<span class="tag ' + ranges.classes +'">'+ value + '</span>';
  },

  Alert: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);
    return '<svg class="icon datagrid-alert-icon icon-' + ranges.classes +'" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-' + ranges.classes +'"/></svg><span class="datagrid-alert-text">' + (ranges.text === 'value' ? value : ranges.text) + '</span>';
  },

  Image: function (row, cell, value, col) {

    return '<img class="datagrid-img"' + ' src="' + value +'" alt= "' + (col.alt ? col.alt : Locale.translate('Image')) +
     '"' + (col.dimensions ? ' style="height:'+col.dimensions.height+';width:'+col.dimensions.height+'"' : '') + '/>';
  },

  Color: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col),
      text = ((value === null || value === undefined || value === '') ? '' : value.toString());

    return '<span class="' + ranges.classes + '">' + text + '</span>';
  },

  Button: function (row, cell, value, col) {
    var text = col.text ? col.text : ((value === null || value === undefined || value === '') ? '' : value.toString());
    return '<button type="button" class="btn row-btn ' + (col.cssClass ? col.cssClass : '') + '">' + text + '</span>';
  },

  Dropdown: function (row, cell, value, col) {
    var formattedValue = value;

    if (col.options && value) {
      for (var i = 0; i < col.options.length; i++) {
        if (col.options[i].value === value) {
          formattedValue = col.options[i].label;
        }
      }
    }

    return '<span class="trigger">' + formattedValue + '</span><svg role="presentation" aria-hidden="true" focusable="false" class="icon"><use xlink:href="#icon-dropdown"/></svg>';
  },

  Favorite: function (row, cell, value, col) {
    var isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    }

    return !isChecked ? '' : '<span class="audible">'+ Locale.translate('Favorite') + '</span><span class="icon-favorite"><svg role="presentation" aria-hidden="true" focusable="false" class="icon"><use xlink:href="#icon-star-filled"/></svg></span>';
  },

  // Possible future Formatters
  // Status Indicator - Error (Validation), Ok, Alert, New, Dirty (if submit)
  // Image?
  // Tree
  // Multi Select
  // Lookup
  // Re Order - Drag Indicator
  // Sparkline
  // Progress Indicator (n of 100%)
  // Process Indicator
  // Currency
  // Percent
  // File Upload (Simple)
  // Menu Button
  // Icon Button (Approved and SoHo Xi Standard)
  // Toggle Button (No)
  // Color Picker (Low)
};

window.Editors = {
  //Supports, Text, Numeric, Integer via mask
  Input: function(row, cell, value, container, column) {

    this.name = 'input';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input type="text"/>').appendTo(container);

      if (column.align) {
        this.input.addClass('l-'+ column.align +'-text');
      }

      if (column.mask) {
        this.input.mask({pattern: column.mask});
      }
    };

    this.val = function (value) {
      if (value) {
        this.input.val(value);
      }
      return this.input.val();
    };

    this.focus = function () {
      this.input.focus().select();
    };

    this.destroy = function () {
      this.input.remove();
    };

    this.init();
  },

  Textarea: function(row, cell, value, container) {

    this.name = 'textarea';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<textarea class="textarea"></textarea>').appendTo(container);
    };

    this.val = function (value) {
      if (value) {
        //note that focus will help move text to end of input.
        this.input.focus().val(value);
      }
      return this.input.val();
    };

    this.focus = function () {
      this.input.focus();
    };

    this.destroy = function () {
      this.input.remove();
    };

    this.init();
  },

  Checkbox: function(row, cell, value, container, column, e) {

    this.name = 'checkbox';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input type="checkbox" class="checkboxn"/>').appendTo(container);
      this.input.after('<label class="checkbox-label">&nbsp;</label>');

      if (column.align) {
        this.input.addClass('l-'+ column.align +'-text');
      }
    };

    this.val = function (value) {
      var isChecked;

      if (value === undefined) {
        return this.input.prop('checked');
      }

      // Use isChecked function if exists
      if (column.isChecked) {
        isChecked = column.isChecked(value);
      } else {
        isChecked = value;
      }

      if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 32)) {
        //just toggle it
        isChecked = !isChecked;
      }

      this.input.prop('checked', isChecked);
    };

    this.focus = function () {
      this.input.trigger('focusout');
    };

    this.destroy = function () {
      this.input.next('.checkbox-label').remove();
      this.input.remove();
    };

    this.init();
  },

  Dropdown: function(row, cell, value, container, column, event, grid) {

    this.name = 'dropdown';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value
    this.cell = grid.activeCell;

    this.init = function () {
      //Uses formatter
      this.input = $('<select class="dropdown"></select>').appendTo(container);
      this.select = this.input;

      if (column.options) {
        for (var i = 0; i < column.options.length; i++) {
          var html = $('<option></<option>'),
            opt = column.options[i];

          if (opt.selected || value === opt.value) {
            html.attr('selected', 'true');
          }

          html.attr('value', opt.value).attr('id', opt.id);
          html.text(opt.label);
          this.input.append(html);
        }
      }

      this.input.dropdown(column.editorOptions);
      this.input = this.input.parent().find('input');

    };

    this.val = function (value) {
      var self = this;

      if (value) {
        this.input.val(value);

        this.select.find('option').each(function () {
          var opt = $(this);

          if (opt.attr('value') === value) {
            opt.attr('selected', 'true');
            self.input.val(opt.text());
          }
        });
      }

      var selected = this.select.find(':selected'),
        val = selected.attr('value');

      if (!val) {
        val = selected.text();
      }

      return val;
    };

    this.focus = function () {
      var self = this;

      this.select.trigger('activate');

      //Check if isClick or cell touch and just open the list
      if (event.type === 'click') {
        //Revert cell on selection
        this.select.trigger('openlist');
      } else {
         //Keyboard
         this.input.focus();
      }

      this.select.on('listclosed', function () {
          if (grid.activeCell.cell === self.cell.cell && grid.activeCell.row === self.cell.row) {
           self.input.trigger('focusout');
           container.parent().trigger('focus');
          } else {
            grid.commitCellEdit(self.input);
          }
      });

    };

    this.destroy = function () {
      //We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  Date: function(row, cell, value, container, column, event) {

    this.name = 'date';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="datepicker"/>').appendTo(container);
      this.input.datepicker();
    };

    this.val = function (value) {
      if (value) {
        //Note that the value should be formatted from the formatter.
        this.input.val(value);
      }

      return this.input.val();
    };

    this.focus = function () {
      var self = this;

      this.input.select().focus();

      //Check if isClick or cell touch and just open the list

      if (event.type === 'click') {
        this.input.parent().find('.icon').trigger('click');
        this.input.closest('td').addClass('is-focused');
      }

      this.input.on('listclosed', function () {
        self.input.closest('td').removeClass('is-focused');

        setTimeout(function () {
          self.input.trigger('focusout');
          container.parent().focus();
        }, 1);

      });

    };

    this.destroy = function () {
      this.input.remove();
    };

    this.init();

  }
};

$.fn.datagrid = function(options) {

  // Settings and Options
  var pluginName = 'datagrid',
      defaults = {
        cellNavigation: true,
        alternateRowShading: false, //Sets shading for readonly grids
        columns: [],
        dataset: [],
        columnsReorder: false, // Makes columns to be re-order by drag and drop
        editable: false,
        isList: false, // Makes a readonly "list"
        menuId: null,  //Id to the right click context menu
        rowHeight: 'normal', //(short, medium or normal)
        selectable: false, //false, 'single' or 'multiple'
        clickToSelect: true,
        toolbar: false, // or features fx.. {title: 'Data Grid Header Title', results: true, keywordFilter: true, filter: true, rowHeight: true, views: true}
        //Paging Options
        paging: false,
        pagesize: 25,
        pagesizes: [10, 25, 50, 75],
        indeterminate: false, //removed ability to go to a specific page.
        source: null //callback for paging
      },
      settings = $.extend({}, defaults, options);

  // Plugin Constructor
  function Datagrid(element) {
    this.element = $(element);
    this.init();
  }

  // Actual Plugin Code
  Datagrid.prototype = {

    init: function(){
      var self = this;
      this.isFirefoxMac = (navigator.platform.indexOf('Mac') !== -1 && navigator.userAgent.indexOf(') Gecko') !== -1);
      this.settings = settings;
      this.initSettings();
      this.appendToolbar();
      this.render();
      this.initFixedHeader();
      this.createResizeHandle();
      this.handlePaging();
      this.initTableWidth();
      this.handleEvents();
      this.handleKeys();

      setTimeout(function () {
        self.element.trigger('rendered', [self.element, self.headerRow, self.pagerBar]);
      }, 0);
    },

    initSettings: function () {

      if (this.settings.dataset !== 'table') {
        this.element.wrap( '<div class="datagrid-wrapper" />');
      }

      this.sortColumn = {sortField: null, sortAsc: true};
      this.gridCount = $('.datagrid').length + 1;
      this.lastSelectedRow = 0;// Rember index to use shift key

      this.contextualToolbar = this.element.closest('.datagrid-wrapper').prev('.contextual-toolbar');
      this.contextualToolbar.addClass('datagrid-contextual-toolbar');
    },

    //Initialize as a Table
    initFromTable: function () {
      if (this.settings.dataset === 'table') {
        this.element.remove();
      }
    },

    initTableWidth: function () {
      if (this.element.parents().hasClass('modal')) {
        var el = $('.modal .modal-content'),
          w = this.table.width() +
            parseInt(el.css('padding-left'), 10) +
            parseInt(el.css('padding-right'), 10) +
            parseInt(el.css('margin-left'), 10) +
            parseInt(el.css('margin-right'), 10);

        this.element.css('max-width', w);
        $('.modal').css('overflow','hidden').find('.modal-body').css('overflow-x','hidden');
      }

      //initialize row height by a setting
      if (settings.rowHeight !== 'normal') {
        this.element.find('table').addClass(settings.rowHeight + '-rowheight');
      }
    },

    //Render the Header and Rows
    render: function () {
      var self = this;

      //Init from Table
      if (this.settings.dataset === 'table') {
        self.table = $(this.element).addClass('datagrid');

        var wrapper = $(this.element).closest('.datagrid-wrapper');

        if (wrapper.length === 0) {
          this.element.wrap('<div class="datagrid-wrapper"><div class="datagrid-container"></div></div>');
        }
        self.settings.dataset = self.htmlToDataset();
        self.container = this.element.closest('.datagrid-wrapper');
      } else {
        self.table = $('<table role="grid"></table>').addClass('datagrid');
        self.container = self.element.addClass('datagrid-container');
      }

      $(this.element).closest('.datagrid-wrapper').addClass(this.settings.isList ? ' is-readonly' : '');
      self.table.addClass(this.settings.isList ? ' is-readonly' : '');

      self.table.empty();
      self.renderHeader();
      self.renderRows();
      self.element.append(self.table);
      self.setColumnWidths();

      self.wrapper = self.element.closest('.datagrid-wrapper');
    },

    htmlToDataset: function () {
      var rows = $(this.element).find('tbody tr'),
        self = this,
        specifiedCols = (self.settings.columns.length > 0),
        dataset = [];

      //Geneate the columns if not supplier
      if (!specifiedCols) {
        var headers = $(this.element).find('thead th'),
          firstRow = self.element.find('tbody tr:first()');

        headers.each(function (i, col) {
          var colSpecs = {},
            column = $(col),
            colName = 'column'+i;

          colSpecs.id  = column.text().toLowerCase();
          colSpecs.name = column.text();
          colSpecs.field = colName;

          var link = firstRow.find('td').eq(i).find('a');
          if (link.length > 0) {
            colSpecs.formatter = Formatters.Hyperlink;
            colSpecs.href = link.attr('href');
          }

          self.settings.columns.push(colSpecs);
        });
      }

      rows.each(function () {
        var cols = $(this).find('td'),
          newRow = {};

        cols.each(function (i, col) {
          var column = $(col),
            colName = 'column'+i;

          if (self.settings.columns[i].formatter) {
            newRow[colName] = column.text();
          } else {
            newRow[colName] = column.html();
          }

          if (specifiedCols) {
            self.settings.columns[i].field = colName;
          }

        });

        dataset.push(newRow);
      });

      return dataset;
    },

    // Add a Row
    addRow: function (data, location) {
      var self = this,
        isTop = false,
        row = 0,
        cell = 0,
        args,
        rowNode;

      if (!location || location === 'top') {
        location = 'top';
        isTop = true;
      }

      // Add to array
      self.settings.dataset[isTop ? 'unshift' : 'push'](data);

      // Add to ui
      self.renderRows();

      // Sync with others
      self.syncSelectedUI();
      self.updateSelected();

      // Set active and fire handler
      setTimeout(function () {
        row = isTop ? row : self.settings.dataset.length - 1;
        self.setActiveCell(row, cell);

        rowNode = self.tableBody.find('tr').eq(row);
        args = {row: row, cell: cell, target: rowNode, value: data, oldValue: []};
        self.element.triggerHandler('addrow', args);
      }, 10);
    },

    initFixedHeader: function () {
      var self = this;

      if (self.element.hasClass('datagrid-contained')) {
        this.fixHeader();
        this.syncFixedHeader();
      }

    },

    //Fixed Header
    fixHeader: function () {
      var self = this;

      //Already Wrapped
      if (this.wrapper.prev().is('.datagrid-clone')) {
        return;
      }

      //Clone and create a table with one row and the table headers in front
      //make this not readable to screen readers
      this.clone = $('<table class="datagrid datagrid-clone" role="presentation" aria-hidden="true"></table>').append(this.headerRow.clone()).append('<tbody></tbody>');
      this.clone.insertBefore(this.element.closest('.datagrid-wrapper'));
      this.clone.wrap('<div class="datagrid-scrollable-header"></div>');

      this.fixedHeader = true;
      // this.syncFixedHeader();

      this.headerRow.addClass('audible');

      var next = this.wrapper.parent().next(),
        prev = this.wrapper.parent().prev(),
        diff = (next.length ===0 ? 0 : next.outerHeight()) + (prev.length ===0 ? 0 : prev.outerHeight()),
        outerHeight = 'calc(100% - '+diff+ 'px)';

      var container = this.wrapper.parent('.contained'),
        isInline = container.prop('style') && container.prop('style')[$.camelCase('height')];

      //Container has a fixed height
      if (isInline) {
        outerHeight = container.css('height');
      } else {
        container.css('height', outerHeight);
      }
      this.wrapper.find('.datagrid-container').css({'height': '100%', 'overflow': 'auto'});

      //Next if exist and the pager toolbar height
      var innerHeight = (this.settings.paging ? (next.length === 0 ? 80 : 48) : 0);
      innerHeight += (next.length === 0 ? 0 : parseInt(next.outerHeight()));

      if (this.wrapper.parent().is('.pane')) {
        innerHeight = 146;
      }

      if (isInline) {
        innerHeight = 18; //header and toolbar - TODO add check
      }

      this.wrapper.css('height', 'calc(100% - '+ (innerHeight)+ 'px)');

      this.container.on('scroll.datagrid', function () {
        self.clone.parent().scrollLeft($(this).scrollLeft());
      });

      this.handleEvents();
    },

    //Revert Fixed Header
    unFixHeader: function () {
      this.fixedHeader = false;

      if (this.wrapper.prev().is('.datagrid-scrollable-header')) {
        this.wrapper.prev().remove();
        this.headerRow.removeClass('audible');
        this.wrapper.css({'height': '', 'overflow': ''});
        this.wrapper.find('.datagrid-container').css({'height': '', 'overflow': ''});
        this.container.off('scroll.datagrid');
      }
    },

    syncFixedHeader: function () {
      if (!this.fixedHeader) {
        return;
      }

      var self = this;
      self.headerRow.find('th').each(function (index) {
        var div = self.table.closest('.datagrid-container').get(0),
          scrollbarWidth = div.offsetWidth - div.clientWidth,
          th = $(this),
          w = th.width();

        w += th.is(':last-child') ? scrollbarWidth : 0;

        th.width(w);
        self.clone.find('th').eq(index).width(w);
      });

      self.clone.width(self.table.width());
    },

    //Delete a Specific Row
    removeRow: function (row, nosync) {
      var rowNode = this.tableBody.find('tr').eq(row),
        rowData = this.settings.dataset[row];

      this.unselectRow(row, nosync);

      this.settings.dataset.splice(row, 1);
      this.renderRows();
      this.element.trigger('rowremove', {row: row, cell: null, target: rowNode, value: [], oldValue: rowData});

    },

    //Remove all selected rows
    removeSelected: function () {
      var self = this,
        selectedRows = this.selectedRows();

      for (var i = selectedRows.length-1; i >= 0; i--) {
        self.removeRow(selectedRows[i].idx, true);
        this.updateSelected();
      }
      this.syncSelectedUI();
    },

    //Method to Reload the data set
    //TODO: Load specific page
    loadData: function (dataset, pagerInfo) {
      var self = this;

      var oldRows = (this.selectedRows() ? this.selectedRows().slice() : []);
      this.settings.dataset = dataset;
      this.renderRows();

      if (!pagerInfo) {
        pagerInfo = {};
      }

      if (!pagerInfo.activePage) {
        pagerInfo.activePage = 1;
        pagerInfo.pagesize = this.settings.pagesize;
        pagerInfo.total = -1;
        pagerInfo.type = 'initial';
      }

      //Update Paging and Clear Rows
      this.renderPager(pagerInfo);
      this.selectedRows([]);

      if (pagerInfo && pagerInfo.preserveSelected) {
        for (var i = 0; i < oldRows.length; i++) {
          self.selectRow(oldRows[i].idx, true);
        }
      }

      this.syncSelectedUI();
    },

    uniqueID: function (gridCount, suffix) {
      return 'datagrid-' + gridCount + suffix;
    },

    visibleColumns: function () {
      var visible = [];
      for (var j = 0; j < this.settings.columns.length; j++) {
        var column = settings.columns[j];

        if (column.hidden) {
          continue;
        }

        visible.push(column);
      }
      return visible;
    },

    getColumnGroup: function(idx) {
      var total = 0,
        colGroups = this.settings.columnGroups;

      for (var l = 0; l < colGroups.length; l++) {
        total += colGroups[l].colspan;

        if (total >= idx) {
          return this.uniqueID(this.gridCount, '-header-group-' + l);
        }
      }
    },

    //Render the Header
    renderHeader: function() {
      var self = this,
        headerRow = '<thead>';

      var colGroups = this.settings.columnGroups;

      if (colGroups) {

        var total = 0,
          uniqueID;

        headerRow += '<tr role="row" class="datagrid-header-groups">';

        for (var k = 0; k < colGroups.length; k++) {
          total += parseInt(colGroups[k].colspan);
          uniqueID = self.uniqueID(self.gridCount, '-header-group-' + k);

          headerRow += '<th colspan="' + colGroups[k].colspan + '" id="' + uniqueID + '"' + '><div class="datagrid-column-wrapper "><span class="datagrid-header-text">'+ colGroups[k].name +'</span></div></th>';
        }

        if (total < this.visibleColumns().length) {
          headerRow += '<th colspan="' + (this.visibleColumns().length - total) + '"></th>';
        }
        headerRow += '</tr><tr>';
      } else {
        headerRow += '<tr role="row">';
      }

      for (var j = 0; j < this.settings.columns.length; j++) {
        var column = settings.columns[j],
          uniqueId = self.uniqueID(self.gridCount, '-header-' + j),
          isSortable = (column.sortable === undefined ? true : column.sortable),
          isResizable = (column.resizable === undefined ? true : column.resizable),
          isSelection = column.id === 'selectionCheckbox',
          alignmentClass = (column.align === undefined ? false : ' l-'+ column.align +'-text');

        if (column.hidden) {
          continue;
        }

        headerRow += '<th scope="col" role="columnheader" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') + '"' +
         ' id="' + uniqueId + '" data-column-id="'+ column.id + '" data-field="'+ column.field +'"' +
         (column.headerTooltip ? 'title="' + column.headerTooltip + '"' : '') +
         (colGroups ? ' headers="' + self.getColumnGroup(j) + '"' : '') +
         (column.width ? ' style="width:'+ (typeof column.width ==='number' ? column.width+'px': column.width) +'"' : '') + '>';
         headerRow += '<div class="' + (isSelection ? 'datagrid-checkbox-wrapper ': 'datagrid-column-wrapper ') + (alignmentClass ? alignmentClass : '') +'"><span class="datagrid-header-text">' + (settings.columns[j].name ? settings.columns[j].name : '') + '</span>';

        if (isSelection) {
          headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox"></span>';
        }
        if (isSortable) {
          headerRow += '<div class="sort-indicator"><span class="sort-asc"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg></span><span class="sort-desc"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg></div>';
        }

        headerRow += '</div></th>';
      }
      headerRow += '</tr></thead>';

      self.headerRow = $(headerRow);
      self.table.append(self.headerRow);
      self.table.find('th[title]').tooltip();
      self.setColumnWidths();

      //TODO: Drag Drop Columns Option
      /*self.headerNodes().drag({clone: true, containment: 'parent'}).on('dragstart', function (e, pos, clone) {
        clone.css({'position': 'absolute', top: '30px', 'background-color': '#5c5c5c', 'height': '48px'});
      });*/

      if (self.settings.columnsReorder) {
        self.createDraggableColumns();
      }
    },
//-------------------------------------------------
    // Create draggable columns
    createDraggableColumns: function () {
      var self = this,
        headers = self.headerNodes();

      headers.prepend('<span class="is-draggable-target"></span><span class="handle">&#8286;</span>');
      self.element.addClass('is-draggable-columns');

      // Initialize Drag api
      $('.handle', headers).each(function() {
        var handle = $(this),
          hader = handle.parent();

        handle.on('mousedown.datagrid', function(e) {
          e.preventDefault();

          hader.drag({clone: true, cloneAppentTo: headers.first().parent()})

            // Drag start =======================================
            .on('dragstart.datagrid', function (e, pos, clone) {
              var index;

              clone.removeAttr('id').addClass('is-dragging-clone').css({left: pos.left, top: pos.top});
              $('.is-draggable-target', clone).remove();

              self.setdraggableColumnsTargets();
              index = self.getColumnIndex(pos);
              self.draggableStatus.startIndex = index;
            })

            // While dragging ===================================
            .on('drag.datagrid', function (e, pos) {
              var i, l, target,
                index = self.getColumnIndex(pos);

              if (index !== -1) {
                for (i=0, l=self.draggableColumnsTargets.length; i<l; i++) {
                  target = self.draggableColumnsTargets[i];
                  target.el[(target.index === index && target.index !== self.draggableStatus.startIndex) ?
                    'addClass' : 'removeClass']('is-over');
                }
              }
              else {
                $('.is-draggable-target', headers).removeClass('is-over');
              }

            })

            // Drag end =========================================
            .on('dragend.datagrid', function (e, pos) {
              var index = self.getColumnIndex(pos),
               dragApi = hader.data('drag'),
               tempArray = [],
               i, l, indexFrom, indexTo;

              // Unbind drag from header
              if (dragApi && dragApi.destroy) {
                dragApi.destroy();
              }

              self.draggableStatus.endIndex = index;
              $('.is-draggable-target', headers).removeClass('is-over');

              if (self.draggableStatus.endIndex !== -1) {
                if (self.draggableStatus.startIndex !== self.draggableStatus.endIndex) {
                  // =========================
                  // BEGIN: Swap columns here
                  // =========================
                  // console.log(self.draggableStatus);

                  for (i=0, l=self.settings.columns.length; i < l; i++) {
                    if (!('hidden' in self.settings.columns[i])) {
                      tempArray.push(i);
                    }
                  }
                  // console.log(tempArray);
                  indexFrom = tempArray[self.draggableStatus.startIndex] || 0;
                  indexTo = tempArray[self.draggableStatus.endIndex] || 0;

                  self.arrayIndexMove(self.settings.columns, indexFrom, indexTo);
                  // console.log(self.settings.columns);
                  // =======================
                  // END: Swap columns here
                  // =======================
                }
                else {
                  // No need to swap here since same target area, where drag started
                  // console.log('Dropped in same target area, where drag started');
                }
              }
              else {
                // console.log('Did not droped in target area');
              }

            });
        });
      });
    },

    // Set draggable columns target
    setdraggableColumnsTargets: function () {
      var self = this,
        headers = self.headerNodes(),
        target, pos, extra;

      self.draggableColumnsTargets = [];
      self.draggableStatus = {};

      $('.is-draggable-target', headers).each(function (index) {
        target = headers.eq(index);
        pos = target.position();
        // Extra space around, if dropped item bit off from drop area
        extra = 20;

        self.draggableColumnsTargets.push({
          el: $(this),
          index: index,
          pos: pos,
          width: target.outerWidth(),
          height: target.outerHeight(),
          dropArea: {
            x1: pos.left - extra, x2: pos.left + target.outerWidth() + extra,
            y1: pos.top - extra, y2: pos.top + target.outerHeight() + extra
          }
        });
      });
    },

    // Get column index
    getColumnIndex: function (pos) {
      var self = this,
        index = -1,
        target, i, l;

      for (i=0, l=self.draggableColumnsTargets.length; i<l; i++) {
        target = self.draggableColumnsTargets[i];
        if (pos.left > target.dropArea.x1 && pos.left < target.dropArea.x2 &&
            pos.top > target.dropArea.y1 && pos.top < target.dropArea.y2) {
          index = target.index;
        }
      }
      return index;
    },

    // Move an array element position
    arrayIndexMove: function(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
    },
//-------------------------------------------------

    //Return Value from the Object handling dotted notation
    fieldValue: function (obj, field) {
      if (!field || !obj) {
        return '';
      }

      if (field.indexOf('.') > -1) {
        return field.split('.').reduce(function(o, x) {
          return (o ? o[x] : '');
        }, obj);
      }

      var rawValue = obj[field],
        value = (rawValue || rawValue === 0 ? rawValue : '');

      value = $.escapeHTML(value);
      return value;
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

      //Save the height during render
      self.tableHeight = self.tableBody.height();
      self.tableBody.css({'height': self.tableHeight, 'display': 'block'});

      //Save prev widths - to avoid glitch during sort refresh
      var cellWidths = [];
      self.tableBody.find('tr:first td').each(function (i) {
        cellWidths[i] = $(this).outerWidth();
      });

      self.tableBody.empty();

      for (var i = 0; i < self.settings.dataset.length; i++) {
        var isEven = (i % 2 === 0);

        rowHtml = '<tr role="row" aria-rowindex="' + (i+1) + '" class="datagrid-row'+
                  (self.settings.rowHeight !== 'normal' ? ' ' + self.settings.rowHeight + '-rowheight' : '') +
                  (self.settings.alternateRowShading && !isEven ? ' alt-shading' : '') +
                  (!self.settings.cellNavigation ? ' is-clickable' : '' ) +
                   '"' + '>';

        for (var j = 0; j < self.settings.columns.length; j++) {
          var col = self.settings.columns[j],
              cssClass = '',
              formatter = (col.formatter ? col.formatter : self.defaultFormatter),
              formatted = '';

          if (col.hidden) {
            continue;
          }

          if (typeof formatter ==='string') {
            formatted = window.Formatters[formatter](i, j, self.fieldValue(self.settings.dataset[i], self.settings.columns[j].field), self.settings.columns[j], self.settings.dataset[i], self).toString();
          } else {
            formatted = formatter(i, j, self.fieldValue(self.settings.dataset[i], self.settings.columns[j].field), self.settings.columns[j], self.settings.dataset[i], self).toString();
          }

          if (formatted.indexOf('<span class="is-readonly">') === 0) {
            col.readonly = true;
          }

          if (formatted.indexOf('datagrid-checkbox') > -1 ||
            formatted.indexOf('btn-actions') > -1) {
            cssClass += ' l-center-text';
          }

          if (formatted.indexOf('trigger') > -1) {
            cssClass += ' datagrid-trigger-cell';
          }

          if (col.align) {
            cssClass += ' l-'+ col.align +'-text';
          }

          // Add Column Css Classes

          //Add a readonly class if set on the column
          cssClass += (col.readonly ? ' is-readonly ' : '');

          //Run a function that helps check if editable
          if (col.isEditable && !col.readonly) {
            var canEdit = col.isEditable(i, j, self.fieldValue(self.settings.dataset[i], self.settings.columns[j].field), col, self.settings.dataset[i]);

            if (!canEdit) {
              cssClass += ' is-readonly ';
            }
          }

          cssClass += (col.cssClass ? col.cssClass : '');
          cssClass += (col.focusable ? ' is-focusable ' : '');
          var ariaReadonly = ((col.readonly || col.editor === undefined) ? 'aria-readonly="true"': '');

          rowHtml += '<td role="gridcell" ' + ariaReadonly + ' aria-colindex="' + (j+1) + '" '+
              ' aria-describedby="' + self.uniqueID(self.gridCount, '-header-' + j) + '"' +
             (cssClass ? ' class="' + cssClass + '"' : '') + 'data-idx="' + (j) + '"' +
             (col.tooltip ? ' title="' + col.tooltip + '"' : '') +
             //(cellWidths[i] ? ' style="width: '+cellWidths[i]+'px;" ' : '') +
             (self.settings.columnGroups ? 'headers = "' + self.uniqueID(self.gridCount, '-header-' + j) + ' ' + self.getColumnGroup(j) + '"' : '') +
             '><div class="datagrid-cell-wrapper">';

          if (col.contentVisible) {
            var canShow = col.contentVisible(i, j, self.settings.dataset[i], col);
            if (!canShow) {
              formatted = '';
            }
          }

          rowHtml += formatted + '</div></td>';
        }

        rowHtml += '</tr>';

        if (self.settings.rowTemplate) {
          var tmpl = self.settings.rowTemplate,
            item = self.settings.dataset[i],
            renderedTmpl = '';

          if (Tmpl && item) {
            var compiledTmpl = Tmpl.compile('{{#dataset}}'+tmpl+'{{/dataset}}');
            renderedTmpl = compiledTmpl.render({dataset: item});
          }

          rowHtml += '<tr class="datagrid-expandable-row"><td colspan="'+ this.visibleColumns().length +'">' +
            '<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding">'+ renderedTmpl + '</div></div>' +
            '</td></tr>';
        }

        tableHtml += rowHtml;
      }

      self.tableBody.append(tableHtml);
      self.tableBody.css({'height': '', 'display': ''});
      self.tableBody.find('td[title]').tooltip({placement: 'left', offset: {left: -5, top: 0}});
      self.tableBody.find('.dropdown').dropdown();

      //Set Tab Index and active Cell
      setTimeout(function () {
        self.displayCounts();
        self.activeCell = {node: self.cellNode(0, 0).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0};
      }, 100);
    },

    setColumnWidths: function () {
      var total = 0, self = this;

      for (var i = 0; i < self.settings.columns.length; i++) {
        var column = self.settings.columns[i],
          newWidth = 0;

        if (column.hidden) {
          continue;
        }

        if (column.width) {
          newWidth = column.width;
        } else {
          newWidth = self.headerNodes().eq(i).outerWidth();
        }

        total+= newWidth;
      }

      this.table.css('width', total);

    },

    //Returns all header nodes (not the groups)
    headerNodes: function () {
      return this.headerRow.find('tr:not(.datagrid-header-groups) th');
    },

    cloneHeaderNodes: function () {
      if (!this.clone) {
        return [];
      }

      return this.clone.find('thead').find('tr:not(.datagrid-header-groups) th');
    },

    firstRowNodes: function () {
      return this.tableBody.find('tr:first td');
    },

    //Refresh one row in the grid
    updateRow: function (idx, data) {
      var rowData = (data ? data : this.settings.dataset[idx]);

      for (var j = 0; j < this.settings.columns.length; j++) {
        var col = this.settings.columns[j];

        if (col.hidden) {
          continue;
        }

        if (col.id && ['selectionCheckbox', 'expander'].indexOf(col.id) > -1) {
          continue;
        }

        this.updateCellValue(idx, j, this.fieldValue(rowData, col.field));
      }

    },

    // Explicitly Set the Width of a column (reset: optional set "true" to reset table width)
    setColumnWidth: function(id, width, reset) {
      var self = this,
        total = 0,
        firstRows = self.firstRowNodes(),
        percent = parseFloat(width);

      if (!percent) {
        return;
      }

      if (reset) {
        self.table.css('width', self.element.width());
      }

      if (reset && self.fixedHeader) {
        self.clone.css('width', self.element.width());
      }

      if (typeof width !=='number') { //calculate percentage
        width = percent / 100 * self.element.width();
      }

      self.headerNodes().each(function () {
        var col = $(this);

        if (col.attr('data-column-id') === id) {
          col.css('width', width, firstRows);
          total += width;

        } else {
          total += col.outerWidth();
        }

      });

      var columnSettings = this.columnById(id);
      if (columnSettings[0] && columnSettings[0].width) {
        columnSettings[0].width = width;
      }

      if (self.fixedHeader) {
        self.headerNodes().each(function (i) {
          var w = $(this).outerWidth();
          self.cloneHeaderNodes().eq(i).css('width', w);
        });
      }

      self.table.css('width', total);

      if (self.fixedHeader) {
        self.clone.css('width', total);
      }

    },

    // Get child offset
    getChildOffset: function(obj) {
      var childPos = obj.offset(),
        parentPos = obj.parent().offset();
      return {
        top: childPos.top - parentPos.top,
        left: childPos.left - parentPos.left
      };
    },

    //Generate Resize Handles
    createResizeHandle: function() {
      var self = this;

      this.resizeHandle = $('<div class="resize-handle" aria-hidden="true"></div>');
      if (this.settings.columnGroups) {
        this.resizeHandle.css('height', '80px');
      }

      this.table.before(this.resizeHandle);

      this.resizeHandle.drag({axis: 'x', containment: 'parent'}).on('drag.datagrid', function (e, ui) {
        if (!self.currentHeader) {
          return;
        }

        var id = self.currentHeader.attr('data-column-id'),
          offset = (self.element.parent().css('position')!=='static') ?
            self.getChildOffset(self.currentHeader) :
            self.currentHeader.offset();

        self.dragging = true;
        self.setColumnWidth(id, ui.left - offset.left - 6 + self.element.scrollLeft());
        self.syncFixedHeader();
      })
      .on('dragend.datagrid', function () {
        self.dragging = false;
      });
    },

    //Show Summary and any other count info
    displayCounts: function(totals) {
      var self = this,
        count = self.tableBody.find('tr:visible').length;

      //Consitutues Client Side Paging
      if (self.settings.paging && self.settings.source === null) {
        count = self.settings.dataset.length;
      }

      if (totals && totals !== -1) {
        count = totals;
      }

      if (self.toolbar) {
        var countText = '(' + count + ' ' + Locale.translate('Results') + ')';

        if (self.settings.toolbar.selectCount) {
          //TODO: This on the Contextual Toolbar
          //countText += '<span class="datagrid-selected-count">  | '+ self._selectedRows.length + ' ' + Locale.translate('Selected') + ')</span>';
        }

        self.toolbar.find('.datagrid-result-count').html(countText);
        self.toolbar.attr('aria-label',  self.toolbar.find('.title').text());
        self.toolbar.find('.datagrid-row-count').text(count);
      }

      if (self.contextualToolbar) {
        self.contextualToolbar.find('.selection-count').text(self._selectedRows.length + ' ' + Locale.translate('Selected'));
      }
    },

    //Trigger event on parent and compose the args
    triggerRowEvent: function (eventName, e, stopPropagation) {
      var self = this,
          cell = $(e.target).closest('td').index(),
          row = $(e.target).closest('tr').index(),
          item = self.settings.dataset[row];

      if ($(e.target).is('a')) {
        stopPropagation = false;
      }

      if (stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }

      self.element.trigger(eventName, [{row: row, cell: cell, item: item, originalEvent: e}]);
      return false;
    },

    //Returns a cell node
    cellNode: function (row, cell) {
      var rowNode = this.tableBody.find('tr[role="row"]').eq(row);
      if (row instanceof jQuery) {
        rowNode = row;
      }

      if (cell === -1) {
        return $();
      }

      return rowNode.find('td[role="gridcell"]').eq(cell);
    },

    // Attach All relevant events
    handleEvents: function() {
      var self = this,
        isMultiple = this.settings.selectable === 'multiple';

      //Handle Sorting
      this.element.add(this.clone).off('touchcancel.datagrid touchend.datagrid').on('touchcancel.datagrid touchend.datagrid', 'th.is-sortable', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger('click.datagrid');
      }).off('click.datagrid').on('click.datagrid', 'th.is-sortable', function () {
        self.setSortColumn($(this).attr('data-column-id'));
      });

      //Handle Clicking Buttons and links in formatters
      this.table.off('mouseup.datagrid touchstart.datagrid').on('mouseup.datagrid touchstart.datagrid', 'td', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var elem = $(this).closest('td'),
          btn = $(this).find('button'),
          cell = elem.index(),
          rowNode = $(this).closest('tr'),
          row = rowNode.attr('aria-rowindex')-1,
          col = self.columnSettings(cell),
          item = self.settings.dataset[row];

        function handleClick() {
          if (e.type === 'mouseup' && e.button !== 0) {
            return;
          }

          // TODO: if (e.type === 'touchstart') {} ?
          col.click(e, [{row: row, cell: cell, item: item, originalEvent: e}]);
        }

        if (col.click && typeof col.click === 'function') {
          handleClick();
        }

        if (col.menuId) {
          btn.popupmenu({menuId: col.menuId, trigger: 'immediate'});
        }

        if (btn.is('.datagrid-expand-btn')) {
          self.expandRow(rowNode.index()+1);
        }

        return false;
      });

      var body = this.table.find('tbody');
      body.off('touchcancel.datagrid touchend.datagrid').on('touchcancel.datagrid touchend.datagrid', 'td', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger('click');
      }).off('click.datagrid').on('click.datagrid', 'td', function (e) {
        var target = $(e.target);

        if (target.closest('.datagrid-row-detail').length === 1) {
          return;
        }

        self.triggerRowEvent('click', e, true);
        self.setActiveCell(target.closest('td'));

        //Dont Expand rows or make cell editable when clicking expand button
        if (target.is('.datagrid-expand-btn') || (target.is('.datagrid-cell-wrapper') && target.find('.datagrid-expand-btn').length)) {
          return;
        }

        var canSelect = self.settings.clickToSelect ? true : $(target).is('.datagrid-selection-checkbox') || $(target).find('.datagrid-selection-checkbox').length ===1;

        if (canSelect && isMultiple && e.shiftKey) {
          self.selectRowsBetweenIndexes([self.lastSelectedRow, target.closest('tr').index()]);
          e.preventDefault();
        } else if (canSelect) {
          self.toggleRowSelection(target.closest('tr'));
        }

        self.makeCellEditable(self.activeCell.row, self.activeCell.cell, e);

      });

      body.off('dblclick.datagrid').on('dblclick.datagrid', 'tr', function (e) {
        self.triggerRowEvent('dblclick', e, true);
      });

      //Handle Context Menu Option
      body.off('contextmenu.datagrid').on('contextmenu.datagrid', 'tr', function (e) {
        self.triggerRowEvent('contextmenu', e, (self.settings.menuId ? true : false));
        e.preventDefault();

        if (self.settings.menuId) {
          $(e.currentTarget).popupmenu({menuId: self.settings.menuId, eventObj: e, trigger: 'immediate'});
        }

        return false;
      });

      // Move the drag handle to the end or start of the column
      this.headerRow
        .add((this.clone ? this.clone.find('thead') : []))
        .off('mousemove.datagrid touchstart.datagrid touchmove.datagrid')
        .on('mousemove.datagrid touchstart.datagrid touchmove.datagrid', 'th', function (e) {
          if (self.dragging) {
            return;
          }

          self.currentHeader = $(e.target).closest('th');

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          var isClone = self.currentHeader.closest('.datagrid-clone').length,
            headerDetail = self.currentHeader.closest('.header-detail'),
            extraMargin = headerDetail.length ? parseInt(headerDetail.css('margin-left'), 10) : 0,
            leftEdge = parseInt(self.currentHeader.position().left) - (extraMargin || 0),
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

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          self.resizeHandle.css('left', leftPos + 'px');
          self.resizeHandle.css('top', (isClone ? '-40px' : 'auto'));
        });

      // Handle Clicking Header Checkbox
      this
        .headerRow.offTouchClick().onTouchClick('datagrid', 'th .datagrid-checkbox')
        .off('click.datagrid')
        .on('click.datagrid', 'th .datagrid-checkbox', function () {
          var checkbox = $(this);

          if (!checkbox.hasClass('is-checked')) {
            checkbox.addClass('is-checked').attr('aria-checked', 'true');
            self.selectAllRows();
          } else {
            checkbox.removeClass('is-checked').attr('aria-checked', 'true');
            self.selectedRows([]);
          }
        });

      // Implement Editing Commit Functionality
      body.off('focusout.datagrid').on('focusout.datagrid', 'td input, td textarea', function () {
        //Popups are open
        if ($('#calendar-popup').is(':visible')) {
          return;
        }

        if (self.editor && self.editor.input) {
          self.commitCellEdit(self.editor.input);
        }

      });
    },

    appendToolbar: function () {
      var toolbar, title = '', more, self = this;

      if (!settings.toolbar) {
        return;
      }

      //Allow menu to be added manully
      if (this.element.parent().parent().find('.toolbar:not(.contextual-toolbar)').length === 1) {
        toolbar = this.element.parent().parent().find('.toolbar:not(.contextual-toolbar)');
      } else {
        toolbar = $('<div class="toolbar" role="toolbar"></div>');

        if (settings.toolbar.title) {
          title = $('<div class="title">' + settings.toolbar.title + '  </div>');
        }

        if (!title) {
          title = toolbar.find('.title');
        }
        toolbar.append(title);

        if (settings.toolbar.results) {
          //Actually value filled in displayResults
          title.append('<span class="datagrid-result-count"></span>');
        }

        var buttonSet = $('<div class="buttonset"></div>').appendTo(toolbar);

        if (settings.toolbar.keywordFilter) {
          buttonSet.append('<label class="audible" for="gridfilter">'+ Locale.translate('Keyword') +'</label><input class="searchfield" name="searchfield" placeholder="' + Locale.translate('Keyword') + '" id="gridfilter">');
        }

        if (settings.toolbar.dateFilter) {
          buttonSet.append('<button class="btn" type="button"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-calendar"></use></svg><span>' + Locale.translate('Date') + '</span></button>');
        }

        if (settings.toolbar.actions) {
          more = $('<div class="more"></div>').insertAfter(buttonSet);
          more.append('<button class="btn-actions"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-more"></use></svg><span class="audible">Grid Features</span></button>');
          toolbar.addClass('has-more-button');
        }

        var menu = $('<ul class="popupmenu has-icons"></ul>');

        if (settings.toolbar.personalize) {
          menu.append('<li><a href="#">' + Locale.translate('PersonalizeColumns') + '</a></li>');
        }

        if (settings.toolbar.advancedFilter) {
          menu.append('<li><a href="#">' + Locale.translate('AdvancedFilter') + '</a></li>');
        }

        if (settings.toolbar.views) {
          menu.append('<li><a href="#">' + Locale.translate('SaveCurrentView') + '</a></li> ' +
            '<li class="separator"></li> ' +
            '<li class="heading">' + Locale.translate('SavedViews') + '</li>' +
            '<li><a href="#">View One</a></li>');
        }

        if (settings.toolbar.rowHeight) {
          menu.append('<li class="separator"></li>' +
            '<li class="heading">' + Locale.translate('RowHeight') + '</li>' +
            '<li><a data-option="row-short">' + Locale.translate('Short') + '</a></li>' +
            '<li><a data-option="row-medium">' + Locale.translate('Medium') + '</a></li>' +
            '<li class="is-checked"><a data-option="row-normal">' + Locale.translate('Normal') + '</a></li>');
        }

        if (settings.toolbar.actions) {
          more.append(menu);
        }

        this.element.parent('.datagrid-wrapper').before(toolbar);
      }

      toolbar.find('.btn-actions').popupmenu().on('selected', function(e, args) {
        var action = args.attr('data-option');
        if (action === 'row-short' || action === 'row-medium' || action === 'row-normal') {
          self.rowHeight(action.substr(4));
        }

        args.closest('ul').find('[data-option]').parent('.is-checked').removeClass('is-checked');
        args.filter('[data-option]').parent().addClass('is-checked');
      });

      if (!toolbar.data('toolbar')) {
        var opts = $.fn.parseOptions(toolbar);
        toolbar.toolbar(opts);
      }

      toolbar.find('.searchfield').on('keypress.datagrid change.datagrid', function (e) {
        if (e.keyCode === 13 || e.type==='change') {
          self.keywordSearch($(this).val());
        }

      });

      this.toolbar = toolbar;
    },

    //Get or Set the Row Height
    rowHeight: function(height) {
      if (height) {
        settings.rowHeight = height;
      }

      //TODO: Save in Grid Personalization
      this.table.removeClass('short-rowheight medium-rowheight normal-rowheight')
        .addClass(settings.rowHeight + '-rowheight');

      return settings.rowHeight;
    },

    //Search a Term across all columns
    keywordSearch: function(term) {
      this.tableBody.find('tr').removeClass('is-filtered').show();
      this.filterExpr = [];

      this.tableBody.find('.search-mode').each(function () {
        var cell = $(this),
          text = cell.text();
        cell.text(text.replace('<i>','').replace('</i>',''));
      });

      if (!term || term.length === 0) {
        this.displayCounts();

        if (this.pager) {
          this.pager.setActivePage(1, true);
        }

        return;
      }

      term = term.toLowerCase();
      this.filterExpr.push({column: 'all', operator: 'contains', value: term, lowercase: 'no'});

      this.highlightSearchRows(term);
      this.displayCounts();

      if (this.pager) {
        this.pager.setActivePage(1, true);
      }
    },

    highlightSearchRows: function (term) {
      // Move across all visible cells and rows, highlighting
      this.tableBody.find('tr:visible').each(function () {
        var found = false,
          row = $(this);

          row.find('td').each(function () {
            var cell =  $(this),
              cellText = cell.text().toLowerCase();

            if (cellText.indexOf(term) > -1) {
              found = true;
              cell.find('*').each(function () {
                if (this.innerHTML === this.textContent) {
                  var contents = this.textContent,
                    node = $(this),
                    exp = new RegExp('(' + term + ')', 'i');

                  node.addClass('search-mode').html(contents.replace(exp, '<i>$1</i>'));
                }
              });
            }

          });

        // Hide non matching rows
        if (!found) {
          row.addClass('is-filtered').hide();
        }
      });
    },

    //Get or Set Selected Rows
    _selectedRows: [],

    selectAllRows: function () {
      var rows = [];

      for (var i = 0; i < this.settings.dataset.length; i++) {
        rows.push(i);
      }

      this.selectedRows(rows);
      this.syncSelectedUI();
    },

    //Toggle selection on a single row
    selectRow: function (idx) {
      var checkbox = null, row;

      if (idx === undefined || idx === -1 || !this.settings.selectable) {
        return;
      }

      row = this.tableBody.find('tr[role="row"]').eq(idx);
      if (!row) {
        return;
      }

      if (!row.hasClass('is-selected')) {
        checkbox = this.cellNode(row, this.columnIdxById('selectionCheckbox'));

        //Select It
        this._selectedRows.push({idx: idx, data: this.settings.dataset[idx], elem: row});
        this.lastSelectedRow = idx;// Rember index to use shift key

        row.addClass('is-selected').attr('aria-selected', 'true');
        row.find('td').attr('aria-selected', 'true');
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox').addClass('is-checked').attr('aria-checked', 'true');
      }
      this.syncSelectedUI();

    },

    // Select rows between indexes
    selectRowsBetweenIndexes: function(indexes) {
      indexes.sort(function(a, b) { return a-b; });
      for (var i = indexes[0]; i <= indexes[1]; i++) {
        this.selectRow(i);
      }
    },

    //Set ui elements based on selected rows
    syncSelectedUI: function () {
      var headerCheckbox = this.headerRow.find('.datagrid-checkbox');

      //Sync the header checkbox
      if (this._selectedRows.length > 0) {
        headerCheckbox.addClass('is-checked is-partial');
      }

      if (this._selectedRows.length === this.settings.dataset.length) {
        headerCheckbox.addClass('is-checked').removeClass('is-partial');
      }

      if (this._selectedRows.length === 0) {
        headerCheckbox.removeClass('is-checked').removeClass('is-partial');
      }

      //Open or Close the Contextual Toolbar.
      if (this.contextualToolbar.length !== 1) {
        return;
      }

      if (this._selectedRows.length === 0) {
        this.contextualToolbar.animateClosed();
      }

      if (this._selectedRows.length > 0) {
        this.contextualToolbar.css('display', 'block').animateOpen();
      }

    },

    toggleRowSelection: function (idx) {
      var row = (typeof idx === 'number' ? this.tableBody.find('tr[role="row"]').eq(idx) : idx),
        isSingle = this.settings.selectable === 'single',
        rowIndex = (typeof idx === 'number' ? idx : this.tableBody.find('tr[role="row"]').index(idx));

      if (this.settings.selectable === false) {
        return;
      }

      if (this.editor && row.hasClass('is-selected')) {
        return;
      }

      if (isSingle && this._selectedRows[0]) {
        this.unselectRow(this._selectedRows[0].idx);
        this._selectedRows = [];
      }

      if (row.hasClass('is-selected')) {
        this.unselectRow(rowIndex);
      } else {
        this.selectRow(rowIndex);
      }

      this.element.trigger('selected', [this._selectedRows]);
      this.displayCounts();

      return this._selectedRows;
    },

    unselectRow: function (idx, nosync) {
      var row = this.tableBody.find('tr[role="row"]').eq(idx),
        checkbox = null, selIdx;

      if (!row || idx === undefined) {
        return;
      }

      checkbox = this.cellNode(row, this.columnIdxById('selectionCheckbox'));

      selIdx = undefined;
      for (var i = 0; i < this._selectedRows.length; i++) {
        if (this._selectedRows[i].idx === idx) {
          selIdx = i;
        }
      }

      if (selIdx !== undefined) {
        this._selectedRows.splice(selIdx, 1);
      }

      row.removeClass('is-selected').removeAttr('aria-selected');
      row.find('td').removeAttr('aria-selected');

      checkbox.find('.datagrid-checkbox').removeClass('is-checked').attr('aria-checked', 'false');

      if (!nosync) {
        this.syncSelectedUI();
      }

    },

    //Set the selected rows by passing the row index or an array of row indexes
    selectedRows: function (row) {
      var idx = -1,
          isSingle = this.settings.selectable === 'single',
          isMultiple = this.settings.selectable === 'multiple';

      if (!row) {
        return this._selectedRows;
      }

      if (isSingle) {
        //Unselect
        if (this._selectedRows[0]) {
          this.unselectRow(this._selectedRows[0].idx);
        }

        //Select - may be passed array or int
        idx = ((Object.prototype.toString.call(row) === '[object Array]' ) ? row[0] : row.index());
        this.selectRow(idx);
      }

      if (isMultiple) {
        if (Object.prototype.toString.call(row) === '[object Array]' ) {
          for (var i = 0; i < row.length; i++) {
            this.selectRow(row[i]);
          }

          if (row.length === 0) {
            for (var j = 0; j < this.settings.dataset.length; j++) {
              this.unselectRow(j);
            }
            this._selectedRows = [];
          }

        } else {
          this.selectRow(row.index());
        }
      }

      this.element.trigger('selected', [this._selectedRows]);
      this.displayCounts();

      return this._selectedRows;
    },

    //Get the column object by id
    columnById: function(id) {
      return $.grep(this.settings.columns, function(e) { return e.id === id; });
    },

    //Get the column index from the col's id
    columnIdxById: function(id) {
      var cols = this.settings.columns,
        idx = -1;

      for (var i = 0; i < cols.length; i++) {
       if (cols[i].id === id) {
        idx = i;
       }
      }
      return idx;
    },

    // Current Active Cell
    activeCell: {node: null, cell: null, row: null},

    // Handle all keyboard behavior
    handleKeys: function () {
      var self = this,
        isMultiple = self.settings.selectable === 'multiple',
        checkbox = $('th .datagrid-checkbox', self.headerRow);

      // Handle header navigation
      self.table.on('keydown.datagrid', 'th', function (e) {
        var th = $(this),
          key = e.which,
          index = th.index(),
          length = $('th', this.header).length,
          triggerEl, move;

        // Enter or Space
        if (key === 13 || key === 32) {
          triggerEl = (isMultiple && index === 0) ? $('.datagrid-checkbox', th) : th;
          triggerEl.trigger('click.datagrid').focus();

          if (key === 32) { // Prevent scrolling with space
            e.preventDefault();
          }
        }

        //Press Home, End, Left and Right arrow to move to first, last, previous or next
        if (/35|36|37|39/i.test(key)) {
          index++;

          //Home, End or Ctrl/Meta + Left/Right arrow to move to the first or last
          if (/35|36/i.test(key) || ((e.ctrlKey || e.metaKey) && /37|39/i.test(key))) {
            if (Locale.isRTL()) {
              move = (key === 36 || ((e.ctrlKey || e.metaKey) && key === 37)) ? length : 1;
            } else {
              move = (key === 35 || ((e.ctrlKey || e.metaKey) && key === 39)) ? length : 1;
            }
          }

          // Left and Right arrow
          else {
            if (Locale.isRTL()) {
              move = key === 39 ? (index > 1 ? index-1 : length) : (index < length ? index+1 : 1);
            } else {
              move = key === 37 ? (index > 1 ? index-1 : length) : (index < length ? index+1 : 1);
            }
          }

          // Makeing move
          th.removeAttr('tabindex').removeClass('is-active');
          $('th:nth-child('+ move +')', this.header).attr('tabindex', '0').addClass('is-active').focus();

          e.preventDefault();
        }

        // Down arrow
        if (key === 40) {
          th.removeAttr('tabindex');
          self.setActiveCell(0, index);
        }

      });


      //Set clone's focus state
      self.table.on('focus.datagrid', 'th', function () {
        var th = $(this);

        if (self.fixedHeader) {
          self.clone.find('thead th').eq(th.index()).addClass('is-focused');
        }
      });

      self.table.on('blur.datagrid', 'th', function () {
        var th = $(this);

        if (self.fixedHeader) {
          self.clone.find('thead th').eq(th.index()).removeClass('is-focused');
        }
      });

      //Handle Editing / Keyboard
      self.table.on('keydown.datagrid', 'td, input', function (e) {
        var handled = false,
          key = e.which;

        //In edit mode tab leaves edit mode
        if (self.editor && key === 9) {
          self.commitCellEdit(self.editor.input);
          handled = true;
          var active = self.activeCell;
          self.setActiveCell(active.row, active.cell);
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Set Shift key held
        if(e.shiftKey) {
          self.shiftHeld = true;
        }

        // If multiSelect is enabled, press Control+A to toggle select all rows
        if (isMultiple && !self.editor && ((e.ctrlKey || e.metaKey) && key === 65)) {
          if (!checkbox.hasClass('is-checked') || checkbox.hasClass('is-partial')) {
            checkbox.removeClass('is-partial').addClass('is-checked').attr('aria-checked', 'true');
            self.selectAllRows();
          } else {
            checkbox.removeClass('is-checked').attr('aria-checked', 'true');
            self.selectedRows([]);
          }
          e.preventDefault();
        }

      });

      //Handle rest of the keyboard

      self.table.on('keydown.datagrid', 'td', function (e) {
        var key = e.which, row,
          handled = false;

        //Left and Right to navigate by cell.
        if (/37|39/i.test(key) && !e.altKey && !self.editor) {
          if ((key === 37 && !Locale.isRTL()) || (key === 39 && Locale.isRTL())) {
            self.setActiveCell(self.activeCell.row, self.activeCell.cell-1);
          } else {
            self.setActiveCell(self.activeCell.row, self.activeCell.cell+1);
          }
        }

        //Up and Down to navigate by row.
        if (key === 38 && !e.altKey && !self.editor) {
          if (self.activeCell.row === 0) {
            self.activeCell.node.removeAttr('tabindex');
            $('th:nth-child('+ (self.activeCell.cell+1) +')', this.header).attr('tabindex', '0').focus();
          }
          self.setActiveCell(self.activeCell.row-1, self.activeCell.cell);
          handled = true;
        }

        if (key === 40 && !e.altKey && !self.editor) {
          self.setActiveCell(self.activeCell.row+1, self.activeCell.cell);
          handled = true;
        }

        //Press Control+Home or Control+End to move to the first row on the first page or the last row on the last page.
        if (key === 38 && e.altKey && !self.editor) {
          self.setActiveCell(0, self.activeCell.cell);
        }

        if (key === 40 && e.altKey && !self.editor) {
          row = self.activeCell.node.closest('tbody').find('tr:last').index();
          self.setActiveCell(row, self.activeCell.cell);
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
          row = self.activeCell.node.closest('tr');
          self.setActiveCell(self.activeCell.row, row.find('td').last().index());
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
        if (key === 32 && !self.settings.editable) {
          row = self.activeCell.node.closest('tr');

          if ($(e.target).closest('.datagrid-row-detail').length === 1) {
            return;
          }

          // Toggle datagrid-expand with Space press
          var btn = $(e.target).find('.datagrid-expand-btn');
          if (btn && btn.length) {
            btn.trigger('mouseup.datagrid');
            e.preventDefault();
            return;
          }

          if (isMultiple && e.shiftKey) {
            self.selectRowsBetweenIndexes([self.lastSelectedRow, row.index()]);
          } else {
            self.toggleRowSelection(row);
          }

        }

        //For Editable mode - press Enter or Space to edit or toggle a cell, or click to activate using a mouse.
        if (self.settings.editable && key === 32) {
          if (!self.editor) {
            self.makeCellEditable(self.activeCell.row, self.activeCell.cell, e);
          }
        }

        if (self.settings.editable && key === 13) {
          //Allow shift to add a new line
          if ($(e.target).is('textarea') && e.shiftKey) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          if (self.editor) {
            self.commitCellEdit(self.editor.input);
            self.setActiveCell(self.activeCell.row, self.activeCell.cell);
          } else {
            self.makeCellEditable(self.activeCell.row, self.activeCell.cell, e);
          }
          return;
        }

        //A printable character navigatable
        if ([13, 32, 37, 38, 39, 9, 40].indexOf(key) === -1 && !e.ctrlKey && !e.metaKey && self.settings.editable) {
          if (!self.editor) {
            self.makeCellEditable(self.activeCell.row, self.activeCell.cell, e);
          }
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

      });
    },

    //Current Cell Editor thats in Use
    editor: null,

    // Invoked in three cases: 1) a row click, 2) keyboard and enter, 3) In actionable mode and tabbing
    makeCellEditable: function(row, cell, event) {
      if (!this.settings.editable) {
        return;
      }

      //Locate the Editor
      var col = this.columnSettings(cell);
      if (!col.editor) {
        if (event.keyCode === 32) {
          this.toggleRowSelection(this.activeCell.node.closest('tr'));
        }
        return;
      }
      // Put the Cell into Focus Mode
      this.setActiveCell(row, cell);

      var cellNode = this.activeCell.node.find('.datagrid-cell-wrapper'),
        cellParent = cellNode.parent('td'),
        cellValue = (cellNode.text() ? cellNode.text() : this.fieldValue(this.settings.dataset[row], col.field));

      //Check if cell is editable via hook function
      if (col.isEditable) {
        var canEdit = col.isEditable(row, cell, cellValue, col, this.settings.dataset[row]);

        if (!canEdit) {
          return false;
        }
      }

      if (cellParent.hasClass('is-editing')) {
        //Already in edit mode
        //Editor.focus
        cellNode.find('input').focus();
        return false;
      }

      //Editor.init
      cellParent.addClass('is-editing');
      cellNode.empty();
      this.editor = new col.editor(row, cell, cellValue, cellNode, col, event, this);

      if (this.editor.useValue) {
        cellValue = this.fieldValue(this.settings.dataset[row], col.field);
      }
      this.editor.val(cellValue);
      this.editor.focus();
    },

    commitCellEdit: function(input) {
      var newValue, cellNode;

      if (!this.editor) {
        return;
      }

      //Editor.getValue
      newValue = this.editor.val();
      newValue = $.escapeHTML(newValue);

      //Format Cell again
      cellNode = input.closest('td').removeClass('is-editing');

      //Editor.destroy
      this.editor.destroy();
      this.editor = null;

      //Save the Cell Edit back to the data set
      this.updateCellValue(cellNode.parent().index(), cellNode.index(), newValue);
    },

    //Returns Column Settings from a cell
    columnSettings: function (cell) {
      var cellNode = this.tableBody.find('tr').find('td').eq(cell),
        column = settings.columns[parseInt(cellNode.attr('data-idx'))];

      return column;
    },

    //Attempt to serialize the value back
    coerceValue: function (value, oldVal, col) {
      var newVal;

      if (col.serialize) {
        newVal = col.serialize(value);
        return newVal;
      }

      if (typeof oldVal === 'number') {
        newVal = parseFloat(value);
      }

      return newVal;
    },

    updateCellValue: function (row, cell, value) {
      var rowNode = this.tableBody.find('tr[role="row"]').eq(row),
        cellNode = rowNode.find('td').eq(cell),
        col = this.columnSettings(cell),
        formatted = '',
        formatter = (col.formatter ? col.formatter : this.defaultFormatter);

      var oldVal = (col.field ? this.settings.dataset[row][col.field] : ''),
        coercedVal = this.coerceValue(value, oldVal, col, row, cell);

      //coerced value may be coerced to empty string, null, or 0
      if (coercedVal === undefined) {
        coercedVal = value;
      }

      if (typeof formatter ==='string') {
        formatted = window.Formatters[formatter](row-1, cell, coercedVal, col, settings.dataset[row]).toString();
      } else {
        formatted = formatter(row-1, cell, coercedVal, col, settings.dataset[row]).toString();
      }

      cellNode.find('.datagrid-cell-wrapper').html(formatted);

      coercedVal = $.unescapeHTML(coercedVal);

      if (col.field && coercedVal !== oldVal) {
        if (col.field.indexOf('.') > -1 ) {
          var parts = col.field.split('.');
          if (parts.length === 2) {
            this.settings.dataset[row][parts[0]][parts[1]] = coercedVal;
          }

          if (parts.length === 3) {
            this.settings.dataset[row][parts[0]][parts[1]][parts[2]] = coercedVal;
          }

        } else {
          this.settings.dataset[row][col.field] = coercedVal;
        }
        this.element.trigger('cellchange', {row: row, cell: cell, target: cellNode, value: coercedVal, oldValue: oldVal, column: col});
      }
    },

    // Update a specific Cell
    setActiveCell: function (row, cell) {
      var self = this,
        prevCell = self.activeCell;

      //Support passing the td in
      if (row instanceof jQuery) {
        cell = row.index();
        row = row.parent().attr('aria-rowindex') -1;
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
      if (self.activeCell.node.hasClass('is-focusable')) {
        self.activeCell.node.find('button').focus();
      }

      var headers = self.headerNodes();
      headers.removeClass('is-active');
      headers.eq(cell).addClass('is-active');

      this.activeCell.isFocused = true;

      self.element.trigger('activecellchange', [{node: this.activeCell.node, row: this.activeCell.row, cell: this.activeCell.cell}]);
    },

    expandRow: function(row) {

      var self = this,
        expandRow = this.table.find('tr').eq(row+1),
        expandButton = this.table.find('tr').eq(row).find('.datagrid-expand-btn'),
        detail = expandRow.find('.datagrid-row-detail');

      // Get data item for this row
      var item = self.settings.dataset[row - (row + 1)/2];

      if (expandRow.hasClass('is-expanded')) {
        expandRow.removeClass('is-expanded');
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');

        detail.animateClosed().on('animateclosedcomplete', function () {
          expandRow.css('display', 'none');
          self.element.trigger('collapserow', [{grid: self, row: row, detail: detail, item: item}]);
        });

      } else {
        expandRow.addClass('is-expanded');
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');

        expandRow.css('display', 'table-row');

        //Optionally Contstrain the width
        expandRow.find('.constrained-width').css('max-width', this.element.outerWidth());

        detail.animateOpen();
        self.element.trigger('expandrow', [{grid: self, row: row, detail: detail, item: item}]);
      }
    },

    //Api Event to set the sort Column
    setSortColumn: function(id, ascending) {
      var sort;
      //Set Direction based on if passed in or toggling existing field
      if (ascending !== undefined) {
        this.sortColumn.sortAsc = ascending;
      } else {
        if (this.sortColumn.sortId === id) {
          this.sortColumn.sortAsc = !this.sortColumn.sortAsc;
        } else {
           this.sortColumn.sortAsc = true;
        }
        ascending = this.sortColumn.sortAsc;
      }

      this.sortColumn.sortId = id;
      this.sortColumn.sortField = (this.columnIdxById(id)[0] ? this.columnIdxById(id)[0].field : '');

      //Do Sort on Data Set
      this.setSortIndicator(id, ascending);
      sort = this.sortFunction(this.sortColumn.sortId, ascending);
      settings.dataset.sort(sort);

      var wasFocused = this.activeCell.isFocused;
      this.renderRows();
      //this.syncFixedHeader();

      // Update selected and Sync header checkbox
      this.updateSelected();
      this.syncSelectedUI();

      if (wasFocused && this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }

      this.syncFixedHeader();
      this.element.trigger('sorted', [this.sortColumn]);
    },

    setSortIndicator: function(id, ascending) {
      //Set Visual Indicator
      this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc').attr('aria-sort', 'none');
      this.headerRow.find('[data-column-id="' +id + '"]')
        .addClass(ascending ? 'is-sorted-asc' : 'is-sorted-desc')
        .attr('aria-sort', ascending ? 'ascending' : 'descending');

      if (this.fixedHeader && this.clone) {
        this.clone.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc').attr('aria-sort', 'none');
        this.clone.find('[data-column-id="' +id + '"]')
          .addClass(ascending ? 'is-sorted-asc' : 'is-sorted-desc')
          .attr('aria-sort', ascending ? 'ascending' : 'descending');
      }
    },

    //Overridable function to conduct sorting
    sortFunction: function(id, ascending) {
      var key,
      primer = function(a) {
        a = (a === undefined || a === null ? '' : a);
        if (typeof a === 'string') {
          a = a.toUpperCase();

          var isNumber = /^\d+$/.test(a);
          if (isNumber && !isNaN(parseFloat(a))) {
            a = parseFloat(a);
          }

        }
        return a;
      };

      key = function(x) { return primer(x[id]); };

      ascending = !ascending ? -1 : 1;

      return function (a, b) {
        return a = key(a), b = key(b), ascending * ((a > b) - (b > a));
      };
    },

    // Update Selection
    updateSelected: function() {
      var self = this;

      $('tr[role="row"]', self.tableBody).each(function() {
        var row = $(this),
          newIdx = row.index(),
          checkbox = self.cellNode(row, self.columnIdxById('selectionCheckbox'));

        $.each(self._selectedRows, function(index, val) {
          if (self.isEquals(val.data, self.settings.dataset[newIdx])) {
            val.idx = newIdx;
            val.elem = row;
            checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox').addClass('is-checked').attr('aria-checked', 'true');
            row.addClass('is-selected').attr('aria-selected', 'true').find('td').attr('aria-selected', 'true');
            return false;
          }
        });
      });
    },

    // Determine equality for two JavaScript objects
    isEquals: function(obj1, obj2) {
      function _equals(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify($.extend(true, {}, obj1, obj2));
      }
      return _equals(obj1, obj2) && _equals(obj2, obj1);
    },

    //Default formatter just plain text style
    defaultFormatter: function(row, cell, value) {
      return ((value === null || value === undefined) ? '' : value);
    },

    //Handle Adding Paging
    handlePaging: function () {
      var self = this;

      if (!this.settings.paging) {
        return;
      }

      var pagerElem = this.tableBody.addClass('paginated');
      pagerElem.pager({source: this.settings.source, pagesize: this.settings.pagesize, indeterminate: this.settings.indeterminate, rowTemplate: this.settings.rowTemplate, pagesizes: this.settings.pagesizes});
      this.pager = pagerElem.data('pager');

      pagerElem.on('afterpaging', function (e, args) {
       self.displayCounts(args.total);

       if (self.filterExpr) {
        self.highlightSearchRows(self.filterExpr[0].value);
       }

      });

      //Get First page on Sort Action
      this.element.on('sorted', function () {
        if (self.pager) {

          if (!self.pager.pagingInfo) {
            self.pager.pagingInfo = {};
          }

          self.pager.pagingInfo.type = 'sorted';
          self.pager.pagingInfo.activePage = 1;
          self.renderPager(self.pager.pagingInfo, 'sorted');
        }
      });
    },

    renderPager: function (pagingInfo) {
      if (this.pager) {
        if (pagingInfo) {
          this.pager.activePage = pagingInfo.activePage;
        }
        this.pager.elements = this.pager.element.children();
        this.pager.renderBar();

        this.pager.renderPages((pagingInfo.type === 'sorted' ? false : true), 'initial');

        if (pagingInfo) {
          this.pager.updatePagingInfo(pagingInfo);
        }
      }

      // Update selected and Sync header checkbox
      this.updateSelected();
      this.syncSelectedUI();
    }
  };

  // Initialize the plugin (Once) or set settings
  return this.each(function() {
    var instance = $.data(this, pluginName);
    if (instance) {
      instance.settings = $.extend({}, defaults, options);
    } else {
      instance = $.data(this, pluginName, new Datagrid(this, settings));
    }
  });

};

