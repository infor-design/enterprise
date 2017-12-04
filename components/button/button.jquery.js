import { Button, PLUGIN_NAME } from './button';

/**
 * jQuery Component Wrapper for the Soho Button Element
 */
$.fn.button = function jQueryButton(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Button(this, settings));
    }
  });
};
