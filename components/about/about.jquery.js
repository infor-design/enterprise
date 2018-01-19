import { About, COMPONENT_NAME } from './about';

/*
* jQuery Component Wrapper for Modal
* @param  {[type]} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.about = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new About(this, settings));
    }
  });
};
