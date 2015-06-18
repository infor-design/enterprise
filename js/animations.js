/**
* Height Animation Controls (TODO: bitly link to soho xi docs)
* Adapted from: http://n12v.com/css-transition-to-from-auto/
* Contains a handful of animation helper methods that attempt to DRY up CSS-powered sliding animations.
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

  // Use CSS Transitions to animate from "0" to "auto" widths
  $.fn.animateOpen = function(options) {
    'use strict';

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
        $self = $(this),
        eventName = $.fn.transitionEndName(),
        dim = settings.direction === 'horizontal' ? 'width' : 'height',
        cDim = dim.charAt(0).toUpperCase() + dim.slice(1),
        distance = !isNaN(settings.distance) ? parseInt(settings.distance, 10) + 'px' : 'auto',
        timeout;

      function transitionEndCallback() {
        if (timeout) {
          clearTimeout(timeout);
        }
        $self.off(eventName + '.animateOpen');
        self.style.transition = '';
        $self.trigger('animateOpenComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $self.one('animateOpenStart.animation', function(e) {
        e.stopPropagation();
        $self.off(eventName + '.animateOpen');
      });
      $self.trigger('animateOpenStart');

      // Trigger the callback either by Timeout or by TransitionEnd
      if (eventName) {
        $self.one(eventName + '.animateOpen', transitionEndCallback);
      }

      // Animate
      var prevVal = this.style[dim];
      this.style[dim] = distance;
      var endVal = getComputedStyle(this)[dim];
      this.style[dim] = prevVal;
      // next line forces a repaint
      this['offset' + cDim]; // jshint ignore:line
      this.style.transition = dim + ' ' + settings.timing + 'ms ' + settings.transition;

      timeout = setTimeout(transitionEndCallback, settings.timing);
      this.style[dim] = endVal;

      // Trigger immediately if this element is invisible or has the 'no-transition' class
      if ($self.is(':hidden') || $self.is('.no-transition')) {
        transitionEndCallback();
      }
    });
  };

  // Use CSS Transitions to animate from "auto" to "0" widths
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
        $self = $(this),
        eventName = $.fn.transitionEndName(),
        dim = settings.direction === 'horizontal' ? 'width' : 'height',
        cDim = dim.charAt(0).toUpperCase() + dim.slice(1),
        timeout;

      function transitionEndCallback() {
        if (timeout) {
          clearTimeout(timeout);
        }
        $self.off(eventName + '.animatedClosed');
        self.style.transition = '';
        $self.trigger('animateClosedComplete');
      }

      // Clear any previous attempt at this animation when the animation starts new
      $self.one('animateClosedStart', function(e) {
        e.stopPropagation();
        $self.off(eventName + '.animatedClosed');
      });
      $self.trigger('animateClosedStart');

      // Trigger the callback either by Timeout or by TransitionEnd
      if (eventName) {
        $self.one(eventName + '.animatedClosed', transitionEndCallback);
      }

      // Animate
      this.style[dim] = getComputedStyle(this)[dim];
      // next line forces a repaint
      this['offset' + cDim]; // jshint ignore:line
      this.style.transition = dim + ' ' + settings.timing + 'ms ' + settings.transition;

      timeout = setTimeout(transitionEndCallback, settings.timing);
      this.style[dim] = '0px';

      // Trigger immediately if this element is invisible or has the 'no-transition' class
      if ($self.is(':hidden') || $self.is('.no-transition')) {
        transitionEndCallback();
      }
    });
  };

  // Extends the jQuery $.css() method to vendor-prefix newer CSS properties that are still in Draft specification
  $.fn.cssVendorProp = function(prop, value) {

    // Settings
    var defaults = {
        propertyName: '', // Name of the CSS property that can be changed
        propertyValue: '' // Value to set the property to
      },
      incomingOptions = {},
      settings;

    if (!prop) {
      console.warn('$.fn.cssVendorProp was not invoked on element ' + this + ' because no property name was given.');
      return;
    }

    if (typeof prop === 'object') {
      incomingOptions = prop;
    }

    if (typeof prop === 'string') {
      incomingOptions.propertyName = prop;
      if (value !== undefined) {
        incomingOptions.propertyValue = value;
      }
    }

    settings = $.extend({}, defaults, incomingOptions);

    // Initialize the plugin (Once)
    return this.each(function() {
      var prefixes = ['-moz-', '-ms-', '-o-', '-webkit-', ''];

      // Sanitize
      settings.propertyName = settings.propertyName.toString();
      settings.propertyValue = settings.propertyValue.toString();

      for (var i = 0; i < prefixes.length; i++) {
        $(this).css(prefixes[i] + settings.propertyName, settings.propertyValue);
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
