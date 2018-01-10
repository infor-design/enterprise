import { SwapList, COMPONENT_NAME } from './swaplist';

// Initialize the plugin (Once)
$.fn.swaplist = function (settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SwapList(this, settings));
    }
  });
};
