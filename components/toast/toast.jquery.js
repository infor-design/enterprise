import { Toast, PLUGIN_NAME } from './toast';


/**
 * jQuery Plugin Wrapper for Toast
 */
$.fn.toast = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Toast(this, settings));
    }
  });
};
