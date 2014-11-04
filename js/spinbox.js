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

  $.fn.spinbox = function(options, args) {

    // Settings and Options
    var pluginName = 'spinbox',
        defaults = {},
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
        var self = this;
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
        var attributes = {
          role : 'spinbutton'
        };
        if (this.element.attr('min')) {
          attributes['aria-valuemin'] = this.element.attr('min');
        }
        if (this.element.attr('max')) {
          attributes['aria-valuemax'] = this.element.attr('max');
        }
        this.element.attr(attributes);

        // Set an initial "aria-valuenow" value.
        this.updateAria(self.element.val());

        // Disable in full if the settings have determined we need to disable on init.
        if (this.isDisabled()) {
          this.disable();
        }

        return this;
      },

      bindEvents: function() {
        var self = this;

        // Main Spinbox Input
        this.element.on('focus.spinbox', function() {
          self.element.parent('.spinbox-wrapper').addClass('is-focused');
        }).on('blur.spinbox', function() {
          self.element.parent('.spinbox-wrapper').removeClass('is-focused');
        }).on('keydown.spinbox keypress.spinbox', function(e) {
          self.handleKeys(e, self);
        }).on('keyup.spinbox', function(e) {
          self.handleKeyup(e, self);
        }).on('input.spinbox', function() {
          self.handleInput(self);
        });

        // Up Button
        this.buttons.up.on('click.spinbox', function(e) {
          self.handleClick(e);
        }).on('mousedown.spinbox', function(e) {
          self.enableLongPress(e, self);
          $(document).one('mouseup', function() {
            self.disableLongPress(e, self);
          });
        });

        // Down Button
        this.buttons.down.on('click.spinbox', function(e) {
          self.handleClick(e);
        }).on('mousedown.spinbox', function(e) {
          self.enableLongPress(e, self);
          $(document).one('mouseup', function() {
            self.disableLongPress(e, self);
          });
        });

        return this;
      },

      enableLongPress: function(e, self) {
        self.addButtonStyle(e);
        self.longPressInterval = setInterval(function() {
          if ($(e.currentTarget).is(':hover')) {
            self.handleClick(e);
          }
        }, 140);
      },

      disableLongPress: function(e, self) {
        self.removeButtonStyle(e);
        clearInterval(self.longPressInterval);
        self.longPressInterval = null;
      },

      // Sets up the click/long press
      handleClick: function(e) {
        if (this.isDisabled()) {
          return;
        }
        var target = $(e.currentTarget);
        if (target.hasClass('up')) {
          this.increaseValue();
        } else {
          this.decreaseValue();
        }
        this.element.focus();
      },

      handleKeys: function(e, self) {
        if (self.isDisabled()) {
          return;
        }
        var key = e.which;

        // Allow: backspace, delete, tab, escape, and enter
        if ($.inArray(key, [46, 8, 9, 27, 13, 110]) !== -1 ||
          // Allow: Ctrl+A
          (key === 65 && key === true)) {
          // let it happen, don't do anything
          return;
        }

        // Add a negative sign into the mix if its keycode is detected and no numbers are present.
        if ($.inArray(key, [45, 109, 189]) !== -1) {
          e.preventDefault();
          var val = self.element.val();
          if (val.length === 0) {
            self.updateVal('-');
          }
        }

        // If the keypress isn't a number, stop the keypress
        if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105 )) {
          e.preventDefault();
        }

        // If the key is a number, pre-calculate the value of the number to see if it would be
        // greater than the maximum, or less than the minimum.  If it's fine, let it through.
        // Doing this check here prevents visual jitter.
        if (key > 47 && key < 58) {
          var num = Number(this.checkForNumeric(this.element.val()) + String.fromCharCode(key)),
            min = self.element.attr('min'),
            max = self.element.attr('max');

          if (num < min) {
            e.preventDefault();
            self.updateVal(min);
          }
          if (num > max) {
            e.preventDefault();
            self.updateVal(max);
          }
        }

        // If the keycode got this far, it's an arrow key, HOME, or END.
        switch(key) {
          case 35: // End key sets the spinbox to its minimum value
            if (self.element.attr('min')) { self.element.val(self.element.attr('min')); }
            break;
          case 36: // Home key sets the spinbox to its maximum value
            if (self.element.attr('max')) { self.element.val(self.element.attr('max')); }
            break;
          case 38: case 39: // Right and Up increase the spinbox value
            self.addButtonStyle(self.buttons.up);
            self.increaseValue();
            break;
          case 37: case 40: // Left and Down decrease the spinbox value
            self.addButtonStyle(self.buttons.down);
            self.decreaseValue();
            break;
        }

      },

      handleKeyup: function(e, self) {
        if (self.isDisabled()) {
          return;
        }
        // Spinbox Control Button styles are added/removed on keyup.
        switch (e.which) {
          case 38: case 39:
            self.removeButtonStyle(self.buttons.up);
            break;
          case 37: case 40:
            self.removeButtonStyle(self.buttons.down);
            break;
        }
      },

      // Ensures that "aria-valuenow" is still modified when only typing numbers in by hand, and not using
      // the arrow keys or button controls.
      handleInput: function(self) {
        if (self.isDisabled()) {
          return;
        }
        self.updateAria(this.element.val());
      },

      increaseValue: function() {
        var val = this.checkForNumeric(this.element.val()) + Number(this.element.attr('step') || 1);
        if (this.element.attr('max') && val > this.element.attr('max')) {
          return;
        }
        this.updateVal(val);
      },

      decreaseValue: function() {
        var val = this.checkForNumeric(this.element.val()) - Number(this.element.attr('step') || 1);
        if (this.element.attr('min') && val < this.element.attr('min')) {
          return;
        }
        this.updateVal(val);
      },

      updateVal: function(newVal) {
        this.element.val(newVal);
        this.updateAria(newVal);
        this.element.focus();
      },

      // Sanitizes the value of the input field to an integer if it isn't already established.
      checkForNumeric: function(val) {
        if ($.isNumeric(val)) {
          return Number(val);
        }
        val = parseInt(val);
        if ($.isNumeric(val)) {
          return Number(val);
        }
        // Zero out the value if a number can't be made out of it.
        return 0;
      },

      // Updates the "aria-valuenow" property on the spinbox element if the value is currently set
      updateAria: function(val) {
        this.element.attr('aria-valuenow', (val !== '' ? val : ''));
      },

      // adds a "pressed-in" styling for one of the spinner buttons
      addButtonStyle: function(e) {
        if (this.isDisabled()) {
          return;
        }
        var target = e;
        if (e.currentTarget) {
          target = $(e.currentTarget);
        }
        target.addClass('is-active');
      },

      // removes "pressed-in" styling for one of the spinner buttons
      removeButtonStyle: function(e) {
        if (this.isDisabled()) {
          return;
        }
        var target = e;
        if (e.currentTarget) {
          target = $(e.currentTarget);
        }
        target.removeClass('is-active');
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.element.parent('.spinbox-wrapper').removeClass('is-disabled');
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.element.parent('.spinbox-wrapper').addClass('is-disabled');
      },

      isDisabled: function() {
        return this.element.prop('disabled');
      },

      // Teardown
      destroy: function() {
        this.buttons.up.off('click.spinbox mousedown.spinbox');
        this.buttons.down.off('click.spinbox mousedown.spinbox');
        this.element.off('focus.spinbox blur.spinbox keydown.spinbox keypress.spinbox keyup.spinbox input.spinbox');
        this.element.unwrap();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
