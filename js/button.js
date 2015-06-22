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

          var element = $(this);
          element.addClass('hide-focus');

          if (self.element.attr('disabled')) {
            return false;
          }

          if (!self.isTouch && e.which !== 1) {
            return false;
          }

          var btnOffset = element.offset(),
            xPos = e.pageX - btnOffset.left,
            yPos = e.pageY - btnOffset.top;

          if (self.isTouch) {
            // Make sure the user is using only one finger and then get the touch position relative to the ripple wrapper
            e = e.originalEvent;

            if (e.touches.length === 1) {
              xPos = e.touches[0].pageX - btnOffset.left;
              yPos = e.touches[0].pageY - btnOffset.top;
            }
          }

          element.find('svg.ripple-effect').remove();
          var ripple = $('<svg class="ripple-effect"><circle r="'+0+'"></circle></svg>');
          ripple.css('left', xPos).css('top', yPos);
          element.prepend(ripple);

          setTimeout(function(){
            ripple.remove();
          }, 1000);

        }).on('focusout.button', function () {
          var self = $(this);

          setTimeout(function() {
            self.removeClass('hide-focus');
          }, 1);
        });

      },

      destroy: function() {
        this.element.off('touchstart.button mousedown.button mouseup.button mouseleave.button');
        this.element.off('focusout.button');

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
