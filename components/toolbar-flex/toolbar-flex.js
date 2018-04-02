import { utils } from '../utils/utils';
import { log } from '../utils/debug';
import { TOOLBAR_ELEMENTS } from './toolbar-flex.item';

// jQuery Components
import './toolbar-flex.item.jquery';

// Component Name
const COMPONENT_NAME = 'toolbar-flex';

/**
 * Component Default Settings
 * @namespace
 */
const TOOLBAR_FLEX_DEFAULTS = {};

/**
 * @constructor
 * @param {HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 */
function ToolbarFlex(element, settings) {
  this.element = element;
  this.settings = utils.mergeSettings(this.element, settings, TOOLBAR_FLEX_DEFAULTS);

  this.init();
}

ToolbarFlex.prototype = {

  /**
   * @private
   */
  trueFocusedItem: undefined,

  sections: [],

  items: [],

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.sections = Array.from(this.element.querySelectorAll('.toolbar-section'));
    this.items = this.getElements().map((item) => {
      $(item).toolbarflexitem();
      return $(item).data('toolbarflexitem');
    });

    if (!this.items) {
      return;
    }

    // Check for a focused item
    this.items.forEach((item) => {
      if (item.focused) {
        if (this.focusedItem === undefined) {
          this.focusedItem = item;
        } else {
          item.focused = false;
        }
      }
    });
    if (!this.focusedItem) {
      this.focusedItem = this.items[0];
    }

    this.render();
    this.handleEvents();
  },

  /**
   * @returns {void}
   */
  render() {
    this.element.setAttribute('role', 'toolbar');
  },

  /**
   * @private
   * @returns {void}
   */
  handleEvents() {
    $('body').on(`resize.${COMPONENT_NAME}`, () => this.handleResize);
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
    this.element.addEventListener('keyup', this.handleKeyup.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));

    $(this.element).on(`selected.${COMPONENT_NAME}`, (e, ...args) => {
      log('dir', args);
    });
  },

  /**
   * Event Handler for internal `keydown` events.
   * @private
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleKeydown(e) {
    const target = e.target;

    // Toolbar Items get handled separately.
    if ($(target).data('toolbarflexitem')) {
      this.handleItemKeydown(e);
      // return;
    }
  },

  /**
   * Event Handler for internal `keydown` events, specifically on Toolbar Items.
   * @private
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleItemKeydown(e) {
    const key = e.key;
    const item = this.getItemFromElement(e.target);

    // NOTE: 'Enter' and 'SpaceBar' are purposely not handled on keydown, since
    // a `click` event will be fired on Toolbar items while pressing either of these keys.
    if (key === 'Enter') {
      this.clickByEnterKey = true;
      return;
    }

    if (key === ' ') { // SpaceBar
      if (item.type === 'hyperlink') {
        this.select(e.target);
      }
      return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      if (item.type === 'searchfield' && key === 'ArrowLeft') {
        return;
      }
      this.navigate(-1, undefined, true);
      return;
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      if (item.type === 'searchfield' && key === 'ArrowRight') {
        return;
      }
      this.navigate(1, undefined, true);
    }
  },

  /**
   * Event Handler for internal `keyup` events
   * @private
   * @param {KeyboardEvent} e `keyup`
   * @returns {void}
   */
  handleKeyup(e) {
    this.clearClickByEnter(e);
  },

  /**
   * Event Handler for internal `click` events
   * @private
   * @param {MouseEvent} e `click`
   * @returns {void}
   */
  handleClick(e) {
    const target = e.target;

    // Toolbar Items get handled separately.
    if ($(target).data('toolbarflexitem')) {
      this.handleItemClick(e);
    }

    this.clearClickByEnter();
  },

  /**
   * Event Handler for internal `click` events, specifically on Toolbar Items.
   * @private
   * @param {MouseEvent} e `click`
   * @returns {void}
   */
  handleItemClick(e) {
    this.select(e.target);
  },

  /**
   * @private
   * @param {Event} e incoming event of multiple types
   * @returns {void}
   */
  clearClickByEnter(e) {
    // Gets set in `this.handleItemKeydown` by pressing 'Enter'.
    if (this.clickByEnterKey) {
      // Prevents the enter key from triggering a `selected` event on the menu button.
      if (this.type === 'menubutton' || this.type === 'actionbutton') {
        e.preventDefault();
      }
      delete this.clickByEnterKey;
    }
  },

  /**
   * Gets all the elements currently inside the Toolbar Markup.
   * The array of items produced is ordered by Toolbar Section.
   * @returns {array} of Toolbar Items
   */
  getElements() {
    const items = [];
    let allSelectors = [];

    // Build a really big selector containing all possible matches
    TOOLBAR_ELEMENTS.forEach((elemObj) => {
      allSelectors.push(elemObj.selector);
    });
    allSelectors = allSelectors.join(', ');

    // Get all possible Toolbar Element matches
    // NOTE: Important that the toolbar items are picked up by the querySelector
    // in their actual, physical DOM order.
    const thisElems = Array.from(this.element.querySelectorAll(allSelectors));

    // Check each element for each type of toolbar item.
    // If there's a match, push to the item array.
    thisElems.forEach((elem) => {
      let defined = false;
      TOOLBAR_ELEMENTS.forEach((elemObj) => {
        if (defined || !$(elem).is(elemObj.selector)) {
          return;
        }
        if (typeof elemObj.filter === 'function') {
          if (!elemObj.filter(elem)) {
            return;
          }
        }
        defined = true;
        items.push(elem);
      });
    });

    return items;
  },

  /**
   * @param {HTMLElement} element the element to be checked
   * @returns {ToolbarFlexItem} an instance of a Toolbar item
   */
  getItemFromElement(element) {
    let item;
    for (let i = 0; i < this.items.length; i++) {
      // Simple comparison of innerHTML to figure out if the elements match up
      if (this.items[i].element.innerHTML === element.innerHTML) {
        item = this.items[i];
      }
    }

    if (!item) {
      throw new Error(`No Toolbar Item instance available for element ${element}.`);
    }

    return item;
  },

  /**
   * @returns {ToolbarFlexItem|undefined} either a toolbar item, or undefined if one
   *  wasn't previously focused.
   */
  get focusedItem() {
    if (this.trueFocusedItem) {
      return this.trueFocusedItem;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].focused === true) {
        return this.items[i];
      }
    }
    return undefined;
  },

  // Setter for focusedItem
  set focusedItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].focused = false;
    }
    item.focused = true;
    this.trueFocusedItem = item;
  },

  // Flag for figuring out if a Toolbar's items are all completely unavailable for keyboard focus.
  get hasFocusableItems() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].focusable === true) {
        return true;
      }
    }
    return false;
  },

  /**
   * @returns {HTMLElement[]} all overflowed items in the toolbar
   */
  get overflowedItems() {
    const overflowed = [];

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].overflowed === true) {
        overflowed.push(this.items[i]);
      }
    }

    return overflowed;
  },

  /**
   * Navigates among toolbar items and gets a reference to a potential target for focus.
   * @param {number} direction positive/negative value representing how many spaces to move
   * @param {number} [currentIndex] the index to start checking from
   *  the current focus either right/left respectively.
   * @param {boolean} [doSetFocus=false] if set to true, will cause navigation to also set focus.
   */
  navigate(direction, currentIndex, doSetFocus) {
    if (this.hasFocusableItems === false) {
      log('No focusable items');
      return;
    }

    if (currentIndex === undefined) {
      currentIndex = this.items.indexOf(this.focusedItem);
    }

    log(`Toolbar Navigation: ${direction} points away from index ${currentIndex}`);

    while (direction !== 0) {
      if (direction > 0) {
        if (currentIndex === this.items.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        --direction;
      }
      if (direction < 0) {
        if (currentIndex === 0) {
          currentIndex = this.items.length - 1;
        } else {
          --currentIndex;
        }
        direction++;
      }
    }

    const targetItem = this.items[currentIndex];
    if (targetItem.focusable === false) {
      this.navigate(direction > 0 ? 1 : -1, currentIndex, doSetFocus);
      return;
    }

    // Retain a reference to the focused item and set focus, if applicable.
    this.focusedItem = targetItem;
    if (doSetFocus) {
      this.focusedItem.element.focus();
    }
  },

  /**
   * @param {HTMLElement} element an HTMLElement representing a Toolbar Item.
   * @returns {void}
   */
  select(element) {
    const item = this.getItemFromElement(element);

    switch (item.type) {
      case 'searchfield':
      case 'actionbutton':
      case 'menubutton': {
        if (this.clickByEnterKey) {
          return;
        }
        item.selected = true;
        break;
      }
      default:
        item.selected = true;
        break;
    }

    log('log', `Item ${item} selected.`);
  },

  /**
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (typeof settings === 'object') {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
  },

  /**
   * @returns {void}
   */
  teardown() {
    $('body').off(`resize.${COMPONENT_NAME}`);
    this.element.removeEventListener('keydown', this.handleKeydown.bind(this));
    this.element.removeEventListener('up', this.handleKeyup.bind(this));
    this.element.removeEventListener('click', this.handleClick.bind(this));

    $(this.element).off(`selected.${COMPONENT_NAME}`);

    delete this.items;
    delete this.sections;
  },

  /**
   * @returns {void}
   */
  destroy() {
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
