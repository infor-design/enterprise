import { Dropdown, COMPONENT_NAME } from './dropdown';

/**
 * jQuery Component Wrapper for the Dropdown
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.dropdown = function (settings) {
  // Keep the Chaining and Init the Controls or Settings
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Dropdown(this, settings));
    }
  });
};
