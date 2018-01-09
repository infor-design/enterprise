import { debounce } from './debounced-resize';

/**
 * Bind the smartResize method to $.fn()
 */
(function($,sr){
  // smartresize
  $.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})($, 'debouncedResize');
