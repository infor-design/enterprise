import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { personalization } from '../personalize/personalize.bootstrap';

// Default Settings
const COMPONENT_NAME = 'colorpicker';

/**
 * The ColorPicker Component is a trigger field with a listing colors that can be selected.
 * @class ColorPicker
 * @param {jQuery[]|HTMLElement} element The plugin element for the constuctor
 * @param {object} [settings] The settings element.
 * @param {object} [settings.themes={}] Themes available for ColorPicker
 * @param {array} [settings.colors=[]] An array of objects of the form. {label: 'Azure', number: '01', value: 'CBEBF4'}
 * that can be used to populate the color grid.
 * @param {boolean} [settings.showLabel=false]  Show the label if true vs the hex value if false.
 * @param {boolean} [settings.editable=true]  If false, the field is readonly and transparent. I.E. The value
 * cannot be typed only editable by selecting.
 * @param {boolean} [settings.uppercase=true] If false, lower case hex is allowed. If true upper case hex is allowed.
 * If showLabel is true this setting is ignored.
 * @param {boolean} [settings.colorOnly=false] If true the field will be shrunk to only show the color portion.
 * @param {boolean} [settings.clearable=true] If true will add clearable option.
 * @param {string} [settings.clearableText] The text to show in tooltip.
 * @param {object} [settings.popupmenuSettings] optional Popupmenu settings that will supersede the defaults.
 * @param {string} [settings.attributes] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 */
const COLORPICKER_DEFAULTS = {
  // Theme key: MUST match with theme file name (ie: [filename: 'light-theme.css' -> 'light-theme'])

  // BORDERS
  // Use (,) commas to separate themes or single entry for border as:
  // colors[{label: 'Slate', number: '01', value: 'F0F0F0',
  // border: 'light-theme, contrast-theme'}]
  // and assign which swatch theborder should apply ['all' or 'matched-only']
  // themes: { 'contrast-theme': {'border': 'all'} }

  // CHECKMARKS
  // checkmark: {'one': [1, 2], 'two': [3, 10]}
  // will add class as "checkmark-{key}", where current colors number is in range
  // [{value[0]} to {value[1]}]
  // will add class "checkmark-one", where current colors number is in range [1 to 3]
  // and will add class "checkmark-two", where current colors number is in range [3 to 10]
  themes: {
    light: { border: 'matched-only', checkmark: { one: [1, 2], two: [3, 10] } },
    dark: { border: 'matched-only', checkmark: { one: [1, 2], two: [3, 10] } },
    contrast: { border: 'all', checkmark: { one: [1, 3], two: [4, 10] } }
  },
  customColors: false,
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
    { label: 'Slate', number: '01', value: 'F0F0F0', border: 'light, contrast' },
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
    { label: 'Azure', number: '06', value: '2578A9' },
    { label: 'Azure', number: '05', value: '4EA0D1' },
    { label: 'Azure', number: '04', value: '69B5DD' },
    { label: 'Azure', number: '03', value: '8DC9E6' },
    { label: 'Azure', number: '02', value: 'ADD8EB' },
    { label: 'Azure', number: '01', value: 'C8E9F4' }
  ],
  placeIn: null, // null|'editor'
  showLabel: false,
  editable: true,
  disabled: false,
  uppercase: true,
  colorOnly: false,
  clearable: true,
  clearableText: null,
  popupmenuSettings: {}
};

function ColorPicker(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COLORPICKER_DEFAULTS);

  // Merge Settings does deep copy we want to replace here
  if (settings && settings.colors) {
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
    this.isIe = env.browser.name === 'ie';
    this.isIeEdge = env.browser.name === 'edge';
    this.isIe11 = this.isIe && env.browser.version === '11';
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');

    // Set default clearable text
    if (!this.settings.clearableText) {
      this.settings.clearableText = Locale ? Locale.translate('None') : 'None';
    }

    this.build();
    this.handleEvents();
    this.setCustomWidth();
  },

  // Add the extra markup
  build() {
    this.isEditor = this.settings.placeIn === 'editor';
    const colorpicker = this.element;
    const initialValue = this.isEditor ? this.element.attr('data-value') : this.element.val();
    const classList = `swatch${(!initialValue || $.trim(initialValue) === '') ? ' is-empty' : ''}`;

    if (!this.isEditor) {
      // Add Button
      if (this.isInlineLabel) {
        this.inlineLabel.addClass('colorpicker-container');
      } else {
        this.container = $('<span class="colorpicker-container"></span>');
        colorpicker.wrap(this.container);
      }

      this.container = colorpicker.parent();
      this.swatch = $(`<span class="${classList}"></span>`).prependTo(this.container);

      // Add Masking to show the #.
      // Remove the mask if using the "showLabel" setting
      if (!this.settings.showLabel) {
        const pattern = ['#', /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/];

        colorpicker.mask({ pattern });
      } else {
        const maskAPI = colorpicker.data('mask');
        if (maskAPI && typeof maskAPI.destroy === 'function') {
          maskAPI.destroy();
        }
      }
    }

    let trigger = this.element.children('.trigger');
    if (this.container && this.container.length) {
      trigger = this.container.children('.trigger');
    }

    if (!trigger || !trigger.length || !trigger.children('.icon').length) {
      this.icon = $.createIconElement('dropdown')
        .appendTo(this.isEditor ? this.element : this.container);
      this.icon.wrap('<span class="trigger"></span>');
    }

    // Handle initial values
    if (initialValue) {
      this.setColor(initialValue);
    }

    if (this.element.is(':disabled') || this.settings.disabled) {
      this.disable();
    }

    if (this.element.is(':disabled') && this.container) {
      this.container.closest('.field').addClass('is-disabled');
    }

    if (this.element.prop('readonly')) {
      this.readonly();
    }

    if (!this.settings.editable && !this.settings.disabled) {
      this.readonly();
    }

    if (this.settings.colorOnly) {
      this.element.parent().addClass('color-only');
    }

    this.element.attr('autocomplete', 'off');
    this.addAria();

    // Add automation Id's
    utils.addAttributes(this.element.parent().find('.trigger'), this, this.settings.attributes, 'trigger');
  },

  /**
  * Get the hex value based on a label. Does not handle duplicates.
  * @param {string} label  The label to search for in the color labels.
  * @returns {void}
  */
  getHexFromLabel(label) {
    for (let i = 0; i < this.settings.colors.length; i++) {
      const data = this.settings.colors[i];
      const translated = Locale.translate(data.label, true);

      if (label === data.label + data.number || label === translated + data.number) {
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
  * @param {string} hex The hex to search for in the color set.
  * @returns {void}
  */
  getLabelFromHex(hex) {
    if (!hex) {
      return '';
    }

    for (let i = 0; i < this.settings.colors.length; i++) {
      const data = this.settings.colors[i];

      if (hex.replace('#', '') === data.value.replace('#', '')) {
        return this.translateColorLabel(data.label) + data.number;
      }
    }

    return '';
  },

  /**
  * Set custom width.
  * @private
  * @returns {void}
  */
  setCustomWidth() {
    if (this.element[0].style && this.element[0].style.width) {
      const w = parseInt(this.element[0].style.width, 10);
      this.container.css({ width: w });
      this.element.css({ width: ((w - 4) - this.swatch.width()) });
    }
  },

  /**
  * Get the currently set hex value.
  * @returns {string} A string containing the hex
  */
  getHexValue() {
    return this.element.attr('value');
  },

  /**
  * Get the currently set label value.
  * @returns {string} A string containing the hex
  */
  getLabelValue() {
    return this.settings.showLabel ? this.element.val() : this.getLabelFromHex(this.element.val());
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

    if (menu.length && this.isPickerOpen) {
      return;
    }

    // Append Color Menu
    menu = this.updateColorMenu();

    const popupmenuOpts = utils.extend({}, {
      ariaListbox: true,
      menuId: 'colorpicker-menu',
      trigger: 'immediate',
      attachToBody: true,
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
    }, this.settings.popupmenuSettings);

    // Show Menu
    this.element
      .popupmenu(popupmenuOpts)
      .on('open.colorpicker', () => {
        this.element.parent().addClass('is-open');
        this.isPickerOpen = true;
      })
      .on('close.colorpicker', () => {
        const links = [].slice.call(this.menu[0].querySelectorAll('a'));
        links.forEach((link) => {
          const tooltipApi = $(link).data('tooltip');
          if (tooltipApi) {
            tooltipApi.hide();
          }
        });
        menu.on('destroy.colorpicker', () => {
          this.element.off('open.colorpicker selected.colorpicker close.colorpicker');
          this.menu.off('destroy.colorpicker').remove();
        });

        this.element.parent().removeClass('is-open');
        this.isPickerOpen = false;

        /**
        *  Fires after the color picker popup is closed
        * @event listclosed
        * @memberof ColorPicker
        * @property {object} event The jquery event object
        */
        this.element.trigger('listclosed', 'select');
      })
      .on('selected.colorpicker', (e, item) => {
        if (!this.isEditor) {
          this.setColor(item.data('value'), item.data('label'));
        }

        // Editor colorpicker
        let cpEditorNotVisible = false;
        if (this.element.is('.colorpicker-editor-button')) {
          const toolbarItem = this.element.data('toolbaritem') || this.element.data('toolbarflexitem');
          const toolbarAPI = toolbarItem ? toolbarItem.toolbarAPI : null;
          if (toolbarAPI) {
            toolbarAPI.overflowedItems.forEach((thisItem) => {
              if (thisItem.type === 'colorpicker') {
                cpEditorNotVisible = true;
              }
            });
          }
        }

        if (!cpEditorNotVisible) {
          this.element.focus();
        }

        /**
        *  Fires after the color picker is changed
        * @event change
        * @memberof ColorPicker
        * @property {object} event The jquery event object
        */
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
  * @param {string} hex The hex value to use (can have the # or not).
  * @param {string} label The text to display
  * @returns {void}
  */
  setColor(hex, label) {
    hex = hex || '';
    const s = this.settings;
    let colorHex = hex;
    let colorLabel = label;

    // Make sure there is always a hash
    if (hex.toString().substr(0, 1) !== '#' && hex !== '') {
      colorHex = `#${colorHex}`;
    }

    const isValidHex = /(^#[0-9a-fA-F]{6}$)|(^#[0-9a-fA-F]{3}$)/i.test(colorHex);

    // Simply return out if hex isn't valid
    if (s.showLabel && label === s.clearableText) {
      this.setValueOnField({ hex: colorHex, label: s.clearableText, isEmpty: true });
      return;
    } if (!isValidHex) {
      if (!s.showLabel) {
        colorHex = colorHex !== '#' ? colorHex : '';
        this.setValueOnField({ hex: colorHex, invalid: true });
        return;
      }
      colorLabel = hex.replace('#', '');
      colorHex = this.getHexFromLabel(colorLabel);
    }

    if (!colorLabel) {
      colorLabel = this.getLabelFromHex(colorHex);
    }

    this.setValueOnField({ hex: colorHex, label: colorLabel });
  },

  /**
   * Set the value on the field
   * @private
   * @param {object} [o] Options
   * @param {string} [o.hex] The hex value to use
   * @param {string} [o.label] The text to display
   * @param {boolean} [o.isEmpty] if true will set empty value for all
   * @param {boolean} [o.invalid] if true will set empty value for swatch only
   * @returns {void}
   */
  setValueOnField(o) {
    const s = this.settings;
    const targetAttr = this.isEditor ? 'data-value' : 'value';
    let hex = '';

    if (!o.isEmpty && typeof o.hex === 'string') {
      hex = s.uppercase ? o.hex.toUpperCase() : o.hex.toLowerCase();
    }

    if (this.swatch) {
      if (o.isEmpty || o.invalid) {
        this.swatch.addClass(o.isEmpty ? 'is-empty' : 'is-invalid');
        this.swatch[0].style.backgroundColor = '';
      } else {
        this.swatch.removeClass('is-empty is-invalid');
        this.swatch[0].style.backgroundColor = hex;
      }
    }

    this.element[0].value = s.showLabel ? o.label : hex;
    this.element[0].setAttribute(targetAttr, hex);
    this.element[0].setAttribute('aria-describedby', o.label || '');
  },

  /**
   * @private
   * @param {string} colorText the original text color
   * @returns {string} the translated text color
   */
  translateColorLabel(colorText) {
    if (!colorText) {
      return '';
    }
    const translatedText = Locale.translate(colorText, true);
    return typeof translatedText === 'string' ?
      Locale.translate(colorText, true) : colorText;
  },

  /**
   * Make basic theme variants backwards/forwards compatible
   * @param {string} activeTheme The active theme to get the variant for
   * @returns {string} The theme variants's border property value
   * @example (i.e. match "theme-uplift-light" with "light" and return "themes.light.border")
   */
  getThemeVariant(activeTheme) {
    const legacyThemes = Object.keys(COLORPICKER_DEFAULTS.themes);
    const res = legacyThemes.filter(legacyTheme => activeTheme.indexOf(legacyTheme) > -1);
    let variant = 'light';
    if (res.length > 0) {
      variant = res[0];
    }
    return variant;
  },

  /**
   * Refresh and Append the Color Menu
   * @private
   * @returns {jQuery} the menu to be appended
   */
  updateColorMenu() {
    const s = this.settings;
    const isMenu = !!($('#colorpicker-menu').length);
    const menu = $('<ul id="colorpicker-menu" class="popupmenu colorpicker"></ul>');
    const activeTheme = personalization.currentTheme;
    const themeVariant = this.getThemeVariant(activeTheme);
    const isBorderAll = (s.themes[themeVariant].border === 'all');
    const checkThemes = s.themes[themeVariant].checkmark;
    let checkmarkClass = '';

    for (let i = 0, l = s.colors.length; i < l; i++) {
      const li = $('<li></li>');
      const a = $('<a href="#"><span class="swatch"></span></a>').appendTo(li);
      const colorText = (this.translateColorLabel(s.colors[i].label) || s.colors[i].label) + (s.colors[i].number || '');
      const colorNum = parseInt(s.colors[i].number, 10);
      const regexp = new RegExp(`\\b${activeTheme}\\b`);
      let colorValue = s.colors[i].value;
      let isBorder = false;
      let elemValue = this.isEditor ? this.element.attr('data-value') : this.element.val();

      if (s.showLabel && !this.isEditor) {
        elemValue = this.getHexFromLabel(elemValue);
      }

      // Set border to this swatch
      if (isBorderAll || regexp.test(s.colors[i].border)) {
        isBorder = true;
      }

      if (elemValue && (`${elemValue}`).toLowerCase().replace('#', '') === (`${colorValue}`).toLowerCase()) {
        // Set checkmark color class
        if (checkThemes) {
          /* eslint-disable no-loop-func */
          $.each(checkThemes, (k, v) => {
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

      colorValue = s.uppercase ? colorValue.toUpperCase() : colorValue.toLowerCase();
      const swatch = a.find('.swatch');
      if (swatch[0]) {
        swatch[0].style.backgroundColor = `#${colorValue}`;
      }
      swatch.addClass(isBorder ? 'is-border' : '');

      a[0].setAttribute('data-label', colorText);
      a[0].setAttribute('data-value', colorValue);
      a[0].setAttribute('data-title', `${colorText} #${colorValue}`);
      a.tooltip();

      utils.addAttributes(a, this, this.settings.attributes, colorText);

      if (!isMenu) {
        menu.append(li);
      }
    }

    if (!isMenu) {
      // Add clearable swatch to popupmenu
      if (s.clearable) {
        const li = $('<li></li>');
        const resetColorValue = this.element.attr('data-action') === 'foreColor' ? '000000' : '';
        const a = $(`<a href="#" title="${s.clearableText}"><span class="swatch is-empty${isBorderAll ? ' is-border' : ''}"></span></a>`).appendTo(li);
        a.data('label', s.clearableText)
          .data('value', resetColorValue)
          .tooltip();

        utils.addAttributes(a, this, this.settings.attributes, 'clear');
        menu.append(li);
      }

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

    if (!this.settings.placeIn) {
      this.element.parent().addClass('is-disabled');
    }
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
    return `rgb(${n & 0xFF}, ${(n & 0xFF00) >> 8}, ${(n & 0xFF0000) >> 16})`;
  },

  rgb2hex(rgb) {
    if (!rgb || rgb.search('rgb') === -1) {
      return rgb;
    } if (rgb === 'rgba(0, 0, 0, 0)') {
      return 'transparent';
    }

    const hex = function (x) {
      return (`0${parseInt(x, 10).toString(16)}`).slice(-2);
    };

    const newRgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    return `#${hex(newRgb[1])}${hex(newRgb[2])}${hex(newRgb[3])}`;
  },

  /**
  * Update the component and optionally apply new settings.
  *
  * @param  {object} settings the settings to update to.
  * @returns {object} The plugin api for chaining.
  */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    return this.init();
  },

  teardown() {
    this.element.off([
      `keypress.${COMPONENT_NAME}`,
      `keyup.${COMPONENT_NAME}`,
      `blur.${COMPONENT_NAME}`,
      `openlist.${COMPONENT_NAME}`,
      `change.${COMPONENT_NAME}`,
      `paste.${COMPONENT_NAME}`
    ].join(' '));

    if (this.swatch && this.swatch.length) {
      this.swatch.off(`click.${COMPONENT_NAME}`);
      this.swatch.remove();
      delete this.swatch;
    }

    const maskAPI = this.element.data('mask');
    if (maskAPI) {
      maskAPI.destroy();
    }

    if (this.icon && this.icon.length) {
      const trigger = this.icon.parent('.trigger');
      this.icon.off().remove();
      trigger.off().remove();
      delete this.icon;
    }

    if (this.container && this.container.length) {
      this.container.find('.trigger').remove();
      this.element.unwrap();
      delete this.container;
    }
  },

  /**
  * Detach events and restore DOM to default.
  * @returns {object} The plugin api (this).
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    return this;
  },

  /**
  * Detach events and restore DOM to default.
  * @private
  * @returns {void}
  */
  handleEvents() {
    const elem = this.element;
    const elemParent = elem.parent();
    let originalVal;

    this.icon.parent().on('click.colorpicker', () => {
      this.toggleList();
    });

    elem
      .on('focus.colorpicker', () => {
        originalVal = elem.val();
        elemParent.addClass('is-focused');
      })
      .on('blur.colorpicker', () => {
        elemParent.removeClass('is-focused');

        // Fix: Force to change event
        // IE-Edge not firing `change event` after updated input-s values
        if (this.isIeEdge && !elem.is('.is-open') && originalVal !== elem.val()) {
          elem.triggerHandler('change');
        }
      })
      .on('openlist.colorpicker', () => {
        this.toggleList();
      });

    let eventStr = 'blur.colorpicker paste.colorpicker change.colorpicker';
    eventStr += this.isIe11 ? 'keypress.colorpicker' : 'keyup.colorpicker';
    elem.on(eventStr, () => {
      const val = this.isEditor ? elem.attr('data-value') : elem.val();
      if (this.settings.showLabel) {
        this.setColor(elem.attr('value'), val);
        return;
      }
      this.setColor(val);
    });

    // Handle Key Down to open
    elem.on('keydown.colorpicker', (e) => {
      if (e.keyCode === 38 || e.keyCode === 40) {
        this.toggleList();
      }
      if (e.keyCode === 13) {
        this.setColor(elem.val());
      }
    });
  }

};

export { ColorPicker, COMPONENT_NAME };
