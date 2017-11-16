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
  window.Soho.components = window.Soho.components || {};

  var DEFAULT_APPLICATIONMENU_OPTIONS = {
    breakpoint: 'phone-to-tablet',
    filterable: false,
    openOnLarge: false,
    triggers: []
  };

  /**
  * The Application Menu provides access to all the functions, pages, and forms in an application.
  *
  * @class ApplicationMenu
  * @param {String} breakpoint  &nbsp;-&nbsp; Can be 'tablet' (+720), 'phablet (+968), ' 'desktop' +(1024), or 'large' (+1280). Default is phablet (968)
  * @param {String} filterable
  * @param {String} openOnLarge  &nbsp;-&nbsp; If true, will automatically open the Application Menu when a large screen-width breakpoint is met.
  * @param {String} triggers  &nbsp;-&nbsp; An Array of jQuery-wrapped elements that are able to open/close this nav menu.
  */
  function ApplicationMenu(element, options) {
    this.element = $(element);
    this.settings = $.extend({}, DEFAULT_APPLICATIONMENU_OPTIONS, this.getInlineOptions(element[0]), options);

    return this.init();
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
     * Handles the access of HTML-inlined `data-options`
     * @private
     * @returns {Object}
     */
    getInlineOptions: function() {
      return Soho.utils.parseOptions(this.element[0]);
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
        var accOpts = this.accordion.parseOptions();
        this.accordion.accordion(accOpts);
        accordion = this.accordion.data('accordion');
      }
      this.accordionAPI = accordion;

      // detect the presence of a searchfield
      this.searchfield = this.element.children('.searchfield, .searchfield-wrapper');

      // Setup filtering, if applicable.
      if (this.settings.filterable && typeof $.fn.searchfield === 'function') {
        if (this.searchfield.length) {
          if (this.searchfield.is('.searchfield-wrapper')) {
            this.searchfield = this.searchfield.children('.searchfield');
          }
        } else {
          this.searchfield = $('<div class="searchfield-wrapper">' +
            '<label for="application-menu-searchfield">'+ Locale.translate('Search') +'</label>' +
            '<input id="application-menu-searchfield" class="searchfield" /></div>').prependTo(this.element);
        }

        var self = this;
        this.searchfield.searchfield({
          source: function(term, done, args) {
            done(term, self.accordion.data('accordion').toData(true, true), args);
          },
          searchableTextCallback: function(item) {
            return item.text || '';
          },
          resultIteratorCallback: function(item) {
            item._highlightTarget = 'text';
            return item;
          },
          displayResultsCallback: function(results, done) {
            return self.filterResultsCallback(results, done);
          }
        });
      } else {
        if (this.searchfield.length) {
          this.searchfield.off();
          this.searchfield.parent('.searchfield-wrapper').remove();
          delete this.searchfield;
        }
      }

      // Sync with application menus that have an 'is-open' CSS class.
      // Otherwise, just adjust the height.
      if (this.isOpen()) {
        this.openMenu(false, false, true);
      } else {
        this.adjustHeight();
      }

      return this;
    },

    /**
     * Gets a reference to this Application Menu's adjacent container element.
     * @returns {jQuery[]}
     */
    getAdjacentContainerElement: function() {
      var container = this.element.next('.page-container');
      if (!container.length) {
        container = $('body');
      }
      return container;
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

      $(document).on('keydown.applicationmenu', function(e) {
        self.handleKeyDown(e);
      });

    },

    handleKeyDown: function(e) {
      var key = e.which;

      if (key === 121) { // F10
        e.preventDefault();

        if (this.isOpen()) {
          this.closeMenu(true);
          if (this.triggers.length) {
            this.triggers.eq(0).focus();
          }
        } else {
          this.openMenu();
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
          this.element[0].classList.remove('show-shadow');
          return;
        }

        this.element[0].classList.add('show-shadow');

        if (this.element.find(document.activeElement).length || this.isAnimating) {
          return;
        }

        if (!this.userOpened) {
          this.closeMenu();
        }
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
     * @param {boolean} [userOpened] - If true, notifies the component that the menu was manually opened by the user.
     * @param {boolean} [openedByClass] - If true, only adjusts bare-miniumum requirements for the application menu to appear open (should be used in cases where the application menu has the `is-open` CSS appended to it via markup).  This skips events, animation, etc.
     */
    openMenu: function(noFocus, userOpened, openedByClass) {
      if (this.isAnimating === true) {
        return;
      }

      var self = this,
        transitionEnd = $.fn.transitonEndName;

      if (!openedByClass) {
        this.isAnimating = true;
      }
      this.adjustHeight();

      function isOpen() {
        if (self.timeout !== null) {
          clearTimeout(self.timeout);
          self.timeout = null;
        }

        if (userOpened) {
          self.userOpened = true;
          self.userClosed = undefined;
        }

        if (!openedByClass) {
          self.isAnimating = false;
          self.element.trigger('applicationmenuopen');
          $('body').triggerHandler('resize');
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

      // Animate the application menu open.
      // If opened by class, `is-open` is already applied to the app menu at this point in the render cycle, and should not be re-applied.
      if (!openedByClass) {
        this.menu.off(transitionEnd + '.applicationmenu');
        this.menu[0].style.display = '';
        // next line forces a repaint
        this.menu[0].offsetHeight; //jshint ignore:line
        this.menu.addClass('is-open');
      }

      if (Soho.breakpoints.isBelow(this.settings.breakpoint)) {
        this.menu.addClass('show-shadow');
      }

      if (!noFocus || noFocus !== true) {
        this.menu.find('.is-selected > a').focus();
      }

      var container = this.getAdjacentContainerElement();
      container.addClass('ios-click-target');

      if (!openedByClass) {
        this.menu.one(transitionEnd + '.applicationmenu', isOpen);
        this.timeout = setTimeout(isOpen, 300);
      } else {
        isOpen();
      }

      // Events that will close the nav menu
      // On a timer to prevent conflicts with the Trigger button's click events
      setTimeout(function() {
        $(document).on('click.applicationmenu', function(e) {
          if ($(e.target).parents('.application-menu').length < 1 && !self.isLargerThanBreakpoint()) {
            self.closeMenu(true);
          }
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
        $('body').triggerHandler('resize');
      }

      this.triggers.each(function() {
        var trig = $(this);
        if (trig.parents('.header').length > 0 || trig.parents('.masthead').length > 0) {
          trig.find('.icon.app-header').removeClass('close');
          trig.trigger('icon-change');
        }
      });

      var container = this.getAdjacentContainerElement();
      container.removeClass('ios-click-target');

      this.menu.one(transitionEnd + '.applicationmenu', close);
      this.timeout = setTimeout(close, 300);

      this.menu.removeClass('is-open show-shadow').find('[tabindex]');
      $(document).off('click.applicationmenu');
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
     * @param {Array} results
     * @param {function} done
     */
    filterResultsCallback: function(results, done) {
      var self = this,
        filteredParentHeaders = this.accordion.find('.has-filtered-children');

      this.accordionAPI.headers.removeClass('filtered has-filtered-children');

      if (!results || !results.length) {
        this.accordionAPI.collapse(filteredParentHeaders);
        this.accordionAPI.updated();
        this.isFiltered = false;
        this.element.triggerHandler('filtered', [results]);
        done();
        return;
      }

      var matchedHeaders = $();
      results.map(function(item) {
        matchedHeaders = matchedHeaders.add(item.element);

        var parentPanes = $(item.element).parents('.accordion-pane');
        parentPanes.each(function() {
          var parentHeaders = $(this).prev('.accordion-header').addClass('has-filtered-children');
          filteredParentHeaders = filteredParentHeaders.not(parentHeaders);
          self.accordionAPI.expand(parentHeaders);
        });
      });

      this.isFiltered = true;
      this.accordionAPI.headers.not(matchedHeaders).addClass('filtered');
      this.accordionAPI.collapse(filteredParentHeaders);
      this.accordionAPI.updated(matchedHeaders);

      this.element.triggerHandler('filtered', [results]);
      done();
    },

    /**
     * handles the Searchfield Input event
     * @param {jQuery.Event} e
     */
    handleSearchfieldInputEvent: function() {
      if (!this.searchfield || !this.searchfield.length) {
        return;
      }

      var val = this.searchfield.val();

      if (!val || val === '') {
        var filteredParentHeaders = this.accordion.find('.has-filtered-children');
        this.accordionAPI.headers.removeClass('filtered has-filtered-children');
        this.accordionAPI.collapse(filteredParentHeaders);
        this.accordionAPI.updated();
        this.element.triggerHandler('filtered', [[]]);
        return;
      }
    },

    /**
     * Unbinds event listeners and removes extraneous markup from the Application Menu.
     * @returns {this}
     */
    teardown: function() {
      this.menu
        .off('animateopencomplete animateclosedcomplete')
        .removeClass('short')
        .removeAttr('style');

      $(window).off('scroll.applicationmenu');
      $('body').off('resize.applicationmenu');
      $(document).off('click.applicationmenu open-applicationmenu close-applicationmenu keydown.applicationmenu');

      this.accordion.off('blur.applicationmenu');
      if (this.accordionAPI && typeof this.accordionAPI.destroy === 'function') {
        if (this.isFiltered) {
          this.accordionAPI.collapse();
        }
        this.accordionAPI.destroy();
      }

      if (this.searchfield && this.searchfield.length) {
        this.searchfield.off('input.applicationmenu');
        var sfAPI = this.searchfield.data('searchfield');
        if (sfAPI) {
          sfAPI.destroy();
        }
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
      $.removeData(this.element[0], 'applicationmenu');
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

      if (this.settings.filterable === true && this.searchfield && this.searchfield.length) {
        this.searchfield.on('input.applicationmenu', function(e) {
          self.handleSearchfieldInputEvent(e);
        });
      }

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


  // Add to the Soho Components object
  window.Soho.components.ApplicationMenu = ApplicationMenu;


  /**
   * jQuery component wrapper for the Application Menu
   * @param {Object} options
   * @returns {ApplicationMenu}
   */
  $.fn.applicationmenu = function(options) {
    return this.each(function() {
      var instance = $.data(this, 'applicationmenu');
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, 'applicationmenu', new ApplicationMenu(this, options));
      }
      return instance;
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
