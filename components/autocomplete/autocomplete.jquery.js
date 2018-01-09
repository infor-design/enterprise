import { Autocomplete, COMPONENT_NAME } from './autocomplete';


/**
 * jQuery Component Wrapper for Autocomplete
 */
$.fn.autocomplete = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Autocomplete(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
