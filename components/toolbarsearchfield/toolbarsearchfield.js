import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { breakpoints } from '../utils/breakpoints';
import { Environment as env } from '../utils/environment';
import { Locale } from '../locale/locale';

// jQuery Components
import '../searchfield/searchfield';

// Component Name
const COMPONENT_NAME = 'toolbarsearchfield';

// Component Defaults
const TBSF_DEFAULTS = {
  clearable: true,
  collapsible: true,
  collapsibleOnMobile: true
};

// Used throughout:
const TOOLBARSEARCHFIELD_EXPAND_SIZE = 280;
const MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE = 450;

/**
 * Searchfield Component Wrapper that extends normal Searchfield functionality
 *  and provides collapse/expand behavior.  For use inside of Toolbars.
 *
 * @class ToolbarSearchfield
 * @param {HTMLElement|jQuery[]} element the base element
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.clearable = true] If "true", provides an "x" button on the right edge that clears the field
 * @param {boolean} [settings.collapsible = true] If "true", allows the field to expand/collapse on larger breakpoints when
 * focused/blurred respectively
 * @param {boolean} [settings.collapsibleOnMobile = true] If true, overrides `collapsible` only on mobile settings.
 */
function ToolbarSearchfield(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, TBSF_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
ToolbarSearchfield.prototype = {

  /**
   * @private
   * @returns {this} component instance
   */
  init() {
    return this
      .build()
      .handleEvents();
  },

  /**
   * Creates and manages any markup the control needs to function.
   * @private
   * @returns {this} component instance
   */
  build() {
    // Used for managing events that are bound to $(document)
    if (!this.id) {
      this.id = this.element.uniqueId('toolbar-searchfield');
    }

    // Build the searchfield element
    this.input = this.element;

    // If inside a toolbar, make sure to append it to the root toolbar element.
    this.toolbarParent = this.element.parents('.toolbar');
    this.containmentParent = this.toolbarParent;
    const moduleTabs = this.containmentParent.closest('.module-tabs');
    if (moduleTabs.length) {
      this.containmentParent = moduleTabs;
    }

    this.getToolbarElements();

    // Setup ARIA
    let label = this.element.attr('placeholder') || this.element.prev('label, .label').text().trim();
    if (!label || label === '') {
      label = Locale.translate('Keyword');
    }
    this.input.attr({
      'aria-label': label,
    });

    // Invoke Searchfield, pass settings on
    const sfSettings = utils.extend(
      { noToolbarSearchfieldInvoke: true },
      this.settings,
      utils.parseSettings(this.input[0])
    );

    this.input.searchfield(sfSettings);
    this.inputWrapper = this.input.parent();
    this.inputWrapper.addClass('toolbar-searchfield-wrapper');

    // Disable animation/transitions initially
    // For searchfields in "non-collapsible" mode, this helps with sizing algorithms.
    this.element.addClass('no-transition no-animation');
    this.inputWrapper.addClass('no-transition no-animation');

    if (sfSettings.categories) {
      this.categoryButton = this.inputWrapper.find('.searchfield-category-button');
    }

    // Add/remove the collapsible setting
    const collapsibleMethod = this.settings.collapsible ? 'removeClass' : 'addClass';
    this.inputWrapper[collapsibleMethod]('non-collapsible');

    this.xButton = this.inputWrapper.children('.icon.close');

    this.adjustOnBreakpoint();

    if (!this.settings.collapsible || !this.settings.collapsibleOnMobile) {
      this.inputWrapper.addClass('is-open');
    } else {
      this.inputWrapper.removeClass('is-open');
    }

    return this;
  },

  /**
   * @deprecated in v4.4.0
   * @private
   * @returns {void}
   */
  handleDeactivationEvents() {
    return this.addDocumentDeactivationEvents();
  },

  /**
   * Sets up event listeners that need to be handled at the global (document) level, since they deal
   * with general keystrokes.
   * @private
   * @returns {void}
   */
  addDocumentDeactivationEvents() {
    const self = this;

    $(document)
      .on(`click.${this.id}`, (e) => {
        self.handleOutsideClick(e);
      })
      .on(`keydown.${this.id}`, (e) => {
        self.handleOutsideKeydown(e);
      });
  },

  /**
   * Removes global (document) level event handlers.
   * @private
   * @returns {void}
   */
  removeDocumentDeactivationEvents() {
    $(document).off(`click.${this.id} keydown.${this.id}`);
  },

  /**
   * Detects whether or not the Toolbar Searchfield has focus.
   * @returns {boolean} whether or not the Toolbar Searchfield has focus.
   */
  hasFocus() {
    return this.element.data('searchfield').hasFocus();
  },

  /**
   * Detects the existence of a "Categories" button added to the searchfield
   * @returns {boolean} whether or not a categories button exists.
   */
  hasCategories() {
    const searchfieldAPI = this.input.data('searchfield');
    if (searchfieldAPI === undefined || typeof searchfieldAPI.hasCategories !== 'function') {
      return false;
    }

    return searchfieldAPI.hasCategories();
  },

  /**
   * Detects the existence of a "Go" button added to the main searchfield API
   * @returns {boolean} whether or not a "Go" button exists.
   */
  hasGoButton() {
    const searchfieldAPI = this.input.data('searchfield');
    if (!searchfieldAPI || !searchfieldAPI.goButton || !searchfieldAPI.goButton.length) {
      return false;
    }

    return searchfieldAPI.hasGoButton();
  },

  /**
   * Handles the focus of the searchfield.
   * @returns {void}
   */
  handleFocus() {
    if (this.isExpanded) {
      return;
    }

    this.inputWrapper.addClass('has-focus');
    this.expand(true);
  },

  /**
   * Triggers an artificial "blur" of the searchfield, resulting in a time-delayed collapse.
   * @private
   * @deprecated in v4.4.0
   * @param {jQuery.Event} e original event
   * @returns {void}
   */
  handleFakeBlur(e) {
    return this.handleFocusOut(e);
  },

  /**
   * Handles the "focusout" event
   * @private
   * @returns {void}
   */
  handleFocusOut() {
    if (this.isFocused || !this.settings.collapsible) {
      return;
    }

    this.collapse();
  },

  /**
   * Detects whether or not an element is part of this instance of the Searchfield component
   * @private
   * @param {HTMLElement} element the element being checked.
   * @returns {boolean} whether or not the element provided is part of this Searchfield component
   */
  isSearchfieldElement(element) {
    if ($.contains(this.inputWrapper[0], element)) {
      return true;
    }

    // Don't close if a category is being selected from a category menu
    if (this.categoryButton && this.categoryButton.length) {
      const menu = this.categoryButton.data('popupmenu').menu;
      if (menu.has(element).length) {
        return true;
      }
    }

    return false;
  },

  /**
   * Event Handler for dealing with global (document) level clicks.
   * @private
   * @param {jQuery.Event} e `click` event
   * @returns {void}
   */
  handleOutsideClick(e) {
    const target = e.target;
    if (this.isSearchfieldElement(target)) {
      return;
    }

    $(document).off(this.outsideEventStr);
    this.collapse();
  },

  /**
   * Handles Keydown Events
   * @private
   * @param {jQuery.Event} e - jQuery-wrapped Keydown event.
   * @returns {void}
   */
  handleKeydown(e) {
    const key = e.which;

    if (key === 9) { // Tab
      this.handleFocusOut(e);
    }
  },

  /**
   * Handles global (document) level keydown events that are established to help
   * collapse/de-highlight searchfields on a timer.
   * @private
   * @param {jQuery.Event} e jQuery-wrapped Keydown event
   * @returns {void}
   */
  handleOutsideKeydown(e) {
    const key = e.which;
    const target = e.target;

    if (key === 9 && !this.isSearchfieldElement(target)) {
      this.isFocused = false;
      this.handleFocusOut(e);
    }
  },

  /**
   * Event Handler for the Popupmenu Component's custom `beforeopen` event.
   * @private
   * @param {jQuery.Event} e jQuery-wrapped `beforeopen` Event
   * @param {jQuery[]} menu reference to the popupmenu
   * @returns {boolean} the ability to cancel the menu's opening.
   */
  handlePopupBeforeOpen(e, menu) {
    if (!menu) {
      return false;
    }

    if (!this.isOpen()) {
      this.categoryButton.focus();
      return false;
    }

    return true;
  },

  /**
   * Retrieves the distance between a left and right boundary.
   * Used on controls like Lookup, Contextual Panel, etc. to fill the space remaining in a toolbar.
   * @private
   * @param {Number|jQuery[]} leftBoundary left boundary in pixels
   * @param {Number|jQuery[]} rightBoundary right boundary in pixels
   * @returns {number} the fill size area
   */
  getFillSize(leftBoundary, rightBoundary) {
    let leftBoundaryNum = 0;
    let rightBoundaryNum = 0;

    function sanitize(boundary) {
      if (!boundary) {
        return 0;
      }

      // Return out if the boundary is just a number
      if (!isNaN(parseInt(boundary, 10))) {
        return parseInt(boundary, 10);
      }

      if (boundary instanceof jQuery) {
        if (!boundary.length) {
          return 0;
        }

        if (boundary.is('.title')) {
          boundary = boundary.next('.buttonset');
        }

        boundary = boundary[0];
      }

      return boundary;
    }

    function getEdgeFromBoundary(boundary, edge) {
      if (!isNaN(boundary)) {
        return (boundary === null || boundary === undefined) ? 0 : boundary;
      }

      if (!edge || typeof edge !== 'string') {
        edge = 'left';
      }

      const edges = ['left', 'right'];
      if ($.inArray(edge, edges) === -1) {
        edge = edges[0];
      }

      let rect;

      if (boundary instanceof HTMLElement || boundary instanceof SVGElement) {
        rect = boundary.getBoundingClientRect();
      }

      return rect[edge];
    }

    leftBoundary = sanitize(leftBoundary);
    rightBoundary = sanitize(rightBoundary);

    function whichEdge() {
      let e = 'left';
      if (leftBoundary === rightBoundary || ($(rightBoundary).length && $(rightBoundary).is('.buttonset'))) {
        e = 'right';
      }

      return e;
    }

    leftBoundaryNum = getEdgeFromBoundary(leftBoundary);
    rightBoundaryNum = getEdgeFromBoundary(rightBoundary, whichEdge());

    if (!leftBoundaryNum && !rightBoundaryNum) {
      return TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    const distance = rightBoundaryNum - leftBoundaryNum;

    // TODO: Remove this once we figure out how to definitively fix the searchfield sizing.
    // Toolbar Searchfield needs a way to demand that the parent toolbar increase
    // the size of its buttonset and decrease the size of its title under this condition
    // -- currently there is no way.
    if (distance <= TOOLBARSEARCHFIELD_EXPAND_SIZE) {
      return TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    if (distance >= MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE) {
      return MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    return distance;
  },

  /**
   * @private
   * @returns {void}
   */
  setClosedWidth() {
    let closedWidth = 0;

    // If the searchfield category button exists, change the width of the
    // input field on the inside to provide space for the (variable) size of the currently-selected
    // category (or categories)
    if ((this.categoryButton instanceof $) && this.categoryButton.length) {
      const buttonStyle = window.getComputedStyle(this.categoryButton[0]);
      const buttonWidth = this.categoryButton.width();
      const buttonBorder = parseInt(buttonStyle.borderLeftWidth, 10) * 2;
      const buttonPadding = parseInt(buttonStyle.paddingLeft, 10) +
        parseInt(buttonStyle.paddingRight, 10);

      closedWidth += (buttonWidth + buttonBorder + buttonPadding + 4);
    }

    if (this.inputWrapper[0]) {
      this.inputWrapper[0].style.width = `${closedWidth}px`;
    }
  },

  /**
   * @private
   * @returns {void}
   */
  setOpenWidth() {
    let subtractWidth = 0;

    if (this.inputWrapper[0]) {
      this.inputWrapper[0].style.width = this.openWidth;
    }

    // If the searchfield category button exists, change the width of the
    // input field on the inside to provide space for the (variable) size of the currently-selected
    // category (or categories)
    if (this.hasCategories()) {
      const categoryButtonStyle = window.getComputedStyle(this.categoryButton[0]);
      const categoryButtonWidth = this.categoryButton.width();
      const categoryButtonPadding = parseInt(categoryButtonStyle.paddingLeft, 10) +
        parseInt(categoryButtonStyle.paddingRight, 10);
      const categoryButtonBorder = (parseInt(categoryButtonStyle.borderLeftWidth, 10) * 2);

      subtractWidth += (categoryButtonWidth + categoryButtonPadding + categoryButtonBorder);
    }

    if (this.hasGoButton()) {
      const goButton = this.element.data('searchfield').goButton;
      const goButtonStyle = window.getComputedStyle(goButton[0]);
      const goButtonWidth = goButton.width();
      const goButtonPadding = parseInt(goButtonStyle.paddingLeft, 10) +
        parseInt(goButtonStyle.paddingRight, 10);
      const goButtonBorder = (parseInt(goButtonStyle.borderLeftWidth, 10) * 2);

      subtractWidth += (goButtonWidth + goButtonPadding + goButtonBorder);
    }

    if (subtractWidth > 0) {
      this.input[0].style.width = `calc(100% - ${subtractWidth}px)`;
    }
  },

  /**
   * @private
   * @returns {void}
   */
  calculateOpenWidth() {
    const buttonset = this.element.parents('.toolbar').children('.buttonset');
    let nextElem = this.inputWrapper.next();
    let width;

    // If small form factor, use the right edge
    if (nextElem.is('.title')) {
      nextElem = buttonset;
    }

    if (this.shouldBeFullWidth()) {
      width = '100%';

      if (this.toolbarParent.closest('.header').length) {
        width = 'calc(100% - 40px)';
      }
      if (this.toolbarParent.closest('.tab-container.module-tabs').length) {
        width = 'calc(100% - 1px)';
      }

      this.openWidth = width;
      return;
    }

    if (!buttonset.length) {
      return;
    }

    // Figure out boundaries
    // +10 on the left boundary reduces the likelyhood that the toolbar pushes other elements
    // into the spillover menu whenever the searchfield opens.
    const leftBoundary = buttonset.offset().left + 10;
    let rightBoundary = nextElem;

    // If the search input sits alone, just use the other side of the buttonset to measure
    if (!rightBoundary.length) {
      rightBoundary = buttonset.offset().left + 10 + buttonset.outerWidth(true);
    }

    width = this.getFillSize(leftBoundary, rightBoundary);
    this.openWidth = `${width - 6}px`;
  },

  /**
   * @private
   * @returns {boolean} whether or not one of the components inside of this searchfield
   *  is the document's "active" element.
   */
  isActive() {
    return this.inputWrapper.hasClass('active');
  },

  /**
   * @private
   * @returns {boolean} whether or not this searchfield instance is currently expanded.
   */
  isOpen() {
    return this.inputWrapper.hasClass('is-open');
  },

  /**
   * Makes necessary adjustments to the DOM surrounding the Searchfield element to accommodate
   * breakpoint changes.
   * @private
   * @returns {void}
   */
  adjustOnBreakpoint() {
    // On smaller form-factor (tablet/phone)
    if (this.shouldBeFullWidth()) {
      this.inputWrapper.removeAttr('style');
      this.input.removeAttr('style');

      if (this.hasFocus()) {
        this.appendToParent();

        this.calculateOpenWidth();
        this.setOpenWidth();

        if (this.isExpanded) {
          return;
        }

        this.expand(true);
      } else if (this.settings.collapsibleOnMobile === true && this.isExpanded) {
        this.collapse();
      }

      return;
    }

    // On larger form-factor (desktop)
    this.appendToButtonset();

    if (!this.settings.collapsible) {
      this.calculateOpenWidth();
      this.setOpenWidth();

      if (!this.isExpanded) {
        this.expand();
        return;
      }
    }

    if (!this.hasFocus() && this.settings.collapsible === true && this.isExpanded) {
      this.collapse();
    }
  },

  /**
   * Angular may not be able to get these elements on demand so we need to be
   * able to call this during the expand method.
   * @private
   * @returns {void}
   */
  getToolbarElements() {
    if (!(this.toolbarParent instanceof $) || !this.toolbarParent.length) {
      this.toolbarParent = this.element.parents('.toolbar');
    }

    this.buttonsetElem = this.toolbarParent.children('.buttonset')[0];
    if (this.toolbarParent.children('.title').length) {
      this.titleElem = this.toolbarParent.children('.title')[0];
    }
  },

  /**
   * Expands the Searchfield
   * @param {boolean} [noFocus] If defined, causes the searchfield component not to become focused
   *  at the end of the expand method. Its default functionality is that it will become focused.
   * @returns {void}
   */
  expand(noFocus) {
    const self = this;
    const notFullWidth = !this.shouldBeFullWidth();

    if (this.isActive()) {
      return;
    }

    let containerSizeSetters;

    if (this.buttonsetElem === undefined) {
      this.getToolbarElements();
    }

    // Places the input wrapper into the toolbar on smaller breakpoints
    if (!notFullWidth) {
      this.appendToParent();
    } else {
      // Re-adjust the size of the buttonset element if the expanded searchfield would be
      // too large to fit.
      const buttonsetWidth = parseInt(window.getComputedStyle(this.buttonsetElem).width, 10);
      const buttonsetElemWidth = buttonsetWidth + TOOLBARSEARCHFIELD_EXPAND_SIZE;
      containerSizeSetters = {
        buttonset: buttonsetElemWidth
      };
    }

    this.inputWrapper.addClass('active');
    this.addDocumentDeactivationEvents();

    // Don't continue if we shouldn't expand in a mobile setting.
    if (this.shouldExpandOnMobile()) {
      self.calculateOpenWidth();
      self.setOpenWidth();
      return;
    }

    if (!self.isOpen()) {
      self.inputWrapper.addClass('is-open');
      self.calculateOpenWidth();
      self.setOpenWidth();
    }

    if (!noFocus || env.os.name === 'ios') {
      self.input.focus();
    }

    // Recalculate the Toolbar Buttonset/Title sizes.
    const eventArgs = [];
    if (containerSizeSetters) {
      eventArgs.push(containerSizeSetters);
    }
    self.toolbarParent.triggerHandler('recalculate-buttons', eventArgs);

    self.inputWrapper.one($.fn.transitionEndName(), () => {
      if (!self.isFocused && self.hasFocus() && document.activeElement !== self.input[0]) {
        self.isFocused = true;
        self.input.focus();
      }

      self.toolbarParent.triggerHandler('recalculate-buttons', eventArgs);
      self.inputWrapper.triggerHandler('expanded');
      self.isExpanded = true;
    });
  },

  /**
   * Collapses the Searchfield
   * @returns {void}
   */
  collapse() {
    const self = this;
    let textMethod = 'removeClass';

    // Puts the input wrapper back where it should be if it's been moved due to small form factors.
    this.appendToButtonset();

    if (this.input.val().trim() !== '') {
      textMethod = 'addClass';
    }
    this.inputWrapper[textMethod]('has-text');

    self.inputWrapper.removeClass('active');
    if (!self.hasFocus()) {
      self.inputWrapper.removeClass('has-focus');
      self.isFocused = false;
    }

    // Return out without collapsing or handling callbacks for the `collapse` event if:
    // Searchfield is not collapsible in general -OR-
    // Searchfield is only collapsible on mobile, and we aren't below the mobile breakpoint
    const collapsible = self.settings.collapsible;
    const collapsibleOnMobile = self.settings.collapsibleOnMobile;
    if (
      (collapsible === false && collapsibleOnMobile === false) ||
      (collapsible === false && collapsibleOnMobile === true && !self.shouldBeFullWidth())
    ) {
      return;
    }

    if (this.shouldExpandOnMobile()) {
      return;
    }

    this.inputWrapper.removeAttr('style');
    this.input.removeAttr('style');

    if (self.categoryButton && self.categoryButton.length) {
      self.categoryButton.data('popupmenu').close(false, true);
    }

    self.inputWrapper
      .removeClass('is-open')
      .triggerHandler('collapsed');

    self.removeDocumentDeactivationEvents();

    self.isExpanded = false;

    if (env.os.name === 'ios') {
      $('head').triggerHandler('enable-zoom');
    }

    self.inputWrapper.one($.fn.transitionEndName(), () => {
      self.toolbarParent.triggerHandler('recalculate-buttons');
    });
  },

  /**
   * If focused, we need to store a reference to the element with focus
   * (for example: searchfield, internal buttons, etc) because once the element
   * becomes removed from the DOM, focus is lost.
   * @private
   * @returns {void}
   */
  saveFocus() {
    if (!this.hasFocus()) {
      return;
    }
    this.focusElem = document.activeElement;
  },

  /**
   * Restores focus to an element reference that was previously focused.
   * @private
   * @returns {void}
   */
  restoreFocus() {
    if (!this.focusElem) {
      return;
    }

    this.focusElem.focus();
    this.focusElem = undefined;
  },

  /**
   * Appends this searchfield to the `containmentParent` element
   * Used when the small-form-factor searchfield needs to be established.
   * @private
   * @returns {void}
   */
  appendToParent() {
    if (this.inputWrapper.parent().is(this.containmentParent)) {
      return;
    }

    this.saveFocus();

    this.elemBeforeWrapper = this.inputWrapper.prev();
    this.inputWrapper.detach().prependTo(this.containmentParent);
    utils.fixSVGIcons(this.inputWrapper);

    this.restoreFocus();
  },

  /**
   * Removes this searchfield from the `containmentParent` element,
   * and places it back into the buttonset. Used when the small-form-factor
   * searchfield needs to be established.
   * @private
   * @returns {void}
   */
  appendToButtonset() {
    if (!this.inputWrapper.parent().is(this.containmentParent)) {
      return;
    }

    this.saveFocus();

    if (!(this.elemBeforeWrapper instanceof $) || !this.elemBeforeWrapper.length) {
      this.inputWrapper.prependTo(this.toolbarParent.children('.buttonset'));
    } else {
      this.inputWrapper.detach().insertAfter(this.elemBeforeWrapper);
      this.elemBeforeWrapper = null;
    }

    this.removeDocumentDeactivationEvents();
    this.toolbarParent.triggerHandler('scrollup');
    utils.fixSVGIcons(this.inputWrapper);

    this.restoreFocus();
  },

  /**
   * Determines whether or not, when the Searchfield is expanded, the Searchfield should be placed
   *  over top of its sibling Toolbar elements, and take up 100% of its container's space.
   * @private
   * @returns {boolean} whether or not the Toolbar should be full width.
   */
  shouldBeFullWidth() {
    const header = this.inputWrapper.closest('.header');
    let headerCondition = false;

    if (header.length) {
      headerCondition = header.width() < breakpoints.phone;
    }

    return headerCondition || breakpoints.isBelow('phone-to-tablet');
  },

  /**
   * Determines whether or not the Searchfields should expand on the Mobile breakpoint.
   * @private
   * @returns {boolean} whether or not the searchfield should expand on mobile.
   */
  shouldExpandOnMobile() {
    if (this.settings.collapsible === true) {
      return false;
    }
    if (this.settings.collapsibleOnMobile === true) {
      return true;
    }
    return this.shouldBeFullWidth();
  },

  /**
   * Used when the control has its settings or structural markup changed.
   * Rebuilds key parts of the control that otherwise wouldn't automatically update.
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
   * Enables the Searchfield
   * @returns {void}
   */
  enable() {
    this.inputWrapper.addClass('is-disabled');
    this.input.prop('disabled', true);
  },

  /**
   * Disables the Searchfield
   * @returns {void}
   */
  disable() {
    this.inputWrapper.removeClass('is-disabled');
    this.input.prop('disabled', false);
  },

  /**
   * Tears down events, properties, etc. and resets the control to "factory" state
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.inputWrapper.off('mousedown.toolbarsearchfield focusin.toolbarsearchfield keydown.toolbarsearchfield collapse.toolbarsearchfield');
    this.inputWrapper.find('.icon').remove();

    this.toolbarParent.off('navigate.toolbarsearchfield');
    this.element.off('blur.toolbarsearchfield');

    if (this.xButton && this.xButton.length) {
      this.xButton.remove();
    }

    // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
    this.removeDocumentDeactivationEvents();
    $('body').off(`resize.${this.id}`);

    return this;
  },

  /**
   * Removes the entire control from the DOM and from this element's internal data
   * @param {boolean} dontDestroySearchfield if true, will not pass through and destroy
   * a linked instance of the Searchfield component.
   */
  destroy(dontDestroySearchfield) {
    this.teardown();

    // Destroy the linked Searchfield instance
    const sf = this.element.data('searchfield');
    if (!dontDestroySearchfield && sf && typeof sf.destroy === 'function') {
      sf.destroy(true);
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  * Fires when the searchfield is clicked (if enabled).
  * @event mousedown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  * /
  /**
  * Fires when the searchfield is focused.
  * @event focusin
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  * /
  /**
  * Fires when a key is pressed inside of the searchfield.
  * @event keydown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  *  Fires when a `collapse` event is triggered externally on the searchfield.
  * @event collapse
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  *  Fires when a `beforeopen` event is triggered on the searchfield's optional categories menubutton.
  * @event beforeopen
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  * Fires when a `navigate` event is triggered on the searchfield's parent toolbar.
  * @event navigate
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  * Fires when a `keydown` event is triggered at the `document` level.
  * @event keydown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
   * Fires when a `resize` event is triggered at the `body` level.
   * @event resize
   * @memberof ToolbarSearchfield
   * @property {object} event - The jquery event object
   */

  /**
   * Removes the entire control from the DOM and from this element's internal data
   * @returns {void}
   */
  handleEvents() {
    const self = this;

    this.element.on('cleared.toolbarsearchfield', () => {
      self.element.addClass('active is-open has-focus');
      self.isFocused = true;
    });

    this.inputWrapper.on('mousedown.toolbarsearchfield', () => {
      self.fastExpand = true;
    }).on('focusin.toolbarsearchfield', (e) => {
      self.handleFocus(e);
    }).on('keydown.toolbarsearchfield', (e) => {
      self.handleKeydown(e);
    }).on('collapse.toolbarsearchfield', () => {
      self.collapse();
    })
      .on('reanimate.toolbarsearchfield', () => {
        self.element.removeClass('no-transition no-animation');
        self.inputWrapper.removeClass('no-transition no-animation');
      });

    if (this.categoryButton && this.categoryButton.length) {
      this.categoryButton.on('beforeopen.toolbarsearchfield', (e, menu) => self.handlePopupBeforeOpen(e, menu));
    }

    this.toolbarParent.on('navigate.toolbarsearchfield', () => {
      if (!self.hasFocus()) {
        self.collapse();
      }
    });

    $('body').on(`resize.${this.id}`, () => {
      self.adjustOnBreakpoint();
    });
    self.adjustOnBreakpoint();

    if (env.os.name === 'ios') {
      this.element.on('blur.toolbarsearchfield', () => {
        $('head').triggerHandler('disable-zoom');
      });
    }

    return this;
  }
};

export { ToolbarSearchfield, COMPONENT_NAME };
