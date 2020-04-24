import { ContextualActionPanel, COMPONENT_NAME } from './contextualactionpanel';
import { modalManager } from '../modal/modal.manager';

/**
 * jQuery Component Wrapper for Contextual Action Panel
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.contextualactionpanel = function (settings) {
  return this.each(function () {
    const id = (settings?.modalSettings?.id) || settings?.content?.attr('id');
    const instance = modalManager.findById(id);

    if (instance) {
      instance.updated(settings);
      return;
    }
    $.data(this, COMPONENT_NAME, new ContextualActionPanel(this, settings));
  });
};
