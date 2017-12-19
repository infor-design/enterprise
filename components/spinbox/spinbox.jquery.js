import { Spinbox, PLUGIN_NAME } from './spinbox';


/**
 * jQuery Component Wrapper for Spinbox
 */
$.fn.spinbox = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Spinbox(this, settings));
    }
  });
};
