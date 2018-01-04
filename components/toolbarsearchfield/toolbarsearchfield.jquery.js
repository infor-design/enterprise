import { ToolbarSearchfield, COMPONENT_NAME } from './toolbarsearchfield';

/**
 * jQuery Component Wrapper for Toolbar Searchfield
 */
$.fn.toolbarsearchfield = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ToolbarSearchfield(this, settings));
    }
  });
};
