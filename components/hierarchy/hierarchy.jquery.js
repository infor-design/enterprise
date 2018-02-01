import { Hierarchy, COMPONENT_NAME } from './hierarchy';

/**
 * jQuery Component Wrapper for Hierarchy
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.hierarchy = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Hierarchy(this, settings));
    }
  });
};
