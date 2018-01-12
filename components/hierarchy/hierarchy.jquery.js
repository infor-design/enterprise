import { Hierarchy, COMPONENT_NAME } from './hierarchy';

// Initialize the plugin (Once)
$.fn.hierarchy = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Hierarchy(this, settings));
    }
  });
};
