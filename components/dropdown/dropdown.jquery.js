import { Dropdown, COMPONENT_NAME } from './dropdown';


/**
 * jQuery Component Wrapper for the Dropdown
 */
$.fn.dropdown = function(settings) {
  // Keep the Chaining and Init the Controls or Settings
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Dropdown(this, settings));
    }
  });
};
