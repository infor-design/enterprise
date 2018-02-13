import { Editor, COMPONENT_NAME } from './editor';

// Initialize the plugin (Once)
$.fn.editor = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Editor(this, settings));
    }
  });
};
