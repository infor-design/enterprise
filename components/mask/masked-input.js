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
  const DEFAULT_MASKED_INPUT_OPTIONS = {
    maskAPI: window.Soho.Mask,
    pattern: undefined
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

    if (!this.settings) {
      this.settings = $.extend({}, DEFAULT_MASKED_INPUT_OPTIONS, options);
    } else {
      this.settings = $.extend({}, this.settings, options);
    }

    this.handleEvents();

    return this;
  }


  SohoMaskedInput.prototype = {

    /**
     * Sets up events
     */
    handleEvents: function() {
      var self = this;

      this.element.addEventListener('keypress', function(e) {
        return self.handleKeypress(e);
      });

    },

    /**
     * Handler for masked input `keypress` events
     * @param {Event} e - keypress event
     * @listens module:this~event:keypress
     * @returns {boolean}
     */
    handleKeypress: function(e) {
      if (false) {
        e.preventDefault();
        return false;
      }

      // If no pattern's defined, act as if no mask component is present.
      if (!this.settings.pattern) {
        return true;
      }

      // Get a reference to the desired Mask API (by default, the one setup during Soho initialization).
      var api = this.settings.maskAPI;
      if (api.pattern !== this.settings.pattern) {
        api.configure({
          pattern: this.settings.pattern
        });
      }

      // Get all necessary bits of data from the input field.
      var typedChar = this._convertCharacterFromEvent(e),
        str = this.element.value,
        posBegin = this.element.selectionStart,
        posEnd = this.element.selectionEnd,
        opts = {
          typedChar: typedChar,
          selection: {
            start: posBegin,
            end: posEnd
          }
        };

      if (posBegin !== posEnd) {
        opts.selection.contents = str.substring(posBegin, posEnd);
      }

      debugger;

      // Perform the mask processing.
      var processed = api.process(str, opts);

      // Final catch that allows for string returns from the processing algorithm to be considered true.
      if (typeof processed === 'string') {
        processed = {
          str: processed,
          result: true
        };
      }

      // Prevent the event if masking failed for some reason.
      if (!processed.result) {
        e.preventDefault();
      }

      // return event handler true/false
      return processed.result;
    },

    /**
     * Converts ASCII keycodes from an event object into Character Codes.
     * @private
     * @param {Event} e
     * @returns {String}
     */
    _convertCharacterFromEvent: function(e) {
      return Soho.utils.actualChar(e);
    },

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
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, 'maskedinput', new SohoMaskedInput(this, options));
      }
    });
  };

  /**
   * Backwards Compatibility with the old Mask
   */
  //$.fn.mask = $.fn.maskedinput;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
