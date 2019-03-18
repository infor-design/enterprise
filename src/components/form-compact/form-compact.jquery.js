import { FormCompact, COMPONENT_NAME } from './form-compact';

/**
 * jQuery Component Wrapper for FormContact
 * @param {object} [settings=undefined] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.formcompact = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new FormCompact(this, settings));
    }
  });
};
