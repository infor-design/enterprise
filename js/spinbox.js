/**
* Spinbox Control (link to docs)
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  $.fn.spinbox = function(options) {

    // Settings and Options
    var pluginName = 'spinbox',
        defaults = {
          propertyName: 'defaultValue'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        var self = this;
        self
          .addMarkup()
          .bindEvents();
      },

      addMarkup: function() {
        if (this.element.parent('.spinbox-wrapper').length === 0) {
          this.element.wrap('<div class="spinbox-wrapper"></div>');
        }
        if (!this.buttons) {
          this.buttons = {
            'down' : $('<span class="spinbox-control down">-</span>').insertBefore(this.element),
            'up' : $('<span class="spinbox-control up">+</span>').insertAfter(this.element)
          };
        }

        // Add Aria Properties
        this.element.attr({
          'role' : 'spinbutton'
        });

        return this;
      },

      bindEvents: function() {
        var self = this;

        this.element.on('focus.spinbox', function() {
          self.element.parent('.spinbox-wrapper').addClass('is-focused');
        }).on('blur.spinbox', function() {
          self.element.parent('.spinbox-wrapper').removeClass('is-focused');
        }).on('keydown.spinbox keypress.spinbox keyup.spinbox', function(e) {
          self.handleKeys(e, self);
        });

        this.buttons.up.on('click.spinbox', function(e) {
          self.handleClick(e);
        });

        this.buttons.down.on('click.spinbox', function(e) {
          self.handleClick(e);
        });

        return this;
      },

      handleClick: function(e) {
        var target = $(e.currentTarget);

        if (target.hasClass('up')) {
          this.increaseValue();
        } else {
          this.decreaseValue();
        }
      },

      handleKeys: function(e, self) {
        var key = e.which,
          type = e.originalEvent.type;

        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(key, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
          // Allow: Ctrl+A
          (key === 65 && key === true) ||
          // Allow: home, end, left, right
          (key >= 35 && key <= 39)) {
          // let it happen, don't do anything
          return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
          e.preventDefault();
        }

        if (type === 'keyDown') {

        }

        if (type === 'keyPress') {

        }
      },

      increaseValue: function() {
        var val = this.checkForNumeric( this.element.val() );
        this.element.val( val + 1 );
        this.element.focus();
      },

      decreaseValue: function() {
        var val = this.checkForNumeric( this.element.val() );
        this.element.val( val - 1 );
        this.element.focus();
      },

      checkForNumeric: function(val) {
        if ( $.isNumeric(val) ) {
          return Number(val);
        }
        val = parseInt(val);
        if ( $.isNumeric(val) ) {
          return Number(val);
        }
        // Zero out the value if a number can't be made out of it.
        return 0;
      },

      // Teardown
      destroy: function() {
        this.element.off('focus.spinbox blur.spinbox');
        this.element.unwrap();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
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
