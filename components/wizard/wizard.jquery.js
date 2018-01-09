import { Wizard, COMPONENT_NAME } from './wizard';


/**
 * jQuery Component Wrapper for Wizard
 */
$.fn.wizard = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Wizard(this, settings));
    }
  });
};
