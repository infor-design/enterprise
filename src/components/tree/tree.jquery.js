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

/**
 * Expand or Collapse the given node.
 * @param {HTMLElement} elem The element reference to a tree node.
 * @param {string} method The name collapse or expand.
 * @returns {void}
 */
function treeNodeExpandCollapse(elem, method) {
  const node = $(elem);
  const api = node.data(`${COMPONENT_NAME}Api`);
  if (api) {
    const methods = {
      collapse: api.collapseNode,
      expand: api.expandNode
    };
    if (typeof methods[method] === 'function') {
      methods[method].apply(api, node);
    }
  }
}

/**
 * Collapse jQuery method to run on a tree node.
 * @returns {jQuery[]} jQuery self element to make chainable.
 */
$.fn.collapse = function () {
  return this.each(function () {
    treeNodeExpandCollapse(this, 'collapse');
  });
};

/**
 * Expand jQuery method to run on a tree node.
 * @returns {jQuery[]} jQuery self element to make chainable.
 */
$.fn.expand = function () {
  return this.each(function () {
    treeNodeExpandCollapse(this, 'expand');
  });
};
