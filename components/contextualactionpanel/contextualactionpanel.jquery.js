import { ContextualActionPanel, COMPONENT_NAME } from './contextualactionpanel';

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
