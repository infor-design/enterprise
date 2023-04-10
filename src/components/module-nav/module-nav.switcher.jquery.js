import { ModuleNavSwitcher, COMPONENT_NAME } from './module-nav.switcher';

/**
 * jQuery Component Wrapper for Module Nav Switcher
 * @param {object} [settings] incoming Settings
 * @returns {jQuery[]} elements to be acted on
 */
$.fn.modulenavswitcher = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new ModuleNavSwitcher(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
