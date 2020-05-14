import { Lookup, COMPONENT_NAME } from './lookup'; //eslint-disable-line

/**
 * jQuery Component Wrapper for Lookup
 * @param {object} settings The settings to apply.
 * @returns {jQuery[]} The jquery object for chaining.
 */
$.fn.lookup = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Lookup(this, settings));
    }
  });
};
