import { MaskInput, COMPONENT_NAME } from './mask-input';

/**
 * Wrap Mask as a jQuery component, and attach the factory function to $.fn
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements to be acted on.
 */
$.fn.maskinput = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new MaskInput(this, settings));
      instance.destroy = function () {
        this.teardown();
        $.removeData(this.element, COMPONENT_NAME);
      };
    }
  });
};

/**
 * Backwards Compatibility with the old Mask
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements to be acted on.
 */
$.fn.maskedinput = $.fn.maskinput;
$.fn.mask = $.fn.maskinput;
