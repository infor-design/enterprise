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
          breakpoint: 'phablet', // can be 'tablet' (+720), 'desktop' +(1024), or 'large' (+1280);
          openOnLarge: false, // If true, will automatically open the Application Menu when a large screen-width breakpoint is met.
          triggers: [] // An Array of jQuery-wrapped elements that are able to open/close this nav menu.
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
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

      init: function() {
        this
          .setup()
          .handleEvents();
      },

      setup: function() {
        this.hasTrigger = false;
        this.isAnimating = false;

        if (!this.hasTriggers()) {
          this.triggers = $();
        }

        this.menu = this.element;

        var openOnLarge = this.element.attr('data-open-on-large');
        this.settings.openOnLarge = openOnLarge !== undefined ? openOnLarge === 'true' : this.settings.openOnLarge;

        var breakpoints = {
          'tablet': 767,
          'phablet': 968,
          'desktop': 1024,
          'large': 1280
        },
        dataBreakpoint = this.element.attr('data-breakpoint');
        this.settings.breakpoint = breakpoints[dataBreakpoint] !== undefined ? dataBreakpoint : this.settings.breakpoint;
        this.breakpoint = breakpoints[this.settings.breakpoint];

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
        }).on('resize.applicationmenu', function() {
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
            self.openMenu();
          } else {
            self.closeMenu();
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

      adjustHeight: function() {
        var isSticky = this.scrollTarget.is('.is-sticky'),
          totalHeight = this.scrollTarget.outerHeight(true),
          offset = totalHeight - (!isSticky ? $(window).scrollTop() : 0);

        if (this.scrollTarget.prev().is('.masthead')) {
          offset += this.scrollTarget.prev().outerHeight(true);
        }

        this.menu[0].style.height = offset > 0 ? ('calc(100% - ' + offset + 'px)') : '100%';
      },

      isLargerThanBreakpoint: function() {
        return $(window).width() > this.breakpoint;
      },

      testWidth: function() {
        if (this.isLargerThanBreakpoint()) {
          this.menu.removeClass('show-shadow');
          if (this.settings.openOnLarge && !this.menu.hasClass('is-open') && this.isAnimating === false) {
            this.openMenu(true);
          }
        } else {
          this.menu.addClass('show-shadow');
          if (!this.element.find(document.activeElement).length && this.menu.is('.is-open') && this.isAnimating === false) {
            this.closeMenu();
          }
        }
      },

      openMenu: function(noFocus) {
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
          $(document).on('touchend.applicationmenu touchcancel.applicationmenu', function(e) {
            e.preventDefault();
            $(e.target).click();
          }).on('click.applicationmenu', function(e) {
            if ($(e.target).parents('.application-menu').length < 1 && !self.isLargerThanBreakpoint()) {
              self.closeMenu($(e.target).hasClass('application-menu-trigger'));
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
        $(document).off('touchend.applicationmenu touchcancel.applicationmenu click.applicationmenu keydown.applicationmenu');
      },

      hasTriggers: function() {
        return (this.triggers !== undefined && this.triggers instanceof $ && this.triggers.length);
      },

      // Externally Facing function that can be used to add/remove application nav menu triggers.
      // If the 'remove' argument is defined, triggers that are defined will be removed internally instead of added.
      // If the 'norebuild' argument is defined, this control's events won't automatically be rebound to include
      // the new triggers.
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

      teardown: function() {
        var api;
        this.accordion.off('blur.applicationmenu');
        this.menu.off('animateopencomplete animateclosedcomplete');
        $(window).off('scroll.applicationmenu');
        $(document).off('touchend.applicationmenu touchcancel.applicationmenu click.applicationmenu open-applicationmenu close-applicationmenu');

        api = this.accordion ? this.accordion.data('accordion') : null;
        if (api && api.destroy) {
          api.destroy();
        }

        if (this.hasTriggers()) {
          this.triggers.off('click.applicationmenu');
        }

        return this;
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        this.menu
          .detach()
          .appendTo(this.originalParent)
          .removeClass('short')
          .removeAttr('style');
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
        instance = $.data(this, pluginName, new ApplicationMenu(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
