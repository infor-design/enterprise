import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Name of this component
const COMPONENT_NAME = 'textarea';

/**
* @namespace
* @property {boolean} autoGrow Will automatically expand the text area to fit the contents.
* @property {boolean} autoGrowAnimate Will animate the text area growing.
* @property {integer} autoGrowAnimateSpeed The speed of the animation.
* @property {boolean} characterCounter Displays a counter that counts down from the maximum
* length allowed.
* @property {boolean} printable Determines whether or not the text area can be displayed on a
* printed page.
* @property {null|String} charRemainingText  Text that will be used in place of the "remaining"
* text.
* @property {null|String} charMaxText  Text that will be used in place of the "Max" text.
*/
const TEXTAREA_DEFAULTS = {
  autoGrow: false,
  autoGrowAnimate: true,
  autoGrowAnimateSpeed: 200,
  characterCounter: true,
  printable: true,
  charRemainingText: null,
  charMaxText: null
};

/**
* The Textarea Component wraps a standard HTML Textarea element and provides additional features.
* @class Textarea
* @param {object} element The component element.
* @param {object} settings The component settings.
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
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isSafari = (
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1 &&
      navigator.userAgent.indexOf('Android') === -1
    );

    this.element.addClass(this.element.is('.textarea-xs') ? 'input-xs' : //eslint-disable-line
      this.element.is('.textarea-sm') ? 'input-sm' : //eslint-disable-line
        this.element.is('.textarea-lg') ? 'input-lg' : ''); //eslint-disable-line

    if (this.settings.characterCounter && this.element.attr('maxlength')) {
      this.counter = $('<span class="textarea-wordcount">Chars Left..</span>').insertAfter(this.element);
    }
    if (this.settings.printable) {
      this.printarea = $('<span class="textarea-print"></span>').insertBefore(this.element);
    }

    if (this.element.hasClass('autogrow')) {
      this.settings.autoGrow = true;
    }

    if (this.settings.autoGrow && this.element.length) {
      this.element.css('overflow', 'hidden');
      this.handleResize(this);
    }

    this.handleEvents();
    this.updateCounter(this);
  },

  /**
   * Determines if the text is selected.
   * @param  {object}  input The input dom element (jQuery)
   * @returns {boolean} True if the text is selected in the input.
   */
  isSelected(input) {
    if (typeof input.selectionStart === 'number') {
      return input.selectionStart === 0 && input.selectionEnd === input.value.length;
    } else if (typeof document.selection !== 'undefined') {
      return document.selection.createRange().text === input.value;
    }
    return false;
  },

  /**
   * Checks a keycode value and determines if it belongs to a printable character.
   * @param {number} keycode - a number representing an ASCII keycode value
   * @returns {boolean} Returns true if the key is a printable one.
   */
  isPrintable(keycode) {
    const valid =
      (keycode > 47 && keycode < 58) || // number keys
      (keycode > 64 && keycode < 91) || // letter keys
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223); // [\]' (in order)
    return valid;
  },

  /**
  * Resizes the texarea based on the content.
  * @private
  * @param {obkect} self The textaarea api
  * @param {event} e The resive event object
  */
  handleResize(self, e) {
    const value = self.element.val();
    const oldHeight = self.element.innerHeight();
    let newHeight = self.element.get(0).scrollHeight;
    const minHeight = self.element.data('autogrow-start-height') || 0;
    let clone;

    if (oldHeight < newHeight) {
      self.scrollTop = 0;

      if (self.settings.autoGrowAnimate) {
        self.element.stop().animate({ height: newHeight }, self.settings.autoGrowAnimateSpeed);
      } else {
        self.element.innerHeight(newHeight);
      }
    } else if (!e || e.which === 8 || e.which === 46 || (e.ctrlKey && e.which === 88)) {
      if (oldHeight > minHeight) {
        clone = self.element.clone()
          .addClass('clone')
          .css({ position: 'absolute', zIndex: -10, height: '' })
          .val(value);

        self.element.after(clone);
        do {
          newHeight = clone[0].scrollHeight - 1;
          clone.innerHeight(newHeight);
        } while (newHeight === clone[0].scrollHeight);

        newHeight++;
        clone.remove();

        if (newHeight < minHeight) {
          newHeight = minHeight;
        }

        if (oldHeight > newHeight && self.settings.autoGrowAnimate) {
          self.element.stop().animate({ height: newHeight }, self.settings.autoGrowAnimateSpeed);
        } else {
          self.element.innerHeight(newHeight);
        }
      } else {
        self.element.innerHeight(minHeight);
      }
    }
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
  updateCounter(self) {
    const value = self.element.val();
    const isExtraLinebreaks = this.isChrome || this.isSafari;
    const length = value.length + (isExtraLinebreaks ? this.countLinebreaks(value) : 0);
    const max = parseInt(self.element.attr('maxlength'), 10);
    const remaining = (parseInt(max, 10) - length);
    let text = (self.settings.charRemainingText ? self.settings.charRemainingText : //eslint-disable-line
      (Locale.translate('CharactersLeft') === 'CharactersLeft' ? 'Characters Left' :
        Locale.translate('CharactersLeft'))).replace('{0}', remaining.toString());

    if (self.counter) {
      if (length === max) {
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

    if (self.printarea) {
      self.printarea.text(self.element.val());
    }
  },

  /**
   * Enables this component instance.
   */
  enable() {
    this.element.prop('disabled', false).prop('readonly', false);
  },

  /**
   * Disables this component instance.
   */
  disable() {
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
  },

  /**
   * Destroys this component instance and unlinks it from its element.
   */
  destroy() {
    $.removeData(this.element[0], COMPONENT_NAME);
    if (this.printarea && this.printarea.length) {
      this.printarea.remove();
    }
    if (this.counter && this.counter.length) {
      this.counter.remove();
    }
    this.element.off('keyup.textarea, focus.textarea, updated.dropdown, keypress.textarea, blur.textarea');
  },

  /**
   *  This component fires the following events.
   *
   * @fires Textarea#events
   * @param {object} keyup  Fires when the button is clicked (if enabled).
   * @param {object} focus  Fires when the menu is focused.
   * @param {object} keypress  &nbsp;-&nbsp;
   * @param {object} blur  &nbsp;-&nbsp;
   */
  handleEvents() {
    const self = this;

    this.element.on('keyup.textarea', (e) => {
      self.updateCounter(self);

      if (self.settings.autoGrow) {
        self.handleResize(self, e);
      }
    }).on('focus.textarea', () => {
      if (self.counter) {
        self.counter.addClass('focus');
      }
    }).on('updated.dropdown', () => {
      self.updated();
    }).on('keypress.textarea', function (e) {
      const length = self.element.val().length;
      const max = self.element.attr('maxlength');

      if ([97, 99, 118, 120].indexOf(e.which) > -1 && (e.metaKey || e.ctrlKey)) {
        self.updateCounter(self);
        return;
      }

      if (!self.isPrintable(e.which)) {
        return;
      }

      if (length >= max && !self.isSelected(this)) {
        e.preventDefault();
      }
    })
      .on('blur.textarea', () => {
        self.updateCounter(self);
        if (self.counter) {
          self.counter.removeClass('focus');
        }
      });
  }
};

export { Textarea, COMPONENT_NAME };
