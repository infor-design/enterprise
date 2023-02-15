import { NavigationMenu, COMPONENT_NAME } from './navigationmenu';

/**
 * jQuery Component Wrapper for Navigation Menu
 * @param {object} [settings] incoming Settings
 * @returns {jQuery[]} elements to be acted on
 */
$.fn.navigationmenu = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new NavigationMenu(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
