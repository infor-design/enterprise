import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';
import { xssUtils } from '../../utils/xss';

// jQuery Components
import '../icons/icons.jquery';

/**
 * *
 * Calculate if a Placeholder is required and its value.
 * @private
 * @param  {object} formattedValue The formatted cell value
 * @param  {number} row The row index
 * @param  {number} cell The cell index
 * @param  {object} value The value in the dataset
 * @param  {object} col The column definition
 * @param  {object} item The row data
 * @returns {object} Returns the placeholder value.
 */
function calculatePlaceholder(formattedValue, row, cell, value, col, item) {
  let placeholder = col.placeholder;
  if (placeholder && formattedValue === '') {
    const getType = {};
    if (getType.toString.call(placeholder) === '[object Function]') {
      placeholder = placeholder(row, cell, value, col, item);
    } else if (item && placeholder in item) {
      placeholder = item[placeholder];
    }

    return placeholder;
  }

  return '';
}

/**
 * *
 * Check if given column is disabled.
 * @private
 * @param  {number} row The row index
 * @param  {number} cell The cell index
 * @param  {object} value The value in the dataset
 * @param  {object} col The column definition
 * @param  {object} item The row data
 * @returns {boolean} Returns checked value.
 */
function isColumnDisabled(row, cell, value, col, item) {
  const isTrue = v => (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === true) || (typeof v === 'string' && v.toLowerCase() === 'true')));
  const disabled = col ? col.disabled : null;

  return typeof disabled === 'function' ?
    disabled(row, cell, value, col, item) : isTrue(disabled);
}

/**
* A object containing all the supported UI formatters.
* @private
*/
const formatters = {
  Text(row, cell, value) {
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  },

  Input(row, cell, value, col) {
    if (col.inlineEditor) {
      const html = `<label for="datagrid-inline-input-${row}-${cell}" class="audible">${col.name}</label><input id="datagrid-inline-input-${row}-${cell}" class="${(col.align === 'right' ? 'is-number-mask' : '')}" value="${value}">`;

      return html;
    }

    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  },

  Placeholder(row, cell, value, col, item) {
    const placeholder = calculatePlaceholder(value, row, cell, value, col, item);
    if (placeholder !== '') {
      const html = `<span class="is-placeholder">${placeholder}</span>`;

      return html;
    }

    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  },

  Ellipsis(row, cell, value, col) {
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    col.textOverflow = 'ellipsis';
    return str;
  },

  Password(row, cell, value) {
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str.replace(/./g, '*');
  },

  Readonly(row, cell, value) {
    return `<span class="is-readonly">${((value === null || value === undefined) ? '' : value)}</span>`;
  },

  RowNumber(row, cell, value, col, item, api) {
    let rowNumber = api.runningCount || 1;
    if (api?.pagerAPI?.activePage > 1) {
      rowNumber += (api.pagerAPI.activePage - 1) * api.pagerAPI.settings.pagesize;
    }

    return `<span class="is-readonly">${rowNumber}</span>`;
  },

  Date(row, cell, value, col, isReturnValue) {
    let formatted = ((value === null || value === undefined) ? '' : value);
    let value2;

    if (typeof value === 'string' && value) {
      if (col.sourceFormat) {
        value2 = Locale.parseDate(value, (typeof col.sourceFormat === 'string' ? { pattern: col.sourceFormat } : col.sourceFormat));
      } else {
        value2 = Locale.parseDate(value, (typeof col.dateFormat === 'string' ? { pattern: col.dateFormat } : col.dateFormat));
      }

      if (value2) {
        formatted = Locale.formatDate(value2, (typeof col.dateFormat === 'string' ? { pattern: col.dateFormat } : col.dateFormat));
      } else {
        formatted = Locale.formatDate(value, (typeof col.dateFormat === 'string' ? { pattern: col.dateFormat } : col.dateFormat));

        if ((formatted === 'NaN/NaN/NaN' || !formatted) && formatted !== '') { // show invalid dates not NaN/NaN/NaN
          formatted = value;
        }
      }
    } else if (value) {
      formatted = Locale.formatDate(value, (typeof col.dateFormat === 'string' ? { pattern: col.dateFormat } : col.dateFormat));
    }

    if (!col.editor || isReturnValue === true) {
      return formatted;
    }

    return `<span class="trigger">${formatted}</span>${$.createIcon({ icon: 'calendar', classes: ['icon-calendar'] })}`;
  },

  Time(row, cell, value, col, isReturnValue) {
    let formatted = ((value === null || value === undefined) ? '' : value);
    const localeDateFormat = ((typeof Locale === 'object' && Locale.calendar().dateFormat) ? Locale.calendar().dateFormat.short : null);
    const localeTimeFormat = ((typeof Locale === 'object' && Locale.calendar().timeFormat) ? Locale.calendar().timeFormat : null);
    let value2;

    const parseTime = function (timeString) {
      if (timeString === '') {
        return null;
      }
      const time = timeString.match(/(\d+)(?::(\d\d))(?::(\d\d))?\s*([pP]?)/i);
      if (time === null) {
        return null;
      }
      const getValue = v => (!isNaN(parseInt(v, 10)) ? parseInt(v, 10) : 0);
      const d = new Date();
      let hours = getValue(time[1]);
      hours -= (hours === 12 ? 12 : 0);
      hours += (time[4] ? 12 : 0);
      d.setHours(hours);
      d.setMinutes(getValue(time[2]));
      d.setSeconds(getValue(time[3]));
      return d;
    };

    if (typeof value === 'string' && value) {
      value2 = Locale.formatDate(parseTime(value), { pattern: (`${localeDateFormat} ${(col.sourceFormat || col.timeFormat || localeTimeFormat)}`) });

      if (value2) {
        formatted = value2.slice(value2.indexOf(' '));
      }
    } else if (value) {
      value2 = Locale.formatDate(value, { pattern: (`${localeDateFormat} ${(col.sourceFormat || col.timeFormat || localeTimeFormat)}`) });
      if (value2) {
        formatted = value2.slice(value2.indexOf(' '));
      }
    }

    // Remove extra space in begining
    formatted = formatted.replace(/^\s/, '');

    if (!col.editor || isReturnValue === true) {
      return formatted;
    }
    return `<span class="trigger">${formatted}</span>${$.createIcon({ icon: 'clock', classes: ['icon-clock'] })}`;
  },

  Autocomplete(row, cell, value) {
    const formatted = ((value === null || value === undefined) ? '' : value);
    return formatted;
  },

  Lookup(row, cell, value, col, item) {
    let formatted = ((value === null || value === undefined) ? '' : value);
    let isPlaceholder = false;

    const placeholder = calculatePlaceholder(formatted, row, cell, value, col, item);
    if (placeholder !== '') {
      isPlaceholder = true;
    }

    if (!col.editor) {
      if (isPlaceholder) {
        return `<span class="is-placeholder">${placeholder}</span>`;
      }
      return formatted;
    }

    if (col.editorOptions && typeof col.editorOptions.field === 'function') {
      formatted = col.editorOptions.field(item, null, null);
      isPlaceholder = false;
    }

    if (formatted === null || formatted === undefined || formatted === '') {
      formatted = '';
      if (placeholder) {
        isPlaceholder = true;
        formatted = placeholder;
      }
    }
    return `<span class="trigger ${isPlaceholder ? 'is-placeholder' : ''}${col.align === 'right' ? 'align-text-right' : ''}">${formatted}</span>${$.createIcon({ icon: 'search-list', classes: ['icon-search-list'] })}`;
  },

  Decimal(row, cell, value, col, item) {
    let formatted = value;

    if (typeof Locale !== 'undefined' &&
        formatted !== null && formatted !== undefined && formatted !== '') {
      formatted = Locale.formatNumber(value, col.numberFormat);
    }

    formatted = (formatted === null || formatted === undefined || formatted === 'NaN') ? '' : formatted;

    const placeholder = calculatePlaceholder(formatted, row, cell, value, col, item);
    if (placeholder !== '') {
      const html = `<span class="is-placeholder">${placeholder}</span>`;

      return html;
    }

    return (formatted);
  },

  Integer(row, cell, value, col) {
    let formatted = value;
    if (typeof Locale !== 'undefined' &&
        formatted !== null && formatted !== undefined && formatted !== '') {
      formatted = Locale.formatNumber(value, col.numberFormat || { style: 'integer' });
    }
    return (formatted === null || formatted === undefined || formatted === 'NaN') ? '' : formatted;
  },

  Hyperlink(row, cell, value, col, item, api) {
    const disableAttr = isColumnDisabled(row, cell, value, col, item) ? ' disabled' : '';
    let colHref = col.href || '#';

    // Support for dynamic links based on content
    if (col.href && typeof col.href === 'function') {
      colHref = col.href(row, cell, item, col);
      // Passing a null href will produce "just text" with no link
      if (colHref == null) {
        return col.text || value;
      }
    } else {
      colHref = colHref.replace('{{value}}', value);
    }

    const textValue = col.text || value;
    if (!textValue && !col.icon) {
      return '';
    }

    return col.icon ?
      (`<a href="${colHref}"${disableAttr} class="btn-icon row-btn ${(col.cssClass || '')}" ${(!api.settings.rowNavigation ? '' : 'tabindex="-1"')}${(col.hyperlinkTooltip ? ` title="${col.hyperlinkTooltip}"` : '')}>
          ${$.createIcon({ icon: col.icon, file: col.iconFile })}
          <span class="audible">${textValue}</span>
        </a>`) :
      (`<a href="${colHref}"${disableAttr} ${(!api.settings.rowNavigation ? '' : 'tabindex="-1"')} role="presentation" class="hyperlink ${(col.cssClass || '')}"${(col.target ? ` target="${col.target}"` : '')}${(col.hyperlinkTooltip ? ` title="${col.hyperlinkTooltip}"` : '')}>${textValue}</a>`);
  },

  Template(row, cell, value, col, item) {
    const tmpl = col.template;
    let renderedTmpl = '';

    if (Tmpl && item && tmpl) {
      renderedTmpl = Tmpl.compile(`{{#dataset}}${tmpl}{{/dataset}}`, { dataset: item });
    }

    return renderedTmpl;
  },

  Drilldown() {
    let text = Locale.translate('Drilldown');

    if (text === undefined) {
      text = '';
    }

    return (
      `<button type="button" tabindex="-1" class="btn-icon small datagrid-drilldown">
         ${$.createIcon({ icon: 'drilldown' })}
        <span>${text}</span>
      </button>`
    );
  },

  RowReorder() {
    let text = Locale.translate('ReorderRows');

    if (text === undefined) {
      text = 'Reorder Rows';
    }

    return (
      `<div class="datagrid-reorder-icon">
         ${$.createIcon({ icon: 'drag' })}
        <span class="audible">${text}</span>
      </div>`
    );
  },

  Checkbox(row, cell, value, col, item, api) {
    let isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      // treat 1, true or '1' as checked
      isChecked = (value === undefined ? false : (value === true || parseInt(value, 10) === 1));
    }

    // We add hidden Yes/No text so that the exported excel spreadsheet shows
    // this text in checkbox columns
    const hiddenText = `<span class="hidden" aria-hidden="true" role="presentation"> ${Locale.translate(isChecked ? 'Yes' : 'No')}</span>`;

    const animate = api.wasJustUpdated;
    api.wasJustUpdated = false;
    return `<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="${col.name}" class="datagrid-checkbox
     ${(isChecked ? `is-checked ${(!animate ? ' no-animation' : ' ')}` : '')}" aria-checked="${isChecked}"></span>${hiddenText}</div>`;
  },

  SelectionCheckbox(row, cell, value, col, item, api) {
    let isChecked = (value === undefined ? false : value === true);
    if (!value) {
      isChecked = api.isRowSelected(item);
    }

    let ariaString = ' ';

    if (api.settings.columnIds.length > 0) {
      for (let i = 0; i < api.settings.columnIds.length; i++) {
        ariaString += item[api.settings.columnIds[i]];
      }
    }

    ariaString = xssUtils.ensureAlphaNumericWithSpaces(ariaString);
    return `<div class="datagrid-checkbox-wrapper"><span role="checkbox" aria-label="${(col.name ? col.name : Locale.translate('Select') + ariaString)}" class="datagrid-checkbox datagrid-selection-checkbox${(isChecked ? ' is-checked no-animate' : '')}" aria-checked="${isChecked}"></span></div>`;
  },

  Actions(row, cell, value, col) {
    // Render an Action Formatter
    return (
      `<button type="button" class="btn-actions" aria-haspopup="true" aria-expanded="false" aria-owns="${col.menuId}">
        <span class="audible">${col.title || Locale.translate('More')}</span>
        ${$.createIcon({ icon: 'more' })}
      </button>`
    );
  },

  // Multi Line TextArea
  Textarea(row, cell, value) {
    const formatted = ((value === null || value === undefined) ? '' : value);
    return `<span class="datagrid-multiline-text">${formatted}</span>`;
  },

  // Rich Text Editor
  Editor(row, cell, value, col) {
    const formatted = ((value === null || value === undefined) ? '' : value);
    let classes = 'is-editor';
    classes += col.singleline ? ' is-singleline' : ' datagrid-multiline-text';
    classes += col.contentTooltip ? ' content-tooltip' : '';
    return `<div class="${classes}">${xssUtils.unescapeHTML(formatted)}</div>`;
  },

  // Expand / Collapse Button
  Expander(row, cell, value) {
    const button = `<button type="button" aria-label="${Locale.translate('ExpandCollapse')}" class="btn-icon datagrid-expand-btn" tabindex="-1">
      <span class="icon plus-minus"></span>
      </button>${(value ? `<span> ${value}</span>` : '')}`;

    return button;
  },

  // Datagrid Group Row
  GroupRow(row, cell, value, col, item, api) {
    const groupSettings = api.settings.groupable;
    const rowHtml = { left: '', center: '', right: '' };
    let groups = '';
    let isOpen = groupSettings.expanded === undefined ? true : groupSettings.expanded;

    if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
      isOpen = groupSettings.expanded(row, cell, value, col, item, api);
    }

    for (let i = 0; i < groupSettings.fields.length; i++) {
      groups += item[groupSettings.fields[i]] + (i === 0 ? '' : ',');
    }

    if (groupSettings.groupRowFormatter) {
      groups = groupSettings.groupRowFormatter(row, cell, value, col, item, api);
    }

    const button = `<button type="button" class="btn-icon datagrid-expand-btn${(isOpen ? ' is-expanded' : '')}" tabindex="-1">
    <span class="icon plus-minus${(isOpen ? ' active' : '')}"></span>
    <span class="audible">${Locale.translate('ExpandCollapse')}</span>
    </button><span> ${groups}</span>`;

    // Take the first
    const container = api.getContainer(groupSettings.fields ? groupSettings.fields[0] : '');
    rowHtml[container] = button;
    return rowHtml;
  },

  GroupFooterRow(row, cell, value, col, item, api) {
    const groupSettings = api.settings.groupable;
    const rowHtml = { left: '', center: '', right: '' };
    const visibleColumnsLeft = api.settings.frozenColumns.left.length;
    const visibleColumnsRight = api.settings.frozenColumns.right.length;
    const idx = api.columnIdxById(groupSettings.aggregate);
    const container = api.getContainer(groupSettings.aggregate);
    rowHtml.left = `<td role="gridcell" colspan="${visibleColumnsLeft}"><div class="datagrid-cell-wrapper"></div></td><td role="gridcell"><div class="datagrid-cell-wrapper">${container === 'left' ? item.sum : '<span>&nbsp;</span>'}</div></td>`;
    rowHtml.center = `<td role="gridcell" colspan="${idx - visibleColumnsLeft - visibleColumnsRight}"><div class="datagrid-cell-wrapper"></div></td><td role="gridcell"><div class="datagrid-cell-wrapper">${container === 'center' ? item.sum : '<span>&nbsp;</span>'}</div></td>`;
    rowHtml.right = `<td role="gridcell" colspan="${visibleColumnsRight}"><div class="datagrid-cell-wrapper"></div></td><td role="gridcell"><div class="datagrid-cell-wrapper">${container === 'right' ? item.sum : '<span>&nbsp;</span>'}</div></td>`;

    if (groupSettings.groupFooterRowFormatter) {
      rowHtml[container] = groupSettings.groupFooterRowFormatter(
        idx,
        row,
        cell,
        value,
        col,
        item,
        api
      );
    }

    return rowHtml;
  },

  SummaryRow(row, cell, value, col) {
    let afterText = '';
    let beforeText = col.summaryText || '';

    if (col.summaryTextPlacement === 'after') {
      afterText = beforeText;
      beforeText = '';
    }

    if (typeof Locale !== 'undefined' && col.numberFormat &&
      value !== null && value !== undefined && value !== '') {
      value = Locale.formatNumber(+value, col.numberFormat);
    }

    return (beforeText + ((value === null || value === undefined || value === '') ? '' : value.toString()) + afterText);
  },

  // Tree Expand / Collapse Button and Paddings
  Tree(row, cell, value, col, item, api) {
    let isOpen = item ? item.expanded : true;
    const depth = api && api.settings.treeDepth && api.settings.treeDepth[row] ?
      api.settings.treeDepth[row].depth : 0;

    // When use filter then
    // If (settings.allowChildExpandOnMatch === false) and only parent node has a match
    // then make expand/collapse button collapsed and disabled
    const isExpandedBtnDisabled = item && item.isAllChildrenFiltered;
    const expandedBtnDisabledHtml = isExpandedBtnDisabled ? ' disabled' : '';
    if (isOpen && isExpandedBtnDisabled) {
      isOpen = false;
    }

    // Tabsize as button width (+/-)
    const tabsize = api.settings.rowHeight === 'short' ? 22 : 30;

    const button = `<button type="button" class="btn-icon datagrid-expand-btn${(isOpen ? ' is-expanded' : '')}" tabindex="-1"${(depth ? ` style="margin-left: ${(depth ? `${(tabsize * (depth - 1))}px` : '')}"` : '')}${expandedBtnDisabledHtml}>
      <span class="icon plus-minus ${(isOpen ? ' active' : '')}"></span>
      <span class="audible">${Locale.translate('ExpandCollapse')}</span>
      </button>${(value ? ` <span>${value}</span>` : '')}`;
    const node = ` <span class="datagrid-tree-node"${(depth ? ` style="margin-left: ${(depth ? `${(tabsize * (depth))}px` : '')}"` : '')}>${value}</span>`;

    return (item && item[col.children ? col.children : 'children'] ? button : node);
  },

  // Badge / Tags and Visual Indictors
  ClassRange(row, cell, value, col) {
    const ranges = col.ranges;
    let classes = '';
    let text = '';

    if (!ranges) {
      return {};
    }

    for (let i = 0; i < ranges.length; i++) {
      if (value >= ranges[i].min && value <= ranges[i].max) {
        classes = ranges[i].classes;
        text = (ranges[i].text ? ranges[i].text : classes.split(' ')[0]);
      }

      if (value === ranges[i].value) {
        classes = ranges[i].classes;
        text = (ranges[i].text ? ranges[i].text : value);
      }
    }

    return { classes, text };
  },

  // Badge (Visual Indictors)
  Badge(row, cell, value, col) {
    let colorClasses = col.color;
    let text = col.name;

    if (col.ranges) {
      const ranges = formatters.ClassRange(row, cell, value, col);
      colorClasses = ranges.classes;
      text = ranges.text;
    }
    return `<span class="badge ${colorClasses}">${value} <span class="audible">${text}</span></span>`;
  },

  Tag(row, cell, value, col) {
    const ranges = formatters.ClassRange(row, cell, value, col);
    if (col?.editorOptions?.clickable) {
      return `<span class="tag is-linkable hide-focus ${ranges.classes}"><a class="tag-content" href="#">#${value}</a><button class="btn-linkable" focusable="false" tabindex="-1">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-right"></use></svg>
      </button></span>`;
    }
    return `<span class="tag ${ranges.classes} hide-focus"><span class="tag-content">${value}</span></span>`;
  },

  Alert(row, cell, value, col) {
    const ranges = formatters.ClassRange(row, cell, value, col);
    const icon = $.createIcon({
      icon: `${ranges.classes}-alert`,
      classes: [
        'icon',
        'datagrid-alert-icon',
        `icon-${ranges.classes}`
      ]
    });
    return `${icon}<span class="datagrid-alert-text">${(ranges.text === 'value' ? value : ranges.text)}</span>`;
  },

  Image(row, cell, value, col) {
    return `<img class="datagrid-img" src="${value}" alt="${(col.alt ? col.alt : Locale.translate('Image'))}"${(col.dimensions ? ` style="height:${col.dimensions.height};width:${col.dimensions.height}"` : '')}/>`;
  },

  Color(row, cell, value, col) {
    const ranges = formatters.ClassRange(row, cell, value, col);
    const text = ((value === null || value === undefined || value === '') ? '' : value.toString());

    return `<span class="${ranges.classes}">${text}</span>`;
  },

  Colorpicker(row, cell, value, col) {
    let html = ((value === null || value === undefined || value === '') ? '' : value.toString());
    if (col.inlineEditor) {
      return html;
    }
    const classList = `swatch${value === '' ? ' is-empty' : ''}`;
    html = `<span class="colorpicker-container trigger dropdown-trigger"><span class="${classList}" style="background-color: ${value}"></span><input class="colorpicker" id="colorpicker-${cell}" name="colorpicker-${cell}" type="text" role="combobox" aria-autocomplete="list" value="${value}" aria-describedby="">`;
    html += `<span class="trigger">${$.createIcon({ icon: 'dropdown' })}</span></span>`;

    return html;
  },

  Button(row, cell, value, col, item, api) {
    let text;
    const disableAttr = isColumnDisabled(row, cell, value, col, item) ? ' disabled' : '';
    if (col.text) {
      text = col.text;
    } else {
      text = (value === null || value === undefined || value === '') ? '' : value.toString();
    }
    let markup = `<button type="button"${disableAttr} class="${(col.icon ? 'btn-icon' : 'btn-secondary')} row-btn ${(col.cssClass ? col.cssClass : '')}"${(!api.settings.rowNavigation ? '' : ' tabindex="-1"')} >`;

    if (col.icon) {
      markup += $.createIcon({ icon: col.icon, file: col.iconFile });
    }
    markup += `<span>${text}</span></button>`;

    return markup;
  },

  Dropdown(row, cell, value, col, item) {
    let formattedValue = value;
    let compareValue;
    let option;
    let optionValue;
    let isPlaceholder = false;

    if (col.options && value !== undefined) {
      compareValue = col.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

      for (let i = 0, l = col.options.length; i < l; i++) {
        option = col.options[i];
        optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;

        if (optionValue === compareValue) {
          formattedValue = option.label;
          break;
        }
      }
    }

    const placeholder = calculatePlaceholder(formattedValue, row, cell, value, col, item);
    if (placeholder !== '') {
      isPlaceholder = true;
      formattedValue = placeholder;
    }

    let html = `<span class="trigger dropdown-trigger ${isPlaceholder ? 'is-placeholder' : ''}">${formattedValue}</span>${$.createIcon({ icon: 'dropdown' })}`;

    if (col.inlineEditor) {
      html = `<label for="full-dropdown" class="audible">${col.name}</label><select id="datagrid-dropdown${row}" class="dropdown">`;

      for (let i = 0, l = col.options.length; i < l; i++) {
        const opt = col.options[i];
        let labelOrValue;
        if (opt.label !== undefined) {
          labelOrValue = opt.label;
        } else {
          labelOrValue = opt.value !== undefined ? opt.value : '';
        }
        html += `<option${(opt.id === undefined ? '' : ` id="${opt.id}"`)}  value="${opt.value}"${(opt.selected || opt.value === compareValue ? ' selected ' : '')}>${labelOrValue}</option>`;
      }

      html += `</select>
      <div class="dropdown-wrapper is-inline">
        <div class="dropdown"><span>${formattedValue}</span></div>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-dropdown"></use>
        </svg>
      </div>`;
    }

    return html;
  },

  Fileupload(row, cell, value, col) {
    let html = ((value === null || value === undefined || value === '') ? '' : value.toString());

    if (!col.inlineEditor) {
      if ($.trim(html) === '') {
        html = `<span class="trigger">${html}</span>${$.createIcon({ icon: 'folder', classes: ['icon-fileupload'] })}`;
      } else {
        html = `<span class="trigger is-clearable">${html}</span>${$.createIcon({ icon: 'close', classes: ['icon-close'] })}${$.createIcon({ icon: 'folder', classes: ['icon-fileupload'] })}`;
      }
    }

    return html;
  },

  Spinbox(row, cell, value, col) {
    let html = ((value === null || value === undefined || value === '') ? '' : value.toString());

    if (col.inlineEditor) {
      html = `<label for="spinbox-${cell}" class="audible">Quantity</label>
        <span class="spinbox-wrapper"><span class="spinbox-control down">-</span>
        <input id="spinbox-${cell}" name="spinbox-${cell}" type="text" class="spinbox" value="${value}">
        <span class="spinbox-control up">+</span></span>`;
    }

    return html;
  },

  Favorite(row, cell, value, col, item, api) {
    let isChecked;

    // Use isChecked function if exists
    if (col.isChecked) {
      isChecked = col.isChecked(value);
    } else {
      isChecked = (value === undefined ? false : value === true);
    }

    const isEditable = col.editor && api.settings.editable;

    if (isChecked) {
      return `<span aria-label="${Locale.translate('Favorite')}" class="icon-favorite${(isEditable ? ' is-editable' : '')}">${$.createIcon({ icon: 'star-filled' })}</span>`;
    }
    return col.showEmpty ? `<span aria-label="${Locale.translate('Favorite')}" class="icon-favorite${(isEditable ? ' is-editable' : '')}">${$.createIcon({ icon: 'star-outlined' })}</span>` : '';
  },

  Status(row, cell, value, col, item) {
    if (!item || !item.rowStatus) {
      return '<span></span>';
    }

    return `${$.createIcon({ icon: item.rowStatus.icon, classes: ['icon', `icon-${item.rowStatus.icon}`] })}<span class="audible">${item.rowStatus.text}</span>`;
  },

  TargetedAchievement(row, cell, value, col) {
    const perc = (100 * value);
    let text = `${perc}%`;
    const ranges = formatters.ClassRange(row, cell, perc, col);
    const target = col.target;

    if (col.text) {
      text = col.text;
      text = text.replace('{{value}}', value);
      text = text.replace('<% value %>', value);
      text = text.replace('<%value%>', value);

      text = text.replace('{{percent}}', perc);
      text = text.replace('<% percent %>', perc);
      text = text.replace('<%percent%>', perc);

      col.showPercentText = true;
    }

    const barClass = (col.ranges && ranges.classes ? ranges.classes : 'primary');
    return `<div class="total bar chart-completion-target chart-targeted-achievement">
              <div class="target remaining bar" style="width: ${(target || 0)}%;"></div>
              <div class="completed bar ${barClass}" style="width: ${perc}%;"></div>
              ${(col.showPercentText ? `<div class="chart-targeted-text l-center">${text}</div>
            </div>` : `<div class="audible">${perc}%</div>`)}`;
  }

  // TODO Possible future Formatters
  // Multi Select
  // Sparkline
  // Progress Indicator (n of 100%)
  // Process Indicator
  // File Upload (Simple)
  // Menu Button
  // Radio
};

export { formatters as Formatters };
