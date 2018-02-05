import { TimePicker, COMPONENT_NAME } from './timepicker';

/**
 * jQuery Component Wrapper for Timepicker
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} textarea elements being acted on.
 */
$.fn.timepicker = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new TimePicker(this, settings));
    }
  });
};
