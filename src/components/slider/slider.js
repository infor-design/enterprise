/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { deprecateMethod } from '../../utils/deprecated';
import { theme } from '../theme/theme';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';

// jQuery Components
import '../drag/drag.jquery';
import '../tooltip/tooltip.jquery';

// Component Name
const COMPONENT_NAME = 'slider';

// The Component Defaults
const SLIDER_DEFAULTS = {
  value: [50],
  min: 0,
  max: 100,
  range: false,
  step: undefined,
  ticks: [],
  tooltipContent: undefined,
  tooltipPosition: 'top',
  persistTooltip: false
};

/**
 * Touch Enabled/Responsive and Accessible Slider Control
 * @class Slider
 * @param {jQuery[]|HTMLElement} element The DOM element
 * @param {object} [settings] incoming settings
 * @param {array} [settings.value = [50]] An array with the slider values. Or one if a single value slider.
 * @param {number} [settings.min = 0] The minimum slider value.
 * @param {number} [settings.max = 100] The maximum slider value.
 * @param {boolean} [settings.range = false] If true a range slider with two selectors is formed.
 * @param {undefined|Number} [settings.step] If added will be the number of slider steps to use.
 * @param {array} [settings.ticks = []] An array of the ticks to use for the steps
 * @param {undefined|Array} [settings.tooltipContent] Special customizable tooltip content.
 * @param {string} [settings.tooltipPosition = 'top'] Option to control the position of tooltip. ['top' , 'bottom'] 
 * @param {boolean} [settings.persistTooltip = false] If true the tooltip will stay visible.
 */
function Slider(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, SLIDER_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Check if is an integer
function isInt(n) {
  return n % 1 === 0;
}

// Round a non-integer to an integer closest to the nearest increment/decrement.
// If no increment is provided or the increment is 0, only round to the nearest whole number.
function roundToIncrement(number, increment) {
  if (!increment || isNaN(increment) || increment === 0) {
    increment = 1;
  }
  return Math.round(number / increment) * increment;
}

// Get the distance between two points.
// PointA & PointB are both arrays containing X and Y coordinates of two points.
// Distance Formula:  http://www.purplemath.com/modules/distform.htm
function getDistance(pointA, pointB) {
  const aX = pointA[0];
  const aY = pointA[1];
  const bX = pointB[0];
  const bY = pointB[1];

  return Math.sqrt(Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2));
}

// Actual Plugin Code
Slider.prototype = {

  /**
   * @private
   * @returns {this} component instance
   */
  init() {
    return this
      .buildSettings()
      .addMarkup()
      .bindEvents();
  },

  /**
   * Handles Data Attribute settings, some markup settings
   * @private
   * @returns {this} component instance
   */
  buildSettings() {
    const self = this;

    // Add "is-disabled" css class to closest ".field" if element is disabled
    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    if (!this.settings) {
      this.settings = {};
    }
    this.settings.value = this.element.attr('value') !== undefined ? this.element.attr('value') : this.settings.value;
    this.settings.min = this.element.attr('min') !== undefined ? parseInt(this.element.attr('min'), 10) : this.settings.min;
    this.settings.max = this.element.attr('max') !== undefined ? parseInt(this.element.attr('max'), 10) : this.settings.max;
    this.settings.range = this.element.attr('data-range') !== undefined ? (this.element.attr('data-range') === 'true') : this.settings.range;
    this.settings.step = !isNaN(this.element.attr('step')) ? Number(this.element.attr('step')) : this.settings.step;

    if (this.settings.value === '') {
      this.settings.value = this.settings.min;
    }

    // build tick list
    let parsedTicks;
    if (this.element.attr('data-ticks') !== undefined) {
      try {
        parsedTicks = JSON.parse(self.element.attr('data-ticks'));
      } catch (e) {
        parsedTicks = [];
      }

      if ($.isArray(parsedTicks)) {
        this.settings.ticks = parsedTicks;
      }
    }

    // build tooltip content
    const isTooltipPersist = (this.element.attr('data-tooltip-persist') === 'true' || this.element.attr('data-tooltip-persist') === true);
    this.settings.persistTooltip = this.element.attr('data-tooltip-persist') !== undefined ? isTooltipPersist : this.settings.persistTooltip;
    this.settings.tooltip = this.settings.tooltipContent;
    if (this.element.attr('data-tooltip-content') !== undefined) {
      try {
        self.settings.tooltip = JSON.parse(self.element.attr('data-tooltip-content'));
      } catch (e) {
        self.settings.tooltip = ['', ''];
      }
    }
    if (typeof this.settings.tooltip === 'string') {
      if (this.settings.tooltip.indexOf(',') === -1) {
        this.settings.tooltip = [this.settings.tooltip, ''];
      } else {
        const strings = this.settings.tooltip.split(',');
        this.settings.tooltip = [strings[0]];
        this.settings.tooltip.push(strings[1] ? strings[1] : '');
      }
    }
    if (this.settings.tooltip && this.settings.tooltip.length === 1) {
      this.settings.tooltip.push('');
    }

    // Build ticks.  All sliders have a tick for minimum and maximum by default.
    // Some will be provided as extra.
    this.ticks = [];
    const minTick = {
      value: this.settings.min,
      description: self.getModifiedTextValue(this.settings.min)
    };
    const maxTick = {
      value: this.settings.max,
      description: self.getModifiedTextValue(this.settings.max)
    };

    if (!this.settings.ticks) {
      this.ticks.push(minTick, maxTick);
    } else {
      // Check the type of the data-ticks.  If it's not a complete array
      // and doesn't have at least one option, ignore it.
      let ticks = self.settings.ticks || [];

      if ($.isArray(ticks) && ticks.length > 0) {
        // Filter through the incoming ticks to figure out if any have been defined
        // That match the values of min and max.
        const equalsMin = ticks.filter(obj => obj.value === self.settings.min);
        const equalsMax = ticks.filter(obj => obj.value === self.settings.max);

        // Overwrite description and color for min/max if they've been found.
        if (equalsMin.length > 0) {
          minTick.description = equalsMin[0].description;
          minTick.color = equalsMin[0].color;
          ticks = $.grep(ticks, val => val !== equalsMin[0]);
        }
        if (equalsMax.length > 0) {
          maxTick.description = equalsMax[0].description;
          maxTick.color = equalsMax[0].color;
          ticks = $.grep(ticks, val => val !== equalsMax[0]);
        }
      }

      // Push the values of all ticks out to the ticks array
      self.ticks.push(minTick);
      for (let i = 0; i < ticks.length; i++) {
        const tick = {};
        if (ticks[i].value !== undefined) {
          tick.value = ticks[i].value;
          tick.description = ticks[i].description !== undefined ? ticks[i].description : '';
          tick.color = ticks[i].color;
          self.ticks.push(tick);
        }
      }
      self.ticks.push(maxTick);
    }

    // configure the slider to deal with an array of values, and normalize the
    // values to make sure they are numbers.
    if ($.isArray(this.settings.value)) {
      this.settings.value[0] = isNaN(this.settings.value[0]) ?
        (this.settings.min + this.settings.max) / 2 :
        parseInt(this.settings.value[0], 10);
    } else if (typeof this.settings.value === 'number') {
      this.settings.value = [this.settings.value];
    } else if (this.settings.value.indexOf(',') === -1) {
      // String
      this.settings.value = [isNaN(this.settings.value) ?
        (this.settings.min + this.settings.max) / 2 :
        parseInt(this.settings.value, 10)];
    } else {
      const vals = this.settings.value.split(',');
      vals[0] = isNaN(vals[0]) ? this.settings.min : parseInt(vals[0], 10);
      vals[1] = isNaN(vals[1]) ? this.settings.max : parseInt(vals[1], 10);
      this.settings.value = vals;
    }

    // Add a second value to the array if we're dealing with a range.
    if (this.settings.range && !this.settings.value[1]) {
      this.settings.value.push(this.settings.max);
    }

    return this;
  },

  /**
   * Adds pseudo-markup that helps build the component
   * @private
   * @returns {this} component instance
   */
  addMarkup() {
    const self = this;
    let isVertical = false;

    if (self.element[0].tagName !== 'INPUT') {
      throw new Error(`Element with ID "${self.element.id}" cannot invoke a slider;  it's not an Input element.`);
    }

    // store values and attributes on the original element
    self.originalElement = {
      type: self.element.attr('type')
    };

    // Hide the input element
    self.element.attr('type', 'hidden');

    // Build the slider controls
    self.wrapper = $('<div class="slider-wrapper"></div>').attr('id', `${self.element.attr('id')}-slider`).insertAfter(self.element);
    self.hitarea = $('<div class="slider-hit-area"></div>').appendTo(self.wrapper);
    self.range = $('<div class="slider-range"></div>').appendTo(self.wrapper);

    // Set to a vertical slider if the class exists on the input
    if (this.element.hasClass('vertical')) {
      this.wrapper.addClass('vertical');
      isVertical = true;
    }

    // Set RTL
    this.isRtlHorizontal = (Locale.isRTL() && !isVertical);
    this.isRtlVertical = (Locale.isRTL() && isVertical);

    // Retain any width or height size properties from the original range
    // element onto the Pseudo-markup
    let style = this.element.attr('style');
    if (style) {
      if (style.match(/min-height/)) {
        this.wrapper[0].style.minHeight = this.element[0].style.minHeight;
        style = style.replace('min-height', '');
      }
      if (style.match(/height/)) {
        this.wrapper[0].style.height = this.element[0].style.height;
      }
      if (style.match(/min-width/)) {
        this.wrapper[0].style.minWidth = this.element[0].style.minWidth;
        style = style.replace('min-width', '');
      }
      if (style.match(/width/)) {
        this.wrapper[0].style.width = this.element[0].style.width;
      }
    }

    // Handles
    self.handles = [];
    const labelText = self.element.prev('label').text();
    const handleLower = $(`<div class="slider-handle${self.settings.range ? ' lower' : ''}" tabindex="0"></div>`)
      .attr('aria-label', `${self.settings.range ? Locale.translate('SliderMinimumHandle') : Locale.translate('SliderHandle')} ${labelText}`);
    self.handles.push(handleLower);
    if (self.settings.range) {
      const handleHigher = $('<div class="slider-handle higher" tabindex="0"></div>')
        .attr('aria-label', `${Locale.translate('SliderMaximumHandle')} ${labelText}`);
      self.handles.push(handleHigher);
    }
    $.each(self.handles, (i, handle) => {
      // Add WAI-ARIA to the handles
      handle.attr({
        role: 'slider',
        'aria-orientation': (isVertical ? 'vertical' : 'horizontal'),
        'aria-valuemin': self.settings.min,
        'aria-valuemax': self.settings.max
      }).hideFocus();
      handle.appendTo(self.wrapper);
    });

    function positionTick(tick) {
      const convertValueToPercentage = self.isRtlHorizontal ?
        (100 - self.convertValueToPercentage(tick.value)) :
        self.convertValueToPercentage(tick.value);
      const pos = `calc(${convertValueToPercentage}% - 4px)`;

      tick.element = $(`<div class="tick" data-value="${tick.value}"></div>`);
      tick.label = $(`<span class="label">${tick.description}</span>`);
      tick.element[0].style[isVertical ? 'bottom' : 'left'] = pos;
      tick.element.append(tick.label);
      self.wrapper.append(tick.element);

      if (isVertical) {
        return;
      }
      tick.label[0].style.left = `${-(tick.label.outerWidth() / 2 - tick.element.width() / 2)}px`;
    }

    // Ticks
    self.ticks.forEach((tick) => {
      positionTick(tick);
    });

    self.value(self.settings.value);
    self.updateRange();

    // Tooltip on handle needs to update later
    $.each(self.handles, (i, handle) => {
      if (self.settings.tooltip) {
        handle.tooltip({
          content() {
            return `${self.getModifiedTextValue(Math.floor(self.value()[i]))}`;
          },
          placement: (isVertical ? 'right' : self.settings.tooltipPosition),
          trigger: 'focus',
          keepOpen: self.settings.persistTooltip
        });
        handle.removeAttr('aria-describedby');
      }
    });

    if (this.element.prop('readonly') === true) {
      this.readonly();
    } else if (this.element.prop('disabled') === true) {
      this.disable();
    }

    return self;
  },

  /**
   * User is interacting with the Slider Range (not the handle or ticks)
   * @private
   * @param {jQuery.Event} e jQuery `click` event
   * @returns {void}
   */
  handleRangeClick(e) {
    e.preventDefault();
    if (this.isDisabled()) {
      return;
    }

    const self = this;
    const isVertical = this.wrapper.hasClass('vertical');
    const pageX = e.originalEvent.type !== 'click' ? e.originalEvent.changedTouches[0].pageX : e.pageX;
    const pageY = e.originalEvent.type !== 'click' ? e.originalEvent.changedTouches[0].pageY : e.pageY;
    const mouseX = pageX - self.wrapper.offset().left - $(document).scrollLeft();
    const mouseY = pageY - self.wrapper.offset().top - $(document).scrollTop();
    const clickCoords = [mouseX, mouseY];
    const fhX = (self.handles[0].offset().left + (self.handles[0].width() / 2)) -
      self.wrapper.offset().left - $(document).scrollLeft();
    const fhY = (self.handles[0].offset().top + (self.handles[0].height() / 2)) -
      self.wrapper.offset().top - $(document).scrollTop();
    const firstHandleCoords = [fhX, fhY];
    let shX;
    let shY;
    let secondHandleCoords;
    const oldVals = self.value();
    const dLower = getDistance(clickCoords, firstHandleCoords);
    let dHigher;
    let targetOldVal = oldVals[0];
    let targetHandle = self.handles[0];

    targetHandle.addClass('hide-focus');

    function conversion() {
      if (isVertical) {
        const wh = self.wrapper.height();
        return ((wh - mouseY) / wh) * 100;
      }
      return (mouseX / self.wrapper.width()) * 100;
    }

    // Convert the coordinates of the mouse click to a value
    const val = conversion();
    const rangeVal = self.convertPercentageToValue(val);

    // If the slider is a range, we may use the second handle instead of the first
    if (self.handles[1]) {
      shX = (self.handles[1].offset().left + (self.handles[1].width() / 2)) -
        self.wrapper.offset().left - $(document).scrollLeft();
      shY = (self.handles[1].offset().top + (self.handles[1].height() / 2)) -
        self.wrapper.offset().top - $(document).scrollTop();
      secondHandleCoords = [shX, shY];
      dHigher = getDistance(clickCoords, secondHandleCoords);

      if (dLower > dHigher) {
        self.value([undefined, rangeVal]);
        targetHandle = self.handles[1];
        targetOldVal = oldVals[1];
      } else {
        self.value([rangeVal]);
      }
    } else {
      self.value([rangeVal]);
    }

    self.checkHandleDifference(targetHandle, targetOldVal, rangeVal);

    const moveBy = self.settings.step ? self.settings.step : 0;
    if (rangeVal < targetOldVal) {
      self.decreaseValue(e, targetHandle, rangeVal, moveBy);
    } else {
      self.increaseValue(e, targetHandle, rangeVal, moveBy);
    }

    // Tooltip repositioner will focus the handle after positioning occurs, but if
    // we are clicking a tick on a slider with no tooltip, we need to focus it manually.
    if (!self.settings.tooltip) {
      targetHandle.focus();
    }
  },

  /**
   * Activates one of the slider handles
   * @private
   * @param {jQuery[]} handle element representing a slider handle
   */
  activateHandle(handle) {
    handle.addClass('is-active');
  },

  /**
   * Deactivates one of the slider handles
   * @private
   * @param {jQuery[]} handle element representing a slider handle
   */
  deactivateHandle(handle) {
    handle.removeClass('is-active');
  },

  /**
   * Enables the ability to drag one of the slider handles.
   * @private
   * @param {jQuery[]} handle element representing a slider handle
   */
  enableHandleDrag(handle) {
    if (this.isDisabled()) {
      return;
    }

    const self = this;
    const draggableOptions = {
      containment: 'parent',
      axis: (this.isVertical() ? 'y' : 'x'),
      clone: false
    };

    function updateHandleFromDraggable(e, thisHandle, args) {
      if (self.isDisabled()) {
        return;
      }

      function conversion() {
        if (self.isVertical()) {
          const wh = self.wrapper.height();
          // Vertical Slider accounts for limits set on the height by IDS Enterprise Drag.js
          const adjustedHeight = wh - thisHandle.outerHeight();

          return ((adjustedHeight - args.top) / adjustedHeight) * 100;
        }
        return args.left / (self.wrapper.width() - thisHandle.outerWidth()) * 100;
      }

      const val = conversion();
      let rangeVal = self.convertPercentageToValue(val);

      // Ranged values need to check to make sure that the higher-value handle
      // doesn't drawindowg past the lower-value handle, and vice-versa.
      if (self.settings.range) {
        const originalVal = self.value();
        if (thisHandle.hasClass('higher') && rangeVal <= originalVal[0]) {
          rangeVal = originalVal[0];
        }
        if (thisHandle.hasClass('lower') && rangeVal >= originalVal[1]) {
          rangeVal = originalVal[1];
        }
      }

      // Round the value to the nearest step, if the step is defined
      if (self.settings.step) {
        rangeVal = Math.round(rangeVal / self.settings.step) * self.settings.step;
      }

      /**
      * Fires while the slider is being slid.
      * @event sliding
      * @memberof Slider
      * @property {object} event The jquery event object
      * @property {object} args Extra event information.
      * @property {HTMLElement} args.handle The slider handle DOM element.
      * @property {number} args.value The current range value.
      */
      if (!e.defaultPrevented) {
        self.value(thisHandle.hasClass('higher') ? [undefined, rangeVal] : [rangeVal]);
        self.updateRange();
        self.updateTooltip(thisHandle);
        self.element.trigger('sliding', thisHandle, rangeVal);
      }
    }

    // Add/Remove Classes for canceling animation of handles on the draggable's events.
    /**
    * Fires while the slider is being slid.
    * @event slidestart
    * @memberof Slider
    * @property {object} event The jquery event object
    * @property {object} args Extra event information.
    * @property {HTMLElement} args.handle The slider handle DOM element.
    */
    /**
     * Fires while the slider is being slid.
     * @event slidestop
     * @memberof Slider
     * @property {object} event The jquery event object
     * @property {object} args Extra event information.
     * @property {HTMLElement} args.handle The slider handle DOM element.
     */
    handle.drag(draggableOptions)
      .on('drag.slider', (e, args) => {
        updateHandleFromDraggable(e, $(e.currentTarget), args);
      })
      .on('dragstart', function () {
        $(this).addClass('is-dragging');
        self.range.addClass('is-dragging');
        self.element.trigger('slidestart', handle);
      })
      .on('dragend', function () {
        $(this).removeClass('is-dragging');
        self.range.removeClass('is-dragging');
        self.element.trigger('slidestop', handle);
      });
  },

  /**
   * Disables the dragging of a handle.
   * @private
   * @param {jQuery[]} handle element representing a slider handle
   */
  disableHandleDrag(handle) {
    handle.off('drag.slider dragstart dragend');

    this.range.removeClass('is-dragging');
    handle.removeClass('is-dragging');

    const dragAPI = handle.data('drag');
    if (dragAPI) {
      dragAPI.destroy();
    }
  },

  /**
   * @private
   * @param {number} value pixel value
   * @returns {number} representing a percentage
   */
  convertValueToPercentage(value) {
    return (((value - this.settings.min) / (this.settings.max - this.settings.min)) * 100);
  },

  /**
   * @private
   * @param {number} percentage percentage value
   * @returns {number} representing a pixel value
   */
  convertPercentageToValue(percentage) {
    const val = (percentage / 100) * (this.settings.max - this.settings.min) + this.settings.min;
    return this.isRtlHorizontal ? (this.settings.max - val + this.settings.min) : val;
  },

  /**
   * Gets a 10% increment/decrement as a value within the range of minimum and maximum values.
   * @returns {number} nearest 10% increment
   */
  getIncrement() {
    let increment = 0.1 * (this.settings.max - this.settings.min);
    if (this.settings.step !== undefined && increment <= this.settings.step) {
      increment = this.settings.step;
    }
    return increment;
  },

  /**
   * Handles Slider Component's keystrokes
   * @private
   * @param {jQuery.Event} e jQuery `keydown` event
   * @param {this} self reference to this component instance
   */
  handleKeys(e, self) {
    if (self.isDisabled()) {
      return;
    }

    const key = e.which;
    const handle = $(e.currentTarget);

    handle.removeClass('hide-focus');

    // If the keycode got this far, it's an arrow key, Page Up, Page Down, HOME, or END.
    switch (key) {
      case 33: // Page Up increases the value by 10%
        self.increaseValue(e, handle, undefined, this.getIncrement());
        break;
      case 34: // Page Down decreases the value by 10%
        self.decreaseValue(e, handle, undefined, this.getIncrement());
        break;
      case 35: // End key sets the handle to its maximum possible value
        self.increaseValue(e, handle, this.settings.max);
        break;
      case 36:
        // Home key sets the handle to its lowest
        // (either minimum value or as low as the "lower" handle)
        self.decreaseValue(e, handle, this.settings.min);
        break;
      case 38: case 39: // Right and Up increase the spinbox value
        if (self.isRtlHorizontal && key === 39) {
          self.decreaseValue(e, handle);
        } else {
          self.increaseValue(e, handle);
        }
        break;
      case 37: case 40: // Left and Down decrease the spinbox value
        if (self.isRtlHorizontal && key === 37) {
          self.increaseValue(e, handle);
        } else {
          self.decreaseValue(e, handle);
        }
        break;
      default:
        break;
    }
  },

  /**
   * Increases the value of one of the slider handles, accounting for step value, percentage, etc.
   * Also visually updates the handle on the visual part of the slider.
   * @param {jQuery.Event} e jQuery `click` or `keydown` event.
   * @param {jQuery[]} handle represents a slider handle element.
   * @param {number} [value] - target value - will be automatically determined if not passed.
   * @param {number} [increment] - an integer that will be used as the amount to increment.
   */
  increaseValue(e, handle, value, increment) {
    e.preventDefault();
    clearTimeout(handle.data('animationTimeout'));

    const val = this.value().slice(0);
    let incrementBy = increment !== undefined ? increment : this.settings.step !== undefined ? this.settings.step : 1; //eslint-disable-line
    let testVal;
    let updatedVal;
    let finalVal;

    if (handle.hasClass('higher')) {
      testVal = value !== undefined ? value : val[1];
      incrementBy = isInt(testVal) ? incrementBy : isNaN(testVal % incrementBy) ? 0 : testVal % incrementBy; //eslint-disable-line
      updatedVal = testVal + incrementBy <
        this.settings.max ? testVal + incrementBy : this.settings.max;
      finalVal = updatedVal % incrementBy ? updatedVal : roundToIncrement(updatedVal, incrementBy);
      this.value([undefined, finalVal]);
    } else {
      testVal = value !== undefined ? value : val[0];
      const maxValue = val[1] === undefined ? this.settings.max : val[1];
      incrementBy = isInt(testVal) ? incrementBy : isNaN(testVal % incrementBy) ? 0 : incrementBy - (testVal % incrementBy); //eslint-disable-line
      updatedVal = testVal + incrementBy < maxValue ? testVal + incrementBy : maxValue;
      finalVal = updatedVal % incrementBy ? updatedVal : roundToIncrement(updatedVal, incrementBy);
      this.value([finalVal]);
    }
    this.checkHandleDifference(handle, testVal, finalVal);
    this.updateRange();
    this.updateTooltip(handle);
  },

  /**
   * Decreases the value of one of the slider handles, accounting for step value, percentage, etc.
   * Also visually updates the handle on the visual part of the slider.
   * @param {jQuery.Event} e jQuery `click` or `keydown` event.
   * @param {jQuery[]} handle element representing a slider handle.
   * @param {number} [value] - target value - will be automatically determined if not passed.
   * @param {number} [decrement] - an integer that will be used as the amount to decrement.
   */
  decreaseValue(e, handle, value, decrement) {
    e.preventDefault();
    clearTimeout(handle.data('animationTimeout'));

    const val = this.value();
    let decrementBy = decrement !== undefined ? decrement : this.settings.step !== undefined ? this.settings.step : 1; //eslint-disable-line
    let testVal;
    let updatedVal;
    let finalVal;

    if (handle.hasClass('higher')) {
      testVal = value !== undefined ? value : val[1];
      const minValue = val[0] === undefined ? this.settings.min : val[0];
      decrementBy = isInt(testVal) ? decrementBy : isNaN(testVal % decrementBy) ? 0 : decrementBy - (testVal % decrementBy); //eslint-disable-line
      updatedVal = testVal - decrementBy > minValue ? testVal - decrementBy : minValue;
      finalVal = updatedVal % decrementBy ? updatedVal : roundToIncrement(updatedVal, decrementBy);
      this.value([undefined, finalVal]);
    } else {
      testVal = value !== undefined ? value : val[0];
      decrementBy = isInt(testVal) ? decrementBy : isNaN(testVal % decrementBy) ? 0 : testVal % decrementBy; //eslint-disable-line
      updatedVal = testVal - decrementBy >
        this.settings.min ? testVal - decrementBy : this.settings.min;
      finalVal = updatedVal % decrementBy ? updatedVal : roundToIncrement(updatedVal, decrementBy);
      this.value([finalVal]);
    }
    this.checkHandleDifference(handle, testVal, finalVal);
    this.updateRange();
    this.updateTooltip(handle);
  },

  /**
   * Changes the position of the bar and handles based on their values.
   * @private
   */
  updateRange() {
    const self = this;
    const newVal = this.value();
    const percentages = [];
    const color = this.getColorClosestToValue();
    const isVertical = self.wrapper.hasClass('vertical');

    for (let i = 0; i < this.ticks.length; i++) {
      const condition = !this.settings.range ? this.ticks[i].value <= newVal[0] :
        newVal[0] < this.ticks[i].value && this.ticks[i].value <= newVal[1];

      if (condition) {
        this.ticks[i].element.addClass('complete');
        if (color) {
          this.ticks[i].element[0].style.backgroundColor = color;
          this.ticks[i].element.addClass('inherit');
        }
      } else {
        this.ticks[i].element.removeClass('complete');
        if (color) {
          this.ticks[i].element[0].style.backgroundColor = '';
          this.ticks[i].element.removeClass('inherit');
        }
      }
    }

    if (color) {
      this.range[0].style.backgroundColor = color;
      $.each(this.handles, (i, handle) => {
        handle[0].style.backgroundColor = color;
        handle[0].style.borderColor = color;
      });
    }

    // Remove any text colors that already existed.
    $.each(self.ticks, (i) => {
      self.ticks[i].label[0].style.color = '';
    });

    // Convert the stored values from ranged to percentage
    percentages[0] = this.convertValueToPercentage(newVal[0]);
    if (newVal[1] !== undefined) {
      percentages[1] = this.convertValueToPercentage(newVal[1]);
    }

    function getPosAttrs() {
      if (isVertical) {
        return ['bottom', 'top'];
      }
      if (self.isRtlHorizontal) {
        return ['right', 'left'];
      }
      return ['left', 'right'];
    }

    const posAttrs = getPosAttrs();
    const cssProps = {};

    // If no arguments are provided, update both handles with the latest stored values.
    if (!this.handles[1]) {
      cssProps[posAttrs[0]] = '0%';
      cssProps[posAttrs[1]] = `${100 - percentages[0]}%`;
    } else {
      cssProps[posAttrs[0]] = `${percentages[0]}%`;
      cssProps[posAttrs[1]] = `${100 - percentages[1]}%`;
    }
    this.range.css(cssProps);

    function positionHandle(handle, percentage) {
      const basePosition = isVertical ? posAttrs[1] : posAttrs[0];
      const realPercentage = isVertical ? 100 - percentage : percentage;

      handle.css(basePosition, `calc(${realPercentage}% - ${handle.outerWidth() / 2}px)`);
    }

    if (this.handles[0].hasClass('is-animated')) {
      this.handles[0].data('animationTimeout', setTimeout(() => {
        self.handles[0].removeClass('is-animated').trigger('slide-animation-end');
        self.range.removeClass('is-animated');
      }, 201));
    }
    positionHandle(this.handles[0], percentages[0]);

    if (this.handles[1]) {
      if (this.handles[1].hasClass('is-animated')) {
        this.handles[1].data('animationTimeout', setTimeout(() => {
          self.handles[1].removeClass('is-animated').trigger('slide-animation-end');
          self.range.removeClass('is-animated');
        }, 201));
      }
      positionHandle(this.handles[1], percentages[1]);

      // update the 'aria-valuemin' attribute on the Max handle, and the 'aria-valuemax'
      // attribute on the Min handle for better screen reading compatability
      this.handles[0].attr('aria-valuemax', newVal[1]);
      this.handles[1].attr('aria-valuemin', newVal[0]);
    }
  },

  /**
   * Allows a handle to animate to a new position if the difference in value is greater
   *  than 3% of the size of the range.
   * @private
   * @param {jQuery[]} handle element representing a slider handle
   * @param {number} originalVal the value before it was modified
   * @param {number} updatedVal the target value
   */
  checkHandleDifference(handle, originalVal, updatedVal) {
    // IE9 doesn't support animation so return immediately.
    if ($('html').hasClass('ie9')) {
      return;
    }
    const origPercent = this.convertValueToPercentage(originalVal);
    const updatedPercent = this.convertValueToPercentage(updatedVal);

    if (Math.abs(origPercent - updatedPercent) > 3) {
      handle.addClass('is-animated');
      this.range.addClass('is-animated');
    }
  },

  /**
   * If tooltips are active, updates the current placement and content of the Tooltip.
   * If no handle argument is passed, this method simply hides both handles' tooltips.
   * @param {jQuery[]} [handle] element representing a slider handle.
   */
  updateTooltip(handle) {
    if (!this.settings.tooltip) {
      return;
    }

    if (!handle) {
      const tooltipLow = this.handles[0].data('tooltip');
      let tooltipHigh;

      if (this.handles[1]) {
        tooltipHigh = this.handles[1].data('tooltip');
      }

      tooltipLow.hide();
      if (tooltipHigh) {
        tooltipHigh.hide();
      }

      return;
    }

    const tooltip = handle.data('tooltip');

    function update() {
      tooltip.position();
      handle.focus();
    }

    // NOTE: This is a bit hacky because it depends on the setTimeout() method for
    // animation that is triggered inside the self.updateRange() method to have not
    // fired yet.  If you put a breakpoint anywhere in there you may see strange
    // results with animation.
    if (handle.hasClass('is-animated')) {
      tooltip.hide();
      handle.one('slide-animation-end', () => {
        update();
      });
    } else {
      update();
    }
  },

  /**
   * Gets a string-based hex value for the closest tick's defined color.
   * @private
   * @returns {string} hex value representing a color
   */
  getColorClosestToValue() {
    const currentVariant = theme.currentTheme.id.split('-')[2];
    const preColors = {
      light: {
        default: '#000000',
        'very-poor': '#a13030',
        poor: '#d66221',
        adequate: '#f2bc41',
        good: '#9cce7c',
        'very-good': '#76b051',
        superior: '#488421'
      },
      dark: {
        default: '#ffffff',
        'very-poor': '#a13030',
        poor: '#d66221',
        adequate: '#f2bc41',
        good: '#9cce7c',
        'very-good': '#76b051',
        superior: '#488421'
      },
      contrast: {
        default: '#000000',
        'very-poor': '#a13030',
        poor: '#d66221',
        adequate: '#e4882b',
        good: '#76b051',
        'very-good': '#56932e',
        superior: '#397514'
      }
    };

    const themeColors = preColors[currentVariant];
    const val = this.value()[0];
    let highestTickColor;
    let c;

    for (let i = 0; i < this.ticks.length; i++) {
      c = this.ticks[i].color;
      if (c && val >= this.ticks[i].value) {
        highestTickColor = c;
        highestTickColor = (c.indexOf('#') > -1) ? c : (themeColors[c] || themeColors.default);
      }
    }

    return highestTickColor;
  },

  /**
   * External Facing Function to set the value. Works as percent for now but need it on ticks.
   * NOTE:  Does not visually update the range.  Use _setValue()_ to do both in one swoop.
   * @param {number} minVal the smaller handle's value
   * @param {number} [maxVal] the larger handle's value, if applicable
   * @returns {array} both currently set handle values
   */
  value(minVal, maxVal) {
    const self = this;

    // if both options are absent, act as a getter and return the current value
    if (minVal === undefined && maxVal === undefined) {
      return self._value;
    }

    // if an array is passed as the first argument, break it apart
    if (minVal && $.isArray(minVal)) {
      if (minVal[1] !== undefined) {
        maxVal = minVal[1];
      }
      minVal = minVal[0];
    }

    // set the values back to the existing one if they aren't passed.
    if (minVal === undefined && $.isArray(self._value) && self._value[0] !== undefined) {
      minVal = self._value[0];
    }
    if (maxVal === undefined && $.isArray(self._value) && self._value[1] !== undefined) {
      maxVal = self._value[1];
    }

    // set the internal value and the element's retrievable value.
    self._value = [minVal, maxVal];
    self.element.val(maxVal !== undefined ? self._value : self._value[0]);
    $.each(self.handles, (i, handle) => {
      const value = self._value[i];
      let valueText = self.getModifiedTextValue(value);

      $.each(self.ticks, (a, tick) => {
        if (tick.value === value) {
          valueText = tick.description;
        }
      });

      handle.attr({
        'aria-valuenow': self._value[i],
        'aria-valuetext': valueText
      });
    });

    self.element.trigger('change');
    return self._value;
  },

  /**
   * Returns a value with prefixed/suffixed text content.
   * Used by the tooltip and default ticks to get potential identifiers like $ and %.
   * @private
   * @param {string} content the original tooltip content
   * @returns {string} prepended/appended text that will be displayed inside the tooltip
   */
  getModifiedTextValue(content) {
    if (!this.settings.tooltip) {
      return content;
    }
    return this.settings.tooltip[0] + content + this.settings.tooltip[1];
  },

  /**
   * Enables the slider instance.
   * @returns {this} component instance
   */
  enable() {
    this.element.prop('disabled', false);
    this.element.prop('readonly', false);
    this.wrapper.removeClass('is-readonly');
    this.wrapper.removeClass('is-disabled');

    const self = this;
    $.each(this.handles, (i, handle) => {
      self.enableHandleDrag(handle);
    });

    return this;
  },

  /**
   * Disables the slider instance.
   * @returns {this} component instance
   */
  disable() {
    this.element.prop('disabled', true);
    this.element.prop('readonly', false);
    this.wrapper.removeClass('is-readonly');
    this.wrapper.addClass('is-disabled');

    const self = this;
    $.each(this.handles, (i, handle) => {
      self.disableHandleDrag(handle);
    });

    return this;
  },

  /**
   * Sets the slider in a readonly state
   * @returns {this} component instance
   */
  readonly() {
    this.element.prop('disabled', true);
    this.element.prop('readonly', true);
    this.wrapper.removeClass('is-disabled');
    this.wrapper.addClass('is-readonly');

    $.each(this.handles, (i, handle) => {
      this.disableHandleDrag(handle);
    });

    return this;
  },

  /**
   * Detects whether or not this slider is disabled
   * @returns {boolean} whether or not this slider is disabled
   */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Detects whether or not this slider is vertical
   * @returns {boolean} whether or not this slider is vertical
   */
  isVertical() {
    return this.wrapper.hasClass('vertical');
  },

  /**
   * Externally-facing function that updates the current values and correctly
   * animates the range handles, if applicable.
   * @param {number} lowVal the value for the lower slider handle.
   * @param {number} [highVal] the value for the upper slider handle, if applicable.
   * @returns {array} the newly set values
   */
  setValue(lowVal, highVal) {
    const oldVals = this.value();

    this.checkHandleDifference(this.handles[0], oldVals[0], lowVal);
    if (this.handles[1]) {
      this.checkHandleDifference(this.handles[1], oldVals[1], highVal);
    }

    const vals = this.value(lowVal, highVal);
    this.updateRange();
    this.updateTooltip();

    return vals;
  },

  /**
   * @deprecated in v4.2.0. Please use `setValue()` instead.
   * @param {number} lowVal the value for the lower slider handle.
   * @param {number} [highVal] the value for the upper slider handle, if applicable.
   * @returns {array} the newly set values
   */
  refresh(lowVal, highVal) {
    return deprecateMethod(this.setValue, this.refresh).apply(this, [lowVal, highVal]);
  },

  /**
   * Updates the slider instance after a settings change.
   * Settings and markup are complicated in the slider so we just destroy and re-invoke it
   * with fresh settings.
   * @param {object|function} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this.element.removeAttr('value');
    return this
      .teardown()
      .init();
  },

  /**
   * Removes the events and pseudo-markup created by the slider
   * @private
   * @returns {this} component instance
   */
  teardown() {
    const self = this;
    $.each(self.handles, (i, handle) => {
      self.disableHandleDrag(handle);
      handle.off('mousedown.slider click.slider blur.slider keydown.slider keyup.slider');
    });
    this.wrapper.off('click.slider touchend.slider touchcancel.slider').remove();
    this.element.attr('type', xssUtils.ensureAlphaNumeric(this.originalElement.type));

    return this;
  },

  /**
   * Destroys the slider component instance and unlinks it from its base element.
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Handle component events.
   * @private
   * @returns {void}
   */
  bindEvents() {
    const self = this;

    $.each(self.handles, (i, handle) => {
      handle.on('mousedown.slider', function () {
        if (self.isDisabled()) {
          return;
        }
        $(this).focus();
      })
        .on('click.slider', (e) => {
          e.preventDefault(); // Prevent from jumping to top.
        })
        .on('keydown.slider', (e) => {
          self.activateHandle(handle);
          self.handleKeys(e, self);
        })
        .on('keyup.slider blur.slider', () => {
          self.deactivateHandle(handle);
        });

      self.enableHandleDrag(handle);
    });

    self.wrapper.on('click.slider touchend.slider touchcancel.slider', (e) => {
      self.handleRangeClick(e);
    });

    // Slider Control listens to 'updated' trigger on its base element to update values
    self.element.on('updated.slider', () => {
      self.updated();
    });

    return self;
  }
};

export { Slider, COMPONENT_NAME };
