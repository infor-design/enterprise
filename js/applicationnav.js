/**
* Application Nav Control (TODO: bitly link to soho xi docs)
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

  $.fn.appNav = function(options) {

    // Settings and Options
    var pluginName = 'appNav',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ApplicationNav(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ApplicationNav.prototype = {

      init: function() {
        this
          .setup()
          .handleEvents();
      },

      setup: function() {
        this.hasTrigger = false;
        if (this.element.hasClass('application-nav')) {
          this.menu = this.element;
        }
        if (!this.menu && this.element.next('.application-nav')) {
          this.hasTrigger = true;
          this.menu = this.element.next('.application-nav');
        }
        if (this.menu.parents('.masthead').length > 0) {
          this.menu.addClass('short');
        }

        this.accordion = this.menu.find('.accordion');

        this.originalParent = this.menu.parent();
        this.menu.detach().insertAfter($('body').find('header').first());
        this.closeMenu();

        return this;
      },

      handleEvents: function() {
        var self = this;

        // Setup click events on this.element if it's not the menu itself
        // (this means that it's a trigger button)
        if (this.hasTrigger) {
          this.element.on('touchend.appNav touchcancel.appNav', function(e) {
            e.preventDefault();
            $(e.target).click();
          }).on('click.appNav', function() {
            self.toggleMenu();
          });
        }

        // Setup notification change events
        this.menu.on('notify.appNav', function(e, anchor, value) {
          self.notify(anchor, value);
        });

        this.accordion.on('blur.appNav', function() {
          self.closeMenu();
        });

        $(document).on('openNavMenu', function() {
          self.openMenu();
        }).on('closeNavMenu', function() {
          self.closeMenu();
        });

        return this;
      },

      handleKeyDown: function(e) {
        var key = e.which;

        if (key === 27) { // Escape
          e.preventDefault();
          this.closeMenu();
          if (this.hasTrigger) {
            this.element.focus();
          }
          return false;
        }
      },

      notify: function(anchor, value) {
        if (!anchor || anchor === undefined) {
          return;
        }
        if (anchor instanceof HTMLElement) {
          anchor = $(anchor);
        }
        if (!anchor.is('a')) {
          return;
        }

        var tag = anchor.find('.tag');

        // Close the tag if an undefined or '0' value is passed
        if (!value || value === undefined || parseInt(value, 10) === 0) {
          if (tag.length) {
            tag.remove();
          }
          return;
        }

        if (!tag.length) {
          tag = $('<span class="tag"></span>').appendTo(anchor);
        }

        tag.text(value.toString());
        return tag;
      },

      toggleMenu: function() {
        if (this.menu.hasClass('is-open')) {
          this.closeMenu();
        } else {
          this.openMenu();
        }
      },

      openMenu: function() {
        var self = this,
          transitionEnd = $.fn.transitonEndName;

        this.menu
          .off(transitionEnd + '.appNav')
          .css('display', '');
        // next line forces a repaint
        this.menu[0].offsetHeight; //jshint ignore:line
        this.menu.addClass('is-open')
          .find('.is-selected > a')
          .focus();

        // Events that will close the nav menu
        // On a timer to prevent conflicts with the Trigger button's click events
        setTimeout(function() {
          $(document).on('touchend.appNav touchcancel.appNav', function(e) {
            e.preventDefault();
            $(e.target).click();
          }).on('click.appNav', function(e) {
            if ($(e.target).parents('.application-nav').length < 1) {
              self.closeMenu();
            }
          }).on('keydown.appNav', function(e) {
            self.handleKeyDown(e);
          });
        }, 0);
      },

      closeMenu: function() {
        var self = this,
          transitionEnd = $.fn.transitionEndName;

        this.menu.one(transitionEnd + '.appNav', function() {
          self.menu.css('display', 'none');
        });
        this.menu.removeClass('is-open').find('[tabindex]');
        $(document).off('touchend.appNav touchcancel.appNav click.appNav keydown.appNav');
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.accordion.off('blur.appNav');
        this.menu
          .detach()
          .appendTo(this.originalParent)
          .removeClass('short');
        this.menu.off('animateOpenComplete animateClosedComplete');
        $(document).off('touchend.appNav touchcancel.appNav click.appNav');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new ApplicationNav(this, settings));
      }
    });
  };
}));
