import { Drag, COMPONENT_NAME } from './drag';


/**
 * jQuery Component Wrapper for Drag
 */
$.fn.drag = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Drag(this, settings));
    }
  });
};
