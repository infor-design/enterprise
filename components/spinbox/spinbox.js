/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  $.fn.spinbox = function(options, args) {
    'use strict';

    // Settings and Options
    var pluginName = 'spinbox',
        defaults = {
          min: null,
          max: null,
          step: null
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Spinbox(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Spinbox.prototype = {

      init: function() {
        this.settings = $.extend({}, settings);
        this.inlineLabel = this.element.closest('label');
        this.inlineLabelText = this.inlineLabel.find('.label-text');
        this.isInlineLabel = this.element.parent().is('.inline');
        this.isWrapped = this.element.parent().is('.spinbox-wrapper');

        this
          .setInitialValue()
          .addMarkup()
          .bindEvents()
          .setWidth();
      },

      setWidth: function() {
        var style = this.element[0].style;

        if (style.width) {
          this.element.parent()[0].style.width = style.width;
          this.element[0].style.width = (parseInt(style.width) - (this.element.parent().find('.down').outerWidth() * 2)) + 'px';
        }

        return this;
      },

      // Sanitize the initial value of the input field.
      setInitialValue: function() {
        var self = this,
          val = self.checkForNumeric(self.element.val());

        this.element.val(val);
        // If using Dirty Tracking, reset the "original" value of the dirty tracker to the current value
        // of the input, since it may have changed after re-invoking the input field.
        if (this.element.attr('data-trackdirty')) {
          this.element.data('original', val);
        }

        //allow numeric input on iOS
        var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
        if (iOS) {
          this.element.attr('pattern','\\d*');
        }

        if (this.settings.max) {
          this.element.attr('max', this.settings.max);
        }
        if (this.settings.step) {
          this.element.attr('step', this.settings.step);
        }
        if (this.settings.min) {
          this.element.attr('min', this.settings.min);
        }


        return this;
      },

      addMarkup: function() {
        var self = this;
        if (this.isInlineLabel) {
          this.inlineLabel.addClass('spinbox-wrapper');
        }
        else if (!this.isWrapped) {
          this.element.wrap('<span class="spinbox-wrapper"></span>');
        }

        this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (this.isWrapped) {
          this.buttons = {
            'down' : this.element.parent().find('.down').button(),
            'up' : this.element.parent().find('.up').button()
          };

          if (this.isTouch) {
            this.buttons.down.attr('aria-hidden', 'true');
            this.buttons.up.attr('aria-hidden', 'true');
          }
        }

        if (!this.buttons) {
          this.buttons = {
            'down' : $('<span ' + (this.isTouch ? '' : 'aria-hidden="true"') + ' class="spinbox-control down">-</span>').insertBefore(this.element).button(),
            'up' : $('<span ' + (this.isTouch ? '' : 'aria-hidden="true"') + ' class="spinbox-control up">+</span>').insertAfter(this.element).button()
          };
        }

        // Figure out minimum/maximum and data-masking attributes.  The user can provide the spinbox
        // plugin either the min/max or the mask, and the plugin will automatically figure out how to
        // use them.
        var min = this.element.attr('min'),
          max = this.element.attr('max'),
          mask = this.element.attr('data-mask'),
          maskSize, maskValue = '',
          attributes = {
            role: 'spinbutton'
          },
          i = 0;

        // Define a default Max value if none of these attributes exist, to ensure the mask plugin will
        // work correctly.  Cannot define a Min value here because the plugin must be able to invoke itself
        // with a NULL value.
        if (!min && !max && !mask) {
          max = '9999999';
        }

        // If a mask doesn't exist, but min and max values do exist, create a mask that reflects those min/max values
        if ((min || max) && !mask) {
          var newMask = '',
            tempMin = min ? min : '',
            tempMax = max ? max : '',
            longerVal = tempMin.length > tempMax.length ? tempMin : tempMax;
          i = 0;

          while (i <= longerVal.length) {
            newMask += '#';
            i++;
          }

          // Add a negative symbol to the mask if it exists within the longer value.
          if (tempMin.indexOf('-') !== -1 || tempMax.indexOf('-') !== -1) {
            newMask = '-' + newMask.substring(0, (newMask.length - 1));
          }

          attributes['data-mask'] = newMask;
          mask = newMask;
        }

        // If a "data-mask" attribute is already defined, use it to determine missing values for min/max, if they
        // don't already exist.
        maskSize = mask.length;
        i = 0;
        while (i <= maskSize) {
          maskValue += '9';
          i++;
        }

        // If no negative symbol exists in the mask, the minimum value must be zero.
        if (mask.indexOf('-') === -1) {
          attributes.min = min ? min : 0;
          attributes.max = max ? max : maskValue;
        } else {
          attributes.min = min ? min : maskValue;
          attributes.max = max ? max : maskValue.substring(0, (maskValue.length - 1));
        }

        if (!this.element.attr('data-mask-mode') || this.element.attr('data-mask-mode') !== 'number') {
          attributes['data-mask-mode'] = 'number';
        }

        // Destroy the Mask Plugin if it's already been invoked.  We will reinvoke it later on during
        // initialization.  Check to make sure its the actual Mask plugin object, and not the "data-mask"
        // pattern string.
        if (this.element.data('mask') && typeof this.element.data('mask') === 'object') {
          this.element.data('mask').destroy();
        }

        // Add Aria Properties for valuemin/valuemax
        if (min) {
          attributes['aria-valuemin'] = min;
        }
        if (max) {
          attributes['aria-valuemax'] = max;
        }
        this.element.attr(attributes);

        // Set an initial "aria-valuenow" value.
        this.updateAria(self.element.val());

        // Invoke the mask plugin
        this.element.mask();

        // Disable in full if the settings have determined we need to disable on init.
        if (this.isDisabled()) {
          this.disable();
        }

        return this;
      },

      /**
       * Sets up event handlers for this control and its sub-elements
       *
       * @listens Spinbox#events
       * @param {Object} focus  &nbsp;-&nbsp;
       * @param {Object} blur  &nbsp;-&nbsp;
       * @param {Object} keydown  &nbsp;-&nbsp;
       * @param {Object} keypress  &nbsp;-&nbsp;
       * @param {Object} keyup  &nbsp;-&nbsp;
       * @param {Object} afterpaste  &nbsp;-&nbsp;
       */
      bindEvents: function() {
        var self = this,
          preventClick = false;

        // Main Spinbox Input
        this.element.on('focus.spinbox', function() {
          self.element.parent('.spinbox-wrapper').addClass('is-focused');
        }).on('blur.spinbox', function() {
          self.element.parent('.spinbox-wrapper').removeClass('is-focused');
          // Explicitly trigger the change event if the "original" value is different from its current value.
          // Prevents an issue where changing the value with arrow keys doesn't trigger the "change" event on blur.
          self.element.trigger('change');
        }).on('keydown.spinbox', function(e) {
          self.handleKeyDown(e, self);
        }).on('keypress.spinbox', function(e) {
          self.handleKeyPress(e, self);
        }).on('keyup.spinbox', function(e) {
          self.handleKeyup(e, self);
        }).on('afterpaste.mask', function() {
          self.handleAfterPaste(self);
        });

        // Up and Down Buttons
        var buttons = this.buttons.up.add(this.buttons.down[0]);
        buttons.on('touchstart.spinbox mousedown.spinbox', function(e) {
          if (e.which === 1) {

            if (!preventClick) {
              self.handleClick(e);
            }

            if (self.isTouch) {
              return;
            }

            preventClick = true;
            self.enableLongPress(e, self);

            $(document).one('mouseup', function() {
              self.disableLongPress(e, self);
              preventClick = false;
              self.element.focus();
            });

            //Stop MouseDown From Running
            if (this.isTouch) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
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
        if (this.isDisabled() || e.which !== 1) {
          return;
        }
        var target = $(e.currentTarget);
        if (target.hasClass('up')) {
          this.increaseValue();
        } else {
          this.decreaseValue();
        }

        if (!this.isTouch) {
          this.element.focus();
        } else {
          target.focus();
        }
      },

      handleKeyDown: function(e, self) {
        var key = e.which,
          validKeycodes = [35, 36, 37, 38, 39, 40];

        if ($.inArray(key, validKeycodes) === -1) {
          return;
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
            if (Locale.isRTL() && key === 39) {
              self.addButtonStyle(self.buttons.down);
              self.decreaseValue();
            } else {
              self.addButtonStyle(self.buttons.up);
              self.increaseValue();
            }
            break;
          case 37: case 40: // Left and Down decrease the spinbox value
            if (Locale.isRTL() && key === 37) {
              self.addButtonStyle(self.buttons.up);
              self.increaseValue();
            } else {
              self.addButtonStyle(self.buttons.down);
              self.decreaseValue();
            }
            break;
        }
      },

      handleKeyPress: function(e, self) {
        if (self.isDisabled()) {
          return;
        }
        var key = e.which;

        // NOTE:
        if (key < 48 || (key > 57 && key < 96) || key > 105) {
          return;
        }

        // If the key is a number, pre-calculate the value of the number to see if it would be
        // greater than the maximum, or less than the minimum.  If it's fine, let it through.
        // Doing this check here prevents visual jitter.
        var num = Number(this.checkForNumeric(this.element.val())), // if using Numlock, subtract 48 to get the correct value from String.fromCharCode()
          min = self.element.attr('min'),
          max = self.element.attr('max');

        if (num < min) {
          e.preventDefault();
          return self.updateVal(min);
        }
        if (num > max) {
          e.preventDefault();
          return self.updateVal(max);
        }
      },

      handleKeyup: function(e, self) {
        if (self.isDisabled()) {
          return;
        }
        var key = e.which;

        // Spinbox Control Button styles are added/removed on keyup.
        switch (key) {
          case 38: case 39:
            if (Locale.isRTL() && key === 39) {
              self.removeButtonStyle(self.buttons.down);
            } else {
              self.removeButtonStyle(self.buttons.up);
            }
            break;
          case 37: case 40:
            if (Locale.isRTL() && key === 39) {
              self.removeButtonStyle(self.buttons.up);
            } else {
              self.removeButtonStyle(self.buttons.down);
            }
            break;
        }

        self.updateAria(self.element.val());
      },

      // Change a newly pasted value to this element's min or max values, if the pasted value goes
      // beyond either of those limits.  Listens to an event emitted by the Mask plugin after pasted content
      // is handled.
      handleAfterPaste: function(self) {
        var min = Number(self.element.attr('min')),
          max = Number(self.element.attr('max')),
          val = Number(self.element.val());

        val = (val < min ? min : (val > max ? max : val));
        self.updateVal(val);
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
        // Allow for NULL
        if (val === '') {
          return val;
        }
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
        var min = this.element.attr('min'),
          max = this.element.attr('max');

        val = this.checkForNumeric(val);
        this.element.attr('aria-valuenow', (val !== '' ? val : ''));

        // Tougle min/max buttons
        this.setIsDisabled(this.buttons.up, (val !== '' && max && val >= max) ? 'disable' : 'enable');
        this.setIsDisabled(this.buttons.down, (val !== '' && min && val <= min) ? 'disable' : 'enable');
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

      setIsDisabled: function(button, isDisabled) {
        isDisabled = isDisabled === undefined ? true :
          (!isDisabled || isDisabled === 'enable') ? false : true;

        button[isDisabled ? 'addClass' : 'removeClass']('is-disabled');
      },

      // Teardown
      destroy: function() {
        var mask = this.element.data('mask');
        if (mask && typeof mask.destroy === 'function') {
          mask.destroy();
        }

        for (var button in this.buttons) {
          var buttonAPI = $(button).data('button');

          if (buttonAPI) {
            buttonAPI.destroy();
          }
        }

        this.buttons.up.off('click.spinbox mousedown.spinbox');
        this.buttons.up.remove();
        this.buttons.down.off('click.spinbox mousedown.spinbox');
        this.buttons.down.remove();
        this.element.off('focus.spinbox blur.spinbox keydown.spinbox keyup.spinbox');
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
        instance = $.data(this, pluginName, new Spinbox(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
