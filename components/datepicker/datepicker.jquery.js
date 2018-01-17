import { DatePicker, COMPONENT_NAME } from './datepicker';

// Initialize the plugin (Once)
$.fn.datepicker = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new DatePicker(this, settings));
    }
  });
};
