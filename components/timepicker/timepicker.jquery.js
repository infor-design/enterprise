import { TimePicker, COMPONENT_NAME } from './timepicker';

/**
 * jQuery Component Wrapper for Timepicker
 */
$.fn.timepicker = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new TimePicker(this, settings));
    }
  });
};
