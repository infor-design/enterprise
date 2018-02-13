import { Tag, COMPONENT_NAME } from './tag';

// Initialize the plugin (Once)
$.fn.tag = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tag(this, settings));
    }
  });
};
