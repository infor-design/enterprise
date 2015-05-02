/**
* Application Nav Control (TODO: bitly link to soho xi docs)
*/

$.fn.applicationmenu = function(options) {

  'use strict';

  // Settings and Options
  var pluginName = 'applicationmenu',
      defaults = {},
      settings = $.extend({}, defaults, options);

  // Plugin Constructor
  function ApplicationMenu(element) {
    this.settings = $.extend({}, settings);
    this.element = $(element);
    this.init();
  }

  // Plugin Methods
  ApplicationMenu.prototype = {

    init: function() {
      this
        .setup()
        .handleEvents();
    },

    setup: function() {
      this.hasTrigger = false;
      this.isAnimating = false;

      if (this.element.hasClass('application-menu')) {
        this.menu = this.element;
      }
      if (!this.menu && this.element.next('.application-menu')) {
        this.hasTrigger = true;
        this.menu = this.element.next('.application-menu');
      }
      this.scrollTarget = this.menu.parents('.header');
      if (this.menu.parents('.masthead').length > 0) {
        this.scrollTarget = this.menu.parents('.masthead');
        this.menu.addClass('short');
      }

      this.accordion = this.menu.find('.accordion');

      this.originalParent = this.menu.parent();
      this.menu.detach().insertAfter($('body').find('header').first());
      this.closeMenu();
      this.adjustHeight();

      return this;
    },

    handleEvents: function() {
      var self = this;

      // Setup click events on this.element if it's not the menu itself
      // (this means that it's a trigger button)
      if (this.hasTrigger) {
        this.element.on('touchend.applicationmenu touchcancel.applicationmenu', function(e) {
          e.preventDefault();
          $(e.target).click();
        }).on('click.applicationmenu', function() {
          if (!self.menu.hasClass('is-open') && self.isAnimating === false) {
            self.openMenu();
          }
        });
      }

      // Setup notification change events
      this.menu.on('notify.applicationmenu', function(e, anchor, value) {
        self.notify(anchor, value);
      });

      this.accordion.on('blur.applicationmenu', function() {
        self.closeMenu();
      });

      $(document).on('open-applicationmenu', function() {
        self.openMenu();
      }).on('close-applicationmenu', function() {
        self.closeMenu();
      });

      $(window).on('scroll.applicationmenu', function() {
        self.adjustHeight();
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

    adjustHeight: function() {
      var isSticky = this.scrollTarget.is('.is-sticky'),
        offset = this.scrollTarget.height() - (!isSticky ? $(window).scrollTop() : 0);
      this.menu.css('height', (offset > 0 ? 'calc(100% - ' + offset + 'px)' : '100%'));
    },

    openMenu: function() {
      if (this.isAnimating === true) {
        return;
      }

      var self = this,
        transitionEnd = $.fn.transitonEndName;

      this.isAnimating = true;

      function isOpen() {
        if (self.timeout !== null) {
          clearTimeout(self.timeout);
          self.timeout = null;
        }

        self.isAnimating = false;
      }

      this.menu
        .off(transitionEnd + '.applicationmenu')
        .css('display', '');
      // next line forces a repaint
      this.menu[0].offsetHeight; //jshint ignore:line
      this.menu.addClass('is-open')
        .find('.is-selected > a')
        .focus();

      this.menu.one(transitionEnd + '.applicationmenu', isOpen);
      this.timeout = setTimeout(isOpen, 300);

      // Events that will close the nav menu
      // On a timer to prevent conflicts with the Trigger button's click events
      setTimeout(function() {
        $(document).on('touchend.applicationmenu touchcancel.applicationmenu', function(e) {
          e.preventDefault();
          $(e.target).click();
        }).on('click.applicationmenu', function(e) {
          if ($(e.target).parents('.application-menu').length < 1) {
            self.closeMenu();
          }
        }).on('keydown.applicationmenu', function(e) {
          self.handleKeyDown(e);
        });
      }, 0);
    },

    closeMenu: function() {
      if (this.isAnimating === true) {
        return;
      }

      var self = this,
        transitionEnd = $.fn.transitionEndName;

      this.isAnimating = true;

      function close() {
        if (self.timeout !== null) {
          clearTimeout(self.timeout);
          self.timeout = null;
        }

        self.menu
          .off(transitionEnd + '.applicationmenu')
          .css('display', 'none');
        self.isAnimating = false;
      }

      this.menu.one(transitionEnd + '.applicationmenu', close);
      this.timeout = setTimeout(close, 300);

      this.menu.removeClass('is-open').find('[tabindex]');
      $(document).off('touchend.applicationmenu touchcancel.applicationmenu click.applicationmenu keydown.applicationmenu');
    },

    // Teardown - Remove added markup and events
    destroy: function() {
      this.accordion.off('blur.applicationmenu');
      this.menu
        .detach()
        .appendTo(this.originalParent)
        .removeClass('short')
        .removeAttr('style');
      this.menu.off('animateOpenComplete animateClosedComplete');
      $(window).off('scroll.applicationmenu');
      $(document).off('touchend.applicationmenu touchcancel.applicationmenu click.applicationmenu open-applicationmenu close-applicationmenu');
      $.removeData(this.element[0], pluginName);
    }
  };

  // Initialize the plugin (Once)
  return this.each(function() {
    var instance = $.data(this, pluginName);
    if (instance) {
      instance.settings = $.extend({}, instance.settings, options);
    } else {
      instance = $.data(this, pluginName, new ApplicationMenu(this, settings));
    }
  });
};
