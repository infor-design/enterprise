import { CirclePager, COMPONENT_NAME } from './circlepager';

// Initialize the plugin (Once)
$.fn.circlepager = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new CirclePager(this, settings));
    }
  });
};
