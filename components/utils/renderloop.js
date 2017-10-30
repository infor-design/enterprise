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
    this.element = $('body');
    return this;
  }


  RenderLoop.prototype = {

    /**
     * Start the entire render loop
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
          // Remove if we've set the `doRemoveOnNextTick` flag.
          if (obj.doRemoveOnNextTick) {
            self._remove(obj);
            self.element.triggerHandler('remove.renderLoop', [obj]);
            return;
          }

          // Check duration
          if (typeof obj.duration === 'number' && obj.duration > -1) {
            if (!obj.start) {
              obj.start = now;
            }

            if (obj.duration <= now - obj.start) {
              obj.doRemoveOnNextTick = true;
              return;
            }
          }

          // Call the function
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
          } else {
            // If it's not a function, prune the whole object
            // TODO: remove from queue
            this._remove(obj);
            self.element.triggerHandler('remove.renderLoop', [obj]);
          }

        });

        // Continue the loop
        last = now;
        requestAnimationFrame(tick);
      }

      tick();
    },

    /**
     * Stop the entire render loop
     */
    stop: function() {
      this.doLoop = false;
    },

    /**
     * External method for getting the callback queue contents
     * @returns {Array}
     */
    queue: function() {
      return this.callbacks;
    },

    /**
     * @param {function} callback
     * @param {Number} [duration] = 0
     * @param {String} [namespace]
     * @returns {boolean}
     */
    register: function(callback, duration, namespace) {
      if (typeof callback !== 'function') {
        throw new Error('cannot register callback to RenderLoop because callback is not a function');
      }

      var noNamespace = typeof namespace !== 'string' || !namespace.length;

      // valid for a callback not to have a duration, as long as it's namespaced for future manual removal
      if (typeof duration === 'string') {
        if (noNamespace) {
          namespace = duration;
          duration = -1;
          noNamespace = false;
        } else {
          var numberDuration = parseInt(duration);
          if (!isNaN(numberDuration)) {
            duration = numberDuration;
          }
        }
      } else if (typeof duration !== 'number') {
        duration = -1;
      }

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

      return true;
    },

    /**
     * @param {function} callback
     * @param {String} [namespace]
     */
    unregister: function(callback, namespace) {
      if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
        throw new Error('must provide either a callback function or a namespace string to remove an entry from the RenderLoop queue.');
      }

      // If callback is defined as a string, simply swap it for the namespace.
      if (typeof callback === 'string') {
        namespace = callback;
        callback = undefined;
      }

      return this._remove({
        cb: callback,
        id: namespace
      });
    },

    /**
     * @private
     * Actually does the removal of a registered callback from the queue
     * Pulled out into its own function because it can be automatically called by the tick, or manually triggered from an external API call.
     * @param {Object} obj
     * @returns {boolean}
     */
    _remove: function(obj) {
      var queueStartSize = this.callbacks.length;

      if (typeof obj.callback === 'function') {
        // Remove by callback method
        this.callbacks = this.callbacks.filter(function(item) {
          return ''+item.cb !== ''+obj.cb;
        });
      } else if (typeof obj.id === 'string') {
        // Remove by namespace
        this.callbacks = this.callbacks.filter(function(item) {
          return item.id !== obj.id;
        });
      }

      return queueStartSize !== this.callbacks.length;
    }

  };

  window.Soho.renderLoop = new RenderLoop();

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
