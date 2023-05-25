import { utils } from '../../utils/utils';

import '../popupmenu/popupmenu.jquery';

import {
  isValidDisplayMode,
  setDisplayMode
} from './module-nav.common';

// Settings and Options
const COMPONENT_NAME = 'modulenavsettings';

const MODULE_NAV_SETTINGS_DEFAULTS = {
  displayMode: false
};

const popupmenuTemplate = () => '<div class="popupmenu-wrapper><ul class="popupmenu"></ul></div>';

/**
 * Module Nav Settings - Creates a settings menu trigger button with specific styles for the Module Nav
 * @class ModuleNavSettings
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 */
function ModuleNavSettings(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MODULE_NAV_SETTINGS_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
ModuleNavSettings.prototype = {

  /** Reference to the parent accordion element, if present */
  get accordionEl() {
    return this.element.parents('.accordion').first()?.[0];
  },

  /** Reference to the settings button's Popupmenu API, if present */
  get menuAPI() {
    return $(this.element).data('popupmenu') || undefined;
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
    this.configurePopupMenu();

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
   * Draws important UI elements if they aren't found
   */
  renderChildComponents() {
    this.containerEl = this.element.parents('.module-nav-container')[0];

    this.detectPopupMenu();

    // If menu isn't found after detection, generate a new one
    if (!this.menuEl?.length) {
      this.element[0].insertAdjacentHTML('afterend', popupmenuTemplate());
      this.menuEl = this.element.next('.popupenu-wrapper').find('.popupmenu');
    }
  },

  /**
   * @private
   */
  detectPopupMenu() {
    this.menuEl = this.element.next('.popupmenu');
    if (this.element.next('.popupmenu-wrapper').length) {
      this.menuEl = this.element.next('.popupenu-wrapper').find('.popupmenu');
    }
    if (!this.menuEl.length) {
      const inPageMenu = $('.popupmenu-wrapper.module-nav-settings-menu').find('.popupmenu');
      if (inPageMenu.length) this.menuEl = inPageMenu;
    }
  },

  /**
   * Draws the Settings menu
   * @private
   */
  configurePopupMenu() {
    if (!this.menuEl.length) {
      this.detectPopupMenu();
    }
    this.element.popupmenu(this.getPopupmenuConfig());
  },

  /**
   * @private
   * @returns {object} containing Popupmenu config
   */
  getPopupmenuConfig() {
    const placementOpts = {
      placement: 'bottom',
      containerOffsetX: 8,
      containerOffsetY: 8
    };

    if (this.settings.displayMode === 'collapsed') {
      placementOpts.placement = 'right';
      placementOpts.width = 290;
    }

    const offset = this.settings.displayMode === 'collapsed' ? {
      x: 10, y: 0
    } : {
      x: 0, y: 10
    };

    return {
      cssClass: 'module-nav-settings-menu',
      offset,
      placementOpts
    };
  },

  /**
   * Configures the Module Nav Switcher's display mode.
   * @param {string} val desired display mode
   * @returns {void}
   */
  setDisplayMode(val) {
    if (!isValidDisplayMode(val)) return;
    if (this.settings.displayMode !== val) this.settings.displayMode = val;
    setDisplayMode(val, this.element[0]);
    this.configurePopupMenu();
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
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);

    // Cleanup menu
    this.popupmenuAPI?.destroy();
    this.menuEl = null;

    return this;
  },

  /**
   * Destroy - Remove added markup and events.
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { ModuleNavSettings, COMPONENT_NAME };
