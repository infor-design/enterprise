/* eslint-disable consistent-return */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { Locale } from '../locale/locale';
import { warnAboutDeprecation } from '../../utils/deprecated';

// jQuery components
import '../icons/icons.jquery';
import '../../utils/animations';
import '../../utils/behaviors';
import '../notification-badge/notification-badge.jquery';

// Component Name
const COMPONENT_NAME = 'accordion';

// Expander Button Display Modes
// In some cases, expander buttons can be all "plus-minus" icons, or all "chevron" icons.
// "Classic" is the original mode, with Chevrons at the top level, and Plus-minus style on all subheaders.
// "Plus-minus" mode is the replacement setting for the deprecated setting `displayChevron`
const expanderDisplayModes = ['classic', 'plus-minus', 'chevron'];

/**
 * The Accordion is a grouped set of collapsible panels used to navigate sections of
 * related content. Each panel consists of two levels: the top level identifies the
 * category or section header, and the second level provides the associated options.
 *
 * @class Accordion
 * @param {object} element The component element.
 * @param {object} [settings] The component settings.
 * @param {function} [settings.accordionFocusCallback] Hook for controlling focus of a desired accordion section, which may contain custom content,
 * @param {string} [settings.allowOnePane=true] If set to true, allows only one pane of the Accordion to be open at a
 * time. If an Accordion pane is open, and that pane contains sub-headers only one of the pane's sub-headers can be open at a time. (default true)
 * @param {boolean} [settings.displayChevron=true] (deprecated in v4.23.0) Displays a "Chevron" icon that sits off to the right-most
 * side of a top-level accordion header. Used in place of an Expander (+/-) if enabled.  Use `settings.expanderDisplay` instead.
 * @param {boolean} [settings.enableTooltips=true] If false, does not run logic to apply tooltips to elements with truncated text.
 * @param {string} [settings.expanderDisplay='classic'] Changes the iconography used in accordion header expander buttons. By default, top level expanders will be chevrons, and sub-header expanders will be "plus-minus" style.  This setting can also be "plus-minus" or "chevron" to force the same icons throughout the accordion.
 * @param {string} [settings.rerouteOnLinkClick=true]  Can be set to false if routing is externally handled
 * @param {boolean} [settings.source=null]  A callback function that when implemented provided a call back for "ajax loading" of tab contents on open.
 */
const ACCORDION_DEFAULTS = {
  accordionFocusCallback: (header, defaultFocusBehavior) => defaultFocusBehavior(),
  allowOnePane: true,
  expanderDisplay: expanderDisplayModes[0],
  enableTooltips: true,
  rerouteOnLinkClick: true,
  notificationBadge: false,
  source: null
};

// Handles the conversion of deprecated settings to current settings
function handleDeprecatedSettings(settings) {
  if (settings.displayChevron !== undefined) {
    warnAboutDeprecation('expanderDisplay setting', 'displayChevron setting');
    if (settings.displayChevron === false) {
      settings.expanderDisplay = expanderDisplayModes[1]; // plus-minus
    } else {
      settings.expanderDisplay = expanderDisplayModes[0]; // classic
    }
    delete settings.displayChevron;
  }
  return settings;
}

function Accordion(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, ACCORDION_DEFAULTS);
  this.settings = handleDeprecatedSettings(this.settings);

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
      .handleEvents(headers)
      .setupTooltips();
  },

  /**
   * Takes a barebones Accordion markup definition and fleshes out any missing parts,
   * as well as storing references to headers, anchors, and panes.
   * @private
   * @param {jQuery[]} [headers] if provided, only attempts to build the specified headers and
   *  their related anchors/panes
   * @param {boolean} [noFilterReset] if provided, will not reset the contents of the
   * `currentlyFiltered` property.
   * @returns {object} The component api for chaining.
   */
  build(headers, noFilterReset) {
    let anchors;
    let panes;
    let contentAreas;
    const self = this;
    let isGlobalBuild = true;

    if (!headers || !(headers instanceof jQuery)) {
      this.headers = this.element.find('.accordion-header');
      headers = this.element.find('.accordion-header');
      this.anchors = headers.children('a');
      anchors = this.anchors;
      this.panes = headers.next('.accordion-pane');
      panes = this.panes;
      this.contentAreas = panes.children('.accordion-content');
      contentAreas = this.contentAreas;
    } else {
      anchors = headers.children('a');
      panes = headers.next('.accordion-pane');
      contentAreas = panes.children('.accordion-content');
      isGlobalBuild = false;

      // update internal refs
      this.headers = this.headers.add(headers);
      this.anchors = this.anchors.add(anchors);
      this.panes = this.panes.add(panes);
      this.contentAreas = this.contentAreas.add(contentAreas);
    }

    // Making the accordion pane to display
    // so the scrollHeight in textarea will be calculated
    const textAreaChild = $('.accordion-content').find('textarea');
    if (textAreaChild) {
      textAreaChild.parents('.accordion-pane').attr('style', 'display: block');
    }

    let headersHaveIcons = false;

    // Accordion Headers that have an expandable pane need to have an
    // expando-button added inside of them
    headers.each(function addExpander() {
      const header = $(this);
      let hasIcons = false;
      let containerPane = header.parent();
      let isTopLevel = containerPane.is('.accordion');

      if (containerPane.is('.accordion-section')) {
        containerPane = containerPane.parentsUntil('.accordion');
        isTopLevel = true;
      }

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

      header.hideFocus();

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
        if (self.settings.expanderDisplay !== 'plus-minus' && isTopLevel) {
          header.addClass('has-chevron');
          method = 'insertAfter';
        }
        expander[method](header.children('a'));
        header.data('addedExpander', expander);
      }

      // Hide Focus functionality
      expander.hideFocus();

      // If Chevrons are turned off and an icon is present, it becomes the expander
      if (outerIcon.length && (self.settings.expanderDisplay === 'plus-minus')) {
        outerIcon.appendTo(expander);
      }

      let expanderIcon = expander.children('.icon, .svg, .plus-minus');
      if (!expanderIcon.length) {
        if ((self.settings.expanderDisplay === 'classic' && isTopLevel) ||
          self.settings.expanderDisplay === 'chevron') {
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
      // ONLY do this if the chevron is top-level.
      if (expanderIcon.is('.chevron') && isTopLevel) {
        header.addClass('has-chevron');
        expander.insertAfter(header.children('a'));
      } else {
        header.removeClass('has-chevron');
        expander.insertBefore(header.children('a'));
      }

      // Double check to see if we have left-aligned expanders or icons present,
      // so we can add classes that do alignment
      if (self.settings.expanderDisplay === 'plus-minus' && isTopLevel) {
        headersHaveIcons = true;
      }
      checkIfIcons();
    });

    if (headersHaveIcons) {
      this.element.addClass('has-icons');
    }

    // Expand to the current accordion header if we find one that's selected
    if (isGlobalBuild && !this.element.data('updating')) {
      let targetsToExpand = headers.filter('.is-selected, .is-expanded');
      targetsToExpand.next('.accordion-pane').addClass('no-transition');

      if (this.settings.allowOnePane) {
        targetsToExpand = targetsToExpand.first();
        this.expand(targetsToExpand);
      } else {
        targetsToExpand.each((idx) => {
          this.expand($(targetsToExpand[idx]));
        });
      }

      this.select(targetsToExpand.last());
      targetsToExpand.next('.accordion-pane').removeClass('no-transition');
    }

    panes.each(function addPaneARIA() {
      const pane = $(this);
      const header = pane.prev('.accordion-header');

      // Setup correct ARIA for accordion panes
      header.children('a').attr({ 'aria-haspopup': 'true', role: 'button' });

      // double-check the contents of the pane. If all children are filtered out,
      // label this at the top level
      const children = pane.children();
      let allChildrenFiltered = true;
      children.each((i, child) => {
        if ($(child).is('.accordion-header, .accordion-content') && !$(child).hasClass('filtered')) {
          allChildrenFiltered = false;
        }
      });
      pane[allChildrenFiltered ? 'addClass' : 'removeClass']('all-children-filtered');

      if (allChildrenFiltered) {
        pane.data('ignore-animation-once', true);
        self.collapse(header, false);
      }

      // Preset the "expand/collase" on initial render, if applicable
      if (!noFilterReset) {
        let heightAttr = '0px';
        if (self.isExpanded(header)) {
          heightAttr = 'auto';
        }
        pane.attr('style', `height: ${heightAttr}`);
      }
    });

    // Retain an internal storage of available filtered accordion headers.
    if (!noFilterReset) {
      this.currentlyFiltered = $();
    }

    this.createNotificationBadge();

    return this;
  },

  /**
    * Builds notification badge for accordion headers
    * @returns {void}
    */
  createNotificationBadge() {
    if (!this.settings.notificationBadge) {
      return;
    }

    this.element.find('.accordion-header').each((index, val) => {
      const headerEl = $(val);

      if (headerEl.children('.notification-badge-container').length < 1) {
        const headerData = headerEl.data();
        headerEl.notificationbadge({
          position: headerData.options.position,
          color: headerData.options.color
        });

        const icon = headerEl.find('.icon');
        const badgeEl = headerEl.find('.notification-badge-container');
        badgeEl.prepend(icon);
        headerEl.prepend(badgeEl);
      }
    });
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

    if (e && !ngLink && !header.is('.module-nav-settings-btn')) {
      e.preventDefault();
    }

    if (!header.length || this.isDisabled(header) || this.isFiltered(header)) {
      return false;
    }

    const canSelect = this.element.triggerHandler('beforeselect', [anchor]);
    if (canSelect === false) {
      return;
    }

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

    if (!header.is('.module-nav-settings-btn')) this.closePopups(e);

    /**
     * If the anchor is a real link, follow the link and die here.
     * This indicates the link has been followed.
     *
     * @event followlink
     * @memberof Accordion
     * @param {array} anchor - The anchor in an array
     */
    if (followLink()) {
      this.element.trigger('followlink', [anchor]);
      return true;
    }

    // If it's not a real link, try and toggle an expansion pane.
    if (pane.length) {
      self.toggle(header);
      self.focusOriginalType(header);
      return true;
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
      self.orignalSelection = anchor;
      self.focusOriginalType(header);
    }

    /**
    * Fires when an accordion header is truly selected.
    *
    * @event selected
    * @memberof Accordion
    * @param {object} event - The jquery event object
    * @param {object} header - The header object
    */
    this.element.trigger('selected', header);

    return true;
  },

  /**
  * Close any open popup menus.
  * @private
  * @param {object} e The click event object.
  */
  closePopups(e) {
    const openPopup = $('.popupmenu.is-open');
    if (openPopup.length) {
      const headers = this.element.find('.accordion-header[aria-haspopup="true"]');
      headers.each(function () {
        const api = $(this).data('popupmenu');
        api.close();
        if (e !== undefined) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
        return false;
      });
    }
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

    this.closePopups();

    const pane = header.next('.accordion-pane');
    if (pane.length) {
      this.toggle(header);
      this.select(header);
      this.focusOriginalType(header);
      return;
    }

    // If there's no accordion pane, attempt to simply follow the link.
    return this.handleAnchorClick(e, header.children('a'));
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
    const headerPanes = document.querySelectorAll('.accordion-pane');

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

      const collapsedPanes = [...headerPanes].filter(pane => !pane.classList.contains('is-expanded'));
      const expandedPanes = [...headerPanes].filter(pane => pane.classList.contains('is-expanded'));

      // If accordion pane is expanded enable normal tabbing behavior.
      expandedPanes.forEach((pane) => {
        [...pane.children].forEach((el) => {
          if (!$(el).hasClass('is-disabled')) {
            $(el).find('a').removeAttr('tabindex');
            $(el).find('button').removeAttr('tabindex');
          }
        });
      });

      // If accordion pane is collapsed skip over the child elements.
      collapsedPanes.forEach((pane) => {
        [...pane.children].forEach((el) => {
          $(el).find('a').attr('tabindex', '-1');
          $(el).find('button').attr('tabindex', '-1');
        });
      });

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
    let data = [];
    const topHeaders = this.element.children('.accordion-header');

    function buildElementJSON(el, index, parentNesting, parentArr) {
      const $el = $(el);
      const pane = $(el).next('.accordion-pane');
      const isContentArea = el.classList.contains('accordion-content');

      const elemData = {
        index: `${parentNesting !== undefined ? `${parentNesting}.` : ''}${index}`,
        type: isContentArea ? 'content' : 'header'
      };

      if (addElementReference) {
        elemData.element = el;
      }

      if (el.getAttribute('id')) {
        elemData.id = el.getAttribute('id');
      }

      if (isContentArea) {
        elemData.content = `${$el.html()}`;
        elemData.contentText = `${$el.text().trim().replace(/\n|\s{2,}/g, ' ')}`;
      } else {
        elemData.text = $el.children('a, span').text().trim();
      }

      const icon = $el.children('.icon');
      if (icon.length) {
        elemData.icon = icon[0].tagName.toLowerCase() === 'svg' ?
          icon[0].getElementsByTagName('use')[0].getAttribute('href') :
          '';
      }

      if ($el.hasClass('is-disabled')) {
        elemData.disabled = true;
      }

      if (pane.length) {
        const subElems = pane.children('.accordion-header, .accordion-content');
        const subElementData = [];

        if (subElems.length) {
          // Normally this will nest.
          // If "flatten" is true, don't nest and add straight to the parent array.
          let targetArray = subElementData;
          if (flatten) {
            targetArray = parentArr;
          }

          subElems.each((j, subitem) => {
            buildElementJSON(subitem, j, elemData.index, targetArray);
          });

          elemData.children = subElementData;
        }
      }

      parentArr.push(elemData);
    }

    function buildSectionJSON(el, index, parentNesting) {
      const sectionData = {
        index: `${parentNesting !== undefined ? `${parentNesting}.` : ''}${index}`,
        type: 'section'
      };

      if (addElementReference) {
        sectionData.element = el;
      }

      if (el.getAttribute('id')) {
        sectionData.id = el.getAttribute('id');
      }

      const children = $(el).children('.accordion-header');
      let childrenData = [];
      if (children.length) {
        children.each((j, childEl) => {
          buildElementJSON(childEl, j, index, childrenData);
        });
      }
      sectionData.children = childrenData;

      return flatten ? childrenData : sectionData;
    }

    // Start traversing the accordion
    if (!topHeaders.length) {
      const sections = this.element.find('.accordion-section');

      sections.each((i, section) => {
        const sectionArray = buildSectionJSON(section, i, undefined, data);
        if (flatten) data = data.concat(sectionArray);
        else data.push(sectionArray);
      });
    }

    topHeaders.each((i, item) => {
      buildElementJSON(item, i, undefined, data);
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
   * @returns {jQuery[]} the currently selected Accordion Header, or an empty jQuery selector
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
    if (!header || !header.length) {
      return false;
    }

    const cl = header[0].classList;
    return cl.contains('filtered') && !cl.contains('has-filtered-children');
  },

  /**
  * Checks if an Accordion Section is currently expanded.
  * @param {object} header The jquery header element
  * @returns {boolean} Whether or not the element is expanded.
  */
  isExpanded(header) {
    if (header && header instanceof Element) {
      header = $(header);
    }

    if (!header || !header.length) {
      return;
    }

    return header.children('a').attr('aria-expanded') === 'true' || header.hasClass('is-expanded');
  },

  /**
  * Toggle the given Panel on the Accordion between expanded and collapsed.
  * @param {object} header The jquery header element.
  * @returns {void}
  */
  toggle(header) {
    if (!header || !header.length || this.isDisabled(header) || this.isFiltered(header) ||
      this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, 500);

    if (this.isExpanded(header)) {
      this.collapse(header);
      return;
    }
    this.expand(header);
  },

  /**
  * Expand the given Panel on the Accordion.
  * @param {object|string} header The jquery header element or the id of a header DOM element
  * @param {boolean} dontCollapseHeaders if defined, will not collapse any open accordion headers
  *  (generally used while filtering)
  * @returns {$.Deferred} resolved on the completion of an Accordion pane's
  *  collapse animation (or immediately, if animation is disabled).
  */
  expand(header, dontCollapseHeaders) {
    if (typeof header === 'string') {
      header = this.element.find(`#${header}`).first();
    }
    if (!header || !header.length) {
      return;
    }

    const self = this;
    let pane = header.next('.accordion-pane');
    const a = header.children('a');
    const dfd = $.Deferred();

    const canExpand = this.element.triggerHandler('beforeexpand', [a]);
    if (canExpand === false) {
      return dfd.reject();
    }

    function continueExpand() {
      // Don't try to expand any further if this header has no associated accordion pane.
      // NOTE: We re-check for the pane's existence here because it may have been loaded via AJAX.
      pane = header.next('.accordion-pane');
      if (!pane || !pane.length) {
        return dfd.reject();
      }

      // Change the expander button into "collapse" mode
      const expander = header.children('.btn');
      if (expander.length) {
        expander.children('.plus-minus, .chevron').addClass('active');
        expander.children('.audible').text(Locale.translate('Collapse'));
      }

      const headerParents = header.parentsUntil(self.element).filter('.accordion-pane').prev('.accordion-header').add(header);

      // If we have the correct settings defined, close other accordion
      // headers that are not parents of this one.
      const collapseDfds = [];
      if (self.settings.allowOnePane && !dontCollapseHeaders && self.headers) {
        self.headers.not(headerParents).each(function () {
          const h = $(this);
          if (self.isExpanded(h)) {
            collapseDfds.push(self.collapse(h));
          }
        });
      }

      // Expand all headers that are parents of this one, if applicable
      const expandDfds = [];
      if (headerParents) {
        headerParents.not(header).each(function () {
          const h = $(this);
          if (!self.isExpanded(h)) {
            expandDfds.push(self.expand(h));
          }
        });
      }
      header.add(pane).addClass('is-expanded');
      header.children('a').attr('aria-expanded', 'true');

      /**
      * Fires when expanding a pane is initiated.
      *
      * @event expand
      * @memberof Accordion
      * @param {object} event - The jquery event object
      * @param {array} anchor - The anchor tag in an array.
      */
      self.element.trigger('expand', [a]);

      /**
       * Fires after a pane is expanded.
       *
       * @event afterexpand
       * @memberof Accordion
       * @param {jQuery.Event} [e] - The jquery event object
       * @param {array} anchor - The anchor tag in an array.
       */
      function handleAfterExpand(e) {
        if (e) {
          e.stopPropagation();
        }
        $.when(...expandDfds, ...collapseDfds).done(() => {
          dfd.resolve();
        });
        pane.triggerHandler('afterexpand', [a]);
        pane.css('height', 'auto');
        self.element.trigger('afterexpand', [a]);
      }

      if (pane.hasClass('no-transition') || this.element.hasClass('no-transition')) {
        handleAfterExpand();
      } else {
        pane.one('animateopencomplete', handleAfterExpand).animateOpen();
      }
    }

    // Load from an external source, if applicable
    if (!this.callSource(a, continueExpand)) {
      continueExpand.apply(this);
    }

    return dfd;
  },

  /**
   * Expands all accordion headers, if possible.
   * @returns {$.Deferred} resolved when all the accordion panes being expanded
   *  complete their animations.
   */
  expandAll() {
    if (this.settings.allowOnePane === true) {
      return;
    }

    const self = this;
    const dfd = $.Deferred();
    const dfds = [];

    this.headers.each(function () {
      const h = $(this);
      if (!self.isExpanded(h)) {
        dfds.push(self.expand(h));
      }
    });

    $.when(...dfds).always(() => {
      dfd.resolve();
    });

    return dfd;
  },

  /**
  * Collapse the given Panel on the Accordion.
  * @param {object|string} header The jquery header element or the id of a header DOM element
  * @param {boolean} closeChildren If true closeChildren elements that may be on the page. Skip for performance.
  * @returns {$.Deferred} resolved on the completion of an Accordion pane's
  *  collapse animation (or immediately, if animation is disabled).
  */
  collapse(header, closeChildren = true) {
    if (typeof header === 'string') {
      header = this.element.find(`#${header}`).first();
    }
    if (!header || !header.length) {
      return;
    }

    const self = this;
    const pane = header.next('.accordion-pane');
    const a = header.children('a');
    const dfd = $.Deferred();

    const canExpand = this.element.triggerHandler('beforecollapse', [a]);
    if (canExpand === false) {
      return dfd.reject();
    }

    // Change the expander button into "expand" mode
    const expander = header.children('.btn');
    if (expander.length) {
      expander.children('.plus-minus, .chevron').removeClass('active');
      expander.children('.audible').text(Locale.translate('Expand'));
    }

    if (closeChildren && pane.closeChildren) {
      pane.closeChildren();
    }

    /**
    *  Fires when collapsed a pane is initiated.
    *
    * @event collapse
    * @memberof Accordion
    * @param {jQuery.Event} event - The jquery event object
    * @param {array} anchor - The anchor tag in an array.
    */
    self.element.trigger('collapse', [a]);

    /**
     * Fires after a pane is collapsed.
     *
     * @event aftercollapse
     * @memberof Accordion
     * @param {jQuery.Event} [e] - The jquery event object
     */
    function handleAfterCollapse(e) {
      if (e) {
        e.stopPropagation();
      }

      header.add(pane).removeClass('is-expanded');
      a.attr('aria-expanded', 'false');
      pane.triggerHandler('aftercollapse', [a]);
      self.element.trigger('aftercollapse', [a]);
      dfd.resolve();
    }

    if (pane.hasClass('no-transition') || this.element.hasClass('no-transition')) {
      handleAfterCollapse();
    } else {
      pane.one('animateclosedcomplete', handleAfterCollapse).animateClosed();
    }
    return dfd;
  },

  /**
  * Collapses all accordion headers.
  * @returns {void}
  * @returns {$.Deferred} resolved when all the accordion panes being collapsed
  *  complete their animations.
  */
  collapseAll() {
    const self = this;
    const dfd = $.Deferred();
    const dfds = [];

    this.headers.each(function () {
      const h = $(this);
      if (self.isExpanded(h)) {
        dfds.push(self.collapse(h));
      }
    });

    $.when(...dfds).always(() => {
      dfd.resolve();
    });

    return dfd;
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

    function response(skipUpdated, headers) {
      if (skipUpdated !== true) {
        self.updated(headers);
      }

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
    let section = null;

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
    if (header.parent('.accordion-section')) section = header.parent('.accordion-section');

    return {
      header,
      expander,
      anchor,
      pane,
      section
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
    let target = $(adjacentHeaders.get(xssUtils.ensureAlphaNumeric(currentIndex) - 1));

    if (!adjacentHeaders.length || currentIndex === 0) {
      // Handle parent panes
      if (elem.header.parent('.accordion-pane').length) {
        return this.ascend(elem.header);
      }

      // Handle adjacent sections
      if (elem.header.is(':first-child') && elem.section) {
        let prevSection = elem.section.prev('.accordion-section');
        let prevSectionChildren;
        if (prevSection.length) {
          prevSectionChildren = prevSection.children();
          target = $(prevSectionChildren[prevSectionChildren.length - 1]);
        } else {
          prevSection = elem.section.parent().children().last('.accordion-section');
          if (prevSection.length) {
            prevSectionChildren = prevSection.children();
            target = $(prevSectionChildren[prevSectionChildren.length - 1]);
          }
        }
      }

      // Use the last-possible header
      if (!target.length) {
        target = adjacentHeaders.last();
      }
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

        const prevSection = elem.header.parent('.accordion-section')?.prev('.accordion-section');
        if (prevSection.length) {
          target = $(prevSection.children()[0]);
        }

        if (!target.length) {
          target = adjacentHeaders.last();
        }

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
    let target = $(adjacentHeaders.get(xssUtils.ensureAlphaNumeric(currentIndex) + 1));

    if (!adjacentHeaders.length || currentIndex === adjacentHeaders.length - 1) {
      if (elem.header.parent('.accordion-pane').length) {
        return this.ascend(elem.header, -1);
      }

      if (elem.header.is(':last-child') && elem.section) {
        let nextSection = elem.section.next('.accordion-section');
        if (nextSection.length) {
          target = $(nextSection.children()[0]);
        } else {
          nextSection = elem.section.parent().children().first('.accordion-section');
          if (nextSection.length) {
            target = $(nextSection.children()[0]);
          }
        }
      }

      if (!target.length) {
        target = adjacentHeaders.first();
      }
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
      target = $(adjacentHeaders.get(xssUtils.ensureAlphaNumeric(currentIndex) + 2));

      // if no target's available here, we've hit the end and need to wrap around
      if (!target.length) {
        if (elem.header.parent('.accordion-pane').length) {
          return this.ascend(elem.header, -1);
        }

        const nextSection = elem.header.parent('.accordion-section')?.next('.accordion-section');
        if (nextSection.length) {
          target = $(nextSection.children()[0]);
        }

        if (!target.length) {
          target = adjacentHeaders.first();
        }

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
        // @TODO Detect adjacent accordion sections here

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
  * Focuses an accordion header by either its anchor, or its optional expander button.
  * Governed by the property "this.originalSelection".
  * @param {object} header - a jQuery object containing an Accordion header.
  * @returns {void}
  */
  focusOriginalType(header) {
    const defaultFocusBehavior = () => {
      const btns = header.children('[class*="btn"]');
      this.headers.not(header).removeClass('is-focused');

      if (this.originalSelection.is('[class*="btn"]') && btns.length) {
        btns.first()[0].focus();
      } else {
        header.children('a')[0].focus();
        header.addClass('is-focused').removeClass('hide-focus');
      }
    };

    if (typeof this.settings.accordionFocusCallback === 'function') {
      this.settings.accordionFocusCallback(header, defaultFocusBehavior);
      return;
    }
    defaultFocusBehavior();
  },

  /**
   * @param {jQuery[]} targets element references representing accordion headers.
   */
  filter(targets) {
    if (!targets) {
      return;
    }

    const self = this;

    // Reset all the things
    this.headers?.removeClass('filtered has-filtered-children hide-focus');
    this.panes.removeClass('all-children-filtered no-transition');
    this.contentAreas.removeClass('filtered');
    this.currentlyFiltered = $();

    // If headers are included in the currentlyFiltered storage, removes the ones that
    // have previously been filtered
    const toFilter = targets.not(this.currentlyFiltered);

    // Store a list of all modified parent headers
    const allTempHeaders = [];
    const allContentAreas = $();

    // Perform filtering
    this.headers.add(this.contentAreas).not(toFilter).addClass('filtered');
    toFilter.each((i, target) => {
      const isContentArea = $(target).is('.accordion-content');
      const allParentPanes = $(target).parents('.accordion-pane');

      // Handle Content Areas
      if (isContentArea) {
        allContentAreas.push($(target));
        const thisParentPane = $(allParentPanes[0]);
        thisParentPane.prev('.accordion-header').each((index, val) => {
          if (allTempHeaders.indexOf(val) < 0) {
            allTempHeaders.push(val);
          }
          return allTempHeaders;
        });
      }

      // Handle Labeling of Parent Headers
      if (allParentPanes.length) {
        allParentPanes.prev('.accordion-header').each((index, val) => {
          if (allTempHeaders.indexOf(val) < 0) {
            allTempHeaders.push(val);
          }
          return allTempHeaders;
        });
      }
    });

    const allParentHeaders = $(allTempHeaders);
    allParentHeaders.addClass('has-filtered-children');

    const expandPromise = this.expand(allParentHeaders, true);

    $.when(expandPromise).done(() => {
      this.currentlyFiltered = toFilter;
      self.build(undefined, true);
    });
  },

  /**
   * @param {jQuery[]} [headers] element references representing accordion headers.
   *  If provided, will cause only specific items to become unfiltered.  If not
   *  provided, removes all filtering from the accordion.
   * @param {boolean} [isReset] if true, sets a flag to force unfilter the filtered accordions. This will be useful
   * if there are no headers filtered when typing a character that is not available on the accordion list.
   */
  unfilter(headers, isReset) {
    if (!this.currentlyFiltered.length && !isReset) {
      return;
    }

    if (!headers || !headers.length) {
      headers = this.currentlyFiltered;
    }

    // Store a list of all modified parent headers
    const allTempHeaders = [];

    // Reset all the things
    this.headers?.removeClass('filtered has-filtered-children hide-focus');
    this.panes.removeClass('all-children-filtered no-transition');
    this.contentAreas.removeClass('filtered');

    headers.each((i, header) => {
      const parentPanes = $(header).parents('.accordion-pane');
      if (parentPanes.length) {
        parentPanes.prev('.accordion-header').each((index, val) => {
          if (allTempHeaders.indexOf(val) < 0) {
            allTempHeaders.push(val);
          }
          return allTempHeaders;
        });
      }
    });

    const allParentHeaders = $(allTempHeaders);
    allParentHeaders.removeClass('has-filtered-children');

    const collapseDfds = [
      this.collapse(headers),
      this.collapse(allParentHeaders)
    ];

    $.when(collapseDfds).done(() => {
      this.currentlyFiltered = this.currentlyFiltered.not(headers);
    });
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
      this.settings = handleDeprecatedSettings(this.settings);
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
    let globalTeardown = false;
    let headerElems = headers;

    if (this.currentlyFiltered) {
      this.unfilter(this.currentlyFiltered);
    }

    if (!headers || !(headers instanceof jQuery)) {
      headerElems = this.headers;
      globalTeardown = true;
    }

    if (headerElems && headerElems.length) {
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

      const anchors = headerElems.not('.accordion-content').find('a');
      anchors.off('touchend.accordion keydown.accordion click.accordion');

      headerElems.children('[class^="btn"]')
        .off('touchend.accordion click.accordion keydown.accordion');
    }

    if (globalTeardown) {
      this.element.off('updated.accordion selected.accordion');

      delete this.anchors;
      delete this.headers;
      delete this.panes;
      delete this.contentAreas;
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

      // Trigger a document click since we stop propgation, to close any open menus/popups.
      if (!element.is('.module-nav-settings-btn')) {
        $('body').children().not('.application-menu, .modal-page-container, .module-nav, .page-container, .resize-app-menu-container').closeChildren();
      }

      return self[`handle${type}Click`](e, element);
    }

    headerElems.on('click.accordion', function (e) {
      return clickInterceptor(e, $(this));
    }).on('focusin.accordion', function (e) {
      const target = $(e.target);

      if (!self.originalSelection) {
        self.originalSelection = target;
      }

      headerElems.not($(this)).removeClass('is-focused');
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

    // this.element.trigger('rendered');

    return this;
  },

  /**
   * Hide the visible tooltip.
   * @private
   * @returns {void}
   */
  hideTooltip() {
    const self = window;

    if (self.tooltip) {
      this.removeTooltipData(self.tooltip); // Remove flag as spantooltip
      self.tooltip.classList.add('is-hidden');
      self.tooltip.classList.remove('content-tooltip');
    }

    // Remove scroll events
    $('body, .scrollable').off('scroll.spantooltip', () => {
      this.hideTooltip();
    });
  },

  /**
   * Remove the tooltip data from given node
   * @private
   * @param {object} elem The DOM element to remove data
   * @returns {void}
   */
  removeTooltipData(elem) {
    elem = elem instanceof jQuery ? elem : $(elem);
    if (elem.data('spantooltip')) {
      $.removeData(elem[0], 'spantooltip');
    }
  },

  /**
   * Setup tooltips on truncated text elements.
   * @private
   * @returns {void}
   */
  setupTooltips() {
    if (!this.settings.enableTooltips) {
      return;
    }

    const self = this;
    const selector = '.accordion-header a span';
    const delay = 400;
    let tooltipTimer;

    // Handle tooltip to show
    const handleShow = (elem) => {
      elem.style.width = 'auto';
      if (elem.offsetWidth > (elem.parentElement.offsetWidth - parseInt($(elem).parent().css('padding-left'), 10))) {
        elem.style.width = '';
        tooltipTimer = setTimeout(() => {
          $(elem).tooltip({
            trigger: 'immediate',
            content: `${elem.innerText}`,
            extraClass: 'tooltip-accordion-style'
          });
        }, delay);
      }
    };

    // Handle tooltip to hide
    const handleHide = (elem) => {
      elem.style.width = 'auto';
      if (elem.offsetWidth > (elem.parentElement.offsetWidth - parseInt($(elem).parent().css('padding-left'), 10))) {
        elem.style.width = '';
        self.hideTooltip();
        clearTimeout(tooltipTimer);
      }
    };

    // Bind events
    this.element
      .off('mouseenter.spantooltip', selector)
      .on('mouseenter.spantooltip', selector, function () {
        handleShow(this);
      })
      .off('mouseleave.spantooltip click.spantooltip', selector)
      .on('mouseleave.spantooltip click.spantooltip', selector, function () {
        handleHide(this);
      });
  }

};

export { Accordion, COMPONENT_NAME };
/* eslint-enable no-multi-assign */
