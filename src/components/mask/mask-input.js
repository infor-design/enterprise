/* eslint-disable no-underscore-dangle, new-cap */
import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { masks } from './masks';
import { MaskAPI } from './mask-api';

// The name of this component
const COMPONENT_NAME = 'mask';

/**
 * Component Wrapper for input elements that gives them the ability to become "masked".
 * @class MaskInput
 * @constructor
 * @param {HTMLInputElement} element regular HTML Input Element (not wrapped with jQuery)
 * @param {MaskInputOptions} [settings] incoming settings
 *
 * @param {object} [settings.definitions=false] if defined, passes additional string-based pattern match "types".
 * @param {boolean} [settings.guide=false] if true, causes a guide to show inside the input field, represented by the placeholder,
 *  that demonstrates how the mask can be filled in.
 * @param {boolean} [settings.keepCharacterPositions=false] if defined alongside of `settings.guide`, will allow indiviual characters
 *  to be removed from the mask without moving the positions of other characters that have been written into the field.
 *  Works well with things like credit card or phone numbers, which have sections that are separate from each other.
 * @param {array|function|string} [settings.pattern] the pattern that is used by the mask for determining input to keep or throw out.
 *  Arrays of strings representing individual characters, and regex matching individual characters, is the perferred way of supplying a pattern.
 *  For some `settings.process` types (date/time/number), a function that dynamically generates a mask is automatically used.
 *  It's also possible to define a custom mask function and supply it here. The legacy string style is also supported.
 * @param {object} [settings.patternOptions={}] If using a function to define `settings.pattern`, any options that must be passed
 *  to the masking function can be supplied in this object.
 * @param {string} [settings.patternOptions.format] [date/time masks only] contains a basic date format string that will be used to properly display a date mask.
 * @param {string} [settings.patternOptions.prefix] [number masks only] will be automatically prepended to the beginning of the masked value, but will not be counted as part of the masked value.
 * @param {string} [settings.patternOptions.suffix] [number masks only] will be automatically appended to the end of the masked value, but will not be counted as part of the masked value.
 * @param {boolean} [settings.patternOptions.allowThousandsSeparator] [number masks only] If true, displays a localized thousands separator in the masked value
 * @param {string} [settings.patternOptions.locale] [number/date/time masks] will cause formatting to occur against a particular Locale culture.
 * @param {object} [settings.patternOptions.symbols] [number masks only] contains default, localized special characters used in numbers
 * @param {string} [settings.patternOptions.symbols.currency] [number masks only]
 * @param {string} [settings.patternOptions.symbols.decimal] [number masks only]
 * @param {string} [settings.patternOptions.symbols.negative] [number masks only]
 * @param {string} [settings.patternOptions.symbols.thousands] [number masks only]
 * @param {boolean} [settings.patternOptions.allowDecimal] [number masks only] allows the entry of a decimal point into a number mask with a decimal limit defined (negated when using `requireDecimal` to force its placement)
 * @param {boolean} [settings.patternOptions.requireDecimal] [number masks only] forces the placement of a decimal point in a number mask with a decimal limit defined.
 * @param {number} [settings.patternOptions.decimalLimit] [number masks only] defines the number of characters allowed after the decimal point.
 * @param {number} [settings.patternOptions.integerLimit] [number masks only] defines the number of characters allowed before the decimal point.
 * @param {boolean} [settings.patternOptions.allowNegative] [number masks only] allows a number to be negative (adds/retains a "minus" symbol at the beginning of the value)
 * @param {boolean} [settings.patternOptions.allowLeadingZeros] [number masks only] allows a zero be placed before a decimal or other numbers.
 * @param {string} [settings.placeholderChar='_'] If using the `settings.guide`, will be used as the placeholder
 *  for characters that are not yet typed.
 * @param {function} [settings.pipe] provides a way of adjusting the masked content, caret position,
 *  etc after the input field has been processed by the mask API.
 * @param {string} [settings.process=undefined] can be defined as a quick way to create certain complex masks.  Defaults to the regular pattern mask,
 *  but can automatically configure the field for "date", "time", and "number"
 * @param {boolean} [settings.processOnBlur=true] if defined, causes the mask API to process this input field whenever it becomes blurred.
 * @param {boolean} [settings.processOnInitialize=true] if defined, causes the mask API to process this input field when the component is initialized.
 * @returns {MaskInput} component instance
 */
const DEFAULT_MASK_INPUT_OPTIONS = {
  definitions: undefined,
  guide: false,
  keepCharacterPositions: false,
  maskAPI: MaskAPI,
  locale: null,
  pattern: undefined,
  patternOptions: {},
  placeholderChar: '_',
  pipe: undefined,
  process: undefined,
  processOnBlur: true,
  processOnInitialize: true
};

function MaskInput(element, settings) {
  this.element = element;
  this.settings = utils.mergeSettings(this.element, settings, DEFAULT_MASK_INPUT_OPTIONS);

  return this.init();
}

MaskInput.prototype = {

  /**
   * @returns {string} representing the Masked HTMLInputElement's type
   */
  get type() {
    return this.element.type;
  },

  /**
   * Initialization/things that need to be called on `updated()` in addition to initialization
   * @private
   * @returns {void}
   */
  init() {
    this.setLocale();
  },

  build() {
    // TODO: Deprecate legacy settings in v4.4.0, remove in v4.5.0
    this._replaceLegacySettings();

    const styleClasses = ['is-number-mask'];

    // If the 'process' setting is defined, connect a pre-defined Soho Mask/Pattern
    if (typeof this.settings.process === 'string') {
      if (!this.settings.patternOptions.locale) {
        this.settings.patternOptions.locale = this.settings.locale;
      }

      switch (this.settings.process) {
        case 'number': {
          this.settings.pattern = masks.numberMask;
          this.element.classList.add('is-number-mask');
          break;
        }
        case 'date': {
          // Check for an instance of a Datepicker/Timepicker Component, and grab the date format
          const datepicker = $(this.element).data('datepicker');
          if ($.fn.datepicker && $(this.element).data('datepicker')) {
            if (!this.settings.patternOptions && !this.settings.patternOptions.format) {
              this.settings.patternOptions.format = datepicker.settings.dateFormat;
            }
          }
          this.settings.pattern = masks.dateMask;
          break;
        }
        case 'rangeDate': {
          const datepicker = $(this.element).data('datepicker');
          if ($.fn.datepicker && $(this.element).data('datepicker')) {
            this.settings.patternOptions.format = datepicker.settings.dateFormat;
          }
          this.settings.pattern = masks.rangeDateMask;
          break;
        }
        default: {
          this.element.classList.remove(styleClasses.join(' '));
          break;
        }
      }
    }

    this.mask = new this.settings.maskAPI(this.settings);
    this.state = {
      previousMaskResult: ''
    };

    this.handleEvents();

    if (this.settings.processOnInitialize) {
      this.process();
    }

    return this;
  },

  /**
   * Set current locale to be used.
   * @private
   * @returns {void}
   */
  setLocale() {
    this.locale = Locale.currentLocale;
    if (this.settings.locale) {
      Locale.getLocale(this.settings.locale).done((locale) => {
        this.locale = Locale.cultures[locale];
        this.build();
      });
    } else {
      this.build();
    }
  },

  /**
   * Sets up events
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    // On change event
    this.changeEventHandler = function () {
      self.hasTriggeredChangeEvent = true;
    };
    this.element.addEventListener('change', this.changeEventHandler);

    // Store an initial value on focus
    this.focusEventHandler = function () {
      self.state.previousMaskResult = self.element.value;
      self.state.initialValue = self.element.value;
    };
    this.element.addEventListener('focus', this.focusEventHandler);

    // Handle all masking on the `input` event
    this.inputEventHandler = function (e) {
      self.hasTriggeredChangeEvent = false;
      return self.process(e);
    };
    this.element.addEventListener('input', this.inputEventHandler);

    // Remove an initial value from the state object on blur
    this.blurEventHandler = function (e) {
      if (this.processingJustHappenedOnInput === true) {
        e.preventDefault();
        return false;
      }

      // Handle mask processing on blur, if settings allow.  Otherwise, return out.
      if (self.settings.processOnBlur) {
        if (self.element.readOnly) {
          e.preventDefault();
          return false;
        }

        // in IE11 or Edge, change event doesn't fire for some unknown reason.
        // Added this for backwards compatility with this OS/Browser combo.
        // See http://jira.infor.com/browse/SOHO-6895
        if (self._hasChangedValue() && (self._isEdgeIE() || !self.hasTriggeredChangeEvent)) {
          $(self.element).trigger('change');
          self.hasTriggeredChangeEvent = true;
        }
      }

      delete self.state.initialValue;
      return self.process(e);
    };
    this.element.addEventListener('blur', this.blurEventHandler);

    return this;
  },

  /**
   * Main Process for conforming a mask against the API.
   * @param {jQuery.Event} e the input/blur event
   * @returns {boolean} whether or not the mask process was successful
   */
  process(e) {
    // If no pattern's defined, act as if no mask component is present.
    if (!this.settings.pattern) {
      return true;
    }

    // Get a reference to the desired Mask API (by default, the one setup
    // during Soho initialization).
    const api = this.mask;
    const patternOptions = this.settings.patternOptions || {};

    let definedDecimal = '.';
    if (this.locale && this.locale.data && this.locale.data.numbers &&
      this.locale.data.numbers.decimal) {
      definedDecimal = this.locale.data.numbers.decimal;
    }
    if (patternOptions.symbols && patternOptions.symbols.decimal) {
      definedDecimal = patternOptions.symbols.decimal;
    }

    if (!api.pattern) {
      api.configure({
        pattern: this.settings.pattern,
        patternOptions
      });
    }

    // Get all necessary bits of data from the input field.
    let rawValue = this.element.value;
    let numberInputCorrections = false;

    if (e && e.type === 'input') {
      // Number input fields operate differently than text-based input fields.
      // If we're using a number input and the rawValue detected is empty, but the field contents are not,
      // it's possible that a double decimal has been entered and not properly detected
      // at the time the input event occurred.
      if (e.inputType === 'insertText') {
        if (rawValue === '') {
          rawValue = this.state.previousMaskResult;
          numberInputCorrections = true;
        } else if (e.data === definedDecimal && rawValue.indexOf(definedDecimal) > -1) {
          numberInputCorrections = true;
        }
      }
    }

    if (rawValue === this.state.previousMaskResult) {
      if (numberInputCorrections) {
        this.element.value = '';
        this.element.value = `${rawValue}`;
      }
      return false;
    }

    let posBegin = this.element.selectionStart || 0;
    let posEnd = this.element.selectionEnd || 0;

    // On Android, the first character inserted into a field is automatically
    // selected when it shouldn't be. This snippet fixes that problem.
    if (this._isAndroid() && this.state.previousMaskResult === '' && posBegin !== posEnd) {
      utils.safeSetSelection(rawValue.length, rawValue.length);
      posBegin = rawValue.length;
      posEnd = rawValue.length;
    }

    // Attempt to make the raw value safe to use.  If it's not in a viable format
    // this will throw an error.
    rawValue = this._getSafeRawValue(rawValue);

    const opts = {
      guide: this.settings.guide,
      keepCharacterPositions: this.settings.keepCharacterPositions,
      patternOptions: this.settings.patternOptions,
      placeholderChar: this.settings.placeholderChar,
      previousMaskResult: this.state.previousMaskResult,
      selection: {
        start: posBegin,
        end: posEnd
      }
    };

    if (posBegin !== posEnd) {
      opts.selection.contents = rawValue.substring(posBegin, posEnd);
    }
    if (typeof this.settings.pipe === 'function') {
      opts.pipe = this.settings.pipe;
    }

    // Perform the mask processing.
    const processed = api.process(rawValue, opts);
    if (!processed.maskResult) {
      // Error during masking.  Simply return out and don't mask this field.
      return processed.maskResult;
    }

    // Use the piped value, if applicable.
    let finalValue = processed.pipedValue ? processed.pipedValue : processed.conformedValue;
    if (finalValue !== '' && patternOptions && patternOptions.suffix && finalValue.indexOf(patternOptions.suffix) < 0) {
      finalValue += this.settings.patternOptions.suffix;
    }

    if (opts.patternOptions && opts.patternOptions.delimeter &&
      finalValue && finalValue !== rawValue) {
      rawValue = finalValue;
    }

    // Setup values for getting corrected caret position
    // TODO: Improve this by eliminating the need for an extra settings object.
    const adjustCaretOpts = {
      previousMaskResult: this.state.previousMaskResult || '',
      previousPlaceholder: this.state.previousPlaceholder || '',
      conformedValue: finalValue,
      placeholder: processed.placeholder,
      rawValue,
      caretPos: processed.caretPos,
      placeholderChar: this.settings.placeholderChar
    };
    if (processed.pipedCharIndexes) {
      adjustCaretOpts.indexesOfPipedChars = processed.pipedCharIndexes;
    }
    if (processed.caretTrapIndexes) {
      adjustCaretOpts.caretTrapIndexes = processed.caretTrapIndexes;
    }

    // Get a corrected caret position.
    processed.caretPos = api.adjustCaretPosition(adjustCaretOpts);

    const previousValue = this.state.previousMaskResult;

    // Set the internal component state
    this.state.previousMaskResult = finalValue;
    this.state.previousPlaceholder = processed.placeholder;

    // Set state of the input field
    if (env.browser.name === 'firefox') {
      if (this.element.value !== finalValue) {
        this.element.value = finalValue;
      }
    } else {
      this.element.value = finalValue;
    }
    utils.safeSetSelection(this.element, processed.caretPos);

    // Return out if there was no visible change in the conformed result
    // (causes state not to change, events not to fire)
    if (previousValue === finalValue) {
      return false;
    }

    /**
     * Fire the 'write' event
     * @event write
     * @memberof MaskInput
     * @param {jQuery.Event} e the event object
     * @param {string} finalValue the final, masked value
     */
    $(this.element).trigger('write.mask', [finalValue]);

    // return event handler true/false
    return processed.maskResult;
  },

  /**
   * Obfuscates the operating system/browser check from Soho.env into internal methods
   * NOTE: Helps compartmentalize us from using calls to global "Soho" object until we can
   * properly setup import/export for unit tests.
   * TODO: deprecate eventually (v4.4.0?)
   * @private
   * @returns {boolean} whether or not the current device is running the Android OS.
   */
  _isAndroid() {
    const os = env && env.os && env.os.name ? env.os.name : '';
    return os === 'android';
  },

  /**
   * Determine if browser is IE11 or Edge
   * @private
   * @returns {boolean} whether or not the current device is running Windows 7
   *  using the IE11 browser.
   */
  _isEdgeIE() {
    const browser = env && env.browser && env.browser.name ? env.browser.name : '';
    return browser === 'ie' || browser === 'edge';
  },

  /**
   * Checks the current value of this masked input against it's stored "previousMaskResult"
   *  state to see if the value changed.
   * @private
   * @returns {boolean} whether or not the previous mask state matches the current one.
   */
  _hasChangedValue() {
    if ((!this.state || !this.state.previousMaskResult) && this.state.previousMaskResult !== '') {
      return true;
    }

    return this.state.previousMaskResult !== this.state.initialValue;
  },

  /**
   * Gets the safe raw value of an input field
   * @private
   * @param {?} inputValue the original value that came from an input field or other source
   * @returns {string} the string-ified version of the original value
   */
  _getSafeRawValue: function getSafeRawValue(inputValue) {
    if (utils.isString(inputValue)) {
      return inputValue;
    }
    if (utils.isNumber(inputValue)) {
      return String(inputValue);
    }
    if (inputValue === undefined || inputValue === null) {
      return '';
    }
    throw new Error(`${'The "value" provided to the Masked Input needs to be a string or a number. The value ' +
        'received was:\n\n'}${JSON.stringify(inputValue)}`);
  },

  /**
   * Changes a bunch of "legacy" setting definitions into more apt names.  Additionally handles
   * the old data-attribute system that is still occasionally used.
   * @private
   * @deprecated as of v4.4.0.
   * @returns {void}
   */
  _replaceLegacySettings() {
    const modes = ['group', 'number', 'date', 'time'];

    // pre-set a bunch of objects if they don't already exist
    this.settings.patternOptions = this.settings.patternOptions || {};
    this.settings.patternOptions.symbols = this.settings.patternOptions.symbols || {};

    //= =====================================
    // Deprecated as of v4.3.2
    //= =====================================
    // Order of operations when choosing pattern strings:
    // HTML5 'data-mask' attribute > Generic pattern string based on "type" attribute > nothing.
    //
    // if no pattern is provided in settings, use a pre-determined pattern based
    // on element type, or grab the pattern from the element itself.
    const html5DataMask = this.element.getAttribute('data-mask') || false;
    if (typeof html5DataMask === 'string' && html5DataMask.length) {
      this.settings.pattern = html5DataMask;
    }

    // If a "mode" is defined, special formatting rules may apply to this mask.
    // Otherwise, the standard single-character pattern match will take place.
    const html5DataMaskMode = this.element.getAttribute('data-mask-mode') || false;
    if (html5DataMaskMode && modes.indexOf(html5DataMaskMode) > -1) {
      this.settings.mode = html5DataMaskMode;
    }

    // map deprecated "mode" setting to "process".  Triggers additional settings in
    // some cases.
    if (this.settings.mode) {
      if (modes.indexOf(this.settings.mode) === -1) {
        delete this.settings.mode;
      }

      if (this.settings.mode === 'group') {
        this.settings.process = undefined;
      } else if (this.settings.mode === 'date') {
        this.settings.process = 'date';
      } else {
        this.settings.process = this.settings.mode;
      }

      delete this.settings.mode;
    }

    if (this.settings.process === 'number') {
      // map deprecated "thousandsSeparator" to "patternOptions.allowThousandsSeparator"
      if (this.settings.thousandsSeparator) {
        this.settings.patternOptions.allowThousandsSeparator = this.settings.thousandsSeparator;
        delete this.settings.thousandsSeparator;
      }

      // If "thousands" is defined, the thousands separator for numbers (comma or decimal, based on
      // localization) will be inserted wherever necessary during typing. Will automatically set to
      // "true" if the localized thousands separator is detected inside the mask.
      const html5DataThousands = this.element.getAttribute('data-thousands') || false;
      if (html5DataThousands) {
        this.settings.patternOptions.allowThousandsSeparator = (html5DataThousands === 'true');
      }

      if (typeof this.settings.pattern === 'string') {
        // If "negative" is defined, you can type the negative symbol in front of the number.
        // Will automatically set to "true" if a negative symbol is detected inside the mask.
        const allowNegative = this.settings.pattern.indexOf('-') !== -1;
        if (allowNegative) {
          this.settings.patternOptions.allowNegative = allowNegative;
          this.settings.patternOptions.symbols.negative = '-';
        }

        // Detect the thousands separator and see if we use it.
        const group = Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',';
        const thousandsSep = this.settings.patternOptions && this.settings.patternOptions.symbols &&
          this.settings.patternOptions.symbols.thousands ?
          this.settings.patternOptions.symbols.thousands :
          group;

        const hasThousandsInPattern = this.settings.pattern.indexOf(thousandsSep) !== -1;
        this.settings.patternOptions.allowThousandsSeparator = hasThousandsInPattern;
        if (hasThousandsInPattern) {
          this.settings.patternOptions.symbols.thousands = thousandsSep;
        }

        // The new masking algorithm requires an "integerLimit" defined to function.
        // This grabs the number of items currently inside this part of the mask, and sets it.
        const decimal = typeof this.settings.patternOptions.symbols.decimal === 'string' ?
          this.settings.patternOptions.symbols.decimal : '.';
        const decimalParts = this.settings.pattern.split(decimal);

        this.settings.patternOptions.integerLimit = decimalParts[0].replace(/[^#0]/g, '').length;

        if (decimalParts[1]) {
          this.settings.patternOptions.allowDecimal = true;
          this.settings.patternOptions.decimalLimit = decimalParts[1].toString().replace(/[^#0]/g, '').length;
          if (!this.settings.patternOptions.symbols.decimal) {
            this.settings.patternOptions.symbols.decimal = decimal;
          }
        }
      }
    }

    // If 'mustComplete' is defined, you MUST complete the full mask, or the mask
    // will revert to empty once the field is blurred.
    const html5DataMustComplete = this.element.getAttribute('data-must-complete') || false;
    if (html5DataMustComplete) {
      this.settings.mustComplete = html5DataMustComplete;
    }

    // Backwards compat with the old "data-show-currency"
    const html5DataCurrency = this.element.getAttribute('data-show-currency');
    if (html5DataCurrency) {
      this.settings.showSymbol = 'currency';
    }

    // Handle the currency/percent symbols automatically
    const symbolSetting = this.settings.showSymbol;
    const symbolTypes = ['currency', 'percent'];
    let symbol;

    if (symbolTypes.indexOf(symbolSetting) > -1) {
      symbol = (function (s) {
        if (s === 'currency') {
          return {
            char: Locale.currentLocale.data.currencySign,
            format: Locale.currentLocale.data.currencyFormat
          };
        }
        if (s === 'percent') {
          return {
            char: Locale.currentLocale.data.numbers.percentSign,
            format: Locale.currentLocale.data.numbers.percentFormat
          };
        }
        return {};
      }(this.settings.showSymbol));

      // derive the location of the symbol
      const detectableSymbol = (symbolSetting === 'currency' ? '¤' : symbol.char);
      const symbolRegex = new RegExp(detectableSymbol, 'g');
      const match = symbolRegex.exec(symbol.format);
      let replacementRegex;
      let symbolWithWhitespace;
      let index = -1;
      let placementType;

      if (match && match.length) {
        index = symbol.format.indexOf(match[0]);
        if (index === 0) {
          placementType = 'prefix';
          replacementRegex = new RegExp(`[^${detectableSymbol}]\\S`, 'g');
          symbolWithWhitespace = symbol.format.replace(replacementRegex, '');
        } else if (index > 0) {
          placementType = 'suffix';
          replacementRegex = new RegExp(`\\S[^${detectableSymbol}]`, 'g');

          while (/\s/.test(symbol.format.charAt(index - 1))) {
            --index;
          }
          symbolWithWhitespace = symbol.format.substr(index).replace(replacementRegex, '');
        }

        if (symbolSetting === 'currency') {
          symbolWithWhitespace = symbolWithWhitespace.replace('¤', symbol.char);
        }
        this.settings.patternOptions[placementType] = symbolWithWhitespace;
      }
    }
  },

  /**
   * Updates the component instance with new settings.
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Tears down the current component instance
   * @returns {this} component instance
   */
  teardown() {
    if (this.settings.process === 'number') {
      this.element.classList.remove('is-number-mask');
    }
    this.element.removeEventListener('focus', this.focusEventHandler);
    delete this.focusEventHandler;

    this.element.removeEventListener('input', this.inputEventHandler);
    delete this.inputEventHandler;

    if (this.blurEventHandler) {
      this.element.removeEventListener('blur', this.blurEventHandler);
      delete this.blurEventHandler;
    }

    if (this.changeEventHandler) {
      this.element.removeEventListener('change', this.changeEventHandler);
      delete this.changeEventHandler;
    }

    return this;
  }
};

export { MaskInput, COMPONENT_NAME };
