import { CalendarToolbar, COMPONENT_NAME } from './calendar-toolbar';

/**
 * jQuery Component Wrapper for CalendarToolbar
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.calendartoolbar = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new CalendarToolbar(this, settings));
    }
  });
};
