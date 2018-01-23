import { debounce } from './debounced-resize';

const debouncedResizeName = 'debouncedResize';

/**
 * Bind the smartResize method to $.fn()
 * @param {function} fn the callback function to be bound on debounced resize
 * @returns {void}
 */
$.fn[debouncedResizeName] = function (fn) {
  if (fn) {
    return this.bind('resize', debounce(fn));
  }
  return this.trigger(debouncedResizeName);
};
