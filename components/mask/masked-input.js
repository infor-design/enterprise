/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  /**
   * Default Masked Input field options
   */
  var DEFAULT_MASKED_INPUT_OPTIONS = {
    autocorrect: false,
    guide: false,
    maskAPI: window.Soho.Mask,
    keepCharacterPositions: false,
    pattern: undefined,
    patternOptions: undefined,
    placeholderChar: '_',
    pipe: undefined,
    process: undefined,
    processOnBlur: true,
    processOnInitialize: true
  };


  /**
   * @class {SohoMaskedInput}
   * Component Wrapper for input elements that gives them the ability to become "masked".
   *
   * @constructor
   * @param {HTMLInputElement} element - regular HTML Input Element (not wrapped with jQuery)
   * @param {SohoMaskedInputOptions} options
   * @returns {SohoMaskedInput}
   */
  function SohoMaskedInput(element, options) {
    this.element = element;

    if (!options) {
      options = {};
    }

    return this.init(options);
  }


  SohoMaskedInput.prototype = {

    /**
     * Initialization/things that need to be called on `updated()` in addition to initialization
     * @private
     */
    init: function(options) {
      // Define internal settings
      if (!this.settings) {
        this.settings = $.extend({}, DEFAULT_MASKED_INPUT_OPTIONS, options);
      } else {
        this.settings = $.extend({}, this.settings, options);
      }
      if (!this.settings.patternOptions) {
        this.settings.patternOptions = {};
      }

      // TODO: Deprecate legacy settings in v4.4.0, remove in v4.5.0
      this._replaceLegacySettings();

      var styleClasses = ['is-number-mask'];

      // If the 'process' setting is defined, connect a pre-defined Soho Mask/Pattern
      if (typeof this.settings.process === 'string') {
        switch(this.settings.process) {
          case 'number': {
            this.settings.pattern = window.Soho.masks.numberMask;
            this.element.classList.add('is-number-mask');
            break;
          }
          case 'date': {
            // Check for an instance of a Datepicker/Timepicker Component, and grab the date format
            var datepicker = $(this.element).data('datepicker');
            if ($.fn.datepicker && $(this.element).data('datepicker')) {
              this.settings.patternOptions.format = datepicker.settings.format;
            }

            this.settings.pattern = Soho.masks.dateMask;
            /*if (this.settings.autocorrect === true) {
              this.settings.pipe = window.Soho.masks.autocorrectedDatePipe;
            }
            */
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
     * Sets up events
     */
    handleEvents: function() {
      var self = this;

      // Handle all masking on the `input` event
      this.inputEventHandler = function() {
        return self.process();
      };
      this.element.addEventListener('input', this.inputEventHandler);

      // Handle processing on blur, if settings allow
      if (this.settings.processOnBlur) {
        this.blurEventHandler = function(e) {
          if (self.element.readOnly) {
            e.preventDefault();
            return false;
          }

          return self.process();
        };
        this.element.addEventListener('blur', this.blurEventHandler);
      }

      return this;
    },


    /**
     * Main Process for conforming a mask against the API.
     * @returns {boolean}
     */
    process: function() {
      // If no pattern's defined, act as if no mask component is present.
      if (!this.settings.pattern) {
        return true;
      }

      // Get a reference to the desired Mask API (by default, the one setup during Soho initialization).
      var api = this.mask;
      if (!api.pattern) {
        api.configure({
          pattern: this.settings.pattern,
          patternOptions: this.settings.patternOptions
        });
      }

      // Get all necessary bits of data from the input field.
      var rawValue = this.element.value;

      // Don't continue if there was no change to the input field's value
      if (rawValue === this.state.previousMaskResult) {
        return false;
      }

      var posBegin = this.element.selectionStart,
        posEnd = this.element.selectionEnd;

      // On Android, the first character inserted into a field is automatically selected when it shouldn't be.
      // This snippet fixes that problem.
      if (Soho.env.os.name === 'android' && this.state.previousMaskResult === '' && posBegin !== posEnd) {
        Soho.utils.safeSetSelection(rawValue.length, rawValue.length);
        posBegin = rawValue.length;
        posEnd = rawValue.length;
      }

      // Attempt to make the raw value safe to use.  If it's not in a viable format this will throw an error.
      rawValue = this._getSafeRawValue(rawValue);

      var opts = {
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
      var processed = api.process(rawValue, opts);

      // Use the piped value, if applicable.
      var finalValue = processed.pipedValue ? processed.pipedValue : processed.conformedValue;

      // Setup values for getting corrected caret position
      // TODO: Improve this by eliminating the need for an extra settings object.
      var adjustCaretOpts = {
        previousMaskResult: this.state.previousMaskResult || '',
        previousPlaceholder: this.state.previousPlaceholder || '',
        conformedValue: finalValue,
        placeholder: processed.placeholder,
        rawValue: rawValue,
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

      // Set the internal component state
      this.state.previousMaskResult = finalValue;
      this.state.previousPlaceholder = processed.placeholder;

      // Set state of the input field
      this.element.value = finalValue;
      Soho.utils.safeSetSelection(this.element, processed.caretPos);

      // Fire the 'write' event (backwards compat)
      // TODO: Deprecate in v4.4.0?
      $(this.element).trigger('write.mask', [processed.conformedValue]);

      // return event handler true/false
      return processed.maskResult;
    },


    /**
     * Gets the safe raw value of an input field
     * @private
     * @param {?} inputValue
     * @returns {String}
     */
    _getSafeRawValue: function getSafeRawValue(inputValue) {
      if (Soho.utils.isString(inputValue)) {
        return inputValue;
      } else if (Soho.utils.isNumber(inputValue)) {
        return String(inputValue);
      } else if (inputValue === undefined || inputValue === null) {
        return '';
      } else {
        throw new Error(
          'The "value" provided to the Masked Input needs to be a string or a number. The value ' +
          'received was:\n\n' + JSON.stringify(inputValue)
        );
      }
    },


    /**
     * Changes a bunch of "legacy" setting definitions into more apt names.  Additionally handles
     * the old data-attribute system that is still occasionally used.
     * @private
     */
    _replaceLegacySettings: function() {
      var modes = ['group', 'number', 'date', 'time'];

      //======================================
      // Deprecated as of v4.3.2
      //======================================
      // Order of operations when choosing pattern strings:
      // HTML5 'data-mask' attribute > Generic pattern string based on "type" attribute > nothing.
      //
      // if no pattern is provided in settings, use a pre-determined pattern based
      // on element type, or grab the pattern from the element itself.
      var html5DataMask = this.element.getAttribute('data-mask') || false;
      if (typeof html5DataMask === 'string' && html5DataMask.length) {
        this.settings.pattern = html5DataMask;
      }

      // If a "mode" is defined, special formatting rules may apply to this mask.
      // Otherwise, the standard single-character pattern match will take place.
      var html5DataMaskMode = this.element.getAttribute('data-mask-mode') || false;
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
          //this.settings.autocorrect = true;
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
        var html5DataThousands = this.element.getAttribute('data-thousands') || false;
        if (html5DataThousands) {
          this.settings.patternOptions.allowThousandsSeparator = (html5DataThousands === 'true');
        }

        if (typeof this.settings.pattern === 'string') {
          // If "negative" is defined, you can type the negative symbol in front of the number.
          // Will automatically set to "true" if a negative symbol is detected inside the mask.
          this.settings.patternOptions.allowNegative = this.settings.pattern.indexOf('-') !== -1;

          // The new masking algorithm requires an "integerLimit" defined to function.
          // This grabs the number of items currently inside this part of the mask, and sets it.
          var decimal = this.settings.patternOptions && this.settings.patternOptions.symbols && typeof this.settings.patternOptions.symbols.decimal === 'string' ?
            this.settings.patternOptions.symbols.decimal : '.';

          this.settings.patternOptions.integerLimit = this.settings.pattern.split(decimal)[0].replace(/[^#0]/g, '').length;
        }
      }

      // If 'mustComplete' is defined, you MUST complete the full mask, or the mask will revert to empty
      // once the field is blurred.
      var html5DataMustComplete = this.element.getAttribute('data-must-complete') || false;
      if (html5DataMustComplete) {
        this.settings.mustComplete = html5DataMustComplete;
      }

      // Backwards compat with the old "data-show-currency"
      var html5DataCurrency = this.element.getAttribute('data-show-currency');
      if (html5DataCurrency) {
        this.settings.showSymbol = 'currency';
      }

      // Handle the currency/percent symbols automatically
      var symbolSetting = this.settings.showSymbol,
        symbolTypes = ['currency', 'percent'],
        symbol;

      if (symbolTypes.indexOf(symbolSetting) > -1) {
        symbol = (function(s) {
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
        })(this.settings.showSymbol);

        // derive the location of the symbol
        var detectableSymbol = (symbolSetting === 'currency' ? '¤' : symbol.char),
          symbolRegex = new RegExp(detectableSymbol, 'g'),
          symbolWhitespaceRegex = new RegExp('[\s' + detectableSymbol + ']', 'g'),
          match = symbolWhitespaceRegex.exec(symbol.format),
          index = -1,
          placementType;

        if (match.length) {
          index = symbol.format.indexOf(match[0]);
          if (index === 0) {
            placementType = 'prefix';
          } else if (index > 0) {
            placementType = 'suffix';
          }
          this.settings.patternOptions[placementType] = match[0].replace(symbolRegex, symbol.char);
        }
      }
    },

    /**
     * Updates the component instance with new settings.
     */
    updated: function(options) {
      return this
        .teardown()
        .init(options);
    },

    /**
     * Tears down the current component instance
     */
    teardown: function() {
      this.element.removeEventListener('input', this.inputEventHandler);
      delete this.inputEventHandler;

      if (this.blurEventHandler) {
        this.element.removeEventListener('blur', this.blurEventHandler);
        delete this.blurEventHandler;
      }

      return this;
    }

  };

  /**
   * Attaches the Mask prototype as a component to Soho's base object.
   */
  window.Soho.components = window.Soho.components || {};
  window.Soho.components.MaskedInput = SohoMaskedInput;

  /**
   * Wrap as a jQuery component, and attach the factory function to $.fn
   */
  $.fn.maskedinput = function(options) {
    return this.each(function() {
      var instance = $.data(this, 'maskedinput');
      if (instance) {
        instance.updated(options);
      } else {
        instance = $.data(this, 'maskedinput', new SohoMaskedInput(this, options));
        instance.destroy = function() {
          this.teardown();
          $.removeData(this.element, 'maskedinput');
        };
      }
    });
  };

  /**
   * Backwards Compatibility with the old Mask
   */
  $.fn.mask = $.fn.maskedinput;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
