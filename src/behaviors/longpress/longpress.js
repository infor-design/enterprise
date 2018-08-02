import { utils, math } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';

const BEHAVIOR_NAME = 'longpress';

// Default LongPress settings
const LONGPRESS_DEFAULTS = {
  delay: 400,
  mouseEvents: false
};

/**
 * @class LongPress
 * @constructor
 * @param {Object} [settings] incoming settings
 * @param {Number} [settings.delay] the amount of time that should pass between the touch start, and
 *  the trigger of the "longpress" event.
 * @param {boolean} [settings.mouseEvents] if true, will setup longpress capability against mouse events
 *  as well as touch events.  If false, only touch events will be enabled, excluding mice from triggering
 *  the event.
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
          self.fire(target, e);
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
   * @param {jQuery.Event} [e=undefined] the original event, if applicable
   * @returns {void}
   */
  fire(target, e) {
    $(target).trigger(`${BEHAVIOR_NAME}`, [e]);
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
    const useMouse = this.settings.mouseEvents;
    const testCondition = isTouch || !useMouse;

    return {
      mousedown: testCondition ? 'touchstart' : 'mousedown',
      mouseout: testCondition ? 'touchcancel' : 'mouseout',
      mouseup: testCondition ? 'touchend' : 'mouseup',
      mousemove: testCondition ? 'touchmove' : 'mousemove'
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

    this.teardown();
    this.init();
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
