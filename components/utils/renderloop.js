/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  window.Soho = window.Soho || {};
  window.Soho.components = window.Soho.components || {};

  /**
   * Gets an accurate timestamp from
   */
  function timestamp() {
    return window.performance && window.performance.now ?
      window.performance.now() :
      new Date().getTime();
  }

  /**
   * Sets up a timed rendering loop that can be used for controlling animations globally in an application that implements Soho.
   * @param {Object} options
   */
  function RenderLoop(options) {
    // Settings Handling
    if (!this.settings) {
      this.settings = Soho.utils.extend({}, options);
    } else {
      this.settings = Soho.utils.extend({}, this.settings, options);
    }

    // Callback Queue
    this.callbacks = [];

    return this;
  }


  RenderLoop.prototype = {

    start: function() {
      this.doLoop = true;
      this.startTime = Date.now();
      this.tick(this.startTime);
    },



    tick: function(currentTime) {
      // Don't continue if the loop is stopped externally
      if (!this.doLoop) {
        return;
      }

      // TODO: execute callbacks
      this.callbacks.forEach()

      // Continue the loop
      requestAnimationFrame(this.tick.apply(this, Date.now()));
    },

    stop: function() {
      this.doLoop = false;
    }

  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
