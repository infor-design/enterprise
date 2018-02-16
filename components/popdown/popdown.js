import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { DOM } from '../utils/dom';
import { Locale } from '../locale/locale';

// jQuery Components

// Component Name
const COMPONENT_NAME = 'popdown';

/**
 * Component Defaults
 * @namespace
 * @property {boolean} keepOpenIf true, will keep the Popdown open after clicking
 * out until the Trigger element is clicked, or until another pop-open element is opened.
 * @property {jQuery[]} [trigger] If defined, provides a way to place the popdown
 * against an alternate element.
 */
const POPDOWN_DEFAULTS = {
  keepOpen: false,
  trigger: undefined
};

/**
 * @constructor
 * @param {jQuery[]} element the base element
 * @param {Object} [settings] incoming settings
 */
function Popdown(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, POPDOWN_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
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
    this.trigger.attr('aria-controls', this.id);

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

    return this;
  },

  hasValidTriggerSetting() {
    return (this.settings.trigger instanceof $ || DOM.isElement(this.settings.trigger));
  },

  /**
   * Detects whether or not the Popdown has focus.
   * @returns {boolean} whether or not the element is currently focused.
   */
  hasFocus() {
    const active = document.activeElement;
    if (this.trigger.is(active)) {
      return true;
    }
    if ($.contains(this.popdown[0], active)) {
      return true;
    }

    return false;
  },

  isOpen() {
    return this.trigger.attr('aria-expanded') === 'true';
  },

  open() {
    if (this.isAnimating) {
      return;
    }

    const self = this;
    let setFocusinEvent = false;

    this.isAnimating = true;
    this.trigger.attr('aria-expanded', 'true');
    this.position();
    this.popdown.addClass('visible');

    // Setup events that happen on open
    // Needs to be on a timer to prevent automatic closing of popdown.
    setTimeout(() => {
      // When focusing in on other important page elements, this Popdown instance will check to
      // see if it contains those elements, and will close if it doesn't.
      if (!setFocusinEvent) {
        setFocusinEvent = true;
        $(document).on('focusin.popdown', () => {
          if (!self.hasFocus()) {
            self.close();
          }
        });
      }

      $('body').on('resize.popdown', () => {
        if (!self.hasFocus()) {
          self.close();
        }
      });

      // Only allow $(document).click() to close the Popdown if `keepOpen` isn't set.
      if (!self.settings.keepOpen) {
        $(document).on('click.popdown', () => {
          if (!self.hasFocus()) {
            self.close();
          }
        });
      }

      self.isAnimating = false;
    }, 400);
  },

  close() {
    if (this.isAnimating) {
      return;
    }

    const self = this;
    this.isAnimating = true;
    this.trigger.attr('aria-expanded', 'false');
    this.popdown.removeClass('visible');

    // Turn off events
    this.popdown.off('focusin.popdown');
    $('body').off('resize.popdown');
    $(document).off('click.popdown focusin.popdown');

    // Sets the element to "display: none" to prevent interactions while hidden.
    setTimeout(() => {
      self.popdown[0].style.display = 'none';
      self.isAnimating = false;
    }, 400);
  },

  toggle() {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  },

  // Detaches Popdown Element and places at the body tag root, or at the root of the nearest
  // scrollable parent.
  place() {
    this.scrollparent = $('body');
    this.popdown.detach().appendTo(this.scrollparent);
  },

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

  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    if (this.hasValidTriggerSetting()) {
      this.trigger = $(this.settings.trigger);
    }

    return this;
  },

  teardown() {
    if (this.isOpen()) {
      this.close();
    }

    this.trigger
      .off('updated.popdown click.popdown')
      .removeAttr('aria-controls')
      .removeAttr('aria-expanded');

    if (this.originalParent && this.originalParent.length) {
      this.popdown.detach().appendTo(this.originalParent);
    }

    this.arrow.remove();

    return this;
  },

  // Teardown - Remove added markup and events
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Popdown, COMPONENT_NAME };
