import { utils } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';

// jQuery Components
import '../button/button.jquery';
import '../colorpicker/colorpicker.jquery';
import '../hyperlinks/hyperlinks.jquery';
import '../popupmenu/popupmenu.jquery';
import '../searchfield/searchfield.jquery';

// Component Name
const COMPONENT_NAME = 'toolbarflexitem';

// Filters out buttons located inside of Searchfield wrappers.
// Only `input` elements should be picked up by the item detector.
function buttonFilter(elem) {
  const searchfieldWrapper = $(elem).parents('.searchfield-wrapper, .toolbar-searchfield-wrapper');
  return !searchfieldWrapper.length;
}

// Filters out hyperlinks that are part of menu/action button components
function hyperlinkFilter(elem) {
  if (elem.nodeName !== 'A') {
    throw new Error('Unspecified error occured');
  }

  const wrapped = $(elem);
  return wrapped.parents('.popupmenu').length < 1;
}

// Toolbar Focusable Element Selectors.
// Any of these element/class types are valid toolbar items.
// TODO: Designate between "button" and "menu button"
const TOOLBAR_ELEMENTS = [
  { type: 'button', selector: 'button:not(.btn-menu):not(.btn-actions):not(.colorpicker-editor-button), input[type="button"]:not(.btn-menu):not(.btn-actions):not(.colorpicker-editor-button)', filter: buttonFilter },
  { type: 'menubutton', selector: '.btn-menu' },
  { type: 'actionbutton', selector: '.btn-actions' },
  { type: 'colorpicker', selector: '.colorpicker-editor-button' },
  { type: 'hyperlink', selector: 'a[href]', filter: hyperlinkFilter },
  { type: 'checkbox', selector: 'input[type="checkbox"]' },
  { type: 'radio', selector: 'input[type="radio"]' },
  { type: 'searchfield', selector: '.searchfield' },
  { type: 'toolbarsearchfield', selector: '.toolbarsearchfield' } // temporary
];

// Mappings from toolbar item type to component API
const TOOLBAR_COMPONENT_APIS = {
  actionbutton: 'popupmenu',
  colorpicker: 'colorpicker',
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
  readOnly: false,
  hidden: false,
  componentSettings: undefined,
  allowTabs: false
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

  this.init();
}

ToolbarFlexItem.prototype = {

  /**
   * @property {string} type used to determine the type of toolbar item.  Certain toolbar item types
   *  have certain special properties.
   * @property {HTMLElement} section the parent toolbar section that this item is housed in.
   * @property {HTMLElement} toolbar the parent toolbar's base element.
   */
  type: undefined,

  /**
   * @property {boolean} a different type to check if the object is a ToolbarFlexItem.
   */
  isToolbarFlexItem: true,

  /**
   * @private
   * @returns {void}
   */
  init() {
    // internal flags
    this.type = getToolbarItemType(this.element);
    this.section = this.element.parentElement;
    this.toolbar = this.section.parentElement;
    this.trueSelected = false;
  },

  /**
   * @returns {boolean} whether or not the toolbar item is currently able to be focused, based
   *  on its `disabled`, `overflowed`, and `visible` properties.
   */
  get focusable() {
    if (this.disabled === true) {
      return false;
    }
    if (this.type === 'searchfield') {
      return true;
    }
    if (this.type === 'actionbutton' && this.hasNoOverflowedItems === true) {
      return false;
    }
    if (this.overflowed === true) {
      return false;
    }

    return this.visible;
  },

  /**
   * @returns {boolean} whether or not the toolbar item is the one that will currently be focused
   */
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

  /**
   * @returns {boolean} whether or not the Toolbar item is selected.
   */
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
   * @returns {object} Soho Component instance, if applicable
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
    if (this.settings.toolbarAPI) {
      return this.settings.toolbarAPI;
    }
    return $(this.toolbar).data('toolbar-flex');
  },

  /**
   * @fires selected
   * @returns {void}
   */
  triggerSelectedEvent() {
    // Searchfields and Colorpickers aren't "selectable" in the same way actionable
    // items are, so they shouldn't fire the "selected" event.
    const disallowedTypes = ['colorpicker', 'searchfield', 'toolbarsearchfield'];
    if (disallowedTypes.indexOf(this.type) > -1) {
      return;
    }

    const eventArgs = [this];

    // MenuButton types pass the currently-selected anchor
    const selectedAnchorTypes = ['menubutton', 'actionbutton'];
    if (selectedAnchorTypes.indexOf(this.type) > -1 && this.selectedAnchor) {
      eventArgs.push(this.selectedAnchor);
    }

    $(this.element).trigger('selected', eventArgs);
  },

  /**
   * Causes the toolbar item to become visible.
   * @returns {void}
   */
  show() {
    this.visible = true;
  },

  /**
   * Causes the toolbar item to become hidden.
   * @returns {void}
   */
  hide() {
    this.visible = false;
  },

  /**
   * Toggles the Toolbar item's visiblity.
   * @param {boolean} boolean whether or not the `hidden` class should be set.
   */
  set visible(boolean) {
    // NOTE: Temporary until Searchfield handles this better internally.
    const isSearchfield = this.type === 'searchfield' || this.type === 'toolbarsearchfield';

    if (boolean) {
      if (isSearchfield) {
        this.element.parentNode.classList.remove('hidden');
      }
      this.element.classList.remove('hidden');
      return;
    }

    if (isSearchfield) {
      this.element.parentNode.classList.add('hidden');
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
    if (this.hasReadOnly) {
      this.readOnly = false;
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
      this.element.setAttribute('aria-disabled', true);
      this.element.readOnly = false;
      return;
    }

    this.element.disabled = false;
    this.element.removeAttribute('aria-disabled');
  },

  /**
   * @returns {boolean} whether or not `readOnly` as a property exists on this HTMLElement type.
   */
  get hasReadOnly() {
    return 'readOnly' in this.element;
  },

  /**
   * @returns {boolean} element's readOnly prop
   */
  get readOnly() {
    if (!this.hasReadOnly) {
      return false;
    }
    return this.element.readOnly;
  },

  /**
   * @param {boolean} boolean, if provided, sets a readOnly state on the toolbar item, if possible.
   * @returns {void}
   */
  set readOnly(boolean) {
    if (!this.hasReadOnly) {
      return;
    }

    if (boolean) {
      this.disabled = false;
      this.element.disabled = false;
      this.element.readOnly = true;
      return;
    }

    this.element.readOnly = false;
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
   * @param {boolean} isTrue whether or not the more actions menu has overflowed items, causing it to become displayed
   * @returns {void}
   */
  set hasNoOverflowedItems(isTrue) {
    if (this.type !== 'actionbutton' || !this.componentAPI) {
      return;
    }

    const popupmenuLength = this.componentAPI.toData({ noMenuWrap: true }).length;
    const menuIsEmpty = (popupmenuLength - this.predefinedItems.length) < 1;

    if (isTrue && menuIsEmpty) {
      this.element.classList.add('no-overflowed-items');
      this.trueHasNoOverflowedItems = true;

      if (this.focused) {
        this.toolbarAPI.focusedItem = this;
        this.toolbarAPI.navigate(-1, undefined);
      }
      return;
    }
    this.trueHasNoOverflowedItems = false;
    this.element.classList.remove('no-overflowed-items');
  },

  /**
   *
   */
  get hasNoOverflowedItems() {
    if (!this.componentAPI) {
      return true;
    }
    return this.trueHasNoOverflowedItems;
  },

  /**
   * Sets up all event listeners for this element.
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const $element = $(this.element);

    const popupmenuConsumers = ['menubutton', 'actionbutton', 'colorpicker'];
    if (popupmenuConsumers.indexOf(this.type) > -1) {
      // Listen to the Popupmenu's selected event
      $element.on(`selected.${COMPONENT_NAME}`, (e, anchor) => {
        if (this.selectedAnchor) {
          return;
        }

        e.stopPropagation();

        if (this.type === 'actionbutton') {
          const li = $(anchor).parent();
          let itemLink = li.data('originalButton');
          let itemLinkAPI = $(itemLink).data('toolbarflexitem');
          let elementLink;

          if (li.parents('ul').length > 1) {
            elementLink = li.data('original-menu-element');
            itemLink = li.parents('li').last().data('originalButton');
            itemLinkAPI = $(itemLink).data('toolbarflexitem');
          }

          // If this item is linked to another toolbar item, trigger its `selected` event instead
          // of the one on the item in this menu.
          if (itemLinkAPI) {
            if (elementLink) {
              e.preventDefault();
              itemLinkAPI.selectedAnchor = $(elementLink).children('a');
            } else {
              // case of a menu button overflowed into more actions
              itemLinkAPI.selectedAnchor = anchor;
            }
            itemLinkAPI.selected = true;
            return;
          }
        }

        self.selectedAnchor = anchor;
        self.selected = true;
      });
    }

    if (this.type === 'actionbutton') {
      $element.on(`beforeopen.${COMPONENT_NAME}`, this.handleActionButtonBeforeOpen.bind(this));
      $('body').off(`resize.${COMPONENT_NAME}`).on(`resize.${COMPONENT_NAME}`, this.handleActionButtonResize.bind(this));
    }

    if (!this.settings.allowTabs) {
      $element.on(`focus.${COMPONENT_NAME}`, this.handleFocus.bind(this));
    }
  },

  /**
   * If this element is an Action Button, this listener runs before its popupmenu is opened
   * To determine which elements need to be shown/hidden.
   * @private
   * @returns {void}
   */
  handleActionButtonBeforeOpen() {
    this.refreshMoreActionsMenu();
  },

  /**
   * If this element is an Action Button, this listener runs whenever Soho's custom resize event
   * on the `<body>` tag fires, to determine which elements need to be shown/hidden.
   * @private
   * @returns {void}
   */
  handleActionButtonResize() {
    this.refreshMoreActionsMenu();
  },

  /**
   * @private
   * @param {FocusEvent} e `focus`
   * @returns {void}
   */
  handleFocus(e) {
    if (e.target && e.target === this.element) {
      this.toolbarAPI.focusedItem = this;
    }
  },

  /**
   * Renders extra markup or anything else needed on the toolbar item
   * @returns {void}
   */
  render() {
    // eslint-disable-next-line
    this.disabled = this.disabled;
    if (this.hasReadOnly) {
      // eslint-disable-next-line
      this.readonly = this.readonly;
    }

    // Setup component APIs, if applicable.
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
    if (this.type === 'actionbutton') {
      this.renderMoreActionsMenu();
      this.refreshMoreActionsMenu();
    }

    this.handleEvents();
  },

  /**
   * Uses data from Toolbar Items to build Toolbar-linked, pre-defined items for the More Actions menu.
   * NOTE: This method only runs when this toolbar item is a "More Actions" button
   * @private
   * @returns {void}
   */
  renderMoreActionsMenu() {
    const menuAPI = this.componentAPI;
    if (!menuAPI || !this.toolbarAPI) {
      return;
    }

    // If the menu doesn't already exist, pre-define it.
    let $menu = menuAPI.menu;
    if (!$menu || !$menu.length) {
      $menu = $('<ul class="popupmenu"></ul>').insertAfter(this.element);
    }

    this.teardownPredefinedItems();

    // Get Popupmenu data equivalent of the current set of Toolbar items.
    // Menu item data is scrubbed for IDs that would otherwise be duplicated
    function removeMenuIds(item, isSubmenu) {
      if (item.menuId) {
        delete item.menuId;
      }
      const menuTarget = isSubmenu ? 'submenu' : 'menu';
      if (Array.isArray(item[menuTarget])) {
        item[menuTarget].forEach((subitem) => {
          removeMenuIds(subitem, true);
        });
      }
    }
    const data = this.toolbarAPI.toPopupmenuData();
    removeMenuIds(data);

    // Add Toolbar Items as predefined items to the Popupmenu.
    const menuItems = $(menuAPI.renderItem(data));
    this.predefinedItems = menuItems;
    this.linkToolbarItems(data);

    // Notify the Popupmenu of predefined items
    $menu.prepend(this.predefinedItems);
    menuAPI.updated({
      menu: $menu,
      predefined: menuItems
    });

    this.menuRendered = true;
  },

  /**
   * Refreshes the state of menu items in a "More Actions" menu that were constructed by the Flex Toolbar.
   * @private
   * @returns {void}
   */
  refreshMoreActionsMenu() {
    if (this.type !== 'actionbutton') {
      return;
    }

    const menuAPI = this.componentAPI;
    if (!menuAPI || !this.toolbarAPI || menuAPI.isOpen) {
      return;
    }

    this.hasNoOverflowedItems = true;

    // If there are toolbar items, but no predefined items, render the more-actions menu
    if ((!menuAPI.settings.beforeOpen && (!this.predefinedItems || !this.predefinedItems.length)) &&
      this.toolbarAPI.items.length) {
      this.renderMoreActionsMenu();
    }

    let hasNoOverflowedItems = true;

    // Called at the end of the item refresh.
    // Uses the Popupmenu's API to add overflow information.
    function itemRefreshCallback(menuItem, data) {
      if (data.isSubmenuItem) {
        return;
      }

      if (data.overflowed === true) {
        menuItem.classList.add('is-overflowed');

        if (data.visible) {
          menuItem.classList.remove('hidden');
        }

        hasNoOverflowedItems = false;
        return;
      }

      menuItem.classList.remove('is-overflowed');
      menuItem.classList.add('hidden');
    }

    // Each Linked Toolbar Item will be refreshed by the Popupmenu API
    this.toolbarAPI.items.forEach((item) => {
      if (!item.actionButtonLink) {
        return;
      }

      const itemData = item.toPopupmenuData();
      itemData.overflowed = item.overflowed;

      if (itemData.id) {
        delete itemData.id;
      }

      menuAPI.refreshMenuItem(item.actionButtonLink, itemData, itemRefreshCallback);
    });

    // Set a record for display
    this.hasNoOverflowedItems = hasNoOverflowedItems;
  },

  /**
   * Removes links between the current set of Toolbar Items to `More Actions` menu items.
   * @private
   * @returns {void}
   */
  unlinkToolbarItems() {
    if (this.type !== 'actionbutton' || !this.menuRendered || !this.predefinedItems || !this.predefinedItems.length) {
      return;
    }

    function doUnlinkSubmenuItem(actionMenuElement) {
      const $originalMenuElement = $($(actionMenuElement).data('original-menu-element'));
      $originalMenuElement.removeData('action-button-link');
      $(actionMenuElement).removeData('original-menu-element');

      if ($originalMenuElement.hasClass('submenu')) {
        const submenuItems = actionMenuElement.querySelector('.popupmenu').children;
        for (let j = 0; j < submenuItems.length; j++) {
          doUnlinkSubmenuItem(submenuItems[j]);
        }
      }
    }

    function doUnlinkToolbarItems(i, itemElement) {
      const originalButton = $(itemElement).data('originalButton');
      const originalButtonAPI = $(originalButton).data('toolbarflexitem');

      originalButtonAPI.actionButtonLink = null;
      $(itemElement).removeData('original-button');

      if (originalButtonAPI.type === 'menubutton') {
        const submenuItems = itemElement.querySelector('.popupmenu').children;
        for (let j = 0; j < submenuItems.length; j++) {
          doUnlinkSubmenuItem(submenuItems[j]);
        }
      }
    }

    this.predefinedItems.each(doUnlinkToolbarItems);
  },

  /**
   * Links the current set of Toolbar Items to the `More Actions` menu items.
   * @private
   * @param {object} popupmenuData incoming popupmenu data
   * @returns {void}
   */
  linkToolbarItems(popupmenuData) {
    if (this.type !== 'actionbutton' || !popupmenuData) {
      return;
    }

    if (!Array.isArray(popupmenuData)) {
      popupmenuData = popupmenuData.menu;
    }

    function doLinkSubmenuItem(menuItemData, actionMenuElement) {
      const originalMenuElement = menuItemData.elementLink;
      $(originalMenuElement).data('action-button-link', actionMenuElement);
      $(actionMenuElement).data('original-menu-element', originalMenuElement);

      const submenu = menuItemData.submenu;
      if (submenu && submenu.length) {
        const submenuItems = actionMenuElement.querySelector('.popupmenu').children;
        for (let j = 0; j < submenuItems.length; j++) {
          doLinkSubmenuItem(submenu[j], submenuItems[j]);
        }
      }
    }

    function doLinkToolbarItems(i, itemElement) {
      const originalButtonAPI = popupmenuData[i].itemLink;
      originalButtonAPI.actionButtonLink = itemElement;
      $(itemElement).data('original-button', originalButtonAPI.element);

      const submenu = popupmenuData[i].submenu;
      if (submenu && submenu.length) {
        const submenuItems = itemElement.querySelector('.popupmenu').children;
        for (let j = 0; j < submenuItems.length; j++) {
          doLinkSubmenuItem(submenu[j], submenuItems[j]);
        }
      }
    }

    this.predefinedItems.each(doLinkToolbarItems);
  },

  /**
   * Converts the contents of the Toolbar Item to a data structure that's compatible with a Popupmenu component.
   * This data structure can be used to populate the contents of a "More Actions" menu.
   * @returns {object} an object representation of the Toolbar Item as a Popupmenu Item.
   */
  toPopupmenuData() {
    if (this.type === 'searchfield' || this.type === 'toolbarsearchfield' || this.type === 'actionbutton') {
      return undefined;
    }

    const itemData = {
      itemLink: this,
      disabled: this.disabled,
      visible: this.visible
    };

    const icon = this.element.querySelector('.icon:not(.close):not(.icon-dropdown) > use');
    if (icon && icon.getAttribute('href')) {
      itemData.icon = icon.getAttribute('href').replace('#icon-', '');
    }

    if (icon && icon.getAttribute('xlink:href')) {
      itemData.icon = icon.getAttribute('xlink:href').replace('#icon-', '');
    }

    if (this.type === 'button' || this.type === 'menubutton') {
      itemData.text = this.element.textContent.trim();
    }

    function addMenuElementLinks(menu, data) {
      const elems = menu.querySelectorAll('li:not(.heading)');
      data.forEach((item, i) => {
        item.elementLink = elems[i];
        if (item.submenu) {
          const submenu = elems[i].querySelector('.popupmenu');
          item.submenu = addMenuElementLinks(submenu, item.submenu);
        }
      });
      return data;
    }

    // Add links to the menubutton's menu item elements to the Popupmenu data
    if (this.type === 'menubutton') {
      const menuElem = this.componentAPI.menu;
      if (!menuElem.length) {
        // Act as if this menubutton is simply empty.
        itemData.submenu = [];
      } else {
        // Get a data representation of the existing menu content
        const originalSubmenuData = this.componentAPI.toData({ noMenuWrap: true });
        const targetId = this.componentAPI.element[0].id;
        if (targetId) {
          // NOTE: don't pass the same ID here, which would cause duplicates
          itemData.id = `${this.toolbarAPI.uniqueId}-${targetId}`;
        }
        itemData.submenu = addMenuElementLinks(menuElem[0], originalSubmenuData);
      }
    }

    return itemData;
  },

  /**
   * Converts the current state of the toolbar item to an object structure that can be
   * easily passed back/forth and tested.
   * @returns {object} containing the current Toolbar Item state.
   */
  toData() {
    const itemData = {
      type: this.type,
      disabled: this.disabled,
      focused: this.focused,
      selected: this.selected,
      overflowed: this.overflowed,
      visible: this.visible
    };

    if (this.hasReadOnly) {
      itemData.readOnly = this.readOnly;
    }

    if (this.actionButtonLink) {
      itemData.actionButtonLink = this.actionButtonLink;
    }

    if (this.componentAPI) {
      itemData.componentAPI = this.componentAPI;
    }

    const icon = this.element.querySelector('.icon:not(.close):not(.icon-dropdown) > use');
    if (icon && icon.getAttribute('href')) {
      itemData.icon = icon.getAttribute('href').replace('#icon-', '');
    }

    if (icon && icon.getAttribute('xlink:href')) {
      itemData.icon = icon.getAttribute('xlink:href').replace('#icon-', '');
    }

    if (this.type === 'button' || this.type === 'menubutton') {
      itemData.text = this.element.textContent.trim();
    }

    if (this.type === 'actionbutton') {
      itemData.predefinedItems = this.predefinedItems;
    }

    if (this.type === 'menubutton' || this.type === 'actionbutton') {
      // TODO: Need to convert a Popupmenu's contents to the object format with this method
      itemData.submenu = this.componentAPI.toData({ noMenuWrap: true });
    }

    return itemData;
  },

  /**
   * Completely updates this component with (optional) new settings.
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
   * @private
   * @returns {void}
   */
  teardownPredefinedItems() {
    if (this.type !== 'actionbutton') {
      return;
    }

    this.unlinkToolbarItems();
    if (this.predefinedItems && this.predefinedItems.length) {
      this.predefinedItems.remove();
    }
  },

  /**
   * Unbinds events and removes preset internal flags for this component.
   * @returns {void}
   */
  teardown() {
    $(this.element)
      .off(`selected.${COMPONENT_NAME}`)
      .off(`beforeopen.${COMPONENT_NAME}`)
      .off(`focus.${COMPONENT_NAME}`);

    $('body').off(`resize.${COMPONENT_NAME}`);

    this.teardownPredefinedItems();

    delete this.type;
    delete this.selected;
    delete this.focusable;
    delete this.visible;
    delete this.disabled;
    delete this.readOnly;

    delete this.section;
    delete this.toolbar;
    delete this.trueSelected;
    delete this.menuRendered;
  }

};

export { ToolbarFlexItem, getToolbarItemType, COMPONENT_NAME, TOOLBAR_ELEMENTS };
