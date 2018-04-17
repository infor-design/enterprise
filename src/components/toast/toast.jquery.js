import { Toast, COMPONENT_NAME } from './toast';

/**
 * jQuery Plugin Wrapper for Toast
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.toast = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Toast(this, settings));
    }
  });
};
