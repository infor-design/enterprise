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

const TOOLBAR_READONLY_TYPES = [
  'checkbox', 'radio', 'searchfield'
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

  focusable: false,

  visible: true,

  disabled: false,

  /**
   * @private
   */
  init() {

  },

  /**
   * @returns {void}
   */
  show() {
    this.visible = true;
    this.element.classList.remove('hidden');
  },

  /**
   * @returns {void}
   */
  hide() {
    this.visible = false;
    this.element.classList.add('hidden');
  },

  /**
   * @returns {void}
   */
  enable() {
    this.disabled = false;
    this.element.disabled = false;
    this.readonly = false;
    this.element.readonly = false;
  },

  /**
   * @returns {void}
   */
  disable() {
    this.disabled = true;
    this.element.disabled = true;
    this.readonly = false;
    this.element.readonly = false;
  },

  /**
   * @returns {void}
   */
  readonly() {
    if (TOOLBAR_READONLY_TYPES.indexOf(this.type) === -1) {
      return; // TODO: throw error?
    }
    this.disabled = false;
    this.element.disabled = false;
    this.readonly = true;
    this.element.readonly = true;
  },

  /**
   * @returns {void}
   */
  enableFocus() {
    this.focusable = true;
    this.element.tabIndex = 0;
  },

  /**
   * @returns {void}
   */
  disableFocus() {
    this.focusable = false;
    this.element.tabIndex = -1;
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
    delete this.focusable;
    delete this.visible;
    delete this.disabled;
    delete this.readonly;
  }

};

export { ToolbarFlexItem, COMPONENT_NAME, TOOLBAR_ELEMENTS };
