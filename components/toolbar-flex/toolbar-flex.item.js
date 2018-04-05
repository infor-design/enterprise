import { utils } from '../utils/utils';
import { Environment as env } from '../utils/environment';

// Component Name
const COMPONENT_NAME = 'toolbarflexitem';

// Filters out hyperlinks that are part of menu/action button components
function hyperlinkFilter(elem) {
  return $(elem).parents('.popupmenu').length < 1;
}

// Toolbar Focusable Element Selectors.
// Any of these element/class types are valid toolbar items.
// TODO: Designate between "button" and "menu button"
const TOOLBAR_ELEMENTS = [
  { type: 'button', selector: 'button:not(.btn-menu):not(.btn-actions), input[type="button"]:not(.btn-menu):not(.btn-actions)' },
  { type: 'menubutton', selector: '.btn-menu' },
  { type: 'actionbutton', selector: '.btn-actions' },
  { type: 'hyperlink', selector: 'a[href]', filter: hyperlinkFilter },
  { type: 'checkbox', selector: 'input[type="checkbox"]' },
  { type: 'radio', selector: 'input[type="radio"]' },
  { type: 'searchfield', selector: '.searchfield' },
  { type: 'toolbarsearchfield', selector: '.toolbarsearchfield' } // temporary
];

// Mappings from toolbar item type to component API
const TOOLBAR_COMPONENT_APIS = {
  actionbutton: 'popupmenu',
  menubutton: 'popupmenu',
  hyperlink: 'hyperlink',
  searchfield: 'searchfield',
  toolbarsearchfield: 'searchfield'
};

/**
 * Default Settings
 * @namespace
 */
const TOOLBAR_FLEX_ITEM_DEFAULTS = {
  disabled: false,
  readonly: false,
  hidden: false,
  componentSettings: undefined
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
  this.section = this.element.parentElement;
  this.toolbar = this.section.parentElement;

  this.init();
}

ToolbarFlexItem.prototype = {

  type: undefined,

  /**
   * @private
   */
  init() {
    this.render();
    this.handleEvents();
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

  get focused() {
    return this.element.tabIndex === 0;
  },

  /**
   * @param {boolean} boolean, if provided, sets a focused state on the toolbar item.
   * @returns {void}
   */
  set focused(boolean) {
    if (boolean) {
      this.element.tabIndex = 0;
      return;
    }
    this.element.tabIndex = -1;
  },

  get selected() {
    return this.trueSelected;
  },

  /**
   * @param {boolean} boolean, if provided, sets a selected state on the toolbar item.
   * @returns {void}
   */
  set selected(boolean) {
    if (boolean) {
      this.trueSelected = true;
      this.element.classList.add('is-selected');
      this.triggerSelectedEvent();

      if (this.selectedAnchor) {
        delete this.selectedAnchor;
      }
      return;
    }
    this.trueSelected = false;
    this.element.classList.remove('is-selected');
  },

  /**
   * Retrieves an item's main Soho Component instance.
   * @returns {object|undefined} Soho Component instance, if applicable
   */
  get componentAPI() {
    const $element = $(this.element);
    const componentType = TOOLBAR_COMPONENT_APIS[this.type];

    if (!componentType) {
      return undefined;
    }

    return $element.data(componentType);
  },

  /**
   * @returns {ToolbarFlex} the parent toolbar API
   */
  get toolbarAPI() {
    return $(this.toolbar).data('toolbar-flex');
  },

  /**
   * @fires selected
   * @returns {void}
   */
  triggerSelectedEvent() {
    // Searchfields aren't "selectable" in the same way actionable items are,
    // so they shouldn't fire the "selected" event.
    if (this.type === 'searchfield' || this.type === 'toolbarsearchfield') {
      return;
    }

    const eventArgs = [this];

    // MenuButton types pass the currently-selected anchor
    if ((this.type === 'menubutton' || this.type === 'actionbutton') && this.selectedAnchor) {
      eventArgs.push(this.selectedAnchor);
    }

    $(this.element).trigger('selected', eventArgs);
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

  /**
   * @returns {boolean} whether or not the item is pushed into overflow by the boundaries
   *  of its container element.
   */
  get overflowed() {
    const isRTL = env.rtl;
    const elemRect = this.element.getBoundingClientRect();
    const sectionRect = this.section.getBoundingClientRect();

    if (isRTL) {
      return elemRect.left < sectionRect.left;
    }
    return elemRect.right > sectionRect.right;
  },

  /**
   * Sets up all event listeners for this element.
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const $element = $(this.element);

    if (this.type === 'menubutton' || this.type === 'actionbutton') {
      // Listen to the Popupmenu's selected event
      $element.on(`selected.${COMPONENT_NAME}`, (e, anchor) => {
        if (this.selectedAnchor) {
          return;
        }

        e.stopPropagation();
        self.selectedAnchor = anchor;
        self.selected = true;
      });
    }

    if (this.type === 'actionbutton') {
      $element.on(`beforeopen.${COMPONENT_NAME}`, this.handleActionButtonBeforeOpen.bind(this));
    }
  },

  /**
   * If this element is an Action Button, this listener runs before its popupmenu is opened
   * To determine which elements need to be shown/hidden.
   * @private
   */
  handleActionButtonBeforeOpen() {
    this.refreshMoreActionsMenu();
  },

  /**
   * Renders extra markup or anything else needed on the toolbar item
   * @returns {void}
   */
  render() {
    // Setup component APIs, if applicable
    // NOTE: Soho Initializer doesn't invoke these automatically, by nature of the
    // base elements existing inside the Flex Toolbar.
    const $element = $(this.element);
    const componentType = TOOLBAR_COMPONENT_APIS[this.type];
    if (componentType) {
      const api = $element.data(componentType);
      if (!api) {
        $element[componentType](this.settings.componentSettings);
      } else {
        api.updated(this.settings.componentSettings);
      }
    }

    // Action Buttons need more stuff
    if (this.type !== 'actionbutton') {
      return;
    }
    this.renderMoreActionsMenu();
  },

  /**
   * Builds data from Toolbar items that will properly supply pre-defined items to the More Actions menu.
   * @param {boolean} [force=false] if defined as true, will force-empty the list of all previous toolbar item links.
   */
  renderMoreActionsMenu(force) {
    const menuAPI = this.componentAPI;
    if (!menuAPI || !this.toolbarAPI) {
      return;
    }

    const $menu = menuAPI.menu;

    // Clear the More Actions menu of anything that shouldn't be there (AJAX-related stuff that will be reloaded)
    let excludes = this.predefinedItems || $();
    if (force) {
      excludes = $();
    }
    // TODO: Distinguish between Toolbar Items and pre-defined Popupmenu Markup?
    this.unlinkToolbarItems();
    $menu.children().not(excludes).remove();

    // Add Toolbar Items
    const data = this.toolbarAPI.toPopupmenuData();
    const menuItems = $(menuAPI.renderItem(data));
    this.predefinedItems = menuItems;
    this.linkToolbarItems(data);

    $menu.prepend(this.predefinedItems);
  },

  /**
   * Removes links between the current set of Toolbar Items to `More Actions` menu items.
   */
  unlinkToolbarItems() {
    if (this.type !== 'actionbutton' || !this.predefinedItems || !this.predefinedItems.length) {
      return;
    }

    this.predefinedItems.each((i, item) => {
      const originalButton = $(item).data('originalButton');
      originalButton.data('toolbarflexitem').actionButtonLink = null;
      $(item).removeData('original-button');
    });
  },

  /**
   * Links the current set of Toolbar Items to the `More Actions` menu items.
   * @param {object} popupmenuData incoming popupmenu data
   */
  linkToolbarItems(popupmenuData) {
    if (this.type !== 'actionbutton' || !popupmenuData) {
      return;
    }

    if (!Array.isArray(popupmenuData)) {
      popupmenuData = popupmenuData.menu;
    }

    this.predefinedItems.each((i, item) => {
      const originalButton = popupmenuData[i].itemLink;
      originalButton.actionButtonLink = item;
      $(item).data('original-button', originalButton.element);
    });
  },

  /**
   * @returns {object} an object representation of this Toolbar Item as a Popupmenu Item.
   */
  toPopupmenuData() {
    const itemData = {
      itemLink: this,
      disabled: this.disabled,
      visible: this.visible
    };

    const icon = this.element.querySelector('.icon:not(.close):not(.icon-dropdown) > use');
    if (icon) {
      itemData.icon = icon.getAttribute('xlink:href').replace('#icon-', '');
    }

    if (this.type === 'button' || this.type === 'menubutton') {
      itemData.text = this.element.textContent.trim();
    }

    if (this.type === 'menubutton') {
      // TODO: Need to convert a Popupmenu's contents to the object format with this method
      itemData.submenu = this.componentAPI.toData({ noMenuWrap: true });
    }

    return itemData;
  },

  /**
   * @private
   * @returns {void}
   */
  refreshMoreActionsMenu() {
    if (this.type !== 'actionbutton') {
      return;
    }

    const menuAPI = this.componentAPI;
    if (!menuAPI || !this.toolbarAPI) {
      return;
    }

    // If there are toolbar items, but no predefined items items, render the more-actions menu
    if ((!this.predefinedItems || !this.predefinedItems.length) && this.toolbarAPI.items.length) {
      this.renderMoreActionsMenu();
    }

    // Each Linked Toolbar Item will be refreshed by the Popupmenu API
    this.toolbarAPI.items.forEach((item) => {
      if (!item.actionButtonLink) {
        return;
      }
      menuAPI.refreshMenuItem(item.actionButtonLink, item.toPopupmenuData());
    });
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
    $(this.element)
      .off(`selected.${COMPONENT_NAME}`)
      .off(`beforeopen.${COMPONENT_NAME}`);

    delete this.type;
    delete this.selected;
    delete this.focusable;
    delete this.visible;
    delete this.disabled;
    delete this.readonly;
    delete this.invoked;
  }

};

export { ToolbarFlexItem, getToolbarItemType, COMPONENT_NAME, TOOLBAR_ELEMENTS };
