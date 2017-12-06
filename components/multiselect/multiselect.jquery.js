import { MultiSelect, PLUGIN_NAME } from './multiselect';


/**
 * jQuery Components
 */
$.fn.multiselect = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new MultiSelect(this, settings));
    }
  });
};
