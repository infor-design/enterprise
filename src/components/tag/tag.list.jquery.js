import { TagList, COMPONENT_NAME } from './tag.list';

// Initialize the plugin (Once)
$.fn.taglist = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new TagList(this, settings));
    }
  });
};
