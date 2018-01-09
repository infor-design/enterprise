import { Spinbox, COMPONENT_NAME } from './spinbox';


/**
 * jQuery Component Wrapper for Spinbox
 */
$.fn.spinbox = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Spinbox(this, settings));
    }
  });
};
