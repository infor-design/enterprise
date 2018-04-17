import { CirclePager, COMPONENT_NAME } from './circlepager';

/**
 * jQuery Component Wrapper for CirclePager
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.circlepager = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new CirclePager(this, settings));
    }
  });
};
