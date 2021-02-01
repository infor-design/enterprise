import { VirtualScroll, COMPONENT_NAME } from './virtual-scroll';

/**
 * jQuery Component Wrapper for VirtualScroll
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.virtualscroll = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new VirtualScroll(this, settings));
    }
  });
};
