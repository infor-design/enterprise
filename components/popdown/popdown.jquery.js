import { Popdown, COMPONENT_NAME } from './popdown';

/**
 * jQuery component wrapper for Popdown
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery selector containing all elements
 */
$.fn.popdown = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Popdown(this, settings));
    }
  });
};
