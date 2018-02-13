import { SwapList, COMPONENT_NAME } from './swaplist';

/**
 * jQuery Component Wrapper for SwapList
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.swaplist = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SwapList(this, settings));
    }
  });
};
