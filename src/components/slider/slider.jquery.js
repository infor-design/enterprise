import { Slider, COMPONENT_NAME } from './slider';

/**
 * jQuery Component Wrapper for Slider
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.slider = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Slider(this, settings));
    }
  });
};
