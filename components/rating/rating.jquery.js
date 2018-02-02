import { Rating, COMPONENT_NAME } from './rating';

/**
 * jQuery Component Wrapper for Rating
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.rating = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Rating(this, settings));
    }
  });
};
