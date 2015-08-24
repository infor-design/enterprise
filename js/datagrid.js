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

    if (!value) {
       return '';
    }

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
         '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">'+
         '<use xlink:href="#icon-drilldown"/></svg><span>'+ text +'</span>'+
         '</button>';
  },

  Checkbox: function (row, cell, value, col) {
    //treat 1, true or '1' as checked
    var isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
     (isChecked ? 'is-checked' : '') +'" aria-checked="'+isChecked+'"></span></div>';
  },

  SelectionCheckbox: function (row, cell, value, col) {
    var isChecked = (value==undefined ? false : value == true); // jshint ignore:line
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
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
  TextArea: function (row, cell, value) {
    var formatted = ((value === null || value === undefined) ? '' : value);
    return '<span class="datagrid-textarea">'+ formatted + '</span>';
  },

  // Expand / Collapse Button
  Expander: function (row, cell, value) {
    var button = '<button class="btn-icon datagrid-expand-btn" tabindex="-1">'+
      '<span class="icon plus-minus"></span>' +
      '<span class="audible">' + Locale.translate('ExpandCollapse') + '</span>' +
      '</button>' + '<span> ' + value + '</span>';

    return button;
  },

  // Badge / Tags and Visual Indictors
  ClassRange: function (row, cell, value, col) {
    var ranges = col.ranges,
      classes = '', text='';

    for (var i = 0; i < ranges.length; i++) {
      if (value >= ranges[i].min && value <= ranges[i].max) {
        classes = ranges[i].classes;
        text = (ranges[i].text ? ranges[i].text : classes.split(' ')[0]);
      }
    }

    return {'classes': classes, 'text': text};
  },

  // Badge (Visual Indictors)
  Badge: function (row, cell, value, col) {
    var ranges = Formatters.ClassRange(row, cell, value, col);

    return '<span class="' + ranges.classes +'">' + value +' <span class="audible">'+ ranges.text+ '</span></span>';
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

  // TODOs
  // Status Indicator - Error (Validation), Ok, Alert, New, Dirty (if submit)
  // Select (Drop Down)
  // Multi Select
  // Re Order - Drag Indicator
  // Sparkline
  // Lookup
  // Tree
  // Progress Indicator (n of 100%)
  // Process Indicator
  // Currency
  // Percent
  // File Upload (Simple)
  // Text Button (1 or 2)
  // Menu Button
  // Icon Button (Approved and SoHo Xi Standard)
  // Toggle Button (No)
  // Color Picker (Low)
};

window.Editors = {
  //Supports, Text, Numeric, Integer via mask
  Input: function(row, cell, value, container, column) {

    this.name = 'Text';
    this.orginalValue = value;

    this.init = function () {
      this.editor = $('<input type="text"/>').appendTo(container);

      if (column.align) {
        this.editor.addClass('l-'+ column.align +'-text');
      }

      if (column.mask) {
        this.editor.mask({pattern: column.mask});
      }
    };

    this.val = function (value) {
      if (value) {
        this.editor.val(value);
      }
      return this.editor.val();
    };

    this.focus = function () {
      this.editor.focus().select();
    };

    this.destroy = function () {
      this.editor.remove();
    };

    this.init();
  }
};

$.fn.datagrid = function(options) {

  // Settings and Options
  var pluginName = 'datagrid',
      defaults = {
        alternateRowShading: false, //Sets shading for readonly grids
        columns: [],
        dataset: [],
        editable: false,
        menuId: null,  //Id to the right click context menu
        rowHeight: 'medium', //(short, medium or tall)
        selectable: false, //false, 'single' or 'multiple'
        toolbar: false, // or features fx.. {title: 'Data Grid Header Title', results: true, keyword: true, filter: true, rowHeight: true, views: true}
        paging: false,
        pagesizes: [15, 25, 50, 75],
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

     this.settings = settings;
     this.initSettings();
     this.appendToolbar();
     this.render();
     this.createResizeHandle();
     this.handleEvents();
     this.handleKeys();
     this.handlePaging();
     this.initTableWidth();

     setTimeout(function () {
      self.element.trigger('rendered', [self.element, self.headerRow, self.pagerBar]);
     }, 0);
    },

    initSettings: function () {
      this.sortColumn = {sortField: null, sortAsc: true};
      this.gridCount = $('.datagrid').length + 1;
    },

    initTableWidth: function () {
      var th = $('th:first', this.header);
      if (th && th.length) {
        this.setColumnWidth(th.attr('data-column-id'), th.width());
      }
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

    //Method to Reload the data set
    loadData: function (dataset) {
      this.settings.dataset = dataset;
      this.renderRows();
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

    //Render the Header
    renderHeader: function() {
      var self = this,
        headerRow = '<thead>';

      var colGroups = this.settings.columnGroups;

      if (colGroups) {

        var total = 0;
        headerRow += '<tr class="datagrid-header-groups">';

        for (var k = 0; k < colGroups.length; k++) {
          total += parseInt(colGroups[k].colspan);
          headerRow += '<th colspan="' + colGroups[k].colspan + '"><div class="datagrid-column-wrapper "><span class="datagrid-header-text">'+ colGroups[k].name +'</span></div></th>';
        }

        if (total < this.visibleColumns().length) {
          headerRow += '<th colspan="' + (this.visibleColumns().length - total) + '"></th>';
        }
        headerRow += '</tr><tr>';
      } else {
        headerRow += '<tr>';
      }

      for (var j = 0; j < this.settings.columns.length; j++) {
        var column = settings.columns[j],
          uniqueId = self.uniqueID(self.gridCount, '-header-' + j),
          isSortable = (column.sortable === undefined ? true : column.sortable),
          isResizable = (column.resizable === undefined ? true : column.resizable),
          alignmentClass = (column.align === undefined ? false : ' l-'+ column.align +'-text');

        if (column.hidden) {
          continue;
        }

        if (j === settings.columns.length-1) {
          //Ignore width on last column
          column.width = undefined;
        }

        headerRow += '<th scope="col" role="columnheader" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') + '"' +
         ' id="' + uniqueId + '" data-column-id="'+ column.id + '" data-field="'+ column.field +'"' +
         (column.headerTooltip ? 'title="' + column.headerTooltip + '"' : '') +
         (column.width ? ' style="width:'+ (typeof column.width ==='number' ? column.width+'px': column.width) +'"' : '') + '>';
         headerRow += '<div class="datagrid-column-wrapper '+ (alignmentClass ? alignmentClass : '') +'"><span class="datagrid-header-text">' + settings.columns[j].name + '</span>';

        if (isSortable) {
          headerRow += '<div class="sort-indicator"><span class="sort-asc"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown-up"></svg></span><span class="sort-desc"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg></div>';
        }

        headerRow += '</div></th>';
      }
      headerRow += '</tr></thead>';

      self.headerRow = $(headerRow);
      self.table.append(self.headerRow);
      self.table.find('th[title]').tooltip();

      //TODO: Drag Drop Columns Option
      /*self.headerNodes().drag({clone: true, containment: 'parent'}).on('dragstart', function (e, pos, clone) {
        clone.css({'position': 'absolute', top: '30px', 'background-color': '#5c5c5c', 'height': '48px'});
      });*/

      this.setInitialColumnWidths();
    },

    //Return Value from the Object handling dotted notation
    fieldValue: function (obj, field) {
      if (!field) {
        return '';
      }

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
        var isEven = (i % 2 === 0);

        rowHtml = '<tr role="row" aria-rowindex="' + (i+1) + '" class="datagrid-row'+
                  (settings.rowHeight !== 'medium' ? ' ' + settings.rowHeight + '-rowheight"' : '') +
                  (settings.alternateRowShading && !isEven ? ' alt-shading' : '') +
                  '">';

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
            formatted.indexOf('btn-actions') > -1) {
            cssClass += ' l-center-text';
          }

          if (col.align) {
            cssClass += ' l-'+ col.align +'-text';
          }

          // Add Column Css Classes
          cssClass += (col.readonly ? 'is-readonly ' : '');
          cssClass += (col.cssClass ? col.cssClass : '');

          rowHtml += '<td role="gridcell" aria-colindex="' + (j+1) + '" '+
              ' aria-describedby="' + self.uniqueID(self.gridCount, '-header-' + j) + '"' +
             (cssClass ? ' class="' + cssClass + '"' : '') + 'data-idx="' + (j) + '"' +
             (col.tooltip ? ' title="' + col.tooltip + '"' : '') +
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

      self.tableBody.find('td[title]').tooltip({placement: 'left', offset: {left: -5, top: 0}});

      //Set Tab Index and active Cell
      setTimeout(function () {
        self.activeCell = {node: self.cellNode(0, 0).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0};
      }, 100);
    },

    setInitialColumnWidths: function () {
      var total = 0, self = this;

      for (var i = 0; i < settings.columns.length; i++) {
        var column = settings.columns[i],
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

    // Explicitly Set the Width of a column (reset: optional set "true" to reset table width)
    setColumnWidth: function(id, width, reset) {
      var self = this,
        total = 0,
        percent = parseFloat(width);

      if (!percent) {
        return;
      }
      if (reset) {
        self.table.css('width', self.element.width());
      }
      if (typeof width !=='number') { //calculate percentage
        width = percent / 100 * self.element.width();
      }

      self.headerNodes().each(function () {
        var col = $(this);

        if (col.attr('data-column-id') === id) {
          col.css('width', width);
          total += width;
        } else {
          total += col.outerWidth();
        }

      });

      self.table.css('width', total);
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

    //Show Summary and any other count info
    displayCounts: function() {
      var self = this;

      setTimeout(function () {
        var count = self.tableBody.find('tr:visible').length;  ///this.settings.dataset.length
        self.element.prev('.toolbar').find('.datagrid-result-count').text('(' + count + ' ' + Locale.translate('Results') + ')');
      }, 1);
    },

    //Trigger event on parent and compose the args
    triggerRowEvent: function (eventName, e, stopPropagation) {
      var self = this,
          cell = $(e.target).closest('td').index(),
          row = $(e.target).closest('tr').index(),
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
      var rowNode = this.tableBody.find('tr[role="row"]').eq(row);
      return rowNode.find('td[role="gridcell"]').eq(cell);
    },

    // Attach All relevant events
    handleEvents: function() {
      var self = this;

      //Handle Sorting
      this.element.on('touchcancel.datagrid touchend.datagrid', 'th.is-sortable', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger('click');
      }).on('click.datagrid', 'th.is-sortable', function () {
        self.setSortColumn($(this).attr('data-field'));
      });

      //Handle Clicking Buttons and links in formatters
      this.table.on('mouseup.datagrid touchstart.datagrid', 'td', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var elem = $(this).closest('td'),
          btn = $(this).find('button'),
          cell = elem.index(),
          row = $(this).closest('tr').index(),
          col = self.columnSettings(cell),
          item = self.settings.dataset[row];

        if (col.click && e.button ===0) {
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
        //self.makeCellEditable(self.activeCell.row, self.activeCell.cell);
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

      // Implement Editing Commit Functionality
      body.on('focusout.datagrid', 'td input', function () {
        self.commitCellEdit($(this));
      });

    },

    appendToolbar: function () {
      var toolbar, title = '', more, self = this;

      if (!settings.toolbar) {
        return;
      }

      //Allow menu to be added manully
      if (this.element.prev().is('.toolbar')) {
        toolbar = this.element.prev();
      } else {
        toolbar = $('<div class="toolbar" role="toolbar"></div>');

        if (settings.toolbar.title) {
          title = $('<div class="title">' + settings.toolbar.title + '  </div>');
        }

        if (settings.toolbar.results) {
          //Actually value filled in displayResults
          title.append('<span class="datagrid-result-count"></span>');
        }
        toolbar.append(title);

        var buttonSet = $('<div class="buttonset"></div>').appendTo(toolbar);
        if (settings.toolbar.dateFilter) {
          buttonSet.append('<button class="btn-icon has-text" type="button"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-calendar-date"></use></svg><span>' + Locale.translate('Date') + '</span></button>');
        }

        if (settings.toolbar.keywordFilter) {
          buttonSet.append('<label class="audible" for="gridfilter">'+ Locale.translate('Keyword') +'</label><input class="searchfield" name="searchfield" placeholder="' + Locale.translate('Keyword') + '" id="gridfilter">');
        }

        if (settings.toolbar.actions) {
          more = $('<div class="more"></div>').appendTo(buttonSet);
          more.append('<button class="btn-actions"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-more"></use></svg><span class="audible">Grid Features</span></button>');
          toolbar.addClass('has-more-button');
        }

        var menu = $('<ul class="popupmenu is-padded"></ul>');

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
            '<li class="is-checked"><a data-option="row-medium">' + Locale.translate('Medium') + '</a></li>' +
            '<li><a data-option="row-tall">' + Locale.translate('Tall') + '</a></li>');
        }

        if (settings.toolbar.actions) {
          more.append(menu);
        }

        this.element.before(toolbar);
      }

      toolbar.find('.btn-actions').popupmenu().on('selected', function(e, args) {
        var action = args.attr('data-option');
        if (action === 'row-short' || action === 'row-medium' || action === 'row-tall') {
          self.rowHeight(action.substr(4));
        }

        args.closest('ul').find('.is-checked').removeClass('is-checked');
        args.parent().addClass('is-checked');
      });

      toolbar.toolbar();
      toolbar.find('.searchfield').searchfield().on('keypress.datagrid', function (e) {
        if (e.keyCode === 13) {
          self.keywordSearch($(this).val());
        }
      });
    },

    //Get or Set the Row Height
    rowHeight: function(height) {
      if (height) {
        settings.rowHeight = height;
      }

      //TODO: Save in Grid Personalization
      this.tableBody.find('tr').removeClass('short-rowheight medium-rowheight tall-rowheight')
        .addClass(settings.rowHeight + '-rowheight');

      return settings.rowHeight;
    },

    //Search a Term across all columns
    keywordSearch: function(term) {
      this.tableBody.find('tr').show();
      this.tableBody.find('.search-mode').each(function () {
        var cell = $(this),
          text = cell.text();
        cell.text(text.replace('<i>','').replace('</i>',''));
      });

      if (!term || term.length === 0) {
        this.displayCounts();
        return;
      }

      term = term.toLowerCase();

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
          row.hide();
        }
      });

      this.displayCounts();
    },

    //Get or Set Selected Rows
    _selectedRows: [],

    selectedRows: function (row) {
      var idx = null, checkbox,
          isSingle = this.settings.selectable === 'single',
          isMultiple = this.settings.selectable === 'multiple';

      if (row && (isSingle || isMultiple)) {

        // Handle passing in an array (single select)
        if (Object.prototype.toString.call(row) === '[object Array]' ) {
          idx = row[0];
          row = this.tableBody.find('tr').eq(idx);
        } else {
          idx = row.index();
        }

        if (row.hasClass('is-selected')) {
          this._selectedRows = [];
          row.removeClass('is-selected').removeAttr('aria-selected');
          row.find('td').removeAttr('aria-selected');
          this.element.trigger('selected', [this._selectedRows]);

          if (!isSingle) {
            checkbox = this.cellNode(row.index(), this.columnIdx('selectionCheckbox'));
            checkbox.find('.datagrid-checkbox').removeClass('is-checked').attr('aria-checked', 'false');
          }
          return;
        }

        this._lastSelectedRow = idx;

        if (isSingle) {
          this._selectedRows = [];

          var selectedRows = row.closest('tbody').find('tr.is-selected');
          selectedRows.removeClass('is-selected').removeAttr('aria-selected');
          selectedRows.find('td').removeAttr('aria-selected');
        }

        this._selectedRows.push({idx: idx, data: settings.dataset[idx], elem: row});
        row.addClass('is-selected').attr('aria-selected', 'true');
        row.find('td').attr('aria-selected', 'true');

        if (!isSingle) {
          checkbox = this.cellNode(row.index(), this.columnIdx('selectionCheckbox'));
          checkbox.find('.datagrid-checkbox').addClass('is-checked').attr('aria-checked', 'true');
        }
      }

      this.element.trigger('selected', [this._selectedRows]);
      return this._selectedRows;
    },

    //Get the column object by id
    columnById: function(id) {
      return $.grep(this.settings.columns, function(e) { return e.id === id; });
    },

    //Get the column index
    columnIdx: function(id) {
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
      var self = this;

      self.table.on('keydown.datagrid', 'td', function (e) {
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
          self.setActiveCell(0, self.activeCell.cell);
        }
        if (key === 40 && e.altKey) {
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
        if (key === 32) {
          row = self.activeCell.node.closest('tr');
          self.selectedRows(row);

          // Toggle datagrid-expand with Space press
          var btn = $('.datagrid-expand-btn', row);
          if (btn && btn.length) {
            btn.trigger('mouseup.datagrid');
            e.preventDefault();
          }
        }

        //TODO: If multiSelect is enabled, press Control+A to select all rows on the current page.

        //For Editable mode - press Enter or Space to edit or toggle a cell, or click to activate using a mouse.
        if (self.settings.editable && (key === 32 || key ===13)) {
          self.makeCellEditable(self.activeCell.row, self.activeCell.cell);
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

      });
    },

    //Current Cell Editor thats in Use
    _editor: null,

    // Invoked in three cases: 1) a row click, 2) keyboard and enter, 3) In actionable mode and tabbing
    makeCellEditable: function(row, cell) {
      if (!this.settings.editable) {
        return;
      }

      //Locate the Editor
      var col = this.columnSettings(cell);
      if (!col.editor) {
        return;
      }

      //TODO: Check if cell is editable via hook function

      // Put the Cell into Edit Mode
      this.setActiveCell(row, cell);

      var cellNode = this.activeCell.node.find('.datagrid-cell-wrapper'),
        cellParent = cellNode.parent('td'),
        cellValue = cellNode.text();

      if (cellParent.hasClass('is-editing')) {
        //Already in edit mode
        //Editor.focus
        cellNode.find('input').focus();
        return false;
      }

      //Editor.init
      cellParent.addClass('is-editing');
      cellNode.empty();

      this._editor = new col.editor(row, cell, cellValue, cellNode, col);
      this._editor.val(cellValue);
      this._editor.focus();
    },

    commitCellEdit: function(input) {
      //Editor.getValue
      var newValue = this._editor.val();

      //Format Cell again
      var cellNode = input.closest('td').removeClass('is-editing');

      //Editor.destroy
      this._editor.destroy();

      //Save the Cell Edit back to the data set
      this.updateCellValue(cellNode.parent().index(), cellNode.index(), newValue);
    },

    //Returns Column Settings from a cell
    columnSettings: function (cell) {
      var cellNode = this.tableBody.find('tr').find('td').eq(cell),
        column = settings.columns[parseInt(cellNode.attr('data-idx'))];

      return column;
    },

    updateCellValue: function (row, cell, value) {
      var rowNode = this.tableBody.find('tr').eq(row),
        cellNode = rowNode.find('td').eq(cell),
        col = this.columnSettings(cell),
        formatter = (col.formatter ? col.formatter : this.defaultFormatter);

      var formatted = formatter(row-1, cell, value, col, settings.dataset[row]).toString();
      cellNode.find('.datagrid-cell-wrapper').html(formatted);

      this.element.trigger('cellchange', [row, cell, cellNode, value]);
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
      self.headerNodes().removeClass('is-active');
      self.headerNodes().eq(cell).addClass('is-active');

      this.activeCell.isFocused = true;
    },

    expandRow: function(row) {
      var expandRow = this.table.find('tr').eq(row+1),
        expandButton = this.table.find('tr').eq(row).find('.datagrid-expand-btn'),
        detail = expandRow.find('.datagrid-row-detail');

      if (expandRow.hasClass('is-expanded')) {
        expandRow.removeClass('is-expanded');
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');

        detail.animateClosed().on('animateClosedComplete', function () {
          expandRow.css('display', 'none');
        });

      } else {
        expandRow.addClass('is-expanded');
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');

        expandRow.css('display', 'table-row');
        detail.animateOpen();
      }
    },

    //Api Event to set the sort Column
    setSortColumn: function(field, ascending) {
      var sort;
      //Set Internal Variables
      this.sortColumn.sortAsc = (this.sortColumn.sortField === field ? !this.sortColumn.sortAsc : ascending ? true : false);
      this.sortColumn.sortField = field;

      //Do Sort on Data Set
      sort = this.sortFunction(this.sortColumn.sortField, !this.sortColumn.sortAsc);
      settings.dataset.sort(sort);

      //Set Visual Indicator
      this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc');
      this.headerRow.find('[data-field="' +field + '"]').addClass((this.sortColumn.sortAsc ? 'is-sorted-asc' : 'is-sorted-desc'));

      var wasFocused = this.activeCell.isFocused;
      this.renderRows();

      if (wasFocused && this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }

      this.element.trigger('sorted', [this.sortColumn]);
    },

    //Overridable function to conduct sorting
    sortFunction: function(field, reverse, primer) {
      var key;
      if (!primer) {
        primer = function(a) {
          a = (a === undefined || a === null ? '' : a);
          if (typeof a === 'string') {
            a = a.toUpperCase();

            if (!isNaN(parseFloat(a))) {
              a = parseFloat(a);
            }
          }
          return a;
        };
      }
      key = primer ? function(x) { return primer(x[field]); } : function(x) { return x[field]; };
      reverse = !reverse ? 1 : -1;
      return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      };
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

      this.tableBody.addClass('paginated').pager({source: this.settings.source, pagesize: this.settings.pagesize, pagesizes: this.settings.pagesizes});
      this.pager = this.tableBody.addClass('paginated').data('pager');

      //Get First page on Sort Action
      this.element.on('sorted', function () {
        self.pager.activePage = 1;
        self.pager.renderPages();
      });
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

