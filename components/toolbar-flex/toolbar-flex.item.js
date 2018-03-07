import { utils } from '../utils/utils';

// Component Name
const COMPONENT_NAME = 'toolbarflexitem';

// Filters out hyperlinks that are part of menu/action button components
function hyperlinkFilter(elem) {
  return $(elem).parents('.popupmenu').length < 1;
}

// Toolbar Focusable Element Selectors.
// Any of these element/class types are valid toolbar items.
const TOOLBAR_ELEMENTS = [
  { type: 'button', selector: 'button, input[type="button"]' },
  { type: 'hyperlink', selector: 'a[href]', filter: hyperlinkFilter },
  { type: 'checkbox', selector: 'input[type="checkbox"]' },
  { type: 'radio', selector: 'input[type="radio"]' },
  { type: 'searchfield', selector: '.searchfield' },
  { type: 'toolbarsearchfield', selector: '.toolbarsearchfield' } // temporary
];

/**
 * Default Settings
 * @namespace
 */
const TOOLBAR_FLEX_ITEM_DEFAULTS = {
  disabled: false,
  readonly: false,
  hidden: false
};

/**
 * Gets the type of Toolbar Item that an element represents.
 * @param {HTMLElement} element being checked for a toolbar item.
 * @returns {string} representing the type
 */
function getToolbarItemType(element) {
  let type = false;
  TOOLBAR_ELEMENTS.forEach((elemObj) => {
    if (!$(element).is(elemObj.selector)) {
      return;
    }
    if (typeof elemObj.filter === 'function' && !elemObj.filter(element)) {
      return;
    }
    type = elemObj.type;
  });

  if (!type) {
    throw new Error(`Element ${element} is not a valid Toolbar Item Type.`);
  }

  return type;
}

/**
 * Toolbar Item Wrapper Component
 * @constructor
 * @param {HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 */
function ToolbarFlexItem(element, settings) {
  this.element = element;
  this.settings = utils.mergeSettings(this.element, settings, TOOLBAR_FLEX_ITEM_DEFAULTS);

  // Internal flags
  this.type = getToolbarItemType(element);
}

ToolbarFlexItem.prototype = {

  type: undefined,

  /**
   * @private
   */
  init() {

  },

  get focusable() {
    if (this.disabled === true) {
      return false;
    }
    return this.visible;
  },

  set focusable(boolean) {
    if (boolean === true) {
      if (this.disabled) {
        this.disabled = false;
      }
      if (!this.visible) {
        this.visible = true;
      }
    }
  },

  /**
   * @returns {void}
   */
  show() {
    this.visible = true;
  },

  /**
   * @returns {void}
   */
  hide() {
    this.visible = false;
  },

  /**
   * @param {boolean} boolean whether or not the `hidden` class should be set.
   */
  set visible(boolean) {
    if (boolean) {
      this.element.classList.remove('hidden');
      return;
    }
    this.element.classList.add('hidden');
  },

  /**
   * @returns {boolean} whether or not the Toolbar Item is visible.
   */
  get visible() {
    return this.element.className.indexOf('hidden') === -1;
  },

  /**
   * @returns {void}
   */
  enable() {
    this.disabled = false;
    if (this.hasReadonly) {
      this.readonly = false;
    }
  },

  /**
   * @returns {boolean} whether or not the element is disabled
   */
  get disabled() {
    return this.element.disabled;
  },

  /**
   * @param {boolean} boolean, if provided, sets a disabled state on the toolbar item.
   * @returns {void}
   */
  set disabled(boolean) {
    if (boolean) {
      this.element.disabled = true;
      this.readonly = false;
    }
  },

  /**
   * @returns {boolean} whether or not `readonly` as a property exists on this HTMLElement type.
   */
  get hasReadonly() {
    return 'readonly' in this.element;
  },

  /**
   * @returns {boolean} element's readonly prop
   */
  get readonly() {
    if (!this.hasReadonly) {
      return false;
    }
    return this.element.readonly;
  },

  /**
   * @param {boolean} boolean, if provided, sets a readonly state on the toolbar item, if possible.
   * @returns {void}
   */
  set readonly(boolean) {
    if (!this.hasReadonly) {
      return;
    }

    if (boolean) {
      this.disabled = false;
      this.element.disabled = false;
      this.element.readonly = true;
      return;
    }

    this.element.readonly = false;
  },

  get selected() {
    return this.element.tabIndex === 0;
  },

  /**
   * @param {boolean} boolean, if provided, sets a selected state on the toolbar item.
   * @returns {void}
   */
  set selected(boolean) {
    if (boolean) {
      this.element.tabIndex = 0;
      this.element.classList.add('is-selected');
      return;
    }
    this.element.tabIndex = -1;
    this.element.classList.remove('is-selected');
  },

  /**
   * @param {object} [settings] incoming settings
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
  },

  /**
   * @returns {void}
   */
  teardown() {
    delete this.type;
    delete this.selected;
    delete this.focusable;
    delete this.visible;
    delete this.disabled;
    delete this.readonly;
  }

};

export { ToolbarFlexItem, getToolbarItemType, COMPONENT_NAME, TOOLBAR_ELEMENTS };
