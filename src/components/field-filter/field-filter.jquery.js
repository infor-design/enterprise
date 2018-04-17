import { FieldFilter, COMPONENT_NAME } from './field-filter';

/**
 * jQuery Component Wrapper for FieldFilter
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.fieldfilter = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FieldFilter(this, settings));
    }
  });
};
