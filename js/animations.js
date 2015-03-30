/**
* Height Animation Controls (TODO: bitly link to soho xi docs)
* Idea borrowed from: http://n12v.com/css-transition-to-from-auto/
* Contains a handful of animation helper methods that attempt to DRY up CSS-powered sliding animations.
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
        'WebkitTransition' :'webkitTransitionEnd',
        'MozTransition'    :'transitionend',
        'MSTransition'     :'msTransitionEnd',
        'OTransition'      :'oTransitionEnd',
        'transition'       :'transitionend'
      };

    return eventNames[prop] || null;
  };

  // Use CSS to animate from "0" to "auto" widths
  $.fn.animateOpen = function(options) {

    // Settings and Options
    var defaults = {
        direction: 'vertical', // Can also be 'horizontal'
        distance: 'auto', // Distance in pixels that the animation covers.  'auto', or pixel value size
        timing: 300, // in Miliseconds
        transition: 'cubic-bezier(.17, .04, .03, .94)' // CSS Transition Timing Function
      },
      settings = $.extend({}, defaults, options);

    // Initialize the plugin (Once)
    return this.each(function() {
      var self = this,
        eventName = $.fn.transitionEndName(),
        dim = settings.direction === 'horizontal' ? 'width' : 'height',
        cDim = dim.charAt(0).toUpperCase() + dim.slice(1),
        distance = !isNaN(settings.distance) ? parseInt(settings.distance, 10) + 'px' : 'auto',
        timeout;

      function transitionEndCallback() {
        if (!eventName) {
          clearTimeout(timeout);
        }

        self.style.transition = '';
        self.style[dim] = distance;
        $(self).trigger('animateOpenComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $(this).one('animateOpenStart.animation', function(e) {
        e.stopPropagation();
        $(this).off(eventName + '.animation');
      });
      $(this).trigger('animateOpenStart');

      // Trigger the callback either by Timeout or by TransitionEnd
      if (eventName) {
        $(this).one(eventName + '.animation', transitionEndCallback);
      } else {
        // Fallback for non-"transitionEnd" browsers
        timeout = setTimeout(transitionEndCallback, settings.timing);
      }

      // Animate
      var prevVal = this.style[dim];
      this.style[dim] = distance;
      var endVal = getComputedStyle(this)[dim];
      this.style[dim] = prevVal;
      // next line forces a repaint
      this['offset' + cDim]; // jshint ignore:line
      this.style.transition = dim + ' ' + settings.timing + 'ms ' + settings.transition;
      this.style[dim] = endVal;
    });
  };


  // Use CSS to animate from "auto" to "0" widths
  $.fn.animateClosed = function(options) {

    // Settings and Options
    var defaults = {
        direction: 'vertical', // can also be 'horizontal'
        timing: 300, // in Miliseconds
        transition: 'cubic-bezier(.17, .04, .03, .94)'
      },
      settings = $.extend({}, defaults, options);

    // Initialize the plugin (Once)
    return this.each(function() {
      var self = this,
        eventName = $.fn.transitionEndName(),
        dim = settings.direction === 'horizontal' ? 'width' : 'height',
        cDim = dim.charAt(0).toUpperCase() + dim.slice(1),
        timeout;

      function transitionEndCallback() {
        if (!eventName) {
          clearTimeout(timeout);
        }
        self.style.transition = '';
        $(self).trigger('animateClosedComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $(this).one('animateClosedStart', function(e) {
        e.stopPropagation();
        $(this).off(eventName + '.animation');
      });
      $(this).trigger('animateClosedStart');

      // Trigger the callback either by Timeout or by TransitionEnd
      if (eventName) {
        $(this).one(eventName + '.animation', transitionEndCallback);
      } else {
        timeout = setTimeout(transitionEndCallback, settings.timing);
      }

      // Animate
      this.style[dim] = getComputedStyle(this)[dim];
      // next line forces a repaint
      this['offset' + cDim]; // jshint ignore:line
      this.style.transition = dim + ' ' + settings.timing + 'ms ' + settings.transition;
      this.style[dim] = '0px';
    });
  };

}));
