import { Drag, PLUGIN_NAME } from './drag';


/**
 * jQuery Component Wrapper for Drag
 */
$.fn.drag = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Drag(this, settings));
    }
  });
};
