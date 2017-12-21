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
   * RenderLoop Queue items
   */
  function RenderLoopItem(opts) {
    // Either ID or a duration is required
    this.id = opts.id;
    this.duration = opts.duration || -1;
    if (this.duration < 1 && (typeof this.id !== 'string' || !this.id.length)) {
      throw new Error('cannot build a RenderLoopItem with no duration and no namespace');
    }
    this.updateDuration = opts.updateDuration || 1;

    // functions
    this._setFuncs(opts);

    // internal state
    this.paused = false;
    this.elapsedTime = 0;
    this.startTime = timestamp();

    return this;
  }

  RenderLoopItem.prototype = {
    /**
     * @private
     */
    _setFuncs: function(opts) {
      if (typeof opts.updateCallback !== 'function') {
        throw new Error('cannot register callback to RenderLoop because callback is not a function');
      }
      this.updateCallback = opts.updateCallback;

      if (typeof opts.timeoutCallback === 'function') {
        this.timeoutCallback = opts.timeoutCallback;
      }
    },

    pause: function() {
      this.paused = true;
    },

    resume: function() {
      this.paused = false;
    },

    destroy: function() {
      this.doRemoveOnNextTick = true;
    }
  };




  /**
   * Sets up a timed rendering loop that can be used for controlling animations globally in an application that implements Soho.
   */
  function RenderLoop() {
    this.items = [];
    this.element = $('body');

    return this;
  }


  RenderLoop.prototype = {

    /**
     * Start the entire render loop
     */
    start: function() {
      this.doLoop = true;
      this.startTime = timestamp();

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

        // Iterate through each item stored in the queue and "update" each one.
        // In some cases, items will be removed from the queue automatically.
        // In some cases, `update` events will be triggered on loop items, if they are
        // ready to be externally updated.
        self.items.forEach(function(loopItem) {
          // Remove if we've set the `doRemoveOnNextTick` flag.
          if (loopItem.doRemoveOnNextTick) {
            self._remove(loopItem);
            return;
          }

          // Add to elapsedTime
          if (!loopItem.paused) {
            loopItem.elapsedTime++;
          }

          // Check duration
          if (typeof loopItem.duration === 'number' && loopItem.duration > -1) {
            if (!loopItem.startTime) {
              loopItem.startTime = now;
            }

            if (loopItem.elapsedTime >= loopItem.duration) {
              loopItem.destroy();
              return;
            }
          }

          // Call the updateCallback, if applicable.
          var modifiedArgs;
          if (typeof loopItem.updateCallback === 'function') {

            // If this item doesn't update on each tick, simply count down.
            // Otherwise, call the update function
            if (loopItem.updateDuration && loopItem.updateDuration > 1) {
              if (isNaN(loopItem.timeUntilNextUpdate)) {
                loopItem.timeUntilNextUpdate = loopItem.updateDuration;
              }

              if (loopItem.timeUntilNextUpdate > 0) {
                --loopItem.timeUntilNextUpdate;
                return;
              }
            }

            modifiedArgs = Array.prototype.slice.call(arguments);
            modifiedArgs.push({
              last: last,
              delta: deltaTime,
              now: now
            });

            loopItem.updateCallback.apply(null, modifiedArgs);
            return;
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
     * @return {Number}
     */
    totalDuration: function() {
      return timestamp() - this.startTime;
    },


    /**
     * External method for getting the callback queue contents
     * @returns {Array}
     */
    queue: function() {
      return this.items;
    },


    /**
     * @private
     */
    _buildRenderLoopItem: function(updateCallback, timeoutCallback, duration, namespace) {
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

      if (typeof namespace !== 'string' || !namespace.length) {
        namespace = ''; // TODO: make unique
      }

      var loopItem = new RenderLoopItem({
        id: namespace,
        updateCallback: updateCallback,
        timeoutCallback: timeoutCallback,
        duration: duration
      });

      return loopItem;
    },


    /**
     * @param {RenderLoopItem|function} loopItem - (can also be the "updateCallback" function)
     * @param {function} [timeoutCallback]
     * @param {Number} [duration] = 0
     * @param {String} [namespace]
     * @returns {RenderLoopItem}
     */
    register: function(loopItem, timeoutCallback, duration, namespace) {

      // If we're not working with a RenderLoopItem off the bat, take arguments
      // and convert to a RenderLoopItem.  Consider the first argument to be the "updateCallback" function
      if (!(loopItem instanceof RenderLoopItem)) {
        loopItem = this._buildRenderLoopItem(loopItem, timeoutCallback, duration, namespace);
      }

      this.items.push(loopItem);

      return loopItem;
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
     * Uses a callback function, or a defined namespace, to grab a RenderLoop item from the queue.
     * @param {function} callback
     * @param {String} [namespace]
     * @returns {RenderLoopItem}
     */
    _getFromQueue: function(updateCallback, namespace) {
      // If callback is defined as a string, simply swap it for the namespace.
      if (typeof callback === 'string') {
        namespace = updateCallback;
        updateCallback = undefined;
      }

      var retreivedItem;

      if (typeof callback === 'function') {
        // Remove by callback method
        this.items.forEach(function(item) {
          if (''+item.updateCallback !== ''+updateCallback) {
            return true;
          }
          retreivedItem = item;
          return false;
        });
      } else if (typeof namespace === 'string') {
        // Remove by namespace
        this.items.forEach(function(item) {
          if (item.id !== namespace) {
            return true;
          }
          retreivedItem = item;
          return false;
        });
      }

      return retreivedItem;
    },


    /**
     * @private
     * Actually does the removal of a registered callback from the queue
     * Pulled out into its own function because it can be automatically called by the tick, or manually triggered from an external API call.
     * @param {renderLoopItem|Object} loopItem
     * @returns {RenderLoopItem}
     */
    _remove: function(obj) {
      var removedItem;

      if (obj instanceof RenderLoopItem) {
        removedItem = obj;
        this.items = this.items.filter(function(item) {
          return item !== obj;
        });

      } else if (typeof obj.updateCallback === 'function') {
        // Remove by callback method
        this.items = this.items.filter(function(item) {
          if (''+item.updateCallback !== ''+obj.updateCallback) {
            return true;
          }
          removedItem = item;
          return false;
        });
      } else if (typeof obj.id === 'string') {
        // Remove by namespace
        this.items = this.items.filter(function(item) {
          if (item.id !== obj.id) {
            return true;
          }
          removedItem = item;
          return false;
        });
      }

      if (typeof removedItem.timeoutCallback === 'function') {
        removedItem.timeoutCallback.apply(null, removedItem);
      }

      this.element.triggerHandler('remove.renderLoop', [removedItem]);

      // If this is undefined, an item was NOT removed from the queue successfully.
      return removedItem;
    },


    /**
     * @param {function} callback
     * @param {String} [namespace]
     * @returns {RenderLoopItem}
     */
    pause: function(callback, namespace) {
      if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
        throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
      }

      var pausedItem = this._getFromQueue(callback, namespace);

      pausedItem.pause();

      return pausedItem;
    },


    /**
     * @param {function} callback
     * @param {String} [namespace]
     * @returns {RenderLoopItem}
     */
    resume: function(callback, namespace) {
      if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
        throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
      }

      var resumableItem = this._getFromQueue(callback, namespace);

      resumableItem.resume();

      return resumableItem;
    },

  };

  window.Soho.RenderLoopItem = RenderLoopItem;
  window.Soho.renderLoop = new RenderLoop();

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
