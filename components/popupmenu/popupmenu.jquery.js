import { PopupMenu, PLUGIN_NAME } from './popupmenu';


/**
 * jQuery component wrapper for Popupmenu
 */
$.fn.popupmenu = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new PopupMenu(this, settings));
    }
  });
};
