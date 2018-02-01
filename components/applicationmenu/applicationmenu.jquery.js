import { ApplicationMenu, COMPONENT_NAME } from './applicationmenu';

/**
 * jQuery component wrapper for the Application Menu
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.applicationmenu = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ApplicationMenu(this, settings));
    }
    return instance;
  });
};
