import { ListBuilder, COMPONENT_NAME } from './listbuilder';

// Initialize the plugin (Once)
$.fn.listbuilder = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ListBuilder(this, settings));
    }
  });
};
