/* eslint-disable */

import * as debug from '../utils/debug';
import { theme } from '../personalize/personalize';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../drag/drag.jquery';
import '../tooltip/tooltip.jquery';


/**
 * Component Name
 */
let COMPONENT_NAME = 'slider';


/**
 * Slider Component Defaults
 */
let SLIDER_DEFAULTS = {
  value: [50],
  min: 0,
  max: 100,
  range: false,
  step: undefined,
  ticks: [],
  tooltipContent: undefined,
  persistTooltip: false
};


/**
 * Touch Enabled/Responsive and Accessible Slider Control
 * @class {Slider}
 * @param {array} value
 * @param {number} min
 * @param {number} max
 * @param {boolean} range
 * @param {undefined|Number} step
 * @param {array} ticks
 * @param {undefined|Array} tooltipContent
 * @param {boolean} persistTooltip
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
  return Math.round(number/increment) * increment;
}

// Get the distance between two points.
// PointA & PointB are both arrays containing X and Y coordinates of two points.
// Distance Formula:  http://www.purplemath.com/modules/distform.htm
function getDistance(pointA, pointB) {
  var aX = pointA[0], aY = pointA[1],
    bX = pointB[0], bY = pointB[1];

  return Math.sqrt( Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2) );
}

// Actual Plugin Code
Slider.prototype = {

  /**
   * @private
   * @returns {this}
   */
  init: function() {
    return this
      .buildSettings()
      .addMarkup()
      .bindEvents();
  },

  /**
   * Handles Data Attribute settings, some markup settings
   * @private
   * @returns {this}
   */
  buildSettings: function() {
    var self = this;

    // Add "is-disabled" css class to closest ".field" if element is disabled
    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    if (!this.settings) {
      this.settings = {};
    }
    this.settings.value = this.element.attr('value') !== undefined ? this.element.attr('value') : this.settings.value;
    this.settings.min = this.element.attr('min') !== undefined ? parseInt(this.element.attr('min')) : this.settings.min;
    this.settings.max = this.element.attr('max') !== undefined ? parseInt(this.element.attr('max')) : this.settings.max;
    this.settings.range = this.element.attr('data-range') !== undefined ? (this.element.attr('data-range') === 'true') : this.settings.range;
    this.settings.step = !isNaN(this.element.attr('step')) ? Number(this.element.attr('step')) : this.settings.step;

    if (this.settings.value === '') {
      this.settings.value = this.settings.min;
    }

    // build tick list
    var parsedTicks;
    if (this.element.attr('data-ticks') !== undefined) {
      try {
        parsedTicks = JSON.parse(self.element.attr('data-ticks'));
      } catch (e) {
      }

      if ($.isArray(parsedTicks)) {
        this.settings.ticks = parsedTicks;
      }
    }

    // build tooltip content
    var isTooltipPersist = (this.element.attr('data-tooltip-persist') === 'true' || this.element.attr('data-tooltip-persist') === true);
    this.settings.persistTooltip = this.element.attr('data-tooltip-persist') !== undefined ? isTooltipPersist : this.settings.persistTooltip;
    this.settings.tooltip = this.settings.tooltipContent;
    if (this.element.attr('data-tooltip-content') !== undefined) {
      try {
        self.settings.tooltip = JSON.parse(self.element.attr('data-tooltip-content'));
      } catch (e) {
      }
    }
    if (typeof this.settings.tooltip === 'string') {
      if (this.settings.tooltip.indexOf(',') === -1) {
        this.settings.tooltip = [this.settings.tooltip, ''];
      } else {
        var strings = this.settings.tooltip.split(',');
        this.settings.tooltip = [strings[0]];
        this.settings.tooltip.push( strings[1] ? strings[1] : '');
      }
    }
    if (this.settings.tooltip && this.settings.tooltip.length === 1) {
      this.settings.tooltip.push('');
    }

    // Build ticks.  All sliders have a tick for minimum and maximum by default.  Some will be provided as extra.
    this.ticks = [];
    var minTick = {
      'value' : this.settings.min,
      'description' : self.getModifiedTextValue(this.settings.min)
    }, maxTick = {
      'value' : this.settings.max,
      'description' : self.getModifiedTextValue(this.settings.max)
    };

    if (!this.settings.ticks) {
      this.ticks.push(minTick, maxTick);
    } else {
      // Check the type of the data-ticks.  If it's not a complete array
      // and doesn't have at least one option, ignore it.
      var ticks = self.settings.ticks || [];

      if ($.isArray(ticks) && ticks.length > 0) {
        // Filter through the incoming ticks to figure out if any have been defined
        // That match the values of min and max.
        var equalsMin = ticks.filter(function(obj) {
          return obj.value === self.settings.min;
        }),
        equalsMax = ticks.filter(function(obj) {
          return obj.value === self.settings.max;
        });

        // Overwrite description and color for min/max if they've been found.
        if (equalsMin.length > 0) {
          minTick.description = equalsMin[0].description;
          minTick.color = equalsMin[0].color;
          ticks = $.grep(ticks, function(val) {
            return val !== equalsMin[0];
          });
        }
        if (equalsMax.length > 0) {
          maxTick.description = equalsMax[0].description;
          maxTick.color = equalsMax[0].color;
          ticks = $.grep(ticks, function(val) {
            return val !== equalsMax[0];
          });
        }
      }

      // Push the values of all ticks out to the ticks array
      self.ticks.push(minTick);
      for (var i = 0; i < ticks.length; i++) {
        var tick = {};
        if (ticks[i].value !== undefined) {
          tick.value = ticks[i].value;
          tick.description = ticks[i].description !== undefined ? ticks[i].description : '';
          tick.color = ticks[i].color;
          self.ticks.push(tick);
        }
      }
      self.ticks.push(maxTick);
    }

    // configure the slider to deal with an array of values, and normalize the values to make sure they are numbers.
    if ($.isArray(this.settings.value)) {
      this.settings.value[0] = isNaN(this.settings.value[0]) ? (this.settings.min + this.settings.max)/2 : parseInt(this.settings.value[0]);
    } else if (typeof this.settings.value === 'number') {
      this.settings.value = [this.settings.value];
    } else {
      // String
      if (this.settings.value.indexOf(',') === -1) {
        this.settings.value = [isNaN(this.settings.value) ? (this.settings.min + this.settings.max)/2 : parseInt(this.settings.value)];
      } else {
        var vals = this.settings.value.split(',');
        vals[0] = isNaN(vals[0]) ? this.settings.min : parseInt(vals[0]);
        vals[1] = isNaN(vals[1]) ? this.settings.max : parseInt(vals[1]);
        this.settings.value = vals;
      }
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
   * @returns {this}
   */
  addMarkup: function() {
    var self = this,
      isVertical = false;

    if (self.element[0].tagName !== 'INPUT') {
      throw new Error('Element with ID "' + self.element.id + '" cannot invoke a slider;  it\'s not an Input element.');
    }

    // store values and attributes on the original element
    self.originalElement = {
      'type': self.element.attr('type')
    };

    // Hide the input element
    self.element.attr('type', 'hidden');

    // Build the slider controls
    self.wrapper = $('<div class="slider-wrapper"></div>').attr('id', self.element.attr('id') + '-slider').insertAfter(self.element);
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

    // Retain any width or height size properties from the original range element onto the Pseudo-markup
    var style = this.element.attr('style');
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
    var labelText = self.element.prev('label').text(),
      handleLower = $('<div class="slider-handle' + (self.settings.range ? ' lower' : '') +'" tabindex="0"></div>')
      .attr('aria-label', (self.settings.range ? Locale.translate('SliderMinimumHandle') : Locale.translate('SliderHandle')) + ' ' + labelText);
    self.handles.push(handleLower);
    if (self.settings.range) {
      var handleHigher = $('<div class="slider-handle higher" tabindex="0"></div>')
        .attr('aria-label', Locale.translate('SliderMaximumHandle') + ' ' + labelText);
      self.handles.push(handleHigher);
    }
    $.each(self.handles, function(i, handle) {
      // Add WAI-ARIA to the handles
      handle.attr({
        'role' : 'slider',
        'aria-orientation' : (isVertical ? 'vertical' : 'horizontal'),
        'aria-valuemin' : self.settings.min,
        'aria-valuemax' : self.settings.max
      }).hideFocus();
      handle.appendTo(self.wrapper);
    });

    function positionTick(tick) {
      var convertValueToPercentage = self.isRtlHorizontal ?
          (100 - self.convertValueToPercentage(tick.value)) :
          self.convertValueToPercentage(tick.value),
        pos = 'calc(' + convertValueToPercentage + '% - 4px)';

      tick.element = $('<div class="tick" data-value="'+ tick.value +'"></div>');
      tick.label = $('<span class="label">' + tick.description + '</span>');
      tick.element[0].style[isVertical ? 'bottom' : 'left'] = pos;
      tick.element.append(tick.label);
      self.wrapper.append(tick.element);

      if (isVertical) {
        return;
      }
      tick.label[0].style.left = -(tick.label.outerWidth()/2 - tick.element.width()/2) + 'px';
    }

    // Ticks
    self.ticks.forEach(function(tick) {
      positionTick(tick);
    });

    self.value(self.settings.value);
    self.updateRange();

    // Tooltip on handle needs to update later
    $.each(self.handles, function(i, handle) {
      if (self.settings.tooltip) {
        handle.tooltip({
          content: function() {
            return '' + self.getModifiedTextValue(Math.floor(self.value()[i]));
          },
          placement: (isVertical ? 'right' : 'bottom'),
          trigger: 'focus',
          keepOpen: self.settings.persistTooltip
        });
        handle.removeAttr('aria-describedby');
      }
    });

    if (this.element.prop('disabled') === true) {
      this.disable();
    }

    return self;
  },

  /**
   * User is interacting with the Slider Range (not the handle or ticks)
   * @param {jQuery.Event} e
   */
  handleRangeClick: function(e) {
      e.preventDefault();
      if (this.isDisabled()) {
        return;
      }

      var self = this,
        isVertical = this.wrapper.hasClass('vertical'),
        pageX = e.originalEvent.type !== 'click' ? e.originalEvent.changedTouches[0].pageX : e.pageX,
        pageY = e.originalEvent.type !== 'click' ? e.originalEvent.changedTouches[0].pageY : e.pageY,
        mouseX = pageX - self.wrapper.offset().left - $(document).scrollLeft(),
        mouseY = pageY - self.wrapper.offset().top - $(document).scrollTop(),
        clickCoords = [mouseX,mouseY],
        fhX = (self.handles[0].offset().left + (self.handles[0].width()/2)) - self.wrapper.offset().left - $(document).scrollLeft(),
        fhY = (self.handles[0].offset().top + (self.handles[0].height()/2)) - self.wrapper.offset().top - $(document).scrollTop(),
        firstHandleCoords = [fhX,fhY],
        shX,
        shY,
        secondHandleCoords,
        oldVals = self.value(),
        dLower = getDistance(clickCoords,firstHandleCoords),
        dHigher,
        targetOldVal = oldVals[0],
        targetHandle = self.handles[0];

      targetHandle.addClass('hide-focus');

      function conversion() {
        if (isVertical) {
          var wh = self.wrapper.height();
          return ((wh - mouseY) / wh) * 100;
        }
        return (mouseX / self.wrapper.width()) * 100;
      }

      // Convert the coordinates of the mouse click to a value
      var val = conversion(),
        rangeVal = self.convertPercentageToValue(val);

      // If the slider is a range, we may use the second handle instead of the first
      if (self.handles[1]) {
        shX = (self.handles[1].offset().left + (self.handles[1].width()/2)) - self.wrapper.offset().left - $(document).scrollLeft();
        shY = (self.handles[1].offset().top + (self.handles[1].height()/2)) - self.wrapper.offset().top - $(document).scrollTop();
        secondHandleCoords = [shX, shY];
        dHigher = getDistance(clickCoords,secondHandleCoords);

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

      if (rangeVal < targetOldVal) {
        self.decreaseValue(e, targetHandle, rangeVal, 0);
      } else {
        self.increaseValue(e, targetHandle, rangeVal, 0);
      }

      // Tooltip repositioner will focus the handle after positioning occurs, but if we are clicking a tick
      // on a slider with no tooltip, we need to focus it manually.
      if (!self.settings.tooltip) {
        targetHandle.focus();
      }
  },

  /**
   * Activates one of the slider handles
   * @param {jQuery[]} handle
   */
  activateHandle: function(handle) {
    handle.addClass('is-active');
  },

  /**
   * Deactivates one of the slider handles
   * @param {jQuery[]} handle
   */
  deactivateHandle: function(handle) {
    handle.removeClass('is-active');
  },

  /**
   * Enables the ability to drag one of the slider handles.
   * @param {jQuery[]} handle
   */
  enableHandleDrag: function(handle) {
    if (this.isDisabled()) {
      return;
    }

    var self = this,
      draggableOptions = {
        containment: 'parent',
        axis: (this.isVertical() ? 'y' : 'x'),
        clone: false
      };

    function updateHandleFromDraggable(e, handle, args) {
      if (self.isDisabled()) {
        return;
      }

      function conversion() {
        if (self.isVertical()) {
          var wh = self.wrapper.height(),
          // Vertical Slider accounts for limits set on the height by SoHo Xi Drag.js
          adjustedHeight = wh - handle.outerHeight();

          return ((adjustedHeight - args.top) / adjustedHeight) * 100;
        }
        return args.left / (self.wrapper.width() - handle.outerWidth()) * 100;
      }

      var val = conversion(),
        rangeVal = self.convertPercentageToValue(val);

      // Ranged values need to check to make sure that the higher-value handle doesn't drawindowg past the
      // lower-value handle, and vice-versa.
      if (self.settings.range) {
        var originalVal = self.value();
        if (handle.hasClass('higher') && rangeVal <= originalVal[0]) {
          rangeVal = originalVal[0];
        }
        if (handle.hasClass('lower') && rangeVal >= originalVal[1]) {
          rangeVal = originalVal[1];
        }
      }

      // Round the value to the nearest step, if the step is defined
      if (self.settings.step) {
        rangeVal = Math.round(rangeVal / self.settings.step) * self.settings.step;
      }

      if (!e.defaultPrevented) {
        self.value(handle.hasClass('higher') ? [undefined, rangeVal] : [rangeVal]);
        self.updateRange();
        self.updateTooltip(handle);
        self.element.trigger('sliding', handle, rangeVal);
      }

      return;
    }

    // Add/Remove Classes for canceling animation of handles on the draggable's events.
    handle.drag(draggableOptions)
    .on('drag.slider', function (e, args) {
      updateHandleFromDraggable(e, $(e.currentTarget), args);
    })
    .on('dragstart', function() {
      $(this).addClass('is-dragging');
      self.range.addClass('is-dragging');
      self.element.trigger('slidestart', handle);
    })
    .on('dragend', function() {
      $(this).removeClass('is-dragging');
      self.range.removeClass('is-dragging');
      self.element.trigger('slidestop', handle);
    });
  },

  /**
   * Disables the dragging of a handle.
   * @param {jQuery[]} handle
   */
  disableHandleDrag: function(handle) {
    handle.off('drag.slider dragstart dragend');

    this.range.removeClass('is-dragging');
    handle.removeClass('is-dragging');

    var dragAPI = handle.data('drag');
    if (dragAPI) {
      dragAPI.destroy();
    }
  },

  /**
   * @private
   * @param {number} value
   * @returns {number}
   */
  convertValueToPercentage: function(value) {
    return (((value - this.settings.min) / (this.settings.max - this.settings.min)) * 100);
  },

  /**
   * @private
   * @param {number} percentage
   * @returns {number}
   */
  convertPercentageToValue: function(percentage) {
    var val = (percentage / 100) * (this.settings.max - this.settings.min) + this.settings.min;
    return this.isRtlHorizontal ? (this.settings.max - val + this.settings.min) : val;
  },

  /**
   * Gets a 10% increment/decrement as a value within the range of minimum and maximum values.
   * @returns {number}
   */
  getIncrement: function() {
    var increment = 0.1 * (this.settings.max - this.settings.min);
    if (this.settings.step !== undefined && increment <= this.settings.step) {
      increment = this.settings.step;
    }
    return increment;
  },

  /**
   * Handles Slider Component's keystrokes
   * @param {jQuery.Event} e
   * @param {this} self
   */
  handleKeys: function(e, self) {
    if (self.isDisabled()) {
      return;
    }

    var key = e.which,
      handle = $(e.currentTarget);

    handle.removeClass('hide-focus');

    // If the keycode got this far, it's an arrow key, Page Up, Page Down, HOME, or END.
    switch(key) {
      case 33: // Page Up increases the value by 10%
        self.increaseValue(e, handle, undefined, this.getIncrement());
        break;
      case 34: // Page Down decreases the value by 10%
        self.decreaseValue(e, handle, undefined, this.getIncrement());
        break;
      case 35: // End key sets the handle to its maximum possible value
        self.increaseValue(e, handle, this.settings.max);
        break;
      case 36: // Home key sets the handle to its lowest (either minimum value or as low as the "lower" handle)
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
    }
  },

  /**
   * Increases the value of one of the slider handles, accounting for step value, percentage, etc.
   * Also visually updates the handle on the visual part of the slider.
   * @param {jQuery.Event} e
   * @param {jQuery[]} handle
   * @param {number} [value] - target value - will be automatically determined if not passed.
   * @param {number} [increment] - an integer that will be used as the amount to increment.
   */
  increaseValue: function(e, handle, value, increment) {
    e.preventDefault();
    clearTimeout(handle.data('animationTimeout'));

    var val = this.value().slice(0),
      incrementBy = increment !== undefined ? increment : this.settings.step !== undefined ? this.settings.step : 1,
      testVal,
      updatedVal,
      finalVal;

    if (handle.hasClass('higher')) {
      testVal = value !== undefined ? value : val[1];
      incrementBy = isInt(testVal) ? incrementBy : isNaN(testVal % incrementBy) ? 0 : testVal % incrementBy;
      updatedVal = testVal + incrementBy < this.settings.max ? testVal + incrementBy : this.settings.max;
      finalVal = updatedVal % incrementBy ? updatedVal : roundToIncrement(updatedVal, incrementBy);
      this.value([undefined, finalVal]);
    } else {
      testVal = value !== undefined ? value : val[0];
      var maxValue = val[1] === undefined ? this.settings.max : val[1];
      incrementBy = isInt(testVal) ? incrementBy : isNaN(testVal % incrementBy) ? 0 : incrementBy - (testVal % incrementBy);
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
   * @param {jQuery.Event} e
   * @param {jQuery[]} handle
   * @param {number} [value] - target value - will be automatically determined if not passed.
   * @param {number} [decrement] - an integer that will be used as the amount to decrement.
   */
  decreaseValue: function(e, handle, value, decrement) {
    e.preventDefault();
    clearTimeout(handle.data('animationTimeout'));

    var val = this.value(),
      decrementBy = decrement !== undefined ? decrement : this.settings.step !== undefined ? this.settings.step : 1,
      testVal,
      updatedVal,
      finalVal;

    if (handle.hasClass('higher')) {
      testVal = value !== undefined ? value : val[1];
      var minValue = val[0] === undefined ? this.settings.min : val[0];
      decrementBy = isInt(testVal) ? decrementBy : isNaN(testVal % decrementBy) ? 0 : decrementBy - (testVal % decrementBy);
      updatedVal = testVal - decrementBy > minValue ? testVal - decrementBy : minValue;
      finalVal = updatedVal % decrementBy ? updatedVal : roundToIncrement(updatedVal, decrementBy);
      this.value([undefined, finalVal]);
    } else {
      testVal = value !== undefined ? value : val[0];
      decrementBy = isInt(testVal) ? decrementBy : isNaN(testVal % decrementBy) ? 0 : testVal % decrementBy;
      updatedVal = testVal - decrementBy > this.settings.min ? testVal - decrementBy : this.settings.min;
      finalVal = updatedVal % decrementBy ? updatedVal : roundToIncrement(updatedVal, decrementBy);
      this.value([finalVal]);
    }
    this.checkHandleDifference(handle, testVal, finalVal);
    this.updateRange();
    this.updateTooltip(handle);
  },

  /**
   * Changes the position of the bar and handles based on their values.
   */
  updateRange: function() {
    var self = this,
      newVal = this.value(),
      percentages = [],
      color = this.getColorClosestToValue(),
      isVertical = self.wrapper.hasClass('vertical');

    for (var i = 0; i < this.ticks.length; i++) {
      var condition = !this.settings.range ? this.ticks[i].value <= newVal[0] :
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
      $.each(this.handles, function(i, handle) {
        handle[0].style.backgroundColor = color;
        handle[0].style.borderColor = color;
      });
    }

    // Remove any text colors that already existed.
    $.each(self.ticks, function(i) {
      self.ticks[i].label[0].style.color = '';
    });

    // Convert the stored values from ranged to percentage
    percentages[0] = this.convertValueToPercentage(newVal[0]);
    if (newVal[1] !== undefined) {
      percentages[1] = this.convertValueToPercentage(newVal[1]);
    }

    var posAttrs = (isVertical ? ['bottom', 'top'] :
      (self.isRtlHorizontal ? ['right', 'left'] : ['left', 'right'])),
      cssProps = {};

    // If no arguments are provided, update both handles with the latest stored values.
    if (!this.handles[1]) {
      cssProps[posAttrs[0]] = '0%';
      cssProps[posAttrs[1]] = (100 - percentages[0]) + '%';
    } else {
      cssProps[posAttrs[0]] = percentages[0] + '%';
      cssProps[posAttrs[1]] = (100 - percentages[1]) + '%';
    }
    this.range.css(cssProps);

    function positionHandle(handle, percentage) {
      var basePosition = isVertical ? posAttrs[1] : posAttrs[0],
        realPercentage = isVertical ? 100 - percentage : percentage;

      handle.css(basePosition, 'calc(' + realPercentage + '% - ' + handle.outerWidth()/2 + 'px)');
    }

    if (this.handles[0].hasClass('is-animated')) {
      this.handles[0].data('animationTimeout', setTimeout( function() {
        self.handles[0].removeClass('is-animated').trigger('slide-animation-end');
        self.range.removeClass('is-animated');
      }, 201));
    }
    positionHandle(this.handles[0], percentages[0]);

    if (this.handles[1]) {
      if (this.handles[1].hasClass('is-animated')) {
        this.handles[1].data('animationTimeout', setTimeout( function() {
          self.handles[1].removeClass('is-animated').trigger('slide-animation-end');
          self.range.removeClass('is-animated');
        }, 201));
      }
      positionHandle(this.handles[1], percentages[1]);

      // update the 'aria-valuemin' attribute on the Max handle, and the 'aria-valuemax' attribute on the Min handle
      // for better screen reading compatability
      this.handles[0].attr('aria-valuemax', newVal[1]);
      this.handles[1].attr('aria-valuemin', newVal[0]);
    }
  },

  /**
   * Allows a handle to animate to a new position if the difference in value is greater than 3% of the size of the range.
   * @param {jQuery[]} handle
   * @param {number} originalVal
   * @param {number} updatedVal
   */
  checkHandleDifference: function(handle, originalVal, updatedVal) {
    // IE9 doesn't support animation so return immediately.
    if ($('html').hasClass('ie9')) {
      return;
    }
    var origPercent = this.convertValueToPercentage(originalVal),
      updatedPercent = this.convertValueToPercentage(updatedVal);

    if (Math.abs(origPercent - updatedPercent) > 3) {
      handle.addClass('is-animated');
      this.range.addClass('is-animated');
    }
  },

  /**
   * If tooltips are active, updates the current placement and content of the Tooltip.
   * If no handle argument is passed, this method simply hides both handles' tooltips.
   * @param {jQuery[]} [handle]
   */
  updateTooltip: function(handle) {
    if (!this.settings.tooltip) {
      return;
    }

    if (!handle) {
      var tooltipLow = this.handles[0].data('tooltip'),
        tooltipHigh;

      if (this.handles[1]) {
        tooltipHigh = this.handles[1].data('tooltip');
      }

      tooltipLow.hide();
      if (tooltipHigh) {
        tooltipHigh.hide();
      }

      return;
    }

    var tooltip = handle.data('tooltip');

    function update() {
      tooltip.position();
      handle.focus();
    }

    // NOTE: This is a bit hacky because it depends on the setTimeout() method for animation that is triggered
    // inside the self.updateRange() method to have not fired yet.  If you put a breakpoint anywhere in there you
    // may see strange results with animation.
    if (handle.hasClass('is-animated')) {
      tooltip.hide();
      handle.one('slide-animation-end', function() {
        update();
      });
    } else {
      update();
    }
  },

  /**
   * Gets a string-based hex value for the closest tick's defined color.
   * @returns {string}
   */
  getColorClosestToValue: function() {
    var currentTheme = theme,
      preColors = {
        'light': {
          'default'   : '#000000',
          'very-poor' : '#a13030',
          'poor'      : '#d66221',
          'adequate'  : '#f2bc41',
          'good'      : '#9cce7c',
          'very-good' : '#76b051',
          'superior'  : '#488421'
        },
        'dark': {
          'default'   : '#ffffff',
          'very-poor' : '#a13030',
          'poor'      : '#d66221',
          'adequate'  : '#f2bc41',
          'good'      : '#9cce7c',
          'very-good' : '#76b051',
          'superior'  : '#488421'
        },
        'high-contrast': {
          'default'   : '#000000',
          'very-poor' : '#a13030',
          'poor'      : '#d66221',
          'adequate'  : '#e4882b',
          'good'      : '#76b051',
          'very-good' : '#56932e',
          'superior'  : '#397514'
        }
      };

    var themeColors = preColors[currentTheme],
      val = this.value()[0],
      highestTickColor, c;

    for (var i = 0; i < this.ticks.length; i++) {
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
   * @param {number} minVal
   * @param {number} [maxVal]
   * @returns {array}
   */
  value: function(minVal, maxVal) {
    var self = this;

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

    //set the internal value and the element's retrievable value.
    self._value = [minVal, maxVal];
    self.element.val(maxVal !== undefined ? self._value : self._value[0]);
    $.each(self.handles, function(i, handle) {
      var value = self._value[i],
        valueText = self.getModifiedTextValue(value);

      $.each(self.ticks, function(a, tick) {
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
   * @param {string} content
   * @returns {string}
   */
  getModifiedTextValue: function(content) {
    if (!this.settings.tooltip) {
      return content;
    }
    return this.settings.tooltip[0] + content + this.settings.tooltip[1];
  },

  /**
   * Enables the slider instance.
   * @returns {this}
   */
  enable: function() {
    this.element.prop('disabled', false);
    this.wrapper.removeClass('is-disabled');

    var self = this;
    $.each(this.handles, function(i, handle) {
      self.enableHandleDrag(handle);
    });

    return this;
  },

  /**
   * Disables the slider instance.
   * @returns {this}
   */
  disable: function() {
    this.element.prop('disabled', true);
    this.wrapper.addClass('is-disabled');

    var self = this;
    $.each(this.handles, function(i, handle) {
      self.disableHandleDrag(handle);
    });

    return this;
  },

  /**
   * Detects whether or not this slider is disabled
   * @returns {boolean}
   */
  isDisabled: function() {
    return this.element.prop('disabled');
  },

  /**
   * Detects whether or not this slider is vertical
   * @returns {boolean}
   */
  isVertical: function() {
    return this.wrapper.hasClass('vertical');
  },

  /**
   * Externally-facing function that updates the current values and correctly animates the range handles, if applicable.
   * @param {number} lowVal
   * @param {number} [highVal]
   * @returns {array}
   */
  setValue: function(lowVal, highVal) {
    var oldVals = this.value();

    this.checkHandleDifference(this.handles[0], oldVals[0], lowVal);
    if (this.handles[1]) {
        this.checkHandleDifference(this.handles[1], oldVals[1], highVal);
    }

    var vals = this.value(lowVal, highVal);
    this.updateRange();
    this.updateTooltip();

    return vals;
  },

  // NOTE: refresh() has been deprecated in Xi Controls v4.2 - has been replaced with setValue().
  // This method will be completely removed in v4.3 and v5.x.  Please update your code.
  /**
   * @private
   * @returns {array}
   */
  refresh: function(lowVal, highVal) {
    return this.setValue(lowVal, highVal);
  },

  /**
   * Updates the slider instance after a settings change.
   * Settings and markup are complicated in the slider so we just destroy and re-invoke it
   * with fresh settings.
   * @param {Object|function} [settings]
   * @returns {this}
   */
  updated: function(settings) {
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
   * @returns {this}
   */
  teardown: function() {
    var self = this;
    $.each(self.handles, function (i, handle) {
      self.disableHandleDrag(handle);
      handle.off('mousedown.slider click.slider blur.slider keydown.slider keyup.slider');
    });
    this.wrapper.off('click.slider touchend.slider touchcancel.slider').remove();
    this.element.attr('type', this.originalElement.type);

    return this;
  },

  /**
   * Destroys the slider component instance and unlinks it from its base element.
   */
  destroy: function() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * @fires Slider#events
   * @param {object} mousedown
   * @param {object} click
   * @param {object} keydown
   * @param {object} keyup
   * @param {object} touchend
   * @param {object} touchcancel
   * @param {object} updated
   * @returns {this}
   */
  bindEvents: function() {
    var self = this;

    $.each(self.handles, function (i, handle) {
      handle.on('mousedown.slider', function () {
        if (self.isDisabled()) {
          return;
        }
        $(this).focus();
      })
      .on('click.slider', function (e) {
        e.preventDefault(); //Prevent from jumping to top.
      })
      .on('keydown.slider', function(e) {
        self.activateHandle(handle);
        self.handleKeys(e, self);
      })
      .on('keyup.slider blur.slider', function() {
        self.deactivateHandle(handle);
      });

      self.enableHandleDrag(handle);
    });

    self.wrapper.on('click.slider touchend.slider touchcancel.slider', function(e) {
      self.handleRangeClick(e);
    });

    // Slider Control listens to 'updated' trigger on its base element to update values
    self.element.on('updated.slider', function() {
      self.updated();
    });

    return self;
  }
};


export { Slider, COMPONENT_NAME };
