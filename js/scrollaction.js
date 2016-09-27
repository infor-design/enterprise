
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

  /**
  * Scroll Action Control
  */
  $.fn.scrollaction = function(options) {

    // Tab Settings and Options
    var pluginName = 'scrollaction',
        defaults = {
          scrollActionTarget: '.js-scroll-target' // The element to add a class to based on scrolling logic
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ScrollAction(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    ScrollAction.prototype = {

      init: function() {
        this.trackScrolling();
        return this;
      },

      /**
       * Attach scrolling logic to specified element
       */
      trackScrolling: function() {
        var self = this;
        self.lastScrollTop = 0;

        this.element.scroll(function() {
          var st = $(this).scrollTop();

          if (st > self.lastScrollTop){
            self.didScrollDown();
          } else {
            self.didScrollUp();
          }

          self.lastScrollTop = st;
        });
      },

      /**
       * Slide element down on scroll up
       */
      didScrollUp: function() {
        $(this.settings.scrollActionTarget).removeClass('scrolled-down');
      },

      /**
       * Slide element up on scroll down
       */
      didScrollDown: function() {
        $(this.settings.scrollActionTarget).addClass('scrolled-down');
      }

    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new ScrollAction(this, settings));
      }
    });
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
