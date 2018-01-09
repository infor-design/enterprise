import { Pager, COMPONENT_NAME } from './pager';


/**
 * jQuery Component Wrapper for pager
 */
$.fn.pager = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Pager(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
