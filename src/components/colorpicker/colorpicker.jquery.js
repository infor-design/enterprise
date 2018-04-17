import { ColorPicker, COMPONENT_NAME } from './colorpicker';

/**
 * jQuery Component Wrapper for Colorpicker
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.colorpicker = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ColorPicker(this, settings));
    }
  });
};
