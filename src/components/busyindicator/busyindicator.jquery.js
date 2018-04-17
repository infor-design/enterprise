import { BusyIndicator, COMPONENT_NAME } from './busyindicator';

/**
 * jQuery Component Wrapper for the BusyIndicator
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.busyindicator = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new BusyIndicator(this, settings));
    }
  });
};
