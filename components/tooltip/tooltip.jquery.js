import { Tooltip, COMPONENT_NAME } from './tooltip';


/**
 * jQuery Component Wrapper for Tooltip/Popover
 */
$.fn.tooltip = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tooltip(this, settings));
    }
  });
};


// Popover & Tooltip are the same control, so export the Tooltip component.
$.fn.popover = $.fn.tooltip;
