import { Progress, COMPONENT_NAME } from './progress';

// Initialize the plugin (Once)
$.fn.progress = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Progress(this, settings));
    }
  });
};
