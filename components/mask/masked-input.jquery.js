import { SohoMaskedInput, COMPONENT_NAME } from './masked-input';

/**
 * Wrap Mask as a jQuery component, and attach the factory function to $.fn
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements to be acted on.
 */
$.fn.maskedinput = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SohoMaskedInput(this, settings));
      instance.destroy = function () {
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
