import { MultiSelect, COMPONENT_NAME } from './multiselect';

/**
 * jQuery Component wrapper for Multiselect
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.multiselect = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new MultiSelect(this, settings));
    }
  });
};
