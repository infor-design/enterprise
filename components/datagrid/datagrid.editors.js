/* eslint-disable */
import { utils } from '../utils/utils';

/**
*  A object containing all the supported Editors
* @private
*/
const editors = {

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
        column.maskOptions = utils.extend(true, {}, defaults, column.maskOptions);
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
      utils.fixSVGIcons($('#editor-popup'));
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

      this.input.dropdown(editorOptions);

      // Append the Dropdown's sourceArguments with some row/col meta-data
      var api = this.input.data('dropdown');
      api.settings.sourceArguments = {
        column: column,
        container: container,
        grid: grid,
        cell: cell,
        event: event,
        row: row,
        rowData: rowData,
        value: value
      };

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

export { editors as Editors };
