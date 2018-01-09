import { Place, COMPONENT_NAME } from './place';


/**
 * jQuery Component Wrapper
 */
$.fn.place = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Place(this, settings));
    }
  });
};
