import { StepChart, COMPONENT_NAME } from './stepchart';

/**
 * jQuery Component Wrapper for StepChart
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.stepchart = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new StepChart(this, settings));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, COMPONENT_NAME);
      };
    }
  });
};
