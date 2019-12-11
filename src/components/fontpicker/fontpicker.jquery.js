import { FontPicker, COMPONENT_NAME } from './fontpicker';

// Initialize the plugin (Once)
$.fn.fontpicker = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FontPicker(this, settings));
    }
  });
};
