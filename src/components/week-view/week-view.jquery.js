import { WeekView, COMPONENT_NAME } from './week-view';

/**
 * jQuery Component Wrapper for WeekView
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.weekview = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new WeekView(this, settings));
    }
  });
};
