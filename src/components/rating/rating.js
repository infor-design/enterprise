import * as debug from '../../utils/debug';
import { utils, math } from '../../utils/utils';

// Component Name
const COMPONENT_NAME = 'rating';

// Default Rating Options
const RATING_DEFAULTS = {
};

/**
 * @class Rating
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
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
    this.enable();
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
   * Icon filled star
   * @param {jQuery|HTMLElement} inpt - Input element
   * @param {jQuery|HTMLElement} svg - SVG element
   */
  fillStar(inpt, svg) {
    $(inpt)
      .addClass('is-filled')
      .removeClass('is-half')
      .next(svg)
      .find('svg')
      .changeIcon('star-filled');
  },

  /**
   * Icon empty star
   * @param {jQuery|HTMLElement} inpt - Input element
   * @param {jQuery|HTMLElement} svg - SVG element
   */
  emptyStar(inpt, svg) {
    $(inpt)
      .removeClass('is-filled')
      .removeClass('is-half')
      .next(svg)
      .find('svg')
      .changeIcon('star-outlined');
  },

  /**
   * Icon half star
   * @param {jQuery|HTMLElement} inpt - Input element
   * @param {jQuery|HTMLElement} svg - SVG element
   */
  halfStar(inpt, svg) {
    $(inpt)
      .addClass('is-half')
      .removeClass('is-filled')
      .next(svg)
      .find('svg')
      .changeIcon('star-half');
  },

  /**
   * Optionally set the value and return the current value
   * @param {number} [value] - A new value
   * @returns {number}- The current value
   */
  val(value) {
    if (arguments.length === 0 ||
      value === '' ||
      isNaN(value) ||
      math.sign(value) === -1
    ) {
      return this.currentValue;
    }

    this.currentValue = parseFloat(value, 10);
    const chkIdx = Math.floor(this.currentValue);

    for (let i = 0, l = this.allInputs.length; i < l; i++) {
      const input = $(this.allInputs[i]);
      const svgSelector = input.parent().is('.inline') ? 'svg' : 'label';
      const valNotAWholeNumber = (value % 1 !== 0 && chkIdx === i);

      if (valNotAWholeNumber) {
        this.halfStar(input, svgSelector);
      } else if (i < value) {
        this.fillStar(input, svgSelector);
      } else {
        this.emptyStar(input, svgSelector);
      }

      if (i + 1 === chkIdx) {
        input.prop('checked', true);
      }
    }

    if (chkIdx <= 0 && value > 0) {
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
    elem.addClass('is-readonly');
    elem.find('input').attr('disabled', '');
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
   * @returns {object} The api
   */
  unbind() {
    this.element.find('input').off(`change.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
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
