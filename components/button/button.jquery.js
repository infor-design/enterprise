import { Button, COMPONENT_NAME } from './button';

/**
 * jQuery Component Wrapper for the Soho Button Element
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.button = function jQueryButton(settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Button(this, settings));
    }
  });
};
