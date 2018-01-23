/**
 * Debounce method
 * @param {function} func the callback function to be run on a stagger.
 * @param {number} [threshold] the amount of time in CPU ticks to delay.
 * @param {boolean} [execAsap] if true, executes the callback immediately
 *  instead of waiting for the threshold to complete.
 * @returns {void}
 */
function debounce(func, threshold, execAsap) {
  let timeout;

  return function debounced(...args) {
    const obj = this;
    function delayed() {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 250);
  };
}

export { debounce };
