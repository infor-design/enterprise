import { utils } from '../../utils/utils'; // NOTE: update this path when moving to a component folder

// Settings and Options
const COMPONENT_NAME = 'modulenav';

const MODULE_NAV_DISPLAY_MODES = [false, 'collapsed', 'expanded'];

const MODULE_NAV_DEFAULTS = {
  displayMode: MODULE_NAV_DISPLAY_MODES[0],
  showDetailView: false
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
    this.containerEl = $(this.element).parent('.module-nav-container');
    this.detailViewEl = $(this.element).find('.module-nav-detail');

    // Configure
    if (this.settings.displayMode) this.setDisplayMode(this.settings.displayMode);
    this.setShowDetailView(this.settings.showDetailView);
    return this;
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

    return this;
  },

  /**
   * Configures the Module Nav's display mode.
   * @param {string} val desired display mode
   * @returns {void}
   */
  setDisplayMode(val) {
    this.containerEl[0].classList.remove('mode-collapsed', 'mode-expanded');
    if (typeof val === 'string' && MODULE_NAV_DISPLAY_MODES.includes(val)) {
      this.containerEl[0].classList.add(`mode-${val}`);
    }
  },

  /**
   * Configures display of the Module Nav's detail view pane.
   * @param {boolean} val true if the detail view should be shown
   * @returns {void}
   */
  setShowDetailView(val) {
    this.containerEl[0].classList[val ? 'add' : 'remove']('show-detail');
    this.detailViewEl[0].classList[val ? 'add' : 'remove']('visible');
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
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
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
