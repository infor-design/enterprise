
window.Formatters = {

  Text: function(row, cell, value) {
    var str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  },

  Ellipsis: function(row, cell, value, col) {
    var str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    col.textOverflow = 'ellipsis';
    return str;
  },

  Password: function(row, cell, value) {
    var str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str.replace(/./g, '*');
  },

  Readonly: function(row, cell, value) {
    return '<span class="is-readonly">' + ((value === null || value === undefined) ? '' : value) + '</span>';
  },

  Date: function(row, cell, value, col, isReturnValue) {
    var formatted = ((value === null || value === undefined) ? '' : value),
      value2;

    if (typeof value === 'string' && value) {

      if (value === '0000' || value === '000000' || value === '00000000') { //Means no date in some applications
        return '';
      }

      if (!col.sourceFormat) {
        value2 = Locale.parseDate(value, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
      } else {
        value2 = Locale.parseDate(value, (typeof col.sourceFormat === 'string' ? {pattern: col.sourceFormat}: col.sourceFormat));
      }

      if (value2) {
        formatted = Locale.formatDate(value2, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
      } else {
        formatted = Locale.formatDate(value, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));

        if (formatted === 'NaN/NaN/NaN') { //show invalid dates not NA/NA/NA
          formatted = value;
        }

      }
    } else if (value) {
      formatted = Locale.formatDate(value, (typeof col.dateFormat === 'string' ? {pattern: col.dateFormat}: col.dateFormat));
    }

    if (!col.editor || isReturnValue === true) {
      return formatted;
    }
    return '<span class="trigger">' + formatted + '</span>' + $.createIcon({ icon: 'calendar', classes: ['icon-calendar'] });
  },

  Time: function(row, cell, value, col) {
    var formatted = ((value === null || value === undefined) ? '' : value),
      localeDateFormat = ((typeof Locale === 'object' && Locale.calendar().dateFormat) ? Locale.calendar().dateFormat.short : null),
      localeTimeFormat = ((typeof Locale === 'object' && Locale.calendar().timeFormat) ? Locale.calendar().timeFormat : null),
      value2;

    var parseTime = function (timeString) {
      if (timeString === '') {
        return null;
      }
      var time = timeString.match(/(\d+)(?::(\d\d))(?::(\d\d))?\s*([pP]?)/i);
      if (time === null) {
        return null;
      }
      var d = new Date();
      d.setHours(parseInt(time[1]) + (time[4] ? 12 : 0));
      d.setMinutes(parseInt(time[2]) || 0);
      d.setSeconds(parseInt(time[3]) || 0);
      return d;
    };

    if (typeof value === 'string' && value) {
      value2 = Locale.formatDate(parseTime(value), { pattern: (localeDateFormat +' '+ (col.sourceFormat || col.timeFormat || localeTimeFormat)) });

      if (value2) {
        formatted = value2.slice(value2.indexOf(' '));
      }
    }

    // Remove extra space in begining
    formatted = formatted.replace(/^\s/, '');

    if (!col.editor) {
      return formatted;
    }
    return '<span class="trigger">' + formatted + '</span>' + $.createIcon({ icon: 'clock', classes: ['icon-clock'] });

  },

  Autocomplete: function(row, cell, value) {
    var formatted = ((value === null || value === undefined) ? '' : value);
    return formatted;
  },

  Lookup: function(row, cell, value, col, item) {
    var formatted = ((value === null || value === undefined) ? '' : value);

    if (!col.editor) {
      return formatted;
    }

    if (col.editorOptions && typeof col.editorOptions.field === 'function') {
      formatted = col.editorOptions.field(item, null, null);
    }

    return '<span class="trigger">' + formatted + '</span>' + $.createIcon({ icon: 'search-list', classes: ['icon-search-list'] });
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

  Hyperlink: function(row, cell, value, col, item) {
    var textValue,
      colHref = col.href || '#';

    //Support for dynamic links based on content
    if (col.href && typeof col.href === 'function') {
      colHref = col.href(row, cell, item, col);
      //Passing a null href will produce "just text" with no link
      if (colHref == null) {
        return col.text || value;
      }
    } else  {
      colHref = colHref.replace('{{value}}', value);
    }

    textValue = col.text || value;
    if (!textValue && !col.icon) {
      return '';
    }

    return col.icon ?
      ('<a href="'+ colHref +'" class="btn-icon row-btn '+ (col.cssClass || '') +'" tabindex="-1"' + (col.hyperlinkTooltip ? ' title="'+ col.hyperlinkTooltip + '"': '') + '>'+
          $.createIcon({ icon: col.icon, file: col.iconFile }) +
          '<span class="audible">'+ textValue +'</span>'+
        '</a>') :
      ('<a href="'+ colHref +'" tabindex="-1" role="presentation" class="hyperlink '+ (col.cssClass || '') + '"' + (col.target ? ' target="' + col.target + '"' : '') + (col.hyperlinkTooltip ? ' title="'+ col.hyperlinkTooltip + '"': '') + '>'+ textValue +'</a>');
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

    return (
      '<button type="button" tabindex="-1" class="btn-icon small datagrid-drilldown">' +
         $.createIcon({icon: 'drilldown'}) +
        '<span>' + text + '</span>' +
      '</button>'
    );
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
    return (
      '<button type="button" class="btn-actions" aria-haspopup="true" aria-expanded="false" aria-owns="'+ col.menuId +'">' +
        '<span class="audible">'+ col.title +'</span>' +
        $.createIcon({ icon: 'more' }) +
      '</button>'
    );
  },

  // Multi Line TextArea
  Textarea: function (row, cell, value) {
    var formatted = ((value === null || value === undefined) ? '' : value);
    return '<span class="datagrid-multiline-text">'+ formatted + '</span>';
  },

  // Expand / Collapse Button
  Expander: function (row, cell, value) {
    var button = '<button type="button" class="btn-icon datagrid-expand-btn" tabindex="-1">'+
      '<span class="icon plus-minus"></span>' +
      '<span class="audible">' + Locale.translate('ExpandCollapse') + '</span>' +
      '</button>' + ( value ? '<span> ' + value + '</span>' : '');

    return button;
  },

  // Datagrid Group Row
  GroupRow: function (row, cell, value, col, item, api) {
    var groupSettings = api.settings.groupable,
      groups = '',
      isOpen = groupSettings.expanded === undefined ? true : groupSettings.expanded;

    if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
      isOpen = groupSettings.expanded(row, cell, value, col, item, api);
    }

    for (var i = 0; i < groupSettings.fields.length ; i++) {
      groups += item[groupSettings.fields[i]] + (i === 0 ? '' : ',');
    }

    if (groupSettings.groupRowFormatter) {
      groups = groupSettings.groupRowFormatter(row, cell, value, col, item, api);
    }

    var button = '<button type="button" class="btn-icon datagrid-expand-btn'+ (isOpen ? ' is-expanded' : '') +'" tabindex="-1"' +'>'+
    '<span class="icon plus-minus'+ (isOpen ? ' active' : '') +'"></span>' +
    '<span class="audible">'+ Locale.translate('ExpandCollapse') +'</span>' +
    '</button>'+ '<span> '+ groups +'</span>';

    return button;
  },

  GroupFooterRow: function (row, cell, value, col, item, api) {
    var groupSettings = api.settings.groupable,
      isOpen = groupSettings.expanded === undefined ? true : groupSettings.expanded;

    if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
      isOpen = groupSettings.expanded(row, cell, value, col, item, api);
    }

    var idx = api.columnIdxById(groupSettings.aggregate),
        html = '<td role="gridcell" colspan=' + (idx) + '><div class="datagrid-cell-wrapper"></div></td><td role="gridcell"><div class="datagrid-cell-wrapper"> '+ item.sum +'</div></td>';

    if (groupSettings.groupFooterRowFormatter) {
      html = groupSettings.groupFooterRowFormatter(idx, row, cell, value, col, item, api);
    }

    return html;
  },

  SummaryRow: function (row, cell, value, col) {
    var afterText = '',
        beforeText = col.summaryText ||  '<b class="datagrid-summary-totals">' + Locale.translate('Total') + ' </b>';

    if (col.summaryTextPlacement === 'after') {
      afterText = beforeText;
      beforeText = '';
    }

    if (typeof Locale !== undefined && col.numberFormat) {
       value = Locale.formatNumber(value, (col.numberFormat ? col.numberFormat : null));
    }

    return (beforeText + ((value === null || value === undefined || value === '') ? '' : value.toString()) + afterText);
  },

  // Tree Expand / Collapse Button and Paddings
  Tree: function (row, cell, value, col, item, api) {
    var isOpen = item.expanded,
      depth = api.settings.treeDepth[row].depth,
      button = '<button type="button" class="btn-icon datagrid-expand-btn'+ (isOpen ? ' is-expanded' : '') +'" tabindex="-1"'+ (depth ? ' style="margin-left: '+ (depth ? (30* (depth -1)) +'px' : '') +'"' : '') +'>'+
      '<span class="icon plus-minus'+ (isOpen ? ' active' : '') +'"></span>' +
      '<span class="audible">'+ Locale.translate('ExpandCollapse') +'</span>' +
      '</button>'+ ( value ? '<span> '+ value +'</span>' : ''),
      node = '<span class="datagrid-tree-node"'+ (depth ? ' style="margin-left: '+ (depth ? (30* (depth-1)) +'px' : '') +'"' : '') +'> '+ value +'</span>';

    return (item[col.children ? col.children : 'children'] ? button : node);
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
    var icon = $.createIcon({
      icon: ranges.classes, classes: [
        'icon',
        'datagrid-alert-icon',
        'icon-' + ranges.classes
      ]
    });
    return icon + '<span class="datagrid-alert-text">' + (ranges.text === 'value' ? value : ranges.text) + '</span>';
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
    var text = col.text ? col.text : ((value === null || value === undefined || value === '') ? '' : value.toString()),
      markup ='<button type="button" class="'+ ( col.icon ? 'btn-icon': 'btn') + ' row-btn ' + (col.cssClass ? col.cssClass : '') + '" tabindex="-1">';

      if (col.icon) {
        markup += $.createIcon({ icon: col.icon, file: col.iconFile });
      }
      markup += '<span>' + text + '</span></button>';

    return markup;
  },

  Dropdown: function (row, cell, value, col) {
    var formattedValue = value, compareValue, i, option, optionValue;

    if (col.options && value !== undefined) {
      compareValue = col.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

      for (i = 0; i < col.options.length; i++) {
        option = col.options[i];
        optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;

        if (optionValue === compareValue) {
          formattedValue = option.label;
          break;
        }
      }
    }

    return '<span class="trigger">' + formattedValue + '</span>' + $.createIcon({ icon: 'dropdown' });
  },

  Favorite: function (row, cell, value, col) {
    var isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    }

    return !isChecked ? '' : '<span class="audible">'+ Locale.translate('Favorite') + '</span><span class="icon-favorite">' + $.createIcon({ icon: 'star-filled' }) + '</span>';
  },

  Status: function (row, cell, value, col, item) {

    if (!item.rowStatus) {
      return '<span></span>';
    }

    return $.createIcon({ icon: item.rowStatus.icon, classes: ['icon', 'icon-' + item.rowStatus.icon, 'datagrid-alert-icon'] }) + '<span class="audible">' + item.rowStatus.text + '</span>';
  },

  // Possible future Formatters
  // Percent
  // Image?
  // Multi Select
  // Re Order - Drag Indicator
  // Sparkline
  // Progress Indicator (n of 100%)
  // Process Indicator
  // Currency
  // File Upload (Simple)
  // Menu Button
  // Toggle Button (No)
  // Color Picker (Low)
};

window.Editors = {

  //Supports, Text, Numeric, Integer via mask
  Input: function(row, cell, value, container, column, e, api, item) {

    this.name = 'input';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input type="'+ (column.inputType ? column.inputType : 'text') +'"/>')
        .appendTo(container);

      if (column.align) {
        this.input.addClass('l-'+ column.align +'-text');
      }

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      if (column.mask && typeof column.mask === 'function') {
        var mask = column.mask(row, cell, value, column, item);
        this.input.mask({pattern: mask, mode: column.maskMode});
      } else if (column.mask) {
        this.input.mask({pattern: column.mask, mode: column.maskMode});
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
      var self = this;
      setTimeout(function() {
        self.input.remove();
      }, 0);
    };

    this.init();
  },

  Textarea: function(row, cell, value, container, column) {

    this.name = 'textarea';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<textarea class="textarea"></textarea>').appendTo(container);

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

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
      var self = this;
      setTimeout(function() {
        self.input.remove();
      }, 0);
    };

    this.init();
  },

  Checkbox: function(row, cell, value, container, column, event, grid) {

    this.name = 'checkbox';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input type="checkbox" class="checkboxn"/>').appendTo(container);
      this.input.after('<label class="checkbox-label"></label>');

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

      if (event.type === 'click' || (event.type === 'keydown' && event.keyCode === 32)) {
        //just toggle it
        isChecked = !isChecked;
        grid.setNextActiveCell(event);
      }

      this.input.prop('checked', isChecked);
    };

    this.focus = function () {
      this.input.trigger('focusout');
    };

    this.destroy = function () {
      var self = this;
      setTimeout(function() {
        self.input.next('.checkbox-label').remove();
        self.input.remove();
      }, 0);
    };

    this.init();
  },

  Dropdown: function(row, cell, value, container, column, event, grid, rowData) {

    this.name = 'dropdown';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value
    this.cell = grid.activeCell;

    this.init = function () {
      //Uses formatter
      this.input = $('<select class="dropdown"></select>').appendTo(container);
      this.select = this.input;

      if (column.options) {
        var html, opt, optionValue;
        value = grid.fieldValue(rowData,column.field);

        var compareValue = column.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

        for (var i = 0; i < column.options.length; i++) {
          html = $('<option></<option>');
          opt = column.options[i];
          optionValue = column.caseInsensitive && typeof opt.value === 'string' ? opt.value.toLowerCase() : opt.value;

          if (opt.selected || compareValue === optionValue) {
            html.attr('selected', 'true');
            this.originalValue = optionValue;
          }

          html.attr('value', opt.value).attr('id', opt.id).attr('data-type', typeof opt.value);
          html.text(opt.label);
          this.input.append(html);
        }
      }

      var editorOptions = column.editorOptions || {};

      function hasEditingClass() {
        return editorOptions.cssClass && /is-editing/g.test(editorOptions.cssClass);
      }
      // Add the class to both the options being passed, as well as the column's original options
      if (!hasEditingClass()) {
        editorOptions.cssClass = editorOptions.cssClass || '';
        editorOptions.cssClass += ' is-editing';
      }

      // Append the Dropdown's sourceArguments with some row/col meta-data
      editorOptions.sourceArguments = $.extend({}, editorOptions.sourceArguments, {
        column: column,
        container: container,
        grid: grid,
        cell: cell,
        event: event,
        row: row,
        rowData: rowData,
        value: value
      });

      this.input.dropdown(editorOptions);
    };

    this.val = function (value) {

      if (value !== undefined) {
        var compareValue = column.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;
        this.input.val(value);

        this.select.find('option').each(function () {
          var opt = $(this), valueAttr = opt.attr('value'), type = opt.attr('data-type');
          var optionValue = valueAttr;

          // Get option value in proper type before checking equality
          if (type === 'number') {
            optionValue = parseFloat(valueAttr);
          } else if (type === 'boolean') {
            optionValue = valueAttr === 'true';
          } else if (type === 'string' && column.caseInsensitive) {
            optionValue = valueAttr.toLowerCase();
          }

          if (optionValue === compareValue) {
            opt.attr('selected', 'true');
          }
        });
      }

      var selected = this.select.find(':selected'),
        val = selected.attr('value'), dataType = selected.attr('data-type');

      // For non-string option values (number, boolean, etc.), convert string attr value to proper type
      if (dataType === 'number') {
        val = parseFloat(val);
      } else if (dataType === 'boolean') {
        val = val === 'true';
      }

      if (val === undefined) {
        val = selected.text();
      }

      return val;
    };

    this.focus = function () {
      var self = this;

      //Check if isClick or cell touch and just open the list
      this.select.trigger('openlist');
      this.input.parent().find('div.dropdown').focus();

      this.input.on('listclosed', function (e, type) {
        grid.commitCellEdit(self.input);

        if (type === 'select') {
          container.parent('td').focus();
          return;
        }

        if (type === 'tab') {
          setTimeout(function () {
            container.parent('td').focus();
          }, 100);
        }
      });

    };

    this.destroy = function () {
      //We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  Date: function(row, cell, value, container, column, event, grid) {

    this.name = 'date';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="datepicker"/>').appendTo(container);
      this.input.datepicker(column.editorOptions || { dateFormat: column.dateFormat });
    };

    this.val = function (value) {
      if (value) {
        //Note that the value should be formatted from the formatter.
        this.input.val(value);
      }
      return window.Formatters.Date(row, cell, this.input.val(), column, true);
    };

    this.focus = function () {
      var self = this;

      this.input.select().focus();

      //Check if isClick or cell touch and just open the list
      if (event.type === 'click' && $(event.target).is('.icon')) {
        this.input.parent().find('.icon').trigger('click');
        this.input.closest('td').addClass('is-focused');
      }

      this.input.on('listclosed', function () {
        self.input.closest('td').removeClass('is-focused');

        setTimeout(function () {
          self.input.trigger('focusout');
          container.parent().focus();
          grid.setNextActiveCell(event);
        }, 1);

      });

    };

    this.destroy = function () {
      var self = this;
      setTimeout(function() {
        grid.quickEditMode = false;
        self.input.remove();
      }, 0);
    };

    this.init();

  },

  Time: function(row, cell, value, container, column, event, grid) {
    this.name = 'time';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="timepicker"/>').appendTo(container);
      this.api = this.input.timepicker(column.editorOptions || '').data('timepicker');
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
      if (event.type === 'click' && $(event.target).is('.icon')) {
        this.input.parent().find('.icon').trigger('click');
        this.input.closest('td').addClass('is-focused');
      }

      this.api.trigger.on('hide.editortime', function () {
        self.input.closest('td').removeClass('is-focused');

        setTimeout(function () {
          self.input.trigger('focusout');
          container.parent().focus();
          grid.setNextActiveCell(event);
        }, 1);

      });

    };

    this.destroy = function () {
      var self = this;
      if (self.api && self.api.trigger) {
        self.api.trigger.off('hide.editortime');
      }

      setTimeout(function() {
        grid.quickEditMode = false;
        self.input.remove();
      }, 0);
    };

    this.init();

  },

  Lookup: function(row, cell, value, container, column, event, grid) {
    this.name = 'lookup';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="lookup" data-init="false" />').appendTo(container);

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      this.input.lookup(column.editorOptions);
    };

    this.val = function (value) {
      var fieldValue = this.input.val();
      if (fieldValue && fieldValue.indexOf('|') > -1) {
        fieldValue = fieldValue.substr(0, fieldValue.indexOf('|'));
      }
      return value ? this.input.val(value) : fieldValue;
    };

    this.focus = function () {
      var self = this,
        api = self.input.data('lookup'),
        td = self.input.closest('td');

      // Using keyboard
      if (event.type === 'keydown') {
        self.input.select().focus();
        td.on('keydown.editorlookup', function (e) {
          if (e.keyCode === 40 && grid.quickEditMode) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      }

      //Check if isClick or cell touch and just open the list
      if (event.type === 'click') {
        if ($(event.target).is('svg')) {
          api.openDialog(event);
        } else {
          self.input.select().focus();
          td.on('touchcancel.editorlookup touchend.editorlookup', '.trigger', function() {
            api.openDialog();
          });
        }
      }

      // Update on change from lookup
      self.input.on('change', function () {
        setTimeout(function () {
          container.parent().focus();
          grid.setNextActiveCell(event);
          grid.quickEditMode = false;
        }, 1);
      });

    };

    this.destroy = function () {
      var self = this,
        td = this.input.closest('td');
      setTimeout(function() {
        grid.quickEditMode = false;
        td.off('keydown.editorlookup')
          .find('.trigger').off('touchcancel.editorlookup touchend.editorlookup');
        self.input.remove();
      }, 0);
    };

    this.init();
  },

  Autocomplete: function(ow, cell, value, container, column, event, grid) {
    this.name = 'autocomplete';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="autocomplete datagrid-autocomplete" data-autocomplete="source" />').appendTo(container);

      if (!column.editorOptions) {
        column.editorOptions = {};
      }
      column.editorOptions.width = container.parent().width();
      column.editorOptions.offset = {left: 0, top: 3};

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      this.input.autocomplete(column.editorOptions);
    };

    this.val = function (value) {
      return value ? this.input.val(value) : this.input.val();
    };

    this.focus = function () {
      grid.quickEditMode = true;
      this.input.select().focus();
    };

    this.destroy = function () {
      var self = this;
      setTimeout(function() {
        grid.quickEditMode = false;
        self.input.remove();
      }, 0);
    };

    this.init();
  }

};

window.GroupBy = (function() {

  //Can also use in isEquals: function(obj1, obj2)  in datagrid.js
  var equals = window.Soho.utils.equals;

  //See if the object has these proprties or not
  var has = function(obj, target) {
    return obj.some(function(value) {
        return equals(value, target);
    });
  };

  //Return just the object properties matching the names
  var pick = function(obj, names) {
    var chosen = {};
    for (var i = 0; i < names.length; i++) {
      chosen[names[i]] = obj[names[i]];
    }
    return chosen;
  };

  //Return the specific keys from the object
  var keys = function(data, names) {
    return data.reduce(function(memo, item) {
      var key = pick(item, names);

      if (!has(memo, key)) {
        memo.push(key);
      }
      return memo;
    }, []);
  };

  //Look through each value in the list and return an array of all the values
  //that contain all of the key-value pairs listed in properties.
  var where = function (data, names) {
    var chosen = [];

    data.map(function(item) {
      var match = true;
      for (var prop in names) {
        if (names[prop] !== item[prop]) {
          match = false;
          return;
        }
      }
      chosen.push(item);
      return;
    });

    return chosen;
  };

  //Grouping Function with Plugins/Aggregator
  var group = function(data, names) {
    var stems = keys(data, names);

    return stems.map(function(stem) {
      return {
        key: stem,
        values: where(data, stem).map(function(item) {
          return item;
        })
      };
    });
  };

  //Register an aggregator
  group.register = function(name, converter) {
    return group[name] = function(data, names, extra) { // jshint ignore:line
      var that = this;
      that.extra = extra;
      return group(data, names).map(converter, that);
    };
  };

  return group;
}());

//Register built in aggregators
GroupBy.register('sum', function(item) {
  var extra = this.extra;
  return $.extend({}, item.key, {values: item.values}, {sum: item.values.reduce(function(memo, node) {
      return memo + Number(node[extra]);
  }, 0)});
});

GroupBy.register('max', function(item) {
  var extra = this.extra;
  return $.extend({}, item.key, {values: item.values}, {max: item.values.reduce(function(memo, node) {
      return Math.max(memo, Number(node[extra]));
  }, Number.NEGATIVE_INFINITY)});
});

GroupBy.register('list', function(item) {
  var extra = this.extra;

  return $.extend({}, item.key, {values: item.values}, {list: item.values.map(function(item) {
    var list = [];

    for (var i = 0; i < extra.list.length; i++) {
      var exclude = extra.exclude ? item[extra.exclude] : false;
      if (item[extra.list[i]] && !exclude) {
        list.push({value: item[extra.list[i]], key: extra.list[i]});
      }
    }
    return list;
  })});
});

//Simple Summary Row Accumlator
window.Aggregators = {};
window.Aggregators.aggregate = function(items, columns) {
  var totals = {}, self = this;

  for (var i = 0; i < columns.length; i++) {
    if (columns[i].aggregator) {
      var field = columns[i].field;

      self.sum = function(sum, node) {
        return sum + Number(node[field]);
      };

      var total = items.reduce(self[columns[i].aggregator], 0);
      totals[field] = total;
    }
  }

  return totals;
};

$.fn.datagrid = function(options) {

  // Settings and Options
  var pluginName = 'datagrid',
      defaults = {
        // F2 - toggles actionableMode "true" and "false"
        // If actionableMode is "true”, tab and shift tab behave like left and right arrow key,
        // if the cell is editable it goes in and out of edit mode
        actionableMode: false,
        cellNavigation: true, // If cellNavigation is "false”, will show border around whole row on focus
        rowNavigation: true, // If rowNavigation is "false”, will NOT show border around the row
        alternateRowShading: false, //Sets shading for readonly grids
        columns: [],
        dataset: [],
        columnReorder: false, // Allow Column reorder
        saveColumns: true, //Save Column Reorder and resize
        editable: false,
        isList: false, // Makes a readonly "list"
        menuId: null,  //Id to the right click context menu
        uniqueId: null, //Unique ID for local storage reference and variable names
        rowHeight: 'normal', //(short, medium or normal)
        selectable: false, //false, 'single' or 'multiple'
        groupable: null, //Use Data grouping fx. {fields: ['incidentId'], supressRow: true, aggregator: 'list', aggregatorOptions: ['unitName1']}
        clickToSelect: true,
        toolbar: false, // or features fx.. {title: 'Data Grid Header Title', results: true, keywordFilter: true, filter: true, rowHeight: true, views: true}
        initializeToolbar: true, // can set to false if you will initialize the toolbar yourself
        //Paging Options
        paging: false,
        pagesize: 25,
        pagesizes: [10, 25, 50, 75],
        indeterminate: false, //removed ability to go to a specific page.
        source: null, //callback for paging
        //Filtering Options
        filterable: false,
        disableClientFilter: false, //Disable Filter Logic client side and let your server do it
        disableClientSort: false, //Disable Sort Logic client side and let your server do it
        resultsText: null,  // Can provide a custom function to adjust results text
        virtualized: false, // Prevent Un used rows from being added to the DOM
        virtualRowBuffer: 10 //how many extra rows top and bottom to allow as a buffer
      },
      settings = $.extend({}, defaults, options);

  /**
   * @constructor
   * @param {Object} element
   */
  function Datagrid(element) {
    this.element = $(element);
    Soho.logTimeStart(pluginName);
    this.init();
    Soho.logTimeEnd(pluginName);
  }

  // Actual Plugin Code
  Datagrid.prototype = {

    init: function() {
      var self = this;
      this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.isFirefoxMac = (navigator.platform.indexOf('Mac') !== -1 && navigator.userAgent.indexOf(') Gecko') !== -1);
      this.isIe = $('html').is('.ie');
      this.isIe9 = $('html').is('.ie9');
      this.isWindows = (navigator.userAgent.indexOf('Windows') !== -1);
      this.settings = settings;
      this.initSettings();
      this.originalColumns = this.settings.columns;

      this.appendToolbar();
      this.restoreColumns();
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.render();
      this.handlePaging();
      this.handleEvents();
      this.handleKeys();

      setTimeout(function () {
        self.element.trigger('rendered', [self.element, self.headerRow, self.pagerBar]);
      }, 0);
    },

    initSettings: function () {

      this.sortColumn = {sortField: null, sortAsc: true};
      this.gridCount = $('.datagrid').length + 1;
      this.lastSelectedRow = 0;// Remember index to use shift key

      this.contextualToolbar = this.element.prev('.contextual-toolbar');
      this.contextualToolbar.addClass('datagrid-contextual-toolbar');
    },

    //Initialize as a Table
    initFromTable: function () {
      if (this.settings.dataset === 'table') {
        this.element.remove();
      }
    },

    //Render the Header and Rows
    render: function () {
      var self = this;

      self.contentContainer = $('<div class="datagrid-body"></div>');

      if (this.settings.dataset === 'table') {
        self.table = $(this.element).addClass('datagrid');

        var wrapper = $(this.element).closest('.datagrid-container');
        if (wrapper.length === 0) {
          self.table.wrap('<div class="datagrid-container"></div>');
          this.element = self.table.closest('.datagrid-container');
        }

        self.settings.dataset = self.htmlToDataset();
        self.table.remove();
        self.table = $('<table></table>').addClass('datagrid').attr('role', 'grid').appendTo(self.contentContainer);

      } else {
        self.table = $('<table></table>').addClass('datagrid').attr('role', this.settings.treeGrid ? 'treegrid' : 'grid').appendTo(self.contentContainer);
        this.element.addClass('datagrid-container');
      }

      if (this.isWindows) {
        this.element.addClass('is-windows'); //need since scrollbars are visible
      }

      //initialize row height by a setting
      if (settings.rowHeight !== 'normal') {
        self.table.addClass(settings.rowHeight + '-rowheight');
        this.element.addClass(settings.rowHeight + '-rowheight');
      }

      //A treegrid is considered not editable unless otherwise specified.
      if (this.settings.treeGrid && !this.settings.editable) {
        self.table.attr('aria-readonly', 'true');
      }

      if (this.settings.isList) {
        $(this.element).addClass('is-gridlist');
      }

      self.table.empty();
      self.renderRows();
      self.element.append(self.contentContainer);

      self.renderHeader();
      self.container = self.element.closest('.datagrid-container');

      self.settings.buttonSelector = '.btn, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split';
      $(self.settings.buttonSelector, self.table).button();
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
      //Add row status
      data.rowStatus = {icon: 'new', text: 'New', tooltip: 'New'};

      // Add to array
      if (typeof location === 'string') {
        self.settings.dataset[isTop ? 'unshift' : 'push'](data);
      }
      else {
        self.settings.dataset.splice(location, 0, data);
      }

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

        self.pagerRefresh(location);
        self.element.triggerHandler('addrow', args);
      }, 10);
    },

    pagerRefresh: function (location) {
      if (this.pager) {
        var activePage = this.pager.activePage;
        if (typeof location === 'string') {
          activePage = location === 'top' ? 1 : this.pager._pageCount;
        }
        else if (typeof location === 'number') {
          activePage = Math.floor(location / this.pager.settings.pagesize + 1);
        }
        this.pager.pagingInfo = this.pager.pagingInfo || {};
        this.pager.pagingInfo.activePage = activePage;
        this.renderPager(this.pager.pagingInfo);
      }
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
      this.pagerRefresh();
      this.syncSelectedUI();
    },

    //Method to Reload the data set
    updateDataset: function (dataset, pagerInfo) {
      this.loadData(dataset, pagerInfo);
    },

    triggerSource: function(pagerType) {

      this.pager.pagerInfo = this.pager.pagerInfo || {};
      this.pager.pagerInfo.type = pagerType;

      if (pagerType !== 'refresh') {
        this.pager.pagerInfo.activePage = 1;
      }
      this.renderPager(this.pager.pagerInfo);
    },

    loadData: function (dataset, pagerInfo, isResponse) {
      this.settings.dataset = dataset;

      if (this.pager) {
        this.pager.settings.dataset = dataset;
      }

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
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.renderRows();
      this.renderPager(pagerInfo, isResponse);

      if (pagerInfo && pagerInfo.preserveSelected) {
        this.updateSelected();
        this.syncSelectedUI();
      } else {
        this.unSelectAllRows();
      }
    },

    uniqueId: function (suffix) {
      var uniqueid = this.settings.uniqueId ?
        this.settings.uniqueId + '-' + suffix :
        (window.location.pathname.split('/').pop()
          .replace(/\.xhtml|\.shtml|\.html|\.htm|\.aspx|\.asp|\.jspx|\.jsp|\.php/g, '')
          .replace(/\./g, '-') +'-'+
            (this.element.attr('id') || 'datagrid') +'-'+ this.gridCount + suffix);

      return uniqueid.replace(/--/g, '-');
    },

    visibleColumns: function (skipBuiltIn) {
      var visible = [];
      for (var j = 0; j < this.settings.columns.length; j++) {
        var column = settings.columns[j];

        if (column.hidden) {
          continue;
        }

        if (skipBuiltIn && column.id === 'selectionCheckbox') {
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
          return this.uniqueId('-header-group-' + l);
        }
      }
    },

    headerText: function (col) {
      var text = col.name ? col.name : '';

      if (!text && col.id === 'drilldown') {
        text = Locale.translate('Drilldown');
        return '<span class="audible">'+ text + '</span>';
      }

      return text;
    },

    //Render the Header
    renderHeader: function() {
      var self = this,
        headerRow = '',
        headerColGroup = '<colgroup>',
        cols= '',
        uniqueId;

      var colGroups = this.settings.columnGroups;

      if (colGroups) {

        var total = 0;

        headerRow += '<tr role="row" class="datagrid-header-groups">';

        for (var k = 0; k < colGroups.length; k++) {

          total += parseInt(colGroups[k].colspan);
          uniqueId = self.uniqueId('-header-group-' + k);

          headerRow += '<th colspan="' + colGroups[k].colspan + '" id="' + uniqueId + '"' + '><div class="datagrid-column-wrapper "><span class="datagrid-header-text">'+ colGroups[k].name +'</span></div></th>';
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
          id = self.uniqueId('-header-' + j),
          isSortable = (column.sortable === undefined ? true : column.sortable),
          isResizable = (column.resizable === undefined ? true : column.resizable),
          isSelection = column.id === 'selectionCheckbox',
          alignmentClass = (column.align === 'center' ? ' l-'+ column.align +'-text' : '');// Disable right align for now as this was acting wierd

        headerRow += '<th scope="col" role="columnheader" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') + (column.hidden ? ' is-hidden' : '') + (column.filterType ? ' is-filterable' : '') + (alignmentClass ? alignmentClass : '') + '"' +
         ' id="' + id + '" data-column-id="'+ column.id + '"' + (column.field ? ' data-field="'+ column.field +'"' : '') +
         (column.headerTooltip ? 'title="' + column.headerTooltip + '"' : '') +
         (colGroups ? ' headers="' + self.getColumnGroup(j) + '"' : '') + '>';

        headerRow += '<div class="' + (isSelection ? 'datagrid-checkbox-wrapper ': 'datagrid-column-wrapper') + (column.align === undefined ? '' : ' l-'+ column.align +'-text') + '"><span class="datagrid-header-text'+ (column.required ? ' required': '') + '">' + self.headerText(settings.columns[j]) + '</span>';
        cols += '<col' + this.calculateColumnWidth(column, j) + (column.hidden ? ' class="is-hidden"' : '') + '>';

        if (isSelection) {
          headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox"></span>';
        }

        if (isSortable) {
          headerRow += '<div class="sort-indicator">' +
            '<span class="sort-asc">' + $.createIcon({ icon: 'dropdown' }) + '</span>' +
            '<span class="sort-desc">' + $.createIcon({ icon: 'dropdown' }) + '</div>';
        }

        headerRow += '</div></th>';
      }
      headerRow += '</tr>';

      headerColGroup += cols + '</colgroup>';

      if (self.headerRow === undefined) {
        self.headerContainer = $('<div class="datagrid-header"><table role="grid" '+ this.headerTableWidth() + '></table></div>');
        self.headerTable = self.headerContainer.find('table');
        self.headerColGroup = $(headerColGroup).appendTo(self.headerTable);
        self.headerRow = $('<thead>' + headerRow + '</thead>').appendTo(self.headerContainer.find('table'));
        self.element.prepend(self.headerContainer);
      } else {
        self.headerRow.html(headerRow);
        self.headerColGroup.html(cols);
      }

      self.headerRow.find('th[title]').tooltip();

      if (self.settings.columnReorder) {
        self.createDraggableColumns();
      }

      this.renderFilterRow();

    },

    filterRowRendered: false,

    //Render the Filter Row
    renderFilterRow: function () {
      var self = this;

      if (!this.settings.filterable) {
        return;
      }

      this.element.addClass('has-filterable-columns');
      this.headerRow.find('.datagrid-filter-wrapper').remove();

      //Loop the columns looking at the filter types and generate the markup for the various Types
      //Supported Filter Types: text, integer, date, select, decimal, lookup, percent, checkbox, contents
      for (var j = 0; j < this.settings.columns.length; j++) {
        if (this.settings.columns[j].filterType) {
          var col = this.settings.columns[j],
            id = self.uniqueId('-header-' + j),
            header = this.headerRow.find('#'+id),
            filterId = self.uniqueId('-header-filter-' + j),
            filterMarkup = '<div class="datagrid-filter-wrapper">'+ this.renderFilterButton(col) +'<label class="audible" for="'+ filterId +'">' +
              col.name + '</label>';

          switch (col.filterType) {
            case 'checkbox':
              //just the button
              break;
            case 'date':
              filterMarkup += '<input ' + (col.filterDisabled ? ' disabled' : '') + ' type="text" class="datepicker" id="'+ filterId +'"/>';
              break;
            case 'decimal':
              filterMarkup += '<input ' + (col.filterDisabled ? ' disabled' : '') + ' type="text" id="'+ filterId +'" data-mask-mode="number" data-mask="'+ (col.mask ? col.mask : '####.00') + '">';
              break;
            case 'contents':
            case 'select':
              filterMarkup += '<select ' + (col.filterDisabled ? ' disabled' : '') + (col.filterType ==='select' ? ' class="dropdown"' : ' multiple class="multiselect"') + 'id="'+ filterId +'">';
              if (col.options) {
                if (col.filterType ==='select') {
                  filterMarkup += '<option></option>';
                }

                for (var i = 0; i < col.options.length; i++) {
                  var option = col.options[i],
                  optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;
                  filterMarkup += '<option value = "' +optionValue + '">' + option.label + '</option>';
                }
              }
              filterMarkup += '</select>';

              break;
            default:
              filterMarkup += '<input' + (col.filterDisabled ? ' disabled' : '') + ' type="text" id="'+ filterId +'"/>';
              break;
          }

          filterMarkup += '</div>';
          header.find('.datagrid-column-wrapper').after(filterMarkup);
          header.find('.datepicker').datepicker(col.editorOptions ? col.editoroptions : {dateFormat: col.dateFormat});
          header.find('.dropdown').dropdown(col.editorOptions);
          header.find('.multiselect').multiselect(col.editorOptions);
          header.find('[data-mask]').mask();
        }
      }

      //Attach Keyboard support
      var popupOpts = {attachToBody: $('html').hasClass('ios'), offset: {y: 15}, placementOpts: {strategies: ['flip', 'nudge']}};

      this.headerRow.addClass('is-filterable');
      this.headerRow.find('.btn-filter').popupmenu(popupOpts).on('selected.datagrid', function () {
        self.applyFilter();
      });

      var lastValue = '';

      this.headerRow.on('keydown.datagrid', '.datagrid-filter-wrapper input', function (e) {
        var input = $(this);
        e.stopPropagation();

        if (e.which === 13 && lastValue !== input.val()) {
          e.preventDefault();
          $(this).trigger('change');
          lastValue = input.val();
        }

      }).on('change.datagrid', '.datagrid-filter-wrapper input', function () {
        var input = $(this);
        if (lastValue !== input.val()) {
          self.applyFilter();
          lastValue = input.val();
        }
      });

      this.headerRow.find('.dropdown, .multiselect').on('selected.datagrid', function () {
        self.applyFilter();
      });

      self.filterRowRendered = true;
    },

    //Render one filter item as used in renderFilterButton
    renderFilterItem: function (icon, text, checked) {
      var iconMarkup = $.createIcon({ classes: 'icon icon-filter', icon: 'filter-' + icon });
      return '<li '+ (checked ? 'class="is-checked"' : '') +'><a href="#">'+ iconMarkup +'<span>'+ Locale.translate(text) +'</span></a></li>';
    },

    //Render the Filter Button and Menu based on filterType - which determines the options
    renderFilterButton: function (col) {
      var self = this,
        filterType = col.filterType,
        isDisabled = col.filterDisabled,
        filterConditions = $.isArray(col.filterConditions) ? col.filterConditions : [],
        inArray = function (s, array) {
          array = array || filterConditions;
          return ($.inArray(s, array) > -1);
        },
        render = function (icon, text, checked) {
          return filterConditions.length && !inArray(icon) ?
            '' : self.renderFilterItem(icon, text, checked);
        },
        btnMarkup = '<button type="button" class="btn-menu btn-filter" data-init="false" ' + (isDisabled ? ' disabled' : '') + ' type="button"><span class="audible">Filter</span>' + $.createIcon({icon: 'dropdown' , classes: 'icon-dropdown'}) +'</button>' +
        '<ul class="popupmenu has-icons is-translatable is-selectable">';

      //Just the dropdown
      if (filterType === 'contents' || filterType === 'select') {
        return '';
      }

      if (filterType === 'text') {
        btnMarkup += ''+
          render('contains', 'Contains', true) +
          render('does-not-contain', 'DoesNotContain', false);
      }

      if (filterType === 'checkbox') {
        btnMarkup += ''+
          render('selected-notselected', 'All', true) +
          render('selected', 'Selected') +
          render('not-selected', 'NotSelected');
      }

      if (filterType !== 'checkbox') {
        btnMarkup += ''+
          render('equals', 'Equals', (filterType === 'integer' || filterType === 'date')) +
          render('does-not-equal', 'DoesNotEqual') +
          render('is-empty', 'IsEmpty') +
          render('is-not-empty', 'IsNotEmpty');
      }

      if (filterType === 'integer' || filterType === 'date' || filterType === 'decimal') {
        btnMarkup += ''+
          render('less-than', 'LessThan') +
          render('less-equals', 'LessOrEquals') +
          render('greater-than', 'GreaterThan') +
          render('greater-equals', 'GreaterOrEquals');
      }

      if (filterType === 'text') {
        btnMarkup += ''+
          render('end-with', 'EndsWith') +
          render('does-not-end-with', 'DoesNotEndWith') +
          render('start-with', 'StartsWith') +
          render('does-not-start-with', 'DoesNotStartWith');
      }

      btnMarkup += '</ul>';
      return btnMarkup ;
    },

    toggleFilterRow: function () {

      if (this.settings.filterable) {
        this.headerRow.removeClass('is-filterable');
        this.headerRow.find('.is-filterable').removeClass('is-filterable');
        this.headerRow.find('.datagrid-filter-wrapper').hide();
        this.settings.filterable = false;
      } else {
        this.settings.filterable = true;

        if (!this.filterRowRendered) {
          this.renderFilterRow();
        }

        this.headerRow.addClass('is-filterable');
        this.headerRow.find('.is-filterable').addClass('is-filterable');
        this.headerRow.find('.datagrid-filter-wrapper').show();
      }

    },

    //Except conditions from outside or pull from filter row
    applyFilter: function (conditions) {
      var self = this;
      this.filteredDataset = null;

      if (!conditions) {
        conditions = this.filterConditions();
      }

      var checkRow = function (rowData) {
        var isMatch = true;

        for (var i = 0; i < conditions.length; i++) {
          var columnDef = self.columnById(conditions[i].columnId)[0],
            field = columnDef.field,
            rowValue = self.fieldValue(rowData, field),
            rowValueStr = rowValue.toString().toLowerCase(),
            conditionValue = conditions[i].value.toString().toLowerCase();

          //Run Data over the formatter
          if (columnDef.filterType === 'text') {
            rowValue = self.formatValue(columnDef.formatter, i , conditions[i].columnId, rowValue, columnDef, rowData, self);

            //Strip any html markup that might be in the formatters
            var rex = /(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig;
            rowValue = rowValue.replace(rex , '').toLowerCase();

            rowValueStr = rowValue.toString().toLowerCase();
          }

          if (columnDef.filterType === 'contents' || columnDef.filterType === 'select') {
            rowValue = rowValue.toLowerCase();
          }

          if (rowValue instanceof Date) {
            rowValue = rowValue.getTime();
            conditionValue = Locale.parseDate(conditions[i].value, conditions[i].format).getTime();
          }

          if (typeof rowValue === 'number') {
            rowValue =  parseFloat(rowValue);
            conditionValue = parseFloat(conditionValue);
          }

          switch (conditions[i].operator) {
            case 'equals':

              //This case is multiselect
              if (conditions[i].value instanceof Array) {
                isMatch = false;

                for (var k = 0; k < conditions[i].value.length; k++) {
                  var match = conditions[i].value[k].toLowerCase().indexOf(rowValue) >= 0 && rowValue.toString() !== '';
                  if (match) {
                    isMatch = true;
                  }
                }
              } else {
                isMatch = (rowValue === conditionValue && rowValue !== '');
              }

              break;
            case 'does-not-equal':
              isMatch = (rowValue !== conditionValue && rowValue !== '');
              break;
            case 'contains':
              isMatch = (rowValueStr.indexOf(conditionValue) > -1 && rowValue.toString() !== '');
              break;
            case 'does-not-contain':
              isMatch = (rowValueStr.indexOf(conditionValue) === -1 && rowValue.toString() !== '');
              break;
            case 'end-with':
              isMatch = (rowValueStr.lastIndexOf(conditionValue) === (rowValueStr.length - conditionValue.toString().length)  && rowValueStr !== '' && (rowValueStr.length >= conditionValue.toString().length));
              break;
            case 'start-with':
              isMatch = (rowValueStr.indexOf(conditionValue) === 0 && rowValueStr !== '');
              break;
            case 'does-not-end-with':
              isMatch = (rowValueStr.lastIndexOf(conditionValue) === (rowValueStr.length - conditionValue.toString().length)  && rowValueStr !== '' && (rowValueStr.length >= conditionValue.toString().length));
              isMatch = !isMatch;
              break;
            case 'does-not-start-with':
              isMatch = !(rowValueStr.indexOf(conditionValue) === 0 && rowValueStr !== '');
              break;
            case 'is-empty':
              isMatch = (rowValue === '');
              break;
            case 'is-not-empty':
              isMatch = (rowValue !== '');
              break;
            case 'less-than':
              isMatch = (rowValue < conditionValue && rowValue !== '');
              break;
            case 'less-equals':
              isMatch = (rowValue <= conditionValue && rowValue !== '');
              break;
            case 'greater-than':
              isMatch = (rowValue > conditionValue && rowValue !== '');
              break;
            case 'greater-equals':
              isMatch = (rowValue >= conditionValue && rowValue !== '');
              break;
            case 'selected':

              if (columnDef && columnDef.isChecked) {
                 isMatch = columnDef.isChecked(rowValue);
                 break;
              }
              isMatch = (rowValueStr === '1' || rowValueStr ==='true' || rowValue === true || rowValue === 1) && rowValueStr !== '';
              break;
           case 'not-selected':
              if (columnDef && columnDef.isChecked) {
                 isMatch = !columnDef.isChecked(rowValue);
                 break;
              }
              isMatch = (rowValueStr === '0' || rowValueStr ==='false' || rowValue === false || rowValue === 0) && rowValueStr !== '';
              break;
            case 'selected-notselected':
              isMatch = true;
              break;
            default:
          }

          if (!isMatch) {
            return false;
          }
        }
        return isMatch;
      };

      if (!this.settings.disableClientFilter) {
        var dataset, isFiltered, i, len;

        if (this.settings.treeGrid) {
          dataset = this.settings.treeDepth;
          for (i = 0, len = dataset.length; i < len; i++) {
            isFiltered = !checkRow(dataset[i].node);
            dataset[i].node.isFiltered = isFiltered;
          }
        }
        else {
          dataset = this.settings.dataset;
          for (i = 0, len = dataset.length; i < len; i++) {
            isFiltered = !checkRow(dataset[i]);
            dataset[i].isFiltered = isFiltered;
          }
        }
      }
      this.renderRows();
      this.resetPager('filtered');
    },

    //Clear and reset the filter
    clearFilter: function () {
      this.renderFilterRow();
      this.applyFilter();
    },

    //Get filter conditions in array form from the UI
    filterConditions: function () {
      var self = this;
      this.filterExpr = [];

      //Create an array of objects with: field, id, filterType, operator, value
      this.headerRow.find('th').each(function () {
        var rowElem = $(this),
          btn = rowElem.find('.btn-filter'),
          input = rowElem.find('input, select'),
          isDropdown = input.is('select'),
          svg = btn.find('.icon-dropdown:first'),
          op;

        if (!btn.length && !isDropdown) {
          return;
        }

        op = isDropdown ? 'equals' : svg.getIconName().replace('filter-', '');

        if (op === 'selected-notselected') {
          return;
        }

        if (input.val() === '' && ['is-not-empty', 'is-empty', 'selected', 'not-selected'].indexOf(op) === -1) {
          return;
        }

        if (input.val() instanceof Array && input.val().length ===0) {
          return;
        }

        var condition = {columnId: rowElem.attr('data-column-id'),
          operator: op,
          value: input.val() ? input.val() : '',
          ignorecase: 'yes'};

        if (input.data('datepicker')) {
          var format = input.data('datepicker').settings.dateFormat;
          if (format === 'locale') {
            format = Locale.calendar().dateFormat.short;
          }
          condition.format = format;
        }

        self.filterExpr.push(condition);

      });

      return self.filterExpr;
    },

    // Create draggable columns
    createDraggableColumns: function () {
      var self = this,
        headers = self.headerNodes().not('[data-column-id="selectionCheckbox"]'),
        showTarget = $('.drag-target-arrows', self.element);

      if (!showTarget.length) {
        self.element.prepend('<span class="drag-target-arrows"></span>');
        showTarget = $('.drag-target-arrows', self.element);
      }

      headers.prepend('<span class="is-draggable-target"></span><span class="handle">&#8286;</span>');
      headers.last().append('<span class="is-draggable-target last"></span>');
      self.element.addClass('has-draggable-columns');

      // Initialize Drag api
      $('.handle', headers).each(function() {
        var clone, headerPos, offPos,
          handle = $(this),
          header = handle.parent();

        handle.on('mousedown.datagrid', function(e) {
          e.preventDefault();

          header.drag({clone: true, cloneAppentTo: headers.first().parent().parent(), clonePosIsFixed: true})
            .on('dragstart.datagrid', function (e, pos, thisClone) {
              var index;

              clone = thisClone;

              clone.removeAttr('id').addClass('is-dragging-clone')
                .css({left: pos.left, top: pos.top});
              $('.is-draggable-target', clone).remove();

              self.setDraggableColumnTargets();

              headerPos = header.position();
              offPos = {top: (pos.top - headerPos.top), left: (pos.left - headerPos.left)};

              index = self.targetColumn(headerPos);
              self.draggableStatus.startIndex = index;
              e.stopImmediatePropagation();
            })
            .on('drag.datagrid', function (e, pos) {
              clone[0].style.left = parseInt(pos.left) + 'px';
              clone[0].style.top =  parseInt(pos.top) + 'px';
              headerPos = {top: (pos.top - offPos.top), left: (pos.left - offPos.left)};

              var i, l, n, target, rect,
                index = self.targetColumn(headerPos);

              $('.is-draggable-target', headers).add(showTarget).removeClass('is-over');

              if (index !== -1) {
                for (i=0, l=self.draggableColumnTargets.length; i<l; i++) {
                  target = self.draggableColumnTargets[i];
                  n = i + 1;

                  if (target.index === index && target.index !== self.draggableStatus.startIndex) {
                    if (target.index > self.draggableStatus.startIndex && (n < l)) {
                      target = self.draggableColumnTargets[n];
                    }

                    target.el.addClass('is-over');
                    showTarget.addClass('is-over');
                    rect = target.el[0].getBoundingClientRect();
                    showTarget[0].style.left = parseInt(rect.left) + 'px';
                    showTarget[0].style.top =  parseInt(rect.top) + 'px';

                  }
                }
              }

              e.stopImmediatePropagation();
            })
            .on('dragend.datagrid', function (e, pos) {
              clone[0].style.left = parseInt(pos.left) + 'px';
              clone[0].style.top =  parseInt(pos.top) + 'px';

              headerPos = {top: (pos.top - offPos.top), left: (pos.left - offPos.left)};

              var index = self.targetColumn(headerPos),
               dragApi = header.data('drag'),
               tempArray = [],
               i, l, indexFrom, indexTo, target;

              // Unbind drag from header
              if (dragApi && dragApi.destroy) {
                dragApi.destroy();
              }

              self.draggableStatus.endIndex = index;
              $('.is-draggable-target', headers).add(showTarget).removeClass('is-over');

              if (self.draggableStatus.endIndex !== -1) {
                if (self.draggableStatus.startIndex !== self.draggableStatus.endIndex) {
                  target = self.draggableColumnTargets[index];


                  //Swap columns
                  for (i=0, l=self.settings.columns.length; i < l; i++) {
                      if (!self.settings.columns[i].hidden &&
                          self.settings.columns[i].id !== 'selectionCheckbox') {
                        tempArray.push(i);
                      }
                    }

                    indexFrom = tempArray[self.draggableStatus.startIndex] || 0;
                    indexTo = tempArray[self.draggableStatus.endIndex] || 0;

                    self.arrayIndexMove(self.settings.columns, indexFrom, indexTo);
                    self.updateColumns(self.settings.columns);

                  }
              }

            });
        });
      });
    },

    // Set draggable columns target
    setDraggableColumnTargets: function () {
      var self = this,
        headers = self.headerNodes()
          .not('.is-hidden').not('[data-column-id="selectionCheckbox"]'),
        target, pos, extra;

      self.draggableColumnTargets = [];
      self.draggableStatus = {};

      // Move last target if not found in last header
      if (!$('.is-draggable-target.last', headers.last()).length) {
        headers.last().append($('.is-draggable-target.last', self.headerNodes()));
      }

      $('.is-draggable-target', headers).each(function (index) {
        var idx = ($(this).is('.last')) ? index - 1 : index; // Extra target for last header th
        target = headers.eq(idx);
        pos = target.position();
        // Extra space around, if dropped item bit off from drop area
        extra = 20;

        self.draggableColumnTargets.push({
          el: $(this),
          index: idx,
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
    targetColumn: function (pos) {
      var self = this,
        index = -1,
        target, i, l;

      for (i=0, l=self.draggableColumnTargets.length-1; i<l; i++) {
        target = self.draggableColumnTargets[i];
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
        value = (rawValue || rawValue === 0 || rawValue === false ? rawValue : '');

      value = $.escapeHTML(value);
      return value;
    },

    // Set tree root nodes
    setTreeRootNodes: function() {
      this.settings.treeRootNodes = this.settings.treeDepth
        .filter(function(node) {
          return node.depth === 1;
        });
    },

    // Set tree depth
    setTreeDepth: function(dataset) {
      var self = this,
        idx = 0,
        iterate = function(node, depth) {
          idx++;
          self.settings.treeDepth.push({idx: idx, depth: depth, node: node});
          var children = node.children || [];
          for (var i = 0, len = children.length; i < len; i++) {
            iterate(children[i], depth + 1);
          }
        };

      dataset = dataset || this.settings.dataset;
      self.settings.treeDepth = [];

      for (var i = 0, len = dataset.length; i < len; i++) {
        iterate(dataset[i], 1);
      }
    },

    setRowGrouping: function () {
      var groupSettings = this.settings.groupable;
      if (!groupSettings) {
        return;
      }

      this.originalDataset = this.settings.dataset.slice();

      if (groupSettings.aggregator === 'sum') {
        this.settings.dataset = GroupBy.sum(this.settings.dataset , groupSettings.fields, groupSettings.aggregate);
        return;
      }

      if (groupSettings.aggregator === 'max') {
        this.settings.dataset = GroupBy.max(this.settings.dataset , groupSettings.fields, groupSettings.aggregate);
        return;
      }

      if (groupSettings.aggregator === 'list') {
        this.settings.dataset = GroupBy.list(this.settings.dataset , groupSettings.fields, groupSettings.aggregatorOptions);
        return;
      }

      this.settings.dataset = window.GroupBy(this.settings.dataset , groupSettings.fields);
    },

    //Render the Rows
    renderRows: function() {
      var tableHtml = '',
        self = this, i,
        s = self.settings,
        activePage = self.pager ? self.pager.activePage : 1,
        pagesize = s.pagesize,
        dataset = s.dataset;

      var body = self.table.find('tbody');
      self.bodyColGroupHtml = '<colgroup>';

      if (body.length === 0) {
        self.tableBody = $('<tbody></tbody>');
        self.table.append(self.tableBody);
      }

      self.recordCount = 0;
      self.filteredCount = 0;

      // Reset recordCount for paging
      if (s.treeGrid && s.paging && !s.source && activePage > 1) {
        self.recordCount = s.treeRootNodes[(pagesize * activePage) - pagesize].idx-1;
      }

      for (i = 0; i < dataset.length; i++) {

        //For better performance dont render out of page
        if (s.paging && !s.source) {

          if (activePage === 1 && (i - this.filteredCount) >= pagesize){
            if (!dataset[i].isFiltered) {
              this.recordCount++;
            }
            continue;
          }

          if (activePage > 1 && !((i - this.filteredCount) >= pagesize*(activePage-1) && (i - this.filteredCount) < pagesize*activePage)) {
            if (!dataset[i].isFiltered) {
              this.recordCount++;
            } else {
              this.filteredCount++;
            }
            continue;
          }
        }

        if (s.virtualized) {
          if (!this.isRowVisible(this.recordCount)) {
            this.recordCount++;
            continue;
          }
        }

        //Exclude Filtered Rows
        if ((s.treeGrid ? s.treeRootNodes[i].node : dataset[i]).isFiltered) {
          this.filteredCount++;
          continue;
        }

        //Handle Grouping
        if (this.settings.groupable) {
          //First push group row
          if (!this.settings.groupable.suppressGroupRow) {
            //Show the grouping row
            tableHtml += self.rowHtml(dataset[i], this.recordCount, true);
          }

          if (this.settings.groupable.showOnlyGroupRow && dataset[i].values[0]) {
            var rowData = dataset[i].values[0];

            if (dataset[i].list) {
              rowData.list = dataset[i].list;
            }

            rowData.values = dataset[i].values;

            tableHtml += self.rowHtml(rowData, this.recordCount);
            this.recordCount++;
            continue;
          }

          //Now Push Groups
          for (var k = 0; k < dataset[i].values.length; k++) {
            tableHtml += self.rowHtml(dataset[i].values[k], this.recordCount);
            this.recordCount++;
          }

          // Now Push summary rowHtml
          if (this.settings.groupable.groupFooterRow) {
            tableHtml += self.rowHtml(dataset[i], this.recordCount, true, true);
          }

          continue;
        }

        tableHtml += self.rowHtml(dataset[i], s.treeGrid ? this.recordCount : i);
        this.recordCount++;
      }

      //Append a Summary Row
      if (this.settings.summaryRow) {
        tableHtml += self.rowHtml(self.calculateTotals(), this.recordCount, false, true);
      }

      if (self.bodyColGroupHtml !== '<colgroup>') {
        self.bodyColGroupHtml += '</colgroup>';

        if (self.bodyColGroup) {
          self.bodyColGroup.remove();
        }

        self.bodyColGroup = $(self.bodyColGroupHtml);
        self.tableBody.before(self.bodyColGroup);
      }

      self.tableBody.html(tableHtml);
      self.setVirtualHeight();
      self.setScrollClass();
      self.setupTooltips();
      self.tableBody.find('.dropdown').dropdown();

      //Set IE elements after dataload
      setTimeout(function () {

        if (!s.source) {
          self.displayCounts();
        }

        self.setAlternateRowShading();

        if (!self.activeCell || !self.activeCell.node) {
          self.activeCell = {node: self.cellNode(0, 0, true).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0};
        }

        if (self.activeCell.isFocused) {
          self.setActiveCell(self.activeCell.row, self.activeCell.cell);
        }
      }, 0);
    },

    cacheVirtualStats: function () {
      var containerHeight = this.element[0].offsetHeight,
        scrollTop = this.contentContainer[0].scrollTop,
        headerHeight = this.settings.rowHeight === 'normal' ? 40 : (this.settings.rowHeight === 'medium' ? 30 : 25),
        bodyHeight = containerHeight-headerHeight,
        rowHeight = this.settings.rowHeight === 'normal' ? 50 : (this.settings.rowHeight === 'medium' ? 40 : 30);

      this.virtualRange = {rowHeight: rowHeight,
                         top: Math.max(scrollTop - ((this.settings.virtualRowBuffer-1) * rowHeight), 0),
                         bottom: scrollTop + bodyHeight + ((this.settings.virtualRowBuffer-1) * rowHeight),
                         totalHeight: rowHeight * this.settings.dataset.length,
                         bodyHeight: bodyHeight};
    },

    // Check if the row is in the visble scroll area + buffer
    // Just call renderRows() on events that change
    isRowVisible: function(rowIndex) {
      if (!this.settings.virtualized) {
        return true;
      }

      if (rowIndex === 0) {
        this.cacheVirtualStats();
      }

      //determine if the row is in view
      var pos = rowIndex * this.virtualRange.rowHeight;

      if (pos >= this.virtualRange.top && pos < this.virtualRange.bottom) {
        return true;
      }

      return false;
    },

    // Set the heights on top or bottom based on scroll position
    setVirtualHeight: function () {
      if (!this.settings.virtualized) {
        return true;
      }

      var bottom = this.virtualRange.totalHeight - this.virtualRange.bottom,
        top = this.virtualRange.top;

      this.topSpacer = this.tableBody.find('.datagrid-virtual-row-top');
      this.bottomSpacer = this.tableBody.find('.datagrid-virtual-row-bottom');

      if (top > 0 && !this.topSpacer.length) {
        this.topSpacer = $('<tr class="datagrid-virtual-row-top" style="height: '+ top + 'px"><td colspan="'+ this.visibleColumns().length +'"></td></tr>');
        this.tableBody.prepend(this.topSpacer);
      }

      if (top > 0 && this.topSpacer.length) {
        this.topSpacer.css('height', top + 'px');
      }

      if (top ===0 && this.topSpacer.length || this.virtualRange.topRow <= 1) {
        this.topSpacer.remove();
      }

      if (bottom > 0 && !this.bottomSpacer.length) {
        this.bottomSpacer = $('<tr class="datagrid-virtual-row-bottom" style="height: '+ bottom + 'px"><td colspan="'+ this.visibleColumns().length +'"></td></tr>');
        this.tableBody.append(this.bottomSpacer);
      }

      if (bottom > 0 && this.bottomSpacer.length) {
        this.bottomSpacer.css('height', bottom + 'px');
      }

      if (bottom <= 0 && this.bottomSpacer.length || (this.virtualRange.bottomRow >= this.settings.dataset.length)) {
        this.bottomSpacer.remove();
      }
    },

    // Set the alternate shading for tree
    setAlternateRowShading: function() {
      if (this.settings.alternateRowShading && this.settings.treeGrid) {
        $('tr[role="row"]:visible', this.tableBody)
          .removeClass('alt-shading').filter(':odd').addClass('alt-shading');
      }
    },

    formatValue: function (formatter, row, cell, fieldValue, columnDef, rowData, api) {
      var formattedValue;
      api = api || this;

      //Use default formatter if undefined
      if (formatter === undefined) {
        formatter = this.defaultFormatter;
      }

      if (typeof formatter ==='string') {
        formattedValue = window.Formatters[formatter](row, cell, fieldValue, columnDef, rowData, api).toString();
      } else {
        formattedValue = formatter(row, cell, fieldValue, columnDef, rowData, api).toString();
      }
      return formattedValue;
    },

    recordCount: 0,

    rowHtml: function (rowData, dataRowIdx, isGroup, isFooter) {
      var isEven = false,
        self = this,
        isSummaryRow = this.settings.summaryRow && !isGroup && isFooter,
        activePage = self.pager ? self.pager.activePage : 1,
        pagesize = self.settings.pagesize,
        rowHtml = '',
        d = self.settings.treeDepth[dataRowIdx],
        depth, d2, i, l, isHidden;

      if (!rowData) {
        return '';
      }

      // Default
      d = d ? d.depth : 0;
      depth = d;

      // Setup if this row will be hidden or not
      for (i = dataRowIdx; i >= 0 && d > 1 && !isHidden; i--) {
        d2 = self.settings.treeDepth[i];
        if (d !== d2.depth && d > d2.depth) {
          d = d2.depth;
          isHidden = !d2.node.expanded;
        }
      }

      if (this.settings.groupable) {
        var groupSettings = this.settings.groupable;
        isHidden  = (groupSettings.expanded === undefined ? false : !groupSettings.expanded);

        if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
          isHidden = !groupSettings.expanded(dataRowIdx, 0, null, null, rowData, this);
        }
      }

      //Group Rows
      if (this.settings.groupable && isGroup && !isFooter) {
        rowHtml = '<tr class="datagrid-rowgroup-header ' + (isHidden ? '' : 'is-expanded') + '" role="rowgroup"><td role="gridcell" colspan="'+ this.visibleColumns().length +'">' +
          Formatters.GroupRow(dataRowIdx, 0, null, null, rowData, this) +
          '</td></tr>';
        return rowHtml;
      }

      if (this.settings.groupable && isGroup && isFooter) {
        rowHtml = '<tr class="datagrid-row datagrid-rowgroup-footer ' + (isHidden ? '' : 'is-expanded') + '" role="rowgroup">' +
          Formatters.GroupFooterRow(dataRowIdx, 0, null, null, rowData, this) +
          '</tr>';
        return rowHtml;
      }

      var ariaRowindex = ((dataRowIdx + 1) + (self.settings.source  ? ((activePage-1) * pagesize) : 0));
      if (this.settings.indeterminate) {
        ariaRowindex = (dataRowIdx + 1);
      }

      isEven = (this.recordCount % 2 === 0);

      rowHtml = '<tr role="row" aria-rowindex="' + ariaRowindex + '"' +
                (self.settings.treeGrid && rowData.children ? ' aria-expanded="' + (rowData.expanded ? 'true"' : 'false"') : '') +
                (self.settings.treeGrid ? ' aria-level= "' + depth + '"' : '') +
                ' class="datagrid-row'+
                (isHidden ? ' is-hidden' : '') +
                (self.settings.alternateRowShading && !isEven ? ' alt-shading' : '') +
                (isSummaryRow ? ' datagrid-summary-row' : '') +
                (!self.settings.cellNavigation ? ' is-clickable' : '' ) +
                (self.settings.treeGrid ? (rowData.children ? ' datagrid-tree-parent' : (depth > 1 ? ' datagrid-tree-child' : '')) : '') +
                 '"' + '>';

      for (var j = 0; j < self.settings.columns.length; j++) {
        var col = self.settings.columns[j],
          cssClass = '',
          formatter = isSummaryRow ? col.summaryRowFormatter || col.formatter || self.defaultFormatter : col.formatter || self.defaultFormatter,
          formatted = self.formatValue(
            formatter,
            dataRowIdx,
            j,
            self.fieldValue(rowData, self.settings.columns[j].field),
            self.settings.columns[j],
            rowData,
            self
          );

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

        if (col.expanded) {
          self.treeExpansionField = col.expanded;
        }

        if (col.align) {
          cssClass += ' l-'+ col.align +'-text';
        }

        if (col.textOverflow === 'ellipsis') {
          cssClass += ' text-ellipsis';
        }

        // Add Column Css Classes

        //Add a readonly class if set on the column
        cssClass += (col.readonly ? ' is-readonly' : '');
        cssClass += (col.hidden ? ' is-hidden' : '');

        //Run a function that helps check if editable
        if (col.isEditable && !col.readonly) {
          var canEdit = col.isEditable(ariaRowindex - 1, j, self.fieldValue(rowData, self.settings.columns[j].field), col, rowData);

          if (!canEdit) {
            cssClass += ' is-readonly';
          }
        }

        //Run a function that helps check if readonly
        var ariaReadonly = (col.id !== 'selectionCheckbox' &&
          (col.readonly || col.editor === undefined)) ?
          'aria-readonly="true"': '';

        if (col.isReadonly && !col.readonly && col.id !== 'selectionCheckbox') {
          var isReadonly = col.isReadonly(this.recordCount, j, self.fieldValue(rowData, self.settings.columns[j].field), col, rowData);

          if (isReadonly) {
            cssClass += ' is-cell-readonly';
            ariaReadonly = 'aria-readonly="true"';
          }
        }

        var cellValue = self.fieldValue(rowData, self.settings.columns[j].field);

        //Run a function that dynamically adds a class
        if (col.cssClass && typeof col.cssClass === 'function') {
          cssClass += ' ' + col.cssClass(this.recordCount, j, cellValue, col, rowData);
        }

        cssClass += (col.focusable ? ' is-focusable' : '');

        var rowspan = this.calculateRowspan(cellValue, dataRowIdx, col);

        if (rowspan === '') {
          continue;
        }

        //Set Width of table col / col group elements
        var colWidth = '';
        if (this.recordCount === 0 || this.recordCount - ((activePage-1) * pagesize) === 0) {
          colWidth = this.calculateColumnWidth(col, j);
          self.bodyColGroupHtml += '<col' + colWidth + (col.hidden ? ' class="is-hidden"' : '') + '></col>';
        }

        rowHtml += '<td role="gridcell" ' + ariaReadonly + ' aria-colindex="' + (j+1) + '" '+
            ' aria-describedby="' + self.uniqueId('-header-' + j) + '"' +
           (cssClass ? ' class="' + cssClass + '"' : '') +
           (col.tooltip ? ' title="' + col.tooltip.replace('{{value}}', cellValue) + '"' : '') +
           (col.id === 'rowStatus' && rowData.rowStatus && rowData.rowStatus.tooltip ? ' title="' + rowData.rowStatus.tooltip + '"' : '') +
           (self.settings.columnGroups ? 'headers = "' + self.uniqueId('-header-' + j) + ' ' + self.getColumnGroup(j) + '"' : '') +
           (rowspan ? rowspan : '' ) +
           '><div class="datagrid-cell-wrapper">';

        if (col.contentVisible) {
          var canShow = col.contentVisible(dataRowIdx + 1, j, cellValue, col, rowData);
          if (!canShow) {
            formatted = '';
          }
        }

        rowHtml += formatted + '</div></td>';
      }

      rowHtml += '</tr>';

      if (self.settings.rowTemplate) {
        var tmpl = self.settings.rowTemplate,
          item = rowData,
          renderedTmpl = '';

        if (Tmpl && item) {
          var compiledTmpl = Tmpl.compile('{{#dataset}}'+tmpl+'{{/dataset}}');
          renderedTmpl = compiledTmpl.render({dataset: item});
        }

        rowHtml += '<tr class="datagrid-expandable-row"><td colspan="'+ this.visibleColumns().length +'">' +
          '<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding">'+ renderedTmpl + '</div></div>' +
          '</td></tr>';
      }

      //Render Tree Children
      if (rowData.children) {
        for (i=0, l=rowData.children.length; i<l; i++) {
          this.recordCount++;
          rowHtml += self.rowHtml(rowData.children[i], this.recordCount);
        }
      }

      return rowHtml;
    },

    canvas:  null,
    totalWidth: 0,

    //This Function approximates the table auto widthing
    //Except use all column values and compare the text width of the header as max
    calculateTextWidth: function (columnDef) {
      var max = 0,
        self = this,
        field = columnDef.field,
        maxText = '',
        title = columnDef.name || '',
        chooseHeader = false;

      //Get max cell value length for this column
      for (var i = 0; i < this.settings.dataset.length; i++) {
        var val = this.fieldValue(this.settings.dataset[i], field),
           len = 0;

        //Get formatted value (without html) so we have accurate string that will display for this cell
        val = self.formatValue(columnDef.formatter, i, null, val, columnDef, this.settings.dataset[i], self);
        val = val.replace(/<\/?[^>]+(>|$)/g, '');

        len = val.toString().length;

        if (len > max) {
          max = len;
          maxText = val;
        }
      }

      //Use header text length as max if bigger than all data cells
      if (title.length > max) {
        max = title.length;
        maxText = title;
        chooseHeader = true;
      }

      if (maxText === '' || this.settings.dataset.length === 0) {
        maxText = columnDef.name || ' Default ';
        chooseHeader = true;
      }

      // if given, use cached canvas for better performance, else, create new canvas
      this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
      var context = this.canvas.getContext('2d');
      context.font = '14px arial';
      var metrics = context.measureText(maxText);
      return Math.round(metrics.width + (chooseHeader ? 60 : 52));  //Add padding and borders
    },

    headerWidths: [], //Cache

    headerTableWidth: function () {
      var cacheWidths = this.headerWidths[this.settings.columns.length-1];

      if (!cacheWidths) {
        return '';
      }
      this.setScrollClass();

      //TODO Test last column hidden
      if (cacheWidths.widthPercent) {
        return 'style = "width: 100%"';
      } else if (this.totalWidth > this.elemWidth) {
        return 'style = "width: ' + parseFloat(this.totalWidth) + 'px"';
      } else if (this.widthSpecified && !isNaN(this.totalWidth) && this.totalWidth > this.elemWidth) {
        return 'style = "width: ' + parseFloat(this.totalWidth) + 'px"';
      }

      return '';
    },

    setScrollClass: function () {
      var hasScrollBar = parseInt(this.contentContainer[0].scrollHeight) > parseInt(this.contentContainer[0].offsetHeight) + 2;
      if (hasScrollBar) {
        this.element.addClass('has-vertical-scroll');
      } else {
        this.element.removeClass('has-vertical-scroll');
      }
    },

    clearHeaderCache: function () {
      this.headerWidths = [];
      this.totalWidth = 0;
      this.elemWidth = 0;
    },

    //Calculate the width for a column (upfront with no rendering)
    //https://www.w3.org/TR/CSS21/tables.html#width-layout
    calculateColumnWidth: function (col, index) {
      var visibleColumns, colPercWidth;
      visibleColumns = this.visibleColumns(true);

      if (!this.elemWidth) {
        this.elemWidth = this.element.outerWidth();

        if (this.elemWidth === 0) { ///handle on invisible tab container
          this.elemWidth = this.element.closest('.tab-container').outerWidth();
        }
        this.widthSpecified = false;
      }

        // use cache
      if (this.headerWidths[index]) {
        var cacheWidths = this.headerWidths[index];

        if (cacheWidths.width === 'default') {
          return '';
        }

        if (this.widthSpecified && !cacheWidths.width) {
          return '';
        }

        return ' style="width: '+ cacheWidths.width + (cacheWidths.widthPercent ? '%' :'px') + '"';
      }

      //A column element with a value other than 'auto' for the 'width' property sets the width for that column.
      if (col.width) {
        this.widthSpecified = true;
        this.widthPercent = false;
      }

      var colWidth = col.width;

      if (typeof col.width === 'string' && col.width.indexOf('px') === -1) {
        this.widthPercent = true;
        colPercWidth = col.width.replace('%', '');
      }

      var textWidth = this.calculateTextWidth(col);  //reasonable default on error

      if (!this.widthSpecified || !colWidth) {
        colWidth = Math.max(textWidth, colWidth || 0);
      }

      // Simulate Auto Width Algorithm
      if ((!this.widthSpecified || col.width === undefined) && visibleColumns.length < 8 &&
        (['selectionCheckbox', 'drilldown', 'rowStatus', 'favorite'].indexOf(col.id) === -1)  &&
        this.elemWidth > 0) {

        this.headerWidths[index] = {id: col.id, width: 'default'};
        var percentWidth = this.elemWidth / visibleColumns.length;

        //Handle Columns where auto width is bigger than the percent width
        if (percentWidth < textWidth) {
          this.headerWidths[index] = {id: col.id, width: textWidth, widthPercent: false};
          return ' style="width: '+ textWidth + 'px' + '"';
        }

        return '';
      }

      //Some Built in columns
      if (col.id === 'selectionCheckbox' || col.id === 'favorite') {
        colWidth = 43;
      }

      if (col.id === 'drilldown' || col.id === 'rowStatus') {
        colWidth = 78;
      }

      // cache the header widths
      this.headerWidths[index] = {id: col.id, width: (this.widthPercent ? colPercWidth : colWidth), widthPercent: this.widthPercent};
      this.totalWidth += col.hidden ? 0 : colWidth;

      //For the last column stretch it TODO May want to check for hidden column as last
      if (index === this.visibleColumns().length-1 && this.totalWidth !== colWidth) {

        var diff = this.elemWidth - this.totalWidth;

        if ((diff !== 0 || diff === 0)) {
        // TODO Remove this or use it
        //  this.headerWidths[index].width = colWidth = 100;
        //  this.headerWidths[index].minWidth = colMinWidth = 100;
        }

        if (this.widthPercent) {
          this.table.css('width', '100%');
        } else if (this.totalWidth > this.elemWidth) {
          this.table.css('width', this.totalWidth);
        } else if (this.widthSpecified && this.totalWidth && !isNaN(this.totalWidth) && this.totalWidth > this.elemWidth) {
          this.table.css('width', this.totalWidth);
        }
      }

      if (!this.widthPercent && !colWidth) {
        return '';
      }

      return ' style="width: '+ (this.widthPercent ? colPercWidth + '%' : colWidth + 'px') + '"';
    },

    widthPercent: false,
    rowSpans: [],

    calculateRowspan: function (value, row, col) {
      var cnt = 0, min = null;

      if (!col.rowspan) {
        return;
      }

      for (var i = 0; i < this.settings.dataset.length; i++) {
        if (value === this.settings.dataset[i][col.field]) {
          cnt++;
          if (min === null) {
            min = i;
          }
        }
      }

      if (row === min) {
        return ' rowspan ="'+ cnt + '"';
      }
      return '';
    },

    //Summary Row Totals use the aggregators
    calculateTotals: function() {
      this.settings.totals = Aggregators.aggregate(this.settings.dataset, this.settings.columns);
      return this.settings.totals;
    },

    setupTooltips: function () {

      // Implement Tooltip on cells with title attribute
      this.tableBody.find('td[title]').tooltip({placement: 'left', offset: {left: -5, top: 0}});
      this.tableBody.find('a[title]').tooltip();

      // Implement Tooltip on cells with ellipsis
      this.table.find('td.text-ellipsis').tooltip({content: function() {
        var cell = $(this),
          text = cell.text(),
          inner = cell.children('.datagrid-cell-wrapper');

        if (cell[0] && inner[0] && (inner[0].offsetWidth)< inner[0].scrollWidth && cell.data('tooltip')) {
          var w = inner.width();
          cell.data('tooltip').settings.maxWidth = w;
          return text;
        }

        return '';
      }});
    },

    //Returns all header nodes (not the groups)
    headerNodes: function () {
      return this.headerRow.find('tr:not(.datagrid-header-groups) th');
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

        this.updateCellNode(idx, j, this.fieldValue(rowData, col.field), true);
      }

    },

    //given a new column set update the rows and reload
    updateColumns: function(columns, columnGroups) {
      this.settings.columns = columns;

      if (columnGroups) {
        this.settings.columnGroups = columnGroups;
      }

      this.clearHeaderCache();
      this.renderRows();
      this.renderHeader();
      this.resetPager('updatecolumns');
      this.element.trigger('columnchange', [{type: 'updatecolumns', columns: this.settings.columns}]);
      this.saveColumns();
    },

    saveColumns: function () {
      if (!this.settings.saveColumns) {
        return;
      }

      //Save to local storage
      if (this.canUseLocalStorage()) {
        localStorage[this.uniqueId('columns')] = JSON.stringify(this.settings.columns);
      }
    },

    canUseLocalStorage: function () {
      try {
        if (localStorage.getItem) {
          return true;
        }
      } catch (exception) {
        return false;
      }
    },

    //Restore the columns from a saved list or local storage
    restoreColumns: function (cols) {
      if (!this.settings.saveColumns || !this.canUseLocalStorage()) {
        return;
      }

      if (cols) {
        this.updateColumns(cols);
        return;
      }

      //Done on load as apposed to passed in
      var lsCols = localStorage[this.uniqueId('columns')];

      if (!cols && lsCols) {
        lsCols = JSON.parse(lsCols);
        this.originalColumns = this.settings.columns;

        //Map back the missing functions/objects
        for (var i = 0; i < lsCols.length; i++) {
          var isHidden,
            orgCol = this.columnById(lsCols[i].id);

          if (orgCol) {
            orgCol = orgCol[0];
            isHidden = lsCols[i].hidden;

            $.extend(lsCols[i], orgCol);

            if (isHidden !== undefined) {
              lsCols[i].hidden = isHidden;
            }
          }
        }

        this.settings.columns = lsCols;
        return;
      }

    },

    resetColumns: function () {
      if (this.canUseLocalStorage()) {
        localStorage.removeItem(this.uniqueId('columns'));
        localStorage[this.uniqueId('columns')] = '';
      }

      if (this.originalColumns) {
        this.updateColumns(this.originalColumns);
      }

    },

    //Hide a column
    hideColumn: function(id) {
      var idx = this.columnIdxById(id);
      this.settings.columns[idx].hidden = true;
      this.headerRow.find('th').eq(idx).addClass('is-hidden');
      this.tableBody.find('td:nth-child('+ (idx+1) +')').addClass('is-hidden');
      this.headerColGroup.find('col').eq(idx).addClass('is-hidden');
      this.bodyColGroup.find('col').eq(idx).addClass('is-hidden');

      this.element.trigger('columnchange', [{type: 'hidecolumn', index: idx, columns: this.settings.columns}]);
      this.saveColumns();
    },

    //Show a hidden column
    showColumn: function(id) {
      var idx = this.columnIdxById(id);
      this.settings.columns[idx].hidden = false;
      this.headerRow.find('th').eq(idx).removeClass('is-hidden');
      this.tableBody.find('td:nth-child('+ (idx+1) +')').removeClass('is-hidden');
      this.headerColGroup.find('col').eq(idx).removeClass('is-hidden');
      this.bodyColGroup.find('col').eq(idx).removeClass('is-hidden');

      this.element.trigger('columnchange', [{type: 'showcolumn', index: idx, columns: this.settings.columns}]);
      this.saveColumns();
    },

    // Export To Excel
    exportToExcel: function (fileName, worksheetName, customDs) {
      var self = this,
        template = ''+
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'+
            '<head>'+
              '<!--[if gte mso 9]>'+
                '<xml>'+
                  '<x:ExcelWorkbook>'+
                    '<x:ExcelWorksheets>'+
                      '<x:ExcelWorksheet>'+
                        '<x:Name>{worksheet}</x:Name>'+
                        '<x:WorksheetOptions>'+
                          '<x:Panes></x:Panes>'+
                          '<x:DisplayGridlines></x:DisplayGridlines>'+
                        '</x:WorksheetOptions>'+
                      '</x:ExcelWorksheet>'+
                    '</x:ExcelWorksheets>'+
                  '</x:ExcelWorkbook>'+
                '</xml>'+
              '<![endif]-->'+
              '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>'+
            '</head>'+
            '<body>'+
              '<table border="1px solid #999999">{table}</table>'+
            '</body>'+
          '</html>',

        cleanExtra = function(table) {
          $('tr, th, td, div, span', table).each(function () {
            var el = this,
              elm = $(this);

            if (elm.is('.is-hidden')) {
              elm.remove();
              return;
            }

            $('.is-hidden, .is-draggable-target, .handle, .sort-indicator, .datagrid-filter-wrapper', el).remove();
            while(el.attributes.length > 0) {
              el.removeAttribute(el.attributes[0].name);
            }

            // White Hat Security Violation. Remove Excel formulas
            // Excel Formulas Start with =SOMETHING
            var text = elm.text();
            if (text.substr(0, 1) === '=' && text.substr(1, 1) !== '') {
              elm.text('\'' + elm.text());
            }
          });
          return table;
        },

        base64 = function(s) {
          if (window.btoa) {
            return 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(s)));
          } else {
            return 'data:application/vnd.ms-excel;,' + unescape(encodeURIComponent(s));
          }
        },

        format = function(s, c) {
          return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
          });
        },

        appendRows = function(dataset, table) {
          var tableHtml,
            body = table.find('tbody').empty();

          for (var i = 0; i < dataset.length; i++) {
            if (!dataset[i].isFiltered) {
              tableHtml += self.rowHtml(dataset[i], i);
            }
          }

          body.append(tableHtml);
          return table;
        };

      var table = self.table.clone();
      table = appendRows(customDs || this.settings.dataset, table);

      if (!table.find('thead').length) {
        self.headerRow.clone().insertBefore(table.find('tbody'));
      }

      table = cleanExtra(table);
      var ctx = { worksheet: (worksheetName || 'Worksheet'), table: table.html() };

      fileName = (fileName ||
        self.element.closest('.datagrid-container').attr('id') ||
        'datagrid') +'.xls';

      if (this.isIe) {
        if (this.isIe9) {
          var IEwindow = window.open();
          IEwindow.document.write('sep=,\r\n' + format(template, ctx));
          IEwindow.document.close();
          IEwindow.document.execCommand('SaveAs', true, fileName);
          IEwindow.close();
        }
        else if (window.navigator.msSaveBlob) {
          var blob = new Blob([format(template, ctx)], {
            type: 'application/csv;charset=utf-8;'
          });
          navigator.msSaveBlob(blob, fileName);
        }
      }
      else {
        var link = document.createElement('a');
        link.href = base64(format(template, ctx));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    //Open Column Personalization Dialog
    personalizeColumns: function () {
      var self = this,
        markup = '<div class="listview-search alternate-bg"><label class="audible" for="gridfilter">Search</label><input class="searchfield" placeholder="'+ Locale.translate('SearchColumnName') +'" name="searchfield" id="gridfilter"></div>';

        markup += '<div class="listview alternate-bg" id="search-listview"><ul>';

        for (var i = 0; i < this.settings.columns.length; i++) {
          var col = this.settings.columns[i],
            name = col.name;

          if (name) {
            name = name.replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ');
            markup += '<li><a href="#" target="_self" tabindex="-1"> <label class="inline"><input tabindex="-1" ' + (col.hideable ===false ? 'disabled' : '') + ' type="checkbox" class="checkbox" '+ (col.hidden ? '' : ' checked') +' data-column-id="'+ (col.id || i) +'"><span class="label-text">' + name + '</span></label></a></li>';
          }
        }
        markup += '</ul></div>';

        $('body').modal({
          title: Locale.translate('PersonalizeColumns'),
          content: markup,
          cssClass: 'full-width datagrid-columns-dialog',
          buttons: [{
              text: Locale.translate('Close'),
              click: function(e, modal) {
                modal.close();
                $('body').off('open.datagrid');
              }
            }]
        }).on('beforeopen.datagrid', function () {
          self.isColumnsChanged = false;
        }).on('open.datagrid', function (e, modal) {
          modal.element.find('.searchfield').searchfield({clearable: true});
          modal.element.find('.listview').listview({searchable: true, selectOnFocus: false});

          modal.element.on('selected', function (e, args) {
            var chk = args.elem.find('.checkbox'),
                id = chk.attr('data-column-id'),
                isChecked = chk.prop('checked');

            args.elem.removeClass('is-selected');

            if (chk.is(':disabled')) {
              return;
            }
            self.isColumnsChanged = true;

            if (!isChecked) {
              self.showColumn(id);
              chk.prop('checked', true);
            } else {
              self.hideColumn(id);
              chk.prop('checked', false);
            }
          }).on('close.datagrid', function () {
            self.isColumnsChanged = false;
          });
      });
    },

    // Explicitly Set the Width of a column
    setColumnWidth: function(idOrNode, width, diff) {
      var self = this,
        percent = parseFloat(width),
        columnNode = idOrNode,
        columnSettings = this.columnById(typeof idOrNode === 'string' ? idOrNode : idOrNode.attr('data-column-id'));

      if (!percent) {
        return;
      }

      if (typeof idOrNode === 'string') {
        self.headerNodes().each(function () {
          var col = $(this);

          if (col.attr('data-column-id') === idOrNode) {
            columnNode = col;
          }

        });
      }

      //Handles min width on some browsers
      if ((columnSettings.minWidth && width > parseInt(columnSettings.minWidth))) {
        return;
      }

      //calculate percentage
      if (typeof width !=='number') {
        width = percent / 100 * self.element.width();
      }

      //Prevent Sub Pixel Thrashing
      if (Math.abs(width - columnSettings[0].width) < 2) {
        return;
      }

      // Save the column back in settings for later
      if (columnSettings[0]) {
        columnSettings[0].width = width;
      }

      var idx = columnNode.index();
      self.headerColGroup.find('col').eq(idx)[0].style.width = (width + 'px');

      if (self.settings.dataset.length > 0) {
        self.bodyColGroup.find('col').eq(idx)[0].style.width = (width + 'px');
      }

      if (self.tableWidth && diff) {
        self.headerTable.css('width', parseInt(self.tableWidth) + diff);
        self.table.css('width', parseInt(self.tableWidth) + diff);
      }

      this.clearHeaderCache();
    },

    //Generate Resize Handles
    createResizeHandle: function() {
      var self = this;
      if (this.resizeHandle) {
        return;
      }

      this.resizeHandle = $('<div class="resize-handle" aria-hidden="true"></div>');
      if (this.settings.columnGroups) {
        this.resizeHandle[0].style.height = '80px';
      }

      if (this.settings.filterable) {
        this.resizeHandle[0].style.height = '62px';
      }

      this.headerContainer.find('table').before(this.resizeHandle);

      var columnId, startingLeft, columnStartWidth, columnDef;

      this.resizeHandle.drag({axis: 'x', containment: 'parent'})
        .on('dragstart.datagrid', function () {
          if (!self.currentHeader) {
            return;
          }

          self.dragging = true;

          columnId = self.currentHeader.attr('data-column-id');
          columnDef = self.columnById(columnId)[0];

          startingLeft = self.currentHeader.position().left + self.table.scrollLeft() -10;
          self.tableWidth = self.table.css('width');
          columnStartWidth = self.currentHeader.width();
        })
        .on('drag.datagrid', function (e, ui) {
          if (!self.currentHeader) {
            return;
          }

          var width = ui.left - startingLeft,
            minWidth = columnDef.minWidth || 12,
            maxWidth = columnDef.maxWidth || 1000;

          if (width < minWidth || width> maxWidth) {
            self.resizeHandle.css('cursor', 'inherit');
            return;
          }

          width = Math.round(width);
          self.setColumnWidth(self.currentHeader, width, width - columnStartWidth);
        })
        .on('dragend.datagrid', function () {
          self.dragging = false;
        });
    },

    //Show Summary and any other count info
    displayCounts: function(totals) {
      var self = this,
        count = self.tableBody.find('tr:visible').length,
        isClientSide = self.settings.paging && !(self.settings.source);

      if (isClientSide || (!totals && !self.settings.paging)) {
        count = self.recordCount;
      }

      //Update Selected
      if (self.contextualToolbar && self.contextualToolbar.length) {
        self.contextualToolbar.find('.selection-count').text(self._selectedRows.length + ' ' + Locale.translate('Selected'));
      }

      if (self.settings.source && !totals) {
        return;
      }

      if (totals && totals !== -1) {
        count = totals;
      }

      var countText = '(' + count + ' ' + Locale.translate('Results') + ')';
      if (self.settings.resultsText && typeof self.settings.resultsText === 'function') {
        countText = self.settings.resultsText(self, count);
      }

      if (self.toolbar) {
        self.toolbar.find('.datagrid-result-count').html(countText);
        self.toolbar.attr('aria-label',  self.toolbar.find('.title').text());
        self.toolbar.find('.datagrid-row-count').text(count);
      }
      self.element.closest('.modal').find('.datagrid-result-count').html(countText);

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
    cellNode: function (row, cell, includeGroups) {
      var rowNode = this.tableBody.find('tr[aria-rowindex="'+ (row+1) +'"]');

      if (row instanceof jQuery) {
        rowNode = row;
      }

      if (includeGroups) {
        rowNode = this.tableBody.find('tr:visible').eq(row);
      }

      if (cell === -1) {
        return $();
      }

      return rowNode.find('td').eq(cell);
    },

    scrollLeft: 0,
    scrollTop: 0,
    handleScroll: function() {
      var left = this.contentContainer[0].scrollLeft;

      if (left !== this.scrollLeft && this.headerContainer) {
        this.scrollLeft = left;
        this.headerContainer[0].scrollLeft = this.scrollLeft;
      }

    },

    // Attach All relevant events
    handleEvents: function() {
      var self = this,
        isMultiple = this.settings.selectable === 'multiple';

      // Set Focus on rows
      if (!self.settings.cellNavigation && self.settings.rowNavigation) {
        self.table
        .on('focus.datagrid', 'tbody > tr', function () {
            $(this).addClass('is-active-row');
        })
        .on('blur.datagrid', 'tbody > tr', function () {
          $('tbody > tr', self.table).removeClass('is-active-row');
        });
      }

      //Sync Header and Body During scrolling
      self.contentContainer
        .on('scroll.table',function () {
          self.handleScroll();
        });

      if (this.settings.virtualized) {
        var oldScroll = 0, oldHeight = 0;

      self.contentContainer
        .on('scroll.vtable', Soho.utils.debounce(function () {

          var scrollTop = this.scrollTop,
            buffer = 25,
            hitBottom = scrollTop > (self.virtualRange.bottom - self.virtualRange.bodyHeight - buffer),
            hitTop = scrollTop < (self.virtualRange.top + buffer);

          if (scrollTop !== oldScroll && (hitTop || hitBottom)) {
            oldScroll = this.scrollTop;
            self.renderRows();
            return;
          }
        }, 0));

        $('body').on('resize.vtable', function () {
          var height = this.offsetHeight;

          if (height !== oldHeight) {
            oldHeight = this.scrollTop;
            self.renderRows();
          }

        });
      }

      //Handle Sorting
      this.element
        .off('click.datagrid')
        .on('click.datagrid', 'th.is-sortable', function (e) {
          if ($(e.target).parent().is('.datagrid-filter-wrapper')) {
            return;
          }

          self.setSortColumn($(this).attr('data-column-id'));
        });

      //Prevent redirects
      this.table
        .off('mouseup.datagrid touchstart.datagrid')
        .on('mouseup.datagrid touchstart.datagrid', 'a', function (e) {
        e.preventDefault();
      });

      //Handle Row Clicking
      var tbody = this.table.find('tbody');
      tbody.off('click.datagrid').on('click.datagrid', 'td', function (e) {
        var rowNode, dataRowIdx,
          target = $(e.target);

        if (target.closest('.datagrid-row-detail').length === 1) {
          return;
        }

        self.triggerRowEvent('click', e, true);
        self.setActiveCell(target.closest('td'));

        //Dont Expand rows or make cell editable when clicking expand button
        if (target.is('.datagrid-expand-btn') || (target.is('.datagrid-cell-wrapper') && target.find('.datagrid-expand-btn').length)) {
          rowNode = $(this).closest('tr');
          dataRowIdx = self.dataRowIndex(rowNode);

          self.toggleRowDetail(dataRowIdx);
          self.toggleGroupChildren(rowNode);
          self.toggleChildren(e, dataRowIdx);
          return false;
        }

        var canSelect = self.settings.clickToSelect ? true :
          target.is('.datagrid-selection-checkbox') ||
          target.find('.datagrid-selection-checkbox').length === 1;

        if (target.is('.datagrid-drilldown')) {
          canSelect = false;
        }

        if (canSelect && isMultiple && e.shiftKey) {
          self.selectRowsBetweenIndexes([self.lastSelectedRow, target.closest('tr').index()]);
          e.preventDefault();
        } else if (canSelect) {
          self.toggleRowSelection(target.closest('tr'));
        }

        self.makeCellEditable(self.activeCell.row, self.activeCell.cell, e);

        //Handle Cell Click Event
        var elem = $(this).closest('td'),
          cell = elem.parent().children(':visible').index(elem),
          col = self.columnSettings(cell, true);

        if (col.click && typeof col.click === 'function') {

          var rowElem = $(this).closest('tr'),
            rowIdx = self.dataRowIndex(rowElem),
            item = self.settings.treeGrid ?
              self.settings.treeDepth[rowIdx].node :
              self.settings.dataset[self.pager && self.settings.source ? rowElem.index() : rowIdx];

          if (elem.hasClass('is-focusable')) {
            if (!target.is(self.settings.buttonSelector)) {
              if (!target.parent('button').is(self.settings.buttonSelector)) {
                return;
              }
            }
          }

          if (!elem.hasClass('is-cell-readonly')) {
            col.click(e, [{row: rowIdx, cell: self.activeCell.cell, item: item, originalEvent: e}]);
          }
        }

        //Handle Context Menu on Some
        if (col.menuId) {
          var btn = $(this).find('button');
          btn.popupmenu({attachToBody: true, autoFocus: false, mouseFocus: true,  menuId: col.menuId, trigger: 'immediate', offset: { y: 5 }});

          if (col.selected) {
            btn.on('selected.datagrid', col.selected);
          }
        }

        // Apply Quick Edit Mode
          if (self.isCellEditable(dataRowIdx, cell)) {
            setTimeout(function() {
              if ($('textarea, input', elem).length &&
                  (!$('.dropdown,' +
                  '[type=image],' +
                  '[type=button],' +
                  '[type=submit],' +
                  '[type=reset],' +
                  '[type=checkbox],' +
                  '[type=radio]', elem).length)) {
                self.quickEditMode = true;
              }
            }, 0);
          }

        /* Test Quick Edit Mode without this. Especially Drop Down
          if (self.isCellEditable(dataRowIdx, cell)) {
            setTimeout(function() {
              if (self.isContainTextfield(elem) && self.notContainTextfield(elem)) {
                self.quickEditMode = true;
              }
            }, 0);
          }
         */

      });

      tbody.off('dblclick.datagrid').on('dblclick.datagrid', 'tr', function (e) {
        self.triggerRowEvent('dblclick', e, true);
      });

      //Handle Context Menu Option
      tbody.off('contextmenu.datagrid').on('contextmenu.datagrid', 'tr', function (e) {

        if (!self.isSubscribedTo(e, 'contextmenu')) {
          return;
        }

        self.triggerRowEvent('contextmenu', e, (self.settings.menuId ? true : false));
        e.preventDefault();

        if (self.settings.menuId) {
          $(e.currentTarget).popupmenu({menuId: self.settings.menuId, eventObj: e, trigger: 'immediate'});
        }

        return false;
      });

      // Move the drag handle to the end or start of the column
      this.headerRow
        .off('mousemove.datagrid')
        .on('mousemove.datagrid', 'th', function (e) {
          if (self.dragging) {
            return;
          }

          self.currentHeader = $(e.target).closest('th');

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          var headerDetail = self.currentHeader.closest('.header-detail'),
            extraMargin = headerDetail.length ? parseInt(headerDetail.css('margin-left'), 10) : 0,
            leftEdge = parseInt(self.currentHeader.position().left) - (extraMargin || 0) + self.element.scrollLeft(),
            rightEdge = leftEdge + self.currentHeader.outerWidth(),
            alignToLeft = (e.pageX - leftEdge > rightEdge - e.pageX),
            leftPos = 0;

          //TODO: Test Touch support - may need handles on each column
          leftPos = (alignToLeft ? (rightEdge - 6): (leftEdge - 6));

          //Ignore First Column
          if (self.currentHeader.index() === 0 && !alignToLeft) {
            leftPos = '-999';
          }

          if (!alignToLeft) {
             self.currentHeader = self.currentHeader.prev();
          }

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          self.createResizeHandle();
          self.resizeHandle[0].style.left = leftPos +'px';
          self.resizeHandle[0].style.cursor = '';
        });

      // Handle Clicking Header Checkbox
      this
        .headerRow
        .off('click.datagrid')
        .on('click.datagrid', 'th .datagrid-checkbox', function () {
          var checkbox = $(this);

          if (!checkbox.hasClass('is-checked')) {
            checkbox.addClass('is-checked').attr('aria-checked', 'true');

            self.selectAllRows();

          } else {
            checkbox.removeClass('is-checked').attr('aria-checked', 'true');
            self.unSelectAllRows();
          }
        });

      // Implement Editing Auto Commit Functionality
      tbody.off('focusout.datagrid').on('focusout.datagrid', 'td input, td textarea, div.dropdown', function (e) {

        // Keep icon clickable in edit mode
        var target = e.target;
        if ($(target).is('input.lookup, input.timepicker, input.datepicker')) {
          // Wait for modal popup, if did not found modal popup means
          // icon was not clicked, then commit cell edit
          setTimeout(function() {
            if (!$('.lookup-modal.is-visible, #timepicker-popup, #calendar-popup').length &&
                !!self.editor && self.editor.input.is(target)) {
              self.commitCellEdit(self.editor.input);
            }
          }, 400);
          return;
        }

        //Popups are open
        if ($('#dropdown-list, .autocomplete.popupmenu.is-open, #timepicker-popup').is(':visible')) {
          return;
        }

        if (self.editor && self.editor.input) {
          self.commitCellEdit(self.editor.input);
        }

      });

    },

    //Check if the event is subscribed to
    isSubscribedTo: function (e, eventName) {
      var self = this;

      for (var event in $._data(self.element[0]).events) {
        if (event === eventName) {
          return true;
        }
      }

      return false;
    },

    appendToolbar: function () {
      var toolbar, title = '', more, self = this;

      if (!settings.toolbar) {
        return;
      }

      //Allow menu to be added manually
      if (this.element.parent().find('.toolbar:not(.contextual-toolbar)').length === 1) {
        toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)');
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
          var labelMarkup = $('<label class="audible" for="gridfilter">'+ Locale.translate('Keyword') +'</label>'),
            searchfieldMarkup = $('<input class="searchfield" name="searchfield" placeholder="' + Locale.translate('Keyword') + '" id="gridfilter">');

          buttonSet.append(labelMarkup);

          if (!settings.toolbar.collapsibleFilter) {
            searchfieldMarkup.attr('data-options', '{ collapsible: false }');
          }

          buttonSet.append(searchfieldMarkup);
        }

        if (settings.toolbar.dateFilter) {
          buttonSet.append('<button class="btn" type="button">' + $.createIcon({ icon: 'calendar' }) + '<span>' + Locale.translate('Date') + '</span></button>');
        }

        if (settings.toolbar.actions) {
          more = $('<div class="more"></div>').insertAfter(buttonSet);
          more.append('<button class="btn-actions" title="More" type="button">' + $.createIcon({ icon: 'more' }) + '<span class="audible">Grid Features</span></button>');
          toolbar.addClass('has-more-button');
        }

        var menu = $('<ul class="popupmenu"></ul>');

        if (settings.toolbar.personalize) {
          menu.append('<li><a href="#" data-option="personalize-columns">' + Locale.translate('PersonalizeColumns') + '</a></li>');
        }

        if (settings.toolbar.resetLayout) {
          menu.append('<li><a href="#" data-option="reset-layout">' + Locale.translate('ResetDefault') + '</a></li>');
        }

        if (settings.toolbar.exportToExcel) {
          menu.append('<li><a href="#" data-option="export-to-excel">' + Locale.translate('ExportToExcel') + '</a></li>');
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
          menu.append('<li class="separator single-selectable-section"></li>' +
            '<li class="heading">' + Locale.translate('RowHeight') + '</li>' +
            '<li class="is-selectable' + (this.settings.rowHeight === 'short' ? ' is-checked' : '') + '"><a data-option="row-short">' + Locale.translate('Short') + '</a></li>' +
            '<li class="is-selectable' + (this.settings.rowHeight === 'medium' ? ' is-checked' : '') + '"><a data-option="row-medium">' + Locale.translate('Medium') + '</a></li>' +
            '<li class="is-selectable' + (this.settings.rowHeight === 'normal' ? ' is-checked' : '') + '"><a data-option="row-normal">' + Locale.translate('Normal') + '</a></li>');
        }

        if (settings.toolbar.filterRow) {
          menu.append('<li class="separator"></li>' +
            '<li class="heading">' + Locale.translate('Filter') + '</li>' +
            '<li class="' + (settings.filterable ? 'is-checked ' : '') + 'is-toggleable"><a data-option="show-filter-row">' + Locale.translate('ShowFilterRow') + '</a></li>' +
            '<li class="is-indented"><a data-option="run-filter">' + Locale.translate('RunFilter') + '</a></li>' +
            '<li class="is-indented"><a data-option="clear-filter">' + Locale.translate('ClearFilter') + '</a></li>');
        }

        if (settings.toolbar.actions) {
          more.append(menu);
        }

        if (this.element.prev().is('.contextual-toolbar')) {
          this.element.prev().before(toolbar);
        } else {
          this.element.before(toolbar);
        }
      }

      toolbar.find('.btn-actions').popupmenu().on('selected', function(e, args) {
        var action = args.attr('data-option');
        if (action === 'row-short' || action === 'row-medium' || action === 'row-normal') {
          self.rowHeight(action.substr(4));
        }

        if (action === 'personalize-columns') {
          self.personalizeColumns();
        }

        if (action === 'reset-layout') {
          self.resetColumns();
        }

        if (action === 'export-to-excel') {
          self.exportToExcel();
        }

        //Filter actions
        if (action === 'show-filter-row') {
          self.toggleFilterRow();
        }
        if (action === 'run-filter') {
          self.applyFilter();
        }
        if (action === 'clear-filter') {
          self.clearFilter();
        }
      });

      if (settings.initializeToolbar && !toolbar.data('toolbar')) {
        var opts = $.fn.parseOptions(toolbar);

        if (settings.toolbar.fullWidth) {
          opts.rightAligned = true;
        }

        toolbar.toolbar(opts);
      }

      toolbar.find('.searchfield').off('keypress.datagrid').on('keypress.datagrid', function (e) {
        if (e.keyCode === 13 || e.type==='change') {
          e.preventDefault();
          self.keywordSearch($(this).val());
        }
      });

      this.toolbar = toolbar;
      this.element.addClass('has-toolbar');
    },

    //Get or Set the Row Height
    rowHeight: function(height) {
      if (height) {
        settings.rowHeight = height;
      }

      //TODO: Save in Grid Personalization
      this.element.add(this.table)
        .removeClass('short-rowheight medium-rowheight normal-rowheight')
        .addClass(settings.rowHeight + '-rowheight');

      if (this.virtualRange && this.virtualRange.rowHeight) {
        this.virtualRange.rowHeight = (height === 'normal' ? 40 : (height === 'medium' ? 30 : 25));
      }
      return settings.rowHeight;
    },

    //Search a Term across all columns
    keywordSearch: function(term) {
      this.tableBody.find('tr[role="row"]').removeClass('is-filtered').show();
      this.filterExpr = [];

        this.tableBody.find('.datagrid-expandable-row').each(function () {
          var row = $(this);
          //Collapse All rows
          row.prev().find('.datagrid-expand-btn').removeClass('is-expanded');
          row.prev().find('.plus-minus').removeClass('active');
          row.removeClass('is-expanded').css('display', '');
          row.find('.datagrid-row-detail').css('height', '');
        });

      this.tableBody.find('.search-mode').each(function () {
        var cell = $(this),
          text = cell.text();
        cell.text(text.replace('<i>','').replace('</i>',''));
      });

      if (!term || term.length === 0) {
        this.displayCounts();

        if (this.pager) {
          this.resetPager('sorted');
        }

        return;
      }

      term = term.toLowerCase();
      this.filterExpr.push({column: 'all', operator: 'contains', value: term, ignorecase: 'yes'});

      this.highlightSearchRows(term);
      this.displayCounts();

      if (this.pager) {
        this.pager.setActivePage(1, true);
      }
    },

    highlightSearchRows: function (term) {
      // Move across all visible cells and rows, highlighting
      this.tableBody.find('tr').each(function () {
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
          } else if (found && row.is('.datagrid-expandable-row')) {
            row.prev().show();
            row.prev().find('.datagrid-expand-btn').addClass('is-expanded');
            row.prev().find('.plus-minus').addClass('active');
            row.addClass('is-expanded').css('display', 'table-row');
            row.find('.datagrid-row-detail').css('height', 'auto');
          }

      });

    },

    //Get or Set Selected Rows
    _selectedRows: [],

    selectAllRows: function () {
      var rows = [],
        dataset = this.settings.treeGrid ?
          this.settings.treeDepth : this.settings.dataset;

      for (var i=0, l=dataset.length; i < l; i++) {
        rows.push(i);
      }

      this.dontSyncUi = true;
      this.selectedRows(rows, true, true);
      this.dontSyncUi = false;
      this.syncSelectedUI();
      this.element.triggerHandler('selected', [this._selectedRows , 'selectall']);
    },

    unSelectAllRows: function () {
      this.dontSyncUi = true;
      this.selectedRows([], true, true);
      this.dontSyncUi = false;
      this.syncSelectedUI();
      this.element.triggerHandler('selected', [this._selectedRows, 'deselectall']);
    },

    //Toggle selection on a single row
    selectRow: function (idx, selectAll) {
      var rowNode, dataRowIndex,
        self = this,
        checkbox = null,
        s = this.settings;

      if (idx === undefined || idx === -1 || !s.selectable) {
        return;
      }

      rowNode = this.visualRowNode(idx);
      dataRowIndex = this.dataRowIndex(rowNode);

      if (isNaN(dataRowIndex)) {
        dataRowIndex = idx;
      }

      if (!rowNode) {
        return;
      }

      // if scrolling NOT click on touch device
      if (this.isTouch) {
        rowNode.removeClass('is-active-row')
          .find('td:not(.is-editing)').css({'background-color': 'transparent'});
        return;
      }

      if (s.selectable === 'single' && this._selectedRows.length > 0) {
        this.unselectRow(this._selectedRows[0].idx);
      }

      if (!rowNode.hasClass('is-selected')) {
        var rowData,
          // Select it
          selectNode = function(elem, index, data) {
            checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
            elem.addClass('is-selected').attr('aria-selected', 'true')
              .find('td').attr('aria-selected', 'true');
            checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
              .addClass('is-checked').attr('aria-checked', 'true');
            self._selectedRows.push({idx: index, data: data, elem: elem});
          };

        if (s.treeGrid) {
          if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
            // Select node and node-children
            rowNode.add(rowNode.nextUntil('[aria-level="1"]')).each(function() {
              var elem = $(this),
                index = elem.attr('aria-rowindex') -1,
                data = s.treeDepth[index].node;
              selectNode(elem, index, data);
            });
          }
          // Single element selection
          else {
            rowData = s.treeDepth[self.pager && s.source ? rowNode.index() : dataRowIndex].node;
            selectNode(rowNode, dataRowIndex, rowData);
          }
          self.setNodeStatus(rowNode);
        }
        else {
          rowData = s.dataset[self.pager && s.source ? rowNode.index() : dataRowIndex];
          selectNode(rowNode, dataRowIndex, rowData);
          self.lastSelectedRow = idx;// Rememeber index to use shift key
        }
      }

      this.syncSelectedUI();

      if (!selectAll) {
        this.element.triggerHandler('selected', [this._selectedRows, 'select']);
      }
    },

    dontSyncUi: false,

    // Select rows between indexes
    selectRowsBetweenIndexes: function(indexes) {
      indexes.sort(function(a, b) { return a-b; });
      for (var i = indexes[0]; i <= indexes[1]; i++) {
        this.selectRow(i);
      }
    },

    //Set ui elements based on selected rows
    syncSelectedUI: function () {

      var headerCheckbox = this.headerRow.find('.datagrid-checkbox'),
        s = this.settings;

      //Sync the header checkbox
      if (this._selectedRows.length > 0) {
        headerCheckbox.addClass('is-checked is-partial');
      }

      if (this._selectedRows.length === (s.treeGrid ? s.treeDepth : s.dataset).length) {
        headerCheckbox.addClass('is-checked').removeClass('is-partial');
      }

      if (this._selectedRows.length === 0) {
        headerCheckbox.removeClass('is-checked is-partial');
      }

      //Open or Close the Contextual Toolbar.
      if (this.contextualToolbar.length !== 1 || this.dontSyncUi) {
        return;
      }

      if (this._selectedRows.length === 0) {
        this.contextualToolbar.animateClosed();
      }

      if (this._selectedRows.length > 0 && this.contextualToolbar.height() === 0) {
        this.contextualToolbar.css('display', 'block').one('animateopencomplete.datagrid', function() {
          $(this).triggerHandler('recalculate-buttons');
        }).animateOpen();
      }

    },

    toggleRowSelection: function (idx) {
      var row = (typeof idx === 'number' ? this.tableBody.find('tr[role="row"]').eq(idx) : idx),
        isSingle = this.settings.selectable === 'single',
        rowIndex = (typeof idx === 'number' ? idx : this.dataRowIndex(row));

      if (this.settings.selectable === false) {
        return;
      }

      if (this.editor && row.hasClass('is-selected')) {
        return;
      }

      if (isSingle && row.hasClass('is-selected')) {
        this.unselectRow(rowIndex);
        this._selectedRows = [];
        this.displayCounts();
        return this._selectedRows;
      }

      if (row.hasClass('is-selected')) {
        this.unselectRow(rowIndex);
      } else {
        this.selectRow(rowIndex);
      }

      this.displayCounts();

      return this._selectedRows;
    },

    unselectRow: function (idx, nosync, selectAll) {
      var self = this,
        s = self.settings,
        rowNode = self.visualRowNode(idx),
        checkbox = null,
        selIdx;

      if (!rowNode || idx === undefined) {
        return;
      }

      selIdx = undefined;
      for (var i = 0; i < self._selectedRows.length; i++) {
        if (self._selectedRows[i].idx === idx) {
          selIdx = idx;
        }
      }

      // Unselect it
      var unselectNode = function(elem, index) {
        checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
        elem.removeClass('is-selected').removeAttr('aria-selected')
          .find('td').removeAttr('aria-selected');
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .removeClass('is-checked').attr('aria-checked', 'false');

        var selIdx;
        for (var i = 0; i < self._selectedRows.length; i++) {
          if (self._selectedRows[i].idx === index) {
            selIdx = i;
          }
        }
        if (selIdx !== undefined) {
          self._selectedRows.splice(selIdx, 1);
        }
      };

      if (s.treeGrid) {
        if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
          // Select node and node-children
          rowNode.add(rowNode.nextUntil('[aria-level="1"]')).each(function() {
            var elem = $(this),
              index = elem.attr('aria-rowindex') -1;
            unselectNode(elem, index);
          });
        }
        // Single element unselection
        else {
          unselectNode(rowNode, selIdx);
        }
        self.setNodeStatus(rowNode);
      }
      else {
        unselectNode(rowNode, selIdx);
      }

      if (!nosync) {
        self.syncSelectedUI();
      }

      if (!selectAll) {
        self.element.triggerHandler('selected', [self._selectedRows, 'deselect']);
      }
    },

    setNodeStatus: function(node) {
      var self = this,
        isMultiselect = self.settings.selectable === 'multiple',
        checkbox = self.cellNode(node, self.columnIdxById('selectionCheckbox')),
        nodes;

      // Not multiselect
      if (!isMultiselect) {
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .removeClass('is-checked is-partial').attr('aria-checked', 'false');

        if (node.is('.is-selected')) {
          checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
            .addClass('is-checked').attr('aria-checked', 'true');
        }
        return;
      }

      var setStatus = function (nodes, isFirstSkipped) {
        nodes.each(function() {
          var node = $(this),
            checkbox = self.cellNode(node, self.columnIdxById('selectionCheckbox')),
            status = self.getSelectedStatus(node, isFirstSkipped);

          checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
            .removeClass('is-checked is-partial').attr('aria-checked', 'false');

          if (status === 'mixed') {
            checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
              .addClass('is-checked is-partial').attr('aria-checked', 'mixed');
          }
          else if (status) {
            checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
              .addClass('is-checked').attr('aria-checked', 'true');
          }
        });
      };

      // Multiselect
      nodes = node.add(node.nextUntil('[aria-level="1"]')).filter('.datagrid-tree-parent');
      setStatus(nodes);

      nodes = node;
      if (+node.attr('aria-level') > 1) {
        nodes = nodes.add(node.prevUntil('[aria-level="1"]'))
        .add(node.prevAll('[aria-level="1"]:first'));
      }
      nodes = nodes.filter('.datagrid-tree-parent');
      setStatus(nodes);
    },

    getSelectedStatus: function(node) {
      var status,
        total = 0,
        selected = 0,
        unselected = 0;

      node.add(node.nextUntil('[aria-level="1"]')).each(function() {
        total++;
        if ($(this).is('.is-selected')) {
          selected++;
        } else {
          unselected++;
        }
      });

      status = ((total === selected) ? true : ((total === unselected) ? false : 'mixed'));
      return status;
    },

    //Set the selected rows by passing the row index or an array of row indexes
    selectedRows: function (row, nosync, selectAll) {
      var idx = -1,
          isSingle = this.settings.selectable === 'single',
          isMultiple = this.settings.selectable === 'multiple',
          dataset = this.settings.treeGrid ?
            this.settings.treeDepth : this.settings.dataset;

      if (!row) {
        return this._selectedRows;
      }

      if (row.length === 0 && this._selectedRows.length === 0) {
        return;
      }

      if (isSingle) {
        //Unselect
        if (this._selectedRows[0]) {
          this.unselectRow(this._selectedRows[0].idx, nosync, selectAll);
        }

        //Select - may be passed array or int
        idx = ((Object.prototype.toString.call(row) === '[object Array]' ) ? row[0] : row.index());
        this.selectRow(idx, selectAll);
      }

      if (isMultiple) {
        if (Object.prototype.toString.call(row) === '[object Array]' ) {
          for (var i = 0; i < row.length; i++) {
            this.selectRow(row[i], selectAll);
          }

          if (row.length === 0) {
            for (var j=0, l=dataset.length; j < l; j++) {
              this.unselectRow(j, nosync, selectAll);
            }
            this._selectedRows = [];
          }

        } else {
          this.selectRow(row.index(), selectAll);
        }
      }

      this.displayCounts();

      return this._selectedRows;
    },

    //Set the row status
    rowStatus: function(idx, status, tooltip) {
      var rowStatus;

      if (!status) {
        delete this.settings.dataset[idx].rowStatus;
        this.updateRow(idx);
        return;
      }

      if (!this.settings.dataset[idx]) {
        return;
      }

      this.settings.dataset[idx].rowStatus = {};
      rowStatus = this.settings.dataset[idx].rowStatus;

      rowStatus.icon = status;
      status = status.charAt(0).toUpperCase() + status.slice(1);
      status = status.replace('-progress', 'Progress');
      rowStatus.text = Locale.translate(status);

      tooltip = tooltip ? tooltip.charAt(0).toUpperCase() + tooltip.slice(1) : rowStatus.text;
      rowStatus.tooltip = tooltip;

      this.updateRow(idx);
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
      self.headerTable.on('keydown.datagrid', 'th', function (e) {
        var key = e.which || e.keyCode || e.charCode || 0,
          th = $(this),
          index = th.siblings(':visible').addBack().index(th),
          last = self.visibleColumns().length -1,
          triggerEl, move;

        if ($(e.target).closest('.popupmenu').length > 0) {
          return;
        }

        // Enter or Space
        if (key === 13 || key === 32) {
          triggerEl = (isMultiple && index === 0) ? $('.datagrid-checkbox', th) : th;
          triggerEl.trigger('click.datagrid').focus();

          if (key === 32) { // Prevent scrolling with space
            e.preventDefault();
          }
        }

        //Press Home, End, Left and Right arrow to move to first, last, previous or next
        if ([35, 36, 37, 39].indexOf(key) !== -1) {
          move = index;

          //Home, End or Ctrl/Meta + Left/Right arrow to move to the first or last
          if (/35|36/i.test(key) || ((e.ctrlKey || e.metaKey) && /37|39/i.test(key))) {
            if (Locale.isRTL()) {
              move = (key === 36 || ((e.ctrlKey || e.metaKey) && key === 37)) ? last : 0;
            } else {
              move = (key === 35 || ((e.ctrlKey || e.metaKey) && key === 39)) ? last : 0;
            }
          }

          // Left and Right arrow
          else {
            if (Locale.isRTL()) {
              move = key === 39 ? (index > 0 ? index-1 : index) : (index < last ? index+1 : last);
            } else {
              move = key === 37 ? (index > 0 ? index-1 : index) : (index < last ? index+1 : last);
            }
          }

          // Making move
          th.removeAttr('tabindex').removeClass('is-active');
          $('th:not(.is-hidden)', this.header).eq(move).attr('tabindex', '0').addClass('is-active').focus();
          e.preventDefault();
        }

        // Down arrow
        if (key === 40) {
          th.removeAttr('tabindex');
          self.activeCell.node = self.cellNode(0, self.settings.groupable ? 0 : self.activeCell.cell, true).attr('tabindex', '0').focus();
          e.preventDefault();
        }

      });

      //Handle Editing / Keyboard
      self.table.on('keydown.datagrid', 'td, input', function (e) {
        var key = e.which || e.keyCode || e.charCode || 0,
          handled = false;

        // F2 - toggles actionableMode "true" and "false"
        if (key === 113) {
          self.settings.actionableMode = self.settings.actionableMode ? false : true;
          handled = true;
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });

      //Press PageUp or PageDown to open the previous or next page and set focus to the first row.
      //Press Alt+Up or Alt+Down to set focus to the first or last row on the current page.
      //Press Alt+PageUp or Alt+PageDown to open the first or last page and set focus to the first row.

      //Handle rest of the keyboard
      self.table.on('keydown.datagrid', 'td', function (e) {
        var key = e.which || e.keyCode || e.charCode || 0,
          handled = false,
          isRTL = Locale.isRTL(),
          node = self.activeCell.node,
          rowNode = $(this).parent(),
          prevRow = rowNode.prevAll(':not(.is-hidden, .datagrid-expandable-row)').first(),
          nextRow = rowNode.nextAll(':not(.is-hidden, .datagrid-expandable-row)').first(),
          row = self.activeCell.row,
          cell = self.activeCell.cell,
          col = self.columnSettings(cell),
          item = self.settings.dataset[self.dataRowIndex(node)],
          visibleRows = self.tableBody.find('tr:visible'),
          getVisibleRows = function(index) {
            var row = visibleRows.eq(index);
            if (row.is('.datagrid-rowgroup-header')) {
              return row.index();
            }
            return self.dataRowIndex(row);
          },
          getNextVisibleCell = function(currentCell, lastCell, prev) {
            var nextCell = currentCell + (prev ? -1 : +1);

            if (nextCell > lastCell) {
             return lastCell;
            }

            while (self.settings.columns[nextCell] && self.settings.columns[nextCell].hidden) {
              nextCell = prev ? nextCell-1 : nextCell+1;
            }
            return nextCell;
          },
          isSelectionCheckbox = !!($('.datagrid-selection-checkbox', node).length),
          lastRow, lastCell;

        lastCell = self.settings.columns.length-1;
        lastRow = visibleRows.last();

        //Tab, Left and Right arrow keys.
        if ([9, 37, 39].indexOf(key) !== -1) {
          if (key === 9 && !self.settings.actionableMode) {
            return;
          }

          if (key !== 9 && e.altKey) {
            //[Alt + Left/Right arrow] to move to the first or last cell on the current row.
            cell = ((key === 37 && !isRTL) || (key === 39 && isRTL)) ? 0 : lastCell;
            self.setActiveCell(row, cell);
          }
          //Tab, Shift-tab, Left and Right arrow keys to navigate by cell.
          else if (!self.quickEditMode || (key === 9)) {
            if ((!isRTL && (key === 37 || key === 9 && e.shiftKey)) ||
                (isRTL && (key === 39 || key === 9))) {
              cell = getNextVisibleCell(cell, lastCell, true);
            } else {
              cell = getNextVisibleCell(cell, lastCell);
            }
            self.setActiveCell(row, cell);
            self.quickEditMode = false;
            handled = true;
          }
        }

        //Up arrow key
        if (key === 38 && !self.quickEditMode) {
          //Press [Control + Up] arrow to move to the first row on the first page.
          if (e.altKey || e.metaKey) {
            self.setActiveCell(getVisibleRows(0), cell);
            handled = true;
          } else { //Up arrow key to navigate by row.

            if (row === 0 && !prevRow.is('.datagrid-rowgroup-header')) {
              node.removeAttr('tabindex');
              self.headerRow.find('th').eq(cell).attr('tabindex', '0').focus();
              return;
            }
            self.setActiveCell(prevRow, cell);
            handled = true;
          }
        }

        //Down arrow key
        if (key === 40 && !self.quickEditMode) {
          //Press [Control + Down] arrow to move to the last row on the last page.
          if (e.altKey|| e.metaKey) {
            self.setActiveCell(lastRow, cell);
            handled = true;
          } else { //Down arrow key to navigate by row.
            self.setActiveCell(nextRow, cell);
            handled = true;
          }
        }

        //Press Control+Spacebar to announce the current row when using a screen reader.
        if (key === 32 && e.ctrlKey && node) {
          var string = '';
          row = node.closest('tr');

          row.children().each(function () {
            var cell = $(this);
            //Read Header
            //string += $('#' + cell.attr('aria-describedby')).text() + ' ' + cell.text() + ' ';
            string += cell.text() + ' ';
          });

          $('body').toast({title: '', audibleOnly: true, message: string});
          handled = true;
        }

        //Press Home or End to move to the first or last cell on the current row.
        if (key === 36) {
          self.setActiveCell(row, 0);
          handled = true;
        }

        //Home to Move to the end of the current row
        if (key === 35) {
          self.setActiveCell(row, lastCell);
          handled = true;
        }

        //End to Move to last row of current cell
        if (key === 34) {
          self.setActiveCell(lastRow, cell);
          handled = true;
        }

        //End to Move to first row of current cell
        if (key === 33) {
          self.setActiveCell(getVisibleRows(0), cell);
          handled = true;
        }

        // For mode 'Selectable':
        // Press Space to toggle row selection, or click to activate using a mouse.
        if (key === 32 && (!self.settings.editable || isSelectionCheckbox)) {
          row = node.closest('tr');

          if ($(e.target).closest('.datagrid-row-detail').length === 1) {
            return;
          }
          e.preventDefault();

          // Toggle datagrid-expand with Space press
          var btn = $(e.target).find('.datagrid-expand-btn, .datagrid-drilldown');
          if (btn && btn.length) {
            btn.trigger('click.datagrid');
            e.preventDefault();
            return;
          }

          if (isMultiple && e.shiftKey) {
            self.selectRowsBetweenIndexes([self.lastSelectedRow, row.index()]);
          } else {
            self.toggleRowSelection(row);
          }

        }

        // For Editable mode - press Enter or Space to edit or toggle a cell, or click to activate using a mouse.
        if (self.settings.editable && key === 32) {
          if (!self.editor) {
            self.makeCellEditable(row, cell, e);
          }
        }

        // if column have click function to fire [ie. action button]
        if (key === 13 && col.click && typeof col.click === 'function') {
          if (!node.hasClass('is-cell-readonly')) {
            col.click(e, [{row: row, cell: cell, item: item, originalEvent: e}]);
          }
        }

        if (self.settings.editable && key === 13) {
          //Allow shift to add a new line
          if ($(e.target).is('textarea') && e.shiftKey) {
            return;
          }

          if (self.editor) {
            self.quickEditMode = false;
            self.commitCellEdit(self.editor.input);
            self.setNextActiveCell(e);
          }
          else {
            self.makeCellEditable(row, cell, e);
            if (self.isContainTextfield(node) && self.notContainTextfield(node)) {
              self.quickEditMode = true;
            }
          }
          handled = true;
        }

        //Any printable character - well make it editable
        if ([9, 13, 32, 35, 36, 37, 38, 39, 40, 113].indexOf(key) === -1 &&
          !e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && self.settings.editable) {
          if (!self.editor) {
            self.makeCellEditable(row, cell, e);
          }
        }

        // If multiSelect is enabled, press Control+A to toggle select all rows
        if (isMultiple && !self.editor && ((e.ctrlKey || e.metaKey) && key === 65)) {
          checkbox
            .addClass('is-checked')
            .removeClass('is-partial')
            .attr('aria-checked', 'true');
          self.selectAllRows();
          handled = true;
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

      });
    },

    isContainTextfield: function(container) {
      var noTextTypes = ['image', 'button', 'submit', 'reset', 'checkbox', 'radio'],
        selector = 'textarea, input',
        l = noTextTypes.length, i;

      selector += l ? ':not(' : '';
      for(i = 0; i < l; i++) {
        selector += '[type='+ noTextTypes[i] +'],';
      }
      selector = l ? (selector.slice(0, -1) + ')') : '';

      return !!($(selector, container).length);
    },

    notContainTextfield: function(container) {
      var selector = '.dropdown, .datepicker';
      return !($(selector, container).length);
    },

    //Current Cell Editor thats in Use
    editor: null,

    isCellEditable: function(row, cell) {
      if (!this.settings.editable) {
        return false;
      }

      var col = this.columnSettings(cell);
      if (col.readonly) {
        return false;
      }

      //Check if cell is editable via hook function
      var cellNode = this.activeCell.node.find('.datagrid-cell-wrapper'),
        cellValue = (cellNode.text() ? cellNode.text() : this.fieldValue(this.settings.dataset[row], col.field));

      if (col.isEditable) {
        var canEdit = col.isEditable(row, cell, cellValue, col, this.settings.dataset[row]);

        if (!canEdit) {
          return false;
        }
      }

      if (!col.editor) {
        return false;
      }

      return true;
    },

    // Invoked in three cases: 1) a row click, 2) keyboard and enter, 3) In actionable mode and tabbing
    makeCellEditable: function(row, cell, event) {
      if (this.editor && this.editor.input) {
        if (this.editor.input.is('.timepicker, .datepicker, .lookup') && !$(event.target).prev().is(this.editor.input)) {
          this.commitCellEdit(this.editor.input);
        }
      }

      //Locate the Editor
      var col = this.columnSettings(cell);

      //Select the Rows if the cell is editable
      if (!col.editor) {
        if (event.keyCode === 32 && !$(event.currentTarget).find('.datagrid-selection-checkbox').length) {
          this.toggleRowSelection(this.activeCell.node.closest('tr'));
        }
        return;
      }

      // Put the Cell into Focus Mode
      this.setActiveCell(row, cell);

      var dataRowIndex = this.dataRowIndex(this.dataRowNode(row)),
        rowData = this.settings.treeGrid ?
          this.settings.treeDepth[dataRowIndex].node :
          this.settings.dataset[dataRowIndex],
        cellNode = this.activeCell.node.find('.datagrid-cell-wrapper'),
        cellParent = cellNode.parent('td'),
        cellWidth = cellParent.outerWidth(),
        cellValue = (cellNode.text() ?
          cellNode.text() : this.fieldValue(rowData, col.field));

      if (!this.isCellEditable(dataRowIndex, cell)) {
        return;
      }

      if (cellParent.hasClass('is-editing')) {
        //Already in edit mode
        //Editor.focus
        cellNode.find('input').focus();
        return false;
      }

      //Editor.init
      cellParent
        .addClass('is-editing')
        .css({'max-width': cellWidth, 'min-width': cellWidth, 'width': cellWidth});
      cellNode.empty();
      this.editor = new col.editor(dataRowIndex, cell, cellValue, cellNode, col, event, this, rowData);

      if (this.editor.useValue) {
        cellValue = this.fieldValue(rowData, col.field);
      }
      this.editor.val(cellValue);
      this.editor.focus();
      this.element.triggerHandler('entereditmode');
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
      this.updateCellNode(this.dataRowIndex(cellNode.parent()) , cellNode.index(), newValue);
      this.element.triggerHandler('exiteditmode');
    },

    //Validate a particular cell if it has validation on the column and its visible
    validateCell: function (row, cell) {
      var self = this,
        column = this.columnSettings(cell),
        validate = column.validate;

      if (!validate) {
        return;
      }

      var rules = column.validate.split(' '),
        validator = $.fn.validation,
        cellValue = this.fieldValue(this.settings.dataset[row], column.field),
        isValid = true,
        messages = '';

      for (var i = 0; i < rules.length; i++) {
        var rule = validator.rules[rules[i]],
          gridInfo = {row: row, cell: cell, item: this.settings.dataset[row], column: column, grid: self},
          ruleValid = rule.check(cellValue, $('<input>').val(cellValue), gridInfo);

        if (!ruleValid) {
          messages += rule.message;
          isValid = false;
        }
      }

      if (!isValid) {
        self.showCellError(row, cell, messages);
        self.element.trigger('cellerror', {row: row, cell: cell, message: messages, target: this.cellNode(row, cell), value: cellValue, column: column});
      } else {
        self.clearCellError(row, cell);
      }

    },

    showCellError: function (row, cell, errorMessage) {
      var node = this.cellNode(row, cell);

      if (!node.length) {
        return;
      }

      //Add icon and classes
      node.addClass('error').attr('data-errormessage', errorMessage);
      var icon = $($.createIcon({ classes: ['icon-error'], icon: 'error' }));

      //Add and show tooltip
      if (node.find('.icon-error').length === 0) {
        node.find('.datagrid-cell-wrapper').append(icon);
        icon.tooltip({placement: 'bottom', isErrorColor: true, content: errorMessage});
        icon.data('tooltip').show();
      }

    },

    clearCellError: function (row, cell) {
      var node = this.cellNode(row, cell);

      if (!node.length) {
        return;
      }

      node.removeClass('error').removeAttr('data-errormessage');
      node.find('.icon-error').remove();
    },

    clearRowError: function (row) {
      var rowNode = this.dataRowNode(row);

      rowNode.removeClass('error alert');
      this.rowStatus(row, '', '');
    },

    clearAllErrors: function () {
      this.tableBody.find('td.error').each(function () {
        var node = $(this);
        node.removeClass('error').removeAttr('data-errormessage');
        node.find('.icon-error').remove();
      });
    },

    //Validate all visible cells in a row if they have validation on the column
    //Row Id, Error Text and 'error' or 'alert' (default alert)
    showRowError: function (row, message, type) {
      var messageType = type || 'error',
        rowNode = this.dataRowNode(row);

      rowNode.addClass('error');
      this.rowStatus(row, messageType, message);
    },

    //Validate all visible cells in a row if they have validation on the column
    //Row Id, Error Text and 'error' or 'alert' (default alert)
    validateRow: function (row) {
      for (var i = 0; i < this.settings.columns.length; i++) {
        this.validateCell(row, i);
      }
    },

    //Validate all rows and cells with validation on them
    validateAll: function () {
      for (var j = 0; j < this.settings.dataset.length; j++) {
        for (var i = 0; i < this.settings.columns.length; i++) {
          this.validateCell(j, i);
        }
      }
    },

    columnSettings: function (cell, onlyVisible) {
      var column = settings.columns[cell];

      if (onlyVisible) {
        column = this.visibleColumns()[cell];
      }

      return column || {};
    },

    //Attempt to serialize the value back into the dataset
    coerceValue: function (value, oldVal, col, row, cell) {
      var newVal;

      if (col.serialize) {
        newVal = col.serialize(value, oldVal, col, row, cell, this.settings.dataset[row]);
        return newVal;
      }

      return newVal;
    },

    updateCell: function(row, cell, value) {
      var col = this.columnSettings(cell);

      if (value === undefined) {
        value = this.fieldValue(this.settings.dataset[row], col.field);
      }

      this.updateCellNode(row, cell, value, true);
    },

    updateCellNode: function (row, cell, value, fromApiCall) {
      var coercedVal, escapedVal,
        rowNode = this.visualRowNode(row),
        cellNode = rowNode.find('td').eq(cell),
        col = this.settings.columns[cell],
        formatted = '',
        formatter = (col.formatter ? col.formatter : this.defaultFormatter),
        isTreeGrid = this.settings.treeGrid,
        rowData = isTreeGrid ?
          this.settings.treeDepth[row].node :
          this.settings.dataset[row];

      var oldVal = (col.field ? rowData[col.field] : '');

      //Coerce/Serialize value if from cell edit
      if (!fromApiCall) {
        coercedVal = this.coerceValue(value, oldVal, col, row, cell);

        //coerced value may be coerced to empty string, null, or 0
        if (coercedVal === undefined) {
          coercedVal = value;
        }
      } else {
        coercedVal = value;
      }

      //Setup/Sync tooltip
      if (cellNode.data('tooltip')){
        cellNode.data('tooltip').destroy();
      }

      //Update the value in the dataset
      if (col.id === 'rowStatus' && rowData.rowStatus && rowData.rowStatus.tooltip) {
        cellNode.attr('title', rowData.rowStatus.tooltip);
        cellNode.tooltip({placement: 'right',
          isErrorColor: rowData.rowStatus.icon === 'error'
        });
      }

      coercedVal = $.unescapeHTML(coercedVal);

      if (col.field && coercedVal !== oldVal) {
        if (col.field.indexOf('.') > -1 ) {
          var parts = col.field.split('.');
          if (parts.length === 2) {
            rowData[parts[0]][parts[1]] = coercedVal;
          }

          if (parts.length === 3) {
            rowData[parts[0]][parts[1]][parts[2]] = coercedVal;
          }

        } else {
          rowData[col.field] = coercedVal;
        }
      }

      //update cell value
      escapedVal = $.escapeHTML(coercedVal);
      formatted = this.formatValue(formatter, (isTreeGrid ? row+1 : row), cell, escapedVal, col, rowData);

      if (col.contentVisible) {
        var canShow = col.contentVisible(row, cell, escapedVal, col, rowData);
        if (!canShow) {
          formatted = '';
        }
      }

      cellNode.find('.datagrid-cell-wrapper').html(formatted);

      if (coercedVal !== oldVal && !fromApiCall) {
        //Validate the cell
        this.validateCell(row, cell);

        var args = {row: row, cell: cell, target: cellNode, value: coercedVal, oldValue: oldVal, column: col};
        if (this.settings.treeDepth[row]) {
          args.rowData = this.settings.treeDepth[row].node;
        }
        this.element.trigger('cellchange', args);
      }

    },

    //For the row node get the index - adjust for paging / invisible rowsCache
    visualRowIndex: function (row) {
      var rowIdx = (row.attr('aria-rowindex')-1);
      if (this.pager) {
        rowIdx = rowIdx - ((this.pager.activePage -1) * this.settings.pagesize);
      }

      if (isNaN(rowIdx)) {  //Grouped Rows
        return row.index();
      }
      return rowIdx;
    },

    visualRowNode: function (idx) {
      var node = this.tableBody.find('tr[aria-rowindex="'+ (idx + 1) +'"]');

      return node;
    },

    dataRowNode: function (idx) {
      var node = this.tableBody.find('tr[aria-rowindex]').eq(idx);

      return node;
    },

    dataRowIndex: function (row) {
     var rowIdx = (row.attr('aria-rowindex')-1);

     return rowIdx;
    },

    // Update a specific Cell
    setActiveCell: function (row, cell) {
      var self = this,
        prevCell = self.activeCell,
        rowElem = row, rowNum,
        isGroupRow = row instanceof jQuery && row.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');

      if (row instanceof jQuery && row.length === 0) {
        return;
      }

      if (typeof row === 'number') {
        rowNum = row;
      }

      //Support passing the td in
      if (row instanceof jQuery && row.is('td')) {
        isGroupRow = row.parent().is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
        if (isGroupRow) {
          rowElem = row.parent();
        }
        cell = isGroupRow ? 0 : row.index();
        rowNum = isGroupRow ? 0 : this.visualRowIndex(row.parent());
      }

      if (row instanceof jQuery && row.is('tr')) {
        rowNum = this.visualRowIndex(row);
      }

      if (rowNum < 0 || cell < 0) {
        return;
      }

      //Remove previous tab index
      if (prevCell.node && prevCell.node.length ===1) {
        self.activeCell.node.removeAttr('tabindex');
      }

      //Hide any cell tooltips (Primarily for validation)
      if (prevCell.cell !== cell || prevCell.row !== row) {
        $('#tooltip').hide();
      }

      //Find the cell if it exists
      self.activeCell.node = self.cellNode((isGroupRow ? rowElem: rowNum), (isGroupRow ? 0 : cell)).attr('tabindex', '0');

      if (self.activeCell.node && prevCell.node.length === 1) {
        self.activeCell.row = rowNum;
        self.activeCell.cell = cell;
      } else {
        self.activeCell = prevCell;
      }

      if (!$('input, button:not(.datagrid-expand-btn, .datagrid-drilldown, .btn-icon)', self.activeCell.node).length) {
        self.activeCell.node.focus();
      }
      if (self.activeCell.node.hasClass('is-focusable')) {
        self.activeCell.node.find('button').focus();
      }

      if (isGroupRow) {
        self.activeCell.node.find('td:visible:first').attr('tabindex', '0').focus();
      }

      if (isGroupRow && self.activeCell.node && prevCell.node) {
        var colSpan = self.activeCell.node.attr('colspan');
        if (colSpan >= prevCell.cell) {
          self.activeCell.node = self.activeCell.node.parent().find('td').eq((prevCell.cell - colSpan) + 1);
          self.activeCell.node.attr('tabindex', '0').focus();
        }
      }

      if (this.settings.cellNavigation) {
        var headers = self.headerNodes();
        headers.removeClass('is-active');
        headers.eq(cell).addClass('is-active');
      }
      this.activeCell.isFocused = true;

      self.element.trigger('activecellchange', [{node: this.activeCell.node, row: this.activeCell.row, cell: this.activeCell.cell}]);
    },

    setNextActiveCell: function (e) {
      if (e.type === 'keydown') {
        if (this.settings.actionableMode) {
          var evt = $.Event('keydown.datagrid');
          evt.keyCode = 40; // move down
          this.activeCell.node.trigger(evt);
        }
        else {
          this.setActiveCell(this.activeCell.row, this.activeCell.cell);
        }
      }
    },

    // Add children to treegrid dataset
    addChildren: function(parent, data) {
      if (!data || (data && !data.length) || parent < 0) {
        return;
      }
      var node = this.settings.treeDepth[parent].node;
      node.children = node.children || [];

      // Make sure it's not reference pointer to data object, make copy of data
      data = JSON.parse(JSON.stringify(data));

      for (var i = 0, len = data.length; i < len; i++) {
        node.children.push(data[i]);
      }
      this.updateDataset(this.settings.dataset);
    },

    // Set expanded property in Dataset
    setExpandedInDataset: function(dataRowIndex, isExpanded) {
      this.settings.treeDepth[dataRowIndex].node.expanded = isExpanded;
    },

    //expand the tree rows
    toggleChildren: function(e, dataRowIndex) {
      var self = this,
        rowElement = this.visualRowNode(dataRowIndex),
        expandButton = rowElement.find('.datagrid-expand-btn'),
        level = rowElement.attr('aria-level'),
        children = rowElement.nextUntil('[aria-level="1"]'),
        isExpanded = expandButton.hasClass('is-expanded'),
        restCollapsed = false,
        args = [{grid: self, row: dataRowIndex, item: rowElement, children: children}];

      if (self.settings.treeDepth[dataRowIndex]) {
        args[0].rowData = self.settings.treeDepth[dataRowIndex].node;
      }

      if (!rowElement.hasClass('datagrid-tree-parent') ||
          (!$(e.target).is(expandButton) &&
            (self.settings.editable || self.settings.selectable))) {
        return;
      }

      var toggleExpanded = function() {
        rowElement = self.visualRowNode(dataRowIndex);
        expandButton = rowElement.find('.datagrid-expand-btn');
        children = rowElement.nextUntil('[aria-level="1"]');

        if (isExpanded) {
          rowElement.attr('aria-expanded', false);
          expandButton.removeClass('is-expanded')
            .find('.plus-minus').removeClass('active');
        } else {
          rowElement.attr('aria-expanded', true);
          expandButton.addClass('is-expanded')
            .find('.plus-minus').addClass('active');
        }
        self.setExpandedInDataset(dataRowIndex, !isExpanded);

        children.each(function () {
          var node = $(this);

          if (node.hasClass('datagrid-tree-parent') &&
            node.attr('aria-level') > level) {
            restCollapsed = node.find('.datagrid-expand-btn.is-expanded').length === 0;
            node[isExpanded ? 'addClass' : 'removeClass']('is-hidden');
            return;
          }

          if (restCollapsed) {
            node.addClass('is-hidden');
            return;
          }

          if (node.attr('aria-level') > level) {
            node[isExpanded ? 'addClass' : 'removeClass']('is-hidden');
          }

          if (node.attr('aria-level') === level) {
            return false;
          }
        });
        self.setAlternateRowShading();
      };

      $.when(self.element.triggerHandler(isExpanded ? 'collapserow' : 'expandrow', args)).done(function() {
        toggleExpanded();
      });
    },

    //Expand Detail Row Or Tree Row
    toggleRowDetail: function(dataRowIndex) {

      var self = this,
        rowElement = self.visualRowNode(dataRowIndex),
        expandRow = rowElement.next(),
        expandButton = rowElement.find('.datagrid-expand-btn'),
        detail = expandRow.find('.datagrid-row-detail'),
        item = self.settings.dataset[dataRowIndex];

      if (rowElement.hasClass('datagrid-tree-parent')) {
        return;
      }

      if (expandRow.hasClass('is-expanded')) {
        expandRow.removeClass('is-expanded');
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');

        detail.animateClosed().on('animateclosedcomplete', function () {
          expandRow.css('display', 'none');
          self.element.triggerHandler('collapserow', [{grid: self, row: dataRowIndex, detail: detail, item: item}]);
        });

      } else {
        expandRow.addClass('is-expanded');
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');

        expandRow.css('display', 'table-row');

        //Optionally Contstrain the width
        expandRow.find('.constrained-width').css('max-width', this.element.outerWidth());

        detail.animateOpen();
        self.element.triggerHandler('expandrow', [{grid: self, row: dataRowIndex, detail: detail, item: item}]);
      }
    },

    toggleGroupChildren: function(rowElement) {
      if (!this.settings.groupable) {
        return;
      }

      var self = this,
        children = rowElement.nextUntil('.datagrid-rowgroup-header'),
        expandButton = rowElement.find('.datagrid-expand-btn');

      if (rowElement.hasClass('is-expanded')) {
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');

        children.hide();
        children.addClass('is-hidden');
        self.element.triggerHandler('collapserow', [{grid: self, row: rowElement.index(), detail: children, item: {}}]);

        rowElement.removeClass('is-expanded');
      } else {
      expandButton.addClass('is-expanded')
        .find('.plus-minus').addClass('active');

        children.show();
        children.removeClass('is-hidden');
        self.element.triggerHandler('expandrow', [{grid: self, row: rowElement.index(), detail: children, item: {}}]);

        rowElement.addClass('is-expanded');
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
      this.sortColumn.sortField = (this.columnById(id)[0] ? this.columnById(id)[0].field : id);

      if (this.originalDataset) {
        this.settings.dataset = this.originalDataset;
      }

      //Do Sort on Data Set
      this.setSortIndicator(id, ascending);
      sort = this.sortFunction(this.sortColumn.sortId, ascending);

      if (!this.settings.disableClientSort) {
        settings.dataset.sort(sort);
      }

      var wasFocused = this.activeCell.isFocused;
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.renderRows();
      // Update selected and Sync header checkbox
      this.updateSelected();
      this.syncSelectedUI();

      if (wasFocused && this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }

      this.resetPager('sorted');
      this.tableBody.removeClass('is-loading');
      this.element.trigger('sorted', [this.sortColumn]);
    },

    setSortIndicator: function(id, ascending) {
      //Set Visual Indicator
      this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc').attr('aria-sort', 'none');
      this.headerRow.find('[data-column-id="' +id + '"]')
        .addClass(ascending ? 'is-sorted-asc' : 'is-sorted-desc')
        .attr('aria-sort', ascending ? 'ascending' : 'descending');
    },

    //Overridable function to conduct sorting
    sortFunction: function(id, ascending) {
      var column = this.columnById(id),
        field = column.length === 0 ? id : column[0].field; //Assume the field and id match if no column found

      var key, self = this,
      primer = function(a) {
        a = (a === undefined || a === null ? '' : a);

        if (typeof a === 'string') {
          a = a.toUpperCase();

          if ($.isNumeric(a)) {
            a = parseFloat(a);
          }

        }
        return a;
      };

      key = function(x) { return primer(self.fieldValue(x, field)); };

      ascending = !ascending ? -1 : 1;

      return function (a, b) {
        a = key(a);
        b = key(b);

        if (typeof a !== typeof b) {
          a = a.toString().toLowerCase();
          b = b.toString().toLowerCase();
        }

        return ascending * ((a > b) - (b > a));
      };
    },

    // Update Selection
    updateSelected: function() {
      var self = this;

      $('tr[role="row"]', self.tableBody).each(function() {
        var row = $(this),
          newIdx = self.dataRowIndex(row),
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
      return ((value === null || value === undefined || value === '') ? '' : value.toString());
    },

    //Handle Adding Paging
    handlePaging: function () {
      var self = this;

      if (!this.settings.paging) {
        return;
      }

      var pagerElem = this.tableBody;
      this.element.addClass('paginated');
      pagerElem.pager({
        componentAPI: this,
        dataset: this.settings.dataset,
        source: this.settings.source,
        pagesize: this.settings.pagesize,
        indeterminate: this.settings.indeterminate,
        rowTemplate: this.settings.rowTemplate,
        pagesizes: this.settings.pagesizes
      });
      this.pager = pagerElem.data('pager');

      pagerElem.on('afterpaging', function (e, args) {

        self.displayCounts(args.total);

        //Handle row selection across pages
        self.updateSelected();
        self.syncSelectedUI();

        if (self.filterExpr && self.filterExpr[0] && self.filterExpr[0].column === 'all') {
          self.highlightSearchRows(self.filterExpr[0].value);
        }
      });

    },

    refreshPagerState: function (pagingInfo) {
      if (!this.pager) {
        return;
      }

      if (pagingInfo) {
        this.pager.activePage = pagingInfo.activePage;
      }

      if (pagingInfo) {
        this.pager.updatePagingInfo(pagingInfo);
      }
    },

    renderPager: function (pagingInfo, isResponse) {
      if (!this.pager) {
        return;
      }

      this.refreshPagerState(pagingInfo);

      this.pager.renderBar();
      if (!isResponse) {
        this.pager.renderPages(pagingInfo.type);
      }

      // Update selected and Sync header checkbox
      this.updateSelected();
      this.syncSelectedUI();
    },

    //Reset the pager to page 1
    resetPager: function(type) {
      if (!this.pager) {
        return;
      }

      if (!this.pager.pagingInfo) {
        this.pager.pagingInfo = {};
      }

      this.pager.pagingInfo.type = type;
      this.pager.pagingInfo.activePage = 1;
      this.renderPager(this.pager.pagingInfo);
    },

    destroy: function() {
      //Remove the toolbar, clean the div out and remove the pager
      this.element.off().empty().removeClass('datagrid-container');
      this.element.prev('.toolbar').remove();
      this.element.next('.pager-toolbar').remove();
      $.removeData(this.element[0], pluginName);

      //TODO Test Memory Leaks in Chrome - null out fx this.table
      $(document).off('touchstart.datagrid touchend.datagrid touchcancel.datagrid click.datagrid touchmove.datagrid');
      this.contentContainer.off().remove();
      $('body').off('resize.vtable');

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
