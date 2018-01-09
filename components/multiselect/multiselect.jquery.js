import { MultiSelect, COMPONENT_NAME } from './multiselect';


/**
 * jQuery Components
 */
$.fn.multiselect = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new MultiSelect(this, settings));
    }
  });
};
