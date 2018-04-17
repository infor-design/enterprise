import { ContextualActionPanel, COMPONENT_NAME } from './contextualactionpanel';

/**
 * jQuery Component Wrapper for Contextual Action Panel
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.contextualactionpanel = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ContextualActionPanel(this, settings));
    }
  });
};
