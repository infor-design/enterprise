import { Treemap, COMPONENT_NAME } from './treemap';

/**
 * jQuery Component Wrapper for Tremmap
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.treemap = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Treemap(this, settings));
    }
  });
};
