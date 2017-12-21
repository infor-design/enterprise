import { Accordion, PLUGIN_NAME } from './accordion';


/**
 * jQuery Component Wrapper for Accordion
 */
$.fn.accordion = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Accordion(this, settings));
    }
  });
};
