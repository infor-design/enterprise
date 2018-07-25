import { utils, math } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';

const BEHAVIOR_NAME = 'longpress';

// Default LongPress settings
const LONGPRESS_DEFAULTS = {
  delay: 300
};

/**
 * @class LongPress
 * @constructor
 * @param {Object} settings incoming settings
 */
function LongPress(settings) {
  this.settings = utils.mergeSettings(this.element, settings, LONGPRESS_DEFAULTS);
  return this.init();
}

LongPress.prototype = {

  /**
   * @property {RenderLoopItem} [timer=null]
   */
  timer: null,

  /**
   * @private
   * @returns {void}
   */
  init() {
    const evts = this.getInputEventNames();
    const self = this;

    // User touches the screen.
    // If this goes uninterrupted for the defined duration, it causes a
    // `longpress` event to trigger on the target element.
    $(document).on(`${evts.mousedown}.${BEHAVIOR_NAME}`, (e) => {
      const target = e.target;

      // Add a timer to the renderLoop
      this.timer = new RenderLoopItem({
        id: `${BEHAVIOR_NAME}-timer`,
        duration: math.convertDelayToFPS(this.settings.delay),
        timeoutCallback() {
          self.fire(target);
        }
      });
      renderLoop.register(this.timer);
    });

    // User moves or releases the touch, causing the timer to be cancelled.
    $(document).on([
      `${evts.mouseup}.${BEHAVIOR_NAME}`,
      `${evts.mouseout}.${BEHAVIOR_NAME}`,
      `${evts.mousemove}.${BEHAVIOR_NAME}`
    ].join(' '), () => {
      this.killTimer();
    });
  },

  /**
   * @param {HTMLElement} target the target element on which to trigger the event
   * @returns {void}
   */
  fire(target) {
    $(target).trigger(`${BEHAVIOR_NAME}`);
  },

  /**
   * @private
   * @returns {void}
   */
  killTimer() {
    if (!this.timer) {
      return;
    }

    // Kill the renderloop item with no call to the timeout callback
    this.timer.destroy(true);
    this.timer = null;
  },

  /**
   * @private
   * @returns {object} containing desired event names
   */
  getInputEventNames() {
    const isTouch = env.features.touch;

    return {
      mousedown: isTouch ? 'touchstart' : 'mousedown',
      mouseout: isTouch ? 'touchcancel' : 'mouseout',
      mouseup: isTouch ? 'touchend' : 'mouseup',
      mousemove: isTouch ? 'touchmove' : 'mousemove'
    };
  },

  /**
   * @param {object} settings updated incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }
  },

  /**
   * @returns {void}
   */
  teardown() {
    const evts = this.getInputEventNames();

    this.killTimer();

    $(document).off([
      `${evts.mousedown}.${BEHAVIOR_NAME}`,
      `${evts.mouseup}.${BEHAVIOR_NAME}`,
      `${evts.mouseout}.${BEHAVIOR_NAME}`,
      `${evts.mousemove}.${BEHAVIOR_NAME}`
    ].join(' '));
  }
};

// Setup a single instance of the LongPress behavior for export
const longPress = new LongPress();

export { longPress, BEHAVIOR_NAME };
