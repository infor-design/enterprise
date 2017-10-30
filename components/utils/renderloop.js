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
   */
  function RenderLoop() {
    this.callbacks = [];
    return this;
  }


  RenderLoop.prototype = {

    /**
     *
     */
    start: function() {
      this.doLoop = true;

      var self = this,
        last = timestamp(),
        now,
        deltaTime;

      function tick() {
        // Don't continue if the loop is stopped externally
        if (!self.doLoop) {
          return;
        }

        now = timestamp();
        deltaTime = (now - last) / 1000;

        // TODO: execute callbacks
        self.callbacks.forEach(function(obj) {
          var modifiedArgs;

          if (typeof obj.cb === 'function') {
            modifiedArgs = Array.prototype.slice.call(arguments);
            modifiedArgs.push({
              last: last,
              delta: deltaTime,
              now: now
            });

            obj.cb.apply(null, modifiedArgs);
            return;
          }

          // If it's not a function, prune the whole object
          // TODO: remove from queue
        });

        // Continue the loop
        last = now;
        requestAnimationFrame(tick);
      }

      tick();
    },


    stop: function() {
      this.doLoop = false;
    },

    /**
     * @returns {Array}
     */
    queue: function() {
      return this.callbacks;
    },

    /**
     * @param {function} callback
     * @param {Number} [duration] = 0
     * @param {String} [namespace]
     */
    register: function(callback, duration, namespace) {
      if (typeof callback !== 'function') {
        throw new Error('cannot register callback to RenderLoop because callback is not a function');
      }

      // valid for a callback not to have a duration, as long as it's namespaced for future manual removal
      if (!duration) {
        duration = -1;
      }

      var noNamespace = typeof namespace !== 'string' || !namespace.length;
      if (duration < 1 && noNamespace) {
        throw new Error('cannot register a callback to RenderLoop with no duration and no namespace');
      }

      if (typeof namespace !== 'string' || !namespace.length) {
        namespace = ''; // TODO: make unique
      }

      this.callbacks.push({
        id: namespace,
        cb: callback,
        duration: duration,
        start: timestamp()
      });
    },

    /**
     * @param {function} callback
     * @param {String} [namespace]
     */
    unregister: function(callback, namespace) {
      // TODO: remove by callback
      // TODO: remove by namespace
    }

  };

  window.Soho.renderLoop = new RenderLoop();

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
