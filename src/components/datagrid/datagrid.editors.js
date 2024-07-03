import { DOM } from '../../utils/dom';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { Formatters } from './datagrid.formatters';
import { xssUtils } from '../../utils/xss';

// jQuery Components
import '../autocomplete/autocomplete.jquery';
import '../colorpicker/colorpicker.jquery';
import '../datepicker/datepicker.jquery';
import '../dropdown/dropdown.jquery';
import '../editor/editor.jquery';
import '../fileupload/fileupload.jquery';
import '../icons/icons.jquery';
import '../lookup/lookup.jquery'; //eslint-disable-line
import '../mask/mask-input.jquery';
import '../popover/popover.jquery';
import '../spinbox/spinbox.jquery';
import '../textarea/textarea.jquery';
import '../timepicker/timepicker.jquery';
import '../tooltip/tooltip.jquery';

// Adds all the basic input features to any Datagrid Editor.
function addStandardInputFeatures(input, row, cell, value, container, column, e, api, item) {
  if (column.align) {
    input.addClass(`l-${column.align}-text`);
  }

  if (column.maxLength) {
    input.attr('maxlength', column.maxLength);
  }

  if (column.uppercase) {
    input.addClass('uppercase-text');
  }

  if (column.mask && typeof column.mask === 'function') {
    const mask = column.mask(row, cell, value, column, item);
    input.mask({ pattern: mask, mode: column.maskMode });
  } else if (column.maskOptions && typeof column.maskOptions === 'function') {
    const maskOptions = column.maskOptions(row, cell, value, column, item);
    input.mask(maskOptions);
  } else if (column.mask) {
    input.mask({ pattern: column.mask, mode: column.maskMode });
  }

  let defaults = {
    patternOptions: {
      allowNegative: true,
      allowDecimal: true,
      integerLimit: 4,
      decimalLimit: 2,
      symbols: {
        thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
        decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal : '.',
        negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign : '-'
      }
    },
    process: 'number'
  };

  let useMask = false;

  if (column.maskOptions) {
    useMask = true;
  }

  if (column.numberFormat) {
    useMask = true;
    defaults = { patternOptions: { decimalLimit: column.numberFormat.maximumFractionDigits } };
  }

  if (column.maskOptions && typeof column.maskOptions === 'function') {
    useMask = false;
  }

  if (useMask) {
    column.maskOptions = utils.extend(true, {}, defaults, column.maskOptions);
    input.mask(column.maskOptions);
  }

  if (!column.align || column.align !== 'right') {
    input.removeClass('is-number-mask');
  }
}

/**
*  A object containing all the supported Editors.
* @private
*/
const editors = {

  // Supports, Text, Numeric, Integer via mask
  Input(row, cell, value, container, column, e, api, item) {
    this.name = 'input';
    this.originalValue = value;
    this.useValue = !!column.inlineEditor;

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('input');
      } else {
        this.input = $(`<input type="${(column.inputType || 'text')}" autocomplete="off"/>`)
          .appendTo(container);
      }

      addStandardInputFeatures(this.input, row, cell, value, container, column, e, api, item);
    };

    this.val = function (v) {
      let thisValue;
      if (v) {
        this.input.val(v);
      }
      if (column && column.numberFormat && column.numberFormat.style === 'percent') {
        thisValue = this.input.val().trim().replace(/(\s%?|%)$/g, '');
        return Locale.parseNumber(thisValue) / 100;
      }

      if (column.numberFormat) {
        return Locale.parseNumber(this.input.val(), column.numberFormat);
      }
      return this.input.val();
    };

    if (!column.inlineEditor) {
      this.focus = function () {
        this.input.focus();
        if (api.settings.selectOnEdit) {
          this.input.select();
        }
      };
    }

    this.destroy = function () {
      if (column.inlineEditor) {
        return;
      }

      setTimeout((arg) => {
        arg.input.remove();
      }, 0, this);
    };

    this.init();
  },

  Textarea(row, cell, value, container, column, e, api) {
    this.name = 'textarea';
    this.originalValue = value;

    this.init = function () {
      container.addClass('datagrid-textarea-cell-wrapper');
      const autogrowStartHeight = container.get(0).scrollHeight;
      const style = column.editorOptions && column.editorOptions.minHeight ?
        `style="min-height: ${column.editorOptions.minHeight}px"` : '';
      this.input = $(`<textarea ${style} class="textarea">${this.originalValue}</textarea>`).appendTo(container);
      const editorOptions = column.editorOptions ? column.editorOptions : {};
      // disable the characterCounter by default
      if (!('characterCounter' in editorOptions)) {
        editorOptions.characterCounter = false;
      }
      this.api = this.input.data('autogrow-start-height', autogrowStartHeight).textarea(column.editorOptions).data('textarea');

      this.input.on('click.textareaeditor', (evt) => {
        evt.stopPropagation();
      });

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
      }
    };

    this.val = function (v) {
      if (v) {
        // note that focus will help move text to end of input.
        this.input.focus().val(v);
      }
      return this.input.val();
    };

    this.focus = function () {
      this.input.focus();
      if (api.settings.selectOnEdit) {
        this.input.select();
      }
    };

    this.destroy = function () {
      container.removeClass('datagrid-textarea-cell-wrapper');
      setTimeout((arg) => {
        arg.input.off('click.textareaeditor');
        arg.input.remove();
      }, 0, this);
    };

    this.init();
  },

  // Rich Text Editor
  Editor(row, cell, value, container, column, e, api) {
    this.name = 'editor';
    this.originalValue = value;

    this.init = function () {
      const self = this;
      // Editor options
      const editorOptions = $.extend({}, {
        buttons: { editor: ['header1', 'header2', 'separator', 'bold', 'italic', 'underline', 'separator', 'foreColor', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight'], source: [] },
        excludeButtons: { editor: [] }
      }, column.editorOptions);

      // Editor width
      this.editorWidth = api.setUnit(editorOptions.width || container.outerWidth());
      delete editorOptions.width;

      container[0].innerHTML =
        `<div class="editor-wrapper" style="width: ${this.editorWidth};">
          <div class="editor" data-init="false">${xssUtils.sanitizeHTML(xssUtils.unescapeHTML(value))}</div>
        </div>`;
      this.td = container.closest('td');
      this.input = $('.editor', container);

      this.input
        .popover({
          content: $('.editor-wrapper', container),
          placementOpts: {
            x: 0,
            y: `-${(parseInt(container[0].style.height, 10) + 35)}`,
            parent: this.td,
            parentXAlignment: Locale.isRTL() ? 'right' : 'left',
            strategies: ['flip', 'nudge', 'shrink'],
          },
          placement: 'bottom',
          popover: true,
          trigger: 'immediate',
          tooltipElement: '#editor-popup',
          extraClass: 'editor-popup',
          onHidden: () => {
            api.commitCellEdit(self.input);
          }
        })
        .editor(editorOptions)
        .on('keydown.editor', (event) => {
          const key = event.which || event.keyCode || event.charCode || 0;
          // Ctrl + Enter (Some browser return keyCode: 10, not 13)
          if ((event.ctrlKey || event.metaKey) && (key === 13 || key === 10)) {
            const apiPopover = self.input.data('tooltip');
            if (apiPopover) {
              apiPopover.hide();
              api.setNextActiveCell(event);
            }
          }
        });

      utils.fixSVGIcons($('#editor-popup'));
    };

    this.val = function () {
      return xssUtils.escapeHTML(this.input.html());
    };

    this.focus = function () {
      setTimeout((arg) => {
        arg.input.focus();
      }, 0, this);
    };

    this.destroy = function () {
      const self = this;
      container.removeAttr('style');
      api.quickEditMode = false;
      if (self.input.data('editor')) {
        self.input.destroy();
        self.input.remove();
      }
    };

    this.init();
  },

  Checkbox(row, cell, value, container, column, event, grid) {
    this.name = 'checkbox';
    this.originalValue = value;
    this.useValue = true; // use the data set value not cell value
    this.container = container;

    this.init = function () {
      this.input = $('<input type="checkbox" class="checkbox"/>').appendTo(container);
      this.input.after('<label class="checkbox-label"></label>');

      if (column.align) {
        this.input.addClass(`l-${column.align}-text`);
      }
    };

    this.val = function (v) {// eslint-disable-line
      let isChecked;

      if (v === undefined) {
        return this.input.prop('checked');
      }

      // Use isChecked function if exists
      if (column.isChecked) {
        isChecked = column.isChecked(v);
      } else {
        isChecked = v;
      }

      // just toggle it if we click right on it
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
      setTimeout((arg) => {
        arg.input.next('.checkbox-label').remove();
        arg.input.remove();
      }, 0, this);
    };

    this.init();
  },

  Colorpicker(row, cell, value, container, column, event, grid) {
    this.name = 'colorpicker';
    this.originalValue = value;
    this.useValue = true; // use the data set value not cell value
    value = xssUtils.stripTags(value);

    this.init = function () {
      this.input = $(`<input id="colorpicker-${cell}" name="colorpicker-${cell}" class="colorpicker" value="${value}" type="text" autocomplete="off"/>`).appendTo(container);
      this.input.colorpicker(column.editorOptions);
    };

    this.val = function (v) {
      return v ? this.input.val(v) : this.input.val();
    };

    this.focus = function () {
      const self = this;

      this.input.trigger('openlist');
      const rowNodes = grid.rowNodes(row);
      rowNodes.removeClass('is-hover-row');
      this.input.focus();
      if (grid.settings.selectOnEdit) {
        this.input.select();
      }

      this.input.off('listclosed').on('listclosed', () => {
        grid.commitCellEdit(self.input);

        container.parent('td').focus();
        return;// eslint-disable-line
      });
    };

    this.destroy = function () {
      // We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  MultiSelect(row, cell, value, container, column, event, grid, rowData) {
    this.name = 'multiselect';
    this.originalValue = value;
    this.useValue = true; // use the data set value not cell value
    this.cell = grid.activeCell;

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('select');
        return;
      }

      this.input = $('<select class="multiselect"></select>').appendTo(container);

      if (column.options) {
        let html;
        let opt;
        let optionValue;
        value = grid.fieldValue(rowData, column.field);

        const compareValue = column.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

        for (let i = 0; i < column.options.length; i++) {
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

      const editorOptions = column.editorOptions || {};

      function hasEditingClass() {
        return editorOptions.cssClass && /is-editing/g.test(editorOptions.cssClass);
      }
      // Add the class to both the options being passed, as well as the column's original options
      if (!hasEditingClass()) {
        editorOptions.cssClass = editorOptions.cssClass || '';
        editorOptions.cssClass += ' is-editing';
      }

      this.input.multiselect(editorOptions);

      // Append the Multiselect's sourceArguments with some row/col meta-data
      const api = this.input.data('multiselect');
      api.settings.sourceArguments = {
        column,
        container,
        grid,
        cell,
        event,
        row,
        rowData,
        value
      };
    };

    this.val = function (v) {
      this.datasetValue = v;

      if (v !== undefined) {
        const compareValue = column.caseInsensitive && typeof v === 'string' ? v.toLowerCase() : v;
        this.input.val(v);

        this.input.find('option').each(function () {
          const opt = $(this);
          const valueAttr = opt.attr('value');
          const type = opt.attr('data-type');
          let optionValue = valueAttr;

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

      const selected = this.input.find(':selected');
      let val = selected.attr('value');
      const dataType = selected.attr('data-type');

      // passing all selected items
      if (selected.length > 1) {
        val = [];

        selected.map((i, el) => val.push(el.value));
      }

      // For non-string option values (number, boolean, etc.),
      // convert string attr value to proper type
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
      // debugger;
      const self = this;

      // Check if isClick or cell touch and just open the list
      if (event.type === 'click') {
        this.input.trigger('openlist');
        const rowNodes = grid.rowNodes(row);
        rowNodes.removeClass('is-hover-row');
        $('#dropdown-list input').focus();
      } else {
        this.input[0].parentNode.querySelector('div.dropdown').focus();
      }

      // Unselect dropdown search, and move cursor at end
      if (!grid.settings.selectOnEdit) {
        const ddSearch = $('#dropdown-search')[0];
        if (ddSearch) {
          if (typeof ddSearch.selectionStart === 'number') {
            ddSearch.selectionEnd = ddSearch.value.length;
            ddSearch.selectionStart = ddSearch.selectionEnd;
          } else if (typeof ddSearch.createTextRange !== 'undefined') {
            const range = ddSearch.createTextRange();
            range.collapse(false);
            range.select();
          }
        }
      }

      this.input.off('listclosed').on('listclosed', (e, type) => {
        grid.commitCellEdit(self.input);

        if (type === 'select') {
          container.parent('td').focus();
          return;
        }

        if (type === 'tab') {
          setTimeout((arg) => {
            arg.parent('td').focus();
          }, 100, container);
        }
      });
    };

    this.destroy = function () {
      // We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  Dropdown(row, cell, value, container, column, event, grid, rowData) {
    this.name = 'dropdown';
    this.originalValue = value;
    this.useValue = true; // use the data set value not cell value
    this.cell = grid.activeCell;

    this.init = function () {
      if (column.inlineEditor) {
        this.input = container.find('select');
        return;
      }

      this.input = $('<select class="dropdown"></select>').appendTo(container);

      if (column.options) {
        let html;
        let opt;
        let optionValue;
        value = grid.fieldValue(rowData, column.field);

        const compareValue = column.caseInsensitive && typeof value === 'string' ? value.toLowerCase() : value;

        for (let i = 0; i < column.options.length; i++) {
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

      const editorOptions = column.editorOptions || {};

      function hasEditingClass() {
        return editorOptions.cssClass && /is-editing/g.test(editorOptions.cssClass);
      }
      // Add the class to both the options being passed, as well as the column's original options
      if (!hasEditingClass()) {
        editorOptions.cssClass = editorOptions.cssClass || '';
        editorOptions.cssClass += ' is-editing';
      }

      this.input.dropdown(editorOptions);
      this.input.on('requestend', () => {
        this.val(this.datasetValue);
      });

      // Append the Dropdown's sourceArguments with some row/col meta-data
      const api = this.input.data('dropdown');
      api.settings.sourceArguments = {
        column,
        container,
        grid,
        cell,
        event,
        row,
        rowData,
        value
      };
    };

    this.val = function (v) {
      this.datasetValue = v;

      if (v !== undefined) {
        const compareValue = column.caseInsensitive && typeof v === 'string' ? v.toLowerCase() : v;
        this.input.val(v);

        this.input.find('option').each(function () {
          const opt = $(this);
          const valueAttr = opt.attr('value');
          const type = opt.attr('data-type');
          let optionValue = valueAttr;

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

      const selected = this.input.find(':selected');
      let val = selected.attr('value');
      const dataType = selected.attr('data-type');

      // For non-string option values (number, boolean, etc.),
      // convert string attr value to proper type
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
      const self = this;

      // Check if isClick or cell touch and just open the list
      if (event.type === 'click') {
        this.input.trigger('openlist');
        const rowNodes = grid.rowNodes(row);
        rowNodes.removeClass('is-hover-row');
        $('#dropdown-list input').focus();
      } else {
        this.input[0].parentNode.querySelector('div.dropdown').focus();
      }

      // Unselect dropdown search, and move cursor at end
      if (!grid.settings.selectOnEdit) {
        const ddSearch = $('#dropdown-search')[0];
        if (ddSearch) {
          if (typeof ddSearch.selectionStart === 'number') {
            ddSearch.selectionEnd = ddSearch.value.length;
            ddSearch.selectionStart = ddSearch.selectionEnd;
          } else if (typeof ddSearch.createTextRange !== 'undefined') {
            const range = ddSearch.createTextRange();
            range.collapse(false);
            range.select();
          }
        }
      }

      this.input.off('listclosed').on('listclosed', (e, type) => {
        grid.commitCellEdit(self.input);

        if (type === 'select') {
          container.parent('td').focus();
          return;
        }

        if (type === 'tab') {
          setTimeout((arg) => {
            arg.parent('td').focus();
          }, 100, container);
        }
      });
    };

    this.destroy = function () {
      // We dont need to destroy since it will when the list is closed
    };

    this.init();
  },

  Date(row, cell, value, container, column, event, grid) {
    this.name = 'date';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="datepicker" autocomplete="off"/>').appendTo(container);
      if (!column.editorOptions) {
        column.editorOptions = {};
      }
      if (!column.editorOptions.dateFormat) {
        column.editorOptions.dateFormat = column.dateFormat;
      }
      if (typeof column.editorOptions.tabbable !== 'boolean') {
        column.editorOptions.tabbable = false;
      }
      this.input.datepicker(column.editorOptions);
    };

    this.val = function (v) {
      if (v === '0000' || v === '000000' || v === '00000000') {
        // Means no date in some applications
        v = '';
      }
      if (v) {
        // Note that the value should be formatted from the formatter.
        this.input.val(v);
      }
      return Formatters.Date(row, cell, this.input.val(), column, true);
    };

    this.focus = function () {
      this.input.focus();
      if (grid.settings.selectOnEdit) {
        this.input.select();
      }

      // Check if isClick or cell touch and just open the list
      if (event.type === 'click' && $(event.target).is('.icon')) {
        this.input.parent().find('.icon').trigger('click');
      }

      this.input.on('listclosed', () => {
        setTimeout((param) => {
          const self1 = param[0];
          const container1 = param[1];
          const grid1 = param[2];
          self1.input.trigger('focusout');
          container1.parent().focus();
          grid1.setNextActiveCell(event);
        }, 1, [this, container, grid]);
      });
    };

    this.destroy = function () {
      setTimeout((param) => {
        const self1 = param[0];
        const grid1 = param[1];
        grid1.quickEditMode = false;
        self1.input.remove();
      }, 0, [this, grid]);
    };

    this.init();
  },

  Fileupload(row, cell, value, container, column, event, grid) {
    const s = utils.mergeSettings(undefined, column.editorOptions, {
      allowedTypes: '*' // restrict file types(ie. 'jpg|png|gif') ['*' all types]
    });
    const fileExtensions = s.allowedTypes.split(/[\s|]+/g);
    let id = utils.uniqueId(this, `fileupload-${row}-${cell}-`);

    let multiple = s.useMultiple ? ' multiple' : '';
    let disabled = s.isDisabled ? ' disabled' : '';
    let types = '';

    if (fileExtensions.length === 1) {
      if (fileExtensions[0] !== '*') {
        types = `.${xssUtils.ensureAlphaNumeric(fileExtensions[0])}`;
      }
    } else {
      for (let i = 0, l = fileExtensions.length; i < l; i++) {
        types += `.${(xssUtils.ensureAlphaNumeric(fileExtensions[i]) + (i !== (l - 1) ? ',' : ''))}`;
      }
    }
    if (types !== '') {
      types = ` accept="${types}"`;
    }

    this.name = 'fileupload';
    this.originalValue = value;
    this.status = 'init';
    this.useValue = true; // use the data set value not cell value

    this.init = function () {
      id = xssUtils.ensureAlphaNumeric(id);
      multiple = xssUtils.ensureAlphaNumeric(multiple);
      disabled = xssUtils.ensureAlphaNumeric(disabled);

      this.input = $(`<input id="${id}" name="${id}" class="fileupload" type="file" ${types}${multiple}${disabled} autocomplete="off"/>`);
      container.append(`<label>${this.input[0].outerHTML}</label>`);
      this.api = this.input.fileupload(column.editorOptions).data('fileupload');
      this.input.closest('td').addClass('is-fileupload').find('label:eq(1)').addClass('audible');
    };

    this.val = function (v) {
      // eslint-disable-next-line compat/compat
      return new Promise((resolve) => {
        setTimeout((param) => {
          const self1 = param[0];
          let output;
          if (v) {
            v = xssUtils.stripTags(v);
            self1.input.attr('value', v);
            output = v;
          } else {
            output = self1.input.val();
          }
          resolve(output);
        }, 300, [this]);
      });
    };

    this.focus = () => {
      /**
       * Handle cancel on file-input
       * Bind body to listen one time only, right after file chooser window popup open
       * Listen on body `focusin`(on close popup window),
       * if no `change` event triggered means it canceled
       * @private
       * @returns {void}
       */
      const handleCancel = () => {
        $('body').one('focusin.fileuploadeditor', () => {
          setTimeout((param) => {
            const self1 = param[0];
            const grid1 = param[1];
            if (self1.status !== 'change') {
              self1.status = 'cancel';
              grid1.commitCellEdit(self1.input);
            }
          }, 100, [this, grid]);
        });
      };

      /**
       * Handle clear the value on file-input
       * @private
       * @returns {void}
       */
      const handleClear = () => {
        if (this.originalValue !== '') {
          this.status = 'clear';
        }
        grid.commitCellEdit(this.input);
      };

      /**
       * Open file chooser popup window for file-input
       * @private
       * @returns {void}
       */
      const openFileChooserWindow = () => {
        if (this.api) {
          handleCancel();
          this.api.fileInput.trigger('click');
        }
      };

      // Handle change for file-input
      this.input.on('change.fileuploadeditor', () => {
        this.status = 'change';
        grid.commitCellEdit(this.input);
      });

      // Using keyboard
      if (event.type === 'keydown') {
        const key = event.which || event.keyCode || event.charCode || 0;

        if (key === 8 || key === 46) {
          // Backspace: 8, Delete: 46
          handleClear();
        } else if (key === 13 || key === 10) {
          // Enter (Some browser return keyCode: 10, not 13)
          openFileChooserWindow();
        } else {
          grid.commitCellEdit(this.input);
        }
      }

      // Check if isClick or cell touch
      if (event.type === 'click') {
        const target = $(event.target);
        if (target.is('.icon-close')) {
          handleClear();
        } else if (target.is('.icon-fileupload')) {
          openFileChooserWindow();
        } else {
          grid.commitCellEdit(this.input);
        }
      }
    };

    this.destroy = () => {
      this.input.off('change.fileuploadeditor');
      grid.quickEditMode = false;
      if (this.api) {
        this.api.destroy();
      }
    };

    this.init();
  },

  Time(row, cell, value, container, column, event, grid) {
    this.name = 'time';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="timepicker" autocomplete="off" />').appendTo(container);
      if (!column.editorOptions) {
        column.editorOptions = {};
      }
      if (typeof column.editorOptions.tabbable !== 'boolean') {
        column.editorOptions.tabbable = false;
      }
      this.api = this.input.timepicker(column.editorOptions).data('timepicker');
    };

    this.val = function (v) {
      if (v) {
        // Note that the value should be formatted from the formatter.
        this.input.val(v);
      }

      return this.input.val();
    };

    this.focus = function () {
      this.input.focus();
      if (grid.settings.selectOnEdit) {
        this.input.select();
      }

      // Check if isClick or cell touch and just open the list
      if (event.type === 'click' && $(event.target).is('.icon')) {
        this.input.parent().find('.icon').trigger('click');
      }

      this.api.trigger.on('hide.editortime', () => {
        setTimeout((param) => {
          const self1 = param[0];
          const grid1 = param[1];
          const container1 = param[2];
          self1.input.trigger('focusout');
          container1.parent().focus();
          grid1.setNextActiveCell(event);
        }, 1, [this, grid, container]);
      });
    };

    this.destroy = function () {
      const self = this;
      if (self.api && self.api.trigger) {
        self.api.trigger.off('hide.editortime');
      }

      setTimeout((param) => {
        const self1 = param[0];
        const grid1 = param[1];
        grid1.quickEditMode = false;
        self1.input.remove();
      }, 0, [this, grid]);
    };

    this.init();
  },

  Lookup(row, cell, value, container, column, event, grid, rowData) {
    this.name = 'lookup';
    this.originalValue = value;

    this.init = function () {
      this.input = $(`<input class="lookup ${column.align === 'right' ? 'align-text-right' : ''}" data-init="false" autocomplete="off" />`).appendTo(container);

      addStandardInputFeatures(
        this.input,
        row,
        cell,
        value,
        container,
        column,
        event,
        grid,
        rowData
      );

      if (!column.editorOptions) {
        column.editorOptions = {};
      }
      if (!column.editorOptions.options) {
        column.editorOptions.options = {};
      }
      if (!column.editorOptions.options.toolbar) {
        column.editorOptions.options.toolbar = {};
      }
      if (!column.editorOptions.options.toolbar.title) {
        column.editorOptions.options.toolbar.title = column.name;
      }
      if (column.editorOptions.tabbable === undefined) {
        column.editorOptions.tabbable = false;
      }
      this.input.lookup(column.editorOptions);
      container.find('span.trigger').attr('tabindex', '-1');

      // Append the Lookup's clickArguments with some row/col meta-data
      const api = this.input.data('lookup');
      api.settings.clickArguments = {
        column,
        container,
        grid,
        cell,
        event,
        row,
        rowData,
        value
      };
    };

    this.val = function (v) {
      return v ? this.input.val(v) : this.input.val();
    };

    this.focus = function () {
      const self = this;
      const api = self.input.data('lookup');
      const td = self.input.closest('td');

      // Using keyboard
      if (event.type === 'keydown') {
        self.input.focus();
        if (grid.settings.selectOnEdit) {
          self.input.select();
        }
        td.on('keydown.editorlookup', (e) => {
          if (e.keyCode === 40) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      }

      // Check if isClick or cell touch and just open the list
      if (event.type === 'click') {
        if ($(event.target).is('svg')) {
          api.openDialog(event);
        } else {
          self.input.focus();
          if (grid.settings.selectOnEdit) {
            self.input.select();
          }
          td.on('touchcancel.editorlookup touchend.editorlookup', '.trigger', () => {
            api.openDialog();
          });
        }
      }

      // Update on change from lookup
      self.input.on('change.editorlookup', () => {
        grid.quickEditMode = false;
      });
    };

    this.destroy = function () {
      const td = this.input.closest('td');
      setTimeout((param) => {
        const self1 = param[0];
        const grid1 = param[1];
        const td1 = param[2];
        grid1.quickEditMode = false;
        td1.off('keydown.editorlookup')
          .find('.trigger').off('touchcancel.editorlookup touchend.editorlookup');
        self1.input.remove();
      }, 0, [this, grid, td]);
    };

    this.init();
  },

  Autocomplete(ow, cell, value, container, column, event, grid) {
    this.name = 'autocomplete';
    this.originalValue = value;

    this.init = function () {
      this.input = $('<input class="autocomplete datagrid-autocomplete" autocomplete="off" />').appendTo(container);

      if (!column.editorOptions) {
        column.editorOptions = {};
      }
      column.editorOptions.width = container.parent().width();
      column.editorOptions.offset = { left: -1, top: (grid.settings.rowHeight === 'medium' ? 1 : 5) };

      if (column.maxLength) {
        this.input.attr('maxlength', column.maxLength);
      }

      if (column.uppercase) {
        this.input.addClass('uppercase-text');
      }

      this.input.autocomplete(column.editorOptions);
    };

    this.val = function (v) {
      return v ? this.input.val(v) : this.input.val();
    };

    this.focus = function () {
      grid.quickEditMode = true;
      this.input.focus();
      if (grid.settings.selectOnEdit) {
        this.input.select();
      }
    };

    this.destroy = function () {
      setTimeout((param) => {
        const self1 = param[0];
        const grid1 = param[1];
        grid1.quickEditMode = false;
        self1.input.remove();
      }, 0, [this, grid]);
    };

    this.init();
  },

  Spinbox(ow, cell, value, container, column, event, grid) {
    const self = this;
    this.name = 'spinbox';
    this.originalValue = value;
    this.useValue = true; // use the data set value not cell value

    this.init = function () {
      if (column.inlineEditor) {
        self.input = container.find('input');
        return;
      }

      const markup = `<label for="spinbox-${cell}" class="audible">Quantity</label>
        <span class="spinbox-wrapper"><span class="spinbox-control down">-</span>
        <input id="spinbox-${cell}" name="spinbox-${cell}" type="text" class="spinbox" value="'+ ${value} +'" autocomplete="off" />
        <span class="spinbox-control up">+</span></span>`;

      DOM.append(container, markup, '<label><span><input>');
      self.input = container.find('input');

      if (!column.editorOptions) {
        column.editorOptions = {};
      }

      self.input.spinbox(column.editorOptions);
    };

    this.val = function (v) {
      if (v) {
        self.input.val(v);
      }
      return parseInt(self.input.val(), 10);
    };

    this.focus = function () {
      grid.quickEditMode = true;
      self.input.focus();
      if (grid.settings.selectOnEdit) {
        self.input.select();
      }
    };

    this.destroy = function () {
      if (column.inlineEditor) {
        return;
      }

      setTimeout((param) => {
        const self1 = param[0];
        const container1 = param[1];
        grid.quickEditMode = false;
        const textVal = self1.val();
        if (self1.input && self1.input.data('spinbox')) {
          self1.input.data('spinbox').destroy();
        }
        if (self1.input) {
          self1.input.remove();
          container1.text(textVal);
        }
      }, 0, [this, container]);
    };

    this.init();
  },

  Favorite(row, cell, value, container, column, event, grid) {
    this.name = 'favorite';
    this.useValue = true;
    this.originalValue = value;

    this.init = function () {
      this.input = $(`<span class="icon-favorite">${$.createIcon({ icon: value ? 'star-filled' : 'star-outlined' })}<input type="checkbox"></span>`).appendTo(container);

      this.input = this.input.find('input');
    };

    this.val = function (v) {// eslint-disable-line
      let isChecked;

      if (v === undefined) {
        return this.input.prop('checked');
      }

      // Use isChecked function if exists
      if (column.isChecked) {
        isChecked = column.isChecked(v);
      } else {
        isChecked = v;
      }

      // just toggle it when clicked
      if ((event.type === 'click' || (event.type === 'keydown' && event.keyCode === 32)) && (!$(event.target).is('.datagrid-cell-wrapper'))) {
        isChecked = !isChecked;
        grid.setNextActiveCell(event);
      }

      this.input.prop('checked', isChecked);
      this.input.find('use').attr('href', isChecked ? '#icon-star-filled' : '#icon-star-outlined');
    };

    this.focus = function () {
      this.input.trigger('focusout').focus();
    };

    this.destroy = function () {
      setTimeout((param) => {
        const self1 = param[0];
        self1.input.parent().remove();
      }, 0, [this]);
    };

    this.init();
  }
};

export { editors as Editors };
