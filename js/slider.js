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
          value: 50
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function() {
        var self = this,
            updateBar = function(args) {
              var leftWidth = (args.left / self.element.parent().width());
              self.value(leftWidth*100);
            };

        self.handles = self.element.find('.slider-handle');
        self.range = self.element.find('.slider-range');
        self.value(settings.value);

        self.handles.draggable({constrainTo: 'parent', axis: 'x', clone: false})
          .on('mousedown.slider', function () {
            $(this).focus();
          })
          .on('click.slider', function (e) {
            e.preventDefault(); //Prevent from jumping to top.
          })
          .on('drag.slider', function (e, args) {
            updateBar(args);
          });
      },

      // External Facing Function to set the value
      // works as percent for now but need it on ticks
      value: function(val) {
        var self = this;

        self._value = val;
        self.range.css('width', val + '%');
        self.handles.css('left', val + '%');
        //set the ranges
        return self._value;
      },

      destroy: function() {
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
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
