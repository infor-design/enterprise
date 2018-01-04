import { CirclePager, COMPONENT_NAME } from './circlepager';

// Initialize the plugin (Once)
$.fn.circlepager = function (settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.settings = $.extend({}, instance.settings, settings);
      instance.updated();
    } else {
      instance = $.data(this, COMPONENT_NAME, new CirclePager(this, settings));
    }
  });
};
