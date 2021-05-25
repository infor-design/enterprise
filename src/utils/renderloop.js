import { utils } from './utils';

// Default RenderLoop Settings
const RENDERLOOP_DEFAULTS = {
  noAutoStart: false
};

// Only start the renderloop if it's not disabled by a Global config setting.
let instanceSettings = {};
if (typeof window.SohoConfig === 'object' && typeof window.SohoConfig.renderLoop === 'object') {
  instanceSettings = utils.extend({}, RENDERLOOP_DEFAULTS, window.SohoConfig.renderLoop);
}

/**
 * Gets an accurate timestamp from
 * @private
 * @returns {number} a current timestamp
 */
function timestamp() {
  // eslint-disable-next-line compat/compat
  return window.performance && window.performance.now ?
    // eslint-disable-next-line compat/compat
    window.performance.now() :
    new Date().getTime();
}

/**
 * RenderLoop Queue items
 * @param {object} opts options
 * @returns {this} RenderLoopItem
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
  this.setFuncs(opts);

  // internal state
  this.paused = false;
  this.elapsedTime = 0;
  this.startTime = timestamp();

  return this;
}

RenderLoopItem.prototype = {

  /**
   * @private
   * @param {object} opts incoming settings
   */
  setFuncs(opts) {
    if (typeof opts.updateCallback !== 'function' && typeof opts.timeoutCallback !== 'function') {
      throw new Error('cannot register callback to RenderLoop because callback is not a function');
    }

    if (typeof opts.updateCallback === 'function') {
      this.updateCallback = opts.updateCallback;
    }

    if (typeof opts.timeoutCallback === 'function') {
      this.timeoutCallback = opts.timeoutCallback;
    }
  },

  pause() {
    this.paused = true;
  },

  resume() {
    this.paused = false;
  },

  /**
   * @param {boolean} noTimeout causes the item to be destroyed without triggering the `timeoutCallback` function
   */
  destroy(noTimeout) {
    if (noTimeout) {
      this.noTimeout = true;
    }
    this.doRemoveOnNextTick = true;
  }
};

/**
 * Sets up a timed rendering loop that can be used for controlling animations
 * globally in an application that implements Soho.
 * @constructor
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.noAutoStart] if true, will not auto-start the renderLoop
 */
function RenderLoop(settings) {
  this.items = [];
  this.element = $('body');
  this.settings = utils.mergeSettings(null, settings, RENDERLOOP_DEFAULTS);

  if (this.settings.noAutoStart !== true) {
    this.start();
  }

  return this;
}

RenderLoop.prototype = {

  /**
   * Start the entire render loop
   * @returns {void}
   */
  start() {
    this.doLoop = true;
    this.startTime = timestamp();

    const self = this;
    let last = timestamp();
    let now;
    let deltaTime;

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
      self.items.forEach((loopItem) => {
        // Remove if we've set the `doRemoveOnNextTick` flag.
        if (loopItem.doRemoveOnNextTick) {
          self.remove(loopItem);
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
        let modifiedArgs;
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

          // Arguments produced for the updateCallback contain:
          // [0] the current RenderLoopItem
          // [1] overall timing values for the RenderLoop
          modifiedArgs = [loopItem, {
            last,
            delta: deltaTime,
            now
          }];

          loopItem.updateCallback.apply(null, modifiedArgs);
        }
      });

      // Continue the loop
      last = now;
      requestAnimationFrame(tick);
    }

    tick();
  },

  /**
   * Stops the entire render loop
   * @returns {void}
   */
  stop() {
    this.doLoop = false;
  },

  /**
   * @returns {number} amount of time that has passed since the RenderLoop was started.
   */
  totalDuration() {
    return timestamp() - this.startTime;
  },

  /**
   * External method for getting the callback queue contents
   * @returns {array} list of internal RenderLoopItems
   */
  queue() {
    return this.items;
  },

  /**
   * @private
   * @param {function} updateCallback - (can also be the "updateCallback" function)
   * @param {function} [timeoutCallback] callback function that gets fired at
   *  the end of this item's lifecycle
   * @param {number} [duration] the amount of time in frames that this item should exist
   * @param {string} [namespace] the namespace for this item
   * @returns {RenderLoopItem} the item that was registered
   */
  buildRenderLoopItem(updateCallback, timeoutCallback, duration, namespace) {
    let noNamespace = typeof namespace !== 'string' || !namespace.length;

    // valid for a callback not to have a duration, as long as it's
    // namespaced for future manual removal
    if (typeof duration === 'string') {
      if (noNamespace) {
        namespace = duration;
        duration = -1;
        noNamespace = false;
      } else {
        const numberDuration = Number(duration);
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

    const loopItem = new RenderLoopItem({
      id: namespace,
      updateCallback,
      timeoutCallback,
      duration
    });

    return loopItem;
  },

  /**
   * @param {RenderLoopItem|function} loopItem - (can also be the "updateCallback" function)
   * @param {function} [timeoutCallback] callback function that gets fired at
   *  the end of this item's lifecycle
   * @param {number} [duration] the amount of time in frames that this item should exist
   * @param {string} [namespace] the namespace for this item
   * @returns {RenderLoopItem} the item that was registered
   */
  register(loopItem, timeoutCallback, duration, namespace) {
    // If we're not working with a RenderLoopItem off the bat, take arguments
    // and convert to a RenderLoopItem.  Consider the first argument
    // to be the "updateCallback" function
    if (!(loopItem instanceof RenderLoopItem)) {
      loopItem = this.buildRenderLoopItem(loopItem, timeoutCallback, duration, namespace);
    }

    this.items.push(loopItem);

    return loopItem;
  },

  /**
   * @param {function} callback callback function to be unregistered
   * @param {string} [namespace] namespace to be unregistered
   * @returns {RenderLoopItem} the item that was unregistered
   */
  unregister(callback, namespace) {
    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to remove an entry from the RenderLoop queue.');
    }

    // If callback is defined as a string, simply swap it for the namespace.
    if (typeof callback === 'string') {
      namespace = callback;
      callback = undefined;
    }

    return this.remove({
      cb: callback,
      id: namespace
    });
  },

  /**
   * @private
   * Uses a callback function, or a defined namespace, to grab a RenderLoop item from the queue.
   * @param {function} updateCallback callback function to be retrieved
   * @param {string} [namespace] namespace to be retrieved
   * @returns {RenderLoopItem} the RenderLoopItem that represents the item that was paused.
   */
  getFromQueue(updateCallback, namespace) {
    // If callback is defined as a string, simply swap it for the namespace.
    if (typeof callback === 'string') {
      namespace = updateCallback;
      updateCallback = undefined;
    }

    let retreivedItem;

    if (typeof callback === 'function') {
      // Remove by callback method
      this.items.forEach((item) => {
        if (`${item.updateCallback}` !== `${updateCallback}`) {
          return true;
        }
        retreivedItem = item;
        return false;
      });
    } else if (typeof namespace === 'string') {
      // Remove by namespace
      this.items.forEach((item) => {
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
   * Pulled out into its own function because it can be automatically called by
   * the tick, or manually triggered from an external API call.
   * @param {renderLoopItem|Object} obj the renderLoopItem
   * @returns {RenderLoopItem} reference to the removed renderLoopItem
   */
  remove(obj) {
    let removedItem;

    if (obj instanceof RenderLoopItem) {
      removedItem = obj;
      this.items = this.items.filter(item => item !== obj);
    } else if (typeof obj.updateCallback === 'function') {
      // Remove by callback method
      this.items = this.items.filter((item) => {
        if (`${item.updateCallback}` !== `${obj.updateCallback}`) {
          return true;
        }
        removedItem = item;
        return false;
      });
    } else if (typeof obj.id === 'string') {
      // Remove by namespace
      this.items = this.items.filter((item) => {
        if (item.id !== obj.id) {
          return true;
        }
        removedItem = item;
        return false;
      });
    }

    if (typeof removedItem.timeoutCallback === 'function' && !removedItem.noTimeout) {
      removedItem.timeoutCallback.apply(null, removedItem);
    }

    this.element.triggerHandler('remove.renderLoop', [removedItem]);

    // If this is undefined, an item was NOT removed from the queue successfully.
    return removedItem;
  },

  /**
   * @param {function} callback callback function to be paused
   * @param {string} [namespace] namespace to be paused
   * @returns {RenderLoopItem} the RenderLoopItem that represents the item that was paused.
   */
  pause(callback, namespace) {
    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
    }

    const pausedItem = this.getFromQueue(callback, namespace);

    pausedItem.pause();

    return pausedItem;
  },

  /**
   * @param {function} callback callback function to be resumed
   * @param {string} [namespace] namespace to be resumed
   * @returns {RenderLoopItem} the RenderLoopItem that represents the item that was resumed.
   */
  resume(callback, namespace) {
    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
    }

    const resumableItem = this.getFromQueue(callback, namespace);

    resumableItem.resume();

    return resumableItem;
  },

};

// Setup a single instance of RenderLoop for export.
const renderLoop = new RenderLoop(instanceSettings);

export { RenderLoopItem, renderLoop };
