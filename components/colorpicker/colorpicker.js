/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';
import { personalization } from '../personalize/personalize.bootstrap';

// Default Settings
const COMPONENT_NAME = 'colorpicker';

const COLORPICKER_DEFAULTS = {

  // Theme key: MUST match with theme file name (ie: [filename: 'light-theme.css' -> 'light-theme'])

  // BORDERS
  // Use (,) commas to separate themes or single entry for border as:
  // colors[{label: 'Slate', number: '01', value: 'F0F0F0',
  // border: 'light-theme, high-contrast-theme'}]
  // and assign which swatch theborder should apply ['all' or 'matched-only']
  // themes: { 'high-contrast-theme': {'border': 'all'} }

  // CHECKMARKS
  // checkmark: {'one': [1, 2], 'two': [3, 10]}
  // will add class as "checkmark-{key}", where current colors number is in range
  // [{value[0]} to {value[1]}]
  // will add class "checkmark-one", where current colors number is in range [1 to 3]
  // and will add class "checkmark-two", where current colors number is in range [3 to 10]
  themes: {
    light: { border: 'matched-only', checkmark: { one: [1, 2], two: [3, 10] } },
    dark: { border: 'matched-only', checkmark: { one: [1, 2], two: [3, 10] } },
    'high-contrast': { border: 'all', checkmark: { one: [1, 3], two: [4, 10] } }
  },
  colors: [
    { label: 'Slate', number: '10', value: '1a1a1a' },
    { label: 'Slate', number: '09', value: '292929' },
    { label: 'Slate', number: '08', value: '383838', border: 'dark' },
    { label: 'Slate', number: '07', value: '454545', border: 'dark' },
    { label: 'Slate', number: '06', value: '5C5C5C' },
    { label: 'Slate', number: '05', value: '737373' },
    { label: 'Slate', number: '04', value: '999999' },
    { label: 'Slate', number: '03', value: 'BDBDBD' },
    { label: 'Slate', number: '02', value: 'D8D8D8' },
    { label: 'Slate', number: '01', value: 'F0F0F0', border: 'light, high-contrast' },
    { label: 'Amber', number: '10', value: 'D66221' },
    { label: 'Amber', number: '09', value: 'DE7223' },
    { label: 'Amber', number: '08', value: 'E68425' },
    { label: 'Amber', number: '07', value: 'EB9728' },
    { label: 'Amber', number: '06', value: 'EFAA30' },
    { label: 'Amber', number: '05', value: 'F2BC41' },
    { label: 'Amber', number: '04', value: 'F4C951' },
    { label: 'Amber', number: '03', value: 'F7D475' },
    { label: 'Amber', number: '02', value: 'F8E09C' },
    { label: 'Amber', number: '01', value: 'FBE9BF' },
    { label: 'Ruby', number: '10', value: '880E0E' },
    { label: 'Ruby', number: '09', value: '941E1E' },
    { label: 'Ruby', number: '08', value: 'A13030' },
    { label: 'Ruby', number: '07', value: 'AD4242' },
    { label: 'Ruby', number: '06', value: 'B94E4E' },
    { label: 'Ruby', number: '05', value: 'C65F5F' },
    { label: 'Ruby', number: '04', value: 'D26D6D' },
    { label: 'Ruby', number: '03', value: 'DE8181' },
    { label: 'Ruby', number: '02', value: 'EB9D9D' },
    { label: 'Ruby', number: '01', value: 'F4BCBC' },
    { label: 'Turquoise', number: '10', value: '0E5B52' },
    { label: 'Turquoise', number: '09', value: '206B62' },
    { label: 'Turquoise', number: '08', value: '317C73' },
    { label: 'Turquoise', number: '07', value: '448D83' },
    { label: 'Turquoise', number: '06', value: '579E95' },
    { label: 'Turquoise', number: '05', value: '69ADA3' },
    { label: 'Turquoise', number: '04', value: '7BBFB5' },
    { label: 'Turquoise', number: '03', value: '8ED1C6' },
    { label: 'Turquoise', number: '02', value: 'A9E1D6' },
    { label: 'Turquoise', number: '01', value: 'C0EDE3' },
    { label: 'Emerald', number: '10', value: '397514' },
    { label: 'Emerald', number: '09', value: '44831F' },
    { label: 'Emerald', number: '08', value: '56932E' },
    { label: 'Emerald', number: '07', value: '66A140' },
    { label: 'Emerald', number: '06', value: '76B051' },
    { label: 'Emerald', number: '05', value: '89BF65' },
    { label: 'Emerald', number: '04', value: '9CCE7C' },
    { label: 'Emerald', number: '03', value: 'AFDC91' },
    { label: 'Emerald', number: '02', value: 'C3E8AC' },
    { label: 'Emerald', number: '01', value: 'D5F6C0' },
    { label: 'Amethyst', number: '10', value: '4B2A5E' },
    { label: 'Amethyst', number: '09', value: '5A3A6F' },
    { label: 'Amethyst', number: '08', value: '6C4B81' },
    { label: 'Amethyst', number: '07', value: '7D5F92' },
    { label: 'Amethyst', number: '06', value: '8E72A4' },
    { label: 'Amethyst', number: '05', value: 'A189B8' },
    { label: 'Amethyst', number: '04', value: 'B59ECA' },
    { label: 'Amethyst', number: '03', value: 'C7B4DB' },
    { label: 'Amethyst', number: '02', value: 'DACCEC' },
    { label: 'Amethyst', number: '01', value: 'EDE3FC' },
    { label: 'Azure', number: '10', value: '133C59' },
    { label: 'Azure', number: '09', value: '134D71' },
    { label: 'Azure', number: '08', value: '1D5F8A' },
    { label: 'Azure', number: '07', value: '2876A8' },
    { label: 'Azure', number: '06', value: '368AC0' },
    { label: 'Azure', number: '05', value: '4EA0D1' },
    { label: 'Azure', number: '04', value: '69B5DD' },
    { label: 'Azure', number: '03', value: '8DC9E6' },
    { label: 'Azure', number: '02', value: 'ADD8EB' },
    { label: 'Azure', number: '01', value: 'CBEBF4' }
  ],
  placeIn: null, // null|'editor'
  showLabel: false,
  editable: true,
  uppercase: true,
  colorOnly: false
};

/**
* The ColorPicker Component is a trigger field with a listing colors that can be selected.
*
* @class ColorPicker
* @param {String} element The plugin element for the constuctor
* @param {String} settings The settings element.
* @param {String} colors An array of objects of the form
* {label: 'Azure', number: '01', value: 'CBEBF4'} that can be used to populate the color grid.
* @param {String} showLabel  Show the label if true vs the hex value if false.
* @param {String} editable  If false, the field is readonly and transparent.
* I.E. The value cannot be typed only editable by selecting.
* @param {String} uppercase  If false, lower case hex is allowed.
* If true upper case hex is allowed. If showLabel is true this setting is ignored.
* @param {String} colorOnly If true the field will be shrunk to only show the color portion.
*/
function ColorPicker(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COLORPICKER_DEFAULTS);

  // Merge Settings does deep copy we want to replace here
  if (settings.colors) {
    this.settings.colors = settings.colors;
  }

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
ColorPicker.prototype = {

  init() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');
    this.build();
    this.handleEvents();
  },

  // Add the extra markup
  build() {
    this.isEditor = this.settings.placeIn === 'editor';
    const colorpicker = this.element;
    const initialValue = this.isEditor ? this.element.attr('data-value') : this.element.val();

    if (!this.isEditor) {
      // Add Button
      if (this.isInlineLabel) {
        this.inlineLabel.addClass('colorpicker-container');
      } else {
        this.container = $('<span class="colorpicker-container"></span>');
        colorpicker.wrap(this.container);
      }

      this.container = colorpicker.parent();
      this.swatch = $('<span class="swatch"></span>').prependTo(this.container);

      // Add Masking to show the #.
      // Remove the mask if using the "showLabel" setting
      if (!this.settings.showLabel) {
        const patternUpper = ['#', /[0-9A-F]/, /[0-9A-F]/, /[0-9A-F]/, /[0-9A-F]/, /[0-9A-F]/, /[0-9A-F]/];
        const patternLower = ['#', /[0-9a-f]/, /[0-9a-f]/, /[0-9a-f]/, /[0-9a-f]/, /[0-9a-f]/, /[0-9a-f]/];

        colorpicker.mask({
          pattern: this.settings.uppercase ? patternUpper : patternLower
        });
      } else {
        const maskAPI = colorpicker.data('mask');
        if (maskAPI && typeof maskAPI.destroy === 'function') {
          maskAPI.destroy();
        }
      }
    }

    this.icon = $.createIconElement('dropdown')
      .appendTo(this.isEditor ? this.element : this.container);
    this.icon.wrap('<span class="trigger"></span>');

    // Handle initial values
    if (initialValue) {
      this.setColor(initialValue);
    }

    if (this.element.is(':disabled')) {
      this.disable();
    }

    if (this.element.prop('readonly')) {
      this.readonly();
    }

    if (!this.settings.editable) {
      this.readonly();
    }

    if (this.settings.colorOnly) {
      this.element.parent().addClass('color-only');
    }

    this.addAria();
  },

  /**
  * Get the hex value based on a label. Does not handle duplicates.
  * @param {String} label  &nbsp;-&nbsp; The label to search for in the color labels.
  * @return {void}
  */
  getHexFromLabel(label) {
    for (let i = 0; i < this.settings.colors.length; i++) {
      const data = this.settings.colors[i];

      if (label === data.label + data.number) {
        let hex = data.value;
        if (hex.substr(0, 1) !== '#') {
          hex = `#${hex}`;
        }

        return hex;
      }
    }
    return '';
  },

  /**
  * Get the label value based on a hex. Does not handle duplicates.
  * Can pass with or without the #
  *
  * @param {String} hex The hex to search for in the color set.
  * @return {void}
  */
  getLabelFromHex(hex) {
    if (!hex) {
      return '';
    }

    for (let i = 0; i < this.settings.colors.length; i++) {
      const data = this.settings.colors[i];

      if (hex.replace('#', '') === data.value.replace('#', '')) {
        return data.label + data.number;
      }
    }

    return '';
  },

  /**
  * Add the necessary aria for accessibility.
  * @private
  * @returns {void}
  */
  addAria() {
    this.element.attr({
      role: 'combobox',
      'aria-autocomplete': 'list'
    });

    $(`label[for="${this.element.attr('id')}"]`)
      .append(`<span class="audible">${Locale.translate('UseArrow')}</span>`);
  },

  /**
  * Toggle / Open the List of Colors
  * @returns {void}
  */
  toggleList() {
    let menu = $('#colorpicker-menu');

    if (this.element.is(':disabled') || (this.element.prop('readonly') && this.settings.editable)) {
      return;
    }

    if (menu.length) {
      $(document).trigger($.Event('keydown', { keyCode: 27, which: 27 })); // escape

      if (this.isPickerOpen) {
        return;
      }
    }

    // Append Color Menu
    menu = this.updateColorMenu();

    const popupmenuOpts = {
      ariaListbox: true,
      menuId: 'colorpicker-menu',
      trigger: 'immediate',
      placementOpts: {
        containerOffsetX: 10,
        containerOffsetY: 10,
        parentXAlignment: (Locale.isRTL() ? 'right' : 'left'),
        strategies: ['flip', 'nudge', 'shrink']
      },
      offset: {
        x: 0,
        y: 10
      }
    };

    // Show Menu

    this.element
      .popupmenu(popupmenuOpts)
      .on('open.colorpicker', () => {
        this.element.parent().addClass('is-open');
        this.isPickerOpen = true;
      })
      .on('close.colorpicker', () => {
        menu.on('destroy.colorpicker', () => {
          this.element.off('open.colorpicker selected.colorpicker close.colorpicker');
          this.menu.off('destroy.colorpicker').remove();
        });

        this.element.parent().removeClass('is-open');
        this.isPickerOpen = false;

        this.element.trigger('listclosed', 'select');
      })
      .on('selected.colorpicker', (e, item) => {
        if (!this.isEditor) {
          this.setColor(item.data('value'), item.data('label'));
        }
        this.element.focus();
        this.element.trigger('change');
      });

    // Append Buttons
    this.menu = $('#colorpicker-menu');

    setTimeout(() => {
      this.menu.find('.is-selected').focus();
    }, 1);
  },

  /**
  * Set the visible color in the field
  * @param {String} hex The hex value to use (can have the # or not).
  * @param {String} label The text to display
  * @returns {void}
  */
  setColor(hex, label) {
    let colorHex = hex;
    let colorLabel = label;

    // Make sure there is always a hash
    if (hex.substr(0, 1) !== '#') {
      colorHex = `#${colorHex}`;
    }

    const isValidHex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorHex);

    // Simply return out if hex isn't valid
    if (!isValidHex) {
      if (!this.settings.showLabel) {
        return;
      }
      colorLabel = hex.replace('#', '');
      colorHex = this.getHexFromLabel(colorLabel);
    }

    const targetAttr = this.isEditor ? 'data-value' : 'value';

    if (!colorLabel) {
      colorLabel = this.getLabelFromHex(colorHex);
    }

    // Set the value on the field
    this.element[0].value = this.settings.showLabel ? colorLabel : colorHex;
    this.element[0].setAttribute(targetAttr, colorHex);
    this.swatch[0].style.backgroundColor = colorHex;

    this.element[0].setAttribute('aria-describedby', colorLabel);
  },

  // Refresh and Append the Color Menu
  updateColorMenu() {
    const isMenu = !!($('#colorpicker-menu').length);
    const menu = $('<ul id="colorpicker-menu" class="popupmenu colorpicker"></ul>');
    const currentTheme = personalization.currentTheme;
    const isBorderAll = (this.settings.themes[currentTheme].border === 'all');
    const isChecked = this.settings.themes[currentTheme].checkmark;
    let checkmarkClass = '';

    for (let i = 0, l = this.settings.colors.length; i < l; i++) {
      const li = $('<li></li>');
      const a = $('<a href="#"><span class="swatch"></span></a>').appendTo(li);
      const colorText = (Locale.translate(this.settings.colors[i].label, true) || this.settings.colors[i].label) + (this.settings.colors[i].number || '');
      const colorValue = this.settings.colors[i].value;
      const colorNum = parseInt(this.settings.colors[i].number, 10);
      let isBorder = false;
      const regexp = new RegExp(`\\b${currentTheme}\\b`);
      let elemValue = this.isEditor ? this.element.attr('data-value') : this.element.val();

      if (this.settings.showLabel && !this.isEditor) {
        elemValue = this.getHexFromLabel(elemValue);
      }

      // Set border to this swatch
      if (isBorderAll || regexp.test(this.settings.colors[i].border)) {
        isBorder = true;
      }

      if (elemValue && (`${elemValue}`).toLowerCase().replace('#', '') === (`${colorValue}`).toLowerCase()) {
        // Set checkmark color class
        if (isChecked) {
          /* eslint-disable no-loop-func */
          $.each(isChecked, (k, v) => {
            // checkmark: {'one': [1, 2], 'two': [3, 10]}
            // will add class "checkmark-one", where current colors number is in range [1 to 3]
            // and will add class "checkmark-two", where current colors number is in range [3 to 10]
            if ((colorNum >= v[0]) && (colorNum <= v[1])) {
              checkmarkClass = ` checkmark-${k}`;
            }
          });
          /* eslint-disable no-loop-func */
        }
        a.addClass(`is-selected${checkmarkClass}`);
      }

      const swatch = a.find('.swatch');
      if (swatch[0]) {
        swatch[0].style.backgroundColor = `#${colorValue}`;
      }
      swatch.addClass(isBorder ? 'is-border' : '');
      a.data('label', colorText)
        .data('value', colorValue)
        .attr('title', `${colorText} #${colorValue}`)
        .tooltip();

      if (!isMenu) {
        menu.append(li);
      }
    }

    if (!isMenu) {
      $('body').append(menu);
    }

    return menu;
  },

  /**
  * Change the color picker from enabled to disabled.
  * @returns {void}
  */
  enable() {
    this.element.prop('disabled', false);
    this.element.prop('readonly', false);
    this.element.parent().removeClass('is-disabled is-readonly');
  },

  /**
  * Make the color picker disabled
  * @returns {void}
  */
  disable() {
    this.element.prop('disabled', true);
    this.element.parent().addClass('is-disabled');
  },

  /**
  * Make the color picker readonly
  * @returns {void}
  */
  readonly() {
    this.enable();
    this.element.prop('readonly', true);
    this.element.parent().addClass('is-readonly');

    if (!this.settings.editable) {
      this.element.parent().addClass('is-not-editable');
    }
  },

  /**
  * Returns true if the color picker is disabled.
  * @returns {void}
  */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
  * Gets the decimal as a rgb value so it can be shown in the editor
  * @private
  * @param {string} n Decimal value to convert to rgb.
  * @returns {void}
  */
  decimal2rgb(n) {
    if (typeof n !== 'number') {
      return n;
    }

    /* eslint-disable no-bitwise */
    return `rgb(${n & 0xFF},
      ${(n & 0xFF00) >> 8},
      ${(n & 0xFF0000) >> 16})`;
    /* eslint-disable no-console */
  },

  rgb2hex(rgb) {
    if (rgb.search('rgb') === -1) {
      return rgb;
    } else if (rgb === 'rgba(0, 0, 0, 0)') {
      return 'transparent';
    }

    const hex = function (x) {
      return (`0${parseInt(x, 10).toString(16)}`).slice(-2);
    };

    const newRgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    return `#${hex(newRgb[1])}${hex(newRgb[2])}${hex(newRgb[3])}`;
  },

  /**
  * Updates the component instance.  Can be used after being passed new settings.
  * @returns {void}
  */
  updated() {
    return this
      .destroy()
      .init();
  },

  teardown() {
    this.element.off('keyup.colorpicker blur.colorpicker openlist.colorpicker change.colorpicker paste.colorpicker');
    this.swatch.off('click.colorpicker');
    this.swatch.remove();
    this.container.find('.trigger').remove();
    const input = this.container.find('.colorpicker');

    if (input.data('mask')) {
      input.data('mask').destroy();
    }

    input.unwrap();
    input.removeAttr('data-mask role aria-autocomplete');
  },

  /**
  * Detach events and restore DOM to default.
  * @returns {Object} The plugin api (this).
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    return this;
  },

  /**
  * Detach events and restore DOM to default.
  * @returns {void}
  */
  handleEvents() {
    const self = this;
    this.icon.parent().onTouchClick().on('click.colorpicker', () => {
      self.toggleList();
    });

    this.element.on('focus.colorpicker', function () {
      $(this).parent().addClass('is-focused');
    })
      .on('blur.colorpicker', function () {
        $(this).parent().removeClass('is-focused');
      })
      .on('openlist.colorpicker', () => {
        self.toggleList();
      });

    this.element.on('keyup.colorpicker blur.colorpicker paste.colorpicker change.colorpicker', function () {
      const val = $(this).val();
      self.setColor(val);
    });

    // Handle Key Down to open
    this.element.on('keydown.colorpicker', (e) => {
      if (e.keyCode === 38 || e.keyCode === 40) {
        self.toggleList();
      }
    });
  }

};

export { ColorPicker, COMPONENT_NAME };
