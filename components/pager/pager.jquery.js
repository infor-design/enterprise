import { Pager, PLUGIN_NAME } from './pager';


/**
 * jQuery Component Wrapper for pager
 */
$.fn.pager = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (!instance) {
      instance = $.data(this, PLUGIN_NAME, new Pager(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
