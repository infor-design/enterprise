import { FieldOptions, COMPONENT_NAME } from './field-options';

/**
 * jQuery Component Wrapper for FieldOptions
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.fieldoptions = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FieldOptions(this, settings));
    }
  });
};
