import { Drag, COMPONENT_NAME } from './drag';

/**
 * jQuery Component Wrapper for Drag
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.drag = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Drag(this, settings));
    }
  });
};
