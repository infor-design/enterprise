/**
* A object containing all the supported UI formatters.
* @private
*/
window.Formatters = {

  Text: function(row, cell, value) {
    var str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  },

  Input: function(row, cell, value, col) {
    if (col.inlineEditor) {
      var html = '<label for="datagrid-inline-input-' + row + '-' + cell +'" class="audible">'+ col.name +'</label>'+
          '<input id="datagrid-inline-input-' + row + '-' + cell +'" class="'+ (col.align === 'right' ? 'is-number-mask': '') + '" value="'+ value +'">';

      return html;
    }

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
    var formatted = value;
    if (typeof Locale !== undefined &&
        formatted !== null && formatted !== undefined && formatted !== '') {
       formatted = Locale.formatNumber(+value, col.numberFormat);
    }
    return ((formatted === null || formatted === undefined) ? '' : formatted);
  },

  Integer:  function(row, cell, value, col) {
    var formatted = value;
    if (typeof Locale !== undefined &&
        formatted !== null && formatted !== undefined && formatted !== '') {
      formatted = Locale.formatNumber(+value, col.numberFormat || {style: 'integer'});
    }
    return (formatted === null || formatted === undefined) ? '' : formatted;
  },

  Hyperlink: function(row, cell, value, col, item, api) {
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
      ('<a href="'+ colHref +'" class="btn-icon row-btn '+ (col.cssClass || '') +'" ' + (!api.settings.rowNavigation ? '' : 'tabindex="-1"') + (col.hyperlinkTooltip ? ' title="'+ col.hyperlinkTooltip + '"': '') + '>'+
          $.createIcon({ icon: col.icon, file: col.iconFile }) +
          '<span class="audible">'+ textValue +'</span>'+
        '</a>') :
      ('<a href="'+ colHref +'" ' + (!api.settings.rowNavigation ? '' : 'tabindex="-1"') + ' role="presentation" class="hyperlink '+ (col.cssClass || '') + '"' + (col.target ? ' target="' + col.target + '"' : '') + (col.hyperlinkTooltip ? ' title="'+ col.hyperlinkTooltip + '"': '') + '>'+ textValue +'</a>');
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

  RowReorder: function () {
    var text = Locale.translate('ReorderRows');

    if (text === undefined) {
      text = 'Reorder Rows';
    }

    return (
      '<div class="datagrid-reorder-icon">' +
         $.createIcon({icon: 'drag'}) +
        '<span class="audible">' + text + '</span>' +
      '</div>'
    );
  },

  Checkbox: function (row, cell, value, col, item, api) {
    var isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      //treat 1, true or '1' as checked
      isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    }

    // We add hidden Yes/No text so that the exported excel spreadsheet shows this text in checkbox columns
    var hiddenText = '<span class="hidden" aria-hidden="true" role="presentation">' + Locale.translate(isChecked ? 'Yes' : 'No') + '</span>';

    var animate = api.wasJustUpdated;
    api.wasJustUpdated = false;
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ col.name +'" class="datagrid-checkbox ' +
     (isChecked ? 'is-checked ' + (!animate ? ' no-animation' : ' ') : '') +'" aria-checked="'+isChecked+'"></span>' + hiddenText + '</div>';
  },

  SelectionCheckbox: function (row, cell, value, col, item, api) {
    var isChecked = (value==undefined ? false : value == true); // jshint ignore:line
    if (!value) {
      isChecked = api.isNodeSelected(item);
    }
    return '<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="'+ (col.name ? col.name : Locale.translate('Select'))  +'" class="datagrid-checkbox datagrid-selection-checkbox' +
     (isChecked ? ' is-checked no-animate' : '') +'" aria-checked="'+isChecked+'"></span></div>';
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

  // Rich Text Editor
  Editor: function (row, cell, value, col) {
    var formatted = ((value === null || value === undefined) ? '' : value),
      classes = 'is-editor';
    classes += col.singleline ? '' : ' datagrid-multiline-text';
    classes += col.contentTooltip ? ' content-tooltip' : '';
    return '<div class="'+ classes +'">'+ $.unescapeHTML(formatted) +'</div>';
  },

  // Expand / Collapse Button
  Expander: function (row, cell, value) {
    var button = '<button type="button" aria-label="' + Locale.translate('ExpandCollapse') + '" class="btn-icon datagrid-expand-btn" tabindex="-1">'+
      '<span class="icon plus-minus"></span>' +
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

    if (typeof Locale !== undefined && col.numberFormat &&
      value !== null && value !== undefined && value !== '') {
        value = Locale.formatNumber(+value, col.numberFormat);
    }

    return (beforeText + ((value === null || value === undefined || value === '') ? '' : value.toString()) + afterText);
  },

  // Tree Expand / Collapse Button and Paddings
  Tree: function (row, cell, value, col, item, api) {
    var isOpen = item.expanded,
      depth = api.settings.treeDepth[row] ? api.settings.treeDepth[row].depth : 0,
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
    var colorClasses = col.color,
      text = col.name;

    if (col.ranges) {
      var ranges = Formatters.ClassRange(row, cell, value, col);
      colorClasses = ranges.classes;
      text = ranges.text;
    }
    return '<span class="badge ' + colorClasses +'">' + value +' <span class="audible">'+ text+ '</span></span>';
  },

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

  Colorpicker: function(row, cell, value, col) {
    var html = ((value === null || value === undefined || value === '') ? '' : value.toString());
    if (col.inlineEditor) {
      return html;
    }
    html = '<span class="colorpicker-container trigger dropdown-trigger"><span class="swatch" style="background-color: ' + value + '"></span><input class="colorpicker" id="colorpicker-' + cell + '" name="colorpicker-' + cell + '" type="text" role="combobox" aria-autocomplete="list" value="' + value + '" aria-describedby="">';
    html += '<span class="trigger">' + $.createIcon({ icon: 'dropdown' }) + '</span></span>';

    return html;
  },

  Button: function (row, cell, value, col, item, api) {
    var text = col.text ? col.text : ((value === null || value === undefined || value === '') ? '' : value.toString()),
      markup ='<button type="button" class="'+ ( col.icon ? 'btn-icon': 'btn-secondary') + ' row-btn ' + (col.cssClass ? col.cssClass : '') + '"' + (!api.settings.rowNavigation ? '' : ' tabindex="-1"') +' >';

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

    var html = '<span class="trigger dropdown-trigger">' + formattedValue + '</span>' + $.createIcon({ icon: 'dropdown' });

    if (col.inlineEditor) {
      html = '<label for="full-dropdown" class="audible">'+ col.name +'</label>'+
        '<select id="'+ 'datagrid-dropdown' + row +'" class="dropdown">';

      for (i = 0; i < col.options.length; i++) {
        var opt = col.options[i];
        html += '<option' + (opt.id === undefined ? '' : ' id="' + opt.id + '"') +
                  ' value="' + opt.value + '"' +
                  (opt.selected || opt.value === compareValue ? ' selected ' : '') +
                '>'+ (opt.label !== undefined ? opt.label : opt.value !== undefined ? opt.value : '') + '</option>';
      }

      html += '</select>'+
      '<div class="dropdown-wrapper is-inline">'+
        '<div class="dropdown"><span>'+ formattedValue +'</span></div>'+
        '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">'+
          '<use xlink:href="#icon-dropdown"></use>'+
        '</svg>'+
      '</div>';
    }

    return html;
  },

  Spinbox: function (row, cell, value, col) {
    var html = ((value === null || value === undefined || value === '') ? '' : value.toString());

    if (col.inlineEditor) {
      html = '<label for="spinbox-' + cell + '" class="audible">Quantity</label>' +
        '<span class="spinbox-wrapper"><span class="spinbox-control down">-</span>' +
        '<input id="spinbox-' + cell + '" name="spinbox-' + cell + '" type="text" class="spinbox" value="'+ value +'">'+
        '<span class="spinbox-control up">+</span></span>';
    }

    return html;
  },

  Favorite: function (row, cell, value, col, item, api) {
    var isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      isChecked = (value == undefined ? false : value == true); // jshint ignore:line
    }

    var isEditable = col.editor && api.settings.editable;

    if (isChecked) {
      return '<span aria-label="'+ Locale.translate('Favorite') +'" class="icon-favorite'+ (isEditable ? ' is-editable': '') + '">' + $.createIcon({ icon: 'star-filled' }) + '</span>';
    } else {
      return col.showEmpty ? '<span aria-label="'+ Locale.translate('Favorite') +'" class="icon-favorite'+ (isEditable ? ' is-editable': '') + '">' + $.createIcon({ icon: 'star-outlined' }) + '</span>' : '';
    }
  },

  Status: function (row, cell, value, col, item) {

    if (!item.rowStatus) {
      return '<span></span>';
    }

    return $.createIcon({ icon: item.rowStatus.icon, classes: ['icon', 'icon-' + item.rowStatus.icon, 'datagrid-alert-icon'] }) + '<span class="audible">' + item.rowStatus.text + '</span>';
  },

  TargetedAchievement: function (row, cell, value, col) {
    var perc = (100*value),
      ranges = Formatters.ClassRange(row, cell, perc, col),
      target = col.target;

    var isWhite = perc > 55;  //Maybe implement this later perc > 60;
    return '<div class="total bar chart-completion-target chart-targeted-achievement"><div class="target remaining bar" style="width: '+ (target || 0) +'%;"></div><div class="completed bar ' + (col.ranges && ranges.classes ? ranges.classes : 'primary') + '" style="width: '+ perc +'%;"></div>' + (col.showPercentText ? '<div class="chart-targeted-text" '+ (isWhite ? 'style="color: white"' : '') +'>'+ perc +'%</div></div>' : '');
  },
  // TODO Possible future Formatters
  // Multi Select
  // Sparkline
  // Progress Indicator (n of 100%)
  // Process Indicator
  // Currency
  // File Upload (Simple)
  // Menu Button
  // Color Picker (Low)
};

/**
*  A object containing all the supported Editors
* @private
*/
window.Editors = {

  //Supports, Text, Numeric, Integer via mask
  Input: function(row, cell, value, container, column, e, api, item) {

    this.name = 'input';
    this.originalValue = value;
    this.useValue = column.inlineEditor ? true : false;

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('input');
      } else {
        this.input = $('<input type="'+ (column.inputType || 'text') +'"/>')
          .appendTo(container);
      }

      if (column.align) {
        this.input.addClass('l-'+ column.align +'-text');
      }

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
      }

      if (column.mask && typeof column.mask === 'function') {
        var mask = column.mask(row, cell, value, column, item);
        this.input.mask({pattern: mask, mode: column.maskMode});
      } else if (column.maskOptions && typeof column.maskOptions === 'function') {
        var maskOptions = column.maskOptions(row, cell, value, column, item);
        this.input.mask(maskOptions);
      } else if (column.mask) {
        this.input.mask({pattern: column.mask, mode: column.maskMode});
      }

      var defaults = {
        patternOptions: {allowNegative: true, allowDecimal: true,
        integerLimit: 4, decimalLimit: 2,
        symbols: {
          thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
          decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal  : '.',
          negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign  : '-'
        }},
        process: 'number'
      };

      var useMask = false;

      if (column.maskOptions) {
        useMask = true;
      }

      if (column.numberFormat) {
        useMask = true;
        defaults = {patternOptions : {decimalLimit: column.numberFormat.maximumFractionDigits }};
      }

      if (column.maskOptions && typeof column.maskOptions === 'function') {
        useMask = false;
      }

      if (useMask) {
        column.maskOptions = Soho.utils.extend(true, {}, defaults, column.maskOptions);
        this.input.mask(column.maskOptions);
      }

      if (!column.align || column.align !== 'right') {
        this.input.removeClass('is-number-mask');
      }

    };

    this.val = function (value) {
      var thisValue;
      if (value) {
        this.input.val(value);
      }
      if (column && column.numberFormat && column.numberFormat.style === 'percent') {
        thisValue = this.input.val().trim().replace(/(\s%?|%)$/g, '');
        return Locale.parseNumber(thisValue) / 100;
      }
      return this.input.val();
    };

    this.focus = function () {
      this.input.focus().select();
    };

    this.destroy = function () {
      if (column.inlineEditor) {
        return;
      }

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

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
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

  // Rich Text Editor
  Editor: function(row, cell, value, container, column, e, api) {
    this.name = 'editor';
    this.originalValue = value;

    this.init = function () {
      var self = this,
        // Editor options
        editorOptions = $.extend({}, {
          buttons: { editor: ['bold','italic','underline','strikethrough','separator', 'foreColor'], source: [] },
          excludeButtons: { editor: [] }
        }, column.editorOptions);

      // Editor width
      this.editorWidth = api.setUnit(editorOptions.width || container.outerWidth());
      delete editorOptions.width;

      container.append(
        '<div class="editor-wrapper" style="width:'+ this.editorWidth +';">'+
          '<div class="editor" data-init="false">'+ $.unescapeHTML(value) +'</div>'+
        '</div>');
      this.td = container.closest('td');
      this.input = $('.editor', container);

      this.input
        .popover({
          content: $('.editor-wrapper', container),
          placementOpts: {
            x: 0,
            y: '-'+ (parseInt(container[0].style.height, 10) + 35),
            parent: this.td,
            parentXAlignment: Locale.isRTL() ? 'right' : 'left',
            strategies: ['flip', 'nudge', 'shrink'],
          },
          placement : 'bottom',
          popover: true,
          trigger: 'immediate',
          tooltipElement: '#editor-popup',
          extraClass: 'editor-popup'
        })
        .editor(editorOptions)
        .on('hide.editor', function () {
          api.commitCellEdit(self.input);
        })
        .on('keydown.editor', function (e) {
          var key = e.which || e.keyCode || e.charCode || 0;
          // Ctrl + Enter (Some browser return keyCode: 10, not 13)
          if ((e.ctrlKey || e.metaKey) && (key === 13 || key === 10)) {
            var apiPopover = self.input.data('tooltip');
            if (apiPopover) {
              apiPopover.hide();
              api.setNextActiveCell(e);
            }
          }
        });
      Soho.utils.fixSVGIcons($('#editor-popup'));
    };

    this.val = function () {
      return this.input.html();
    };

    this.focus = function () {
      var self = this;
      setTimeout(function() {
        self.input.focus();
      }, 0);
    };

    this.destroy = function () {
      var self = this;
      container.removeAttr('style');
      api.quickEditMode = false;
      self.input.off('hide.editor keydown.editor');
      setTimeout(function() {
        self.input.remove();
        // Reset tooltip
        var elem = self.td.find('.is-editor.content-tooltip');
        api.setupContentTooltip(elem, self.editorWidth);
      }, 0);
    };

    this.init();
  },

  Checkbox: function(row, cell, value, container, column, event, grid) {

    this.name = 'checkbox';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value
    this.container = container;

    this.init = function () {

      this.input = $('<input type="checkbox" class="checkbox"/>').appendTo(container);
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

      //just toggle it if we click right on it
      if ((event.type === 'click' || (event.type === 'keydown' && event.keyCode === 32)) && !$(event.target).is('.datagrid-checkbox-wrapper, .datagrid-cell-wrapper')) {
        isChecked = !isChecked;
        grid.setNextActiveCell(event);
      }

      this.input.prop('checked', isChecked);
    };

    this.focus = function () {
      this.input.trigger('focusout');
      this.container.parent().focus();
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

  Colorpicker: function(row, cell, value, container, column, event, grid) {
    this.name = 'colorpicker';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value

    this.init = function () {
      this.input = $('<input id="colorpicker-' + cell + '" name="colorpicker-' + cell + '" class="colorpicker" value="' + value + '" type="text" />').appendTo(container);
      this.input.colorpicker(column.editorOptions);
    };

    this.val = function (value) {
      return value ? this.input.val(value) : this.input.val();
    };

    this.focus = function () {

      var self = this;

      this.input.trigger('openlist');
      this.input.focus().select();

      this.input.off('listclosed').on('listclosed', function () {
        grid.commitCellEdit(self.input);

        container.parent('td').focus();
        return;
      });

    };

    this.destroy = function () {
      //We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  Dropdown: function(row, cell, value, container, column, event, grid, rowData) {

    this.name = 'dropdown';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value
    this.cell = grid.activeCell;

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('select');
        return;
      }

      this.input = $('<select class="dropdown"></select>').appendTo(container);

      if (column.options) {
        var html, opt, optionValue;
        value = grid.fieldValue(rowData,column.field);

        var compareValue = column.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

        for (var i = 0; i < column.options.length; i++) {
          html = $('<option></option>');
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

        this.input.find('option').each(function () {
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

      var selected = this.input.find(':selected'),
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
      this.input.trigger('openlist');
      this.input.parent().find('div.dropdown').focus();

      this.input.off('listclosed').on('listclosed', function (e, type) {
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

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
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
      column.editorOptions.offset = {left: -1, top: (grid.settings.rowHeight ==='medium' ? 1 : 5)};

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
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
  },

  Spinbox: function(ow, cell, value, container, column, event, grid) {
    this.name = 'spinbox';
    this.originalValue = value;
    this.useValue = true; //use the data set value not cell value

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('input');
        return;
      }

      var markup = '<label for="spinbox-' + cell + '" class="audible">Quantity</label>' +
        '<span class="spinbox-wrapper"><span class="spinbox-control down">-</span>' +
        '<input id="spinbox-' + cell + '" name="spinbox-' + cell + '" type="text" class="spinbox" value="'+ value +'">'+
        '<span class="spinbox-control up">+</span></span>';

      container.append(markup);
      this.input = container.find('input');

      if (!column.editorOptions) {
        column.editorOptions = {};
      }

      this.input.spinbox(column.editorOptions);
    };

    this.val = function (value) {
      return value ? parseInt(this.input.val(value)) : parseInt(this.input.val());
    };

    this.focus = function () {
      grid.quickEditMode = true;
      this.input.select().focus();
    };

    this.destroy = function () {
      if (column.inlineEditor) {
        return;
      }

      var self = this;
      setTimeout(function() {
        grid.quickEditMode = false;
        self.input.remove();
      }, 0);
    };

    this.init();
  },

  Favorite: function(row, cell, value, container, column, event, grid) {
    this.name = 'favorite';
    this.useValue = true;
    this.originalValue = value;

    this.init = function () {
      this.input = $('<span class="icon-favorite">' +
            $.createIcon({ icon: value ? 'star-filled' : 'star-outlined' }) + '<input type="checkbox"></span>').appendTo(container);

      this.input = this.input.find('input');
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

      //just toggle it when clicked
      if ((event.type === 'click' || (event.type === 'keydown' && event.keyCode === 32)) && (!$(event.target).is('.datagrid-cell-wrapper'))) {
        isChecked = !isChecked;
        grid.setNextActiveCell(event);
      }

      this.input.prop('checked', isChecked);
      this.input.find('use').attr('xlink:href', isChecked ? '#icon-star-filled' : '#icon-star-outlined');
    };

    this.focus = function () {
      this.input.trigger('focusout').focus();
    };

    this.destroy = function () {
      var self = this;
      setTimeout(function() {
        self.input.parent().remove();
      }, 0);
    };

    this.init();
  }
};

/**
* An api for grouping data by a given field (s)
* @private
*/
window.GroupBy = (function() {

  //Can also use in isEquivalent: function(obj1, obj2)  in datagrid.js
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

/**
* Register built in aggregators
* @private
*/
GroupBy.register('none', function(item) {
  return $.extend({}, item.key, {values: item.values});
});

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

/**
* Simple Summary Row Accumlator
* @private
*/
window.Aggregators = {};
window.Aggregators.aggregate = function (items, columns) {
    var totals = {}, self = this;

    for (var i = 0; i < columns.length; i++) {
        if (columns[i].aggregator) {
            var field = columns[i].field;

            self.sum = function (sum, node) {
                var value;
                if (field.indexOf('.') > -1) {
                    value = field.split('.').reduce(function (o, x) {
                        return (o ? o[x] : '');
                    }, node);
                }
                else {
                    value = node[field];
                }
                return sum + Number(value);
            };

            var total = items.reduce(self[columns[i].aggregator], 0);

            if (field.indexOf('.') > -1) {
                var currentObj = totals;
                for (var j = 0; j < field.split('.').length; j++) {
                    if (j === field.split('.').length - 1) {
                        currentObj[field.split('.')[j]] = total;
                    }
                    else {
                        if (!(field.split('.')[j] in currentObj)) {
                            currentObj[field.split('.')[j]] = {};
                        }

                        currentObj = currentObj[field.split('.')[j]];
                    }
                }
            }
            else {
                totals[field] = total;
            }
        }
    }

    return totals;
};

/**
* Actual Datagrid jQuery Plugin
* @private
*/
$.fn.datagrid = function(options) {

  // Settings and Options
  var pluginName = 'datagrid',
      defaults = {
        // F2 - toggles actionableMode "true" and "false"
        // If actionableMode is "true, tab and shift tab behave like left and right arrow key,
        // if the cell is editable it goes in and out of edit mode
        actionableMode: false,
        cellNavigation: true, // If cellNavigation is "false, will show border around whole row on focus
        rowNavigation: true, // If rowNavigation is "false, will NOT show border around the row
        alternateRowShading: false, //Sets shading for readonly grids
        columns: [],
        dataset: [],
        columnReorder: false, // Allow Column reorder
        saveColumns: false, //Save Column Reorder and resize
        saveUserSettings: {}, //Save one or all of the following to local storage : columns: true, rowHeight: true, sortOrder: true, pagesize: true, activePage: true, filter: true
        editable: false,
        isList: false, // Makes a readonly "list"
        menuId: null,  //Id to the right click context menu
        headerMenuId: null,  //Id to the right click context menu to use for the header
        menuSelected: null, //Callback for the grid level right click menu
        menuBeforeOpen: null, //Call back for the grid level before open menu event
        headerMenuSelected: null, //Callback for the header level right click menu
        headerMenuBeforeOpen: null, //Call back for the header level before open menu event
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
        showPageSizeSelector: true, // Will show page size selector
        indeterminate: false, //removed ability to go to a specific page.
        source: null, //callback for paging
        hidePagerOnOnePage: false, //If true, hides the pager if there's only one page worth of results.
        //Filtering Options
        filterable: false,
        disableClientFilter: false, //Disable Filter Logic client side and let your server do it
        disableClientSort: false, //Disable Sort Logic client side and let your server do it
        resultsText: null,  // Can provide a custom function to adjust results text
        showFilterTotal : true, // Paging results show filtered count, false to not show.
        virtualized: false, // Prevent Unused rows from being added to the DOM
        virtualRowBuffer: 10, //how many extra rows top and bottom to allow as a buffer
        rowReorder: false, //Allows you to reorder rows. Requires rowReorder formatter
        showDirty: false,
        showSelectAllCheckBox: true, // Allow to hide the checkbox header (true to show, false to hide)
        allowOneExpandedRow: true, //Only allows one expandable row at a time
        enableTooltips: false,  //Process tooltip logic at a cost of performance
        disableRowDeactivation: false, // If a row is activated the user should not be able to deactivate it by clicking on the activated row
        sizeColumnsEqually: false, //If true make all the columns equal width
        expandableRow: false, // Supply an empty expandable row template
        redrawOnResize: true, //Run column redraw logic on resize
        exportConvertNegative: false, // Export data with trailing negative signs moved in front
        columnGroups: null, // The columns to use for grouped column headings
        treeGrid: false, // If true a tree grid is expected so addition calculations will be used to calculate of the row children
        onPostRenderCell: null, //A callback function that will fire and send you the cell container and related information for any cells with postRender: true.
        onDestroyCell: null, //A callback that goes along with onPostRenderCell and will fire when this cell is destroyed and you need notification of that.
        onEditCell: null, //A callback that fires when a cell is edited, the editor object is passed in to the function
        onExpandRow: null, //A callback function that fires when expanding rows. The function gets eventData about the row and grid and a response function callback. Call the response function with markup to append and delay opening the row.
        emptyMessage: {title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data'}
      },
      settings = $.extend({}, defaults, options);

  /**
  * The Datagrid Component displays and process data in tabular format.
  *
  * @class Datagrid
  * @param {Boolean} actionableMode &nbsp;-&nbsp If actionableMode is "true, tab and shift tab behave like left and right arrow key, if the cell is editable it goes in and out of edit mode. F2 - toggles actionableMode "true" and "false"
  * @param {Boolean} cellNavigation &nbsp;-&nbsp If cellNavigation is "false, will show border around whole row on focus
  * @param {Boolean} rowNavigation  &nbsp;-&nbsp If rowNavigation is "false, will NOT show border around the row
  * @param {Boolean} alternateRowShading  &nbsp;-&nbsp Sets shading for readonly grids
  * @param {Array} columns  &nbsp;-&nbsp an array of columns (see column options)
  * @param {Array} dataset  &nbsp;-&nbsp an array of data objects
  * @param {Boolean} columnReorder  &nbsp;-&nbsp Allow Column reorder
  * @param {Boolean} saveColumns  &nbsp;-&nbsp Save Column Reorder and resize
  * @param {Object} saveUserSettings  &nbsp;-&nbsp Save one or all of the following to local storage : columns: true, rowHeight: true, sortOrder: true, pagesize: true, activePage: true, filter: true
  * @param {Boolean} editable &nbsp;-&nbsp Enable editing in the grid, requires column editors.
  * @param {Boolean} isList  &nbsp;-&nbsp Makes the grid have readonly "list" styling
  * @param {String} menuId  &nbsp;-&nbspId of the menu to use for a row level right click context menu
  * @param {String} menuSelected  &nbsp;-&nbsp Callback for the grid level context menu
  * @param {String} menuBeforeOpen  &nbsp;-&nbsp Callback for the grid level beforeopen menu event
  * @param {String} headerMenuId  &nbsp;-&nbsp Id of the menu to use for a header right click context menu
  * @param {String} headerMenuSelected  &nbsp;-&nbsp Callback for the header level context menu
  * @param {String} headerMenuBeforeOpen  &nbsp;-&nbsp Callback for the header level beforeopen menu event
  * @param {String} uniqueId &nbsp;-&nbsp Unique ID to use as local storage reference and internal variable names
  * @param {String} rowHeight &nbsp;-&nbsp Controls the height of the rows / number visible rows. May be (short, medium or normal)
  * @param {String} selectable &nbsp;-&nbsp Controls the selection Mode this may be: false, 'single' or 'multiple' or 'mixed'
  * @param {Object} groupable &nbsp;-&nbsp  Controls fields to use for data grouping Use Data grouping fx. {fields: ['incidentId'], supressRow: true, aggregator: 'list', aggregatorOptions: ['unitName1']}
  * @param {Boolean} clickToSelect &nbsp;-&nbsp Controls if using a selection mode if you can click the rows to select
  * @param {Object} toolbar  &nbsp;-&nbsp Toggles and appends toolbar features fx.. {title: 'Data Grid Header Title', results: true, keywordFilter: true, filter: true, rowHeight: true, views: true}
  * @param {Boolean} initializeToolbar &nbsp;-&nbsp Set to false if you will initialize the toolbar yourself
  * @param {Boolean} paging &nbsp;-&nbsp Enable paging mode
  * @param {Number} pagesize &nbsp;-&nbsp Number of rows per page
  * @param {Array} pagesizes &nbsp;-&nbsp Array of page sizes to show in the page size dropdown.
  * @param {Boolean} indeterminate &nbsp;-&nbsp Disable the ability to go to a specific page when paging.
  * @param {Function} source  &nbsp;-&nbsp Callback function for paging
  * @param {Boolean} hidePagerOnOnePage  &nbsp;-&nbsp If true, hides the pager if there's only one page worth of results.
  * @param {Boolean} filterable &nbsp;-&nbsp Enable Column Filtering, This will require column filterTypes as well.
  * @param {Boolean} disableClientFilter &nbsp;-&nbsp Disable Filter Logic client side and let your server do it
  * @param {Boolean} disableClientSort &nbsp;-&nbsp Disable Sort Logic client side and let your server do it
  * @param {String} resultsText &nbsp;-&nbsp Can provide a custom function to adjust results text on the toolbar
  * @param {Boolean} showFilterTotal &nbsp;-&nbsp Paging results display filter count, change to false to not show filtered count
  * @param {Boolean} rowReorder &nbsp;-&nbsp If set you can reorder rows. Requires rowReorder formatter
  * @param {Boolean} showDirty &nbsp;-&nbsp  If true the dirty indicator will be shown on the rows
  * @param {Boolean} showSelectAllCheckBox &nbsp;-&nbsp Allow to hide the checkbox header (true to show, false to hide)
  * @param {Boolean} allowOneExpandedRow  &nbsp;-&nbsp Controls if you cna expand more than one expandable row.
  * @param {Boolean} enableTooltips &nbsp;-&nbsp Process tooltip logic at a cost of performance
  * @param {Boolean} disableRowDeactivation &nbsp;-&nbsp if a row is activated the user should not be able to deactivate it by clicking on the activated row
  * @param {Boolean} sizeColumnsEqually &nbsp;-&nbsp If true make all the columns equal width
  * @param {Boolean} expandableRow &nbsp;-&nbsp If true we append an expandable row area without the rowTemplate feature being needed.
  * @param {Boolean} redrawOnResize &nbsp;-&nbsp If set to false we skip redraw logic on the resize of the page.
  * @param {Boolean} exportConvertNegative &nbsp;-&nbsp If set to true export data with trailing negative signs moved in front.
  * @param {Array} columnGroups &nbsp;-&nbsp An array of columns to use for grouped column headers.
  * @param {Boolean} treeGrid: &nbsp;-&nbsp If true a tree grid is expected so addition calculations will be used to calculate of the row children
  * @param {Function} onPostRenderCell &nbsp;-&nbsp A call back function that will fire and send you the cell container and related information for any cells cells with a component attribute in the column definition.
  * @param {Function} onDestroyCell &nbsp;-&nbsp A call back that goes along with onPostRenderCell and will fire when this cell is destroyed and you need noification of that.
  * @param {Function} onEditCell  &nbsp;-&nbsp A callback that fires when a cell is edited, the editor object is passed in to the function
  * @param {Function} onExpandRow &nbsp;-&nbsp A callback function that fires when expanding rows. To be used when expandableRow is true. The function gets eventData about the row and grid and a response function callback. Call the response function with markup to append and delay opening the row.
  * @param {Object} emptyMessage &nbsp;-&nbsp An empty message will be displayed when there is no rows in the grid. This accepts an object of the form emptyMessage: {title: 'No Data Available', info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data', button: {text: 'xxx', click: <function>}} set this to null for no message or will default to 'No Data Found with an icon.'
  */
  function Datagrid(element) {
    this.element = $(element);
    Soho.logTimeStart(pluginName);
    this.init();
    Soho.logTimeEnd(pluginName);
  }

  /**
  * Actual Datagrid prototype
  * @private
  */
  Datagrid.prototype = {

    /**
    * Init the datagrid from its uninitialized state.
    * @private
    */
    init: function() {
      var self = this, html = $('html');

      this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.isFirefoxMac = (navigator.platform.indexOf('Mac') !== -1 && navigator.userAgent.indexOf(') Gecko') !== -1);
      this.isIe = html.is('.ie');
      this.isIe9 = html.is('.ie9');
      this.isSafari = html.is('.is-safari');
      this.isWindows = (navigator.userAgent.indexOf('Windows') !== -1);
      this.settings = settings;
      this.initSettings();
      this.originalColumns = self.columnsFromString(JSON.stringify(this.settings.columns));
      this.removeToolbarOnDestroy = false;
      this.nonVisibleCellErrors = [];

      this.restoreColumns();
      this.restoreUserSettings();
      this.appendToolbar();
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.firstRender();
      this.handlePaging();
      this.handleEvents();
      this.handleKeys();

      setTimeout(function () {
        self.element.trigger('rendered', [self.element, self.headerRow, self.pagerBar]);
      }, 0);
    },

    /**
    * Initialize internal variables and states.
    * @private
    */
    initSettings: function () {

      this.sortColumn = {sortField: null, sortAsc: true};
      this.gridCount = $('.datagrid').length + 1;
      this.lastSelectedRow = 0;// Remember index to use shift key

      this.contextualToolbar = this.element.prev('.contextual-toolbar');
      this.contextualToolbar.addClass('datagrid-contextual-toolbar');
    },

    /**
    * Render or render both header and row area.
    */
    render: function () {
      this.loadData(this.settings.dataset);
    },

    /**
    * Run the first render on the Header and Rows.
    * @private
    */
    firstRender: function () {
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
        this.element.addClass('datagrid-container').attr('x-ms-format-detection','none');
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
      } else {
        $(this.element).removeClass('is-gridlist');
      }

      self.table.empty();
      self.clearHeaderCache();
      self.renderRows();
      self.element.append(self.contentContainer);
      self.renderHeader();
      self.container = self.element.closest('.datagrid-container');

      if (this.settings.emptyMessage) {
        //Object { title: "No Data Available", info: "", icon: "icon-empty-no-data" }
        self.emptyMessageContainer = $('<div>').emptymessage(this.settings.emptyMessage);
        self.contentContainer.prepend(self.emptyMessageContainer);
      }

      self.settings.buttonSelector = '.btn, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split';
      $(self.settings.buttonSelector, self.table).button();
    },

    /**
    * If the datagrid is a html table, convert that table to an internal dataset to use.
    * @private
    */
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

    /**
    * Add a row of data to the grid and dataset.
    * @param {Object} data &nbsp;-&nbsp An data row object
    * @param {String} location &nbsp;-&nbsp Where to add the row. This can be 'top' or leave off for 'bottom'
    */
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

      // Set active and fire handler
      setTimeout(function () {
        row = isTop ? row : self.settings.dataset.length - 1;
        self.setActiveCell(row, cell);

        rowNode = self.tableBody.find('tr[aria-rowindex="'+ (row + 1) +'"]');
        args = {row: row, cell: cell, target: rowNode, value: data, oldValue: []};

        self.pagerRefresh(location);
        self.element.triggerHandler('addrow', args);
      }, 10);
    },

    /**
    * Refresh the pager based on the current page and dataset.
    * @param {Object} location &nbsp;-&nbsp Deprecated - Can be set to 'top' or left off for bottom pager.
    */
    pagerRefresh: function (location) {
      if (this.pager) {
        var activePage = this.pager.activePage;
        if (typeof location === 'string') {
          activePage = location === 'top' ? 1 : this.pager._pageCount;
        }
        else if (typeof location === 'number') {
          activePage = Math.floor(location / this.pager.settings.pagesize + 1);
        }

        if (!this.settings.source) {
          this.pager.pagingInfo = $.extend({}, this.pager.pagingInfo, {
            activePage: activePage,
            total: this.settings.dataset.length,
            pagesize: this.settings.pagesize
          });
        }
        this.renderPager(this.pager.pagingInfo, true);
      }
    },

    /**
    * Remove a row of data to the grid and dataset.
    * @param {Number} row &nbsp;-&nbsp The row index
    * @param {Boolean} nosync &nbsp;-&nbsp Dont sync the selected rows.
    */
    removeRow: function (row, nosync) {
      var rowNode = this.tableBody.find('tr[aria-rowindex="'+ (row + 1) +'"]'),
        rowData = this.settings.dataset[row];
      this.unselectRow(row, nosync);
      this.settings.dataset.splice(row, 1);
      this.renderRows();
      this.element.trigger('rowremove', {row: row, cell: null, target: rowNode, value: [], oldValue: rowData});
    },

    /**
    * Remove all selected rows from the grid and dataset.
    */
    removeSelected: function () {

      var self = this,
        selectedRows = this.selectedRows();

      for (var i = selectedRows.length-1; i >= 0; i--) {
        self.removeRow(selectedRows[i].idx, true);
      }
      this.pagerRefresh();
      this.syncSelectedUI();
    },

    /**
    * Send in a new data set to display in the datagrid.
    *
    * @param {Object} dataset &nbsp;-&nbsp The array of objects to show in the grid. Should match the column definitions.
    * @param {Object} pagerInfo &nbsp;-&nbsp The pager info object with information like activePage ect.
    */
    updateDataset: function (dataset, pagerInfo) {
      this.loadData(dataset, pagerInfo);
    },

    /**
    * Trigger the source method to call to the backend on demand.
    *
    * @param {Object} pagerInfo &nbsp;-&nbsp The pager info object with information like activePage ect.
    */
    triggerSource: function(pagerType, callback) {
      this.pager.pagerInfo = this.pager.pagerInfo || {};
      this.pager.pagerInfo.type = pagerType;

      if (pagerType !== 'refresh') {
        this.pager.pagerInfo.activePage = 1;
      }

      this.renderPager(this.pager.pagerInfo, false, function() {
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    },

    /**
    * Send in a new data set to display in the datagrid. Use better named updateDataset
    * @deprecated
    * @private
    * @param {Object} dataset &nbsp;-&nbsp The array of objects to show in the grid. Should match the column definitions.
    * @param {Object} pagerInfo &nbsp;-&nbsp The pager info object with information like activePage ect.
    * @param {Object} isResponse &nbsp;-&nbsp Called internally if the load data is response
    */
    loadData: function (dataset, pagerInfo, isResponse) {
      this.settings.dataset = dataset;

      if (!pagerInfo) {
        pagerInfo = {};
      }

      if (!pagerInfo.activePage) {
        pagerInfo.activePage = 1;
        pagerInfo.pagesize = this.settings.pagesize;
        pagerInfo.total = -1;
        pagerInfo.type = 'initial';
      }

      if (this.settings.source && pagerInfo.grandTotal) {
        this.grandTotal = pagerInfo.grandTotal;
      } else {
        this.grandTotal = null;
      }

      if (this.pager) {
        if (pagerInfo.activePage > -1) {
          this.pager.activePage = pagerInfo.activePage;
        }
        this.pager.settings.dataset = dataset;
      }

      //Update Paging and Clear Rows
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();

      if (pagerInfo && !pagerInfo.preserveSelected) {
        this.unSelectAllRows();
      }

      //Resize and re-render if have a new dataset (since automatic column sizing depends on the dataset)
      if (pagerInfo.type === 'initial') {
        this.clearHeaderCache();
        this.restoreUserSettings();
        this.renderRows();
        this.renderHeader();
      } else {
        this.renderRows();
      }

      this.renderPager(pagerInfo, isResponse);
      this.syncSelectedUI();

    },

    /**
    * Generate a unique id based on the page and grid count. Add a suffix.
    * @deprecated
    * @private
    * @param {Object} suffix &nbsp;-&nbsp Add this string to make the id more unique
    */
    uniqueId: function (suffix) {
      var uniqueid = this.settings.uniqueId ?
        this.settings.uniqueId + '-' + suffix :
        (window.location.pathname.split('/').pop()
          .replace(/\.xhtml|\.shtml|\.html|\.htm|\.aspx|\.asp|\.jspx|\.jsp|\.php/g, '')
          .replace(/[^-\w]+/g, '')
          .replace(/\./g, '-')
          .replace(/ /g, '-')
          .replace(/%20/g, '-') +'-'+
            (this.element.attr('id') || 'datagrid') +'-'+ this.gridCount + suffix);

      return uniqueid.replace(/--/g, '-');
    },

    /**
    * Returns an array with all visible columns.
    * @param {Object} skipBuiltIn &nbsp;-&nbsp If true then built in columns like selectionCheckbox are skipped.
    */
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

    /**
    * Returns the index of the last column.
    * @private
    */
    lastColumnIdx: function () {
      var last = 0;

      if (this.lastColumn) {
        return this.lastColumn;
      }

      for (var j = 0; j < this.settings.columns.length; j++) {
        var column = settings.columns[j];

        if (column.hidden) {
          continue;
        }

        last = j;
      }

      this.lastColumn = last;
      return last;
    },

    /**
    * Gets an If for the column group used for grouped headers.
    * @param {Object} idx &nbsp;-&nbsp The index of the column group
    */
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

    /**
    * Returns the text for a header adding built in defaults
    * @private
    * @param {Object} col &nbsp;-&nbsp The column id.
    */
    headerText: function (col) {
      var text = col.name ? col.name : '';

      if (!text && col.id === 'drilldown') {
        text = Locale.translate('Drilldown');
        return '<span class="audible">'+ text + '</span>';
      }

      return text;
    },

    /**
    * Render the header area.
    * @private
    */
    renderHeader: function() {
      var self = this,
        headerRow = '',
        headerColGroup = '<colgroup>',
        cols= '',
        uniqueId,
        hideNext = 0;

      // Handle Nested Headers
      var colGroups = this.settings.columnGroups;
      if (colGroups) {
        this.element.addClass('has-group-headers');

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
          isExportable = (column.exportable === undefined ? true : column.exportable),
          isSelection = column.id === 'selectionCheckbox',
          alignmentClass = (column.align === 'center' ? ' l-'+ column.align +'-text' : '');// Disable right align for now as this was acting wierd

        if (hideNext <= 0) {
          headerRow += '<th scope="col" role="columnheader" class="' + (isSortable ? 'is-sortable' : '') + (isResizable ? ' is-resizable' : '') +
            (column.hidden ? ' is-hidden' : '') + (column.filterType ? ' is-filterable' : '') +
            (alignmentClass ? alignmentClass : '') + '"' + (column.colspan ? ' colspan="' + column.colspan + '"' : '') +
           ' id="' + id + '" data-column-id="'+ column.id + '"' + (column.field ? ' data-field="'+ column.field +'"' : '') +
           (column.headerTooltip ? 'title="' + column.headerTooltip + '"' : '') +
           (column.reorderable === false ? ' data-reorder="false"' : '') +
           (colGroups ? ' headers="' + self.getColumnGroup(j) + '"' : '') + (isExportable ? 'data-exportable="yes"' : 'data-exportable="no"') + '>';

          headerRow += '<div class="' + (isSelection ? 'datagrid-checkbox-wrapper ': 'datagrid-column-wrapper') + (column.align === undefined ? '' : ' l-'+ column.align +'-text') + '"><span class="datagrid-header-text'+ (column.required ? ' required': '') + '">' + self.headerText(settings.columns[j]) + '</span>';
          cols += '<col' + this.calculateColumnWidth(column, j) + (column.colspan ? ' span="' + column.colspan + '"' : '') + (column.hidden ? ' class="is-hidden"' : '') + '>';
        }

        if (isSelection) {
          if (self.settings.showSelectAllCheckBox) {
            headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox"></span>';
          } else {
            headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox" style="display:none"></span>';
          }
        }

        if (isSortable) {
          headerRow += '<div class="sort-indicator">' +
            '<span class="sort-asc">' + $.createIcon({ icon: 'dropdown' }) + '</span>' +
            '<span class="sort-desc">' + $.createIcon({ icon: 'dropdown' }) + '</div>';
        }

        // Skip the next column when using colspan
        if (hideNext > 0) {
          hideNext --;
        }

        if (column.colspan) {
          hideNext = column.colspan - 1;
        }
        headerRow += '</div>' + self.filterRowHtml(column, j) + '</th>';
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
        self.headerContainer.find('table').css('width', this.totalWidth);
        self.headerRow.html(headerRow);
        self.headerColGroup.html(cols);
      }

      self.syncHeaderCheckbox(this.settings.dataset);

      if (this.settings.enableTooltips) {
        self.headerRow.find('th[title]').tooltip();
      }

      if (self.settings.columnReorder) {
        self.createDraggableColumns();
      }

      this.attachFilterRowEvents();

      if (this.restoreSortOrder) {
        this.setSortIndicator(this.sortColumn.sortId, this.sortColumn.sortAsc);
        this.restoreSortOrder = false;
      }

      if (this.restoreFilter) {
        this.applyFilter(this.savedFilter);
        this.restoreFilter = false;
        this.savedFilter = null;
      }
    },

    /**
    * Flag used to determine if the header is rendered or not.
    */
    filterRowRendered: false,

    /**
    * Returns the markup for a specific filter row area.
    * @private
    * @param {Object} columnDef &nbsp;-&nbsp The column object for the header
    * @param {Object} idx &nbsp;-&nbsp The column idx for the header
    */
    filterRowHtml: function (columnDef, idx) {
      var self = this,
        filterMarkup = '';

      //Generate the markup for the various Types
      //Supported Filter Types: text, integer, date, select, decimal, lookup, percent, checkbox, contents
      if (columnDef.filterType) {
          var col = columnDef,
            // id = self.uniqueId('-header-' + idx),
            // header = this.headerRow.find('#' + id),
            filterId = self.uniqueId('-header-filter-' + idx);

            filterMarkup = '<div class="datagrid-filter-wrapper" '+ (!self.settings.filterable ? ' style="display:none"' : '') +'>'+ this.filterButtonHtml(col) +'<label class="audible" for="'+ filterId +'">' +
              col.name + '</label>';

          switch (col.filterType) {
            case 'checkbox':
              //just the button
              break;
            case 'date':
              filterMarkup += '<input ' + (col.filterDisabled ? ' disabled' : '') + ' type="text" class="datepicker" id="'+ filterId +'"/>';
              break;
            case 'integer':
              var integerDefaults = {
                patternOptions: {allowNegative: true, allowThousandsSeparator: false,
                  allowDecimal: false,
                  symbols: {
                    thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
                    decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal  : '.',
                    negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign  : '-'
                  }},
                process: 'number'
              };

              col.maskOptions = Soho.utils.extend(true, {}, integerDefaults, col.maskOptions);
              filterMarkup += '<input' + (col.filterDisabled ? ' disabled' : '') + ' type="text" id="'+ filterId +'" />';
              break;
            case 'percent':
            case 'decimal':
              var decimalDefaults = {
                patternOptions: {allowNegative: true, allowDecimal: true,
                symbols: {
                  thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
                  decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal  : '.',
                  negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign  : '-'
                }},
                process: 'number'
              };

              if (col.numberFormat) {
                integerDefaults = {patternOptions : {decimalLimit: col.numberFormat.maximumFractionDigits }};
              }

              col.maskOptions = Soho.utils.extend(true, {}, decimalDefaults, col.maskOptions);
              filterMarkup += '<input' + (col.filterDisabled ? ' disabled' : '') + ' type="text" id="'+ filterId +'" />';
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
              filterMarkup += '</select><div class="dropdown-wrapper"><div class="dropdown"><span></span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg></div>';

              break;
            case 'time':
              filterMarkup += '<input ' + (col.filterDisabled ? ' disabled' : '') + ' type="text" class="timepicker" id="'+ filterId +'"/>';
              break;
            default:
              filterMarkup += '<input' + (col.filterDisabled ? ' disabled' : '') + ' type="text" id="'+ filterId +'"/>';
              break;
          }

          filterMarkup += '</div>';
      }

      return filterMarkup;
    },

    /**
    * Attach Events and initialize plugins for the filter row.
    * @private
    */
    attachFilterRowEvents: function () {
      var self = this;

      if (!this.settings.filterable) {
        return;
      }

      this.element.addClass('has-filterable-columns');

      //Attach Keyboard support
      this.headerRow.off('click.datagrid-filter').on('click.datagrid-filter', '.btn-filter', function () {
        var popupOpts = {trigger: 'immediate', offset: {y: 15}, attachToBody: $('html').hasClass('ios'), placementOpts: {strategies: ['flip', 'nudge']}},
          popupmenu = $(this).data('popupmenu');

        if (popupmenu) {
          popupmenu.close(true, true);
        } else {

          $(this).off('beforeopen.datagrid-filter').on('beforeopen.datagrid-filter', function () {
            var menu = $(this).next('.popupmenu-wrapper');
            Soho.utils.fixSVGIcons(menu);
          }).popupmenu(popupOpts).off('selected.datagrid-filter').on('selected.datagrid-filter', function () {
            self.applyFilter();
          }).off('close.datagrid-filter').on('close.datagrid-filter', function () {
            var data = $(this).data('popupmenu');
            if (data) {
              data.destroy();
            }
          });

        }
        return false;
      });

      this.headerRow.off('keydown.datagrid').on('keydown.datagrid', '.datagrid-filter-wrapper input', function (e) {
        e.stopPropagation();

        if (e.which === 13) {
          e.preventDefault();
          $(this).trigger('change');
        }

      }).off('change.datagrid').on('change.datagrid', '.datagrid-filter-wrapper input', function () {
        self.applyFilter();
      });

      this.headerRow.find('tr:last th').each(function () {
        var col = self.columnById($(this).attr('data-column-id'))[0],
          elem = $(this);

        if (!col) { //No ID found
          return true;
        }

        elem.find('select.dropdown').dropdown(col.editorOptions).on('selected.datagrid', function () {
          self.applyFilter();
        });

        elem.find('select.multiselect').multiselect(col.editorOptions).on('selected.datagrid', function () {
          self.applyFilter();
        });

        if (col.maskOptions) {
          elem.find('input').mask(col.maskOptions);
        }

        if (col.mask) {
          elem.find('input').mask(col.mask);
        }

        elem.find('.datepicker').datepicker(col.editorOptions ? col.editorOptions : {dateFormat: col.dateFormat});
        elem.find('.timepicker').timepicker(col.editorOptions ? col.editorOptions : {timeFormat: col.timeFormat});

        // Attach Mask
        if (col.mask) {
          elem.find('input').mask({pattern: col.mask, mode: col.maskMode});
        }
      });

      self.filterRowRendered = true;
    },

    /**
    * Render one filter item as used in renderFilterButton
    * @private
    * @param {Object} icon &nbsp;-&nbsp The icon for the menu item
    * @param {Object} text &nbsp;-&nbsp The text for the menu item
    * @param {Object} checked &nbsp;-&nbsp If the menu item is selected
    */
    filterItemHtml: function (icon, text, checked) {
      var iconMarkup = $.createIcon({ classes: 'icon icon-filter', icon: 'filter-' + icon });
      return '<li '+ (checked ? 'class="is-checked"' : '') +'><a href="#">'+ iconMarkup +'<span>'+ Locale.translate(text) +'</span></a></li>';
    },

    /**
    * Render the Filter Button and Menu based on filterType - which determines the options
    * @private
    * @param {Object} col &nbsp;-&nbsp The column object
    */
    filterButtonHtml: function (col) {

      if (!col.filterType) {
        return '';
      }

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
            '' : self.filterItemHtml(icon, text, checked);
        },
        renderButton = function(defaultValue) {
          return '<button type="button" class="btn-menu btn-filter" data-init="false" ' + (isDisabled ? ' disabled' : '') + (defaultValue ? ' data-default="' + defaultValue+ '"' : '') + ' type="button"><span class="audible">Filter</span>' +
          '<svg class="icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-filter-{{icon}}"></use></svg>' +
          $.createIcon({icon: 'dropdown' , classes: 'icon-dropdown'}) +
          '</button>' + '<ul class="popupmenu has-icons is-translatable is-selectable">';
        }, btnMarkup = '';


      //Just the dropdown
      if (filterType === 'contents' || filterType === 'select') {
        return '';
      }

      if (filterType === 'text') {
        btnMarkup = renderButton('contains') +
          render('contains', 'Contains', true) +
          render('does-not-contain', 'DoesNotContain') +
          render('equals', 'Equals') +
          render('does-not-equal', 'DoesNotEqual') +
          render('is-empty', 'IsEmpty') +
          render('is-not-empty', 'IsNotEmpty');
        btnMarkup = btnMarkup.replace('{{icon}}', 'contains');
      }

      if (filterType === 'checkbox') {
        btnMarkup += renderButton('selected-notselected')+
          render('selected-notselected', 'All', true) +
          render('selected', 'Selected') +
          render('not-selected', 'NotSelected');
        btnMarkup = btnMarkup.replace('{{icon}}', 'selected-notselected');
      }

      if (filterType !== 'checkbox' && filterType !== 'text') {
        btnMarkup += renderButton('equals') +
          render('equals', 'Equals', (filterType === 'integer' || filterType === 'date' || filterType === 'time')) +
          render('does-not-equal', 'DoesNotEqual') +
          render('is-empty', 'IsEmpty') +
          render('is-not-empty', 'IsNotEmpty');
        btnMarkup = btnMarkup.replace('{{icon}}', 'equals');
      }

      if (/\b(integer|decimal|date|time|percent)\b/g.test(filterType)) {
        btnMarkup += ''+
          render('less-than', 'LessThan') +
          render('less-equals', 'LessOrEquals') +
          render('greater-than', 'GreaterThan') +
          render('greater-equals', 'GreaterOrEquals');
        btnMarkup = btnMarkup.replace('{{icon}}', 'less-than');
      }

      if (filterType === 'text') {
        btnMarkup += ''+
          render('end-with', 'EndsWith') +
          render('does-not-end-with', 'DoesNotEndWith') +
          render('start-with', 'StartsWith') +
          render('does-not-start-with', 'DoesNotStartWith');
        btnMarkup = btnMarkup.replace('{{icon}}', 'end-with');
      }

      btnMarkup += '</ul>';
      return btnMarkup ;
    },

    /**
    * Toggle the visibility of the filter row.
    */
    toggleFilterRow: function () {

      if (this.settings.filterable) {
        this.headerRow.removeClass('is-filterable');
        this.headerRow.find('.is-filterable').removeClass('is-filterable');
        this.headerRow.find('.datagrid-filter-wrapper').hide();
        this.settings.filterable = false;
        this.filterRowRendered = false;
        this.element.removeClass('has-filterable-columns');
      } else {
        this.settings.filterable = true;

        if (!this.filterRowRendered) {
          this.render();
        }

        this.element.addClass('has-filterable-columns');

        this.headerRow.addClass('is-filterable');
        this.headerRow.find('.is-filterable').addClass('is-filterable');
        this.headerRow.find('.datagrid-filter-wrapper').show();
      }
    },

    /**
    * Apply the Filter with the currently selected conditions, or the ones passed in.
    * @param {Object} conditions &nbsp;-&nbsp An array of objects with the filter conditions.
    */
    applyFilter: function (conditions) {
      var self = this;
      this.filteredDataset = null;

      if (conditions) {
        this.setFilterConditions(conditions);
      } else {
        conditions = this.filterConditions();
      }

      var checkRow = function (rowData) {
        var isMatch = true;

        for (var i = 0; i < conditions.length; i++) {
          var columnDef = self.columnById(conditions[i].columnId)[0],
            field = columnDef.field,
            rowValue = self.fieldValue(rowData, field),
            rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase(),
            conditionValue = conditions[i].value.toString().toLowerCase();

          //Percent filter type
          if (columnDef.filterType === 'percent') {
            conditionValue = (conditionValue / 100).toString();
            if ((columnDef.name + '').toLowerCase() === 'decimal') {
              rowValue = window.Formatters.Decimal(false, false, rowValue, columnDef);
              conditionValue = window.Formatters.Decimal(false, false, conditionValue, columnDef);
            } else if ((columnDef.name + '').toLowerCase() === 'integer') {
              rowValue = window.Formatters.Integer(false, false, rowValue, columnDef);
              conditionValue = window.Formatters.Integer(false, false, conditionValue, columnDef);
            }
          }

          //Run Data over the formatter
          if (columnDef.filterType === 'text') {
            rowValue = self.formatValue(columnDef.formatter, i , conditions[i].columnId, rowValue, columnDef, rowData, self);

            //Strip any html markup that might be in the formatters
            var rex = /(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig;
            rowValue = rowValue.replace(rex , '').trim().toLowerCase();

            rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
          }

          if (columnDef.filterType === 'contents' || columnDef.filterType === 'select') {
            rowValue = rowValue.toLowerCase();
          }

          if ((typeof rowValue === 'number' || (!isNaN(rowValue) && rowValue !== '')) &&
              columnDef.filterType !== 'date' && columnDef.filterType !== 'time') {
            rowValue =  parseFloat(rowValue);
            conditionValue = Locale.parseNumber(conditionValue);
          }

          if (columnDef.filterType === 'date' || columnDef.filterType === 'time') {
            conditionValue = Locale.parseDate(conditions[i].value, conditions[i].format);
            if (conditionValue) {
              if (columnDef.filterType === 'time') {
                // drop the day, month and year
                conditionValue.setDate(1);
                conditionValue.setMonth(0);
                conditionValue.setYear(0);
              }

              conditionValue = conditionValue.getTime();
            }

            if (rowValue instanceof Date) {
              rowValue = rowValue.getTime();
            }
            else if (typeof rowValue === 'string' && rowValue) {
              if (!columnDef.sourceFormat) {
                rowValue = Locale.parseDate(rowValue, {pattern: conditions[i].format});
              } else {
                rowValue = Locale.parseDate(rowValue, (typeof columnDef.sourceFormat === 'string' ? {pattern: columnDef.sourceFormat}: columnDef.sourceFormat));
              }

              if (rowValue) {
                if (columnDef.filterType === 'time') {
                  // drop the day, month and year
                  rowValue.setDate(1);
                  rowValue.setMonth(0);
                  rowValue.setYear(0);
                } else if (!(columnDef.editorOptions && columnDef.editorOptions.showTime)) {
                  // Drop any time component of the row data for the filter as it is a date only field
                  rowValue.setHours(0);
                  rowValue.setMinutes(0);
                  rowValue.setSeconds(0);
                  rowValue.setMilliseconds(0);
                }
                rowValue = rowValue.getTime();
              }
            }
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
              isMatch = (rowValue !== conditionValue);
              break;
            case 'contains':
              isMatch = (rowValueStr.indexOf(conditionValue) > -1 && rowValue.toString() !== '');
              break;
            case 'does-not-contain':
              isMatch = (rowValueStr.indexOf(conditionValue) === -1);
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

      if (!this.settings.source) {
        this.renderRows();
      }
      this.setSearchActivePage();
      this.element.trigger('filtered', {op: 'apply', conditions: conditions});
      this.resetPager('filtered');
      this.saveUserSettings();

    },

    /**
    * Clear the Filter row Conditions and Reset the Data.
    */
    clearFilter: function () {
      if (!this.settings.filterable) {
        return;
      }

      this.headerRow.find('input, select').val('').trigger('updated');
      //reset all the filters to first item
      this.headerRow.find('.btn-filter').each(function () {
        var btn = $(this),
          ul = btn.next(),
          first = ul.find('li:first');

        btn.find('svg:first > use').attr('xlink:href', '#icon-filter-' + btn.attr('data-default'));
        ul.find('.is-checked').removeClass('is-checked');
        first.addClass('is-checked');
      });

      this.applyFilter();
      this.element.trigger('filtered', {op: 'clear', conditions: []});
    },

    /**
    * Set the Filter Conditions on the UI Only.
    * @param {Object} conditions &nbsp;-&nbsp An array of objects with the filter conditions.
    */
    setFilterConditions: function (conditions) {
      for (var i = 0; i < conditions.length; i++) {
        //Find the filter row
        var rowElem = this.headerRow.find('th[data-column-id="'+ conditions[i].columnId +'"]'),
          input = rowElem.find('input, select'),
          btn = rowElem.find('.btn-filter');

        if (conditions[i].value === undefined) {
          conditions[i].value = '';
        }

        input.val(conditions[i].value);

        if (input.is('select') && conditions[i].value instanceof Array) {
          for (var j = 0; j < conditions[i].value.length; j++) {
            input.find('option[value="'+ conditions[i].value[j] + '"]').prop('selected', true);
          }
          input.trigger('updated');
        }

        btn.find('svg:first > use').attr('xlink:href', '#icon-filter-' + conditions[i].operator);
      }
    },

    /**
    * Get filter conditions in array from whats set in the UI.
    */
    filterConditions: function () {
      // Do not modify keyword search filter expr
      if (this.filterExpr && this.filterExpr.length === 1 && this.filterExpr[0].keywordSearch) {
        delete this.filterExpr[0].keywordSearch;
        return this.filterExpr;
      }

      var self = this;
      this.filterExpr = [];

      //Create an array of objects with: field, id, filterType, operator, value
      this.headerRow.find('th').each(function () {
        var rowElem = $(this),
          btn = rowElem.find('.btn-filter'),
          input = rowElem.find('input, select'),
          isDropdown = input.is('select'),
          svg = btn.find('.icon-dropdown:first'),
          op,
          format;

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

        var value = input.val() ? input.val() : '';
        if (input.attr('data-mask-mode') && input.attr('data-mask-mode') === 'number') {
          value = Locale.parseNumber(value);
        }

        var condition = {columnId: rowElem.attr('data-column-id'),
          operator: op,
          value: value};

        if (input.data('datepicker')) {
          format = input.data('datepicker').settings.dateFormat;
          if (format === 'locale') {
            format = Locale.calendar().dateFormat.short;
          }
          condition.format = format;
        }

        if (input.data('timepicker')) {
          format = input.data('timepicker').settings.timeFormat;
          condition.format = format;
        }

        self.filterExpr.push(condition);

      });

      return self.filterExpr;
    },

    // Get height for current target in header
    getTargetHeight: function () {
      var h = this.settings.filterable ?
        {short: 48, medium: 51, normal: 56} : {short: 20, medium: 28, normal: 35};
      return h[this.settings.rowHeight];
    },

    /**
    * Create draggable columns
    * @private
    */
    createDraggableColumns: function () {
      var self = this,
        headers = self.headerNodes().not('[data-column-id="selectionCheckbox"]'),
        showTarget = $('.drag-target-arrows', self.element);

      if (!showTarget.length) {
        self.element.prepend('<span class="drag-target-arrows" style="height: '+ self.getTargetHeight() +'px;"></span>');
        showTarget = $('.drag-target-arrows', self.element);
      }

      headers.not('[data-reorder="false"]').prepend('</span><span class="handle">&#8286;</span>');
      headers.prepend('<span class="is-draggable-target"></span>');
      headers.last().append('<span class="is-draggable-target last"></span>');
      self.element.addClass('has-draggable-columns');

      // Initialize Drag api
      $('.handle', headers).each(function() {
        var clone, headerPos, offPos,
          handle = $(this),
          header = handle.parent();

        handle.on('mousedown.datagrid', function(e) {
          e.preventDefault();

          header.drag({clone: true, cloneAppendTo: headers.first().parent().parent(), clonePosIsFixed: true})
            .on('dragstart.datagrid', function (e, pos, thisClone) {
              var index;

              clone = thisClone;

              clone.removeAttr('id').addClass('is-dragging-clone')
                .css({left: pos.left, top: pos.top, height: header.height(), border: 0});

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
                    showTarget[0].style.top =  (parseInt(rect.top) + 1) + 'px';

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

    /**
    * Set draggable columns target elements
    * @private
    */
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

    /**
    * Get column index for dragging columns
    * @private
    * @param {Object} pos &nbsp;-&nbsp The position index
    */
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

    /**
    * Move an array element to a different position. May be dups of this function.
    * @private
    * @param {Array} arr &nbsp;-&nbsp The array
    * @param {Array} from &nbsp;-&nbsp The from position
    * @param {Array} to &nbsp;-&nbsp The to position
    */
    arrayIndexMove: function(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
    },

    /**
    * Attach Drag Events to Rows
    * @private
    */
    createDraggableRows: function () {
      var self = this;

      if (!this.settings.rowReorder) {
        return;
      }

      // Attach the Drag API
      this.tableBody.arrange({
          placeholder: '<tr class="datagrid-reorder-placeholder"><td colspan="'+ this.visibleColumns().length +'"></td></tr>',
          handle: '.datagrid-reorder-icon'
        })
        .off('beforearrange.datagrid').on('beforearrange.datagrid', function(e, status) {
          if (self.isSafari) {
            status.start.css({'display': 'inline-block'});
          }
        })
        .off('arrangeupdate.datagrid').on('arrangeupdate.datagrid', function(e, status) {
          if (self.isSafari) {
            status.end.css({'display': ''});
          }
          // Move the elem in the data set
          self.settings.dataset.splice(status.endIndex, 0, self.settings.dataset.splice(status.startIndex, 1)[0]);
          // Fire an event
          self.element.trigger('rowreorder', [status]);
        });

    },

    /**
    * Return the value in a field, taking into account nested objects. Fx obj.field.id
    * @param {Object} obj &nbsp;-&nbsp The object to use
    * @param {String} field &nbsp;-&nbsp The field as a string fx 'field' or 'obj.field.id'
    */
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

    /**
    * Setup internal tree root nodes array.
    * @private
    */
    setTreeRootNodes: function() {
      this.settings.treeRootNodes = this.settings.treeDepth
        .filter(function(node) {
          return node.depth === 1;
        });
    },

    /**
    * Setup internal tree depth array.
    * @private
    */
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

    /**
    * Setup internal row grouping
    * @private
    */
    setRowGrouping: function () {
      var groupSettings = this.settings.groupable;
      if (!groupSettings) {
        return;
      }

      this.originalDataset = this.settings.dataset.slice();

      if (!groupSettings.aggregator || groupSettings.aggregator === 'none') {
        this.settings.dataset = GroupBy.none(this.settings.dataset, groupSettings.fields);
        return;
      }

      if (groupSettings.aggregator === 'sum') {
        this.settings.dataset = GroupBy.sum(this.settings.dataset, groupSettings.fields, groupSettings.aggregate);
        return;
      }

      if (groupSettings.aggregator === 'max') {
        this.settings.dataset = GroupBy.max(this.settings.dataset, groupSettings.fields, groupSettings.aggregate);
        return;
      }

      if (groupSettings.aggregator === 'list') {
        this.settings.dataset = GroupBy.list(this.settings.dataset, groupSettings.fields, groupSettings.aggregatorOptions);
        return;
      }

      this.settings.dataset = window.GroupBy(this.settings.dataset, groupSettings.fields);
    },

    /**
    * Clear the table body and rows.
    * @private
    */
    renderRows: function() {
      var tableHtml = '',
        self = this, i,
        s = self.settings,
        activePage = self.pager ? self.pager.activePage : 1,
        pagesize = s.pagesize,
        dataset = s.dataset;

      var body = self.table.find('tbody');
      self.bodyColGroupHtml = '<colgroup>';
      self.triggerDestroyCell();  // Trigger Destroy on previous cells

      // Prevent flashing message area on filter / reload
      if (this.settings.emptyMessage && self.emptyMessageContainer) {
        self.emptyMessageContainer.hide();
      }

      if (body.length === 0) {
        self.tableBody = $('<tbody></tbody>');
        self.table.append(self.tableBody);
      }

      self.groupArray = [];

      self.recordCount = 0;
      self.filteredCount = 0;

      // Reset recordCount for paging
      if (s.treeGrid && s.paging && !s.source && activePage > 1) {
        self.recordCount = s.treeRootNodes[(pagesize * activePage) - pagesize].idx-1;
      }

      if (this.restoreSortOrder) {
        this.sortDataset();
      }

      for (i = 0; i < dataset.length; i++) {

        //For better performance dont render out of page
        if (s.paging && !s.source) {

          if (activePage === 1 && (i - this.filteredCount) >= pagesize){
            if (!dataset[i].isFiltered) {
              this.recordCount++;
            } else {
              this.filteredCount++;
            }
            continue;
          }

          if (activePage > 1 && !((i - this.filteredCount) >= pagesize*(activePage-1) && (i - this.filteredCount) < pagesize*activePage)) {
            if (!dataset[i].isFiltered) {
              if (this.filteredCount) {
                this.recordCount++;
              }
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
            tableHtml += self.rowHtml(dataset[i], this.recordCount, i, true);
          }

          if (this.settings.groupable.showOnlyGroupRow && dataset[i].values[0]) {
            var rowData = dataset[i].values[0];

            if (dataset[i].list) {
              rowData.list = dataset[i].list;
            }

            rowData.values = dataset[i].values;

            tableHtml += self.rowHtml(rowData, this.recordCount, i);
            this.recordCount++;
            self.groupArray.push({group: i, node: 0});
            continue;
          }

          //Now Push Groups
          for (var k = 0; k < dataset[i].values.length; k++) {
            tableHtml += self.rowHtml(dataset[i].values[k], this.recordCount, i);
            this.recordCount++;
            self.groupArray.push({group: i, node: k});
          }

          // Now Push summary rowHtml
          if (this.settings.groupable.groupFooterRow) {
            tableHtml += self.rowHtml(dataset[i], this.recordCount, i, true, true);
          }

          continue;
        }

        tableHtml += self.rowHtml(dataset[i], s.treeGrid ? this.recordCount : i, i);

        this.recordCount++;
      }

      //Append a Summary Row
      if (this.settings.summaryRow) {
        tableHtml += self.rowHtml(self.calculateTotals(), this.recordCount, null, false, true);
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
      self.afterRender();

    },

    /**
    * Fire events and do steps needed after a full render.
    * @private
    */
    afterRender: function() {
      var self = this;

      // Column column postRender functions
      if (this.settings.onPostRenderCell) {
        for (var i = 0; i < this.settings.columns.length; i++) {
          var col = this.settings.columns[i];

          if (col.component) {
            self.tableBody.find('tr').each(function () {
              var row = $(this),
                rowIdx = row.attr('data-index'),
                colIdx = self.columnIdxById(col.id),
                args = {
                  row: rowIdx,
                  cell: colIdx,
                  value: self.settings.dataset[rowIdx],
                  col: col,
                  api: self
                };

                self.settings.onPostRenderCell(row.find('td').eq(colIdx).find('.datagrid-cell-wrapper .content')[0], args);
            });
          }
        }
      }

      //Init Inline Elements
      self.tableBody.find('select.dropdown').dropdown();

      //Commit Edits for inline editing
      self.tableBody.find('.dropdown-wrapper.is-inline').prev('select')
        .on('listclosed', function () {
           var elem = $(this),
            newValue = elem.val(),
            row = elem.closest('tr');

            self.updateCellNode(row.attr('aria-rowindex'), elem.closest('td').index(), newValue, false, true);
         });

      self.tableBody.find('.spinbox').spinbox();

      //Set UI elements after dataload
      setTimeout(function () {

        if (!self.settings.source) {
          self.displayCounts();
        } else {
          self.checkEmptyMessage();
        }

        self.setAlternateRowShading();
        self.createDraggableRows();

        if (!self.activeCell || !self.activeCell.node) {
          self.activeCell = {node: self.cellNode(0, 0, true).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0};
        }

        if (self.activeCell.isFocused) {
          self.setActiveCell(self.activeCell.row, self.activeCell.cell);
        }

        //Update Selected Rows Across Page
        if (self.settings.paging && self.settings.source) {
          self.syncSelectedUI();
        }

        self.element.trigger('afterrender', {body: self.tableBody, header: self.headerRow, pager: self.pagerBar});
      }, 0);

    },

    /**
    * Trigger the onDestroyCell for each cell
    * @private
    */
    triggerDestroyCell: function () {
      var self = this;

      if (!self.tableBody) {
        return;
      }

      // Call onDestroyCell
      if (this.settings.onPostRenderCell && this.settings.onDestroyCell) {
        var rows = self.tableBody.find('tr');

        if (rows.length === 0) {
          return;
        }

        for (var i = 0; i < this.settings.columns.length; i++) {
          var col = this.settings.columns[i];

          if (col.component) {
            rows.each(function () {
              var row = $(this),
                rowIdx = row.index(),
                colIdx = self.columnIdxById(col.id),
                args = {
                  row: row.index(),
                  cell: colIdx,
                  value: self.settings.dataset[rowIdx],
                  col: col,
                  api: self
                };

                self.settings.onDestroyCell(row.find('td').eq(colIdx).find('.datagrid-cell-wrapper .content')[0], args);
            });
          }
        }
      }

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
      if (!this.settings.virtualized || !this.virtualRange) {
        return;
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

    rowHtml: function (rowData, dataRowIdx, actualIndex, isGroup, isFooter) {
      var isEven = false,
        self = this,
        isSummaryRow = this.settings.summaryRow && !isGroup && isFooter,
        activePage = self.pager ? self.pager.activePage : 1,
        pagesize = self.settings.pagesize,
        rowHtml = '',
        spanNext = 0,
        d = self.settings.treeDepth ? self.settings.treeDepth[dataRowIdx] : 0,
        depth, d2, i, l, isHidden, isSelected, isActivated;

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

      isEven = (this.recordCount % 2 === 0);
      isSelected = this.isNodeSelected(rowData);
      isActivated = rowData._rowactivated;

      rowHtml = '<tr role="row" aria-rowindex="' + ariaRowindex + '"' +
                ' data-index="' + actualIndex + '"' +
                (self.settings.treeGrid && rowData.children ? ' aria-expanded="' + (rowData.expanded ? 'true"' : 'false"') : '') +
                (self.settings.treeGrid ? ' aria-level= "' + depth + '"' : '') +
                (isSelected ? ' aria-selected= "true"' : '') +
                ' class="datagrid-row'+
                (isHidden ? ' is-hidden' : '') +
                (isActivated ? ' is-rowactivated' : '') +
                (isSelected ? this.settings.selectable === 'mixed' ? ' is-selected hide-selected-color' : ' is-selected' : '') +
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

        if (col.uppercase) {
          cssClass += ' uppercase-text';
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

        if (col.cssClass && typeof col.cssClass === 'string') {
          cssClass += ' ' + col.cssClass;
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

          self.bodyColGroupHtml += spanNext > 0 ? '' :'<col' + colWidth + (col.hidden ? ' class="is-hidden"' : '') + (col.colspan ? ' span="' + col.colspan + '"' : '') + '></col>';

          if (spanNext > 0 ) {
            spanNext--;
          }
          if (col.colspan) {
            this.hasColSpans = true;
            spanNext = col.colspan-1;
          }
        }

        rowHtml += '<td role="gridcell" ' + ariaReadonly + ' aria-colindex="' + (j+1) + '" '+
            ' aria-describedby="' + self.uniqueId('-header-' + j) + '"' +
          (isSelected ? ' aria-selected= "true"' : '') +
           (cssClass ? ' class="' + cssClass + '"' : '') +
           (col.tooltip && typeof col.tooltip === 'string' ? ' title="' + col.tooltip.replace('{{value}}', cellValue) + '"' : '') +
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

        if (self.settings.onPostRenderCell && col.component) {
          rowHtml += '<div class="content"></div>';
          formatted = '';
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

      if (self.settings.expandableRow) {
        rowHtml += '<tr class="datagrid-expandable-row"><td colspan="'+ this.visibleColumns().length +'">' +
          '<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding"></div></div>' +
          '</td></tr>';
      }

      //Render Tree Children
      if (rowData.children) {
        for (i=0, l=rowData.children.length; i<l; i++) {
          this.recordCount++;
          rowHtml += self.rowHtml(rowData.children[i], this.recordCount, i);
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

      var metrics = context.measureText(maxText),
        hasImages = columnDef.formatter ?
          columnDef.formatter.toString().indexOf('datagrid-alert-icon') > -1 : false,
        padding = (chooseHeader ? 60 + (hasImages ? 36 : 0) : 40 + (hasImages ? 36 : 0));

      if (columnDef.filterType) {
        var minWidth = columnDef.filterType === 'date' ? 170 : 100;

        if (columnDef.filterType === 'checkbox') {
          minWidth = 40;
          padding = 40;
        }

        return Math.round(Math.max(metrics.width + padding, minWidth));
      }

      return Math.round(metrics.width + padding);  //Add padding and borders
    },

    headerWidths: [], //Cache

    headerTableWidth: function () {
      var cacheWidths = this.headerWidths[this.settings.columns.length-1];

      if (!cacheWidths) {
        return '';
      }
      this.setScrollClass();

      if (cacheWidths.widthPercent) {
        return 'style = "width: 100%"';
      } else if (!isNaN(this.totalWidth)) {
        return 'style = "width: ' + parseFloat(this.totalWidth) + 'px"';
      }

      return '';
    },

    setScrollClass: function () {
      var height = parseInt(this.contentContainer[0].offsetHeight),
          hasScrollBar = parseInt(this.contentContainer[0].scrollHeight) > height + 2;

      this.element.removeClass('has-vertical-scroll has-less-rows');

      if (hasScrollBar) {
        this.element.addClass('has-vertical-scroll');
      }

      if (!hasScrollBar && this.tableBody[0].offsetHeight <  height) {
        this.element.addClass('has-less-rows');
      }

    },

    clearHeaderCache: function () {
      this.headerWidths = [];
      this.totalWidth = 0;
      this.elemWidth = 0;
      this.lastColumn = null;
    },

    //Calculate the width for a column (upfront with no rendering)
    //https://www.w3.org/TR/CSS21/tables.html#width-layout
    calculateColumnWidth: function (col, index) {
      var colPercWidth,
        visibleColumns = this.visibleColumns(true),
        lastColumn = (index === this.lastColumnIdx());

      if (!this.elemWidth) {
        this.elemWidth = this.element.outerWidth();

        if (this.elemWidth === 0) { // handle on invisible tab container
          this.elemWidth = this.element.closest('.tab-container').outerWidth();
        }
        if (!this.elemWidth || this.elemWidth === 0) { // handle on invisible modal
          this.elemWidth = this.element.closest('.modal-contents').outerWidth();
        }

        this.widthSpecified = false;
        this.widthPixel = false;
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

      if (!this.widthPixel && col.width) {
        this.widthPixel = typeof col.width !== 'string';
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

      lastColumn = index === this.lastColumnIdx() && this.totalWidth !== colWidth;

      // Simulate Auto Width Algorithm
      if ((!this.widthSpecified || col.width === undefined) && this.settings.sizeColumnsEqually &&
        (['selectionCheckbox', 'expander', 'drilldown', 'rowStatus', 'favorite'].indexOf(col.id) === -1)) {

        var percentWidth = Math.round(this.elemWidth / visibleColumns.length);
        colWidth = percentWidth - (lastColumn ? 2 : 0); //borders causing scroll

        //Handle Columns where auto width is bigger than the percent width
        if (percentWidth < textWidth) {
          colWidth = textWidth;
        }

      }

      //Some Built in columns
      if (col.id === 'selectionCheckbox' || col.id === 'favorite') {
        colWidth = 43;
        col.width = colWidth;
      }

      if (col.id === 'expander') {
        colWidth = 55;
        col.width = colWidth;
      }

      if (col.id === 'rowStatus') {
        colWidth = 62;
        col.width = colWidth;
      }

      if (col.id === 'drilldown') {
        colWidth = 78;
        col.width = colWidth;
      }

      // cache the header widths
      this.headerWidths[index] = {id: col.id, width: (this.widthPercent ? colPercWidth : colWidth), widthPercent: this.widthPercent};
      this.totalWidth += col.hidden || lastColumn ? 0 : colWidth;

      //For the last column stretch it if it doesnt fit the area
      if (lastColumn) {
        var diff = this.elemWidth - this.totalWidth;

        if ((diff > 0) && (diff  > colWidth) && !this.widthPercent && !col.width) {
          colWidth = diff - 2 - 10; //borders and last edge padding
          this.headerWidths[index] = {id: col.id, width: colWidth, widthPercent: this.widthPercent};
          this.totalWidth =  this.elemWidth - 2;
        }

        if (this.widthPercent) {
          this.table.css('width', '100%');
        } else if (!isNaN(this.totalWidth)) {
          this.table.css('width', this.totalWidth);
        }
      }

      if (!this.widthPercent && colWidth === undefined) {
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

    // Set unit type (pixel or percent)
    setUnit: function(v) {
      return v + (/(px|%)/i.test(v + '') ? '' : 'px');
    },

    // Content tooltip for rich text editor
    setupContentTooltip: function (elem, width, td) {
      if (elem.text().length > 0) {
        var content = elem.clone();

        elem.tooltip({
          content: content,
          extraClass: 'alternate content-tooltip',
          placementOpts: {
            parent: elem,
            parentXAlignment: 'center',
            strategies: ['flip', 'nudge', 'shrink']
          }
        });

        if (width) {
          content[0].style.width = width;
        } else {
          elem.on('beforeshow.datagrid', function () {
            elem.off('beforeshow.datagrid');
            content[0].style.width = td[0].offsetWidth + 'px';
          });
        }
      }
    },

    setupTooltips: function () {
      if (!this.settings.enableTooltips) {
        return;
      }

      var self = this;
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

      // Rich text editor content tooltip
      this.table.find('td .is-editor.content-tooltip').each(function() {
        var elem = $(this),
          td = elem.closest('td'),
          cell = td.attr('aria-colindex') - 1,
          col = self.columnSettings(cell),
          width = col.editorOptions && col.editorOptions.width ? self.setUnit(col.editorOptions.width) : false;

        self.setupContentTooltip(elem, width, td);
      });
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
      this.saveUserSettings();

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

    // Omit events and save to local storage for supported settings
    saveUserSettings: function () {

      // Emit Event
      this.element.trigger('settingschanged', [{rowHeight: this.settings.rowHeight,
        columns: this.settings.columns,
        sortOrder: this.sortColumn,
        pagesize: this.settings.pagesize,
        showPageSizeSelector: this.settings.showPageSizeSelector,
        activePage: this.pager ? this.pager.activePage : 1,
        filter: this.filterConditions()}]);

      // Save to Local Storage if the options are set
      var options = this.settings.saveUserSettings;
      if ($.isEmptyObject(options) || !this.canUseLocalStorage()) {
        return;
      }

      // Save Columns
      if (options.columns) {
        localStorage[this.uniqueId('usersettings-columns')] = JSON.stringify(this.settings.columns);
      }

      // Save Row Height
      if (options.rowHeight) {
        localStorage[this.uniqueId('usersettings-row-height')] = this.settings.rowHeight;
      }

      // Save Sort Order
      if (options.sortOrder) {
        localStorage[this.uniqueId('usersettings-sort-order')] = JSON.stringify(this.sortColumn);
      }

      // Save Page Size
      if (options.pagesize) {
        localStorage[this.uniqueId('usersettings-pagesize')] = this.settings.pagesize;
      }

      // Save Show Page Size Selector
      if (options.showPageSizeSelector) {
        localStorage[this.uniqueId('usersettings-show-pagesize-selector')] = this.settings.showPageSizeSelector;
      }

      // Save Page Num
      if (options.activePage && this.pager) {
        localStorage[this.uniqueId('usersettings-active-page')] = this.pager.activePage;
      }

      // Filter Conditions
      if (options.filter) {
        localStorage[this.uniqueId('usersettings-filter')] = JSON.stringify(this.filterConditions());
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

    columnsFromString: function(columnStr) {
      if (!columnStr) {
        return;
      }

      var self = this,
        columns = JSON.parse(columnStr);

      if (!columns) {
        return [];
      }

      //Map back the missing functions/objects
      for (var i = 0; i < columns.length; i++) {
        var isHidden,
          orgCol = self.columnById(columns[i].id);

        if (orgCol) {
          orgCol = orgCol[0];
          isHidden = columns[i].hidden;

          $.extend(columns[i], orgCol);

          if (isHidden !== undefined) {
            columns[i].hidden = isHidden;
          }
        }
      }

      return columns;
    },

    /**
    * Restore the columns from a provided list or local storage
    * @param {Array} cols - The columns list to restore, if you saved the settings manually.
    */
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
        this.originalColumns = this.settings.columns;
        this.settings.columns = this.columnsFromString(lsCols);
        return;
      }

    },

    restoreUserSettings: function (settings) {
      var options = this.settings.saveUserSettings;

      if (!settings && ($.isEmptyObject(options) || !this.canUseLocalStorage())) {
        return;
      }

      // Restore The data thats passed in
      if (settings) {

        if (settings.columns) {
          this.updateColumns(settings.columns);
        }

        if (settings.rowHeight) {
          this.rowHeight(settings.rowHeight);
        }

        if (settings.sortOrder) {
          this.setSortColumn(settings.sortOrder.sortId, settings.sortOrder.sortAsc);
        }

        if (settings.pagesize) {
          this.settings.pagesize = parseInt(settings.pagesize);
          this.pager.settings.pagesize = parseInt(settings.pagesize);
          this.pager.setActivePage(1, true);
        }

        if (settings.showPageSizeSelector) {
          this.settings.showPageSizeSelector = settings.showPageSizeSelector;
          this.pager.showPageSizeSelector(settings.showPageSizeSelector);
        }

        if (settings.activePage) {
          this.pager.setActivePage(parseInt(settings.activePage), true);
        }

        if (settings.filter) {
          this.applyFilter(settings.filter);
        }
        return;
      }

      // Restore Column Width and Order
      if (options.columns) {
        var savedColumns = localStorage[this.uniqueId('usersettings-columns')];
        if (savedColumns) {
          this.originalColumns = this.settings.columns;
          this.settings.columns = this.columnsFromString(savedColumns);
        }
      }

      // Restore Row Height
      if (options.rowHeight) {
        var savedRowHeight = localStorage[this.uniqueId('usersettings-row-height')];

        if (savedRowHeight) {
          this.settings.rowHeight = savedRowHeight;
        }
      }

      // Restore Sort Order
      if (options.sortOrder) {
        var savedSortOrder = localStorage[this.uniqueId('usersettings-sort-order')];
        if (savedSortOrder) {
          this.sortColumn = JSON.parse(savedSortOrder);
          this.restoreSortOrder = true;
        }
      }

      // Restore Page Size
      if (options.pagesize) {
        var savedPagesize = localStorage[this.uniqueId('usersettings-pagesize')];
        if (savedPagesize) {
          this.settings.pagesize = parseInt(savedPagesize);
        }
      }

      // Restore Show Page Size Selector
      if (options.showPageSizeSelector) {
        var savedShowPageSizeSelector = localStorage[this.uniqueId('usersettings-show-pagesize-selector')];
        savedShowPageSizeSelector = (savedShowPageSizeSelector + '').toLowerCase() === 'true';
        if (savedShowPageSizeSelector) {
          this.settings.showPageSizeSelector = savedShowPageSizeSelector;
        }
      }

      // Restore Active Page
      if (options.activePage) {
        var savedActivePage = localStorage[this.uniqueId('usersettings-active-page')];
        if (savedActivePage) {
          this.savedActivePage = parseInt(savedActivePage);
          this.restoreActivePage = true;
        }
      }

      if (options.filter) {
        var savedFilter = localStorage[this.uniqueId('usersettings-filter')];
        if (savedFilter) {
          this.savedFilter = JSON.parse(savedFilter);
          this.restoreFilter = true;
        }
      }

    },

    // Reset Columns from the Menu Option
    resetColumns: function () {
      if (this.canUseLocalStorage()) {
        localStorage.removeItem(this.uniqueId('columns'));
      }

      if (this.originalColumns) {
        this.updateColumns(this.originalColumns);
        this.originalColumns = this.columnsFromString(JSON.stringify(this.settings.columns));
      }
    },

    /**
    * Hide a column.
    * @param {String} id &nbsp;-&nbsp The id of the column to hide.
    */
    hideColumn: function(id) {
      var idx = this.columnIdxById(id);

      if (idx === -1) {
        return;
      }

      this.settings.columns[idx].hidden = true;
      this.headerRow.find('th').eq(idx).addClass('is-hidden');
      this.tableBody.find('td:nth-child('+ (idx+1) +')').addClass('is-hidden');
      this.headerColGroup.find('col').eq(idx).addClass('is-hidden');
      if (this.bodyColGroup) {
        this.bodyColGroup.find('col').eq(idx).addClass('is-hidden');
      }

      // Handle colSpans if present on the column
      if (this.hasColSpans) {
        var colSpan = this.headerRow.find('th').eq(idx).attr('colspan');

        if (colSpan && colSpan > 0) {
          colSpan = colSpan - 1;
          for (var i = 0; i < colSpan; i++) {
            idx += colSpan;
            this.tableBody.find('td:nth-child('+ (idx+1) +')').addClass('is-hidden');
          }
        }
      }

      this.element.trigger('columnchange', [{type: 'hidecolumn', index: idx, columns: this.settings.columns}]);
      this.saveColumns();
      this.saveUserSettings();
    },

    /**
    * Show a hidden column.
    * @param {String} id &nbsp;-&nbsp The id of the column to show.
    */
    showColumn: function(id) {
      var idx = this.columnIdxById(id);

      if (idx === -1) {
        return;
      }

      this.settings.columns[idx].hidden = false;
      this.headerRow.find('th').eq(idx).removeClass('is-hidden');
      this.tableBody.find('td:nth-child('+ (idx+1) +')').removeClass('is-hidden');
      this.headerColGroup.find('col').eq(idx).removeClass('is-hidden');
      if (this.bodyColGroup) {
        this.bodyColGroup.find('col').eq(idx).removeClass('is-hidden');
      }

      // Handle colSpans if present on the column
      if (this.hasColSpans) {
        var colSpan = this.headerRow.find('th').eq(idx).attr('colspan');

        if (colSpan && colSpan > 0) {
          colSpan = colSpan - 1;
          for (var i = 0; i < colSpan; i++) {
            idx += colSpan;
            this.tableBody.find('td:nth-child('+ (idx+1) +')').removeClass('is-hidden');
          }
        }
      }

      this.element.trigger('columnchange', [{type: 'showcolumn', index: idx, columns: this.settings.columns}]);
      this.saveColumns();
      this.saveUserSettings();
    },

    /**
    * Export the grid contents to csv
    * @param {String} fileName &nbsp;-&nbsp The desired export filename in the download.
    * @param {String} customDs &nbsp;-&nbsp An optional customized version of the data to use.
    */
    exportToCsv: function (fileName, customDs) {
      fileName = (fileName ||
        this.element.closest('.datagrid-container').attr('id') ||
        'datagrid') +'.csv';

      var csvData,
        self = this,
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
              elm.text('\'' + text);
            }
          });
          return table;
        },
        appendRows = function(dataset, table) {
          var tableHtml,
            body = table.find('tbody').empty();

          for (var i = 0; i < dataset.length; i++) {
            if (!dataset[i].isFiltered) {
              tableHtml += self.rowHtml(dataset[i], i, i);
            }
          }

          body.append(tableHtml);
          return table;
        },
        base64 = function(s) {
          if (window.btoa) {
            return 'data:application/csv;base64,' + window.btoa(unescape(encodeURIComponent(s)));
          } else {
            return 'data:application/csv;,' + unescape(encodeURIComponent(s));
          }
        },
        formatCsv = function(table) {
          var csv = [],
            rows = table.find('tr'),
            row, cols, content;

          //CHECK EXPORTABLE
          var nonExportables = [];
          $.each($('th').not('.is-hidden'), function(index, item) {
            if ($(item)[0].getAttribute('data-exportable') && $(item)[0].getAttribute('data-exportable') === 'no') {
              nonExportables.push(index);
            }
          });

          for (var i = 0, l = rows.length; i < l; i++) {
            row = [];
            cols = $(rows[i]).find('td, th');
            for (var i2 = 0; i2 < cols.length; i2++) {
              if (nonExportables.indexOf(i2) <= -1) {
                content = cols[i2].innerText.replace('"', '""');

                // Exporting data with trailing negative signs moved in front
                if (self.settings.exportConvertNegative) {
                  content = content.replace(/^(.+)(\-$)/, '$2$1');
                }
                row.push(content);
              }
            }
            csv.push(row.join('","'));
          }
          return '"'+ csv.join('"\n"') +'"';
        },
        table = self.table.clone();

      table = appendRows(customDs || this.settings.dataset, table);
      if (!table.find('thead').length) {
        self.headerRow.clone().insertBefore(table.find('tbody'));
      }

      table = cleanExtra(table);
      csvData = formatCsv(table);

      if (this.isIe) {
        if (this.isIe9) {
          var IEwindow = window.open();
          IEwindow.document.write('sep=,\r\n' + csvData);
          IEwindow.document.close();
          IEwindow.document.execCommand('SaveAs', true, fileName);
          IEwindow.close();
        }
        else if (window.navigator.msSaveBlob) {
          var blob = new Blob([csvData], {
            type: 'application/csv;charset=utf-8;'
          });
          navigator.msSaveBlob(blob, fileName);
        }
      }
      else {
        var link = document.createElement('a');
        link.href = base64(csvData);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    /**
    * Export the grid contents to xls format. This may give a warning when opening the file. exportToCsv may be prefered.
    * @param {String} fileName &nbsp;-&nbsp The desired export filename in the download.
    * @param {String} worksheetName &nbsp;-&nbsp A name to give the excel worksheet tab.
    * @param {String} customDs &nbsp;-&nbsp An optional customized version of the data to use.
    */
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
              elm.text('\'' + text);
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
              tableHtml += self.rowHtml(dataset[i], i, i);
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

      // Exporting data with trailing negative signs moved in front
      if (self.settings.exportConvertNegative) {
        table.find('td').each(function() {
          var td = $(this),
            content = td.text();
          td.text(content.replace(/^(.+)(\-$)/, '$2$1'));
        });
      }

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

    /**
    * Open the personalization dialog.
    * @private
    */
    personalizeColumns: function () {
      var self = this,
        spanNext = 0,
        markup = '<div class="listview-search alternate-bg"><label class="audible" for="gridfilter">Search</label><input class="searchfield" placeholder="'+ Locale.translate('SearchColumnName') +'" name="searchfield" id="gridfilter"></div>';
        markup += '<div class="listview alternate-bg" id="search-listview"><ul>';

        for (var i = 0; i < this.settings.columns.length; i++) {
          var col = this.settings.columns[i],
            name = col.name;

          if (name && spanNext <= 0) {
            name = name.replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ');
            markup += '<li><a href="#" target="_self" tabindex="-1"> <label class="inline"><input tabindex="-1" ' + (col.hideable ===false ? 'disabled' : '') + ' type="checkbox" class="checkbox" '+ (col.hidden ? '' : ' checked') +' data-column-id="'+ (col.id || i) +'"><span class="label-text">' + name + '</span></label></a></li>';
          }

          if (spanNext > 0) {
            spanNext--;
          }

          if (col.colspan) {
            spanNext = col.colspan-1;
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
          modal.element.find('.listview').listview({searchable: true, selectOnFocus: false})
            .on('selected', function (e, args) {
              var chk = args.elem.find('.checkbox'),
                  id = chk.attr('data-column-id'),
                  isChecked = chk.prop('checked');

              args.elem.removeClass('is-selected hide-selected-color');

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
            });

          modal.element.on('close.datagrid', function () {
            self.isColumnsChanged = false;
          });

      });
    },

    // Explicitly Set the Width of a column
    setColumnWidth: function(idOrNode, width, diff) {
      var self = this,
        percent = parseFloat(width),
        columnNode = idOrNode,
        columnSettings = this.columnById(typeof idOrNode === 'string' ? idOrNode : idOrNode.attr('data-column-id'))[0];

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
      if (Math.abs(width - columnSettings.width) < 2) {
        return;
      }

      //Handle Col Span - as the width is calculated on the total
      if (columnSettings.colspan) {
        width = width / columnSettings.colspan;
      }

      // Save the column back in settings for later
      if (columnSettings) {
        columnSettings.width = width;
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

      this.element.trigger('columnchange', [{type: 'resizecolumn', index: idx, columns: this.settings.columns}]);
      this.saveColumns();
      this.saveUserSettings();
      this.clearHeaderCache();
    },

    /**
    * Generate the ui handles used to resize columns.
    *
    * @private
    */
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

          startingLeft = self.currentHeader.position().left + self.table.scrollLeft() - 10;
          self.tableWidth = self.table[0].offsetWidth;
          columnStartWidth = self.currentHeader[0].offsetWidth;
        })
        .on('drag.datagrid', function (e, ui) {
          if (!self.currentHeader || !columnDef) {
            return;
          }

          var width = (ui.left - startingLeft -1),
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

      if (isClientSide || (!totals)) {
        this.recordCount = count = self.settings.dataset.length;
      }

      //Update Selected
      if (self.contextualToolbar && self.contextualToolbar.length) {
        self.contextualToolbar.find('.selection-count').text(self.selectedRows().length + ' ' + Locale.translate('Selected'));
      }

      if (totals && totals !== -1) {
        count = totals;
      }

      var countText;
      if (self.settings.showFilterTotal && self.filteredCount > 0) {
        countText = '(' + Locale.formatNumber(count - self.filteredCount, {style: 'integer'}) + ' of ' + Locale.formatNumber(count, {style: 'integer'}) + ' ' + Locale.translate(count === 1 ? 'Result' : 'Results') + ')';
      } else {
        countText = '(' + Locale.formatNumber(count, {style: 'integer'}) + ' ' + Locale.translate(count === 1 ? 'Result' : 'Results') + ')';
      }

      if (self.settings.resultsText) {
        if (typeof self.settings.resultsText === 'function') {

          if (self.grandTotal) {
            countText = self.settings.resultsText(self, self.grandTotal, count);
          } else {
            countText = self.settings.resultsText(self, count, (count - self.filteredCount) || 0);
          }

        } else {
          countText = self.settings.resultsText;
        }
      }

      if (self.toolbar) {
        self.toolbar.find('.datagrid-result-count').html(countText);
        self.toolbar.attr('aria-label',  self.toolbar.find('.title').text());
        self.toolbar.find('.datagrid-row-count').text(count);
      }
      self.element.closest('.modal').find('.datagrid-result-count').html(countText);

      this.checkEmptyMessage();
    },

    checkEmptyMessage: function () {
      if (this.settings.emptyMessage && this.emptyMessageContainer) {
        if (this.filteredCount ===  this.recordCount || this.recordCount === 0) {
          this.emptyMessageContainer.show();
          this.element.addClass('is-empty');
        } else {
          this.emptyMessageContainer.hide();
          this.element.removeClass('is-empty');
        }
      }
    },
    //Trigger event on parent and compose the args
    triggerRowEvent: function (eventName, e, stopPropagation) {
      var self = this,
          cell = $(e.target).closest('td').index(),
          row = self.dataRowIndex($(e.target).closest('tr')),
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
      var cells,
        rowNode = this.tableBody.find('tr:not(.datagrid-expandable-row)[aria-rowindex="'+ (row + 1) +'"]');

      if (row instanceof jQuery) {
        rowNode = row;
      }

      if (includeGroups && this.settings.groupable) {
        rowNode = this.tableBody.prevAll('.datagrid-rowgroup-header').eq(row);
        if (rowNode) {
          rowNode = this.tableBody.find('.datagrid-rowgroup-header').eq(row);
        }
      }

      if (cell === -1) {
        return $();
      }

      cells = rowNode.find('td');
      return cells.eq(cell >= cells.length ? cells.length-1 : cell);
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

    handleResize: function () {
      var self = this;
      self.clearHeaderCache();
      self.renderRows();
      self.renderHeader();
    },

    // Attach All relevant events
    handleEvents: function() {
      var self = this,
        isMultiple = this.settings.selectable === 'multiple',
        isMixed = this.settings.selectable === 'mixed';

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

      // Handle Resize - Re do the columns
      if (self.settings.redrawOnResize) {
        var oldWidth = $('body')[0].offsetWidth;

        $('body').on('resize.datagrid', function () {
          var width = this.offsetWidth;
          if (width !== oldWidth) {
            oldWidth = width;
            self.handleResize();
          }
        });
      }

      //Handle Sorting
      this.element
        .off('click.datagrid')
        .on('click.datagrid', 'th.is-sortable, th.btn-filter', function (e) {

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

        var isSelectionCheckbox = target.is('.datagrid-selection-checkbox') ||
                                  target.find('.datagrid-selection-checkbox').length === 1,
          canSelect = self.settings.clickToSelect ? true : isSelectionCheckbox;

        if (target.is('.datagrid-drilldown')) {
          canSelect = false;
        }

        if (isMixed) {
          canSelect = isSelectionCheckbox;

          //Then Activate
          if (!canSelect) {
            self.toggleRowActivation(target.closest('tr'));
          }
        }

        if (canSelect && isMultiple && e.shiftKey) {
          self.selectRowsBetweenIndexes([self.lastSelectedRow, target.closest('tr').index()]);
          e.preventDefault();
        } else if (canSelect) {
          self.toggleRowSelection(target.closest('tr'));
        }

        var isEditable = self.makeCellEditable(self.activeCell.dataRow, self.activeCell.cell, e);

        //Handle Cell Click Event
        var elem = $(this).closest('td'),
          cell = elem.parent().children(':visible').index(elem),
          col = self.columnSettings(cell, true);

        if (col.click && typeof col.click === 'function' && (target.is('button, input[checkbox], a') || target.parent().is('button'))) {

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

          if (!elem.hasClass('is-cell-readonly') && (target.is('button, input[checkbox], a') || target.parent().is('button'))) {
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
        if (isEditable) {
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
          $(e.currentTarget).popupmenu({
            menuId: self.settings.menuId,
            eventObj: e,
            beforeOpen: self.settings.menuBeforeOpen,
            attachToBody: true,
            trigger: 'immediate'})
          .off('selected').on('selected', function (e, args) {
            if (self.settings.menuSelected) {
              self.settings.menuSelected(e, args);
            }
          }).off('close').on('close', function () {
            var elem = $(this);
            if (elem.data('popupmenu')) {
              elem.data('popupmenu').destroy();
            }
          });
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
            self.currentHeader = self.currentHeader.prevAll(':visible').not('.is-hidden').first();
          }

          if (!self.currentHeader.hasClass('is-resizable')) {
            return;
          }

          self.createResizeHandle();
          self.resizeHandle[0].style.left = leftPos +'px';
          self.resizeHandle[0].style.cursor = '';
        }).off('contextmenu.datagrid').on('contextmenu.datagrid', 'th', function (e) {

          // Add Header Context Menu Support
          e.preventDefault();

          if (self.settings.headerMenuId) {

            $(e.currentTarget)
            .popupmenu({
              menuId: self.settings.headerMenuId,
              eventObj: e,
              attachToBody: true,
              beforeOpen: self.settings.headerMenuBeforeOpen,
              trigger: 'immediate'})
              .off('selected.gridpopup')
              .on('selected.gridpopup', function (e, args) {
                self.settings.headerMenuSelected(e, args);
              });

          }

          return false;
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

        if ($(target).is('input.lookup, input.timepicker, input.datepicker, input.spinbox, input.colorpicker')) {
          // Wait for modal popup, if did not found modal popup means
          // icon was not clicked, then commit cell edit
          setTimeout(function() {

            var focusElem = $('*:focus');

            if (!$('.lookup-modal.is-visible, #timepicker-popup, #calendar-popup, #colorpicker-menu').length &&
                self.editor) {

              if (focusElem.is('.spinbox')) {
                return;
              }

              if (focusElem.is('.trigger')) {
                return;
              }

              if (!$(target).is(':visible')) {
                return;
              }

              if (focusElem && self.editor.className && focusElem.closest(self.editor.className).length > 0) {
                return;
              }

              self.commitCellEdit(self.editor.input);
            }

          }, 150);

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

    // Adjust to set a changed row height
    refreshSelectedRowHeight: function () {
      var toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)'),
        short = toolbar.find('[data-option="row-short"]'),
        med = toolbar.find('[data-option="row-medium"]'),
        normal = toolbar.find('[data-option="row-normal"]');

      if (this.settings.rowHeight === 'short') {
        short.parent().addClass('is-checked');
        med.parent().removeClass('is-checked');
        normal.parent().removeClass('is-checked');
      }

      if (this.settings.rowHeight === 'medium') {
        short.parent().removeClass('is-checked');
        med.parent().addClass('is-checked');
        normal.parent().removeClass('is-checked');
      }

      if (this.settings.rowHeight === 'normal') {
        short.parent().removeClass('is-checked');
        med.parent().removeClass('is-checked');
        normal.parent().addClass('is-checked');
      }

      // Set draggable targets arrow height
      $('.drag-target-arrows', this.element).css('height', this.getTargetHeight() +'px');
    },

    appendToolbar: function () {
      var toolbar, title = '', more, self = this;

      if (!settings.toolbar) {
        return;
      }

      //Allow menu to be added manually
      if (this.element.parent().find('.toolbar:not(.contextual-toolbar)').length === 1) {
        toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)');
        this.refreshSelectedRowHeight();
      } else {
        toolbar = $('<div class="toolbar" role="toolbar"></div>');
        this.removeToolbarOnDestroy = true;

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
          // self.exportToExcel();
          self.exportToCsv();
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

      if (settings.toolbar && settings.toolbar.keywordFilter) {

        var thisSearch = toolbar.find('.searchfield'),
          xIcon = thisSearch.parent().find('.close.icon');

        thisSearch.off('keypress.datagrid').on('keypress.datagrid', function (e) {
          if (e.keyCode === 13 || e.type==='change') {
            e.preventDefault();
            self.keywordSearch(thisSearch.val());
          }
        });

        xIcon.off('click.datagrid').on('click.datagrid', function () {
          self.keywordSearch(thisSearch.val());
        });

      }

      this.toolbar = toolbar;
      this.element.addClass('has-toolbar');
    },

    //Get or Set the Row Height
    rowHeight: function(height) {
      if (height) {
        settings.rowHeight = height;
      }

      this.element.add(this.table)
        .removeClass('short-rowheight medium-rowheight normal-rowheight')
        .addClass(settings.rowHeight + '-rowheight');

      if (this.virtualRange && this.virtualRange.rowHeight) {
        this.virtualRange.rowHeight = (height === 'normal' ? 40 : (height === 'medium' ? 30 : 25));
      }

      this.saveUserSettings();
      this.refreshSelectedRowHeight();
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

      term = (term || '').toLowerCase();
      this.filterExpr.push({column: 'all', operator: 'contains', value: term, keywordSearch: true});

      this.filterKeywordSearch();
      this.renderRows();
      this.resetPager('searched');
      this.setSearchActivePage();

      if (!this.settings.paging) {
        this.highlightSearchRows(term);
      }
    },

    // Set search active page
    setSearchActivePage: function () {
      if (this.pager && this.filterExpr.length === 1) {
        if (this.filterExpr[0].value !== '') {
          if (this.pager.searchActivePage === undefined) {
            this.pager.searchActivePage = this.pager.activePage;
          }
          this.pager.setActivePage(1, true);
        }
        else if (this.filterExpr[0].value === '' && this.pager.searchActivePage > -1) {
          this.pager.setActivePage(this.pager.searchActivePage, true);
          delete this.pager.searchActivePage;
        }
      }
      else if (this.pager && this.pager.searchActivePage > -1) {
        this.pager.setActivePage(this.pager.searchActivePage, true);
        delete this.pager.searchActivePage;
      }
    },

    // Filter to keyword search
    filterKeywordSearch: function () {
      var self = this,
        dataset, isFiltered, i, len,
        filterExpr = self.filterExpr,

        checkRow = function (data, row) {
          var isMatch = false,

            checkColumn = function (columnId) {
              var column = self.columnById(columnId)[0],
                fieldValue = self.fieldValue(data, column.field),
                value, cell = self.settings.columns.indexOf(column);

              // Use the formatted value (what the user sees in the cells) since it's a more reliable match
              value = self.formatValue(column.formatter, row, cell, fieldValue, column, data, self).toLowerCase();

              // Strip any html markup that might be in the formatted value
              value = value.replace(/(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig, '');

              return value.indexOf(filterExpr.value) > -1;
            };

          // Check in all visible columns
          if (filterExpr.column === 'all') {
            self.headerRow.find('th:visible').each(function () {
              var th = $(this),
                columnId = th.attr('data-column-id');

              isMatch = checkColumn(columnId);
              if (isMatch) {
                return false;
              }
            });
          }
          // Check in only one column, given by columnId
          else if (filterExpr.columnId) {
            isMatch = checkColumn(filterExpr.columnId);
          }
          return isMatch;
        };

      // Make sure not more/less than one filter expr
      if (!filterExpr || filterExpr.length !== 1) {
        return;
      } else {
        filterExpr = filterExpr[0];
      }

      // Check in dataset
      if (self.settings.treeGrid) {
        dataset = self.settings.treeDepth;
        for (i = 0, len = dataset.length; i < len; i++) {
          isFiltered = filterExpr.value === '' ? false : !checkRow(dataset[i].node, i);
          dataset[i].node.isFiltered = isFiltered;
        }
      }
      else {
        dataset = self.settings.dataset;
        for (i = 0, len = dataset.length; i < len; i++) {
          isFiltered = filterExpr.value === '' ? false : !checkRow(dataset[i], i);
          dataset[i].isFiltered = isFiltered;
        }
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
          } else if (found && row.is('.datagrid-expandable-row') && term !== '') {
            row.prev().show();
            row.prev().find('.datagrid-expand-btn').addClass('is-expanded');
            row.prev().find('.plus-minus').addClass('active');
            row.addClass('is-expanded').css('display', 'table-row');
            row.find('.datagrid-row-detail').css('height', 'auto');
          }

      });

    },

    selectAllRows: function () {
      var rows = [],
        s = this.settings,
        dataset = s.treeGrid ? s.treeDepth : s.dataset;

      for (var i = 0, l = dataset.length; i < l; i++) {
        if (this.filterRowRendered) {
          if (!dataset[i].isFiltered) {
            rows.push(i);
          }
        } else {
          rows.push(i);
        }
      }

      this.dontSyncUi = true;
      this.selectRows(rows, true, true);
      this.dontSyncUi = false;
      this.syncSelectedUI();
      this.element.triggerHandler('selected', [this.selectedRows(), 'selectall']);
    },

    unSelectAllRows: function () {
      var selectedRows = this.selectedRows();
      this.dontSyncUi = true;
      for (var i = 0, l = selectedRows.length; i < l; i++) {
        this.unselectRow(selectedRows[i].idx, true, true);
      }
      this.dontSyncUi = false;
      this.syncSelectedUI();
      this.element.triggerHandler('selected', [this.selectedRows(), 'deselectall']);
    },

    /**
    * Check if node index is exists in selected nodes
    * @private
    */
    isNodeSelected: function (node) {
      // As of 4.3.3, return the rows that have _selected = true
      return node._selected === true;
    },

    //Toggle selection on a single row
    selectRow: function (idx, nosync, noTrigger) {
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

      var selectedRows = this.selectedRows();
      if (s.selectable === 'single' && selectedRows.length > 0) {
        this.unselectRow(selectedRows[0].idx, true, true);
      }

      if (!rowNode.hasClass('is-selected')) {
        var rowData,
          // Select it
          selectNode = function(elem, index, data) {
            // do not add if already exists in selected
            if (self.isNodeSelected(data)) {
              return;
            }
            checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
            elem.addClass('is-selected' + (self.settings.selectable === 'mixed' ? ' hide-selected-color' : '')).attr('aria-selected', 'true')
              .find('td').attr('aria-selected', 'true');
            checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
              .addClass('is-checked').attr('aria-checked', 'true');

            data._selected = true;
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
          dataRowIndex = self.pager && s.source ? rowNode.index() : dataRowIndex;
          rowData = s.dataset[dataRowIndex];
          if (s.groupable) {
            var gData = self.groupArray[dataRowIndex];
            rowData = s.dataset[gData.group].values[gData.node];
          }
          selectNode(rowNode, dataRowIndex, rowData);
          self.lastSelectedRow = idx;// Rememeber index to use shift key
        }
      }

      if (!nosync) {
        self.syncSelectedUI();
      }

      if (!noTrigger) {
        this.element.triggerHandler('selected', [this.selectedRows(), 'select']);
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

    syncHeaderCheckbox: function (rows) {
      var headerCheckbox = this.headerRow.find('.datagrid-checkbox'),
        selectedRows = this.selectedRows(),
        status = headerCheckbox.data('selected');

      // Do not run if checkbox in same state
      if ((selectedRows.length > 0 && status === 'partial') ||
        (selectedRows.length === rows.length && status === 'all') ||
        (selectedRows.length === 0 && status === 'none')) {
        return;
      }

      //Sync the header checkbox
      if (selectedRows.length > 0) {
        headerCheckbox.data('selected', 'partial')
          .addClass('is-checked is-partial');
      }

      if (selectedRows.length === rows.length) {
        headerCheckbox.data('selected', 'all')
          .addClass('is-checked').removeClass('is-partial');
      }

      if (selectedRows.length === 0) {
        headerCheckbox.data('selected', 'none')
          .removeClass('is-checked is-partial');
      }
    },

    //Set ui elements based on selected rows
    syncSelectedUI: function () {
      var s = this.settings,
        dataset = s.treeGrid ? s.treeDepth : s.dataset,
        rows = dataset;

      if (this.filterRowRendered) {
        rows = [];
        for (var i = 0, l = dataset.length; i < l; i++) {
          if (!dataset[i].isFiltered) {
            rows.push(i);
          }
        }
      }

      this.syncHeaderCheckbox(rows);

      //Open or Close the Contextual Toolbar.
      if (this.contextualToolbar.length !== 1 || this.dontSyncUi) {
        return;
      }

      var selectedRows = this.selectedRows();

      if (selectedRows.length === 0) {
        this.contextualToolbar.animateClosed();
      }

      if (selectedRows.length > 0 && this.contextualToolbar.height() === 0) {
        this.contextualToolbar.css('display', 'block').one('animateopencomplete.datagrid', function() {
          $(this).triggerHandler('recalculate-buttons');
        }).animateOpen();
      }

    },

    // activate a row when in mixed selection mode
    activateRow: function(idx) {
      if (this.activatedRow()[0].row !== idx) {
        this.toggleRowActivation(idx);
      }
    },

    // deactivate the currently activated row
    deactivateRow: function() {
      var idx = this.activatedRow()[0].row;
      if (idx >= 0) {
        this.toggleRowActivation(idx);
      }
    },

    // Gets the currently activated row
    activatedRow: function() {
      if (!this.tableBody) {
        return [{ row: -1, item: undefined, elem: undefined }];
      }

      var activatedRow = this.tableBody.find('tr.is-rowactivated');

      if (activatedRow.length) {
        var rowIndex = this.dataRowIndex(activatedRow);

        if (this.settings.indeterminate) {
          rowIndex = this.actualArrayIndex(activatedRow);
        }

        return [{ row: rowIndex, item: this.settings.dataset[rowIndex], elem: activatedRow }];
      } else {
        //Activated row may be filtered or on another page, so check all until find it
        for (var i = 0; i < this.settings.dataset.length; i++) {
          if (this.settings.dataset[i]._rowactivated) {
            return [{ row: i, item: this.settings.dataset[i], elem: undefined }];
          }
        }

        return [{ row: -1, item: undefined, elem: activatedRow }];
      }
    },

    toggleRowActivation: function (idx) {
      var row = (typeof idx === 'number' ? this.tableBody.find('tr[aria-rowindex="'+ (idx + 1) +'"]') : idx),
        rowIndex = (typeof idx === 'number' ? idx : ((this.pager && this.settings.source) ? this.actualArrayIndex(row) : this.dataRowIndex(row))),
        item = this.settings.dataset[rowIndex],
        isActivated = item ? item._rowactivated : false;

      if (typeof idx === 'number' && this.pager && this.settings.source && this.settings.indeterminate) {
        var rowIdx = idx + ((this.pager.activePage -1) * this.settings.pagesize);
        row = this.tableBody.find('tr[aria-rowindex="'+ (rowIdx + 1) +'"]');
        rowIndex = idx;
      }

      if (isActivated) {
        if (!this.settings.disableRowDeactivation) {
          row.removeClass('is-rowactivated');
          delete this.settings.dataset[rowIndex]._rowactivated;
          this.element.triggerHandler('rowdeactivated', [{row: rowIndex, item: this.settings.dataset[rowIndex]}]);
        }
      } else {
        //Deselect old row
        var oldActivated = this.tableBody.find('tr.is-rowactivated');
        if (oldActivated.length) {
          oldActivated.removeClass('is-rowactivated');

          var oldIdx = this.dataRowIndex(oldActivated);
          if (this.settings.dataset[oldIdx]) { // May have changed page
            delete this.settings.dataset[oldIdx]._rowactivated;
          }
          this.element.triggerHandler('rowdeactivated', [{row: oldIdx, item: this.settings.dataset[oldIdx]}]);
        } else {
          // Old active row may be filtered or on another page, so check all until find it
          for (var i = 0; i < this.settings.dataset.length; i++) {
            if (this.settings.dataset[i]._rowactivated) {
              delete this.settings.dataset[i]._rowactivated;
              this.element.triggerHandler('rowdeactivated', [{row: i, item: this.settings.dataset[i]}]);
              break;
            }
          }
        }

        //Activate new row
        row.addClass('is-rowactivated');
        if (this.settings.dataset[rowIndex]) { // May have changed page
          this.settings.dataset[rowIndex]._rowactivated = true;
          this.element.triggerHandler('rowactivated', [{row: rowIndex, item: this.settings.dataset[rowIndex]}]);
        }
      }

    },

    toggleRowSelection: function (idx) {
      var row = (typeof idx === 'number' ? this.tableBody.find('tr[aria-rowindex="'+ (idx + 1) +'"]') : idx),
        isSingle = this.settings.selectable === 'single',
        rowIndex = (typeof idx === 'number' ? idx :
        (this.settings.treeGrid || this.settings.groupable) ?
        this.dataRowIndex(row) : this.actualArrayIndex(row));

      if (this.settings.selectable === false) {
        return;
      }

      if (this.editor && row.hasClass('is-selected')) {
        return;
      }

      if (isSingle && row.hasClass('is-selected')) {
        this.unselectRow(rowIndex);
        this.displayCounts();
        return this.selectedRows();
      }

      if (row.hasClass('is-selected')) {
        this.unselectRow(rowIndex);
      } else {
        this.selectRow(rowIndex);
      }

      this.displayCounts();

      return this.selectedRows();
    },

    unselectRow: function (idx, nosync, noTrigger) {
      var self = this,
        s = self.settings,
        rowNode = self.visualRowNode(idx),
        checkbox = null;

      if (!rowNode || idx === undefined) {
        return;
      }

      // Unselect it
      var unselectNode = function(elem, index) {
        var removeSelected = function (node) {
          delete node._selected;
          self.selectedRowCount--;
        };
        checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
        elem.removeClass('is-selected hide-selected-color').removeAttr('aria-selected')
          .find('td').removeAttr('aria-selected');
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .removeClass('is-checked no-animate').attr('aria-checked', 'false');

        if (s.treeGrid) {
          for (var i = 0; i < s.treeDepth.length; i++) {
            if (self.isNodeSelected(s.treeDepth[i].node)) {
              if (typeof index !== 'undefined') {
                if (index === s.treeDepth[i].idx -1) {
                  removeSelected(s.treeDepth[i].node);
                }
              } else {
                removeSelected(s.treeDepth[i].node);
              }
            }
          }
        } else {
          var selIdx = elem.length ? self.actualArrayIndex(elem) : index,
            rowData;

          if (selIdx !== undefined && selIdx > -1) {
            rowData = self.settings.dataset[selIdx];
          }
          if (s.groupable) {
            var gData = self.groupArray[idx];
            rowData = s.dataset[gData.group].values[gData.node];
          }
          if (rowData !== undefined) {
            removeSelected(rowData);
          }
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
          unselectNode(rowNode, idx);
        }
        self.setNodeStatus(rowNode);
      }
      else {
        unselectNode(rowNode, idx);
      }

      if (!nosync) {
        self.syncSelectedUI();
      }

      if (!noTrigger) {
        self.element.triggerHandler('selected', [self.selectedRows(), 'deselect']);
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
    selectedRows: function () {
      var self = this,
        s = self.settings,
        dataset = s.treeGrid ? s.treeDepth : s.dataset,
        selectedRows = [],
        idx = -1;

      for (var i = 0, data; i < dataset.length; i++) {

        if (s.groupable) {
          for (var k = 0; k < dataset[i].values.length; k++) {
            idx++;
            data = dataset[i].values[k];
            if (self.isNodeSelected(data)) {
              selectedRows.push({
                idx: idx,
                data: data,
                elem: self.dataRowNode(idx),
                group: dataset[i]
              });
            }
          }
        }
        else {
          data = s.treeGrid ? dataset[i].node : dataset[i];
          if (self.isNodeSelected(data)) {
            selectedRows.push({idx: i, data: data, elem: self.visualRowNode(i)});
          }
        }

      }
      return selectedRows;
    },

    //Set the selected rows by passing the row index or an array of row indexes
    selectRows: function (row, nosync, selectAll) {
      var idx = -1,
          s = this.settings,
          isSingle = s.selectable === 'single',
          isMultiple = s.selectable === 'multiple' || s.selectable === 'mixed',
          dataset = s.treeGrid ? s.treeDepth : s.dataset,
          gIdx = idx;

      // As of 4.3.3, return the rows that have _selected = true
      var selectedRows = this.selectedRows();

      if (!row || row.length === 0) {
        return selectedRows;
      }

      if (isSingle) {
        //Unselect
        if (selectedRows.length) {
          this.unselectRow(selectedRows[0].idx, true, true);
        }

        //Select - may be passed array or int
        idx = ((Object.prototype.toString.call(row) === '[object Array]' ) ? row[0] : row.index());
        this.selectRow(idx, true, true);
      }

      if (isMultiple) {
        if (Object.prototype.toString.call(row) === '[object Array]' ) {
          for (var i = 0; i < row.length; i++) {
            if (s.groupable) {
              for (var k = 0; k < dataset[i].values.length; k++) {
                gIdx++;
                this.selectRow(gIdx, true, true);
              }
            }
            else {
              this.selectRow(row[i], true, true);
            }
          }

          if (row.length === 0) {
            for (var j=0, l=dataset.length; j < l; j++) {
              this.unselectRow(j, true, true);
            }
          }

        } else {
          this.selectRow(row.index(), true, true);
        }
      }

      selectedRows = this.selectedRows();
      this.displayCounts();

      if (!nosync) {
        this.syncSelectedUI();
      }
      if (!selectAll) {
        this.element.triggerHandler('selected', [selectedRows, 'select']);
      }

      return selectedRows;
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
          // Update active cell
          self.activeCell.cell = move;

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
          isGroupRow = rowNode.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer'),
          item = self.settings.dataset[self.dataRowIndex(node)],
          visibleRows = self.tableBody.find('tr:visible'),
          getVisibleRows = function(index) {
            var row = visibleRows.filter('[aria-rowindex="'+ (index + 1) +'"]');
            if (row.is('.datagrid-rowgroup-header')) {
              return row.index();
            }
            return self.dataRowIndex(row);
          },
          getGroupCell = function(currentCell, lastCell, prev) {
            var n = self.activeCell.groupNode || node;
            var nextCell = currentCell + (prev ? -1 : +1);

            if (nextCell > lastCell) {
              nextCell = prev ?
                n.prevAll(':visible').last() : n.nextAll(':visible').last();
            } else {
              nextCell = prev ?
                n.prevAll(':visible').first() : n.nextAll(':visible').first();
            }
            return nextCell;
          },
          getNextVisibleCell = function(currentCell, lastCell, prev) {
            if (isGroupRow) {
              return getGroupCell(currentCell, lastCell, prev);
            }
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
            if (cell instanceof jQuery) {
              self.setActiveCell(cell);
            } else {
              self.setActiveCell(row, cell);
            }
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
      if (this.activeCell.node.closest('tr').hasClass('datagrid-summary-row')) {
        return;
      }

      //Already in edit mode
      var cellNode = this.activeCell.node.find('.datagrid-cell-wrapper'),
        cellParent = cellNode.parent('td');

      if (cellParent.hasClass('is-editing') || cellParent.hasClass('is-editing-inline')) {
        return false;
      }

      //Commit Previous Edit
      if (this.editor && this.editor.input) {
        this.commitCellEdit(this.editor.input);
      }

      //Locate the Editor
      var col = this.columnSettings(cell);

      //Select the Rows if the cell is editable
      if (!col.editor) {
        if (event.keyCode === 32 && !$(event.currentTarget).find('.datagrid-selection-checkbox').length) {
          this.toggleRowSelection(this.activeCell.node.closest('tr'));
        }
        return false;
      }

      var dataRowIndex = this.dataRowIndex(this.dataRowNode(row)),
        rowData = this.settings.treeGrid ?
          this.settings.treeDepth[dataRowIndex].node :
          this.settings.dataset[dataRowIndex],
        cellWidth = cellParent.outerWidth(),
        isEditor = $('.is-editor', cellParent).length > 0,
        cellValue = (cellNode.text() ?
          cellNode.text() : this.fieldValue(rowData, col.field));

      if (isEditor) {
        cellValue = this.fieldValue(rowData, col.field);
      }

      if (!this.isCellEditable(dataRowIndex, cell)) {
        return false;
      }

      // In Show Ediitor mode the editor is on form already
      if (!col.inlineEditor) {

        if (isEditor) {
          cellNode.css({'position': 'static', 'height': cellNode.outerHeight()});
        }
        // initialis Editor
        cellParent
          .addClass('is-editing')
          .css({'max-width': cellWidth, 'min-width': cellWidth, 'width': cellWidth});

        cellNode.empty();
      } else {
        cellParent.addClass('is-editing-inline');
      }

      this.editor = new col.editor(dataRowIndex, cell, cellValue, cellNode, col, event, this, rowData);

      if (this.settings.onEditCell) {
        this.settings.onEditCell(this.editor);
      }

      if (this.editor.useValue) {
        cellValue = this.fieldValue(rowData, col.field);
      }
      this.editor.val(cellValue);
      this.editor.focus();
      this.element.triggerHandler('entereditmode', [{row: dataRowIndex, cell: cell, item: rowData, target: cellNode, value: cellValue, column: col, editor: this.editor}]);

      return true;
    },

    commitCellEdit: function(input) {
      var newValue, cellNode,
        isEditor = input.is('.editor'),
        isUseActiveRow = !(input.is('.timepicker, .datepicker, .lookup, .spinbox .colorpicker'));

      if (!this.editor) {
        return;
      }

      //Editor.getValue
      newValue = this.editor.val();

      if (isEditor) {
        cellNode = this.editor.td;
      } else {
        cellNode = input.closest('td');
        newValue = $.escapeHTML(newValue);
      }

      //Format Cell again
      var isInline = cellNode.hasClass('is-editing-inline');
      cellNode.removeClass('is-editing is-editing-inline');

      //Editor.destroy
      this.editor.destroy();
      this.editor = null;

      var rowIndex;
      if (this.settings.source !== null && isUseActiveRow) {
        rowIndex = this.activeCell.row;
      } else {
        rowIndex = this.dataRowIndex(cellNode.parent());
      }

      var cell = cellNode.index();
      var col = this.columnSettings(cell);
      var rowData = this.settings.treeGrid ? this.settings.treeDepth[rowIndex].node : this.settings.dataset[rowIndex];
      var oldValue = this.fieldValue(rowData, col.field);

      //Save the Cell Edit back to the data set
      this.updateCellNode(rowIndex, cell, newValue, false, isInline);
      var value = this.fieldValue(rowData, col.field);
      this.element.triggerHandler('exiteditmode', [{row: rowIndex, cell: cell, item: rowData, target: cellNode, value: value, oldValue: oldValue, column: col, editor: this.editor}]);
    },

    //Validate a particular cell if it has validation on the column and its visible
    validateCell: function (row, cell) {
      var self = this,
        column = this.columnSettings(cell),
        validate = column.validate,
        validationType;

      if (!validate) {
        return;
      }

      var rules = column.validate.split(' '),
        validator = $.fn.validation,
        cellValue = this.fieldValue(this.settings.dataset[row], column.field),
        isValid = true,
        messages = [],
        messageText = '', i;

      for (i = 0; i < rules.length; i++) {
        var rule = validator.rules[rules[i]],
          gridInfo = {row: row, cell: cell, item: this.settings.dataset[row], column: column, grid: self},
          ruleValid = rule.check(cellValue, $('<input>').val(cellValue), gridInfo);

        validationType = $.fn.validation.ValidationTypes[rule.type] || $.fn.validation.ValidationTypes.error;
        messageText = '';
        if (messages[validationType.type]) {
          messageText = messages[validationType.type];
        }

        if (!ruleValid) {
          if (messageText) {
            messageText = ((/^\u2022/.test(messageText)) ? '' : '\u2022 ') + messageText;
            messageText += '<br>' + '\u2022 ' + rule.message;
          } else {
            messageText = rule.message;
          }

          messages[validationType.type] = messageText;

          isValid = false;
        }
      }

      for (var props in $.fn.validation.ValidationTypes) {
        messageText = '';
        validationType = $.fn.validation.ValidationTypes[props];
        if (messages[validationType.type]) {
          messageText = messages[validationType.type];
        }
        if (messageText !== '') {
          self.showCellError(row, cell, messageText, validationType.type);
          self.element.trigger('cell' + validationType.type, {row: row, cell: cell, message: messageText, target: this.cellNode(row, cell), value: cellValue, column: column});
        } else {
          self.clearCellError(row, cell, validationType.type);
        }
      }
    },

    showCellError: function (row, cell, message, type) {
      var node = this.cellNode(row, cell);

      // clear the table nonVisibleCellErrors for the row and cell
      this.clearNonVisibleCellErrors(row, cell, type);

      if (!node.length) {
        // Store the nonVisibleCellError
        this.nonVisibleCellErrors.push({ row: row, cell: cell, message: message, type: type });
        this.showNonVisibleCellErrors();
        return;
      }

      //Add icon and classes
      node.addClass(type).attr('data-' + type + 'message', message);
      var icon = $($.createIcon({ classes: ['icon-' + type], icon: type }));

      //Add and show tooltip
      if (node.find('.icon-' + type).length === 0) {
        node.find('.datagrid-cell-wrapper').append(icon);
        icon.tooltip({placement: 'bottom', isErrorColor: (type === 'error' || type === 'dirtyerror'), content: message});
        icon.data('tooltip').show();
      }

    },

    showNonVisibleCellErrors: function () {

      // Create empty toolbar
      if (!this.toolbar) {
        settings.toolbar = { title: ' ' };
        this.appendToolbar();
      }
      // process via type
      for (var props in $.fn.validation.ValidationTypes) {
        var validationType = $.fn.validation.ValidationTypes[props].type;
        this.showNonVisibleCellErrorType($.grep(this.nonVisibleCellErrors, function (error) { return error.type === validationType; }), validationType);
      }
    },

    showNonVisibleCellErrorType: function (nonVisibleCellErrors, type) {
      var messages, tableerrors, icon, i,
        nonVisiblePages = [],
        validationType = $.fn.validation.ValidationTypes[type] || $.fn.validation.ValidationTypes.error;

      if (this.toolbar.parent().find('.table-errors').length === 1) {
        tableerrors  = this.toolbar.parent().find('.table-errors');
      }

      if (nonVisibleCellErrors.length === 0) {
        // clear the displayed message
        if (tableerrors  && tableerrors.length) {
          icon = tableerrors .find('.icon-' + validationType.type);
          var tooltip = icon.data('tooltip');
          if (tooltip) {
            tooltip.hide();
          }
          tableerrors.find('.icon-' + validationType.type).remove();
        }
        return;
      }

      // Process message type, so it displays one message per page
      for (i = 0; i < nonVisibleCellErrors.length; i++) {
        var page =  Math.floor((nonVisibleCellErrors[i].row + this.settings.pagesize) / this.settings.pagesize);
        if($.inArray(page, nonVisiblePages) === -1) {
          nonVisiblePages.push(page);
        }
      }

      for (i = 0; i < nonVisiblePages.length; i++) {
        messages = (messages ? messages + '<br>' : '') + Locale.translate(validationType.pagingMessageID) + ' ' + nonVisiblePages[i];
      }

      if (this.toolbar.parent().find('.table-errors').length === 0) {
        tableerrors  = $('<div class="table-errors"></div>');
      }
      icon = tableerrors .find('.icon-' + type);
      if (!icon.length) {
        icon = $($.createIcon({ classes: ['icon-' + type], icon: type }));
        tableerrors .append(icon);
      }


      if (this.element.hasClass('has-toolbar')) {
        //Add Error to the Toolbar
        this.toolbar.children('.title').append(tableerrors);
      }

      icon.tooltip({placement: 'bottom', isErrorColor: (type === 'error' || type === 'dirtyerror'), content: messages});
    },

    clearCellError: function (row, cell, type) {
      this.clearNonVisibleCellErrors(row, cell, type);
      var node = this.cellNode(row, cell);

      if (!node.length) {
        return;
      }

      this.clearNodeErrors(node, type);
    },

    clearNonVisibleCellErrors: function (row, cell, type) {

      if (!this.nonVisibleCellErrors.length) {
        return;
      }

      this.nonVisibleCellErrors = $.grep(this.nonVisibleCellErrors, function (error) {
        if (!(error.row === row && error.cell === cell && error.type === type)) {
          return error;
        }
      });

      if (!this.nonVisibleCellErrors.length) {
        this.showNonVisibleCellErrors();
      }
    },

    clearRowError: function (row) {
      var rowNode = this.dataRowNode(row);

      rowNode.removeClass('error alert');
      this.rowStatus(row, '', '');
    },

    clearAllErrors: function () {
      var self = this;

      this.tableBody.find('td.error').each(function () {
        var node = $(this);
        self.clearNodeErrors(node, 'error');
        self.clearNodeErrors(node, 'dirtyerror');
      });

      this.tableBody.find('td.alert').each(function () {
        var node = $(this);
        self.clearNodeErrors(node, 'alert');
      });

      this.tableBody.find('td.info').each(function () {
        var node = $(this);
        self.clearNodeErrors(node, 'info');
      });
    },

    clearNodeErrors: function (node, type) {
      node.removeClass(type).removeAttr('data-' + type + 'message');

      var icon = node.find('.icon-' + type),
        tooltip = icon.data('tooltip');

      if (tooltip) {
        tooltip.hide();
      }
      node.find('.icon-' + type).remove();
    },

    resetRowStatus: function () {
      for (var i = 0; i < this.settings.dataset.length; i++) {
        this.rowStatus(i, '');
      }
    },

    dirtyRows: function () {
      var rows = [],
        data = this.settings.dataset;

      for (var i = 0; i < data.length; i++) {
        if (data[i].rowStatus && data[i].rowStatus.icon === 'dirty') {
          rows.push(data[i]);
        }
      }
      return rows;
    },

    //Validate all visible cells in a row if they have validation on the column
    //Row Id, Error Text and 'error' or 'alert' (default alert)
    showRowError: function (row, message, type) {
      var messageType = type || 'error',
        rowNode = this.dataRowNode(row);

      rowNode.addClass(type);
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
      } else if (typeof oldVal === 'number' && value) {
        newVal = Locale.parseNumber(value); //remove thousands sep , keep a number a number
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

    updateCellNode: function (row, cell, value, fromApiCall, isInline) {
      var coercedVal, escapedVal,
        rowNode = this.visualRowNode(row),
        cellNode = rowNode.find('td').eq(cell),
        col = this.settings.columns[cell] || {},
        formatted = '',
        formatter = (col.formatter ? col.formatter : this.defaultFormatter),
        isEditor = $('.editor', cellNode).length > 0,
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
          isErrorColor: rowData.rowStatus.icon === 'error' || rowData.rowStatus.icon === 'dirtyerror'
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
      formatted = this.formatValue(formatter, (isTreeGrid ? row+1 : row), cell, (isEditor ? coercedVal : escapedVal), col, rowData);

      if (col.contentVisible) {
        var canShow = col.contentVisible(row, cell, escapedVal, col, rowData);
        if (!canShow) {
          formatted = '';
        }
      }

      if (!isInline) {
        cellNode.find('.datagrid-cell-wrapper').html(formatted);
      }

      if (!fromApiCall) {
        //Validate the cell
          this.validateCell(row, cell);
      }

      if (coercedVal !== oldVal && !fromApiCall) {
        var args = {row: row, cell: cell, target: cellNode, value: coercedVal, oldValue: oldVal, column: col};
        args.rowData = isTreeGrid && this.settings.treeDepth[row] ?
          this.settings.treeDepth[row].node : rowData;

        this.element.trigger('cellchange', args);
        this.wasJustUpdated = true;

        if (this.settings.showDirty) {
          this.rowStatus(row, 'dirty');
        }
      }

    },

    //For the row node get the index - adjust for paging / invisible rowsCache
    visualRowIndex: function (row) {
      return this.tableBody.find('tr:visible').index(row);
    },

    visualRowNode: function (idx) {
      var rowIdx = idx;

      if (this.settings.paging && this.settings.source) {
        rowIdx = rowIdx + ((this.pager.activePage -1) * this.settings.pagesize);
      }

      return this.tableBody.find('tr[aria-rowindex="'+ (rowIdx + 1) +'"]');
    },

    dataRowNode: function (idx) {
      return this.tableBody.find('tr[aria-rowindex="'+ (idx + 1) +'"]');
    },

    dataRowIndex: function (row) {
     return row.attr('aria-rowindex') - 1;
    },

    actualArrayIndex: function (rowElem) {
     return parseInt(rowElem.attr('data-index'));
    },

    // Update a specific Cell
    setActiveCell: function (row, cell) {
      var self = this,
        prevCell = self.activeCell,
        rowElem = row, rowNum, dataRowNum,
        isGroupRow = row instanceof jQuery && row.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');

      if (row instanceof jQuery && row.length === 0) {
        return;
      }

      if (typeof row === 'number') {
        rowNum = row;
        rowElem = this.tableBody.find('tr:visible').eq(row);
        dataRowNum = this.dataRowIndex(rowElem);
      }

      //Support passing the td in
      if (row instanceof jQuery && row.is('td')) {
        isGroupRow = row.parent().is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
        if (isGroupRow) {
          rowElem = row.parent();
        }
        cell = row.index();
        rowNum = this.visualRowIndex(row.parent());
        dataRowNum = this.dataRowIndex(row.parent());
        rowElem = row.parent();
      }

      if (row instanceof jQuery && row.is('tr')) {
        rowNum = this.visualRowIndex(row);
        dataRowNum = this.dataRowIndex(row);
        rowElem = row;
      }

      if (rowNum < 0 || cell < 0) {
        return;
      }

      //Remove previous tab index
      if (prevCell.node && prevCell.node.length ===1) {
        self.activeCell.node
          .removeAttr('tabindex')
          .removeClass('is-active');
      }

      //Hide any cell tooltips (Primarily for validation)
      if (prevCell.cell !== cell || prevCell.row !== row) {
        $('#tooltip').hide();
      }

      //Find the cell if it exists
      self.activeCell.node = self.cellNode((isGroupRow ? rowElem : (dataRowNum > -1 ? dataRowNum : rowNum)), (cell)).attr('tabindex', '0');

      if (self.activeCell.node && prevCell.node.length === 1) {
        self.activeCell.row = rowNum;
        self.activeCell.cell = cell;
        dataRowNum = this.dataRowIndex(self.activeCell.node.parent());
      } else {
        self.activeCell = prevCell;
      }

      if (!$('input, button:not(.btn-secondary, .row-btn, .datagrid-expand-btn, .datagrid-drilldown, .btn-icon)', self.activeCell.node).length) {
        self.activeCell.node.focus();
        if (isGroupRow) {
          self.activeCell.groupNode = self.activeCell.node;
        }
      }
      if (self.activeCell.node.hasClass('is-focusable')) {
        self.activeCell.node.find('button').focus();
      }

      if (dataRowNum !== undefined) {
        self.activeCell.dataRow = dataRowNum;
      }
      var colSpan = +rowElem.find('td[colspan]').attr('colspan');

      if (isGroupRow && self.activeCell.node && prevCell.node && !(row instanceof jQuery && row.is('td'))) {
        if (cell < colSpan) {
          rowElem.find('td[colspan]').attr('tabindex', '0').focus();
          self.activeCell.groupNode = rowElem.find('td[colspan]');
        }
        else if (cell >= colSpan) {
          rowElem.find('td').eq(cell-colSpan + 1).attr('tabindex', '0').focus();
          self.activeCell.groupNode = rowElem.find('td').eq(cell-colSpan + 1);
        } else {
          rowElem.find('td').eq(cell).attr('tabindex', '0').focus();
          self.activeCell.groupNode = rowElem.find('td').eq(cell);
        }
      }

      if (isGroupRow && row instanceof jQuery && row.is('td')) {
        self.activeCell.cell = (colSpan - 1) + cell;
        if (row.is('[colspan]')) {
          self.activeCell.cell = cell;
        }
      }

      if (this.settings.cellNavigation) {
        var headers = self.headerNodes(),
          prevSpans = 0;

        //Check if any previous rows are spanned
        if (this.hasColSpans) {
            prevSpans = 0;

            headers.eq(cell).prevAll('[colspan]').each(function (i, elem) {
              var span = $(elem).attr('colspan')-1;
              prevSpans += span;
            });

          cell = cell - prevSpans;
        }

        headers.removeClass('is-active');
        headers.eq(cell).addClass('is-active');
      }
      this.activeCell.isFocused = true;

      // Expand On Activate Feature
      var col = this.settings.columns[cell];
      if (col && col.expandOnActivate && this.activeCell && this.activeCell.node) {
        self.activeCell.node.addClass('is-active');
      }

      self.element.trigger('activecellchange', [{node: this.activeCell.node, row: this.activeCell.row, cell: this.activeCell.cell}]);
    },

    setNextActiveCell: function (e) {
      var self = this;
      if (e.type === 'keydown') {
        if (this.settings.actionableMode) {
          setTimeout(function() {
            var evt = $.Event('keydown.datagrid');
            evt.keyCode = 40; // move down
            self.activeCell.node.trigger(evt);
          }, 0);
        } else {
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
        level = parseInt(rowElement.attr('aria-level'), 10),
        children = rowElement.nextUntil('[aria-level="'+ level +'"]'),
        isExpanded = expandButton.hasClass('is-expanded'),
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
        children = rowElement.nextUntil('[aria-level="'+ level +'"]');

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

        var setChildren = function (rowElement, level, isExpanded) {
          var nodes = rowElement.nextUntil('[aria-level="'+ level +'"]');

          if (isExpanded) {
            nodes.each(function () {
              var node = $(this),
              nodeLevel = parseInt(node.attr('aria-level'), 10);
              if (nodeLevel > level) {
                node.addClass('is-hidden');
              }
            });
          }
          else {
            nodes.each(function () {
              var node = $(this),
                nodeLevel = parseInt(node.attr('aria-level'), 10);
              if (nodeLevel === (level + 1)) {
                node.removeClass('is-hidden');

                if (node.is('.datagrid-tree-parent')) {
                  var nodeIsExpanded = node.find('.datagrid-expand-btn.is-expanded').length > 0;
                  if (nodeIsExpanded) {
                    setChildren(node, nodeLevel, !nodeIsExpanded);
                  }
                }
              }
            });
          }
        };
        setChildren(rowElement, level, isExpanded);
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
        item = self.settings.dataset[self.actualArrayIndex(rowElement)];

      if (rowElement.hasClass('datagrid-tree-parent')) {
        return;
      }

      if (self.settings.allowOneExpandedRow && self.settings.groupable === null) {
        //collapse any other expandable rows
        var prevExpandRow = self.tableBody.find('tr.is-expanded'),
          parentRow = prevExpandRow.prev(),
          parentRowIdx = parentRow.attr('aria-rowindex');

        if (prevExpandRow.length && expandRow.index() !== prevExpandRow.index()) {
          var prevDetail = prevExpandRow.find('.datagrid-row-detail');

          prevExpandRow.removeClass('is-expanded');
          parentRow.removeClass('is-rowactivated');
          parentRow.find('.plus-minus').removeClass('active');
          prevDetail.animateClosed().on('animateclosedcomplete', function () {
            prevExpandRow.css('display', 'none').removeClass('is-expanded');
            self.element.triggerHandler('collapserow', [{grid: self, row: parentRowIdx, detail: prevDetail, item: self.settings.dataset[parentRowIdx] }]);
          });

          var prevActionBtn = prevExpandRow.prev().find('.btn-primary');
          if (prevActionBtn.length) {
            prevActionBtn.attr('class', prevActionBtn.attr('class').replace('btn-primary','btn-secondary'));
          }
        }

        //Toggle the button to make it primary
        var isExpanded = !expandRow.hasClass('is-expanded'),
          actionButton = expandRow.prev().find(isExpanded ? '.btn-secondary' : '.btn-primary');

        if (actionButton.length > 0 && parentRow && actionButton) {
          var currentClass = actionButton.attr('class') || '';

          actionButton.attr('class', currentClass.replace(isExpanded ? 'btn-secondary' : 'btn-primary',
              isExpanded ? 'btn-primary' : 'btn-secondary') );
        }
      }

      if (expandRow.hasClass('is-expanded')) {
        expandRow.removeClass('is-expanded');
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');

        if (self.settings.allowOneExpandedRow) {
          rowElement.removeClass('is-rowactivated');
        }

        detail.animateClosed().on('animateclosedcomplete', function () {
        //  expandRow.css('display', 'none');
          self.element.triggerHandler('collapserow', [{grid: self, row: dataRowIndex, detail: detail, item: item}]);
        });

      } else {
        expandRow.addClass('is-expanded');
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');

        expandRow.css('display', 'table-row');

        //Optionally Contstrain the width
        expandRow.find('.constrained-width').css('max-width', this.element.outerWidth());

        if (self.settings.allowOneExpandedRow) {
          rowElement.addClass('is-rowactivated');
        }

        var eventData = [{grid: self, row: dataRowIndex, detail: detail, item: item}];

        if (self.settings.onExpandRow) {
          var response;
          response = function(markup) {
            if (markup) {
              detail.find('.datagrid-row-detail-padding').empty().append(markup);
            }
            detail.animateOpen();
          };

          self.settings.onExpandRow(eventData[0], response);
        } else {
          detail.animateOpen();
        }

        self.element.triggerHandler('expandrow', eventData);
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
      this.sortColumn.sortAsc = ascending;

      //Do Sort on Data Set
      this.setSortIndicator(id, ascending);
      this.sortDataset();

      var wasFocused = this.activeCell.isFocused;
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.renderRows();
      // Update selected and Sync header checkbox
      this.syncSelectedUI();

      if (wasFocused && this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }

      this.resetPager('sorted');
      this.tableBody.removeClass('is-loading');
      this.saveUserSettings();
      this.element.trigger('sorted', [this.sortColumn]);
    },

    sortDataset: function() {
      if (this.originalDataset) {
        this.settings.dataset = this.originalDataset;
      }
      var sort = this.sortFunction(this.sortColumn.sortId, this.sortColumn.sortAsc);

      if (!this.settings.disableClientSort) {
        settings.dataset.sort(sort);
      }
    },

    setSortIndicator: function(id, ascending) {
      if (!this.headerRow) {
        return;
      }

      //Set Visual Indicator
      this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc').attr('aria-sort', 'none');
      this.headerRow.find('[data-column-id="' +id + '"]')
        .addClass(ascending ? 'is-sorted-asc' : 'is-sorted-desc')
        .attr('aria-sort', ascending ? 'ascending' : 'descending');
    },

    /**
    * Overridable function to conduct array sorting
    * @param {String} id &nbsp;-&nbsp The matching field/id in the array to sort on
    * @param {Boolean} ascending &nbsp;-&nbsp Determines direction of the sort.
    */
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

    /**
    * Determine equality for two deeply nested JavaScript objects
    * @private
    */
    isEquivalent: function(obj1, obj2) {
      function _equals(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify($.extend(true, {}, obj1, obj2));
      }
      return _equals(obj1, obj2) && _equals(obj2, obj1);
    },

    /**
    * The default formatter to use (just plain text). When no formatter is specified.
    * @private
    */
    defaultFormatter: function(row, cell, value) {
      return ((value === null || value === undefined || value === '') ? '' : value.toString());
    },

    /**
    * Add the pager and paging functionality.
    * @private
    */
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
        hideOnOnePage: this.settings.hidePagerOnOnePage,
        source: this.settings.source,
        pagesize: this.settings.pagesize,
        indeterminate: this.settings.indeterminate,
        rowTemplate: this.settings.rowTemplate,
        pagesizes: this.settings.pagesizes,
        showPageSizeSelector: this.settings.showPageSizeSelector,
        activePage: this.restoreActivePage ? parseInt(this.savedActivePage) : 1
      });

      if (this.restoreActivePage) {
        this.savedActivePage = null;
        this.restoreActivePage = false;
      }

      this.pager = pagerElem.data('pager');

      pagerElem.off('afterpaging')
      .on('afterpaging', function (e, args) {

        // Hide the entire pager bar if we're only showing one page, if applicable
        if (self.pager.hidePagerBar(args)) {
          self.element.removeClass('paginated');
        } else {
          self.element.addClass('paginated');
        }

        self.recordCount = args.total;
        self.displayCounts(args.total);

        //Handle row selection across pages
        self.syncSelectedUI();

        if (self.filterExpr && self.filterExpr[0] && self.filterExpr[0].column === 'all') {
          self.highlightSearchRows(self.filterExpr[0].value);
        }
      });

    },

    /**
    * Add the pager and paging functionality.
    * @param {String} pagingInfo &nbsp;-&nbsp The paging object with activePage ect used by pager.js
    * @param {Boolean} isResponse &nbsp;-&nbsp Internal flag used to prevent callbacks from rexecuting.
    */
    renderPager: function (pagingInfo, isResponse, callback) {
      var api = this.pager;

      if (!api) {
        return;
      }

      api.updatePagingInfo(pagingInfo);

      if (!isResponse) {
        api.renderPages(pagingInfo.type, callback);
      }

      // Update selected and Sync header checkbox
      this.syncSelectedUI();
    },

    /**
    * Reset the pager to the first page.
    * @param {String} type &nbsp;-&nbsp The action type, which gets sent to the source callback.
    */
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

    /**
    * Unwrap the grid back to a simple div, and destory all events and pointers.
    */
    destroy: function() {
      //Remove the toolbar, clean the div out and remove the pager
      this.element.off().empty().removeClass('datagrid-container');
      var toolbar = this.element.prev('.toolbar');

      this.triggerDestroyCell();

      if (this.removeToolbarOnDestroy && settings.toolbar && settings.toolbar.keywordFilter) {
        var searchfield = toolbar.find('.searchfield');
        if (searchfield.data('searchfield')) {
          searchfield.data('searchfield').destroy();
        }
        if (searchfield.data('toolbarsearchfield')) {
          searchfield.data('toolbarsearchfield').destroy();
        }
        searchfield.removeData('options');
      }

      if (this.removeToolbarOnDestroy) {
        // only remove toolbar if it was created by this datagrid
        if (toolbar.data('toolbar')) {
          toolbar.data('toolbar').destroy();
        }
        toolbar.remove();
      }
      this.element.next('.pager-toolbar').remove();
      $.removeData(this.element[0], pluginName);

      //TODO Test Memory Leaks in Chrome - null out fx this.table
      $(document).off('touchstart.datagrid touchend.datagrid touchcancel.datagrid click.datagrid touchmove.datagrid');
      this.contentContainer.off().remove();
      $('body').off('resize.vtable resize.datagrid');

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
