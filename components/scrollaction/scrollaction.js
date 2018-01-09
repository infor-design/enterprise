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

  $.fn.scrollaction = function(options) {

    var pluginName = 'scrollaction';
    var defaults = {
      scrollActionTarget: '.js-scroll-target', // The element to add a class to based on scrolling logic
      classToAdd: 'scrolled-down' // The class added to the target element
    };

    var functions = {
      trackScrolling: function() {
        var self = this;
        self.lastScrollTop = 0;

        this.element.scroll(function() {
          var st = $(this).scrollTop();

          if (st > self.lastScrollTop){
            $(self.settings.scrollActionTarget).addClass(self.settings.classToAdd);
          } else {
            $(self.settings.scrollActionTarget).removeClass(self.settings.classToAdd);
          }

          self.lastScrollTop = st;
        });
      }
    };

    /**
     * A component that applies a class based on scroll direction
     * @constructor
     * @param {object} [element=this] - The element to attach to (only when manually calling the constructor)
     * @param {object} [options]
     * @param {string} [options.scrollActionTarget='.js-scroll-target'] - The selector of the element to add the class to
     * @param {string} [options.classToAdd='scrolled-down'] - The class name
     */
    function ScrollAction(element, options) {
      this.settings = $.extend({}, defaults, options);
      this.element = $(element);
      functions.trackScrolling.call(this);
    }

    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new ScrollAction(this, options));
      }
    });
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
