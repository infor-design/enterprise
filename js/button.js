/**
* Button Control - Adds wripple effect
*/

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

  $.fn.button = function() {

    'use strict';

    // Settings and Options
    var pluginName = 'button';

    // Plugin Constructor
    function Button(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Button.prototype = {
      init: function() {
        var self = this;

        this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (this.element.hasClass('btn-menu')) {
          var ddIcon = this.element.children('.icon').filter(function() {
            return $(this).find('use').attr('xlink:href','#icon-dropdown');
          });
          if (!ddIcon.length) {
            this.element.append($('<svg class="icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><use xlink:href="#icon-dropdown"></use></svg>'));
          }
        }

        if (this.element.hasClass('btn-actions') && !this.element.data('tooltip')) {
          this.element.attr('title', Locale.translate('MoreActions')).tooltip();
        }

        this.element.on('touchstart.button mousedown.button', function (e) {
          if (!self.isTouch && e.which !== 1) {
            return false;
          }

          if (self.isTouch && e.type === 'mousedown') {
            return false;
          }

          if (self.element.attr('disabled')) {
            return false;
          }

          var element = $(this);

          // If the ripple wrapper does not exists, create it
          if (!element.find('.ripple-wrapper').length) {
            element.append('<div class=ripple-wrapper></div>');
          }

          var wrapper = $(this).find('.ripple-wrapper'),
            wrapperOffset = wrapper.offset(),
            relX,
            relY;

          if (!self.isTouch) {
            // Get the mouse position relative to the ripple wrapper
            relX = e.pageX - wrapperOffset.left;
            relY = e.pageY - wrapperOffset.top;
          } else {
            // Make sure the user is using only one finger and then get the touch position relative to the ripple wrapper
            e = e.originalEvent;

            if (e.touches.length === 1) {
              relX = e.touches[0].pageX - wrapperOffset.left;
              relY = e.touches[0].pageY - wrapperOffset.top;
            } else {
              return;
            }
          }

          // Make the new ripple
          var ripple = $('<div></div>').addClass('ripple')
            .css({'left': relX, 'top': relY});

          wrapper.append(ripple);

          // Make sure the ripple has the styles applied (ugly hack but it works)
          (function() { return window.getComputedStyle(ripple[0]).opacity; })();

          // Set the new size
          var size = (Math.max($(this).outerWidth(), $(this).outerHeight()) / ripple.outerWidth()) * 2.5;

          // Decide if use CSS transitions or jQuery transitions
          // Start the transition
          ripple.css({
            '-ms-transform': 'scale(' + size + ')',
            '-moz-transform': 'scale(' + size + ')',
            '-webkit-transform': 'scale(' + size + ')',
            'transform': 'scale(' + size + ')'
          });
          ripple.addClass('ripple-on');
          ripple.data('animating', 'on');
          ripple.data('mousedown', 'on');

          // This function is called when the transition 'on' ends
          setTimeout(function() {
            ripple.data('animating', 'off');
            if (ripple.data('mousedown') === 'off') {
              self.rippleOut(ripple);
            }
          }, 400);

          // On mouseup or on mouseleave, set the mousedown flag to 'off' and try to destroy the ripple
          element.on('mouseup.button mouseleave.button', function() {
            ripple.data('mousedown', 'off');
            // If the transition 'on' is finished then we can destroy the ripple with transition 'out'
            if (ripple.data('animating') === 'off') {
              self.rippleOut(ripple);
            }
          });
        });
      },

      // Fade out the ripple and then destroy it
      rippleOut: function(ripple) {
        // Unbind events from ripple
        ripple.off();

        // Start the out animation
        ripple.addClass('ripple-out');

        // This function is called when the transition "out" ends
        ripple.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
          ripple.remove();
        });
      },

      destroy: function() {
        this.element.off('touchstart.button mousedown.button mouseup.button mouseleave.button');
        var wrapper = this.element.find('.ripple-wrapper'),
          ripples = wrapper.find('.ripple');
        if (ripples.length) {
          ripples.remove();
        }
        wrapper.remove();

        if (this.element.hasClass('btn-actions')) {
          this.element.data('tooltip').destroy();
        }

        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Button(this));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
