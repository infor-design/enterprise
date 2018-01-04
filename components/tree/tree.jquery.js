import { Tree, COMPONENT_NAME } from './tree';


/**
 * jQuery Component Wrapper for Tree
 * TODO: - Context Menus
 *       - Search
 */
$.fn.tree = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Tree(this, settings));
    }
  });
};
