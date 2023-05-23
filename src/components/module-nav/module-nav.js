import { utils } from '../../utils/utils';
import { accordionSearchUtils } from '../../utils/accordion-search-utils';
import '../../utils/behaviors';

import './module-nav.switcher.jquery';
import '../accordion/accordion.jquery';
import '../button/button.jquery';
import '../dropdown/dropdown.jquery';
import '../searchfield/searchfield.jquery';
import '../tooltip/tooltip.jquery';

import { MODULE_NAV_DISPLAY_MODES, setDisplayMode, isValidDisplayMode } from './module-nav.common';

// Settings and Options
const COMPONENT_NAME = 'modulenav';

const MODULE_NAV_DEFAULTS = {
  displayMode: MODULE_NAV_DISPLAY_MODES[0],
  filterable: false,
  pinSections: false,
  showDetailView: false,
};

const toggleScrollbar = (el, doToggle) => {
  if (el instanceof HTMLElement) {
    if ((doToggle === undefined && el.scrollHeight > el.clientHeight) || doToggle === true) {
      el.classList.add('has-scrollbar');
    } else {
      el.classList.remove('has-scrollbar');
    }
  }
};

/**
 * Module Nav - Fly-out, left-side navigation menu used as top-level navigation in some apps.
 * @class ModuleNav
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 */
function ModuleNav(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MODULE_NAV_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
ModuleNav.prototype = {

  /**
   * @returns {Accordion} Accordion API, if one is available
   */
  get accordionAPI() {
    return this.accordionEl ? $(this.accordionEl).data('accordion') : undefined;
  },

  /**
   * @returns {ModuleNavSwitcher} Module Nav Switcher API, if one is available
   */
  get switcherAPI() {
    return this.switcherEl ? $(this.switcherEl).data('modulenavswitcher') : undefined;
  },

  /**
   * @returns {SearchField} Searchfield API, if one is available
   */
  get searchAPI() {
    return this.searchEl ? $(this.searchEl).data('searchfield') : undefined;
  },

  /**
   * @returns {ModuleNavSettings} Module Nav Switcher API, if one is available
   */
  get settingsAPI() {
    return this.settingsEl ? $(this.settingsEl).data('modulenavsettings') : undefined;
  },

  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    // Refs
    this.renderChildComponents();

    // Configure
    this.setDisplayMode(this.settings.displayMode);
    this.setPinSections(this.settings.pinSections);
    this.setScrollable();
    this.setShowDetailView(this.settings.showDetailView);
    this.configureResize();
    return this;
  },

  /**
   * @private
   */
  renderChildComponents() {
    // Containers
    this.containerEl = $(this.element).parent('.module-nav-container')[0];
    this.detailViewEl = this.element[0].querySelector('.module-nav-detail');

    // Sections
    this.switcherEl = this.element[0].querySelector('.module-nav-switcher');
    if (!this.switcherAPI) $(this.switcherEl).modulenavswitcher({ displayMode: this.settings.displayMode });
    this.itemMenuEl = this.element[0].querySelector('.module-nav-main');
    this.settingsEl = this.element[0].querySelector('.module-nav-settings');
    if (!this.settingsAPI) $(this.settingsEl).modulenavsettings({ displayMode: this.settings.displayMode });
    this.footerEl = this.element[0].querySelector('.module-nav-footer');

    // Components
    this.accordionEl = this.element[0].querySelector('.accordion');
    if (!this.accordionAPI) {
      $(this.accordionEl).accordion();
      this.configureAccordion();
    }
    this.searchEl = this.element[0].querySelector('.searchfield');
    if (this.searchEl) {
      this.settings.filterable = true;
      this.configureSearch();
    }
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    if (this.accordionEl) {
      $(this.accordionEl).on(`beforeexpand.${COMPONENT_NAME}`, (e) => {
        e.preventDefault();
        if (this.settings.displayMode !== 'expanded') return false;
        return true;
      });

      $(this.accordionEl).on(`rendered.${COMPONENT_NAME}`, () => {
        this.configureAccordion();
      });
    }

    return this;
  },

  /**
 * handles the Searchfield Input event
 * @param {jQuery.Event} e jQuery `input` event
 */
  handleSearchfieldInputEvent() {
    accordionSearchUtils.handleSearchfieldInputEvent.apply(this, [COMPONENT_NAME]);
  },

  /**
   * @private
   */
  collapseAccordionHeaders() {
    if (!this.accordonEl || !this.accordionAPI) return;

    const accordionHeaderEls = [...this.containerEl.querySelectorAll('.accordion-header')];
    accordionHeaderEls.forEach((header) => {
      if ($(header).next('.accordion-pane').length) {
        this.accordionAPI.collapse($(header), true);
      }
    });
  },

  /**
   * @private
   */
  configureAccordion() {
    if (!this.accordionEl || !this.accordionAPI) return;

    // Override this accordion behavior to include a check for Module Nav switchers
    const navFocusCallback = (header, defaultFocusBehavior) => {
      // Handle focus of accordion headers containing Module Nav Switcher Components
      if (header.is('.module-nav-switcher')) {
        if (this.settings.displayMode === 'expanded') {
          header.find('.dropdown').focus();
        } else {
          header.find('.module-btn button').focus();
        }
      } else {
        defaultFocusBehavior();
      }
    };

    this.accordionAPI.settings.accordionFocusCallback = navFocusCallback;

    // Build tooltips on top-level accordion headers in collapsed mode
    const headers = this.accordionEl.querySelectorAll('.accordion-section > .accordion-header');
    if (headers.length) {
      [...headers].forEach((header) => {
        if (this.settings.displayMode === 'collapsed') {
          $(header).tooltip({
            offset: { x: 12 },
            placement: 'right',
            title: header.textContent.trim()
          });
          $(header).hideFocus();
        } else {
          $(header).data('tooltip')?.destroy();
          $(header).data('hidefocus')?.destroy();
        }
      });
    }
  },

  /**
   * Configures Module Nav's resize detection behavior
   * @private
   */
  configureResize() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.ro) {
      this.ro = new ResizeObserver(() => {
        this.setPinSections(this.settings.pinSections);
        this.setScrollable();
      });
    }
    if (this.accordionEl) {
      this.ro.observe(this.accordionEl);
    }
  },

  /**
   * Configures the Module Nav's Search component
   * @private
   */
  configureSearch() {
    accordionSearchUtils.attachFilter.apply(this, [COMPONENT_NAME]);
    accordionSearchUtils.attachFilterEvents.apply(this, [COMPONENT_NAME]);

    this.searchEl.classList.add('module-nav-search');
    $(this.searchEl).parents('.accordion-section')?.[0].classList.add('module-nav-search-container');
  },

  /**
   * Configures the Module Nav's display mode.
   * @param {string} val desired display mode
   * @returns {void}
   */
  setDisplayMode(val) {
    if (!isValidDisplayMode(val)) return;

    if (this.settings.displayMode !== val) this.settings.displayMode = val;
    setDisplayMode(val, this.containerEl);

    // Reconfigure child elements to use the same display mode
    this.switcherAPI?.setDisplayMode(val);
    this.settingsAPI?.setDisplayMode(val);

    // Don't show collapsed accordion headers if not in "expanded" mode
    if (this.settings.displayMode !== 'expanded') {
      this.collapseAccordionHeaders();
    }
  },

  /**
   * Configures the Module Nav's header and footer area placement fixing to the bottom
   * @param {boolean} val true if the footer should be pinned
   * @returns {void}
   */
  setPinSections(val) {
    this.containerEl.classList[val ? 'add' : 'remove']('pinned-optional');
  },

  /**
   * Detects if the main accordion element is scrolled (not "optionally-pinned" mode)
   * Toggles a class on/off based on ability to scroll.
   * @returns {void}
   */
  setScrollable() {
    if (!this.settings.pinSections) {
      this.setAccordionSectionsScrollable(false);
      this.setMainAccordionScrollable();
    } else {
      this.setMainAccordionScrollable(false);
      this.setAccordionSectionsScrollable();
    }
  },

  /**
   * @private
   * @param {boolean|undefined} [doToggle] if defined, dictates which direction to force toggle (false for off, true for on)
   */
  setMainAccordionScrollable(doToggle) {
    const el = this.accordionEl;
    toggleScrollbar(el, doToggle);
  },

  /**
   * @private
   * @param {boolean|undefined} [doToggle] if defined, dictates which direction to force toggle (false for off, true for on)
   */
  setAccordionSectionsScrollable(doToggle) {
    const sections = this.accordionEl?.querySelectorAll('.accordion-section');
    if (sections && sections.length) {
      [...sections].forEach((section) => {
        toggleScrollbar(section, doToggle);

        const isSearch = section.classList.contains('module-nav-search-container');
        const isHeader = section.classList.contains('module-nav-header');
        if (isHeader || isSearch) {
          if (doToggle) section.classList.add('next-scrollbar');
          else section.classList.remove('next-scrollbar');
        }
      });
    }
  },

  /**
   * Configures display of the Module Nav's detail view pane.
   * @param {boolean} val true if the detail view should be shown
   * @returns {void}
   */
  setShowDetailView(val) {
    this.containerEl.classList[val ? 'add' : 'remove']('show-detail');
    this.detailViewEl.classList[val ? 'add' : 'remove']('visible');
  },

  /**
   * Handle updated settings and values.
   * @param {object} [settings] if provided, updates module nav settings
   * @returns {object} chainable API
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
      if (this.switcherAPI) this.switcherAPI.settings.displayMode = this.settings.displayMode;
      if (this.settingsAPI) this.settingsAPI.settings.displayMode = this.settings.displayMode;
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    this.teardownEvents();
    this.teardownResize();
    accordionSearchUtils.teardownFilter.apply(this, [COMPONENT_NAME]);

    // Containers
    this.containerEl = null;
    this.detailViewEl = null;

    // Sections
    this.switcherAPI?.destroy();
    this.switcherEl = null;
    this.itemMenuEl = null;

    this.settingsAPI?.destroy();
    this.settingsEl = null;
    this.footerEl = null;

    // Components
    this.accordionAPI?.destroy();
    this.accordionEl = null;
    this.searchAPI?.destroy();
    this.searchEl = null;

    return this;
  },

  /**
   * @private
   */
  teardownEvents() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    $(this.accordionEl).off(`beforeexpand.${COMPONENT_NAME}`);
    $(this.accordionEl).off(`rendered.${COMPONENT_NAME}`);
  },

  /**
   * @private
   */
  teardownResize() {
    if (this.ro) {
      this.ro.disconnect();
      this.ro = null;
    }
  },

  /**
   * Destroy - Remove added markup and events.
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { ModuleNav, COMPONENT_NAME };
