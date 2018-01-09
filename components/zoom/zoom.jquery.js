import { Zoom, COMPONENT_NAME } from './zoom';


/**
 * jQuery Component Wrapper for Zoom
 */
$.fn.zoom = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Zoom(this, settings));
    }
  });
};
