import { Autocomplete, COMPONENT_NAME } from './autocomplete';

/**
 * jQuery Component Wrapper for Autocomplete
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.autocomplete = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Autocomplete(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
