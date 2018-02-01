import { Arrange, COMPONENT_NAME } from './arrange';

/**
 * jQuery component wrapper for Arrange
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.arrange = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Arrange(this, settings));
    }
  });
};
