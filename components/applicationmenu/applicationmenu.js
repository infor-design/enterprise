/* eslint-disable no-underscore-dangle, prefer-arrow-callback */
import { utils } from '../utils/utils';
import { Environment as env } from '../utils/environment';
import { breakpoints } from '../utils/breakpoints';
import { Locale } from '../locale/locale';

// jQuery Components
import '../utils/lifecycle';
import '../accordion/accordion.jquery';
import '../searchfield/searchfield.jquery';

// Name of the component in this file.
const COMPONENT_NAME = 'applicationmenu';

/**
* @namespace
* @property {string} breakpoint  Can be 'tablet' (+720), 'phablet (+968), ' 'desktop' +(1024),
* or 'large' (+1280). Default is 'phone-to-tablet' (968)
* @property {boolean} filterable If true a search / filter option will be added.
* @property {boolean} openOnLarge  If true, will automatically open the Application Menu when a
* large screen-width breakpoint is met.
* @property {array} triggers  An Array of jQuery-wrapped elements that are able to open/close
* this nav menu.
*/
const APPLICATIONMENU_DEFAULTS = {
  breakpoint: 'phone-to-tablet',
  filterable: false,
  openOnLarge: false,
  triggers: []
};

/**
 * The Application Menu provides access to all the functions, pages, and forms in an application.
 * @class ApplicationMenu
 * @param {[type]} element The element that gets the plugin established on it.
 * @param {[type]} settings The settings to use on this instance.
 */
function ApplicationMenu(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, APPLICATIONMENU_DEFAULTS);

  return this.init();
}

// Plugin Methods
ApplicationMenu.prototype = {

  /**
   * Initialize the plugin.
   * @private
   * @returns {void}
   */
  init() {
    this
      .setup()
      .handleEvents();
  },

  /**
   * @private
   * @returns {this} component instance
   */
  setup() {
    this.hasTrigger = false;
    this.isAnimating = false;

    if (!this.hasTriggers()) {
      this.triggers = $();
    }

    this.menu = this.element;

    const openOnLarge = this.element.attr('data-open-on-large');
    this.settings.openOnLarge = openOnLarge !== undefined ? openOnLarge === 'true' : this.settings.openOnLarge;

    const dataBreakpoint = this.element.attr('data-breakpoint');
    this.settings.breakpoint = breakpoints[dataBreakpoint] !== undefined ?
      dataBreakpoint : this.settings.breakpoint;

    // Pull in the list of Nav Menu trigger elements and store them internally.
    this.modifyTriggers(this.settings.triggers, false, true);

    this.scrollTarget = this.menu.parents('.header');
    const masthead = this.menu.prevAll('.masthead');
    const moduleTabs = this.menu.prevAll('.module-tabs');

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
    let accordion = this.accordion.data('accordion');
    if (!accordion) {
      this.accordion.accordion();
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
        this.searchfield = $(`${'<div class="searchfield-wrapper">' +
          '<label for="application-menu-searchfield">'}${Locale.translate('Search')}</label>` +
          '<input id="application-menu-searchfield" class="searchfield" /></div>').prependTo(this.element);
      }

      const self = this;
      this.searchfield.searchfield({
        source(term, done, args) {
          done(term, self.accordion.data('accordion').toData(true, true), args);
        },
        searchableTextCallback(item) {
          return item.text || '';
        },
        resultIteratorCallback(item) {
          item._highlightTarget = 'text';
          return item;
        },
        displayResultsCallback(results, done) {
          return self.filterResultsCallback(results, done);
        }
      });
    } else if (this.searchfield.length) {
      this.searchfield.off();
      this.searchfield.parent('.searchfield-wrapper').remove();
      delete this.searchfield;
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
   * @returns {jQuery[]} the adjacent container element
   */
  getAdjacentContainerElement() {
    let container = this.element.next('.page-container');
    if (!container.length) {
      container = $('body');
    }
    return container;
  },

  /**
   * Setup click events on this.element if it's not the menu itself.
   * (this means that it's a trigger button).
   * @returns {void}
   */
  handleTriggerEvents() {
    const self = this;

    function triggerClickHandler(e) {
      // Don't allow hamburger buttons that have changed state to activate/deactivate the app menu.
      if ($(e.currentTarget).find('.icon.app-header').hasClass('go-back')) {
        return false;
      }

      if (self.isAnimating) {
        return false;
      }

      const isOpen = self.menu.hasClass('is-open');
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

    $(document).on('keydown.applicationmenu', (e) => {
      self.handleKeyDown(e);
    });
  },

  /**
   * Handles Keydown Events on the App Menu
   * @param {jQuery.Event} e `keydown` events
   * @returns {boolean} whether or not the keydown event was successful
   */
  handleKeyDown(e) {
    const key = e.which;

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

    return true;
  },

  /**
   * Adds a visual badge-style notification to an Application Menu accordion header
   * @param {jQuery[]} anchor the anchor to target
   * @param {number} value the numeric value to attach
   * @returns {jQuery[]|undefined} a reference to the new tag markup, if applicable
   */
  notify(anchor, value) {
    if (!anchor || anchor === undefined) {
      return undefined;
    }
    if (anchor instanceof HTMLElement) {
      anchor = $(anchor);
    }
    if (!anchor.is('a')) {
      return undefined;
    }

    let tag = anchor.find('.tag');

    // Close the tag if an undefined or '0' value is passed
    if (!value || value === undefined || parseInt(value, 10) === 0) {
      if (tag.length) {
        tag.remove();
      }
      return undefined;
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
   * @returns {void}
   */
  adjustHeight() {
    const isSticky = this.scrollTarget.is('.is-sticky');
    const totalHeight = this.scrollTarget.outerHeight(true);
    let offset = totalHeight - (!isSticky ? $(window).scrollTop() : 0);

    if (this.scrollTarget.prev().is('.masthead')) {
      offset += this.scrollTarget.prev().outerHeight(true);
    }

    this.menu[0].style.height = offset > 0 ? (`calc(100% - ${offset}px)`) : '100%';
  },

  /**
   * Checks the window size against the defined breakpoint.
   * @private
   * @returns {boolean} whether or not the window size is larger than the
   *  settings-defined breakpoint
   */
  isLargerThanBreakpoint() {
    return breakpoints.isAbove(this.settings.breakpoint);
  },

  /**
   * Detects whether or not the application menu is open
   * @returns {boolean} whether or not the application menu is open
   */
  isOpen() {
    return this.menu[0].classList.contains('is-open');
  },

  /**
   * Detects a change in breakpoint size that can cause the Application Menu's state to change.
   * @returns {void}
   */
  testWidth() {
    if (this.isOpen()) {
      if (breakpoints.isAbove(this.settings.breakpoint)) {
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

    if (breakpoints.isBelow(this.settings.breakpoint)) {
      return;
    }

    if (this.userClosed || !this.settings.openOnLarge || this.isAnimating) {
      return;
    }

    this.openMenu(true);
  },

  /**
   * Opens the Application Menu
   * @param {boolean} noFocus If true, sets focus on the first item in the application menu.
   * @param {boolean} [userOpened] If true, notifies the component that the menu was
   *  manually opened by the user.
   * @param {boolean} [openedByClass] If true, only adjusts bare-miniumum requirements
   *  for the application menu to appear open (should be used in cases where the application
   *  menu has the `is-open` CSS appended to it via markup).  This skips events, animation, etc.
   */
  openMenu(noFocus, userOpened, openedByClass) {
    if (this.isAnimating === true) {
      return;
    }

    const self = this;
    const transitionEnd = $.fn.transitonEndName;

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

    this.triggers.each(function () {
      const trig = $(this);
      if (trig.parents('.header').length > 0 || trig.parents('.masthead').length > 0) {
        const header = trig.parents('.header, .masthead');
        if (header.parents('.page-container').length) {
          return;
        }

        trig.find('.icon.app-header').removeClass('go-back').addClass('close');
        trig.trigger('icon-change');
      }
    });

    // Animate the application menu open.
    // If opened by class, `is-open` is already applied to the app menu at this
    // point in the render cycle, and should not be re-applied.
    if (!openedByClass) {
      this.menu.off(`${transitionEnd}.applicationmenu`);
      this.menu[0].style.display = '';
      // next line forces a repaint
      // eslint-disable-next-line
      this.menu[0].offsetHeight; // jshint ignore:line
      this.menu.addClass('is-open');
    }

    if (breakpoints.isBelow(this.settings.breakpoint)) {
      this.menu.addClass('show-shadow');
    }

    if (!noFocus || noFocus !== true) {
      this.menu.find('.is-selected > a').focus();
    }

    if (env.os.name === 'ios') {
      const container = this.getAdjacentContainerElement();
      container.addClass('ios-click-target');
    }

    if (!openedByClass) {
      this.menu.one(`${transitionEnd}.applicationmenu`, isOpen);
      this.timeout = setTimeout(isOpen, 300);
    } else {
      isOpen();
    }

    // Events that will close the nav menu
    // On a timer to prevent conflicts with the Trigger button's click events
    setTimeout(() => {
      $(document).on('click.applicationmenu', (e) => {
        if ($(e.target).parents('.application-menu').length < 1 && !self.isLargerThanBreakpoint()) {
          self.closeMenu(true);
        }
      });
    }, 0);
  },

  /**
   * Closes the Application Menu
   * @param {boolean} [userClosed] if true, sets a flag notifying the component
   *  that the user was responsible for closing.
   */
  closeMenu(userClosed) {
    if (this.isAnimating === true) {
      return;
    }

    const self = this;
    const transitionEnd = $.fn.transitionEndName();

    this.isAnimating = true;

    function close() {
      if (self.timeout !== null) {
        clearTimeout(self.timeout);
        self.timeout = null;
      }

      self.menu.off(`${transitionEnd}.applicationmenu`);
      self.menu[0].style.display = 'none';
      self.isAnimating = false;

      if (userClosed) {
        self.userOpened = undefined;
        self.userClosed = true;
      }

      self.element.trigger('applicationmenuclose');
      $('body').triggerHandler('resize');
    }

    this.triggers.each(function () {
      const trig = $(this);
      if (trig.parents('.header').length > 0 || trig.parents('.masthead').length > 0) {
        trig.find('.icon.app-header').removeClass('close');
        trig.trigger('icon-change');
      }
    });

    if (env.os.name === 'ios') {
      const container = this.getAdjacentContainerElement();
      container.removeClass('ios-click-target');
    }

    this.menu.one(`${transitionEnd}.applicationmenu`, close);
    this.timeout = setTimeout(close, 300);

    this.menu.removeClass('is-open show-shadow').find('[tabindex]');
    $(document).off('click.applicationmenu');
  },

  /**
   * Detects whether or not the Application Menu has external trigger buttons setup to control it.
   * @returns {boolean} whether or not external triggers have been defined.
   */
  hasTriggers() {
    return (this.triggers !== undefined && this.triggers instanceof $ && this.triggers.length);
  },

  /**
   * Externally Facing function that can be used to add/remove application nav menu triggers.
   * @param {Array[]} triggers an array of HTMLElements or jQuery-wrapped elements that
   *  will be used as triggers.
   * @param {boolean} [remove] if defined, triggers that are defined will be removed
   *  internally instead of added.
   * @param {boolean} [norebuild] if defined, this control's events won't automatically
   *  be rebound to include the new triggers.
   */
  modifyTriggers(triggers, remove, norebuild) {
    if (!triggers || !triggers.length) {
      return;
    }
    let changed = $();

    $.each(triggers, (i, obj) => {
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
   * @param {array} results list of items that passed the filtering process
   * @param {function} done method to be called when the display of filtered items completes.
   * @returns {void}
   */
  filterResultsCallback(results, done) {
    const self = this;
    let filteredParentHeaders = this.accordion.find('.has-filtered-children');

    this.accordionAPI.headers.removeClass('filtered has-filtered-children');

    if (!results || !results.length) {
      this.accordionAPI.collapse(filteredParentHeaders);
      this.accordionAPI.updated();
      this.isFiltered = false;
      this.element.triggerHandler('filtered', [results]);
      done();
      return;
    }

    let matchedHeaders = $();
    results.map(function (item) {
      matchedHeaders = matchedHeaders.add(item.element);

      const parentPanes = $(item.element).parents('.accordion-pane');
      parentPanes.each(function () {
        const parentHeaders = $(this).prev('.accordion-header').addClass('has-filtered-children');
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
   * @param {jQuery.Event} e jQuery `input` event
   */
  handleSearchfieldInputEvent() {
    if (!this.searchfield || !this.searchfield.length) {
      return;
    }

    const val = this.searchfield.val();

    if (!val || val === '') {
      const filteredParentHeaders = this.accordion.find('.has-filtered-children');
      this.accordionAPI.headers.removeClass('filtered has-filtered-children');
      this.accordionAPI.collapse(filteredParentHeaders);
      this.accordionAPI.updated();
      this.element.triggerHandler('filtered', [[]]);
    }
  },

  /**
   * Unbinds event listeners and removes extraneous markup from the Application Menu.
   * @returns {this} component instance
   */
  teardown() {
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
      const sfAPI = this.searchfield.data('searchfield');
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
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Teardown - Remove added markup and events
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * This component fires the following events.
   * @fires Applicationmenu#events
   * @listens applicationmenuopen  Fires when the menu is opened.
   * @listens applicationmenuclose  Fires as the menu is closed.
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.handleTriggerEvents();

    // Setup notification change events
    this.menu.on('notify.applicationmenu', (e, anchor, value) => {
      self.notify(anchor, value);
    }).on('updated.applicationmenu', () => {
      self.updated();
    });

    this.accordion.on('blur.applicationmenu', () => {
      self.closeMenu();
    });

    $(document).on('open-applicationmenu', () => {
      self.openMenu();
    }).on('close-applicationmenu', () => {
      self.closeMenu();
    });

    $(window).on('scroll.applicationmenu', () => {
      self.adjustHeight();
    });

    $('body').on('resize.applicationmenu', () => {
      self.testWidth();
    });

    if (this.settings.filterable === true && this.searchfield && this.searchfield.length) {
      this.searchfield.on('input.applicationmenu', (e) => {
        self.handleSearchfieldInputEvent(e);
      });
    }

    if (this.settings.openOnLarge && this.isLargerThanBreakpoint()) {
      this.menu.addClass('no-transition');
      $('.page-container').addClass('no-transition');
    }
    this.testWidth();

    // Remove after initial transition
    setTimeout(() => {
      self.menu.removeClass('no-transition');
      $('.page-container').removeClass('no-transition');
    }, 800);

    return this;
  }

};

export { ApplicationMenu, COMPONENT_NAME };
