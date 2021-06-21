import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Locale } from '../locale/locale';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { warnAboutDeprecation } from '../../utils/deprecated';

// jQuery Components

// Component Name
const COMPONENT_NAME = 'popdown';
const loopDuration = 30;

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

    // When changes happen within the subtree on the Popdown, rebuilds the internal hash of
    // tabbable elements used for retaining focus.
    this.changeObserver = new MutationObserver(() => {
      this.setFocusableElems();
    });
    this.changeObserver.observe(this.element[0], { childList: true, subtree: true });
    this.setFocusableElems();

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
   * Standard IDS check for focus.
   * @returns {boolean} whether or not the Popdown itself, or a component inside the Popdown, currently has focus.
   * In some cases, this needs to get access to child components to determine focus state.
   */
  get isFocused() {
    return this.hasFocus();
  },

  /**
   * @private
   * @param {HTMLElement} [targetElem=undefined] if defined as an HTMLElement, will be evaluated along with
   * the active element when checking to see if a child element of an IDS component has focus.
   * @returns {boolean} whether or not the Popdown itself, or a component inside the Popdown, currently has focus.
   * In some cases, this needs to get access to child components to determine focus state.
   */
  hasFocus(targetElem = undefined) {
    let componentHasFocus = false;
    const activeElem = document.activeElement;

    // If a valid HTMLElement isn't provided, cancel it out.
    if (!(targetElem instanceof HTMLElement)) {
      targetElem = undefined;
    }

    if (this.trigger.is($(activeElem))) {
      return true;
    }
    if (this.popdown[0].contains(activeElem)) {
      return true;
    }

    // If a target element is passed from an event, check it for some easy types.
    if (targetElem) {
      if (targetElem.classList.contains('overlay')) {
        return true;
      }
      if (this.popdown[0].contains(targetElem)) {
        return true;
      }
    }

    if (!this.focusableElems) {
      this.setFocusableElems();
    }

    // Check each match for IDS components that may have a more complex focus routine
    // NOTE: Some elements that come through may be SVGs, careful which methods are used.
    this.focusableElems.forEach((elem) => {
      if (componentHasFocus) {
        return;
      }

      // Check the base element
      const $elem = $(elem);
      if ($elem.is($(activeElem)) || (typeof elem.contains === 'function' && elem.contains(activeElem))) {
        componentHasFocus = true;
      }

      // Dropdown/Multiselect
      if ($elem.is('div.dropdown, div.multiselect')) {
        componentHasFocus = $elem.parent().prev('select').data('dropdown')?.isFocused;
      }

      // Lookup
      if ($elem.is('.lookup')) {
        const lookupAPI = $elem.data('lookup');
        componentHasFocus = lookupAPI?.isFocused;
        if (!componentHasFocus && targetElem) {
          componentHasFocus = lookupAPI?.modal?.element[0].contains(targetElem);
        }
      }

      // Popupmenu
      if ($elem.is('.btn-menu, .btn-actions')) {
        componentHasFocus = $elem.data('popupmenu')?.isFocused;
      }

      // Searchfield
      if ($elem.is('.searchfield')) {
        componentHasFocus = $elem.data('searchfield')?.isFocused;
      }
    });

    // Check to see if a Popover/Tooltip has focus, and if that component's parent
    // element is inside the Modal
    const tooltipParents = $(activeElem).parents('.tooltip, .popover');
    if (tooltipParents.length) {
      tooltipParents.each((i, elem) => {
        const componentName = elem.className.contains('popover') ? 'popover' : 'tooltip';
        const api = $(elem).data(componentName);
        if (api && api.isFocused) {
          componentHasFocus = true;
        }
      });
    }

    return componentHasFocus;
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
   * Creates an internal list of focusable items within the Popdown component,
   * which is used for managing tab order.
   * @private
   * @returns {void}
   */
  setFocusableElems() {
    const extraSelectors = [
      'div.dropdown',
      'div.multiselect',
      '.lookup-wrapper > span.trigger'
    ];
    const ignoredSelectors = [
      'select',
      'option'
    ];

    const elems = DOM.focusableElems(this.popdown[0], extraSelectors, ignoredSelectors);
    this.focusableElems = elems;
    this.focusableElems.first = elems[0];
    this.focusableElems.last = elems[elems.length - 1];
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
      const focusElem = this.focusableElems ?
        this.focusableElems.first : this.popdown.find(':focusable').first();
      focusElem.focus();
    }

    // Generic function for checking Popdown focus before closing
    function handleFocusOut(e) {
      if (self.focusableElems.includes(e.target) || self.hasFocus(e.target)) {
        self.keyTarget = e.target;
        return;
      }
      // Using `keydown` sometimes prematurely causes the Popdown to close if elements
      // near the front or back are focused. `keyTarget` detects what was previously clicked
      // and is used as an additional element check in these cases.
      if (e.target.tagName === 'BODY' && self.keyTarget) {
        delete self.keyTarget;
        return;
      }
      self.close();
    }

    // Setup events that happen on open
    // Needs to be on a timer to prevent automatic closing of popdown.
    if (this.addEventsTimer) {
      this.addEventsTimer.destroy(true);
      delete this.addEventsTimer;
    }
    this.addEventsTimer = new RenderLoopItem({
      duration: loopDuration,
      timeoutCallback() {
        $('body').on('resize.popdown', (e) => {
          handleFocusOut(e);
        });

        // Only allow $(document).click() to close the Popdown if `keepOpen` isn't set.
        // Also run this on `focusout` events that occur outside the Popdown, for keyboard access.
        if (!self.settings.keepOpen) {
          $(document).on('click.popdown', (e) => {
            handleFocusOut(e);
          });
        }

        // Setup a global keydown event that can handle the closing of modals in the proper order.
        $(document).on('keydown.popdown', (e) => {
          const popdownTargetElem = $(e.target).parents('.popdown');
          const keyCode = e.which || e.keyCode;
          switch (keyCode) {
            // Escape Key
            case 27:
              if (popdownTargetElem.length) {
                self.close();
              }
              break;
            // Tab Key
            case 9:
              handleFocusOut(e);
              break;
            default:
              break;
          }
        });

        self.isAnimating = false;
      }
    });
    renderLoop.register(this.addEventsTimer);
  },

  /**
   * Close the popdown.
   */
  close() {
    if (this.isAnimating) {
      return;
    }

    if (this.addEventsTimer) {
      this.addEventsTimer.destroy(true);
      delete this.addEventsTimer;
    }

    if (this.keyTarget) {
      delete this.keyTarget;
    }

    const self = this;
    this.isAnimating = true;
    this.trigger.attr('aria-expanded', 'false');
    this.popdown.removeClass('visible');

    // Turn off events
    $('body').off('resize.popdown');
    $(document).off('click.popdown focusout.popdown keydown.popdown');

    // Sets the element to "display: none" to prevent interactions while hidden.
    if (this.closeTimer) {
      this.closeTimer.destroy(true);
      delete this.closeTimer;
    }
    this.closeTimer = new RenderLoopItem({
      duration: loopDuration,
      timeoutCallback() {
        self.popdown[0].style.display = 'none';
        self.isAnimating = false;
      }
    });
    renderLoop.register(this.closeTimer);
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

    if (this.trigger) {
      this.trigger
        .off('updated.popdown click.popdown focus.popdown')
        .removeAttr('aria-controls')
        .removeAttr('aria-expanded');
    }

    if (this.changeObserver) {
      this.changeObserver.disconnect();
      delete this.changeObserver;
    }

    // First and last turn off and withdraw
    if (this.focusableElem && this.focusableElem.first instanceof jQuery) {
      this.focusableElem.first.off('keydown.popdown');
      this.focusableElem.last.off('keydown.popdown');
      delete this.focusableElem;
    }

    if (this.focusableElems && this.focusableElems.first instanceof jQuery) {
      this.focusableElems.first.off('keydown.popdown');
      this.focusableElems.last.off('keydown.popdown');
      delete this.focusableElems;
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
