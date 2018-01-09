import { Toast, COMPONENT_NAME } from './toast';


/**
 * jQuery Plugin Wrapper for Toast
 */
$.fn.toast = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Toast(this, settings));
    }
  });
};
