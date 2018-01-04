/**
 * Debounce method
 */
function debounce(func, threshold, execAsap) {
  var timeout;

  return function debounced () {
    var obj = this, args = arguments;
    function delayed () {
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

/**
 * Bind the smartResize method to $.fn()
 */
(function($,sr){
  // smartresize
  $.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})($, 'debouncedResize');
