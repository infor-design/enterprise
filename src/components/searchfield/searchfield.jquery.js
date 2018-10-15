import { SearchField, COMPONENT_NAME } from './searchfield';

/**
 * jQuery Component Wrapper for SearchField
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.searchfield = function (settings) {
  return this.each(function () {
    // Normal invoke setup
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SearchField(this, settings));
    }
  });
};
