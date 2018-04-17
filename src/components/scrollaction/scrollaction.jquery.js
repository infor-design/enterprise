import { ScrollAction, COMPONENT_NAME } from './scrollaction';

/**
 * jQuery Component Wrapper for ScrollAction
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.scrollaction = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ScrollAction(this, settings));
    }
  });
};
