import { Blockgrid, COMPONENT_NAME } from './blockgrid';

/**
 * jQuery component wrapper for the Accordion
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.blockgrid = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Blockgrid(this, settings));
    }
  });
};
