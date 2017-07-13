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

  $.fn.applicationmenu = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'applicationmenu',
        defaults = {
          breakpoint: 'phone-to-tablet',
          openOnLarge: false,
          triggers: []
        },
        settings = $.extend({}, defaults, options);

    /**
    * The Application Menu provides access to all the functions, pages, and forms in an application.
    *
    * @class ApplicationMenu
    * @param {String} breakpoint  &nbsp;-&nbsp; Can be 'tablet' (+720), 'phablet (+968), ' 'desktop' +(1024), or 'large' (+1280). Default is phablet (968)
    * @param {String} openOnLarge  &nbsp;-&nbsp; If true, will automatically open the Application Menu when a large screen-width breakpoint is met.
    * @param {String} triggers  &nbsp;-&nbsp; An Array of jQuery-wrapped elements that are able to open/close this nav menu.
    */
    function ApplicationMenu(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    ApplicationMenu.prototype = {

      /**
       * @private
       * @returns {this}
       */
      init: function() {
        this
          .setup()
          .handleEvents();
      },

      /**
       * @private
       * @returns {this}
       */
      setup: function() {
        this.hasTrigger = false;
        this.isAnimating = false;

        if (!this.hasTriggers()) {
          this.triggers = $();
        }

        this.menu = this.element;

        var openOnLarge = this.element.attr('data-open-on-large');
        this.settings.openOnLarge = openOnLarge !== undefined ? openOnLarge === 'true' : this.settings.openOnLarge;

        var breakpoints = Soho.breakpoints,
        dataBreakpoint = this.element.attr('data-breakpoint');
        this.settings.breakpoint = breakpoints[dataBreakpoint] !== undefined ? dataBreakpoint : this.settings.breakpoint;

        // Pull in the list of Nav Menu trigger elements and store them internally.
        this.modifyTriggers(this.settings.triggers, false, true);

        this.scrollTarget = this.menu.parents('.header');
        var masthead = this.menu.prevAll('.masthead'),
          moduleTabs = this.menu.prevAll('.module-tabs');

        if (masthead.length > 0) {
          this.scrollTarget = masthead;
          this.menu.addClass('short');
        }
        if (moduleTabs.length > 0) {
          this.scrollTarget = moduleTabs;
        }

        this.accordion = this.menu.find('.accordion');
        this.accordion.addClass('panel').addClass('inverse');

        // Check to make sure that the internal Accordion Control is invoked
        var accordion = this.accordion.data('accordion');
        if (!accordion) {
          var accOpts = $.fn.parseOptions(this.accordion[0]);
          this.accordion.accordion(accOpts);
        }

        this.adjustHeight();

        return this;
      },

      // Setup click events on this.element if it's not the menu itself
      // (this means that it's a trigger button)
      handleTriggerEvents: function() {
        var self = this;

        function triggerClickHandler(e) {
          // Don't allow hamburger buttons that have changed state to activate/deactivate the app menu.
          if ($(e.currentTarget).find('.icon.app-header').hasClass('go-back')) {
            return false;
          }

          if (self.isAnimating) {
            return false;
          }

          var isOpen = self.menu.hasClass('is-open');
          if (!isOpen) {
            self.openMenu(undefined, true);
          } else {
            self.closeMenu(true);
          }
          return true;
        }

        if (this.triggers.length) {
          this.triggers.off('click.applicationmenu').on('click.applicationmenu', triggerClickHandler);
        }
      },

      handleKeyDown: function(e) {
        var key = e.which;

        if (key === 27) { // Escape
          e.preventDefault();
          this.closeMenu();
          if (this.triggers.length) {
            this.triggers.eq(0).focus();
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

      /**
       * Adjusts the application menu's height to fit the page.
       * @private
       */
      adjustHeight: function() {
        var isSticky = this.scrollTarget.is('.is-sticky'),
          totalHeight = this.scrollTarget.outerHeight(true),
          offset = totalHeight - (!isSticky ? $(window).scrollTop() : 0);

        if (this.scrollTarget.prev().is('.masthead')) {
          offset += this.scrollTarget.prev().outerHeight(true);
        }

        this.menu[0].style.height = offset > 0 ? ('calc(100% - ' + offset + 'px)') : '100%';
      },

      /**
       * Checks the window size against the defined breakpoint.
       * @private
       */
      isLargerThanBreakpoint: function() {
        return Soho.breakpoints.isAbove(this.settings.breakpoint);
      },

      /**
       * Detects whether or not the application menu is open
       * @returns {boolean}
       */
      isOpen: function() {
        return this.menu[0].classList.contains('is-open');
      },

      /**
       * Detects a change in breakpoint size that can cause the Application Menu's state to change.
       */
      testWidth: function() {
        if (this.isOpen()) {
          if (Soho.breakpoints.isAbove(this.settings.breakpoint)) {
            return;
          }
          if (this.element.find(document.activeElement).length || this.isAnimating) {
            return;
          }

          this.closeMenu();
          return;
        }

        if (Soho.breakpoints.isBelow(this.settings.breakpoint)) {
          return;
        }

        if (this.userClosed || !this.settings.openOnLarge || this.isAnimating) {
          return;
        }

        this.openMenu(true);

      },

      /**
       * Opens the Application Menu
       * @param {boolean} noFocus - If true, sets focus on the first item in the application menu.
       * @param {boolean} userOpened - If true, notifies the component that the menu was manually opened by the user.
       */
      openMenu: function(noFocus, userOpened) {
        if (this.isAnimating === true) {
          return;
        }

        var self = this,
          transitionEnd = $.fn.transitonEndName;

        this.isAnimating = true;
        this.adjustHeight();

        function isOpen() {
          if (self.timeout !== null) {
            clearTimeout(self.timeout);
            self.timeout = null;
          }

          self.isAnimating = false;
          self.element.trigger('applicationmenuopen');

          if (userOpened) {
            self.userOpened = true;
            self.userClosed = undefined;
          }

          self.menu.removeClass('no-transition');
          $('.page-container').removeClass('no-transition');
        }

        this.triggers.each(function() {
          var trig = $(this);
          if (trig.parents('.header').length > 0 || trig.parents('.masthead').length > 0) {
            var header = trig.parents('.header, .masthead');
            if (header.parents('.page-container').length) {
              return;
            }

            trig.find('.icon.app-header').removeClass('go-back').addClass('close');
            trig.trigger('icon-change');
          }
        });

        this.menu.off(transitionEnd + '.applicationmenu');
        this.menu[0].style.display = '';
        // next line forces a repaint
        this.menu[0].offsetHeight; //jshint ignore:line
        this.menu.addClass('is-open');

        if (!noFocus || noFocus !== true) {
          this.menu.find('.is-selected > a').focus();
        }

        this.menu.one(transitionEnd + '.applicationmenu', isOpen);
        this.timeout = setTimeout(isOpen, 300);

        // Events that will close the nav menu
        // On a timer to prevent conflicts with the Trigger button's click events
        setTimeout(function() {
          $(document).on('click.applicationmenu', function(e) {
            if ($(e.target).parents('.application-menu').length < 1 && !self.isLargerThanBreakpoint()) {
              self.closeMenu(true);
            }
          }).on('keydown.applicationmenu', function(e) {
            self.handleKeyDown(e);
          });
        }, 0);
      },

      /**
       * Closes the Application Menu
       * @param {boolean} userClosed - if true, sets a flag notifying the component that the user was responsible for closing.
       */
      closeMenu: function(userClosed) {
        if (this.isAnimating === true) {
          return;
        }

        var self = this,
          transitionEnd = $.fn.transitionEndName();

        this.isAnimating = true;

        function close() {
          if (self.timeout !== null) {
            clearTimeout(self.timeout);
            self.timeout = null;
          }

          self.menu.off(transitionEnd + '.applicationmenu');
          self.menu[0].style.display = 'none';
          self.isAnimating = false;

          if (userClosed) {
            self.userOpened = undefined;
            self.userClosed = true;
          }

          self.element.trigger('applicationmenuclose');
        }

        this.triggers.each(function() {
          var trig = $(this);
          if (trig.parents('.header').length > 0 || trig.parents('.masthead').length > 0) {
            trig.find('.icon.app-header').removeClass('close');
            trig.trigger('icon-change');
          }
        });

        this.menu.one(transitionEnd + '.applicationmenu', close);
        this.timeout = setTimeout(close, 300);

        this.menu.removeClass('is-open').find('[tabindex]');
        $(document).off('click.applicationmenu keydown.applicationmenu');
      },

      /**
       * Detects whether or not the Application Menu has external trigger buttons setup to control it.
       * @returns {boolean}
       */
      hasTriggers: function() {
        return (this.triggers !== undefined && this.triggers instanceof $ && this.triggers.length);
      },

      /**
       * Externally Facing function that can be used to add/remove application nav menu triggers.
       * @param {Array[]} triggers - an array of HTMLElements or jQuery-wrapped elements that will be used as triggers.
       * @param {boolean} [remove] - if defined, triggers that are defined will be removed internally instead of added.
       * @param {boolean} [norebuild] - if defined, this control's events won't automatically be rebound to include the new triggers.
       */
      modifyTriggers: function(triggers, remove, norebuild) {
        if (!triggers || !triggers.length) {
          return;
        }
        var changed = $();

        $.each(triggers, function(i, obj) {
          changed = changed.add($(obj));
        });

        this.triggers = this.triggers[!remove ? 'add' : 'not'](changed);
        this.handleTriggerEvents();

        if (norebuild && norebuild === true) {
          return;
        }

        this.updated();
      },

      /**
       * Unbinds event listeners and removes extraneous markup from the Application Menu.
       * @returns {this}
       */
      teardown: function() {
        var api;
        this.accordion.off('blur.applicationmenu');
        this.menu.off('animateopencomplete animateclosedcomplete');
        $(window).off('scroll.applicationmenu');
        $('body').off('resize.applicationmenu');
        $(document).off('click.applicationmenu open-applicationmenu close-applicationmenu');

        api = this.accordion ? this.accordion.data('accordion') : null;
        if (api && api.destroy) {
          api.destroy();
        }

        if (this.hasTriggers()) {
          this.triggers.off('click.applicationmenu');
        }

        return this;
      },

      /**
      * Triggers a UI Resync.
      */
      updated: function() {
        return this
          .teardown()
          .init();
      },

      /**
      * Teardown - Remove added markup and events
      */
      destroy: function() {
        this.teardown();
        this.menu
          .detach()
          .appendTo(this.originalParent)
          .removeClass('short')
          .removeAttr('style');
        $.removeData(this.element[0], pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires Applicationmenu#events
       * @param {Object} applicationmenuopen  &nbsp;-&nbsp; Fires when the menu is opened.
       * @param {Object} applicationmenuclose  &nbsp;-&nbsp; Fires as the menu is closed.
        *
       */
      handleEvents: function() {
        var self = this;

        this.handleTriggerEvents();

        // Setup notification change events
        this.menu.on('notify.applicationmenu', function(e, anchor, value) {
          self.notify(anchor, value);
        }).on('updated.applicationmenu', function() {
          self.updated();
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

        $('body').on('resize.applicationmenu', function() {
          self.testWidth();
        });

        if (this.settings.openOnLarge && this.isLargerThanBreakpoint()) {
          this.menu.addClass('no-transition');
          $('.page-container').addClass('no-transition');
        }
        this.testWidth();

        //Remove after initial transition
        setTimeout(function() {
          self.menu.removeClass('no-transition');
          $('.page-container').removeClass('no-transition');
        }, 800);

        return this;
      }

    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new ApplicationMenu(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
