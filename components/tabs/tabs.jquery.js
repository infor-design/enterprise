import { Tabs, COMPONENT_NAME } from './tabs';

/**
 * jQuery component wrapper for Tabs Component
 */
$.fn.tabs = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tabs(this, settings));
    }
  });
};

// Deprecated the old Vertical Tabs code in favor of using the Tabs class.
$.fn.verticaltabs = $.fn.tabs;
