import { utils } from '../../utils/utils';
import { log } from '../../utils/debug';
import { Locale } from '../locale/locale';
import { ToolbarFlexItem, TOOLBAR_ELEMENTS } from './toolbar-flex.item';

// jQuery Components
import '../button/button.set.jquery';
import './toolbar-flex.item.jquery';

// Component Name
const COMPONENT_NAME = 'toolbar-flex';

/**
 * Component Default Settings
 * @namespace
 */
const TOOLBAR_FLEX_DEFAULTS = {
  allowTabs: false,
  attributes: null,
  beforeMoreMenuOpen: null,
  moreMenuSettings: {},
};

/**
 * @constructor
 * @param {HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 * @param {function} [settings.beforeMoreMenuOpen=null] Ajax function to be called before the more menu is opened
 * @param {boolean} [settings.allowTabs] Allows tab to navigate the toolbar
 * @param {object} [settings.moreMenuSettings] if defined on a toolbar containing a More Actions menu, this will pass settings into this toolbar's More Actions menu
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
    const self = this;
    this.uniqueId = utils.uniqueId(this.element);
    this.items = this.getElements().map((item) => {
      let itemComponentSettings = {};
      const isActionButton = $(item).hasClass('btn-actions');

      if (isActionButton) {
        itemComponentSettings = this.settings.moreMenuSettings || itemComponentSettings;

        if (this.settings.beforeMoreMenuOpen) {
          itemComponentSettings.beforeOpen = this.settings.beforeMoreMenuOpen;
        }
      }

      $(item).toolbarflexitem({
        toolbarAPI: this,
        componentSettings: itemComponentSettings,
        allowTabs: this.settings.allowTabs,
        attributes: this.settings.attributes,
      });
      return $(item).data('toolbarflexitem');
    });
    if (!this.items) {
      return;
    }

    // Connect Toolbar sections and apply `ButtonSet` component to any relevant sections
    this.sections = utils.getArrayFromList(this.element.querySelectorAll('.toolbar-section'));
    this.sections.forEach((section) => {
      if (section.classList.contains('buttonset')) {
        $(section).buttonset({
          detectHTMLButtons: true
        });
      }
    });

    this.jQueryEl = $(this.element);

    if (this.jQueryEl.hasClass('contextual-toolbar')) {
      this.more = this.jQueryEl.find('.btn-actions');
      if (this.more.length === 0 && !this.jQueryEl.hasClass('no-actions-button')) {
        let moreContainer = this.jQueryEl.find('.more');

        if (!moreContainer.length) {
          moreContainer = $('<div class="toolbar-section more"></div>').appendTo(this.jQueryEl);
        }

        this.more = $('<button class="btn-actions" type="button"></button>')
          .html(`${$.createIcon({ icon: 'more' })
          }<span class="audible">${Locale.translate('MoreActions')}</span>`)
          .attr('title', Locale.translate('More'))
          .appendTo(moreContainer);
      }

      // Reference all interactive items in the toolbar
      this.buttonset = $('.toolbar-section.buttonset');
      this.buttonsetItems = this.buttonset.children('button')
        .add(this.buttonset.find('input')); // Searchfield Wrappers

      // Items contains all actionable items in the toolbar, including the ones in
      // the title, and the more button
      this.toolBarItems = this.buttonsetItems
        // .add(this.title.children('button'))
        .add(this.more);

      const popupMenuInstance = this.more.data('popupmenu');
      const moreAriaAttr = this.more.attr('aria-controls');

      if (!popupMenuInstance) {
        this.moreMenu = $(`#${moreAriaAttr}`);
        if (!this.moreMenu.length || moreAriaAttr === undefined) {
          this.moreMenu = this.more.next('.popupmenu, .popupmenu-wrapper');
        }
        if (!this.moreMenu.length) {
          this.moreMenu = $(`<ul id="popupmenu-toolbar-${this.uniqueId}" class="popupmenu"></ul>`).insertAfter(this.more);
        }

        // Allow toolbar to understand pre-wrapped popupmenus
        // Angular Support -- See SOHO-7008
        if (this.moreMenu.is('.popupmenu-wrapper')) {
          this.moreMenu = this.moreMenu.children('.popupmenu');
        }
      } else {
        this.moreMenu = popupMenuInstance.menu;
      }

      const menuItems = [];
      this.toolBarItems.not(this.more).not('.ignore-in-menu').filter(function () {
        return $(this).parent('.buttonset, .inline').length;
      }).each(function () {
        menuItems.push(self.buildMoreActionsMenuItem($(this)));
      });

      menuItems.reverse();
      $.each(menuItems, (i, item) => {
        if (item.text() !== '') {
          item.prependTo(self.moreMenu);
        }
      });

      this.defaultMenuItems = this.moreMenu.children('li:not(.separator)');
      this.hasDefaultMenuItems = this.defaultMenuItems.length > 0;

      // If no more menu attributes are directly added through settings,
      // use the toolbar's with an `actionbutton` suffix
      let moreMenuAttrs;
      if (this.settings.moreMenuSettings && Array.isArray(this.settings.moreMenuSettings.attributes)) {
        moreMenuAttrs = this.settings.moreMenuSettings.attributes;
      }
      if ((!moreMenuAttrs || !moreMenuAttrs.length) && Array.isArray(this.settings.attributes)) {
        moreMenuAttrs = this.settings.attributes.map((attr) => {
          const value = `${attr.value}-actionbutton`;
          return {
            name: attr.name,
            value
          };
        });
      }
      if (!moreMenuAttrs?.length) {
        moreMenuAttrs = null;
      }

      // Setup an Event Listener that will refresh the contents of the More Actions
      // Menu's items each time the menu is opened.
      const menuButtonSettings = utils.extend({}, this.settings.moreMenuSettings, {
        trigger: 'click',
        menu: this.moreMenu,
        attributes: moreMenuAttrs
      }, (this.hasDefaultMenuItems ? { predefined: this.defaultMenuItems } : {}));
      if (popupMenuInstance) {
        this.more
          .on('beforeopen.toolbar-flex', () => {
            self.refreshMoreActionsMenu(self.moreMenu);
          })
          .triggerHandler('updated', [menuButtonSettings]);
      } else {
        this.more.popupmenu(menuButtonSettings).on('beforeopen.toolbar-flex', () => {
          self.refreshMoreActionsMenu(self.moreMenu);
        });
      }
    }

    // Check for a focused item
    if (!this.settings.allowTabs) {
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
      if (this.focusedItem) {
        this.focusedItem.focused = true;
      }
    }

    this.render();
    this.handleEvents();
  },

  /**
   * Builds a single "More Actions Menu" item from a source toolbar item.
   * Also sets up linkage between the menu item and the original toolbar item to
   * allow events/properties to propagate when the More Actions item is acted upon.
   * @private
   * @param {jQuery[]} item the source item from the toolbar.
   * @returns {jQuery[]} a jQuery-wrapped <li> representing a More Actions menu
   *  implementation of the toolbar item.
   */
  buildMoreActionsMenuItem(item) {
    const isSplitButton = false;
    let popupLi;

    // If this item should be skipped, just return out
    if (item.data('skipit') === true) {
      item.data('skipit', undefined);
      return popupLi;
    }

    // Attempt to re-use an existing <li>, if possible.
    // If a new one is created, setup the linkage between the original element and its
    // "More Actions" menu counterpart.
    let a = item.data('action-button-link');

    if (!a || !a.length) {
      popupLi = $('<li></li>');
      a = $('<a href="#"></a>').appendTo(popupLi);

      // Setup data links between the buttons and their corresponding list items
      item.data('action-button-link', a);
      a.data('original-button', item);
    } else {
      popupLi = a.parent();
    }

    // Refresh states
    if (item.hasClass('hidden')) {
      popupLi.addClass('hidden');
    }
    if (item.is(':disabled')) {
      popupLi.addClass('is-disabled');
      a.prop('disabled', true);
    } else {
      popupLi.removeClass('is-disabled');
      a.prop('disabled', false);
    }

    // Refresh Text
    a.text(this.getItemText(item));

    // Pass along any icons except for the dropdown (which is added as part of the submenu design)
    const submenuDesignIcon = $.getBaseURL('#icon-dropdown');
    const icon = item.children('.icon').filter(function () {
      const iconName = $(this).getIconName();
      return iconName && iconName !== submenuDesignIcon && iconName.indexOf('dropdown') === -1;
    });

    if (icon && icon.length) {
      a.html(`<span>${a.text()}</span>`);
      icon.clone().detach().prependTo(a);
    }

    const linkspan = popupLi.find('b');
    if (linkspan.length) {
      this.moreMenu.addClass('has-icons');
      linkspan.detach().prependTo(popupLi);
    }

    function addItemLinksRecursively(menu, diffMenu, parentItem) {
      const children = menu.children('li');
      const id = diffMenu.attr('id');

      diffMenu.children('li').each((i, diffMenuItem) => {
        const dmi = $(diffMenuItem); // "Diffed" Menu Item
        const omi = children.eq(i); // Corresponding "Original" menu item
        const dmiA = dmi.children('a'); // Anchor inside of "Diffed" menu item
        const omiA = omi.children('a'); // Anchor inside of "Original" menu item
        const dmiID = dmi.attr('id');
        const dmiAID = dmiA.attr('id');

        // replace menu item ids with spillover-menu specific ids.
        if (dmiID) {
          dmi.removeAttr('id').attr('data-original-menu-item', dmiID);
        }
        if (dmiAID) {
          dmiA.removeAttr('id').attr('data-original-menu-anchor', dmiAID);
        }

        omiA.data('action-button-link', dmiA);
        dmiA.data('original-button', omiA);

        const omiSubMenu = omi.children('.wrapper').children('.popupmenu');
        const dmiSubMenu = dmi.children('.wrapper').children('.popupmenu');

        if (omiSubMenu.length && dmiSubMenu.length) {
          addItemLinksRecursively(omiSubMenu, dmiSubMenu, dmi);
        }

        if (isSplitButton) {
          dmi.removeClass('is-checked');
        }
      });

      diffMenu.removeAttr('id').attr('data-original-menu', id);
      parentItem.addClass('submenu');

      let appendTarget;
      if (parentItem.is(popupLi)) {
        appendTarget = parentItem.children('.wrapper');
        if (!appendTarget || !appendTarget.length) {
          appendTarget = $('<div class="wrapper"></div>');
        }
        appendTarget.html(diffMenu);
        parentItem.append(appendTarget);
      }
    }

    const index = this.toolbarItems?.not(this.more).not('.searchfield').index(item);
    if (item.is('.btn-menu')) {
      // Automatically apply attributes to menu buttons if attributes are set on the toolbar,
      // but the menubutton doesn't have them.
      // If no more menu attributes are directly added through settings,
      // use the toolbar's with an `actionbutton` suffix
      let menuBtnAttrs;
      if (this.settings.attributes && this.settings.attributes.length) {
        menuBtnAttrs = this.settings.attributes.map(attr => ({
          name: attr.name,
          value: `${attr.value}-menubutton-${index}`
        }));
      }
      if (!menuBtnAttrs?.length) {
        menuBtnAttrs = null;
      }

      if (!item.data('popupmenu')) {
        item.popupmenu({
          attributes: menuBtnAttrs
        });
      } else if (!a.children('.icon.arrow').length) {
        a.append($.createIcon({
          classes: 'icon arrow icon-dropdown',
          icon: 'dropdown'
        }));
      }

      const menu = item.data('popupmenu').menu;
      const diffMenu = menu.clone();

      addItemLinksRecursively(menu, diffMenu, popupLi);
    }

    if (item.is('[data-popdown]')) {
      item.popdown();
    }

    return popupLi;
  },

  /**
   * Gets the complete text contnts of a Toolbar Item, in order to create its
   * corresponding "more actions" menu item.
   *
   * Order of operations for populating the List Item text:
   * 1. span contents (.audible), then
   * 2. button title attribute, then
   * 3. tooltip text (if applicable)
   * @param {jQuery[]} item the item being evaluated.
   * @returns {string} the complete text representation.
   */
  getItemText(item) {
    if (!item) {
      return '';
    }
    const span = item.find('span').first();
    const title = item.attr('title');
    const tooltip = item.data('tooltip');
    const tooltipText = tooltip && typeof tooltip.content === 'string' ? tooltip.content : undefined;
    let popupLiText;

    if (title !== '' && title !== undefined) {
      popupLiText = title;
    } else if (tooltipText) {
      popupLiText = tooltipText;
    } else if (span.length) {
      popupLiText = span.text();
    } else {
      popupLiText = item.text();
    }

    // return xssUtils.stripHTML(popupLiText);
    return popupLiText;
  },

  /**
   * Refreshes the More Actions Menu items' text content, icons, states, and submenu content
   * based on changes made directly to their counterpart elements in the Toolbar.  Can also
   * optionally refresh only part of the menu.
   * @param {jQuery[]} menu the menu/submenu to be refreshed.
   */
  refreshMoreActionsMenu(menu) {
    const self = this;

    $('li > a', menu).each(function () {
      const a = $(this);
      const li = a.parent();
      const item = a.data('originalButton');
      let itemParent;
      const text = self.getItemText(item);
      let submenu;

      if (item) {
        if (a.find('span').length) {
          a.find('span').text(text.trim());
        } else {
          a.text(text.trim());
        }

        if (item.parent().is('.is-disabled') || item.is(':disabled')) { // if it's disabled menu item, OR a disabled menu-button
          li.addClass('is-disabled');
          a.prop('disabled', true);
          a.attr('tabindex', '-1');
        } else {
          li.removeClass('is-disabled');
          a.prop('disabled', false);
        }

        if (item.is('a')) {
          itemParent = item.parent('li');

          if (itemParent.is('.is-checked')) {
            li.addClass('is-checked');
          } else {
            li.removeClass('is-checked');
          }
        }

        if (item.is('.btn-menu')) {
          submenu = a.parent().find('.popupmenu').first();
          self.refreshMoreActionsMenu(submenu);
        }
      }
    });
  },

  /**
   * Renders the buttons based on the width of the current buttonset
   */
  renderButtonSet() {
    if (!this.jQueryEl.hasClass('contextual-toolbar')) return;

    function isItemOverflowed(item) {
      const isRTL = Locale.isRTL();
      const itemRect = item.getBoundingClientRect();
      const buttonsetRect = item.parentElement.getBoundingClientRect();
      const itemOutsideXEdge = isRTL ? (itemRect.left <= buttonsetRect.left) :
        (itemRect.right >= buttonsetRect.right || itemRect.right);
      const itemBelowYEdge = itemRect.bottom >= buttonsetRect.bottom;

      return itemBelowYEdge === true || itemOutsideXEdge === true;
    }

    const isMoreThanFive = this.toolBarItems?.not('.btn-actions').length > 5;
    const targetItems = isMoreThanFive ? this.toolBarItems?.not('.btn-actions').slice(0, 5) : this.toolBarItems?.not('.btn-actions');
    targetItems.removeClass('is-overflowed');
    const overflowedItems = isMoreThanFive ? this.toolBarItems?.not('.btn-actions').slice(5) : $();
    const visibleItems = $();

    for (let i = 0; i < targetItems.length; i++) {
      if (isItemOverflowed(targetItems[i])) {
        overflowedItems.push(targetItems[i]);
      } else {
        visibleItems.push(targetItems[i]);
      }
    }

    overflowedItems.addClass('is-overflowed');

    for (let i = 0; i < visibleItems.length; i++) {
      const actionButtonLinkData = $(visibleItems[i]).data('action-button-link');
      if (actionButtonLinkData) {
        actionButtonLinkData.parent()[0].classList.add('hidden');
      }
    }

    for (let i = 0; i < overflowedItems.length; i++) {
      const actionButtonLinkData = $(overflowedItems[i]).data('action-button-link');
      if (actionButtonLinkData) {
        actionButtonLinkData.parent()[0].classList.remove('hidden');
      }
    }

    if (overflowedItems.length > 0) {
      this.more.parent().css('display', 'inline-block');
      this.more.parent().siblings('.buttonset').css('width', 'calc(55% - 41px');
    } else {
      this.more.parent().css('display', 'none');
      this.more.parent().siblings('.buttonset').css('width', 'calc(55% - 1px');
    }
  },

  /**
   * @returns {void}
   */
  render() {
    const self = this;
    this.element.setAttribute('role', 'toolbar');

    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes($(this.element), this, this.settings.attributes);
    }

    this.items.forEach((item) => {
      let sf = $(item.element);
      if (sf.is('.toolbar-searchfield-wrapper, .searchfield-wrapper')) {
        sf = sf.children('.searchfield');
      }

      if (!sf.data('searchfield') &&  sf.is('.searchfield')) {
        const searchfieldOpts = $.extend({}, utils.parseSettings(sf[0]));

        if (this.settings.collapsibleFilter) {
          searchfieldOpts.collapsible = this.settings.collapsibleFilter;
        }

        sf.searchfield(searchfieldOpts);

        utils.addAttributes(sf, self, self.settings.attributes, 'searchfield');
      }

      item.render();
    });
  },

  /**
   * @private
   * @returns {void}
   */
  handleEvents() {
    if (!this.settings.allowTabs) {
      this.keydownListener = this.handleKeydown.bind(this);
      this.element.addEventListener('keydown', this.keydownListener);

      this.keyupListener = this.handleKeyup.bind(this);
      this.element.addEventListener('keyup', this.keyupListener);

      this.clickListener = this.handleClick.bind(this);
      this.element.addEventListener('click', this.clickListener);
    }

    $(this.element).on(`selected.${COMPONENT_NAME}`, (e, ...args) => {
      log('dir', args);
    });

    // Inlined Searchfields can cause navigation requiring a focus change to occur on collapse.
    $(this.element).on(`collapsed-responsive.${COMPONENT_NAME}`, (e, direction) => {
      e.stopPropagation();
      this.navigate(direction, null, true);
    });

    if ($(this.element).hasClass('contextual-toolbar')) {
      $(this.element).on(`recalculate-buttonset.toolbar-flex-${this.uniqueId}`, () => {
        this.renderButtonSet();
      });

      this.more.on(`beforeopen.buttonset.toolbar-flex-${this.uniqueId}`, () => {
        this.renderButtonSet();
      });

      $('body').on(`resize.toolbar-flex-${this.uniqueId}`, () => {
        this.renderButtonSet();
      });
    }
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
    }
  },

  /**
   * Event Handler for internal `keydown` events, specifically on Toolbar Items.
   * @private
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleItemKeydown(e) {
    const isRTL = Locale.isRTL();
    const key = e.key;
    const item = this.getItemFromElement(e.target);
    function preventScrolling() {
      e.preventDefault();
    }

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

    // Left Navigation
    const leftNavKeys = ['ArrowLeft', 'Left', 'ArrowUp', 'Up'];
    if (leftNavKeys.indexOf(key) > -1) {
      if (item.type === 'searchfield' && (key === 'ArrowLeft' || key === 'Left')) {
        return;
      }
      this.navigate((isRTL ? 1 : -1), undefined, true);
      preventScrolling();
      return;
    }

    // Right Navigation
    const rightNavKeys = ['ArrowRight', 'Right', 'ArrowDown', 'Down'];
    if (rightNavKeys.indexOf(key) > -1) {
      if (item.type === 'searchfield' && (key === 'ArrowRight' || key === 'Right')) {
        return;
      }
      this.navigate((isRTL ? -1 : 1), undefined, true);
      preventScrolling();
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
    const item = this.getItemFromElement(e.target);

    this.select(item);
    this.focusedItem = item;
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
    const thisElems = utils.getArrayFromList(this.element.querySelectorAll(allSelectors));

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
   * @param {HTMLElement|ToolbarFlexItem} element the element to be checked
   * @returns {ToolbarFlexItem} an instance of a Toolbar item
   */
  getItemFromElement(element) {
    if (element instanceof ToolbarFlexItem || element.isToolbarFlexItem) {
      return element;
    }

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
   * @readonly
   * @returns {Array<HTMLElement>} references to all Toolbar sections labelled "buttonset"
   */
  get buttonsets() {
    return this.sections.filter(el => el.classList.contains('buttonset'));
  },

  /**
   * @readonly
   * @returns {Array<ButtonSet>} references to all Toolbar Section buttonset APIs
   */
  get buttonsetAPIs() {
    return this.buttonsets.map(e => $(e).data('buttonset'));
  },

  /**
   * If this toolbar contains a searchfield, this alias returns a reference to its ComponentAPI property.
   * If no searchfield exists, it returns `undefined`
   * @returns {Searchfield|undefined} a reference to the componentAPI of the searchfield item.
   */
  get searchfieldAPI() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].type === 'searchfield') {
        return this.items[i].componentAPI;
      }
    }
    return undefined;
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

  /**
   * Sets the currently focused item
   * @param {ToolbarFlexItem} item the item to be focused
   */
  set focusedItem(item) {
    if (this.items.length === 0) {
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].settings.allowTabs) {
        this.items[i].focused = true;
      } else {
        this.items[i].focused = false;
      }
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
   * @returns {boolean} determining whether or not the Flex Toolbar has the authority to currently control focus
   */
  get canManageFocus() {
    const activeElement = document.activeElement;
    if (this.element.contains(activeElement)) {
      return true;
    }

    // If the searchfield currently has focus, return true
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].type === 'searchfield' && this.items[i].componentAPI.isFocused) {
        return true;
      }
    }

    if (activeElement.tagName === 'BODY') {
      return true;
    }

    return false;
  },

  /**
   * @returns {ToolbarFlexItem[]} all overflowed items in the toolbar
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

    // reference the original direction for later, if placement fails.
    const originalDirection = 0 + direction;

    if (currentIndex === undefined || currentIndex === null) {
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
      this.navigate(originalDirection > 0 ? 1 : -1, currentIndex, doSetFocus);
      return;
    }

    if (this.focusedItem === targetItem && this.items.length === 1) {
      return;
    }

    // Retain a reference to the focused item and set focus, if applicable.
    this.focusedItem = targetItem;
    if (doSetFocus && this.canManageFocus) {
      this.focusedItem.element.focus();
    }
  },

  /**
   * @param {HTMLElement|ToolbarFlexItem} element an HTMLElement representing a
   *  Toolbar Item, or an actual ToolbarFlexItem API to use.
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
   * Exports everything in the current `items` array as Popupmenu-friendly data to be
   * converted to menu items.
   * NOTE: Searchfields and other Action Buttons are ignored
   * @returns {object} containing JSON-friendly Popupmenu data
   */
  toPopupmenuData() {
    const data = {
      noMenuWrap: true
    };

    function getItemData(item) {
      const itemData = item.toPopupmenuData();

      if (itemData) {
        // Pass along some properties to the top level data object
        if (itemData.icon) {
          data.hasIcons = true;
        }
        if (itemData.selectable) {
          data.selectable = itemData.selectable;
        }
      }
      return itemData;
    }

    data.menu = this.items.filter((item) => {
      if (item.type === 'actionbutton' || item.type === 'searchfield') {
        return false;
      }
      return true;
    }).map(item => getItemData(item));

    return data;
  },

  /**
   * Exports everything in the current `items` array as a Flex Toolbar object structure
   * @returns {object} containing JSON-friendly Flex Toolbar data
   */
  toData() {
    const data = {};
    data.items = this.items.map(item => item.toData());
    return data;
  },

  get disabled() {
    return this.trueDisabled;
  },

  set disabled(bool) {
    this.trueDisabled = bool;
    if (bool === true) {
      this.element.classList.add('is-disabled');
      return;
    }
    this.element.classList.remove('is-disabled');
  },

  /**
   * Detects whether or not a toolbar item is currently overflowed.
   * @param {ToolbarFlexItem|jQuery[]|HTMLElement} item the Toolbar Item or Element to check for overlflow.
   * @returns {boolean} whether or not the item is overflowed.
   */
  isItemOverflowed(item) {
    if (!item) {
      return false;
    }

    // If we get an HTMLElement or jQuery object, rzesolve the ToolbarFlex Item
    // from either of those, if applicable. Otherwise, it's not overflowed.
    let targetItem;
    if (item instanceof HTMLElement || item instanceof $) {
      targetItem = $(item).data('toolbarflexitem');
      if (!targetItem) {
        return false;
      }
      item = targetItem;
    }

    // If this item isn't inside this toolbar, it's definitely not overflowed.
    if (this.items.indexOf(item) < 0) {
      return false;
    }

    return item.overflowed;
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
    if (!this.settings.allowTabs) {
      this.element?.removeEventListener('keydown', this.keydownListener);
      this.element?.removeEventListener('keyup', this.keyupListener);
      this.element?.removeEventListener('click', this.clickListener);
    }

    $(this.element).off(`selected.${COMPONENT_NAME}`);
    $(this.element).off(`collapsed-responsive.${COMPONENT_NAME}`);

    if ($(this.element).hasClass('contextual-toolbar')) {
      $(this.element).off(`recalculate-buttonset.toolbar-flex-${this.uniqueId}`);
      this.more.off(`beforeopen.buttonset.toolbar-flex-${this.uniqueId}`);
      $('body').off(`resize.toolbar-flex-${this.uniqueId}`);
    }

    this.items.forEach((item) => {
      item.teardown();
    });

    delete this.items;
    delete this.sections;
    delete this.trueFocusedItem;
  },

  /**
   * Do full destroy and remove children popup menus
   * @returns {void}
   */
  destroy() {
    this.items.forEach((item) => {
      item.destroy();
    });
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
