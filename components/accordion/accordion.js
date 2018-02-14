/* eslint-disable consistent-return */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery components
import '../icons/icons';
import '../utils/animations';
import '../utils/behaviors';

// Component Name
const COMPONENT_NAME = 'accordion';

// Default Accordion Options
const ACCORDION_DEFAULTS = {
  allowOnePane: true,
  displayChevron: true,
  rerouteOnLinkClick: true,
  source: null
};

/**
 * The Accordion is a grouped set of collapsible panels used to navigate sections of
 * related content. Each panel consists of two levels: the top level identifies the
 * category or section header, and the second level provides the associated options.
 *
 * @class Accordion
 * @param {object} element The component element.
 * @param {object} settings The component settings.
 * @param {string} allowOnePane If set to true, allows only one pane of the
 *  Accordion to be open at a time.  If an Accordion pane is open, and that pane
 *  contains sub-headers only one of the pane's sub-headers can be open at a time. (default true)
 * @param {string} displayChevron  Displays a "Chevron" icon that sits off to the
 * right-most side of a top-level accordion header.  Used in place of an Expander (+/-) if enabled.
 * @param {string} rerouteOnLinkClick  Can be set to false if routing
 * is externally handled
 * @param {boolean} source  A callback function that when implemented
 * provided a call back for "ajax loading" of tab contents on open.
 */
function Accordion(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, ACCORDION_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Accordion.prototype = {

  /**
  * Initialization kickoff point
  * @private
  * @param {jQuery[]} [headers] - if provided, only attempts to build the specified headers and
  * their related anchors/panes
  */
  init(headers) {
    this
      .build(headers)
      .handleEvents(headers);
  },

  /**
   * Takes a barebones Accordion markup definition and fleshes out any missing parts,
   * as well as storing references to headers, anchors, and panes.
   * @private
   * @param {jQuery[]} [headers] - if provided, only attempts to build the specified headers and
   * their related anchors/panes
   * @returns {object} The component api for chaining.
   */
  build(headers) {
    let anchors;
    let panes;
    const self = this;
    let isGlobalBuild = true;

    if (!headers || !(headers instanceof jQuery)) {
      this.headers = this.element.find('.accordion-header');
      headers = this.element.find('.accordion-header');
      this.anchors = headers.children('a');
      anchors = headers.children('a');
      this.panes = headers.next('.accordion-pane');
      panes = headers.next('.accordion-pane');
    } else {
      anchors = headers.children('a');
      panes = headers.next('.accordion-pane');
      isGlobalBuild = false;

      // update internal refs
      this.headers = this.headers.add(headers);
      this.anchors = this.anchors.add(anchors);
      this.panes = this.panes.add(panes);
    }

    let headersHaveIcons = false;

    // Accordion Headers that have an expandable pane need to have an
    // expando-button added inside of them
    headers.each(function addExpander() {
      const header = $(this);
      let hasIcons = false;
      const containerPane = header.parent();
      const isTopLevel = containerPane.is('.accordion');

      function checkIfIcons() {
        if (isTopLevel) {
          return;
        }

        if (!hasIcons) {
          header.addClass('no-icon');
          return;
        }

        containerPane.addClass('has-icons');
      }

      header.attr('role', 'presentation').hideFocus();

      // For backwards compatibility:  If an icon is found inside an anchor, bring it up to the
      // level of the header.
      header.children('a').find('svg').detach().insertBefore(header.children('a'));

      const outerIcon = header.children('.icon, svg');
      outerIcon.addClass('icon').attr({ role: 'presentation', 'aria-hidden': 'true', focusable: 'false' });
      if (isTopLevel && outerIcon.length) {
        headersHaveIcons = true;
      }

      if (header.is('.list-item') || (!isTopLevel && header.find('button').length) || (!isTopLevel && header.find('svg').length)) {
        hasIcons = true;
      }

      // Enable/Disable
      if (header.hasClass('is-disabled')) {
        header.children('a, button').attr('tabindex', '-1');
      }

      // Don't continue if there's no pane
      if (!header.next('.accordion-pane').length) {
        checkIfIcons();
        return;
      }

      hasIcons = true;

      let expander = header.children('.btn');
      if (!expander.length) {
        expander = $('<button class="btn" type="button"></button>');

        let method = 'insertBefore';
        if (self.settings.displayChevron && isTopLevel) {
          header.addClass('has-chevron');
          method = 'insertAfter';
        }
        expander[method](header.children('a'));
        header.data('addedExpander', expander);
      }

      // Hide Focus functionality
      expander.hideFocus();

      // If Chevrons are turned off and an icon is present, it becomes the expander
      if (outerIcon.length && !self.settings.displayChevron) {
        outerIcon.appendTo(expander);
      }

      let expanderIcon = expander.children('.icon, .svg, .plus-minus');
      if (!expanderIcon.length) {
        if (self.settings.displayChevron && isTopLevel) {
          expanderIcon = $.createIconElement({ icon: 'caret-down', classes: ['chevron'] });
        } else {
          const isActive = self.isExpanded(header) ? ' active' : '';
          expanderIcon = $(`<span class="icon plus-minus${isActive}" aria-hidden="true" role="presentation"></span>`);
        }
        expanderIcon.appendTo(expander);
      }
      const expanderIconOpts = {
        role: 'presentation',
        'aria-hidden': 'true'
      };
      if (!expanderIcon.is('span')) {
        expanderIconOpts.focusable = 'false';
      }
      expanderIcon.attr(expanderIconOpts);

      // Move around the Expander depending on whether or not it's a chevron
      if (expanderIcon.is('.chevron')) {
        header.addClass('has-chevron');
        expander.insertAfter(header.children('a'));
      } else {
        header.removeClass('has-chevron');
        expander.insertBefore(header.children('a'));
      }

      // Double check to see if we have left-aligned expanders or icons present,
      // so we can add classes that do alignment
      if (!self.settings.displayChevron && isTopLevel) {
        headersHaveIcons = true;
      }
      checkIfIcons();

      // Add an Audible Description to the button
      let description = expander.children('.audible');
      if (!description.length) {
        description = $('<span class="audible"></span>').appendTo(expander);
      }
      description.text(Locale.translate('Expand'));
    });

    if (headersHaveIcons) {
      this.element.addClass('has-icons');
    }

    // Setup correct ARIA for accordion panes, and auto-collapse them
    panes.each(function addPaneARIA() {
      const pane = $(this);
      const header = pane.prev('.accordion-header');

      header.children('a').attr({ 'aria-haspopup': 'true', role: 'button' });

      if (!self.isExpanded(header)) {
        pane.data('ignore-animation-once', true);
        self.collapse(header);
      }
    });

    // Expand to the current accordion header if we find one that's selected
    if (isGlobalBuild && !this.element.data('updating')) {
      let targetsToExpand = headers.filter('.is-selected, .is-expanded');

      if (this.settings.allowOnePane) {
        targetsToExpand = targetsToExpand.first();
      }

      this.expand(targetsToExpand);
      this.select(targetsToExpand.last());
    }

    return this;
  },

  /**
   * Header Click Handler
   * @private
   * @param {jQuery.Event} e The click event object
   * @param {jQuery[]} header The header query object
   * @returns {boolean} Returns false is the event should be ignored.
   */
  handleHeaderClick(e, header) {
    if (!header || !header.length || this.isDisabled(header) || this.isFiltered(header) || header.data('is-animating')) {
      e.preventDefault();
      return;
    }

    // Check that we aren't clicking the expando button.  If we click that, this listener dies
    if ($(e.target).is('[class^="btn"]')) {
      e.preventDefault();
      return;
    }

    const anchor = header.children('a');
    return this.handleAnchorClick(e, anchor);
  },

  /**
   * Anchor Click Handler
   * @private
   * @param {object} e The click event object.
   * @param {object} anchor The anchor jQuery object.
   * @returns {boolean} Returns false is the event should be ignored.
   */
  handleAnchorClick(e, anchor) {
    const self = this;
    const header = anchor.parent('.accordion-header');
    const pane = header.next('.accordion-pane');
    const ngLink = anchor.attr('ng-reflect-href');

    if (e && !ngLink) {
      e.preventDefault();
    }

    if (!header.length || this.isDisabled(header) || this.isFiltered(header)) {
      return false;
    }

    const canSelect = this.element.triggerHandler('beforeselect', [anchor]);
    if (canSelect === false) {
      return;
    }

    /**
    * Fires when a panel is opened.
    *
    * @event selected
    * @property {object} event - The jquery event object
    * @property {object} header - The header object
    */
    this.element.trigger('selected', header);

    // Set the original element for DOM traversal by keyboard
    this.originalSelection = anchor;

    this.select(anchor);

    function followLink() {
      const href = anchor.attr('href');
      if (href && href !== '' && href !== '#') {
        if (!self.settings.rerouteOnLinkClick) {
          return true;
        }

        window.location.href = href;
        return true;
      }
      return false;
    }

    // Stop propagation here because we don't want to bubble up to the Header and
    // potentially click the it twice
    if (e) {
      e.stopPropagation();
    }

    /**
     * If the anchor is a real link, follow the link and die here.
     * This indicates the link has been followed.
     *
     * @event followlink
     * @property {array} anchor - The anchor in an array
     */
    if (followLink()) {
      this.element.trigger('followlink', [anchor]);
      return true;
    }

    // If it's not a real link, try and toggle an expansion pane.
    if (pane.length) {
      self.toggle(header);
    }

    // This flag is set by the List/Detail Pattern Wrapper.
    // If this component is controlling a detail area, the anchor shouldn't focus,
    // and it should trigger an event that will bubble to the pattern to give
    // context to the detail area.
    if (this.isControllingDetails) {
      if (!pane.length) {
        self.element.trigger('drilldown', [header[0]]);
      }
    } else {
      anchor.focus();
    }

    return true;
  },

  /**
  * Expander-Button Click Handler
  * @private
  * @param {object} e The click event object.
  * @param {object} expander The jquery expander DOM element.
  * @returns {boolean} Returns false in some cases if the event should stop propagating.
  */
  handleExpanderClick(e, expander) {
    const header = expander.parent('.accordion-header');
    if (!header.length || this.isDisabled(header) || this.isFiltered(header) || header.data('is-animating')) {
      return;
    }

    // Set the original element for DOM traversal by keyboard
    this.originalSelection = expander;

    // Don't propagate when clicking the expander.  Propagating can cause the link to be clicked in
    // cases where it shouldn't be clicked.
    if (e) {
      e.stopPropagation();
    }

    const pane = header.next('.accordion-pane');
    if (pane.length) {
      this.toggle(header);
      this.select(header);
      expander.focus();
      return;
    }

    // If there's no accordion pane, attempt to simply follow the link.
    return this.handleAnchorClick(null, header.children('a'));
  },

  /**
  * Keypress Event Handler for expanders and anchors
  * @private
  * @param {jQuery.Event} e The click event object.
  * @returns {boolean} Returns false in some cases if the event should stop propagating.
  */
  handleKeys(e) {
    const self = this;
    const key = e.which;
    // will be either an anchor or expando button.  Should NEVER be the header itself.
    const target = $(e.target);
    const header = target.parent();
    const expander = header.children('[class^="btn"]').first();
    const anchor = header.children('a');

    function setInitialOriginalSelection(selection) {
      if (!selection) {
        selection = target;
      }

      if (!self.originalSelection) {
        self.originalSelection = selection;
      }
    }

    if (key === 9) { // Tab (also triggered by Shift + Tab)
      this.headers.removeClass('is-selected');

      if (target.is('a') && expander.length) {
        setInitialOriginalSelection(expander);
      } else {
        setInitialOriginalSelection(anchor);
      }
    }

    if (key === 32) { // Spacebar
      e.preventDefault();

      // Don't let this propagate and run against the header element, if it's a button
      if (target.is('[class^="btn"]')) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Firefox will attempt to run this twice, despite the fact that we're stopping propagation.
        // Just cancel the whole thing if Firefox is running this method.
        if ($('html').hasClass('is-firefox')) {
          return;
        }
      }

      if (expander.length) {
        setInitialOriginalSelection(expander);
        return this.handleExpanderClick(null, target);
      }
      setInitialOriginalSelection(anchor);
      return this.handleAnchorClick(null, target);
    }

    if (key === 37 || key === 38) { // Left Arrow/Up Arrow
      e.preventDefault();
      setInitialOriginalSelection();
      if (e.shiftKey) {
        return this.ascend(header);
      }
      return this.prevHeader(header);
    }

    if (key === 39 || key === 40) { // Right Arrow/Down Arrow
      e.preventDefault();
      setInitialOriginalSelection();
      if (e.shiftKey) {
        return this.descend(header);
      }
      return this.nextHeader(header);
    }
  },

  /**
   * Translates all existing markup inside the accordion to a JSON-compatible object structure.
   * @param {boolean} flatten If true, places all accordion headers in the root array.
   * @param {boolean} addElementReference - if true, includes a reference to the original
   * header element inside the structure (NOT valid JSON).
   * @returns {object} The data the represents the accodion structure
   */
  toData(flatten, addElementReference) {
    const data = [];
    const topHeaders = this.element.children('.accordion-header');

    function buildHeaderJSON(el, index, parentNesting, parentArr) {
      const $el = $(el);
      const pane = $(el).next('.accordion-pane');
      const headerData = {
        text: $(el).children('a, span').text().trim(),
        index: `${parentNesting !== undefined ? `${parentNesting}.` : ''}${index}`
      };

      if (el.getAttribute('id')) {
        headerData.id = el.getAttribute('id');
      }

      const icon = $el.children('.icon');
      if (icon.length) {
        headerData.icon = icon[0].tagName.toLowerCase() === 'svg' ?
          icon[0].getElementsByTagName('use')[0].getAttribute('xlink:href') :
          '';
      }

      if (addElementReference) {
        headerData.element = el;
      }

      if ($el.hasClass('is-disabled')) {
        headerData.disabled = true;
      }

      if (pane.length) {
        const content = pane.children('.accordion-content');
        const subheaders = pane.children('.accordion-header');
        const subheaderData = [];

        if (content.length) {
          headerData.content = `${content.html()}`;
        }

        if (subheaders.length) {
          // Normally this will nest.
          // If "flatten" is true, don't nest and add straight to the parent array.
          let targetArray = subheaderData;
          if (flatten) {
            targetArray = parentArr;
          }

          subheaders.each((j, subitem) => {
            buildHeaderJSON(subitem, j, headerData.index, targetArray);
          });

          headerData.children = subheaderData;
        }
      }

      parentArr.push(headerData);
    }

    // Start traversing the accordion
    topHeaders.each((i, item) => {
      buildHeaderJSON(item, i, undefined, data);
    });

    return data;
  },

  /**
  * Makes a header "selected" if its expander button or anchor tag is focused.
  * @param {object} element - a jQuery object containing either an expander button or an anchor tag.
  * @returns {void}
  */
  select(element) {
    if (!element || !element.length) {
      return;
    }

    // Make sure we select the anchor
    let anchor = element;
    let header = anchor.parent();

    if (element.is('.accordion-header')) {
      header = element;
      anchor = header.children('a');
    }

    if (anchor.is('[class^="btn"]')) {
      anchor = element.next('a');
    }

    if (this.isDisabled(header) || this.isFiltered(header)) {
      return;
    }

    this.headers.removeClass('child-selected').removeClass('is-selected');

    header.addClass('is-selected');

    const items = header.parentsUntil(this.element, '.accordion-pane')
      .prev('.accordion-header');

    items.addClass('child-selected');
  },

  /**
   * Gets the currently-selected Accordion Header, if applicable.
   * @returns {jQuery[]} the currently selected Accoridon Header, or an empty jQuery selector
   *  if there are currently no headers selected.
   */
  getSelected() {
    return this.element.find('.is-selected');
  },

  /**
  * Checks if a particular header is disabled, or if the entire accordion is disabled..
  * @param {object} header The jquery header element
  * @returns {boolean} Whether or not the element is enabled.
  */
  isDisabled(header) {
    if (this.element.hasClass('is-disabled')) {
      return true;
    }

    if (!header) {
      return false;
    }

    return header.hasClass('is-disabled');
  },

  /**
   * Checks if the header is filtered out or not
   * @param {object} header  The jquery header element
   * @returns {boolean} Whether or not the element is filtered.
   */
  isFiltered(header) {
    if (!header) {
      return false;
    }

    return header.hasClass('filtered');
  },

  /**
  * Checks if an Accordion Section is currently expanded.
  * @param {object} header The jquery header element
  * @returns {boolean} Whether or not the element is expanded.
  */
  isExpanded(header) {
    if (!header || !header.length) {
      return;
    }

    return header.children('a').attr('aria-expanded') === 'true';
  },

  /**
  * Toggle the given Panel on the Accordion between expanded and collapsed.
  * @param {object} header The jquery header element.
  * @returns {void}
  */
  toggle(header) {
    if (!header || !header.length || this.isDisabled(header) || this.isFiltered(header)) {
      return;
    }

    if (this.isExpanded(header)) {
      this.collapse(header);
      return;
    }
    this.expand(header);
  },

  /**
  * Expand the given Panel on the Accordion.
  * @param {object} header The jquery header element.
  * @returns {void}
  */
  expand(header) {
    if (!header || !header.length) {
      return;
    }

    const self = this;
    const pane = header.next('.accordion-pane');
    const a = header.children('a');

    const canExpand = this.element.triggerHandler('beforeexpand', [a]);
    if (canExpand === false) {
      return;
    }

    function continueExpand() {
      // Change the expander button into "collapse" mode
      const expander = header.children('.btn');
      if (expander.length) {
        expander.children('.plus-minus, .chevron').addClass('active');
        expander.children('.audible').text(Locale.translate('Collapse'));
      }

      const headerParents = header.parentsUntil(self.element).filter('.accordion-pane').prev('.accordion-header').add(header);

      // If we have the correct settings defined, close other accordion
      // headers that are not parents of this one.
      if (self.settings.allowOnePane) {
        self.headers.not(headerParents).each(function () {
          const h = $(this);
          if (self.isExpanded(h)) {
            self.collapse(h);
          }
        });
      }

      // Expand all headers that are parents of this one, if applicable
      headerParents.not(header).each(function () {
        const h = $(this);
        if (!self.isExpanded(h)) {
          self.expand(h);
        }
      });

      pane.addClass('is-expanded');

      /**
      * Fires when expanding a pane is initiated.
      *
      * @event expand
      * @property {object} event - The jquery event object
      * @property {array} anchor - The anchor tag in an array.
      */
      self.element.trigger('expand', [a]);

      /**
      * Fires after a pane is expanded.
      *
      * @event afterexpand
      * @property {object} event - The jquery event object
      * @property {array} anchor - The anchor tag in an array.
      */
      pane.one('animateopencomplete', (e) => {
        e.stopPropagation();
        header.children('a').attr('aria-expanded', 'true');
        self.element.trigger('afterexpand', [a]);
      }).css('display', 'block').animateOpen();
    }

    // Load from an external source, if applicable
    if (!this.callSource(a, continueExpand)) {
      continueExpand.apply(this);
    }
  },

  /**
   * Expands all accordion headers, if possible.
   * @returns {void}
   */
  expandAll() {
    if (this.settings.allowOnePane === true) {
      return;
    }

    const self = this;
    this.headers.each(function () {
      const h = $(this);
      if (!self.isExpanded(h)) {
        self.expand(h);
      }
    });
  },

  /**
  * Collapse the given Panel on the Accordion.
  * @param {object} header The jquery header element.
  * @returns {void}
  */
  collapse(header) {
    if (!header || !header.length) {
      return;
    }

    const self = this;
    const pane = header.next('.accordion-pane');
    const a = header.children('a');

    const canExpand = this.element.triggerHandler('beforecollapse', [a]);
    if (canExpand === false) {
      return;
    }

    // Change the expander button into "expand" mode
    const expander = header.children('.btn');
    if (expander.length) {
      expander.children('.plus-minus, .chevron').removeClass('active');
      expander.children('.audible').text(Locale.translate('Expand'));
    }

    pane.removeClass('is-expanded').closeChildren();
    a.attr('aria-expanded', 'false');

    /**
    *  Fires when collapsed a pane is initiated.
    *
    * @event collapse
    * @property {object} event - The jquery event object
    * @property {array} anchor - The anchor tag in an array.
    */
    self.element.trigger('collapse', [a]);

    /**
    *  Fires after a pane is collapsed.
    *
    * @event aftercollapse
    * @property {object} event - The jquery event object
    * @property {array} anchor - The anchor tag in an array.
    */
    pane.one('animateclosedcomplete', (e) => {
      e.stopPropagation();
      pane[0].style.display = 'none';
      self.element.trigger('aftercollapse', [a]);
    }).animateClosed();
  },

  /**
  * Collapses all accordion headers.
  * @returns {void}
  */
  collapseAll() {
    const self = this;
    this.headers.each(function () {
      const h = $(this);
      if (self.isExpanded(h)) {
        self.collapse(h);
      }
    });
  },

  /**
   * Uses a function (this.settings.source()) to call out to an external API to fill the
   * inside of an accordion pane.
   * @param {jQuery[]} anchor The anchor element
   * @param {Function} animationCallback The call back function
   * @returns {Function} The call back function
   */
  callSource(anchor, animationCallback) {
    if (!this.settings.source || typeof this.settings.source !== 'function') {
      return false;
    }

    const self = this;
    const header = anchor.parent();
    const pane = header.next('.accordion-pane');
    const ui = {
      anchor,
      header,
      pane
    };

    function response() {
      self.updated();
      setTimeout(() => {
        animationCallback.apply(self);
      }, 1);
    }

    // Trigger the external method and wait for a response.
    return this.settings.source(ui, response);
  },

  /**
  * Prepares a handful of references for dealing with a specific accordion header
  * @param {object} eventTarget The event we are working with.
  * @returns {object} An object with the accordion dom elements in it.
  */
  getElements(eventTarget) {
    const target = $(eventTarget);
    let header;
    let anchor;
    let expander;
    let pane = null;

    if (target.is('.accordion-header')) {
      header = target;
      expander = target.children('[class^="btn"]');
      anchor = target.children('a');
    }

    if (target.is('.btn')) {
      expander = target;
      header = expander.parent();
      anchor = header.children('a');
    }

    if (target.is('a')) {
      anchor = target;
      header = anchor.parent();
      expander = header.children('.btn');
    }

    pane = header.next('.accordion-pane');

    return {
      header,
      expander,
      anchor,
      pane
    };
  },

  /**
  * Selects an adjacent Accordion Header that sits directly before the currently selected
  * Accordion Header.
  * @param {object} element - a jQuery object containing either an expander button or an anchor tag.
  * @param {boolean} noDescend - if it's normally possible to descend into a sub-accordion, prevent
  * against descending.
  * @returns {void}
  */
  prevHeader(element, noDescend) {
    const elem = this.getElements(element);
    const adjacentHeaders = elem.header.parent().children();
    const currentIndex = adjacentHeaders.index(elem.header);
    let target = $(adjacentHeaders.get(currentIndex - 1));

    if (!adjacentHeaders.length || currentIndex === 0) {
      if (elem.header.parent('.accordion-pane').length) {
        return this.ascend(elem.header);
      }
      target = adjacentHeaders.last();
    }

    while (target.is('.accordion-content') || this.isDisabled(target) || this.isFiltered(target)) {
      if (target.is(':only-child') || target.is(':first-child')) {
        return this.ascend(elem.header);
      }
      target = target.prev();
    }

    if (target.is('.accordion-pane')) {
      const prevHeader = target.prev('.accordion-header');
      if (this.isExpanded(prevHeader)) {
        const descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
        if (descendantChildren.length && !noDescend) {
          return this.descend(prevHeader, -1);
        }
      }
      target = prevHeader;

      // if no target's available here, we've hit the end and need to wrap around
      if (!target.length) {
        if (elem.header.parent('.accordion-pane').length) {
          return this.ascend(elem.header);
        }

        target = adjacentHeaders.last();
        while (target.is('.accordion-content') || this.isDisabled(target) || this.isFiltered(target)) {
          target = target.prev();
        }
      }
    }

    this.focusOriginalType(target);
  },

  /**
  * Selects an adjacent Accordion Header that sits directly after the currently selected
  * Accordion Header.
  * @param {jQuery[]} element - a jQuery object containing either an expander button
  * or an anchor tag.
  * @param {boolean} noDescend - if it's normally possible to descend into a sub-accordion,
  * prevent against descending.
  * @returns {void}
  */
  nextHeader(element, noDescend) {
    const elem = this.getElements(element);
    const adjacentHeaders = elem.header.parent().children();
    const currentIndex = adjacentHeaders.index(elem.header);
    let target = $(adjacentHeaders.get(currentIndex + 1));

    if (!adjacentHeaders.length || currentIndex === adjacentHeaders.length - 1) {
      if (elem.header.parent('.accordion-pane').length) {
        return this.ascend(elem.header, -1);
      }
      target = adjacentHeaders.first();
    }

    while (target.is('.accordion-content') || this.isDisabled(target) || this.isFiltered(target)) {
      if (target.is(':only-child') || target.is(':last-child')) {
        return this.ascend(elem.header);
      }
      target = target.next();
    }

    if (target.is('.accordion-pane')) {
      const prevHeader = target.prev('.accordion-header');
      if (this.isExpanded(prevHeader)) {
        const descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
        if (descendantChildren.length && !noDescend) {
          return this.descend(prevHeader);
        }
      }
      target = $(adjacentHeaders.get(currentIndex + 2));

      // if no target's available here, we've hit the end and need to wrap around
      if (!target.length) {
        if (elem.header.parent('.accordion-pane').length) {
          return this.ascend(elem.header, -1);
        }

        target = adjacentHeaders.first();
        while (target.is('.accordion-content') || this.isDisabled(target) || this.isFiltered(target)) {
          target = target.next();
        }
      }
    }

    this.focusOriginalType(target);
  },

  /**
  * Selects the first Accordion Header in the parent container of the current Accordion Pane.
  * If we're at the top level, jump out of the accordion to the last focusable element.
  * @param {object} header A jQuery object containing an Accordion header.
  * @param {number} direction If -1, sets the position to be at the end of this set of
  * headers instead of at the beginning.
  * @returns {void}
  */
  ascend(header, direction) {
    if (!direction) {
      direction = 0;
    }

    const pane = header.parent('.accordion-pane');
    let target = pane.prev();

    if (direction === -1) {
      target = pane.next('.accordion-header');
      if (!target.length) {
        if (pane.parent('.accordion').length) {
          return this.nextHeader(pane.prev().children('a'), true);
        }

        return this.ascend(pane.prev(), -1);
      }
    }

    this.focusOriginalType(target);
  },

  /**
  * Selects the first Accordion Header in the child container of the current Accordion Header.
  * @param {jQuery[]} header - a jQuery object containing an Accordion header.
  * @param {integer} direction - if -1, sets the position to be at the end of this set of
  * headers instead of at the beginning.
  * @returns {void}
  */
  descend(header, direction) {
    if (!direction) {
      direction = 0;
    }

    const pane = header.next('.accordion-pane');
    let target = pane.children('.accordion-header').first();

    if (direction === -1) {
      target = pane.children('.accordion-header').last();
    }

    // No headers may be present.  In which case, it may be necessary to simply focus
    // the header for the current pane.
    if (!target.length) {
      return this.focusOriginalType(header);
    }

    if (this.isExpanded(target)) {
      return this.descend(target, -1);
    }

    this.focusOriginalType(target);
  },

  /**
  * Selects an Accordion Header, then focuses either an expander button or an anchor.
  * Governed by the property "this.originalSelection".
  * @param {object} header - a jQuery object containing an Accordion header.
  * @returns {void}
  */
  focusOriginalType(header) {
    // this.select(header.children('a'));

    if (this.originalSelection.is('.btn') && header.children('.btn').length) {
      header.children('.btn').focus();
    } else {
      header.children('a').focus();
    }
  },

  /**
  * Disable an accordion from events
  * @returns {void}
  */
  disable() {
    this.element
      .addClass('is-disabled');

    this.anchors.add(this.headers.children('[class^="btn"]')).attr('tabindex', '-1');
  },

  /**
  * Enable a disabled accordion.
  * @returns {void}
  */
  enable() {
    this.element
      .removeClass('is-disabled');

    this.anchors.add(this.headers.children('[class^="btn"]')).removeAttr('tabindex');
  },

  /**
     * Updates an entire accordion, or specific portion(s).
     * @param {jQuery[]} [headers] Optional jQuery object containing accordion headers whose
     * contents need to be torndown/rebound
     * @param {object} settings The current settings.
     * @returns {this} The api object
     */
  updated(headers, settings) {
    this.element.data('updating', true);

    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    let currentFocus = $(document.activeElement);
    if (!$.contains(this.element[0], currentFocus[0])) {
      currentFocus = undefined;
    }

    // If accordion headers are passed in, simply teardown/rebind events only for those sections.
    // Otherwise, re-init the entire accordion.
    if (headers && (headers instanceof jQuery)) {
      this
        .teardown(headers)
        .init(headers);
    } else {
      this
        .teardown()
        .init();
    }

    if (currentFocus && currentFocus.length) {
      currentFocus.focus();
    }

    $.removeData(this.element[0], 'updating');
    return this;
  },

  /**
  * Teardown process for accordion elements
  * @param {jQuery} [headers] The header elements to tear down (optional).
  * @returns {void}
  */
  teardown(headers) {
    let globalEventTeardown = false;
    let headerElems = headers;

    if (!headers || !(headers instanceof jQuery)) {
      headerElems = this.headers;
      globalEventTeardown = true;
    }
    const anchors = headerElems.find('a');

    headerElems
      .off('touchend.accordion click.accordion focusin.accordion focusout.accordion keydown.accordion mousedown.accordion mouseup.accordion')
      .each(function () {
        const header = $(this);
        const icon = header.children('.icon');

        const hideFocus = header.data('hidefocus');
        if (hideFocus) {
          hideFocus.destroy();
        }

        if (icon.length) {
          const iconAPI = icon.data('icon');
          if (iconAPI) {
            iconAPI.destroy();
          }
        }

        const expander = header.data('addedExpander');
        if (expander) {
          expander.remove();
          $.removeData(this, 'addedExpander');
        }
      });

    anchors.off('touchend.accordion keydown.accordion click.accordion');

    headerElems.children('[class^="btn"]')
      .off('touchend.accordion click.accordion keydown.accordion');

    if (globalEventTeardown) {
      this.element.off('updated.accordion selected.accordion');
    }

    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], 'accordion');
  },

  /**
   * Teardown and remove any events.
   * @private
   * @param  {object} headers The headers to destroy
   * @returns {void}
   */
  handleEvents(headers) {
    const self = this;
    let headerWhereMouseDown = null;
    let headerElems = headers;
    let globalEventSetup = false;

    // If no header elements are passed in, simply default to ALL headers.
    if (!headers || !(headers instanceof jQuery)) {
      headerElems = this.headers;
      globalEventSetup = true;
    }
    const anchors = headerElems.find('a');

    // Returns "Header", "Anchor", or "Expander" based on the element's tag
    function getElementType(element) {
      let elementType = 'Header';
      if (element.is('a')) {
        elementType = 'Anchor';
      }
      if (element.is('button')) {
        elementType = 'Expander';
      }
      return elementType;
    }

    // Intercepts a 'click' event in order to either prevent a link from being followed,
    // or allows it to continue.
    function clickInterceptor(e, element) {
      const type = getElementType(element);
      return self[`handle${type}Click`](e, element);
    }

    headerElems.on('click.accordion', function (e) {
      return clickInterceptor(e, $(this));
    }).on('focusin.accordion', function (e) {
      const target = $(e.target);

      if (!self.originalSelection) {
        self.originalSelection = target;
      }

      if (target.is(':not(.btn)')) {
        $(this).addClass('is-focused').removeClass('hide-focus');
      }
    }).on('focusout.accordion', function () {
      if (!$.contains(this, headerWhereMouseDown) || $(this).is($(headerWhereMouseDown))) {
        $(this).removeClass('is-focused');
      }
    }).on('keydown.accordion', (e) => {
      self.handleKeys(e);
    })
      .on('mousedown.accordion', function (e) {
        $(this).addClass('is-focused').removeClass('hide-focus');
        headerWhereMouseDown = e.target;
      })
      .on('mouseup.accordion', () => {
        headerWhereMouseDown = null;
      });

    anchors.on('click.accordion', function (e) {
      return clickInterceptor(e, $(this));
    });

    headerElems.children('[class^="btn"]')
      .on('click.accordion', function (e) {
        return clickInterceptor(e, $(this));
      }).on('keydown.accordion', (e) => {
        self.handleKeys(e);
      });

    if (globalEventSetup) {
      this.element.on('selected.accordion', (e) => {
        // Don't propagate this event above the accordion element
        e.stopPropagation();
      }).on('updated.accordion', (e, settings) => {
        // Don't propagate just in case this is contained by an Application Menu
        e.stopPropagation();
        self.updated(settings);
      });
    }

    return this;
  }

};

export { Accordion, COMPONENT_NAME };
/* eslint-enable no-multi-assign */
