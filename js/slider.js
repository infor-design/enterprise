/**
* Touch Enabled/ Responsive and Accessible Slider Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
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
          step: undefined
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Slider(element) {
      this.element = $(element);
      this.init();
    }

    // Check if an object is an array
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
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
        this.settings.value = this.element.attr('value') !== undefined ? parseInt(this.element.attr('value')) : this.element.val() !== '' ? parseInt(this.element.val()) : settings.value;
        this.settings.min = this.element.attr('min') !== undefined ? parseInt(this.element.attr('min')) : settings.min;
        this.settings.max = this.element.attr('max') !== undefined ? parseInt(this.element.attr('max')) : settings.max;
        this.settings.range = this.element.attr('data-range') !== undefined ? (this.element.attr('data-range') === 'true') : settings.range;
        this.settings.step = !isNaN(this.element.attr('step')) ? Number(this.element.attr('step')) : settings.step;

        // build tick list
        if (this.element.attr('list')) {
          var tickOptions = $('datalist#' + this.element.attr('list'));
          this.ticks = [];
          tickOptions.find('option').each(function(i, option) {
            self.ticks.push({
              description: $(option).text(),
              value: parseInt($(option).val())
            });
            if ($(option).attr('data-color')) {
              self.ticks[i].color = $(option).attr('data-color');
            }
          });
        }

        // configure the slider to deal with an array of values
        if (!isArray(this.settings.value)) {
          this.settings.value = [this.settings.value];
        }
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
        self.range = $('<div class="slider-range"></div>').appendTo(self.wrapper);

        // Handles
        self.handles = [];
        self.handles.push($('<a href="#" class="slider-handle' + (self.settings.range ? ' lower' : '') +'" tabindex="0"></a>').text(self.settings.range ? 'Lower' : 'Handle'));
        if (self.settings.range) {
          self.handles.push($('<a href="#" class="slider-handle higher" tabindex="1"></a>').text('Higher'));
        }
        $.each(self.handles, function(i, handle) {
          // Add WAI-ARIA to the handles
          self.element.attr({
            'role' : 'slider',
            'aria-orientation' : 'horizontal',
            'aria-valuemin' : self.settings.min,
            'aria-valuemax' : self.settings.max,
            'aria-label' : self.element.prev('label').text()
          });
          handle.appendTo(self.wrapper);
        });

        // Ticks
        if (self.ticks) {
          for (var i = 0; i < self.ticks.length; i++) {
            var tickId = (self.element.attr('id') + '-tick-' + i),
              leftTickPos = 'calc(' + self.convertValueToPercentage(self.ticks[i].value) + '% - 6px)';
            self.ticks[i].element = $('<a href="#" id="'+ tickId +'" class="tick" data-value="'+ self.ticks[i].value +'" ></a>');
            self.ticks[i].label = $('<label for="' + tickId + '">' + self.ticks[i].description + '</label>');
            self.ticks[i].element.css('left', leftTickPos);
            self.wrapper.append(self.ticks[i].label).append(self.ticks[i].element);

            var leftLabelPos = 'calc(' + self.convertValueToPercentage(self.ticks[i].value) + '% - '+ self.ticks[i].label.outerWidth()/2 +'px)';
            self.ticks[i].label.css('left', leftLabelPos);
          }
        }

        self.value(self.settings.value);
        self.updateRange();

        if (this.element.prop('disabled') === true) {
          this.disable();
        }

        return self;
      },

      bindEvents: function() {
        var self = this;

        function updateHandleFromDraggable(e, handle, args) {
          var val = (args.left / (self.element.parent().width() - handle.outerWidth())) * 100,
            rangeVal = self.convertPercentageToValue(val);

          // Ranged values need to check to make sure that the higher-value handle doesn't drawindowg past the
          // lower-value handle, and vice-versa.
          if (self.settings.range) {
            var originalVal = self.value();
            if (handle.hasClass('higher') && rangeVal <= originalVal[0]) {
              e.preventDefault();
              return;
            }
            if (handle.hasClass('lower') && rangeVal >= originalVal[1]) {
              e.preventDefault();
              return;
            }
          }

          // Round the value to the nearest step, if the step is defined
          if (self.settings.step) {
            rangeVal = Math.round(rangeVal / self.settings.step) * self.settings.step;
          }

          if (!e.defaultPrevented) {
            self.value(handle.hasClass('higher') ? [undefined, rangeVal] : [rangeVal]);
            self.updateRange();
          }
          return;
        }

        $.each(self.handles, function (i, handle) {
          handle.draggable({containment: 'parent', axis: 'x', clone: false})
          .on('mousedown.slider', function () {
            $(this).focus();
          })
          .on('click.slider', function (e) {
            e.preventDefault(); //Prevent from jumping to top.
          })
          .on('drag.slider', function (e, args) {
            updateHandleFromDraggable(e, $(e.currentTarget), args);
          });
        });

        if (this.ticks) {
          $.each(self.ticks, function(i, tick) {
            $(tick.element, tick.label).on('click', function (e) {
              e.preventDefault();
              if (!self.handles[1]) {
                self.value([tick.value]);
              }
              // TODO: Support for Ranged Value
              // Need to set closest handle to the correct value.
              self.updateRange();
            });
          });
        }

        return self;
      },

      convertValueToPercentage: function(value) {
        return (((value - this.settings.min) / (this.settings.max - this.settings.min)) * 100);
      },

      convertPercentageToValue: function(percentage) {
        return (percentage / 100) * (this.settings.max - this.settings.min) + this.settings.min;
      },

      // Changes the position of the bar and handles based on their values.
      updateRange: function() {
        var newVal = this.value(),
          percentages = [];

        if (this.ticks) {
          var color = this.getColorClosestToValue();

          for (var i = 0; i < this.ticks.length; i++) {
            var condition = !this.settings.range ? this.ticks[i].value <= newVal[0] : newVal[0] < this.ticks[i].value && this.ticks[i].value <= newVal[1];
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
        }

        // Convert the stored values from ranged to percentage
        percentages[0] = this.convertValueToPercentage(newVal[0]);
        if (newVal[1]) {
          percentages[1] = this.convertValueToPercentage(newVal[1]);
        }

        // If no arguments are provided, update both handles with the latest stored values.
        if (!this.handles[1]) {
          this.range.css('width', percentages[0] + '%');
        } else {
          this.range.css({
            'width': (percentages[1] - percentages[0]) + '%',
            'left': percentages[0] + '%'
          });
        }
        this.handles[0].css('left', 'calc(' + percentages[0] + '% - ' + this.handles[0].outerWidth()/2 + 'px)').attr('aria-valuenow', newVal[0]);

        if (this.handles[1]) {
          this.handles[1].css('left', 'calc(' + percentages[1] + '% - ' + this.handles[1].outerWidth()/2 + 'px)').attr('aria-valuenow', newVal[1]);
        }
      },

      getColorClosestToValue: function() {
        if (!this.ticks) {
          return undefined;
        }

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
          if (minVal[1]) {
            maxVal = minVal[1];
          }
          minVal = minVal[0];
        }

        // set the values back to the existing one if they aren't passed.
        if (minVal === undefined && isArray(self._value) && self._value[0]) {
          minVal = self._value[0];
        }
        if (maxVal === undefined && isArray(self._value) && self._value[1]) {
          maxVal = self._value[1];
        }

        //set the internal value and the element's retrievable value.
        self._value = [minVal, maxVal];
        self.element.val(maxVal ? self._value : self._value[0]);
        return self._value;
      },

      enable: function() {
        this.disabled = false;
        this.element.prop('disabled', false);
        this.wrapper.removeClass('is-disabled');
      },

      disable: function() {
        this.disabled = true;
        this.element.prop('disabled', true);
        this.wrapper.addClass('is-disabled');
      },

      destroy: function() {
        var self = this;
        $.each(self.handles, function (i, handle) {
          handle.off('mousedown.slider click.slider drag.slider');
        });
        if (this.ticks) {
          $.each(self.ticks, function(i, tick) {
            $(tick.element, tick.label).off('click.slider');
          });
        }
        this.wrapper.remove();
        this.element.attr('type', this.originalElement.type);
        $.removeData(this.obj, pluginName);
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
      } else {
        instance = $.data(this, pluginName, new Slider(this, settings));
      }
    });
  };
}));
