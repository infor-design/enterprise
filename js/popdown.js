/**
* Popdown Control (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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

    // Plugin Constructor
    function Popdown(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
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

          elem = $(elem);
          if (elem.length) {
            self.popdown = elem;
            return true;
          }

          return false;
        }
        function noElementError() {
          throw 'No popdown element was defined';
        }
        tryPopdownElement(this.element.attr('data-popdown')) ||
        tryPopdownElement(this.element.next('.popdown')) ||
        noElementError();

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
        var ariaExpanded = this.element.attr('aria-expanded');
        if (!ariaExpanded || ariaExpanded === undefined) {
          this.element.attr('aria-expanded', '');
        }
        if (ariaExpanded === 'true') {
          this.open();
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.element
          .onTouchClick('popdown')
          .on('click.popdown', function() {
            self.toggle();
          })
          .on('updated.popdown', function() {
            self.updated();
          });

        return this;
      },

      open: function() {
        var self = this;

        this.element.attr('aria-expanded', 'true');
        this.position();
        this.popdown.addClass('visible');

        // Setup events that happen on open
        // Needs to be on a timer to prevent automatic closing of popdown.
        setTimeout(function() {
          $(window).on('resize.popdown', function(e) {
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
        }, 300);
      },

      close: function() {
        var self = this;
        this.element.attr('aria-expanded', 'false');
        this.popdown.removeClass('visible');

        // Turn off events
        $(window).off('resize.popdown');
        $(document).off('click.popdown');

        // Sets the element to "display: none" to prevent interactions while hidden.
        setTimeout(function() {
          self.popdown.css('display', 'none');
        }, 300);
      },

      toggle: function() {
        if (this.element.attr('aria-expanded') === 'true') {
          this.close();
          return;
        }
        this.open();
      },

      // Detaches Popdown Element and places at the body tag root, or at the root of the nearest
      // scrollable parent.
      place: function() {
        var targetContainer = $('body');

        // adjust the tooltip if the element is being scrolled inside a scrollable DIV
        this.scrollparent = this.element.closest('.page-container[class*="scrollable"]');
        if (this.scrollparent.length) {
          targetContainer = this.scrollparent;
        }

        this.popdown.detach().appendTo(targetContainer);
      },

      position: function() {
        var self = this,
          parent = {
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

        var t = this.trigger,
          o = t.offset(),
          arrowHeight = 11;

        // Place below to start
        this.popdown.addClass('bottom').css({ 'left': o.left,
                           'top': o.top + t.outerHeight(true) + arrowHeight });
        this.arrow.css({ 'left': t.outerWidth(true)/2,
                         'top': 0 - arrowHeight });

      },

      updated: function() {
        return this;
      },

      teardown: function() {
        this.element.offTouchClick('popdown').off('updated.popdown click.popdown');

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
