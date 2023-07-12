import { utils } from '../../utils/utils';
import { accordionSearchUtils } from '../../utils/accordion-search-utils';
import '../../utils/behaviors';

import './module-nav.switcher.jquery';
import '../accordion/accordion.jquery';
import '../button/button.jquery';
import '../dropdown/dropdown.jquery';
import '../searchfield/searchfield.jquery';
import '../tooltip/tooltip.jquery';

import {
  MODULE_NAV_DISPLAY_MODES,
  configureNavItemTooltip,
  setDisplayMode,
  isValidDisplayMode,
  separatorTemplate
} from './module-nav.common';

// Settings and Options
const COMPONENT_NAME = 'modulenav';

const MODULE_NAV_DEFAULTS = {
  accordionSettings: {
    expanderDisplay: 'classic'
  },
  displayMode: MODULE_NAV_DISPLAY_MODES[0],
  filterable: false,
  initChildren: true,
  pinSections: false,
  showDetailView: false,
};

const toggleScrollbar = (el, doToggle) => {
  let didToggle = false;
  if (el instanceof HTMLElement) {
    if ((doToggle === undefined && el.scrollHeight > el.clientHeight) || doToggle === true) {
      el.classList.add('has-scrollbar');
      didToggle = true;
    } else {
      el.classList.remove('has-scrollbar');
    }
  }
  return didToggle;
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
   * @returns {HTMLElement | undefined} container element for Module Nav component and page content
   */
  get containerEl() {
    return this.element[0]?.parentElement;
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
    this.detailViewEl = this.element[0].querySelector('.module-nav-detail');

    // Sections
    this.switcherEl = this.element[0].querySelector('.module-nav-switcher');
    this.itemMenuEl = this.element[0].querySelector('.module-nav-main');
    this.settingsEl = this.element[0].querySelector('.module-nav-settings');
    this.footerEl = this.element[0].querySelector('.module-nav-footer');

    // Components
    this.accordionEl = this.element[0].querySelector('.accordion');
    this.searchEl = this.element[0].querySelector('.searchfield');

    this.renderSeparators();

    // Auto-init child components, if applicable
    if (this.settings.initChildren) {
      if (!this.switcherAPI) $(this.switcherEl).modulenavswitcher({ displayMode: this.settings.displayMode });
      if (!this.settingsAPI) $(this.settingsEl).modulenavsettings({ displayMode: this.settings.displayMode });
      if (!this.accordionAPI) {
        $(this.accordionEl).accordion(this.settings.accordionSettings);
      }
    }

    if (this.accordionEl) this.configureAccordion();
    if (this.searchEl) this.configureSearch();
  },

  /**
   * @private
   */
  renderSeparators() {
    if (this.switcherEl || this.searchEl) this.itemMenuEl?.insertAdjacentHTML('beforebegin', separatorTemplate());
    if (this.footerEl) this.footerEl?.insertAdjacentHTML('beforebegin', separatorTemplate());
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
      $(this.accordionEl).on(`rendered.${COMPONENT_NAME}`, () => {
        this.configureAccordion();
      });
      $(this.accordionEl).on(`beforeexpand.${COMPONENT_NAME}`, (e) => {
        e.preventDefault();
        if (this.settings.displayMode !== 'expanded') return false;
        return true;
      });
      $(this.accordionEl).on(`afterexpand.${COMPONENT_NAME}`, () => {
        this.setScrollable();
      });
      $(this.accordionEl).on(`aftercollapse.${COMPONENT_NAME}`, () => {
        this.setScrollable();
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

    // Pass along updated settings, including local callback
    const newSettings = utils.mergeSettings(this.accordionEl, {
      accordionFocusCallback: navFocusCallback
    }, this.settings.accordionSettings);
    this.accordionAPI.updated(newSettings);

    // Build tooltips on top-level accordion headers in collapsed mode
    const headers = this.accordionEl.querySelectorAll('.accordion-section > .accordion-header');
    if (headers.length) {
      [...headers].forEach((header) => {
        configureNavItemTooltip(header, this.settings.displayMode);
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
    // If the filterable setting is disabled, no events should be applied automatically
    // (This behavior is intended for allowing custom filtering applications)
    if (this.settings.filterable) {
      accordionSearchUtils.attachFilter.apply(this, [COMPONENT_NAME]);
      accordionSearchUtils.attachFilterEvents.apply(this, [COMPONENT_NAME]);
    } else {
      // Invoke searchfield with default settings here since we found one
      // (main init process ignores searchfields inside nav menus)
      $(this.searchEl).searchfield();
    }

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
    let sectionHasScrollbar = false;

    const sections = this.accordionEl?.querySelectorAll('.accordion-section');
    if (sections && sections.length) {
      [...sections].forEach((section) => {
        const didToggle = toggleScrollbar(section, doToggle);
        if (didToggle) sectionHasScrollbar = true;

        const isSearch = section.classList.contains('module-nav-search-container');
        const isHeader = section.classList.contains('module-nav-header');
        if (isHeader || isSearch) {
          if (doToggle) section.classList.add('next-scrollbar');
          else section.classList.remove('next-scrollbar');
        }
      });
    }

    this.containerEl.classList[sectionHasScrollbar ? 'add' : 'remove']('has-section-scrollbars');
  },

  /**
   * Configures display of the Module Nav's detail view pane.
   * @param {boolean} val true if the detail view should be shown
   * @returns {void}
   */
  setShowDetailView(val) {
    this.containerEl.classList[val ? 'add' : 'remove']('show-detail');
    this.detailViewEl?.classList[val ? 'add' : 'remove']('visible');
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

    // Separators
    const separators = $(this.element).find('.module-nav-separator');
    separators.remove();

    // Containers
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
    $(this.accordionEl).off(`rendered.${COMPONENT_NAME}`);
    $(this.accordionEl).off(`beforeexpand.${COMPONENT_NAME}`);
    $(this.accordionEl).off(`afterexpand.${COMPONENT_NAME}`);
    $(this.accordionEl).off(`aftercollapse.${COMPONENT_NAME}`);
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
