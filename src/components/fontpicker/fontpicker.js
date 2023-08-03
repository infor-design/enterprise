import { utils } from '../../utils/utils'; // NOTE: update this path when moving to a component folder

import FontPickerStyle from './fontpicker.style';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';

// Component Name
const COMPONENT_NAME = 'fontpicker';

// Default Settings
// NOTE: new settings are created at runtime to avoid retention of state on FontPickerStyle objects
function fontpickerSettingsFactory() {
  return {
    popupmenuSettings: {
      offset: {
        y: 10
      }
    },
    styles: [
      new FontPickerStyle('default', Locale.translate('FontPickerNormal')),
      new FontPickerStyle('header1', Locale.translate('FontPickerHeader').replace('{0}', '1'), 'h3'),
      new FontPickerStyle('header2', Locale.translate('FontPickerHeader').replace('{0}', '2'), 'h4')
    ]
  };
}

/**
 * Fontpicker Component
 * @class FontPicker
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 */
function FontPicker(element, settings) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Property "element" is not an HTMLElement type');
  }

  this.settings = utils.mergeSettings(element, settings, fontpickerSettingsFactory());
  if (settings && Array.isArray(settings.styles)) {
    this.settings.styles = settings.styles;
  }

  this.element = element;

  this.init();
}

// Plugin Methods
FontPicker.prototype = {

  /**
   * @returns {Popupmenu|undefined} the Popupmenu API for the picker, if applicable.
   */
  get menuAPI() {
    const api = $(this.element).data('popupmenu');
    if (!api) {
      return undefined;
    }
    return api;
  },

  /**
   * @returns {FontPickerStyle} currently selected font
   */
  get selected() {
    let selected;
    this.settings.styles.forEach((style) => {
      if (style.selected) {
        selected = style;
      }
    });
    if (!selected) {
      this.settings.styles[0].selected = true;
      return this.settings.styles[0];
    }
    return selected;
  },

  /**
   * Gets a reference to a FontPickerStyle object defined within this component, targeted by its ID.
   * @param {string} id an id representing a font style within this fontpicker's selections.
   * @returns {FontPickerStyle} a font style within this component's selections by its unique ID.
   */
  getStyleById(id) {
    let targetStyle;
    this.settings.styles.forEach((style) => {
      if (style.id === id) {
        targetStyle = style;
      }
    });

    if (!targetStyle) {
      throw new Error(`No FontPickerStyle available with id "${id}"`);
    }
    return targetStyle;
  },

  /**
   * Gets a reference to a FontPickerStyle object defined within this component, targeted by its Tag Name.
   * @param {string} tagName an id representing a font style within this fontpicker's selections.
   * @returns {FontPickerStyle} a font style within this component's selections by its unique ID.
   */
  getStyleByTagName(tagName) {
    let targetStyle;
    this.settings.styles.forEach((style) => {
      if (style.tagName === tagName) {
        targetStyle = style;
      }
    });

    if (!targetStyle) {
      throw new Error(`No FontPickerStyle available with tagName "${tagName}"`);
    }
    return targetStyle;
  },

  get disabled() {
    return this.trueDisabled;
  },

  /**
   * @param {boolean} bool whether or not to disable this component
   * @returns {void}
   */
  set disabled(bool) {
    this.trueDisabled = bool;
    if (bool === true) {
      this.element.disabled = true;
      return;
    }
    this.element.disabled = false;
  },

  /**
   * @returns {array} of tagNames currently supported by this fontpicker
   */
  get supportedTagNames() {
    const tagNames = [];
    this.settings.styles.forEach((style) => {
      tagNames.push(style.tagName);
    });
    return tagNames;
  },

  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Ensure we have an array for this, otherwise reset to default.
    if (!Array.isArray(this.settings.styles) || !this.settings.styles.length) {
      this.settings.styles = fontpickerSettingsFactory().styles;
    }

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
    const $element = $(this.element);

    // Invoke button
    let ddIcon = this.element.querySelector('svg.icon.icon-dropdown');
    if (!ddIcon) {
      ddIcon = $.createIcon({ icon: 'dropdown', classes: ['icon-dropdown'] });
      this.element.insertAdjacentHTML('beforeend', ddIcon);
    }
    this.ddIcon = this.element.querySelector('svg.icon.icon-dropdown');
    $element.button();

    // Invoke menu
    let $menu = $element.next('.popupmenu');
    if (!$menu || !$menu.length) {
      $menu = $('<ul class="popupmenu fontpicker-menu"></ul>').insertAfter(this.element);
    }
    $menu.html(this.buildMenuHTML());

    const menuSettings = utils.extend({}, this.settings.popupmenuSettings, {
      menu: $menu,
      stretchToWidestMenuItem: true
    });
    $element.popupmenu(menuSettings);

    // Set initial state
    this.render();

    // Add audible label
    this.audible = $(`<span class="audible">${Locale.translate('FontPickerStyle')}</span>`);
    this.element.prepend(this.audible[0]);

    return this;
  },

  /**
   * Renders the button's display.
   * @private
   * @returns {void}
   */
  render() {
    const selected = this.selected;
    const spanElem = this.element.querySelector('span:not(.audible)');

    $(spanElem).html(selected.displayName);
  },

  /**
   * @private
   * Builds the Fontpicker's Popupmenu HTML
   * @returns {string} representing the Popupmenu's HTML.
   */
  buildMenuHTML() {
    let menuHTML = '';

    this.settings.styles.forEach((style) => {
      const itemRender = style.render(style.displayName);

      menuHTML += `<li class="fontpicker-style">
        <a href="#" data-val="${style.id}">${itemRender}</a>
      </li>`;
    });

    return `${menuHTML}`;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    $(this.element)
      .on(`selected.${COMPONENT_NAME}`, (e, selectedItem) => {
        const val = selectedItem.attr('data-val');
        this.select(val);
      })
      .on(`updated.${COMPONENT_NAME}`, (e, settings) => {
        self.updated(settings);
      });

    return this;
  },

  /**
   * Selects a font from the list
   * @param {string|FontPickerStyle} id either an ID string, or a direct reference to a FontPickerStyle
   * @param {boolean} preventEvent whether or not to fire an event to annouce the selection change.  In some cases, this method is called directly by a parent component, which may have been responsible for the change by other means.
   * @returns {void}
   */
  select(id, preventEvent) {
    if (!id || (typeof id !== 'string' && !(id instanceof FontPickerStyle))) {
      throw new Error('"id" property must be defined in order to select.');
    }

    // If this is not a FontPickerStyle, assume a string type and attempt to get via ID.
    let style;
    if (!(id instanceof FontPickerStyle)) {
      style = this.getStyleById(id);
    } else {
      style = id;
    }

    // Deselect all other styles except for this one.
    this.settings.styles.forEach((thisStyle) => {
      thisStyle.selected = false;
    });
    style.selected = true;

    // Update the button's visuals
    this.render(style);

    // Notify externally
    if (!preventEvent) {
      $(this.element).triggerHandler('font-selected', [style]);
    }
  },

  /**
   * Handle updated settings and values.
   * @param {object} [settings=undefined] optional incoming fontpicker settings
   * @returns {object} [description]
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      let incomingStyles;
      if (Array.isArray(settings.styles)) {
        incomingStyles = settings.styles;
      }

      this.settings = utils.mergeSettings(this.element, settings, this.settings);

      if (incomingStyles) {
        this.settings.styles = incomingStyles;
      }
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
    // Remove icon
    const ddIcon = this.element.querySelector('svg.icon.icon-dropdown');
    ddIcon.parentNode.removeChild(ddIcon);

    // Destroy sub-components
    const menuAPI = this.menuAPI;
    if (menuAPI && typeof menuAPI.destroy === 'function') {
      menuAPI.destroy();
    }
    const buttonAPI = $(this.element).data('button');
    if (buttonAPI && typeof buttonAPI.destroy === 'function') {
      buttonAPI.destroy();
    }

    // Remove events
    $(this.element).off([
      `selected.${COMPONENT_NAME}`,
      `updated.${COMPONENT_NAME}`
    ].join(' '));

    return this;
  },

  /**
   * Completely removes this component instance from its base element.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  }
};

export { FontPicker, FontPickerStyle, COMPONENT_NAME };
