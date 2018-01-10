import { FileUpload, COMPONENT_NAME } from './fileupload';

// Initialize the plugin (Once)
$.fn.fileupload = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FileUpload(this, settings));
    }
  });
};
