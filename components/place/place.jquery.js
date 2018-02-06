import { Place, COMPONENT_NAME } from './place';

/**
 * jQuery Component Wrapper for Place
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.place = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Place(this, settings));
    }
  });
};
