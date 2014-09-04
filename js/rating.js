/**
* Rating Control
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

  $.fn.rating = function(options) {

     // Tab Settings and Options
    var pluginName = 'rating',
        defaults = {
          propertyName: 'defaultValue'
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
        this.handleEvents();
        this.allInputs = this.element.find('input');
        this.readonly();
      },
      handleEvents: function () {
        var self = this;

        this.element.on('change', 'input', function () {
          if ($(this).closest('.rating').hasClass('is-readonly')) {
            return;
          }
          var idx = $(this).index()/2;
          self.val(idx+1);
        });
      },
      val: function(value) {
        var i, chkIdx, self = this;
        if (!value) {
          return this.currentValue;
        }

        this.currentValue = parseFloat(value, 10);
        chkIdx = Math.round(this.currentValue);

        for (i = 0; i < this.allInputs.length; i++) {
          var input = $(this.allInputs[i]);

          if (i < value) {
            input.addClass('is-filled').removeClass('is-half');
          } else {
            input.removeClass('is-filled').removeClass('is-half');
          }

          //Handle Half Star
          input.next('label').find('use').attr('xlink:href', '#icon-star');

          if (i+1 === chkIdx) {
            input.prop('checked', true);
          }

          if (chkIdx !== self.currentValue && i+1 === chkIdx) {
           input.addClass('is-half').next('label').find('use').attr('xlink:href', '#icon-halfstar');
          }
        }
        if (chkIdx <= 0) {
          $(this.allInputs[0]).prop('checked', true);
        }

        return this.currentValue;
      },
      readonly: function() {
        var elem = $(this.element);
        if (elem.hasClass('is-readonly')) {
          elem.find('input').attr('disabled','');
        }
      },
      enable: function() {
        var elem = $(this.element);
        elem.removeClass('is-readonly').find('input').removeAttr('disabled');
      }
    };

    // Keep the Chaining while Initializing the Control (Only Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
