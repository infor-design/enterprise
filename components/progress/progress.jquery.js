import { Progress, COMPONENT_NAME } from './progress';

/**
 * jQuery Component Wrapper for Progress
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.progress = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Progress(this, settings));
    }
  });
};
