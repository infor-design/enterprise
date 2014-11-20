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
          min: undefined,
          max: undefined
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
        settings.value = this.element.attr('value') !== undefined ? this.element.attr('value') : this.element.val() !== '' ? this.element.val() : settings.value;
        settings.min = this.element.attr('min') || settings.min;
        settings.max = this.element.attr('max') || settings.max;

        if (!settings.min && settings.max) {
          settings.min = settings.max;
          settings.max = undefined;
        }

        // configure the slider to deal with an array of values if we have min and max ranges
        if (settings.min && settings.max) {
          settings.value = [].push(settings.value);
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
        self.label = self.element.prev('label').addClass('hidden');

        // Build the slider controls
        self.wrapper = $('<div class="slider-wrapper"></div>').attr('id', self.element.attr('id') + '-slider').insertAfter(self.element);
        self.range = $('<div class="slider-range"></div>').appendTo(self.wrapper);

        // Handles
        self.handles = [];
        self.handles.push($('<a href="#" class="slider-handle' + (settings.min ? ' min' : '') +'"></a>').text(settings.min ? 'Min' : 'Handle'));
        if (settings.min && settings.max) {
          self.handles.push($('<a href="#" class="slider-handle max"></a>').text('Max'));
        }
        $.each(self.handles, function(i, handle) {
          handle.appendTo(self.wrapper);
        });

        self.value(settings.value);
        self.updateRange();

        return self;
      },

      bindEvents: function() {
        var self = this;

        function updateHandleFromDraggable(handle, args) {
          var leftWidth = ((args.left) / self.element.parent().width());
          if (handle.hasClass('max')) {
            self.value([null, leftWidth*100]);
          } else {
            self.value([leftWidth*100]);
          }

          self.updateRange();
        }

        $.each(self.handles, function(i, handle) {
          handle.draggable({containment: 'parent', axis: 'x', clone: false})
          .on('mousedown.slider', function () {
            $(this).focus();
          })
          .on('click.slider', function (e) {
            e.preventDefault(); //Prevent from jumping to top.
          })
          .on('drag.slider', function (e, args) {
            updateHandleFromDraggable($(e.currentTarget), args);
          });
        });

        return self;
      },

      // Changes the position of the bar and handles based on their values.
      updateRange: function() {
        var newVal = this.value();
        if (!this.handles[1]) {
          this.range.css('width', newVal[0] + '%');
        } else {
          this.range.css({
            'width': (newVal[1] - newVal[0]) + '%',
            'left': newVal[0] + '%'
          });
        }
        this.handles[0].css('left', newVal[0] + '%');
        if (this.handles[1]) {
          this.handles[1].css('left', newVal[1] + '%');
        }
      },

      // External Facing Function to set the value
      // works as percent for now but need it on ticks
      value: function(minVal, maxVal) {
        var self = this;

        // if both options are absent, act as a getter and return the current value
        if (!minVal && !maxVal) {
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
        if (!minVal && isArray(self._value) && self._value[0]) {
          minVal = self._value[0];
        }
        if (!maxVal && isArray(self._value) && self._value[1]) {
          maxVal = self._value[1];
        }

        //set the ranges
        self._value = [minVal, maxVal];
        return self._value;
      },

      destroy: function() {
        this.wrapper.remove();
        this.label.removeClass('hidden');
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
