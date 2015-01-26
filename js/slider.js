/**
* Touch Enabled/Responsive and Accessible Slider Control
* @name Slider
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.slider = function(options) {

    // Settings and Options
    var pluginName = 'slider',
        defaults = {
          value: [50],
          min: 0,
          max: 100,
          range: false,
          step: undefined,
          ticks: [],
          tooltipContent: undefined,
          persistTooltip: false
        },
        settings = $.extend(true, {}, defaults, options);

    // Plugin Constructor
    function Slider(element) {
      this.element = $(element);
      this.init();
    }

    // Check if an object is an array
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
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

      init: function() {
        this
          .buildSettings()
          .addMarkup()
          .bindEvents();
      },

      buildSettings: function() {
        var self = this;
        if (!this.settings) {
          this.settings = {};
        }
        this.settings.value = this.element.attr('value') !== undefined ? this.element.attr('value') : settings.value;
        this.settings.min = this.element.attr('min') !== undefined ? parseInt(this.element.attr('min')) : settings.min;
        this.settings.max = this.element.attr('max') !== undefined ? parseInt(this.element.attr('max')) : settings.max;
        this.settings.range = this.element.attr('data-range') !== undefined ? (this.element.attr('data-range') === 'true') : settings.range;
        this.settings.step = !isNaN(this.element.attr('step')) ? Number(this.element.attr('step')) : settings.step;

        // build tick list
        this.settings.ticks = settings.ticks;
        if (this.element.attr('data-ticks') !== undefined) {
          try {
            self.settings.ticks = JSON.parse(self.element.attr('data-ticks'));
          } catch (e) {
            console.warn('"data-ticks" attribute for element #' + self.element.attr('id') + ' did not contain properly formed JSON, and cannot be used');
          }
        }

        // build tooltip content
        var isTooltipPersist = (this.element.attr('data-tooltip-persist') === 'true' || this.element.attr('data-tooltip-persist') === true);
        this.settings.persistTooltip = this.element.attr('data-tooltip-persist') !== undefined ? isTooltipPersist : settings.persistTooltip;
        this.settings.tooltip = settings.tooltipContent;
        if (this.element.attr('data-tooltip-content') !== undefined) {
          try {
            self.settings.tooltip = JSON.parse(self.element.attr('data-tooltip-content'));
          } catch (e) {
            console.warn('"data-tooltip-content" attribute for element #' + self.element.attr('id') + ' did not contain properly formed JSON, and cannot be used');
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

          if (isArray(ticks) && ticks.length > 0) {
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
        if (isArray(this.settings.value)) {
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

      addMarkup: function() {
        var self = this;

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

        // Handles
        self.handles = [];
        self.handles.push($('<div class="slider-handle' + (self.settings.range ? ' lower' : '') +'" tabindex="0"></div>').text(self.settings.range ? 'lower' : 'handle')); // TODO: Localize
        if (self.settings.range) {
          self.handles.push($('<div class="slider-handle higher" tabindex="0"></div>').text('higher')); // TODO: Localize
        }
        $.each(self.handles, function(i, handle) {
          // Add WAI-ARIA to the handles
          handle.attr({
            'role' : 'slider',
            'aria-orientation' : 'horizontal',
            'aria-valuemin' : self.settings.min,
            'aria-valuemax' : self.settings.max,
            'aria-label' : self.element.prev('label').text() + ' ' + handle.text()
          });
          handle.appendTo(self.wrapper);
        });

        // Ticks
        for (var i = 0; i < self.ticks.length; i++) {
          var leftTickPos = 'calc(' + self.convertValueToPercentage(self.ticks[i].value) + '% - 6px)';
          self.ticks[i].element = $('<div class="tick" data-value="'+ self.ticks[i].value +'"></div>');
          self.ticks[i].label = $('<span class="label">' + self.ticks[i].description + '</span>');
          self.ticks[i].element.css('left', leftTickPos).append(self.ticks[i].label);
          self.wrapper.append(self.ticks[i].element);
          self.ticks[i].label.css('left', '-' + (self.ticks[i].label.outerWidth()/2 - self.ticks[i].element.width()/2) + 'px');
        }

        self.value(self.settings.value);
        self.updateRange();

        // Tooltip on handle needs to update later
        $.each(self.handles, function(i, handle) {
          if (self.settings.tooltip) {
            handle.tooltip({
              content: function() {
                return '' + self.getModifiedTextValue(Math.floor(self.value()[i]));
              },
              placement: 'top',
              trigger: 'focus',
              keepOpen: self.settings.persistTooltip
            });
          }
        });

        if (this.element.prop('disabled') === true) {
          this.disable();
        }

        return self;
      },

      bindEvents: function() {
        var self = this;

        function updateHandleFromDraggable(e, handle, args) {
          if (self.isDisabled()) {
            return;
          }

          var val = (args.left / (self.wrapper.width() - handle.outerWidth())) * 100,
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

        $.each(self.handles, function (i, handle) {
          var draggableOptions = {
            containment: 'parent',
            axis: 'x',
            clone: false
          };

          handle.draggable(draggableOptions)
          .on('mousedown.slider', function () {
            if (self.isDisabled()) {
              return;
            }
            $(this).focus();
          })
          .on('click.slider', function (e) {
            e.preventDefault(); //Prevent from jumping to top.
          })
          .on('drag.slider', function (e, args) {
            updateHandleFromDraggable(e, $(e.currentTarget), args);
          })
          .on('keydown.slider', function(e) {
            self.activateHandle(handle);
            self.handleKeys(e, self);
          })
          .on('keyup.slider blur.slider', function() {
            self.deactivateHandle(handle);
          })
          // Add/Remove Classes for canceling animation of handles on the draggable's events.
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
        });

        self.wrapper.on('touchend.slider touchcancel.slider', function(e) {
          e.preventDefault();
          e.target.click();
        }).on('click.slider', function(e) {
          e.preventDefault();
          if (self.isDisabled()) {
            return;
          }

          var mouseX = e.pageX - self.wrapper.offset().left - $(document).scrollLeft(),
            mouseY = e.pageY - self.wrapper.offset().top - $(document).scrollTop(),
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

          // Convert the coordinates of the mouse click to a value
          var val = mouseX / self.wrapper.width() * 100, // TODO: Make an option to have this work Vertically if we need it later
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

        });

        return self;
      },

      activateHandle: function(handle) {
        handle.addClass('is-active');
      },

      deactivateHandle: function(handle) {
        handle.removeClass('is-active');
      },

      convertValueToPercentage: function(value) {
        return (((value - this.settings.min) / (this.settings.max - this.settings.min)) * 100);
      },

      convertPercentageToValue: function(percentage) {
        return (percentage / 100) * (this.settings.max - this.settings.min) + this.settings.min;
      },

      // Gets a 10% increment/decrement as a value within the range of minimum and maximum values.
      getIncrement: function() {
        var increment = 0.1 * (this.settings.max - this.settings.min);
        if (this.settings.step !== undefined && increment <= this.settings.step) {
          increment = this.settings.step;
        }
        return increment;
      },

      handleKeys: function(e, self) {
        if (self.isDisabled()) {
          return;
        }

        var key = e.which,
          handle = $(e.currentTarget);

        // If the keycode got this far, it's an arrow key, Page Up, Page Down, HOME, or END.
        switch(key) {
          case 33: // Page Up increases the value by 10%
            self.increaseValue(e, handle, undefined, this.getIncrement());
            break;
          case 34: // Page Down decreases the value by 10%
            self.decreaseValue(e, handle, undefined, this.getIncrement());
            break;
          case 35: // End key sets the handle to its lowest possible value (either minimum value or as low as the "lower" handle)
            self.decreaseValue(e, handle, this.settings.min);
            break;
          case 36: // Home key sets the spinbox to its maximum value
            self.increaseValue(e, handle, this.settings.max);
            break;
          case 38: case 39: // Right and Up increase the spinbox value
            self.increaseValue(e, handle);
            break;
          case 37: case 40: // Left and Down decrease the spinbox value
            self.decreaseValue(e, handle);
            break;
        }
      },

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

      // Changes the position of the bar and handles based on their values.
      updateRange: function() {
        var self = this,
          newVal = this.value(),
          percentages = [],
          color = this.getColorClosestToValue();

        for (var i = 0; i < this.ticks.length; i++) {
          var condition = !this.settings.range ? this.ticks[i].value <= newVal[0] :
            newVal[0] < this.ticks[i].value && this.ticks[i].value <= newVal[1];

          if (condition) {
            this.ticks[i].element.addClass('complete');
            if (color) {
              this.ticks[i].element.css('background-color', color);
            }
          } else {
            this.ticks[i].element.removeClass('complete');
            if (color) {
              this.ticks[i].element.css('background-color', '');
            }
          }
        }

        if (color) {
          this.range.css('background-color', color);
          $.each(this.handles, function(i, handle) {
            handle.css({
              'background-color' : color,
              'border-color' : color
            });
          });
        }

        // Change the text color of ticks if either handle value matches their value
        var lowerTicks = this.ticks.filter(function(obj) {
          return obj.value === newVal[0];
        }) || [],
          higherTicks = [];
        if (this.handles[1]) {
          higherTicks = this.ticks.filter(function(obj) {
            return obj.value === newVal[1];
          }) || [];
        }

        // Remove any text colors that already existed.
        $.each(self.ticks, function(i) {
          self.ticks[i].label.css('color', '');
        });

        // Set the text colors to the background color of the tick
        if (lowerTicks.length > 0) {
          lowerTicks[0].label.css('color', lowerTicks[0].element.css('background-color'));
        }
        if (higherTicks.length > 0) {
          higherTicks[0].label.css('color', higherTicks[0].element.css('background-color'));
        }


        // Convert the stored values from ranged to percentage
        percentages[0] = this.convertValueToPercentage(newVal[0]);
        if (newVal[1] !== undefined) {
          percentages[1] = this.convertValueToPercentage(newVal[1]);
        }

        // If no arguments are provided, update both handles with the latest stored values.
        if (!this.handles[1]) {
          this.range.css({
            'left' : '0%',
            'right' : (100 - percentages[0]) + '%'
          });
        } else {
          this.range.css({
            'left': percentages[0] + '%',
            'right': (100 - percentages[1]) + '%'
          });
        }
        this.handles[0].css('left', 'calc(' + percentages[0] + '% - ' + this.handles[0].outerWidth()/2 + 'px)');
        if (this.handles[0].hasClass('is-animated')) {
          this.handles[0].data('animationTimeout', setTimeout( function() {
            self.handles[0].removeClass('is-animated').trigger('slide-animation-end');
            self.range.removeClass('is-animated');
          }, 201));
        }

        if (this.handles[1]) {
          this.handles[1].css('left', 'calc(' + percentages[1] + '% - ' + this.handles[1].outerWidth()/2 + 'px)');
          if (this.handles[1].hasClass('is-animated')) {
            this.handles[1].data('animationTimeout', setTimeout( function() {
              self.handles[1].removeClass('is-animated').trigger('slide-animation-end');
              self.range.removeClass('is-animated');
            }, 201));
          }
        }
      },

      // Allows a handle to animate to a new position if the difference in value is greater
      // than 3% of the size of the range.
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

      updateTooltip: function(handle) {
        if (!this.settings.tooltip) {
          return;
        }
        var tooltip = handle.data('tooltip');
        function update() {
          tooltip.setContent();
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

      getColorClosestToValue: function() {
        var val = this.value()[0],
          highestTickColor;
        for (var i = 0; i < this.ticks.length; i++) {
          if (this.ticks[i].color && val >= this.ticks[i].value) {
            highestTickColor = this.ticks[i].color;
          }
        }

        return highestTickColor;
      },

      // External Facing Function to set the value
      // works as percent for now but need it on ticks
      value: function(minVal, maxVal) {
        var self = this;

        // if both options are absent, act as a getter and return the current value
        if (minVal === undefined && maxVal === undefined) {
          return self._value;
        }

        // if an array is passed as the first argument, break it apart
        if (minVal && isArray(minVal)) {
          if (minVal[1] !== undefined) {
            maxVal = minVal[1];
          }
          minVal = minVal[0];
        }

        // set the values back to the existing one if they aren't passed.
        if (minVal === undefined && isArray(self._value) && self._value[0] !== undefined) {
          minVal = self._value[0];
        }
        if (maxVal === undefined && isArray(self._value) && self._value[1] !== undefined) {
          maxVal = self._value[1];
        }

        //set the internal value and the element's retrievable value.
        self._value = [minVal, maxVal];
        self.element.val(maxVal !== undefined ? self._value : self._value[0]);
        $.each(self.handles, function(i, handle) {
          handle.attr({
            'aria-valuenow': self._value[i],
            'aria-valuetext': self.getModifiedTextValue(self._value[i])
          });
        });
        self.element.trigger('change');
        return self._value;
      },

      // Returns a value with prefixed/suffixed text content.
      // Used by the tooltip and default ticks to get potential identifiers like $ and %.
      getModifiedTextValue: function(content) {
        if (!this.settings.tooltip) {
          return content;
        }
        return this.settings.tooltip[0] + content + this.settings.tooltip[1];
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.wrapper.removeClass('is-disabled');
        return this;
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.wrapper.addClass('is-disabled');
        return this;
      },

      isDisabled: function() {
        return this.element.prop('disabled');
      },

      destroy: function() {
        var self = this;
        $.each(self.handles, function (i, handle) {
          handle.off('mousedown.slider click.slider blur.slider drag.slider keydown.slider keyup.slider dragstart dragend');
        });
        this.wrapper.off('click.slider touchend.slider touchcancel.slider').remove();
        this.element.attr('type', this.originalElement.type);
        $.removeData(this.element[0], pluginName);
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, defaults, options);
        // Settings and markup are complicated in the slider so we just destroy and re-invoke it
        // with fresh settings.
        instance.element.removeAttr('value');
        instance.destroy();
        instance.element.slider(instance.settings);
      } else {
        instance = $.data(this, pluginName, new Slider(this, settings));
      }
    });
  };
}));
