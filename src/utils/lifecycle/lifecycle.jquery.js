import { siftFor } from './lifecycle';

const EXCLUDED_FROM_CLOSE_CHILDREN = [
  '.expandable-card',
  '.expandable-area',
  '.accordion',
  '[soho-busyindicator]',
  '.busy-indicator-container'
];
const EXCLUDED_FROM_HANDLE_RESIZE = [];

/**
 * Searches this element for all IDS Components internally that can be destroyed.
 * Any components matched will automatically be destroyed.
 * @returns {jQuery[]} the root element
 */
$.fn.destroy = function () {
  return siftFor($(this), 'destroy');
};

/**
 * Searches this element for all IDS Components internally that have menus or popups that can be closed.
 * Any components matched will automatically have these items closed.
 * @returns {jQuery[]} the root element
 */
$.fn.closeChildren = function () {
  return siftFor($(this), 'close', EXCLUDED_FROM_CLOSE_CHILDREN);
};

/**
 * Searches this element for all IDS Components internally that contain a `handleResize` method.
 * Any components matched will automatically run this method.
 * @returns {jQuery[]} the root element
 */
$.fn.handleResize = function () {
  return siftFor($(this), 'handleResize', EXCLUDED_FROM_HANDLE_RESIZE);
};
