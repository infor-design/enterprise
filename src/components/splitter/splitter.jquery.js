import { Splitter, COMPONENT_NAME } from './splitter';

/**
 * jQuery Component Wrapper for Splitter
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.splitter = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Splitter(this, settings));
    }
  });
};
