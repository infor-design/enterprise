import { Stepprocess, COMPONENT_NAME } from './stepprocess';

// Initialize the plugin (Once)
$.fn.stepprocess = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Stepprocess(this, settings));
    }
  });
};
