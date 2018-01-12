import { FieldOptions, COMPONENT_NAME } from './field-options';

// Initialize the plugin (Once)
$.fn.fieldoptions = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FieldOptions(this, settings));
    }
  });
};
