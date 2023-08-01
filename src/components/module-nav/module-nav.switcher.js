import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';

import '../button/button.jquery';
import '../dropdown/dropdown.jquery';

import {
  buttonTemplate,
  dropdownTemplate,
  iconTemplate,
  imageTemplate,
  roleTemplate,
  isValidDisplayMode,
  MODULE_NAV_DISPLAY_MODES,
  defaultIconGenerator,
  setDisplayMode,
  configureNavItemTooltip
} from './module-nav.common';

// Settings and Options
const COMPONENT_NAME = 'modulenavswitcher';

const MODULE_NAV_SWITCHER_DEFAULTS = {
  displayMode: MODULE_NAV_DISPLAY_MODES[0],
  generate: true,
  icon: defaultIconGenerator,
  changeIconOnSelect: true,
  moduleButtonText: 'Standard Module',
  roleDropdownLabel: 'Roles',
  roles: []
};

/**
 * Module Nav Switcher - Controls top-level navigation for an application
 * @class ModuleNavSwitcher
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 */
function ModuleNavSwitcher(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MODULE_NAV_SWITCHER_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
ModuleNavSwitcher.prototype = {

  /** Reference to the parent accordion element, if present */
  get accordionEl() {
    return this.element.parents('.accordion').first()?.[0];
  },

  /** Reference to the parent accordion API, if present */
  get accordionAPI() {
    return this.accordionEl ? $(this.accordionEl).data('accordion') : undefined;
  },

  /** Reference to the Module Nav container element, if present */
  get containerEl() {
    return this.element.parents('.module-nav-container')[0];
  },

  /** Reference to the Module Button container element, if present */
  get moduleButtonContainerEl() {
    return this.element[0].querySelector('.module-nav-section.module-btn');
  },

  /** Reference to the Module Button element, if present */
  get moduleButtonEl() {
    return this.moduleButtonContainerEl.querySelector('button');
  },

  /** Reference to the Module Button Icon element, if present */
  get moduleButtonIconEl() {
    return this.moduleButtonEl?.querySelector('svg, img, .icon, .custom-icon');
  },

  /** Reference to the Module Button API, if present */
  get moduleButtonAPI() {
    return this.moduleButtonEl ? $(this.moduleButtonEl).data('button') : undefined;
  },

  /** Reference to the Role Dropdown container element, if present */
  get roleDropdownContainerEl() {
    return this.element[0].querySelector('.module-nav-section.role-dropdown');
  },

  /** Reference to the Role Dropdown element, if present */
  get roleDropdownEl() {
    return this.element[0].querySelector('.dropdown');
  },

  /** Reference to the Module Switcher Dropdown API, if present */
  get roleDropdownAPI() {
    return this.roleDropdownEl ? $(this.roleDropdownEl).data('dropdown') : undefined;
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

    if (!this.moduleButtonIconEl || this.settings.icon !== defaultIconGenerator) {
      this.setModuleButtonIcon();
    }

    if (!$(this.roleDropdownEl).find('option').length) {
      this.renderDropdownOptions(true);
    }

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

    this.element.on(`keydown.${COMPONENT_NAME}`, (e) => {
      const key = e.key;

      if (key === 'ArrowUp') {
        this.accordionAPI?.prevHeader(this.element);
        return;
      }

      if (key === 'ArrowDown') {
        this.accordionAPI?.nextHeader(this.element);
      }
    });

    return this;
  },

  /**
   * Draws important UI elements if they aren't found
   */
  renderChildComponents() {
    this.renderModuleButton();
    this.renderRoleDropdown();
  },

  renderModuleButton() {
    if (this.settings.generate && (!this.moduleButtonContainerEl || !this.moduleButtonEl)) {
      this.element[0].insertAdjacentHTML('afterbegin', buttonTemplate(this.settings.moduleButtonText));
    }
    if (this.moduleButtonEl) {
      $(this.moduleButtonEl).button({
        ripple: false
      });
      configureNavItemTooltip(this.element, this.settings.displayMode, this.moduleButtonEl);
    }
  },

  renderRoleDropdown() {
    if (this.settings.generate && (!this.roleDropdownContainerEl || !this.roleDropdownEl)) {
      this.element[0].insertAdjacentHTML('beforeend', dropdownTemplate(this.settings.roleDropdownLabel));
    }
    if (!$(this.roleDropdownEl).find('option').length) {
      this.renderDropdownOptions();
    }
    $(this.roleDropdownEl).dropdown({
      cssClass: 'role-dropdown',
      dropdownIcon: 'expand-all',
      extraListWrapper: true,
      width: 'parent',
      widthTarget: '.module-nav-switcher'
    }).off('change.module-nav').on('change.module-nav', (e) => {
      if (!this.settings.changeIconOnSelect) return;
      const selectedValue = e.currentTarget.value;
      const icon = $(e.currentTarget)?.data('dropdown')?.list.find(`[data-val=${selectedValue}]`).find('.listoption-icon');
      const svgInner = icon[0]?.innerHTML;
      const svgHtml = `<svg class="icon-custom" focusable="false" aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">${svgInner}</svg>`;
      this.setModuleButtonIcon(svgHtml);
    });
  },

  /**
   * @param {boolean} doUpdate true if the Dropdown API should update
   * @private
   */
  renderDropdownOptions(doUpdate = false) {
    if (Array.isArray(this.settings.roles) && this.settings.roles.length) this.setRoles(this.settings.roles, doUpdate);
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
  },

  /**
   * Configures the Module Button's icon
   * @param {string} iconStr can optionally pass in the icon
   * @returns {void}
   */
  setModuleButtonIcon(iconStr) {
    let iconHTML = '';

    switch (typeof this.settings.icon) {
      case 'function':
        iconHTML = this.settings.icon(this);
        break;
      case 'string':
        if (stringUtils.isValidURL(this.settings.icon)) {
          // treat string as a URL
          iconHTML = imageTemplate(this.settings.icon, this.settings.moduleButtonText);
        } else if (this.settings.icon.charAt(0) !== '<' && document.querySelector(`symbol#icon-${this.settings.icon}`)) {
          // treat string as an IDS Icon def
          iconHTML = iconTemplate(this.settings.icon);
        } else {
          // treat as HTML markup
          iconHTML = this.settings.icon;
        }
        break;
      default:
        break;
    }

    if (iconStr) {
      iconHTML = iconStr;
    }

    // if Icon HTML exists, replace the current one
    if (iconHTML.length && !this.settings.icon === false) {
      const iconEl = this.moduleButtonIconEl;
      iconEl?.remove();
      this.moduleButtonEl.insertAdjacentHTML('afterbegin', iconHTML);
    }
  },

  /**
   * @param {object[]} val contains Module Switcher Role Dropdown entries
   * @param {boolean} doUpdate if true, runs the Dropdown's `updated()` method
   */
  setRoles(val, doUpdate = false) {
    if (!Array.isArray(val) || !this.roleDropdownEl) return;

    let newRoles = '';
    if (this.roleDropdownEl) this.roleDropdownEl.innerHTML = '';

    if (val.length) {
      val.forEach((entry) => {
        newRoles += roleTemplate(entry.value, entry.text, entry.icon, entry.iconColor);
      });
    }

    if (newRoles.length) {
      this.roleDropdownEl?.insertAdjacentHTML('afterbegin', newRoles);
      if (doUpdate) $(this.roleDropdownEl).updated();
    }
  },

  /**
   * Toggles the Module Button's focus state
   * @param {boolean} [doFocus] force the focus state
   */
  toggleModuleButtonFocus(doFocus) {
    if (!this.moduleButtonEl) return;
    const currentlyHasFocus = document.activeElement?.isEqualNode(this.moduleButtonEl) || this.moduleButtonEl?.classList.contains('is-focused');
    const trueDoFocus = typeof doFocus === 'boolean' ? doFocus : !currentlyHasFocus;
    this.moduleButtonEl.classList[trueDoFocus ? 'add' : 'remove']('is-focused');
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
    this.element.off(`updated.${COMPONENT_NAME} keydown.${COMPONENT_NAME}`);

    if (this.moduleButtonEl) {
      $(this.moduleButtonEl).data('button')?.destroy();
    }

    if (this.roleDropdownEl) {
      $(this.roleDropdownEl).data('dropdown')?.destroy();
    }

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

export { ModuleNavSwitcher, COMPONENT_NAME };
