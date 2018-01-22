import { ScrollAction, COMPONENT_NAME } from './scrollaction';

// Initialize the plugin (Once)
$.fn.scrollaction = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ScrollAction(this, settings));
    }
  });
};
