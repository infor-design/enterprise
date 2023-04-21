import { utils } from '../../utils/utils';

import { MODULE_NAV_DISPLAY_MODES, setDisplayMode } from './module-nav.common';

// Settings and Options
const COMPONENT_NAME = 'modulenav';

const MODULE_NAV_DEFAULTS = {
  displayMode: MODULE_NAV_DISPLAY_MODES[0],
  pinSections: false,
  showDetailView: false,
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
    if (this.settings.displayMode) this.setDisplayMode(this.settings.displayMode);
    this.setPinSections(this.settings.pinSections);
    this.setShowDetailView(this.settings.showDetailView);
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
    this.itemMenuEl = this.element[0].querySelector('.module-nav-main');
    this.footerEl = this.element[0].querySelector('.module-nav-footer');

    // Components
    this.accordionEl = this.element[0].querySelector('.accordion');
    this.accordionAPI = $(this.accordion).data('accordion');
    this.configureAccordion();
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
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
   * @private
   */
  collapseAccordionHeaders() {
    const accordionEl = this.containerEl.querySelector('.accordion');
    const accordionHeaderEls = [...this.containerEl.querySelectorAll('.accordion-header')];
    const api = $(accordionEl).data('accordion');
    accordionHeaderEls.forEach((header) => {
      if ($(header).next('.accordion-pane').length) {
        api.collapse($(header), true);
      }
    });
  },

  /**
   * @private
   */
  configureAccordion() {
    if (!this.accordionEl) return;

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

    const api = $(this.accordionEl).data('accordion');
    if (!api) return;

    api.settings.accordionFocusCallback = navFocusCallback;
  },

  /**
   * Configures the Module Nav's display mode.
   * @param {string} val desired display mode
   * @returns {void}
   */
  setDisplayMode(val) {
    setDisplayMode(val, this.containerEl);
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
    this.containerEl.classList[val ? 'add' : 'remove']('pin-sections');
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
    }
    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.teardownEvents();

    // Containers
    this.containerEl = null;
    this.detailViewEl = null;

    // Sections
    this.switcherEl = null;
    this.itemMenuEl = null;
    this.footerEl = null;

    // Components
    this.accordionEl = null;
    this.accordionAPI = null;

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
   * Teardown - Remove added markup and events.
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { ModuleNav, COMPONENT_NAME };
