import { Initialize } from './initialize';


/**
 * jQuery Component Wrapper for Initialize
 */
$.fn.initialize = function(options) {
  return this.each(function() {
    return new Initialize(this, options);
  });
};
