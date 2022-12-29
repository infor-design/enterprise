import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Name of this component
const COMPONENT_NAME = 'textarea';

// Component Options
const TEXTAREA_DEFAULTS = {
  autoGrow: false,
  autoGrowMaxHeight: null,
  characterCounter: true,
  maxLength: null,
  printable: true,
  charRemainingText: null,
  charMaxText: null,
  attributes: null
};

/**
* The Textarea Component wraps a standard HTML Textarea element and provides additional features.
* @class Textarea
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {boolean} [settings.autoGrow = false] Will automatically expand the textarea to fit the contents when typing.
* @param {number} [settings.autoGrowMaxHeight = null] The Max Height of the textarea when autoGrow is enabled.
* @param {boolean} [settings.characterCounter = true] Displays a counter that counts down from the maximum.
* @param {boolean} [settings.maxLength = number] Maximum characters allowed in textarea.
* length allowed.
* @param {boolean} [settings.printable = true] Determines whether or not the text area can be displayed on a
* printed page.
* @param {null|String} [settings.charRemainingText = 'Characters Left']  Text that will be used in place of the "remaining"
* text defaulting to a localized 'Characters Left'.
* @param {null|String} [settings.charMaxText = 'Character count maximum of']  Text that will be used in place of the "Max" text.
* Defaults to a localized Version of 'Character count maximum of'.
* @param {string} [settings.attributes = null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
*/
function Textarea(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TEXTAREA_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Textarea.prototype = {

  /**
   * @private
   */
  init() {
    // Add "is-disabled" class to greyed-out the field
    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isSafari = (
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1 &&
      navigator.userAgent.indexOf('Android') === -1
    );

    this.element.addClass(this.element.is('.textarea-xs') ? 'input-xs' : //eslint-disable-line
      this.element.is('.textarea-sm') ? 'input-sm' : //eslint-disable-line
        this.element.is('.textarea-def') ? 'input-md' : //eslint-disable-line
          this.element.is('.textarea-lg') ? 'input-lg' : ''); //eslint-disable-line

    if (this.settings.characterCounter && this.getMaxLength()) {
      this.counter = $('<span class="textarea-wordcount">Chars Left..</span>').insertAfter(this.element);
    }
    if (this.settings.printable) {
      this.printarea = $('<span class="textarea-print"></span>').insertBefore(this.element);
    }

    if (this.element.hasClass('autogrow')) {
      this.settings.autoGrow = true;
    }

    this.setupAutoGrow();
    this.handleEvents();
    this.updateCounter();
  },

  /**
   * Determines if the text is selected.
   * @private
   * @param  {object}  input The input dom element (jQuery)
   * @returns {boolean} True if the text is selected in the input.
   */
  isSelected(input) {
    if (typeof input.selectionStart === 'number') {
      return input.selectionStart === 0 && input.selectionEnd === input.value.length;
    }
    if (typeof document.selection !== 'undefined') {
      return document.selection.createRange().text === input.value;
    }
    return false;
  },

  /**
   * Checks a keycode value and determines if it belongs to a printable character.
   * @private
   * @param {number} keycode - a number representing an ASCII keycode value
   * @param {boolean} shiftKey - a boolean set to true if shift key is being pressed
   * @returns {boolean} Returns true if the key is a printable one.
   */
  isPrintable(keycode, shiftKey) {
    // (keycode > 47 && keycode < 58) || // number keys
    // (keycode > 64 && keycode < 91) || // letter keys
    // (keycode > 95 && keycode < 112) || // numpad keys
    // (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    // (keycode > 218 && keycode < 223); // [\]' (in order)

    let valid = false;

    if (shiftKey) {
      valid =
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode >= 33 && keycode <= 38) ||
        (keycode >= 40 && keycode <= 43) ||
        (keycode === 126 || keycode === 58 || keycode === 60) ||
        (keycode >= 123 && keycode <= 125) ||
        (keycode === 94 || keycode === 95) ||
        (keycode >= 62 && keycode <= 64);
    } else {
      valid =
        keycode === 13 || // enter key
        (keycode >= 48 && keycode <= 57) || // number keys
        (keycode >= 97 && keycode <= 122) || // letter keys
        (keycode === 59 || keycode === 61 ||
        (keycode >= 44 && keycode <= 47) || keycode === 96) || // ;=,-./` (in order)
        (keycode >= 91 && keycode <= 93) || keycode === 39; // [\]' (in order)
    }

    return valid;
  },

  /**
  * Setup the auto grow functionality.
  * @private
  */
  setupAutoGrow() {
    if (this.settings.autoGrow && this.element.length) {
      const elem = this.element[0];

      if (this.settings.autoGrowMaxHeight) {
        elem.style.maxHeight = `${this.settings.autoGrowMaxHeight}px`;
      }

      elem.style.overflow = 'hidden';
      this.autoGrow();
    }
  },

  /**
  * Activate the auto grow functionality from a change.
  * @private
  */
  autoGrow() {
    if (!this.settings.autoGrow) {
      return;
    }

    const elem = this.element[0];
    const oldHeight = elem.offSetHeight;
    const maxHeight = this.settings.autoGrowMaxHeight || 0;
    let newHeight = elem.scrollHeight;

    if (maxHeight > 0 && maxHeight < newHeight) {
      newHeight = maxHeight;
      elem.style.overflow = '';
      if (oldHeight === newHeight) {
        return;
      }
    } else {
      elem.style.overflow = 'hidden';
    }

    elem.style.height = '5px';
    elem.style.height = `${elem.scrollHeight + 2}px`;
  },

  /**
   * Counts the number of line breaks in a string
   * @private
   * @param {string} s The string to test.
   * @returns {number} The number of found line countLinebreaks
   */
  countLinebreaks(s) {
    return (s.match(/\n/g) || []).length;
  },

  /**
   * Updates the descriptive markup (counter, etc) to notify the user how many
   * characters can be typed.
   * @private
   * @param {object} self The current object.
   */
  updateCounter() {
    const self = this;
    const value = self.element.val();
    const isExtraLinebreaks = this.isChrome || this.isSafari;
    const length = value.length + (isExtraLinebreaks ? this.countLinebreaks(value) : 0);
    const max = self.getMaxLength();
    const remaining = (parseInt(max, 10) - length);
    let text = (self.settings.charRemainingText ? self.settings.charRemainingText : //eslint-disable-line
      (Locale.translate('CharactersLeft') === 'CharactersLeft' ? 'Characters Left' :
        Locale.translate('CharactersLeft'))).replace('{0}', remaining.toString());

    if (self.counter) {
      if (length >= max) {
        text = (self.settings.charMaxText ? self.settings.charMaxText.replace('{0}', max) : Locale.translate('CharactersMax') + max);
        self.counter.text(text);
        self.counter.removeClass('almost-empty');
      } else {
        self.counter.text(text);
        if (remaining < 10) {
          self.counter.addClass('almost-empty');
        } else {
          self.counter.removeClass('almost-empty');
        }
      }
    }

    self.printarea.text(self.element.val());
  },

  /**
   * Enables this component instance.
   */
  enable() {
    this.element.prop('disabled', false).prop('readonly', false);
    this.element.removeAttr('disabled readonly').closest('.field').removeClass('is-disabled');
  },

  /**
   * Disables this component instance.
   */
  disable() {
    this.enable();
    this.element.prop('disabled', true);
  },

  /**
   * Returns true if the texarea is disabled
   * @returns {boolean} True if the elemet is disabled.
   */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Sets this component instance to "readonly"
   */
  readonly() {
    this.element.prop('readonly', true);
  },

  /**
   * Call whenever the plugin's settings are changed
   * @param {object} settings The settings object.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.destroy();
    this.init();

    if (this.element.data('validate')) {
      this.element.validate();
    }
  },

  /**
   * Returns max length if setting exists
   * @private
   * @returns {number} maxLength property in settings if exist otherwise maxlength attribute is returned if exist
   */
  getMaxLength() {
    if (this.settings.maxLength) {
      return this.settings.maxLength;
    }
    if (this.element.attr('maxlength')) {
      return parseInt(this.element.attr('maxlength'), 10);
    }

    return undefined;
  },

  /**
   * Destroys this component instance and unlinks it from its element.
   */
  destroy() {
    if (this.printarea && this.printarea.length) {
      this.printarea.remove();
    }
    if (this.counter && this.counter.length) {
      this.counter.remove();
    }
    this.element.off();
  },

  /**
   * Handle key events for functionality like counter and autoGrow.
   */
  handleEvents() {
    const self = this;

    this.element
      .on('paste.textarea', (e) => {
        const value = e.originalEvent.clipboardData.getData('text/plain');
        const isExtraLinebreaks = self.isChrome || self.isSafari;
        const whiteSpaceLength = (isExtraLinebreaks ? self.countLinebreaks(value) : 0);
        const length = value.length + (isExtraLinebreaks ? self.countLinebreaks(value) : 0);
        const max = self.getMaxLength();

        if (length > max) {
          const newValue = value.substring(0, max - whiteSpaceLength);
          self.element.val(newValue);
          self.updateCounter();
          e.preventDefault();
        }
      })
      .on('keyup.textarea', (e) => {
        const value = self.element.val();
        const isExtraLinebreaks = self.isChrome || self.isSafari;
        const length = value.length + (isExtraLinebreaks ? self.countLinebreaks(value) : 0);
        const max = self.getMaxLength();

        self.updateCounter();

        if (length >= max) {
          e.preventDefault();
          return false;
        }

        if (self.settings.autoGrow) {
          self.autoGrow();
        }

        return true;
      })
      .on('focus.textarea', () => {
        if (self.counter) {
          self.counter.addClass('focus');
        }
      })
      .on('updated.textarea', () => {
        self.updated();
      })
      .on('keypress.textarea', function (e) {
        const value = self.element.val();
        const isExtraLinebreaks = self.isChrome || self.isSafari;
        const length = value.length + (isExtraLinebreaks ? self.countLinebreaks(value) : 0);
        const max = self.getMaxLength();

        if ([97, 99, 118, 120].indexOf(e.which) > -1 && (e.metaKey || e.ctrlKey)) {
          self.updateCounter();
          return;
        }

        if (!self.isPrintable(e.which, e.shiftKey)) {
          return;
        }

        if (length >= max && !self.isSelected(this)) {
          e.preventDefault();
        }
      })
      .on('blur.textarea', () => {
        self.updateCounter();
        if (self.counter) {
          self.counter.removeClass('focus');
        }
      });
  }
};

export { Textarea, COMPONENT_NAME };
