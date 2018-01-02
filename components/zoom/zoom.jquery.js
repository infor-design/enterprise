import { Zoom, PLUGIN_NAME } from './zoom';


/**
 * jQuery Component Wrapper for Zoom
 */
$.fn.zoom = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Zoom(this, settings));
    }
  });
};
