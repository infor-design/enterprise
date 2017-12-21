import { Slider, PLUGIN_NAME } from './slider';


/**
 * jQuery Component Wrapper for Slider
 */
$.fn.slider = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Slider(this, settings));
    }
  });
};
