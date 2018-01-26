import { Textarea, COMPONENT_NAME } from './textarea';

/**
 * jQuery Component wrapper for Textarea
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} textarea elements being acted on.
 */
$.fn.textarea = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Textarea(this, settings));
    }
  });
};
