import { SohoMaskedInput, COMPONENT_NAME } from './masked-input';


/**
 * Wrap as a jQuery component, and attach the factory function to $.fn
 */
$.fn.maskedinput = function(options) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(options);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SohoMaskedInput(this, options));
      instance.destroy = function() {
        this.teardown();
        $.removeData(this.element, COMPONENT_NAME);
      };
    }
  });
};

/**
 * Backwards Compatibility with the old Mask
 */
$.fn.mask = $.fn.maskedinput;
