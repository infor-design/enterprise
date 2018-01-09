import { Button, COMPONENT_NAME } from './button';

/**
 * jQuery Component Wrapper for the Soho Button Element
 */
$.fn.button = function jQueryButton(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Button(this, settings));
    }
  });
};
