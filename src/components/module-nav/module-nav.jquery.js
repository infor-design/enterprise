import { ModuleNav, COMPONENT_NAME } from './module-nav';

/**
 * jQuery Component Wrapper for Module Nav
 * @param {object} [settings] incoming Settings
 * @returns {jQuery[]} elements to be acted on
 */
$.fn.modulenav = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new ModuleNav(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
