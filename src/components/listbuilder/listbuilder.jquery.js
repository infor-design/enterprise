import { ListBuilder, COMPONENT_NAME } from './listbuilder';

/**
 * jQuery Component Wrapper for ListBuilder
 * @param {object} settings The settings to apply.
 * @returns {jQuery[]} The jquery object for chaining.
 */
$.fn.listbuilder = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ListBuilder(this, settings));
    }
  });
};
