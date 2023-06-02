import { ModuleNavSettings, COMPONENT_NAME } from './module-nav.settings';

/**
 * jQuery Component Wrapper for Module Nav Settings
 * @param {object} [settings] incoming Settings
 * @returns {jQuery[]} elements to be acted on
 */
$.fn.modulenavsettings = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new ModuleNavSettings(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
