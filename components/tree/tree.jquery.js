import { Tree, COMPONENT_NAME } from './tree';

/**
 * jQuery Component Wrapper for Tree
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.tree = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tree(this, settings));
    }
  });
};
