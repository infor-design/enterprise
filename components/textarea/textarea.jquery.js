import { Textarea, PLUGIN_NAME } from './textarea';


/**
 * jQuery Component wrapper for Textarea
 */
$.fn.textarea = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Textarea(this, settings));
    }
  });
};
