import { Homepage, COMPONENT_NAME } from './homepage';

/**
 * jQuery Component Wrapper for Homepage
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.homepage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Homepage(this, settings));
    }
  });
};
