import { FileUploadAdvanced, COMPONENT_NAME } from './fileupload-advanced';

/**
 * jQuery Component Wrapper for FileUpload Advanced
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
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
