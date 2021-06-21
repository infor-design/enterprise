import { ActionSheet, COMPONENT_NAME } from './actionsheet';

/**
 * jQuery component wrapper for the Application Menu
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.actionsheet = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ActionSheet(this, settings));
    }
    return instance;
  });
};
