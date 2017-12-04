import { Hyperlink, PLUGIN_NAME } from './hyperlinks';


/**
 * jQuery Component Wrapper for Hyperlink
 */
$.fn.hyperlink = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Hyperlink(this, settings));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, PLUGIN_NAME);
      };
    }
  });
};
