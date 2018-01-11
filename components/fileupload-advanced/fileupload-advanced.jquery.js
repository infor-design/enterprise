import { FileUploadAdvanced, COMPONENT_NAME } from './fileupload-advanced';

// Initialize the plugin (Once)
$.fn.fileuploadadvanced = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FileUploadAdvanced(this, settings));
    }
  });
};
