/* eslint-disable */

/**
* A object containing all the supported UI formatters.
* @private
*/
let formatters = {

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
    } else if (value) {
      value2 = Locale.formatDate(value, { pattern: (localeDateFormat +' '+ (col.sourceFormat || col.timeFormat || localeTimeFormat)) });
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
      formatted = Locale.formatNumber(value, col.numberFormat);
    }
    return ((formatted === null || formatted === undefined) ? '' : formatted);
  },

  Integer:  function(row, cell, value, col) {
    var formatted = value;
    if (typeof Locale !== undefined &&
        formatted !== null && formatted !== undefined && formatted !== '') {
      formatted = Locale.formatNumber(value, col.numberFormat || {style: 'integer'});
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

export { formatters as Formatters };
