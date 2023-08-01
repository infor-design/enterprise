import { Link, COMPONENT_NAME } from './link';

/**
 * jQuery Component Wrapper for link
 * @returns {jQuery[]} elements being acted on
 */
$.fn.link = function () {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Link(this));
    }
  });
};
