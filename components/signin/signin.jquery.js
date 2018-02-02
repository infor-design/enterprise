import { SignIn, COMPONENT_NAME } from './signin';

/**
 * jQuery Component Wrapper for SignIn
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.signin = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SignIn(this, settings));
    }
  });
};
