import { Cards, COMPONENT_NAME } from './cards';

/**
 * jQuery Component Wrapper for cards
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.cards = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Cards(this, settings));
    }
  });
};
