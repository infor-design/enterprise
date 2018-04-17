import { Pager, COMPONENT_NAME } from './pager';

/**
 * jQuery Component Wrapper for pager
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.pager = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Pager(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
