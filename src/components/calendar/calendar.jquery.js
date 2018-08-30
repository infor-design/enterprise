import { Calendar, COMPONENT_NAME } from './calendar';

/**
 * jQuery Component Wrapper for Calendar
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.calendar = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Calendar(this, settings));
    }
  });
};
