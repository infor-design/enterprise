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

  window.Soho = window.Soho || {};
  window.Soho.behaviors = window.Soho.behaviors || {};

  /**
   * HideFocus Behavior
   * Only shows the focus state on key entry (tabs or arrows).
   * @param {HTMLElement|SVGElement} element
   * @returns {HideFocus}
   */
  function HideFocus(element) {
    return this.init(element);
  }

  HideFocus.prototype = {
    init: function(element) {
      if (!this.element && (element instanceof HTMLElement || element instanceof SVGElement)) {
        this.element = element;
      }

      var $el = $(element),
        isClick = false,
        isFocused = false,
        labelClicked = false;

      // Checkbox, Radio buttons or Switch
      if ($el.is('.checkbox, .radio, .switch')) {
        var label = $el.next();
        if (label.is('[type="hidden"]')) {
          label = label.next();
        }
        this.label = label[0];

        $el.addClass('hide-focus')
          .on('focusin.hide-focus', function(e) {
            if (!isClick && !isFocused && !labelClicked) {
              $el.removeClass('hide-focus');
              $el.triggerHandler('hidefocusremove', [e]);
            }
            isClick = false;
            isFocused = true;
            labelClicked = false;
          })
          .on('focusout.hide-focus', function(e) {
            $el.addClass('hide-focus');
            labelClicked = label.is(labelClicked);
            isClick = false;
            isFocused = false;
            $el.triggerHandler('hidefocusadd', [e]);
          });

        label.on('mousedown.hide-focus', function(e) {
          labelClicked = this;
          isClick = true;
          $el.addClass('hide-focus');
          $el.triggerHandler('hidefocusadd', [e]);
        });
      }

      // All other elements (ie. Hyperlinks)
      else {
        $el.addClass('hide-focus')
          .on('mousedown.hide-focus touchstart.hide-focus', function(e) {
            isClick = true;
            $el.addClass('hide-focus');
            $el.triggerHandler('hidefocusadd', [e]);
          })
          .on('focusin.hide-focus', function(e) {
            if (!isClick && !isFocused) {
              $el.removeClass('hide-focus');
              $el.triggerHandler('hidefocusremove', [e]);
            }
            isClick = false;
            isFocused = true;
          })
          .on('focusout.hide-focus', function(e) {
            $el.addClass('hide-focus');
            isClick = false;
            isFocused = false;
            $el.triggerHandler('hidefocusadd', [e]);
          });
      }

      return this;
    },

    updated: function() {
      return this
        .teardown()
        .init();
    },

    teardown: function() {
      if (this.label) {
        $(this.label).off('mousedown.hide-focus');
      }

      var elemEvents = [
        'focusin.hide-focus',
        'focusout.hide-focus',
        'mousedown.hide-focus',
        'touchstart.hide-focus'
      ];
      $(this.element).off(elemEvents.join(' '));

      return this;
    }
  };

  window.Soho.behaviors.hideFocus = HideFocus;

  $.fn.hideFocus = function() {
    return this.each(function() {
      var instance = $.data(this, 'hidefocus');
      if (instance) {
        instance.updated();
      } else {
        instance = $.data(this, 'hidefocus', new HideFocus(this));
        instance.destroy = function destroy() {
          this.teardown();
          $.removeData(this, 'hidefocus');
        };
      }
    });
  };


  /**
   * Allows for the smooth scrolling of an element's content area.
   * @param {HTMLElement|SVGElement|jQuery[]} el - The element being manipulated.
   * @param {Number} target - target distance.
   * @param {Number} duration - the time that will be needed for the scrolling to complete.
   * @returns {$.Deferred}
   */
  window.Soho.behaviors.smoothScrollTo = function(el, target, duration) {
    var dfd = $.Deferred();

    if (!Soho.DOM.isElement(el)) {
      // Not a workable element
      return dfd.reject();
    }

    // Strip the jQuery
    if (el instanceof $ && el.length) {
      el = el[0];
    }

    // undefined (not zero) target should instantly resolve
    if (target === undefined || target === null) {
      return dfd.resolve();
    }

    if (isNaN(duration)) {
      duration = 0;
    }

    target = Math.round(target);
    duration = Math.round(duration);

    if (duration < 0) {
      // bad duration
      return dfd.fail();
    }

    if (duration === 0) {
      el.scrollLeft = el.scrollLeft + target;
      return dfd.resolve();
    }

    var startTime = Date.now(),
      endTime = startTime + duration,
      startLeft = el.scrollLeft,
      distance = target /*- startLeft*/;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    function smoothStep(start, end, point) {
      if (point <= start) { return 0; }
      if (point >= end) { return 1; }
      var x = (point - start) / (end - start); // interpolation
      return x*x*(3 - 2*x);
    }

    // This is to keep track of where the element's scrollLeft is
    // supposed to be, based on what we're doing
    var previousLeft = el.scrollLeft;

    // This is like a think function from a game loop
    function scrollFrame() {
      if (el.scrollLeft !== previousLeft) {
        // interrupted
        dfd.reject();
        return;
      }

      // set the scrollLeft for this frame
      var now = Date.now();
      var point = smoothStep(startTime, endTime, now);
      var frameLeft = Math.round(startLeft + (distance * point));
      el.scrollLeft = frameLeft;

      // check if we're done!
      if (now >= endTime) {
        dfd.resolve();
        return;
      }

      // If we were supposed to scroll but didn't, then we
      // probably hit the limit, so consider it done; not
      // interrupted.
      if (el.scrollLeft === previousLeft && el.scrollLeft !== frameLeft) {
        dfd.resolve();
        return;
      }
      previousLeft = el.scrollLeft;

      // schedule next frame for execution
      setTimeout(scrollFrame, 0);
    }

    // boostrap the animation process
    setTimeout(scrollFrame, 0);

    return dfd;
  };


  /**
   * Binds the Soho Behavior _smoothScrollTo()_ to a jQuery selector
   * @param {Number} target - target distance to scroll the element
   * @param {Number} duration - the time that will be needed for the scrolling to complete.
   * @returns {$.Deferred}
   */
  $.fn.smoothScroll = function(target, duration) {
    return window.Soho.behaviors.smoothScrollTo(this, target, duration);
  };


  /**
   * Uses 'requestAnimationFrame' or 'setTimeout' to defer a function
   * @returns {requestAnimationFrame|setTimeout}
   */
  window.Soho.behaviors.defer = function defer(callback, timer) {
    var deferMethod = typeof window.requestAnimationFrame !== 'undefined' ? window.requestAnimationFrame : setTimeout;
    return deferMethod(callback, timer);
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
