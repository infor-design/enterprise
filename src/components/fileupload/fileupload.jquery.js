import { FileUpload, COMPONENT_NAME } from './fileupload';

/**
 * jQuery Component Wrapper for FileUpload
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
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
