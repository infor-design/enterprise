import { personalization, COMPONENT_NAME } from './personalize.bootstrap';

/**
 * jQuery Component Wrapper for Personalize
 * NOTE: One instance of the Personalzation system can exist at any time, and is applied
 * to the <body> tag. When an app developer calls this directly, it's assumed that the
 * personalization system has already been established (during bootstrapping) and simply
 * needs to be updated with current settings.
 * @param {object} [settings] incoming Settings
 * @returns {jQuery[]} elements to be acted on
 */
$.fn.personalize = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, personalization);
    }
    instance.updated(settings);
  });
};
