import { Splitter, COMPONENT_NAME } from './splitter';

// Initialize the plugin (Once)
$.fn.splitter = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Splitter(this, settings));
    }
  });
};
