import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Locale } from '../locale/locale';
import { warnAboutDeprecation } from '../../utils/deprecated';

// jQuery Components

// Component Name
const COMPONENT_NAME = 'popdown';

/**
 * The Popdown Component can be used to open an animated popdown from a button. This may in the future
 * be deprecated to one thing. Popup vs Popdown vs Tooltip.
 * @class Popdown
 * @deprecated as of v4.20.0. Please use the `Popover` component instead.
 * @param {object} element The component element.
 * @param {object} [settings] The component settings.
 * @property {boolean} [settings.keepOpen = false] If true, will keep the Popdown open after clicking out until the Trigger
 * element is clicked, or until another pop-open element is opened.
 * @property {jQuery[]} [settings.trigger] If defined, provides a way to place the popdown against an alternate element.
 * @param {boolean} [settings.autoFocus=false] If true, when the popdown is opened, the first available input/button in its content area will be focused.
 * @param {boolean} [settings.toggleOnFocus=false] If true, popdown will be toggle soon focused on the popdown trigger.
 * @param {function|boolean|object} [settings.firstLastTab=null] it can have three way to tab or shift-tab to first/last input/select/textarea in popdown.
 * If given value is function it will be call back that goes along with first/last tab in/out.
 * If given value is boolean and true it will run the default function `closeAndContinue`.
 * If given value is object it can have key/value `first`, `last`, `callback` as:
 * first - jQuery[]|string, first element to bind with tab in/out.
 * last - jQuery[]|string, last element to bind with tab in/out.
 * callback - function, a call back that goes along with first/last tab in/out.
*/
const POPDOWN_DEFAULTS = {
  keepOpen: false,
  trigger: undefined,
  autoFocus: false,
  toggleOnFocus: false,
  firstLastTab: null
};

function Popdown(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, POPDOWN_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
  warnAboutDeprecation('Popover', 'Popdown');
}

Popdown.prototype = {

  init() {
    return this
      .setup()
      .build()
      .handleEvents();
  },

  setup() {
    const self = this;
    this.popdown = $();

    // Setup the proper trigger element to use
    this.trigger = this.element;
    if (this.settings.trigger instanceof $ || DOM.isElement(this.settings.trigger)) {
      this.trigger = $(this.settings.trigger);
    }
    // Force-change the trigger element in some specific scenarios
    if (this.trigger.is('.dropdown, .multiselect')) {
      this.trigger = $(`#${this.element.attr('id')}-shdo`);
    }

    // Find the correct element to use as the popdown's view.
    function tryPopdownElement(elem) {
      if (!elem) { return false; }

      if (typeof elem === 'string') {
        if (!elem.match('#') || elem.indexOf('#') !== 0) {
          elem = `#${elem}`;
        }
        elem = $(elem);
      }

      if (elem.length) {
        self.popdown = elem;
        return true;
      }

      return false;
    }

    const popdownElem = tryPopdownElement(this.trigger.attr('data-popdown'));
    if (!popdownElem) {
      tryPopdownElement(this.trigger.next('.popdown'));
    }

    // Setup an ID for this popdown if it doesn't already have one
    this.id = this.popdown.attr('id');
    if (!this.id) {
      this.id = `popdown-${$('body').find('.popdown').index(this.popdown)}`;
      this.popdown.attr('id', this.id);
    }

    return this;
  },

  build() {
    // Ensure the popdown window is a popdown, and remove any hidden classes from it.
    this.popdown.addClass('popdown').removeClass('hidden');

    // Wrap the contents inside for spacing purposes
    const contents = this.popdown.children('.popdown-contents');
    if (!contents.length) {
      this.popdown.children().wrap('<div class="popdown-contents"></div>');
    }

    // Add the arrow markup if it doesn't already exist
    this.arrow = $('<div class="arrow"></div>').prependTo(this.popdown);

    this.place();

    // Expand if necessary
    const ariaExpanded = this.trigger.attr('aria-expanded');
    if (!ariaExpanded || ariaExpanded === undefined) {
      this.trigger.attr('aria-expanded', '');
    }
    if (ariaExpanded === 'true') {
      this.open();
    }

    // aria-controls for the trigger element
    if (this.trigger) {
      this.trigger[0].setAttribute('aria-controls', this.id);
    }
    return this;
  },

  handleEvents() {
    const self = this;

    this.trigger
      .on('click.popdown', () => {
        self.toggle();
      })
      .on('updated.popdown', () => {
        self.updated();
      });

    // First and last tab
    this.setFirstLastTab();

    // Toggle on focus for popdown trigger
    if (this.settings.toggleOnFocus) {
      this.trigger.on('focus.popdown', () => {
        this.toggle();
      });
    }

    return this;
  },

  hasValidTriggerSetting() {
    return (this.settings.trigger instanceof $ || DOM.isElement(this.settings.trigger));
  },

  /**
   * Detects whether or not the Popdown has focus.
   * @private
   * @param {HTMLElement|SVGElement} [target=undefined] an element to be checked for focus.
   * @returns {boolean} whether or not the element is currently focused.
   */
  hasFocus(target) {
    const active = target || document.activeElement;
    if (this.trigger.is(active)) {
      return true;
    }
    if (this.popdown[0].contains(active)) {
      return true;
    }

    // If focus is on an internal open Dropdown/Multiselect, stay open.
    const dds = this.popdown[0].querySelectorAll('.dropdown, .multiselect');
    let isOpen = false;
    dds.forEach((dd) => {
      const api = $(dd).data('dropdown');
      if (api && api.list && api.list.length && api.list[0].contains(active)) {
        isOpen = true;
      }
    });

    return isOpen;
  },

  /**
   * Set first last tab action.
   * @private
   * @returns {void}
   */
  setFirstLastTab() {
    const s = this.settings;
    if (s.firstLastTab && (/function|boolean|object/.test(typeof s.firstLastTab))) {
      let first = null;
      let last = null;
      let callback = null;
      if (typeof s.firstLastTab === 'object') {
        if (s.firstLastTab.first) {
          first = s.firstLastTab.first instanceof jQuery ?
            s.firstLastTab.first : $(s.firstLastTab.first);
          first.first();
          if (!this.popdown[0].contains(first[0])) {
            first = null;
          }
        }
        if (s.firstLastTab.last) {
          last = s.firstLastTab.last instanceof jQuery ?
            s.firstLastTab.last : $(s.firstLastTab.last);
          last.first();
          if (!this.popdown[0].contains(last[0])) {
            last = null;
          }
        }
        if (typeof s.firstLastTab.callback === 'function') {
          callback = s.firstLastTab.callback;
        }
      } else if (typeof s.firstLastTab === 'function') {
        callback = s.firstLastTab;
      } else if (typeof s.firstLastTab === 'boolean' ||
        s.firstLastTab) {
        callback = this.closeAndContinue;
      }

      if (callback) {
        if ((!first || !last) || (first && !first.length) || (last && !last.length)) {
          // Focusable (only input/select/textarea or with tabindex) elements in popdown
          const focusable = `input:not(:disabled):not([tabindex^="-"]),
            select:not(:disabled):not([tabindex^="-"]),
            textarea:not(:disabled):not([tabindex^="-"]),
            [tabindex]:not(:disabled):not([tabindex^="-"])`;
          const focusableElem = this.popdown.find(focusable);
          if (!first || (first && !first.length)) {
            first = focusableElem.first();
          }
          if (!last || (last && !last.length)) {
            last = focusableElem.last();
          }
        }

        // Attach them to self, so later can turn them off
        this.focusableElem = { first, last };

        // First element
        first.on('keydown.popdown', (e) => {
          if (e.keyCode === 9 && e.shiftKey) {
            e.preventDefault();
            callback({ e, self: this, first });
          }
        });
        // Last element
        last.on('keydown.popdown', (e) => {
          if (e.keyCode === 9 && !e.shiftKey) {
            e.preventDefault();
            callback({ e, self: this, last });
          }
        });
      }
    }
  },

  /**
   * Close the popdown and if available focus to prev/next focusable item.
   * @private
   * @param  {object} args The keydown event, first or last element and popdown reference
   * @returns {void}
   */
  closeAndContinue(args) {
    const focusable = $(document).find(':focusable');
    let index = focusable.index(args.self.trigger);
    if (args.e.shiftKey) {
      index = ((index - 1) < 0 ? -1 : (index - 1));
    } else {
      index = ((index + 1) >= focusable.length ? -1 : (index + 1));
    }
    if (index !== -1) {
      focusable.eq(index).focus();
    }
    args.self.close();
  },

  /**
   * Determines whether or not the popdown is open.
   * @returns {boolean} returns current state.
   */
  isOpen() {
    return this.trigger.attr('aria-expanded') === 'true';
  },

  /**
   * Open the popdown.
   */
  open() {
    if (this.isAnimating) {
      return;
    }

    const self = this;

    this.isAnimating = true;
    this.trigger.attr('aria-expanded', 'true');
    this.position();
    this.popdown.addClass('visible');

    // Auto focus
    if (this.settings.autoFocus) {
      const focusElem = this.focusableElem ?
        this.focusableElem.first : this.popdown.find(':focusable').first();
      focusElem.focus();
    }

    function handleFocusOut(e) {
      if (!self.hasFocus(e.target)) {
        self.close();
      }
    }

    // Setup events that happen on open
    // Needs to be on a timer to prevent automatic closing of popdown.
    setTimeout(() => {
      $('body').on('resize.popdown', () => {
        if (!self.hasFocus()) {
          self.close();
        }
      });

      // Only allow $(document).click() to close the Popdown if `keepOpen` isn't set.
      // Also run this on `focusin` events that occur outside the Popdown, for keyboard access.
      if (!self.settings.keepOpen) {
        $(document)
          .on('click.popdown', handleFocusOut)
          .on('focusin.popdown', handleFocusOut);
      }

      self.isAnimating = false;
    }, 400);
  },

  /**
   * Close the popdown.
   */
  close() {
    if (this.isAnimating) {
      return;
    }

    const self = this;
    this.isAnimating = true;
    this.trigger.attr('aria-expanded', 'false');
    this.popdown.removeClass('visible');

    // Turn off events
    $('body').off('resize.popdown');
    $(document).off('click.popdown focusin.popdown');

    // Sets the element to "display: none" to prevent interactions while hidden.
    setTimeout(() => {
      self.popdown[0].style.display = 'none';
      self.isAnimating = false;
    }, 400);
  },

  /**
   * Toggle the popdown.
   */
  toggle() {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  },

  /**
   * Detaches Popdown Element and places at the body tag root, or at the root of the nearest scrollable parent.
   * @private
   */
  place() {
    this.scrollparent = $('body');
    this.popdown.detach().appendTo(this.scrollparent);
  },

  /**
   * Set the right popdown position.
   * @private
   */
  position() {
    const parent = {
      offset: {
        left: 0,
        top: 0
      },
      scrollDistance: {
        left: 0,
        top: 0
      }
    };
    let winH = window.innerHeight + $(document).scrollTop();
    // subtract 2 from the window width to account for the tooltips
    // resizing themselves to fit within the CSS overflow boundary.
    let winW = (window.innerWidth - 2) + $(document).scrollLeft();

    // Reset adjustments to panel and arrow
    this.popdown.removeAttr('style');
    this.arrow.removeAttr('style');

    // Add/subtract offsets if a scrollable parent element is involved
    if (this.scrollparent.length) {
      parent.offset = this.scrollparent.offset();
      parent.scrollDistance.top = this.scrollparent.scrollTop();
      parent.scrollDistance.left = this.scrollparent.scrollLeft();
      winH -= (parent.offset.top + parent.scrollDistance.top);
      winW -= (parent.offset.left + parent.scrollDistance.left);
    }

    let adjustX = false;
    let adjustY = false;
    const t = this.trigger;
    const to = t.offset(); // Trigger offset
    const arrowHeight = 11;
    let XoffsetFromTrigger = 0;
    let YoffsetFromTrigger = 0;
    let po; // Popover offset

    // Place the popdown below to start
    this.popdown.addClass('bottom');

    this.popdown[0].style.left = `${to.left}px`;
    this.popdown[0].style.top = `${to.top + t.outerHeight(true) + arrowHeight}px`;

    this.arrow[0].style.left = `${t.outerWidth(true) / 2}px`;
    this.arrow[0].style.top = `${0 - arrowHeight}px`;

    // Get the newly-set values for the popdown's offset
    po = this.popdown.offset();

    // Get deltas for popdown position if the button is off either X edge
    if (po.left < 0) { // Checking the left edge
      adjustX = true;
      XoffsetFromTrigger = 0 - po.left;
    }
    const rightEdgePos = po.left + this.popdown.outerWidth(true);
    if (rightEdgePos > winW) { // Checking the right edge
      adjustX = true;
      XoffsetFromTrigger = rightEdgePos - winW + (Locale.isRTL() ? 20 : 0);
    }

    if (adjustX) {
      // Adjust the X position based on the deltas
      this.popdown[0].style.left = `${po.left + (XoffsetFromTrigger * -1)}px`;

      const popdownRect = this.popdown[0].getBoundingClientRect();
      const triggerRect = t[0].getBoundingClientRect();
      const deltaRightEdge = popdownRect.right - triggerRect.right + 10;

      this.arrow[0].style.left = 'auto';
      this.arrow[0].style.right = `${deltaRightEdge}px`;

      // Get the newly set values
      po = this.popdown.offset();
    }

    // Get the deltas for popdown position if the button is off either Y edge
    if (po.top < 0) { // Checking top edge
      adjustY = true;
      YoffsetFromTrigger = 0 - po.top;
    }
    let bottomEdgePos = po.top + this.popdown.outerHeight(true);
    if (bottomEdgePos > winH) { // Checking the bottom edge
      adjustY = true;
      YoffsetFromTrigger = bottomEdgePos - winH;
    }

    // Remove the arrow if we need to adjust this, since it won't line up anymore
    if (adjustY) {
      this.arrow[0].style.display = 'none';

      // Adjust the Y position based on the deltas
      this.popdown[0].style.top = `${po.top + (YoffsetFromTrigger * -1)}px`;
      this.arrow[0].style.top = `${parseInt(this.arrow[0].style.top, 10) - (YoffsetFromTrigger * -1)}px`;

      // Get the values again
      po = this.popdown.offset();
    }

    // One last check of the Y edges.  At this point, if either edge is out of bounds, we need to
    // shrink the height of the popdown, as it's too tall for the viewport.
    if (po.top < 0 || po.top + this.popdown.outerHeight(true) > winH) {
      this.popdown[0].style.top = 0;
      po = this.popdown.offset();

      bottomEdgePos = po.top + this.popdown.outerHeight(true);
      this.popdown[0].style.height = `${parseInt(this.popdown[0].style.height, 10) - (bottomEdgePos - winH)}px`;
    }
  },

  /**
   * Update the popdown and refresh with new settings
   * @param  {object} settings The new settings
   * @returns {object} The component api.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    if (this.hasValidTriggerSetting()) {
      this.trigger = $(this.settings.trigger);
    }

    return this;
  },

  /**
   * Release Events
   * @private
   * @returns {object} The component api.
   */
  teardown() {
    if (this.isOpen()) {
      this.close();
    }

    this.trigger
      .off('updated.popdown click.popdown focus.popdown')
      .removeAttr('aria-controls')
      .removeAttr('aria-expanded');

    // First and last turn off and withdraw
    if (this.focusableElem) {
      this.focusableElem.first.off('keydown.popdown');
      this.focusableElem.last.off('keydown.popdown');
      delete this.focusableElem;
    }

    if (this.originalParent && this.originalParent.length) {
      this.popdown.detach().appendTo(this.originalParent);
    }

    this.arrow.remove();

    return this;
  },

  /**
   * Teardown - Remove added markup and events
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Popdown, COMPONENT_NAME };
