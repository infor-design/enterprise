// eslint-disable-next-line import/named
import { SwipeAction, COMPONENT_NAME } from './swipe-action';

/**
 * jQuery component wrapper for the swipe container
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.swipeaction = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SwipeAction(this, settings));
    }
    return instance;
  });
};
