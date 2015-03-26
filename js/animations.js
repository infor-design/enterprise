/**
* Height Animation Controls (TODO: bitly link to soho xi docs)
* Idea borrowed from: http://n12v.com/css-transition-to-from-auto/
*/

(function(factory) {
  'use strict';

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

  'use strict';

  // Transition Support Check
  // Returns the vendor-prefixed name of the 'transition' property available by the browser.
  // If the browser doesn't support transitions, it returns null.
  $.fn.transitionSupport = function() {
    var el = $('<div></div>')[0],
      prop = 'transition',
      prefixes = ['Moz', 'Webkit', 'O', 'ms'],
      prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    if (prop in el.style) {
      $(el).remove();
      return prop;
    }

    for (var i = 0; i < prefixes.length; i++) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in el.style) {
        $(el).remove();
        return vendorProp;
      }
    }

    $(el).remove();
    return null;
  };

  // Returns the name of the TransitionEnd event.
  $.fn.transitionEndName = function() {
    var prop = $.fn.transitionSupport(),
      eventNames = {
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
      };

    return eventNames[prop] || null;
  };

  // Use CSS to animate from "0" to "auto" widths
  $.fn.animateOpen = function(options) {

    // Settings and Options
    var defaults = {
        timing: 300, // in Miliseconds
        transition: 'cubic-bezier(.17, .04, .03, .94)'
      },
      settings = $.extend({}, defaults, options);

    // Initialize the plugin (Once)
    return this.each(function() {
      $(this).trigger('animateOpenStart');
      var prevHeight = this.style.height;
      this.style.height = 'auto';
      var endHeight = getComputedStyle(this).height;
      this.style.height = prevHeight;
      // next line forces a repaint
      this.offsetHeight // jshint ignore:line
      this.style.transition = 'height ' + settings.timing + 'ms ' + settings.transition;
      this.style.height = endHeight;

      var self = this,
        eventName = $.fn.transitionEndName(),
        timeout;

      function transitionEndCallback() {
        if (!eventName) {
          clearTimeout(timeout);
        }

        self.style.transition = '';
        self.style.height = 'auto';
        $(self).trigger('animateOpenComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $(this).one('animateOpenStart.animation', function() {
        $(this).off(eventName);
      });

      if (eventName) {
        $(this).one(eventName + '.animation', transitionEndCallback);
      } else {
        // Fallback for non-"transitionEnd" browsers
        timeout = setTimeout(transitionEndCallback, settings.timing);
      }

    });
  };


  // Use CSS to animate from "auto" to "0" widths
  $.fn.animateClosed = function(options) {

    // Settings and Options
    var defaults = {
        timing: 300, // in Miliseconds
        transition: 'cubic-bezier(.17, .04, .03, .94)'
      },
      settings = $.extend({}, defaults, options);

    // Initialize the plugin (Once)
    return this.each(function() {
      $(this).trigger('animateClosedStart');
      this.style.height = getComputedStyle(this).height;
      this.style.transition = 'height ' + settings.timing + 'ms ' + settings.transition;
      // next line forces a repaint
      this.offsetWidth; // jshint ignore:line
      this.style.height = '0px';

      var self = this,
        eventName = $.fn.transitionEndName(),
        timeout;

      function transitionEndCallback() {
        if (!eventName) {
          clearTimeout(timeout);
        }
        $(self).trigger('animateClosedComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $(this).one('animateClosedStart', function() {
        $(this).off(eventName + '.animation');
      });

      if (eventName) {
        $(this).one(eventName + '.animation', transitionEndCallback);
      } else {
        timeout = setTimeout(transitionEndCallback, settings.timing);
      }
    });
  };

}));
