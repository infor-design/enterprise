import { Zoom, COMPONENT_NAME } from './zoom';

/**
 * jQuery Component Wrapper for Zoom
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.zoom = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Zoom(this, settings));
    }
  });
};
