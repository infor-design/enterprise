import { Wizard, COMPONENT_NAME } from './wizard';

/**
 * jQuery Component Wrapper for Wizard
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.wizard = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Wizard(this, settings));
    }
  });
};
