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
        if (this.element.hasClass('application-nav')) {
          this.menu = this.element;
        }
        if (!this.menu && this.element.next('.application-nav')) {
          this.menu = this.element.next('.application-nav');
        }

        this.originalParent = this.menu.parent();
        this.menu.detach().insertAfter($('body').find('header').first());
        this.menu.removeClass('is-open');
        this.closeMenu();

        return this;
      },

      handleEvents: function() {
        var self = this;

        // Setup click events on this.element if it's not the menu itself
        // (this means that it's a trigger button)
        if (!this.element.hasClass('application-nav')) {
          this.element.on('touchend.appNav touchcancel.appNav', function(e) {
            e.preventDefault();
            $(e.target).click();
          }).on('click.appNav', function() {
            self.toggleMenu();
          });
        }

        $(document).on('openNavMenu', function() {
          self.openMenu();
        }).on('closeNavMenu', function() {
          self.closeMenu();
        });

        return this;
      },

      toggleMenu: function() {
        if (this.menu.hasClass('is-open')) {
          this.closeMenu();
        } else {
          this.openMenu();
        }
      },

      openMenu: function() {
        var self = this;

        this.menu.addClass('is-open');
        this.menu.css('display','block');
        this.menu.one('animateOpenComplete', function() {
            // Events that will close the nav menu
            $(document).on('touchend.appNav touchcancel.appNav', function(e) {
              e.preventDefault();
              $(e.target).click();
            }).on('click.appNav', function(e) {
              if ($(e.target).parents('.application-nav').length < 1) {
                self.closeMenu();
              }
            });
          });
        this.menu.animateOpen({
            direction: 'horizontal',
            distance: 300
          });
      },

      closeMenu: function() {
        this.menu.removeClass('is-open');
        this.menu.one('animateClosedComplete', function(e) {
            e.stopPropagation();
            $(this).css('display','none');
            $(document).off('touchend.appNav touchcancel.appNav click.appNav');
        });
        this.menu.animateClosed({
            direction: 'horizontal'
          });
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.menu.detach().appendTo(this.originalParent);
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
