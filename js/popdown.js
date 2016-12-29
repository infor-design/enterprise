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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.popdown = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'popdown',
        defaults = {},
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Popdown(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Popdown.prototype = {

      init: function() {
        return this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        var self = this;
        this.popdown = $();

        // Setup the proper trigger element to use
        this.trigger = this.element;
        if (this.trigger.is('.dropdown, .multiselect')) {
          this.trigger = $('#' + this.element.attr('id') + '-shdo');
        }

        // Find the correct element to use as the popdown's view.
        function tryPopdownElement(elem) {
          if (!elem) { return false; }

          if (typeof elem === 'string') {
            if (!elem.match('#') || elem.indexOf('#') !== 0) {
              elem = '#' + elem;
            }
            elem = $(elem);
          }

          if (elem.length) {
            self.popdown = elem;
            return true;
          }

          return false;
        }

        var popdownElem = tryPopdownElement(this.trigger.attr('data-popdown'));
        if (!popdownElem) {
          tryPopdownElement(this.trigger.next('.popdown'));
        }

        // Setup an ID for this popdown if it doesn't already have one
        this.id = this.popdown.attr('id');
        if (!this.id) {
          this.id = 'popdown-' + $('body').find('.popdown').index(this.popdown);
          this.popdown.attr('id', this.id);
        }

        return this;
      },

      build: function() {
        // Ensure the popdown window is a popdown, and remove any hidden classes from it.
        this.popdown.addClass('popdown').removeClass('hidden');

        // Wrap the contents inside for spacing purposes
        var contents = this.popdown.children('.popdown-contents');
        if (!contents.length) {
          this.popdown.children().wrap('<div class="popdown-contents"></div>');
        }

        // Add the arrow markup if it doesn't already exist
        this.arrow = $('<div class="arrow"></div>').prependTo(this.popdown);

        this.place();

        // Expand if necessary
        var ariaExpanded = this.trigger.attr('aria-expanded');
        if (!ariaExpanded || ariaExpanded === undefined) {
          this.trigger.attr('aria-expanded', '');
        }
        if (ariaExpanded === 'true') {
          this.open();
        }

        // aria-controls for the trigger element
        this.trigger.attr('aria-controls', this.id);

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.trigger
          .onTouchClick('popdown')
          .on('click.popdown', function() {
            self.toggle();
          })
          .on('updated.popdown', function() {
            self.updated();
          });

        return this;
      },

      isOpen: function() {
        return this.trigger.attr('aria-expanded') === 'true';
      },

      open: function() {
        if (this.isAnimating) {
          return;
        }

        var self = this,
          setFocusinEvent = false;

        this.isAnimating = true;
        this.trigger.attr('aria-expanded', 'true');
        this.position();
        this.popdown.addClass('visible');

        // Setup events that happen on open
        // Needs to be on a timer to prevent automatic closing of popdown.
        setTimeout(function() {
          self.popdown.one('focusin.popdown', function() {
            if (!setFocusinEvent) {
              setFocusinEvent = true;
              $(document).on('focusin.popdown', function(e) {
                var target = e.target;
                if (!$.contains(self.popdown[0], target)) {
                  self.close();
                }
              });
            }
          });

          $(window).on('resize.popdown', function() {
            if (!$(document.activeElement).closest('.popdown').length) {
              self.close();
            }
          });

          $(document).on('click.popdown', function(e) {
            var target = $(e.target);

            if (!target.is('.popdown') && !target.closest('.popdown').length) {
              self.close();
            }
          });

          self.isAnimating = false;
        }, 400);
      },

      close: function() {
        if (this.isAnimating) {
          return;
        }

        var self = this;
        this.isAnimating = true;
        this.trigger.attr('aria-expanded', 'false');
        this.popdown.removeClass('visible');

        // Turn off events
        this.popdown.off('focusin.popdown');
        $(window).off('resize.popdown');
        $(document).off('click.popdown focusin.popdown');

        // Sets the element to "display: none" to prevent interactions while hidden.
        setTimeout(function() {
          self.popdown.css('display', 'none');
          self.isAnimating = false;
        }, 400);
      },

      toggle: function() {
        if (this.isOpen()) {
          this.close();
          return;
        }
        this.open();
      },

      // Detaches Popdown Element and places at the body tag root, or at the root of the nearest
      // scrollable parent.
      place: function() {
        this.scrollparent = $('body');
        this.popdown.detach().appendTo(this.scrollparent);
      },

      position: function() {
        var parent = {
          offset: {
            left: 0,
            top: 0
          },
          scrollDistance: {
            left: 0,
            top: 0
          }
        },
        winH = window.innerHeight + $(document).scrollTop(),
        // subtract 2 from the window width to account for the tooltips
        // resizing themselves to fit within the CSS overflow boundary.
        winW = (window.innerWidth - 2) + $(document).scrollLeft();

        // Reset adjustments to panel and arrow
        this.popdown.removeAttr('style');
        this.arrow.removeAttr('style');

        // Add/subtract offsets if a scrollable parent element is involved
        if (this.scrollparent.length) {
          parent.offset = this.scrollparent.offset();
          parent.scrollDistance.top = this.scrollparent.scrollTop();
          parent.scrollDistance.left = this.scrollparent.scrollLeft();
          winH = winH - (parent.offset.top + parent.scrollDistance.top);
          winW = winW - (parent.offset.left + parent.scrollDistance.left);
        }

        var adjustX = false,
          adjustY = false,
          t = this.trigger,
          to = t.offset(), // Trigger offset
          arrowHeight = 11,
          XoffsetFromTrigger = 0,
          YoffsetFromTrigger = 0,
          po; // Popover offset

        // Place the popdown below to start
        this.popdown.addClass('bottom').css({ 'left': to.left,
                           'top': to.top + t.outerHeight(true) + arrowHeight });

        this.arrow.css({ 'left': t.outerWidth(true)/2,
                         'top': 0 - arrowHeight });

        // Get the newly-set values for the popdown's offset
        po = this.popdown.offset();

        // Get deltas for popdown position if the button is off either X edge
        if (po.left < 0) { // Checking the left edge
          adjustX = true;
          XoffsetFromTrigger = 0 - po.left;
        }
        var rightEdgePos = po.left + this.popdown.outerWidth(true);
        if (rightEdgePos > winW) { // Checking the right edge
          adjustX = true;
          XoffsetFromTrigger = rightEdgePos - winW + (Locale.isRTL() ? 20 : 0);
        }

        if (adjustX) {
          // Adjust the X position based on the deltas
          this.popdown.css({ 'left': po.left + (XoffsetFromTrigger * -1) });

          var popdownRect = this.popdown[0].getBoundingClientRect(),
            triggerRect = t[0].getBoundingClientRect(),
            deltaRightEdge = popdownRect.right - triggerRect.right + 10;

          this.arrow.css({ 'left': 'auto', 'right': deltaRightEdge + 'px' });

          // Get the newly set values
          po = this.popdown.offset();
        }

        // Get the deltas for popdown position if the button is off either Y edge
        if (po.top < 0) { // Checking top edge
          adjustY = true;
          YoffsetFromTrigger = 0 - po.top;
        }
        var bottomEdgePos = po.top + this.popdown.outerHeight(true);
        if (bottomEdgePos > winH) { // Checking the bottom edge
          adjustY = true;
          YoffsetFromTrigger = bottomEdgePos - winH;
        }

        // Remove the arrow if we need to adjust this, since it won't line up anymore
        if (adjustY) {
          this.arrow.css('display', 'none');

          // Adjust the Y position based on the deltas
          this.popdown.css({ 'top': po.top + (YoffsetFromTrigger * -1) });
          this.arrow.css({ 'top': parseInt(this.arrow.css('top')) - (YoffsetFromTrigger * -1) });

          // Get the values again
          po = this.popdown.offset();
        }

        // One last check of the Y edges.  At this point, if either edge is out of bounds, we need to
        // shrink the height of the popdown, as it's too tall for the viewport.
        if (po.top < 0 || po.top + this.popdown.outerHeight(true) > winH) {
          this.popdown.css({'top': 0 });
          po = this.popdown.offset();

          bottomEdgePos = po.top + this.popdown.outerHeight(true);
          this.popdown.css({'height': parseInt(this.popdown.css('height')) - (bottomEdgePos - winH)});
        }
      },

      updated: function() {
        return this;
      },

      teardown: function() {
        if (this.isOpen()) {
          this.close();
        }

        this.trigger
          .offTouchClick('popdown')
          .off('updated.popdown click.popdown')
          .removeAttr('aria-controls')
          .removeAttr('aria-expanded');

        if (this.originalParent && this.originalParent.length) {
          this.popdown.detach().appendTo(this.originalParent);
        }

        this.arrow.remove();

        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Popdown(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
