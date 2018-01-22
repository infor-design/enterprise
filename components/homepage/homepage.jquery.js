import { Homepage, COMPONENT_NAME } from './homepage';

// Initialize the plugin (Once)
$.fn.homepage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Homepage(this, settings));
    }
  });
};
