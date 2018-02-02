import { About, COMPONENT_NAME } from './about';

/**
 * jQuery Component Wrapper for About.
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} Elements being acted on.
 */
$.fn.about = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new About(this, settings));
    }
  });
};
