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
  var DEFAULT_MASKED_INPUT_OPTIONS = {};

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

    return this;
  }

  SohoMaskedInput.prototype = {

  };

  /**
   * Attaches the Mask prototype as a component to Soho's base object.
   */
  window.Soho.components.MaskedInput = SohoMaskedInput;

  /**
   * Wrap as a jQuery component, and attach the factory function to $.fn
   */
  $.fn.maskedinput = function(options) {
    return this.each(function() {
      var instance = $.data(this, 'mask');
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, 'mask', new SohoMaskedInput(this, options));
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
