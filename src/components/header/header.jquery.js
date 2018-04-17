import { Header, COMPONENT_NAME } from './header';

/**
 * jQuery Component Wrapper for Header
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.header = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Header(this, settings));
    }
  });
};
