import { Place, PLUGIN_NAME } from './place';


/**
 * jQuery Component Wrapper
 */
$.fn.place = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Place(this, settings));
    }
  });
};
