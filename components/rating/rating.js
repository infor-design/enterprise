/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 * Component Name
 */
const COMPONENT_NAME = 'rating';

/**
 * Default Rating Options
 */
const RATING_DEFAULTS = {
};

/**
*
* @class Rating
* @param {String} element The component element.
* @param {String} settings The component settings.
*/
function Rating(element, settings) {
  this.settings = utils.mergeSettings(element, settings, RATING_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Actual Rating Code
Rating.prototype = {
  init() {
    this.handleEvents();
    this.allInputs = this.element.find('input');
    this.readonly();
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const inputs = $('input', this.element);

    for (let i = 0, l = inputs.length; i < l; i++) {
      $(inputs[i]).on(`change.${COMPONENT_NAME}`, () => {
        if (!this.element.hasClass('is-readonly')) {
          this.val(i + 1);
        }
      });
    }
  },

  /**
   * Set the value
   * @private
   * @param {Number} value to pass in.
   * @returns {Number} current value
   */
  val(value) {
    if (!value) {
      return this.currentValue;
    }

    this.currentValue = parseFloat(value, 10);
    const chkIdx = Math.round(this.currentValue);

    for (let i = 0, l = this.allInputs.length; i < l; i++) {
      const input = $(this.allInputs[i]);
      const svgSelector = input.parent().is('.inline') ? 'svg' : 'label';

      if (i < value) {
        input.addClass('is-filled').removeClass('is-half');
      } else {
        input.removeClass('is-filled').removeClass('is-half');
      }

      // Handle Half Star
      input.next(svgSelector).find('svg').changeIcon('star-filled');

      if (i + 1 === chkIdx) {
        input.prop('checked', true);
      }

      if (chkIdx !== this.currentValue && i + 1 === chkIdx) {
        input.addClass('is-half').next(svgSelector).find('svg').changeIcon('star-half');
      }
    }
    if (chkIdx <= 0) {
      $(this.allInputs[0]).prop('checked', true);
    }

    return this.currentValue;
  },

  /**
  * Set component to readonly.
  * @returns {void}
  */
  readonly() {
    const elem = $(this.element);
    if (elem.hasClass('is-readonly')) {
      elem.find('input').attr('disabled', '');
    }
  },

  /**
  * Set component to enable.
  * @returns {void}
  */
  enable() {
    const elem = $(this.element);
    elem.removeClass('is-readonly').find('input').removeAttr('disabled');
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {Object} The api
   */
  unbind() {
    this.element.find('input').off(`change.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, RATING_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Destroy and remove added markup, all events
  * @returns {void}
  */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Rating, COMPONENT_NAME };
