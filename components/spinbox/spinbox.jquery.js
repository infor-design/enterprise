import { Spinbox, COMPONENT_NAME } from './spinbox';

/**
 * jQuery Component Wrapper for Spinbox
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.spinbox = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Spinbox(this, settings));
    }
  });
};
