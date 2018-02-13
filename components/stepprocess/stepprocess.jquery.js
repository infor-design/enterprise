import { Stepprocess, COMPONENT_NAME } from './stepprocess';

/**
 * jQuery Component Wrapper for Stepprocess
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.stepprocess = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Stepprocess(this, settings));
    }
  });
};
