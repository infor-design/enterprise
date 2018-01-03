import { Wizard, PLUGIN_NAME } from './wizard';


/**
 * jQuery Component Wrapper for Wizard
 */
$.fn.wizard = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Wizard(this, settings));
    }
  });
};
