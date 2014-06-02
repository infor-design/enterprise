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
          value: 0
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
        var self = this;

        self.handles = self.element.find('.slider-handle');
        self.range = self.element.find('.slider-range');
        self.value(settings.value);

        self.handles.draggable({constrainTo: 'parent', axis: 'x'})
            .on('click.slider', function (e) {
              e.preventDefault(); //Prevent from jumping to top.
            })
            .on('drag.slider', function (e, args, obj) {
              var vals = obj.getMovementValues(),
                leftWidth = (vals.pos.x + (self.handles.width()));

              self.value(leftWidth);
            });
            //TODO: Fix when you 'throw' it or remove kenetics
           /* .on('rest.slider', function (e, args, obj) {

              var vals = obj.getMovementValues(),
                leftWidth = (vals.ev.x - (self.handles.css('left')));

              self.value(leftWidth);
            });*/
      },
      value: function(val) {
        var self = this,
          leftWidth = 0;

        self._value = val;
        leftWidth = ((self._value - (self.handles.width() /2)) / parseInt(self.element.css('width'), 10)) * 100;
        self.range.css('width', leftWidth + '%');
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
