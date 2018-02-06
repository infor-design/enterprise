import { DatePicker, COMPONENT_NAME } from './datepicker';

/**
 * jQuery Component Wrapper for Datepicker
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.datepicker = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new DatePicker(this, settings));
    }
  });
};
