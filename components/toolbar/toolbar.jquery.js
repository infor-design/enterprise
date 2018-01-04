import { Toolbar, COMPONENT_NAME } from './toolbar';

/**
 * jQuery Component Wrapper for Toolbar
 */
$.fn.toolbar = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Toolbar(this, settings));
    }
  });
};
