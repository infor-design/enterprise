import { MultiTabs, COMPONENT_NAME } from './multi-tabs';

/**
 * jQuery Component Wrapper for MultiTabs
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} invoked/updated component elements
 */
$.fn.multitabs = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new MultiTabs(this, settings));
    }
  });
};
