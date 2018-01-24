import { Toolbar, COMPONENT_NAME } from './toolbar';

/**
 * jQuery Component Wrapper for Toolbar
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.toolbar = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Toolbar(this, settings));
    }
  });
};
