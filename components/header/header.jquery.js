import { Header, COMPONENT_NAME } from './header';

/**
 * jQuery Component Wrapper for Header
 */
$.fn.header = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Header(this, settings));
    }
  });
};
