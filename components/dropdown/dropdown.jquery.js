import { Dropdown, PLUGIN_NAME } from './dropdown';


/**
 * jQuery Component Wrapper for the Dropdown
 */
$.fn.dropdown = function(settings) {
  // Keep the Chaining and Init the Controls or Settings
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Dropdown(this, settings));
    }
  });
};
