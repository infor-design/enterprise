import { Tooltip, COMPONENT_NAME } from './tooltip';

/**
 * jQuery Component Wrapper for Tooltip/Popover
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.tooltip = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tooltip(this, settings));
    }
  });
};
