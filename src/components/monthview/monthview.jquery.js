import { MonthView, COMPONENT_NAME } from './monthview';

/**
 * jQuery Component Wrapper for MonthView
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.monthview = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new MonthView(this, settings));
    }
  });
};
