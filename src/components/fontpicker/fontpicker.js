import { utils } from '../../utils/utils'; // NOTE: update this path when moving to a component folder

import FontPickerStyle from './fontpicker.style';

// jQuery Components
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';

// Component Name
const COMPONENT_NAME = 'fontpicker';

// Default Settings
const FONTPICKER_DEFAULTS = {
  styles: [
    new FontPickerStyle('default', 'Default'),
    new FontPickerStyle('header1', 'Header 1', 'h3'),
    new FontPickerStyle('header2', 'Header 2', 'h4')
  ]
};

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

  this.settings = utils.mergeSettings(element, settings, FONTPICKER_DEFAULTS);
  this.element = element;

  this.init();
}

// Plugin Methods
FontPicker.prototype = {

  /**
   * @returns {Popupmenu|undefined} the Popupmenu API for the picker, if applicable.
   */
  get menuAPI() {
    const api = this.element.data('popupmenu');
    if (!api) {
      return undefined;
    }
    return api;
  },

  /**
   * @returns {FontPickerStyle} currently selected font
   */
  get selectedFont() {
    let selected;
    this.settings.styles.forEach((style) => {
      if (style.selected) {
        selected = style;
      }
    });
    if (!selected) {
      return this.settings.styles[0].selected;
    }
    return selected;
  },

  /**
   * Gets a reference to a FontPickerStyle object defined within this component.
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
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Ensure we have an array for this, otherwise reset to default.
    if (!Array.isArray(this.settings.styles)) {
      this.settings.styles = FONTPICKER_DEFAULTS.styles;
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
    $element.button();

    // TODO: render a poupmenu element before invoking, similar to how Flex Toolbar Item renders.
    // see the `renderMoreActionsMenu()` method in Flex Toolbar's API.
    let $menu = $element.next('.popupmenu');
    if (!$menu || !$menu.length) {
      $menu = $('<ul class="popupmenu"></ul>').insertAfter(this.element);
    }
    $menu.html(this.buildMenuHTML());
    $element.popupmenu({
      menu: $menu
    });

    return this;
  },

  /**
   * @private
   * Builds the Fontpicker's Popupmenu HTML
   * @returns {string} representing the Popupmenu's HTML.
   */
  buildMenuHTML() {
    let menuHTML = '';

    this.settings.styles.forEach((style) => {
      menuHTML += `<li class="fontpicker-style">
        <a href="#" data-val="${style.id}">${style.displayName}</a>
      </li>`;
    });

    return `${menuHTML}</ul>`;
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
      .on(`updated.${COMPONENT_NAME}`, () => {
        self.updated();
      });

    return this;
  },

  /**
   * Selects a font from the list
   * @param {string|FontPickerStyle} id either an ID string, or a direct reference to a FontPickerStyle
   */
  select(id) {
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

    // Update the font
    $(this.element).find('span').text(style.displayName);

    $(this.element).triggerHandler('font-selected', [style]);
  },

  /**
   * Handle updated settings and values.
   * @returns {object} [description]
   */
  updated() {
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
    $(this.element).off([
      `selected.${COMPONENT_NAME}`,
      `updated.${COMPONENT_NAME}`
    ].join(' '));
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  }
};

export { FontPicker, COMPONENT_NAME };
