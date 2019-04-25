import * as debug from '../../utils/debug';
import { Environment as env } from '../../utils/environment';
import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { DOM } from '../../utils/dom';
import { PlacementObject, Place } from '../place/place';

// jQuery Components
import '../place/place.jquery';

// Component Name
const COMPONENT_NAME = 'popupmenu';

/**
 * Responsive Popup Menu Control aka Context Menu when doing a right click action.
 * @class PopupMenu
 * @param {jquery[]|htmlelement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string} [settings.menu]  Menu's ID Selector, or a jQuery object representing a menu.
 * @param {string} [settings.trigger='click']  Action on which to trigger a menu can be: click, rightClick, immediate ect.
 * @param {boolean} [settings.autoFocus=true]  If false the focus will not focus the first list element. (At the cost of accessibility).
 * @param {boolean} [settings.mouseFocus=true]  If false the focus will not highlight the first list element. (At the cost of accessibility).
 * @param {boolean} [settings.attachToBody=false]  If true the menu will be moved out to the body. To be used in certin overflow situations.
 * @param {function} [settings.beforeOpen]  Callback that can be used for populating the contents of the menu.
 * @param {string} [settings.ariaListbox=false]   Switches aria to use listbox construct instead of menu construct (internal).
 * @param {string} [settings.eventObj]  Can pass in the event object so you can do a right click with immediate.
 * @param {string} [settings.triggerSelect]  If false select event will not be triggered.
 * @param {string} [settings.removeOnDestroy] Dispose of the menu from the DOM on destroy
 * @param {string} [settings.showArrow]  If true you can explicitly set an arrow on the menu.
 * @param {boolean|function} [settings.returnFocus]  If set to false, focus will not be
  returned to the calling element. Can also be defined as a callback that can determine how
  to return focus.  It usually should be for accessibility purposes.
 * @param {object} [settings.placementOpts=new PlacementObject({
   containerOffsetX: 10,
   containerOffsetY: 10,
   strategies: ['flip', 'shrink']
})] Gets passed to this control's Place behavior.
 * @param {object} [settings.offset={x: 0, y: 0}] Can tweak the menu position in the x and y direction. Takes an object of form: `{x: 0, y: 0}`.
 * @param {jQuery[]} [settings.predefined=$()] containing references to menu items that should be passed to the "predefined" hash.
 */

const POPUPMENU_DEFAULTS = {
  menu: null,
  trigger: 'click',
  autoFocus: true,
  mouseFocus: true,
  attachToBody: false,
  removeOnDestroy: false,
  beforeOpen: null,
  ariaListbox: false,
  eventObj: undefined,
  returnFocus: true,
  showArrow: null,
  triggerSelect: true,
  placementOpts: new PlacementObject({
    containerOffsetX: 10,
    containerOffsetY: 10,
    strategies: ['flip', 'shrink']
  }),
  offset: {
    x: 0,
    y: 0
  },
  predefined: $(),
  duplicateMenu: null
};

function PopupMenu(element, settings) {
  this.settings = utils.mergeSettings(element, settings, POPUPMENU_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

PopupMenu.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.addMarkup();
    this.handleEvents();
    this.iconFilteringSetup();

    // Allow for an external click event to be passed in from outside this code.
    // This event can be used to pass clientX/clientY coordinates for mouse cursor positioning.
    if (this.settings.trigger === 'immediate') {
      this.open(this.settings.eventObj);
    }

    // Use some css rules on submenu parents
    if (this.menu.find('.submenu').length) {
      this.menu.addClass('has-submenu');
    }
  },

  /**
   * Checks whether or not Right-To-Left reading mode is active.
   * @private
   * @returns {boolean} whether or not the reading/writing direction is RTL
   */
  isRTL() {
    return env.rtl;
  },

  /**
   * @returns {boolean} whether or not the popupmenu is currently open
   */
  get isOpen() {
    return DOM.hasClass(this.element[0], 'is-open');
  },

  /**
   * @private
   * @returns {void}
   */
  setup() {
    if (this.element.attr('data-popupmenu') && !this.settings.menu) {
      this.settings.menu = this.element.attr('data-popupmenu').replace(/#/g, '');
    }
    // Backwards compatibility for "menuId" menu options coming from other controls
    // that utilize the Popupmenu.
    if (this.settings.menuId) {
      this.settings.menu = this.settings.menuId;
      this.settings.menuId = undefined;
    }

    // keep track of how many popupmenus there are with an ID.
    // Used for managing events that are bound to $(document)
    if (!this.id) {
      this.id = (parseInt($('.popupmenu-wrapper').length, 10) + 1).toString();
    }

    // Set a reference collection for containing "pre-defined" menu items that should never
    // be replaced during an AJAX call.
    this.predefinedItems = $().add(this.settings.predefined);
  },

  /**
   * Add markip including Aria
   * @private
   * @returns {void}
   */
  addMarkup() {
    let id;
    let duplicateMenu;
    let triggerId;

    switch (typeof this.settings.menu) {
      case 'string': // ID Selector
        id = this.settings.menu;
        this.menu = $(`#${this.settings.menu}`);

        // duplicate menu if shared by multiple triggers
        if (this.settings.duplicateMenu && this.settings.attachToBody && this.menu.parent().not('body').length > 0) {
          this.menu.data('trigger', this.element);
          triggerId = this.menu.data('trigger')[0].id;
          duplicateMenu = this.menu.clone();
          duplicateMenu.detach().appendTo('body');

          // add data-id attr to menus
          duplicateMenu.attr('data-trigger', triggerId);
          this.menu.attr('data-trigger', triggerId);
        }
        break;
      case 'object': // jQuery Object
        if (this.settings.menu === null) {
          this.menu = this.element.next('.popupmenu, .popupmenu-wrapper');
        } else {
          this.menu = $(this.settings.menu);
        }

        id = this.menu.attr('id');
        if (!id || id === '') {
          this.menu.attr('id', `popupmenu-${this.id}`);
          id = this.menu.attr('id');
        }
        break;
      default:
        break;
    }

    // If markup already exists for the wrapper, use that instead of rebuilding.
    if (this.menu.is('.popupmenu-wrapper')) {
      this.preExistingWrapper = true;
      this.wrapper = this.menu;
      this.menu = this.wrapper.children('.popupmenu').first();
    }

    // Similar check as above, assuming the menu wasn't a popupmenu wrapper.
    if (this.menu.parent().is('.popupmenu-wrapper')) {
      this.preExistingWrapper = true;
      this.wrapper = this.menu.parent();
    }

    // If we still don't have a menu reference at this point, fail gracefully by returning out
    // and simply acting like a button.
    if (this.menu.length === 0) {
      return;
    }

    // if the menu is deeply rooted inside the markup, detach it and append it to the <body> tag
    // to prevent containment issues. (Now a Preference)
    if (this.settings.attachToBody && this.menu.parent().not('body').length > 0) {
      this.originalParent = this.menu.prev();
      this.menu.detach().appendTo('body');
      if (this.settings.duplicateMenu) {
        this.menu.attr('id', `${this.settings.menu}-original`);
      }
    }

    if (!this.menu.is('.popupmenu')) {
      this.menu.addClass('popupmenu')
        .attr('role', (this.settings.ariaListbox ? 'listbox' : 'menu'));
    }

    // Always store a reference to the trigger element under jQuery data.
    this.menu.data('trigger', this.element);

    this.wrapper = this.menu.parent('.popupmenu-wrapper');
    if (!this.wrapper.length) {
      this.wrapper = this.menu.wrap('<div class="popupmenu-wrapper"></div>');
    }

    // Invoke all icons as icons
    this.wrapper.find('svg').each(function () {
      if (!$(this).data('icon')) {
        $(this).icon();
      }
    });

    // Use "absolute" positioning on the menu insead of "fixed", only when the
    // menu lives <body> tag and we have a <body> element that is tall enough to
    // scroll and is allowed to scroll.
    function scrollableFilter() {
      const c = this ? this.style.overflow : null;
      return c !== 'auto' && c !== 'visible' && c !== 'scroll';
    }
    if (this.wrapper.parents().filter(scrollableFilter).length === 0) {
      this.wrapper[0].style.position = 'absolute';
    }

    // Wrap submenu ULs in a 'wrapper' to help break it out of overflow.
    this.menu.find('.popupmenu').each((i, elem) => {
      const popup = $(elem);

      if (!(popup.parent().hasClass('wrapper'))) {
        popup.wrap('<div class="wrapper"></div>');
      }
    });

    // If the trigger element is a button with no border append arrow markup
    const containerClass = this.element.parent().attr('class');
    if ((this.element.hasClass('btn-menu') ||
        this.element.hasClass('btn-actions') ||
        this.element.hasClass('btn-icon') && this.element.find('use').attr('xlink:href') === '#icon-more' ||
        this.settings.menu === 'colorpicker-menu' ||
        this.element.closest('.toolbar').length > 0 ||
        this.element.closest('.masthead').length > 0 ||
        this.element.is('.searchfield-category-button') ||
        (containerClass && containerClass.indexOf('more') >= 0) ||
        containerClass && containerClass.indexOf('btn-group') >= 0) || this.settings.showArrow) {
      const arrow = $('<div class="arrow"></div>');
      const wrapper = this.menu.parent('.popupmenu-wrapper');

      wrapper.addClass('bottom').append(arrow);
    }

    // If inside of a ".field-short" container, make smaller
    const addFieldShort = this.element.closest('.field-short').length;
    this.menu[addFieldShort ? 'addClass' : 'removeClass']('popupmenu-short');

    // If button is part of a header/masthead or a container using the "alternate"
    // UI color, add the "alternate" class.
    if (containerClass !== undefined &&
      (this.element.closest('.masthead').not('.search-results .masthead').length > 0)) {
      this.menu.parent('.popupmenu-wrapper').addClass('inverse');
    }

    this.element.attr('aria-haspopup', true);
    this.element.attr('aria-controls', id);

    this.markupItems();

    // Unhide the menu markup, if hidden
    if (this.menu.is('.hidden')) {
      this.menu.removeClass('hidden');
    }
  },

  /**
   * Renders a menu item in the UI.
   * @private
   * @param {object|object[]} settings JSON-friendly object that represents a popupmenu item, or array of items.
   * @param {string} [settings.id] adds an ID to the item's anchor tag
   * @param {boolean} [settings.separator=false] causes this menu item to be a separator (overrides everything else)
   * @param {string} [settings.heading=""] Produces a heading element after a separator with text content.
   * @param {string} [settings.nextSectionSelect] can be null, "single", or "multiple"
   * @param {string} settings.text contains the text that will be displayed.
   * @param {string|null} [settings.icon=null] applies an icon to the menu item
   * @param {string|null} [settings.selectable] can be null, "single", or "multiple"
   * @param {boolean} [settings.disabled=false] causes the item to be disabled.
   * @param {object[]} [settings.submenu] array of settings object contstructed just like this one, that represent submenu items.
   * @param {boolean} [settings.noMenuWrap=false] if true, causes multiple top-level menu items not to be wrapped by a `<ul class="popupmenu"></ul>`
   * @returns {string} HTML representing a Popupmenu item with the settings passed.
   */
  renderItem(settings) {
    if (settings === undefined) {
      return '';
    }

    const self = this;
    function wrapMenuItems(settingsArr) {
      let items = '';
      settingsArr.forEach((menuObj) => {
        items += self.renderItem(menuObj);
      });
      return items;
    }

    // Top-level arrays run this method on each sub-item.
    if (Array.isArray(settings)) {
      const items = wrapMenuItems(settings);
      const template = `<ul class="popupmenu">${items}</ul>`;
      return stringUtils.stripWhitespace(template);
    }

    let headingText = '';
    let sectionSelectClass = '';

    // separators get rendered out first
    if (settings.separator !== undefined) {
      if (settings.heading) {
        headingText += `<li class="heading">${settings.heading}</li>`;
      }
      if (settings.nextSectionSelect === 'single' || settings.nextSectionSelect === 'multiple') {
        sectionSelectClass = ` ${settings.nextSectionSelect}`;
      }

      return stringUtils.stripWhitespace(`
        <li class="separator${sectionSelectClass}"></li>
        ${headingText}
      `);
    }

    // Top-level Menus can have settings.
    // Handle an object-based settings with a `menu` definition here
    if (settings.menu) {
      let menuId = '';
      if (settings.menuId) {
        menuId = ` id="${settings.menuId}"`;
      }

      let iconsClass = '';
      if (settings.hasIcons) {
        iconsClass += ' has-icons';
      }

      let items = '';
      if (Array.isArray(settings.menu)) {
        items = wrapMenuItems(settings.menu);
      }

      if (settings.noMenuWrap) {
        return items;
      }

      return stringUtils.stripWhitespace(`
        <ul${menuId} class="popupmenu${iconsClass}">
          ${items}
        </ul>
      `);
    }

    let disabledClass = '';
    let hiddenClass = '';
    let icon = '';
    let id = '';
    let selectableClass = '';
    let submenuClass = '';
    let submenu = '';
    let ddicon = '';

    if (settings.disabled) {
      disabledClass += ' is-disabled';
    }

    if (settings.visible === false) {
      hiddenClass += ' hidden';
    }

    if (settings.id) {
      id = ` id="${settings.id}"`;
    }

    if (settings.selectable === 'single') {
      selectableClass += ' is-selectable';
    }

    if (settings.selectable === 'multiple') {
      selectableClass += ' is-multiselectable';
    }

    if (settings.icon) {
      icon = `<svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-${settings.icon}"></use>
      </svg>`;
    }

    if (Array.isArray(settings.submenu)) {
      submenuClass += ' submenu';
      submenu += this.renderItem(settings.submenu);
      ddicon += `<svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-dropdown"></use>
      </svg>`;
    }

    return stringUtils.stripWhitespace(`<li${id} class="popupmenu-item${disabledClass}${hiddenClass}${selectableClass}${submenuClass}">
      <a${id} href="#">${icon}<span>${settings.text}</span>
        ${ddicon}
      </a>
      ${submenu}
    </li>`);
  },

  /**
   * Converts the contents of a popupmenu or submenu to a JSON-friendly object structure.
   * @private
   * @param {object} [settings={}] incoming conversion settings
   * @param {jQuery[]|HTMLElement} [settings.contextElement] the top-most element that will
   *  be modified (defaults to the top-level menu).
   * @param {boolean} [settings.noMenuWrap] if true, will pass an array as the top-level data instead
   *  of an object with a `menu` property.
   * @returns {object|object[]} an object representation of this popupmenu's current state.
   */
  toData(settings) {
    let data = {};
    const menu = [];

    settings = settings || {};

    // Figure out Context Element
    if (!settings.contextElement) {
      settings.contextElement = this.menu;
    }
    if (settings.contextElement instanceof HTMLElement) {
      settings.contextElement = $(settings.contextElement);
    }
    if (settings.contextElement.is('.popupmenu-wrapper')) {
      settings.contextElement = settings.contextElement.children('ul');
    }

    const menuId = `${settings.contextElement.attr('id')}`;
    if (menuId) {
      data.menuId = menuId;
    }

    const hasIcons = settings.contextElement.hasClass('has-icons');
    data.hasIcons = hasIcons;

    if (settings.noMenuWrap) {
      data = menu;
    } else {
      data.menu = menu;
    }

    function decodeListItem(item) {
      const li = $(item);
      const liData = {};

      // Ignore headings, which are included as part of separators inside data
      if (li.hasClass('heading')) {
        return undefined;
      }

      // separators include different metadata
      if (li.hasClass('separator')) {
        liData.separator = true;

        if (li.hasClass('single-selectable-section')) {
          liData.nextSectionSelect = 'single';
        }
        if (li.hasClass('multi-selectable-section')) {
          liData.nextSectionSelect = 'multiple';
        }

        const next = li.next();
        if (next.hasClass('heading')) {
          liData.heading = next.text().trim();
        }

        return liData;
      }

      const a = li.children('a');
      const icon = a.children('.icon:not(.close):not(.icon-dropdown)');
      const id = a.attr('id');

      liData.text = a.text().trim();
      liData.disabled = li.hasClass('is-disabled');
      liData.visible = !li.hasClass('hidden');

      if (typeof id === 'string' && id.length) {
        liData.id = id;
      }

      if (icon.length && (icon[0] instanceof SVGElement)) {
        liData.icon = icon[0].querySelector('use').getAttribute('xlink:href').replace('#icon-', '');
      }

      if (li.hasClass('is-selectable')) {
        liData.selectable = 'single';
      } else if (li.hasClass('is-multiselectable')) {
        liData.selectable = 'multiple';
      }

      const submenu = li.find('.popupmenu');
      if (submenu.length) {
        liData.submenu = [];
        submenu.first().children().each((i, submenuItem) => {
          const submenuLiData = decodeListItem(submenuItem);
          if (!submenuLiData) {
            return;
          }
          liData.submenu.push(submenuLiData);
        });
      }

      return liData;
    }

    const lis = settings.contextElement.children('li');
    lis.each((i, item) => {
      const liData = decodeListItem(item);
      if (!liData) {
        return;
      }
      menu.push(liData);
    });

    return data;
  },

  /**
   * Marks up menu items in the UI
   * @private
   * @param {jQuery[]|HTMLElement} [contextElement] the top-most element that will
   *  be modified (defaults to the top-level menu).
   * @returns {void}
   */
  markupItems(contextElement) {
    const self = this;

    if (!contextElement) {
      contextElement = this.menu;
    } else if (contextElement instanceof HTMLElement) {
      contextElement = $(contextElement);
    }

    const lis = contextElement.find('li:not(.heading):not(.separator)');
    let hasIcons = false;
    contextElement[0].setAttribute('role', 'menu');

    lis.each((i, li) => {
      const a = $(li).children('a')[0]; // TODO: do this better when we have the infrastructure
      let span = $(a).children('span')[0];
      let submenu = $(li).children('ul')[0];
      const icon = $(li).find('.icon:not(.close):not(.icon-dropdown)');
      const submenuWrapper = $(li).children('.wrapper')[0];

      li.setAttribute('role', (self.settings.ariaListbox ? 'option' : 'menuitem'));

      if (a) {
        a.setAttribute('tabindex', '-1');

        // disabled menu items, by prop and by className
        const $a = $(a);
        const $li = $(li);

        if ($li.hasClass('is-disabled') || (a.getAttribute('disabled') === 'true' || a.getAttribute('disabled') === 'disabled')) {
          $li.addClass('is-disabled');
          a.setAttribute('aria-disabled', 'true');
          a.setAttribute('disabled', true);
        } else {
          $li.removeClass('is-disabled');
          $a.removeAttr('aria-disabled');
          a.removeAttribute('disabled');
        }

        // menu items that contain submenus
        if (submenu instanceof HTMLElement) {
          submenu.classList.add('popupmenu');
        }
        if (submenuWrapper instanceof HTMLElement) {
          li.className += `${DOM.classNameExists(li) ? ' ' : ''}submenu`;
          submenu = $(submenuWrapper).children('ul')[0];
          submenu.classList.add('popupmenu');
        }
        if (DOM.hasClass(li, 'submenu')) {
          // Add a span
          if (!span) {
            a.innerHTML = `<span>${a.innerHTML}</span>`;
            span = $a.children('span')[0];
          }

          if ($a.find('svg.arrow').length === 0) {
            $a.append($.createIconElement({ classes: ['arrow', 'icon-dropdown'], icon: 'dropdown' }));
          }
          a.setAttribute('aria-haspopup', 'true');

          // Check for existing menus, and if present, apply a `.popupmenu` class automatically.
        }

        // is-checked
        if (DOM.hasClass(li, 'is-checked')) {
          a.setAttribute('role', 'menuitemcheckbox');
          a.setAttribute('aria-checked', true);
        }

        // is-not-checked
        if (DOM.hasClass(li, 'is-not-checked')) {
          li.className = li.className.replace('is-not-checked', '');
          a.setAttribute('role', 'menuitemcheckbox');
          a.removeAttribute('aria-checked');
        }
      }

      if (icon && icon.length > 0) {
        hasIcons = true;
      }
    });

    if (hasIcons) {
      contextElement.addClass('has-icons');
    } else {
      contextElement.removeClass('has-icons');
    }
  },

  /**
   * Takes a pre-existing menu item and refreshes its state.
   * @private
   * @param {HTMLElement} item the menu item to be refreshed
   * @param {object} data representing a Popupmenu data structure, containing updated state information
   * @param {function} [callback] runs on completion of the item refresh.  Can be used for adding additional
   *  important flags/properties to the Menu Item for a specific implementation.
   * @returns {void}
   */
  refreshMenuItem(item, data, callback) {
    if (!item || !(item instanceof HTMLElement) || !data) {
      return;
    }

    // Don't refresh the menu item if it doesn't belong to this menu
    if (!$(this.menu)[0].contains(item)) {
      return;
    }

    const itemA = item.querySelector('a');
    const itemIcon = item.querySelector('.icon:not(.close):not(.icon-dropdown)');
    let itemIconUse;

    if (data.text) {
      if (itemA.innerText.trim() !== data.text) {
        itemA.innerText = `${data.text}`;
      }
    }

    if (data.disabled === true) {
      if (item.className.indexOf('hidden') === -1) {
        item.classList.add('is-disabled');
      }
    } else if (item.className.indexOf('is-disabled') > -1) {
      item.classList.remove('is-disabled');
    }

    if (data.visible === true) {
      if (item.className.indexOf('hidden') > -1) {
        item.classList.remove('hidden');
      }
    } else if (item.className.indexOf('hidden') === -1) {
      item.classList.add('visible');
    }

    if (data.icon) {
      // TODO: fragile?
      if (itemIcon) {
        itemIconUse = itemIcon.querySelector('use');
        if (itemIconUse && itemIconUse.getAttribute('xlink:href').replace('#icon-', '') !== data.icon) {
          itemIcon.remove();
        }
        itemIconUse.setAttribute('xlink:href', `#icon-${data.icon}`);
      } else {
        // TODO: Create icon element and append
      }
    } else if (itemIcon) {
      itemIcon.remove();
    }

    // TODO: Submenus
    // Build so the submenu data structure is used to rerun this method against each submenu item.
    if (data.submenu) {
      const submenuItems = item.querySelector('.popupmenu').children;
      for (let i = 0; i < data.submenu.length; i++) {
        data.submenu[i].isSubmenuItem = true;
        this.refreshMenuItem(submenuItems.item(i), data.submenu[i], callback);
      }
    }

    // Run callback to apply additional refresh changes, if applicable.
    if (typeof callback === 'function') {
      callback.apply(this, [item, data]);
    }
  },

  /**
   * Sets up the event listener structure for the popupmenu
   * @private
   * @listens dragstart
   * @listens contextmenu
   * @listens keydown
   * @listens updated
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const leftClick = this.settings.trigger !== 'rightClick';
    const immediate = this.settings.trigger === 'immediate';

    function disableBrowserContextMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    function doOpen(e) {
      if (self.element.hasClass('is-disabled')) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      const rightClick = self.settings.trigger === 'rightClick';

      e.stopPropagation();
      e.preventDefault();

      if (rightClick && self.menu.hasClass('is-open')) {
        self.close();
        self.open(e);
        return;
      }

      if (self.menu.hasClass('is-open')) {
        self.close();
      } else {
        self.open(e);
      }
    }

    function contextMenuHandler(e, isLeftClick) {
      e.preventDefault();

      if (self.keydownThenClick) {
        delete self.keydownThenClick;
        return;
      }

      const btn = isLeftClick === true ? 0 : 2;
      if (e.button > btn || self.element.is(':disabled')) {
        return;
      }

      const allowedOS = ['android', 'ios'];
      if (allowedOS.indexOf(env.os.name) > -1) {
        self.holdingDownClick = true;
      }

      doOpen(e);
    }

    if (!immediate) {
      // Left-Click activation
      if (leftClick) {
        this.element
          .on('click.popupmenu', (e) => {
            contextMenuHandler(e, true);
          });
      }

      // Right-Click activation
      if (!leftClick) {
        this.menu.parent().on('contextmenu.popupmenu', disableBrowserContextMenu);

        const disallowedOS = ['android', 'ios'];
        if (disallowedOS.indexOf(env.os.name) === -1) {
          // Normal desktop operation
          this.element
            .on('contextmenu.popupmenu', (e) => {
              disableBrowserContextMenu(e);
              contextMenuHandler(e);
            });
        } else {
          // Touch-based operation on a mobile device
          this.element
            .on('touchstart.popupmenu', (e) => {
              // iOS needs this prevented to prevent its own longpress feature in Safari
              if (env.os.name === 'ios') {
                e.preventDefault();
              }
              $(e.target)
                .addClass('longpress-target');
            })
            .on('touchend.popupmenu', (e) => {
              $(e.target)
                .removeClass('longpress-target');
            })
            .on('longpress.popupmenu', (e, originalE) => {
              self.openedWithTouch = true;
              contextMenuHandler(originalE);
            });
        }
      }
    }

    // Disable dragging text to a new browser tab
    this.menu.off('dragstart.popupmenu').on('dragstart.popupmenu', 'a', () => false);

    // Setup these next events no matter what trigger type is
    this.element.not('.autocomplete, ul')
      .on('keydown.popupmenu', (e) => {
        switch (e.which) {
          case 13:
          case 32:
            if (self.settings.trigger === 'click') {
              self.keydownThenClick = true;
              self.open(e);
            }
            break;
          case 121:
            if (e.shiftKey) { // Shift F10
              self.open(e);
            }
            break;
          default:
            break;
        }
      })
      .on('updated.popupmenu', (e, settings) => {
        e.stopPropagation();
        self.updated(settings);
      });
  },

  handleKeys() {
    const self = this;
    // http://access.aol.com/dhtml-style-guide-working-group/#popupmenu

    // Handle Events in Anchors
    this.menu.on('click.popupmenu', 'li', function (e) {
      const a = $(this).find('a');
      self.handleItemClick(e, a);
    });

    const excludes = 'li:not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled):not(.is-placeholder)';

    // Select on Focus
    if (this.settings.mouseFocus) {
      this.menu.on('mouseenter.popupmenu', 'li', function () {
        self.highlight($(this).children('a'));
      });
    }

    setTimeout(function () {
      $(document).off(`keydown.popupmenu.${this.id}`).on(`keydown.popupmenu.${this.id}`, (e) => {
        const key = e.which;

        // Close on escape
        if (key === 27) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          self.close(true);
          return false;
        }

        // Close on tab
        if (key === 9) {
          e.stopPropagation();
          self.close(true);
        }

        // Select Checkboxes
        if (key === 32) {
          e.stopPropagation();

          const target = $(e.target);
          const checkbox = target.find('input:checkbox');

          if (checkbox.length) {
            checkbox.trigger('click');
            return true;
          }

          let a = $();

          // Return here and let Tabs control handle the spacebar
          if (target.is('.tab') || target.parent().is('.tab') || target.is('.tab-more')) {
            // Spacebar acts like Enter if there aren't any checkboxes (trigger links, etc)
            e.preventDefault();
            return true;
          }

          if (target.is('li')) {
            a = target.children('a');
          }

          if (target.is('a')) {
            a = target;
          }

          if (a.length) {
            a.trigger('click');
            return true;
          }
        }

        let focus = self.menu.find(':focus');

        // Sets focus for functional testing
        if (!focus[0]) {
          focus = $(self.menu[0].querySelector('.is-focused a'));
        }

        const isPicker = (self.settings.menu === 'colorpicker-menu');
        const isAutocomplete = self.element.is('.autocomplete');

        // Close Submenu
        if (key === 37 && !isAutocomplete) {
          e.stopPropagation();
          e.preventDefault();

          if (focus.closest('.popupmenu')[0] !== self.menu[0] && focus.closest('.popupmenu').length > 0) {
            focus.closest('.popupmenu').removeClass('is-open').parent().parent()
              .removeClass('is-submenu-open');
            self.highlight(focus.closest('.popupmenu').parent().prev('a'));
          }
        }

        let getPrev;
        let getNext;
        let getLast;
        let getFirst;

        getPrev = function (a) { //eslint-disable-line
          const prevs = a.parent().prevAll(excludes);
          let prev;

          prevs.each(function () {
            if (prev) {
              return;
            }

            const li = $(this);
            const targetA = li.children('a');

            if (li.is('.is-disabled') || targetA.prop('disabled') === true) {
              return;
            }
            prev = targetA;
          });

          if (!prev) {
            return getFirst(a);
          }

          return prev;
        };

        getFirst = function (a) { //eslint-disable-line
          const first = a.parent().prevAll(excludes).last();
          const targetA = first.children('a');

          if (first.is('.is-disabled') || targetA.prop('disabled') === true) {
            return getNext(targetA);
          }

          return targetA;
        };

        getNext = function (a) {  //eslint-disable-line
          const nexts = a.parent().nextAll(excludes);
          let next;

          nexts.each(function () {
            if (next) {
              return;
            }

            const li = $(this);
            const targetA = li.children('a');

            if (li.is('.is-disabled') || targetA.prop('disabled') === true) {
              return;
            }
            next = targetA;
          });

          if (!next) {
            return getFirst(a);
          }

          return next;
        };

        getLast = function (a) { //eslint-disable-line
          const last = a.parent().nextAll(excludes).last();
          const targetA = last.children('a');

          if (last.is('.is-disabled') || targetA.prop('disabled') === true) {
            return getPrev(targetA);
          }

          return targetA;
        };

        // Count number of rows in picker
        let rowCount = 0;
        const colors = self.menu.children(excludes);
        const colorsLength = colors.length;
        let currentOffsetTop = 0;

        for (let i = 0; i < colorsLength; i++) {
          const colorItem = colors[i];

          if (currentOffsetTop === 0) {
            currentOffsetTop = colorItem.offsetTop;
          }

          if (colorItem.offsetTop === currentOffsetTop) {
            rowCount++;
          } else {
            break;
          }
        }

        // Up on Up
        if ((!isPicker && key === 38) || (isPicker && key === 37)) {
          e.stopPropagation();
          e.preventDefault();

          // Go back to Top on the last one
          if (focus.parent().prevAll(excludes).length === 0) {
            if (focus.length === 0) {
              self.highlight(self.menu.children(excludes).last().find('a'));
            } else {
              self.highlight(getLast(focus));
            }
            return undefined;
          }
          self.highlight(getPrev(focus));
        }

        // Up a square
        if (isPicker && key === 38) {
          e.stopPropagation();
          e.preventDefault();

          if (focus.parent().prevAll(excludes).length > 0) {
            self.highlight($(focus.parent().prevAll(excludes)[rowCount - 1]).find('a'));
          }
        }

        // Right Open Submenu
        if (key === 39 && !isAutocomplete) {
          e.stopPropagation();
          e.preventDefault();

          if (focus.parent().hasClass('submenu')) {
            self.openSubmenu(focus.parent());
            self.highlight(focus.parent().find('.popupmenu a:first'));
          }
        }

        // Down
        if ((!isPicker && key === 40) || (isPicker && key === 39 && !isAutocomplete)) {
          e.stopPropagation();
          e.preventDefault();

          // Go back to Top on the last one
          if (focus.parent().nextAll(excludes).length === 0) {
            if (focus.length === 0) {
              self.highlight(self.menu.children(excludes).first().find('a'));
            } else {
              self.highlight(getFirst(focus));
            }
            return undefined;
          }
          self.highlight(getNext(focus));
        }

        // Down a square
        if ((isPicker && key === 40)) {
          e.stopPropagation();
          e.preventDefault();

          if (focus.parent().nextAll(excludes).length > 0) {
            self.highlight($(focus.parent().nextAll(excludes)[rowCount - 1]).find('a'));
          }
        }
        return undefined;
      });
    }, 1);
  },

  /**
   * Handles the action of clicking items in the popupmenu.
   * @private
   * @param {jQuery.Event} e jQuery `click` event
   * @param {jQuery[]} anchor the anchor tag element that was clicked
   * @returns {boolean} whether or not the click handler successfully passed.
   */
  handleItemClick(e, anchor) {
    const href = anchor.attr('href');
    let selectionResult = [anchor];

    if (!e && !anchor) {
      return false;
    }

    if (anchor.parent().is('.submenu, .hidden, .is-disabled') || anchor[0].disabled) {
      // Do not close parent items of submenus on click
      e.preventDefault();
      return false;
    }

    if (anchor.find('input[checkbox]').length > 0) {
      return false;
    }

    if (this.element.hasClass('btn-filter')) {
      this.iconFilteringUpdate(anchor);
      e.preventDefault();
    }

    if (this.isInSelectableSection(anchor) || this.menu.hasClass('is-selectable') || this.menu.hasClass('is-multiselectable')) {
      selectionResult = this.select(anchor);
    }

    // Single toggle on off of checkbox class
    if (anchor.parent().hasClass('is-toggleable')) {
      anchor.parent().toggleClass('is-checked');
    }

    // Trigger a selected event containing the anchor that was selected
    // If an event object is not passed to `handleItemClick()`, assume it was due to this
    // event being triggered already, making it not necessary to re-trigger it.
    if (e && this.settings.triggerSelect) {
      if (selectionResult.length === 1) {
        selectionResult.push(undefined);
      }

      selectionResult.push(true);
      /**
       * Fires on selected.
       *
       * @event selected
       * @memberof PopupMenu
       * @property {object} event - The jquery event object
       * @property {object} selected anchor
       */
      this.element.triggerHandler('selected', selectionResult);
    }

    // MultiSelect Lists should act like other "multiselect" items and not
    // close the menu when options are chosen.
    if (this.menu.hasClass('is-multiselectable') || this.isInMultiselectSection(anchor)) {
      return true;
    }

    this.close();

    if (this.element.is('.autocomplete')) {
      return true;
    }

    if (href && href.charAt(0) !== '#') {
      if (anchor.attr('target') === '_blank') {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
      return true;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    return true;
  },

  /**
   * Filtering icon initial setup
   * @private
   * @param {jQuery[]} [alink] menu item to be targeted
   * @returns {void}
   */
  iconFilteringSetup(alink) {
    if (this.element.hasClass('btn-filter')) {
      const svg = this.element.find('svg.icon-dropdown');
      const link = alink || $('li.is-checked a', this.menu) || $('li:first a', this.menu);
      const audibleText = link.find('span').text();

      if (svg.length === 1) {
        this.element.append($.createIconElement({ classes: 'icon-dropdown', icon: 'dropdown' }));
      }

      svg.first().changeIcon(link.find('svg').getIconName());
      this.element.find('.audible').text(audibleText);
    }
  },

  /**
   * Filtering icon update
   * @private
   * @param {jQuery[]} [alink] menu item to be targeted
   * @returns {void}
   */
  iconFilteringUpdate(alink) {
    if (this.element.hasClass('btn-filter')) {
      const link = alink || $('li.is-checked a', this.menu) || $('li:first a', this.menu);
      const audibleText = link.find('span').text();

      this.element.find('.audible').text(audibleText);
      this.element.find('svg:not(.ripple-effect):first').changeIcon(link.find('svg').getIconName());
    }
  },

  /**
   * Get the event position, handling browser cases (IE,FF) as well as SVG
   * @private
   * @param {jQuery.Event} e the mouse event to be checked for pageX/pageY
   * @returns {object} containing x/y coordinates
   */
  getPositionFromEvent(e) {
    let x = 0;
    let y = 0;

    if (!e) {
      e = window.event;
    }

    if (!e) {
      return {};
    }

    if (e.changedTouches) {
      const touch = e.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
    } else if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else if (e.clientX || e.clientY) {
      x = e.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    return {
      x,
      y
    };
  },

  /**
   * Sets the position of the context menu.
   * @private
   * @param {jQuery.Event} e jQuery Event that caused the menu to open (can be several types)
   * @returns {void}
   */
  position(e) {
    const self = this;
    let target = this.element;
    const isRTL = this.isRTL();
    const wrapper = this.menu.parent('.popupmenu-wrapper');
    const mouse = this.getPositionFromEvent(e);
    const menuDimensions = {
      width: this.menu[0].offsetWidth,
      height: this.menu[0].offsetHeight
    };

    if (!wrapper.length) {
      return;
    }

    // Make the field the same size
    const elemWidth = this.element[0].offsetWidth;
    if (this.settings.trigger === 'click' && elemWidth > menuDimensions.width) {
      this.menu.width(elemWidth);
    }

    if (target.is('svg, .icon') && target.closest('.tab').length) {
      target = target.closest('.tab');
    }

    function getCoordinates(thisE, axis) {
      axis = ((axis === 'x' || axis === 'y') ? axis : 'x');
      return mouse[axis]; // use mouseX/mouseY if this doesn't work
    }

    // Reset the arrow
    wrapper.find('.arrow').removeAttr('style');

    const opts = $.extend({}, this.settings.placementOpts);
    const strategies = ['flip'];

    /*
    if (!target.is('.autocomplete, .searchfield')) {
      strategies.push('nudge');
    }
    */
    strategies.push('shrink-y');
    opts.strategies = strategies;

    // If right-click or immediate (with an incoming event object), use coordinates from the event
    if ((this.settings.trigger === 'immediate' && this.settings.eventObj) || this.settings.trigger === 'rightClick') {
      opts.x = getCoordinates(e, 'x') - (isRTL ? menuDimensions.width : 0) + ((isRTL ? -1 : 1) * this.settings.offset.x);
      opts.y = getCoordinates(e, 'y') + this.settings.offset.y;

      if (opts.x === 0 && opts.y === 0) {
        opts.x = this.settings.offset.x || 0;
        opts.y = this.settings.offset.y || 0;
        opts.parent = this.element;
        opts.placement = 'bottom';
        opts.parentXAlignment = isRTL ? 'right' : 'left';
      }
    } else {
      opts.x = this.settings.offset.x || 0;
      opts.y = this.settings.offset.y || 0;
      opts.parent = this.element;
      opts.placement = 'bottom';
      opts.strategies.push('nudge');
    }

    //= ======================================================
    // BEGIN Temporary stuff until we sort out passing these settings
    // from the controls that utilize them
    //= ======================================================

    const toolbarParent = target.parents('.toolbar');
    const insideToolbar = toolbarParent.length > 0;
    const insideToolbarTitle = target.parents('.title').length > 0;
    const isNotFullToolbar = insideToolbar && toolbarParent.children('.buttonset, .title').length > 1;
    const isPagerMenu = target.parents('.pager-pagesize').length > 0;

    function alignLeft() {
      opts.parentXAlignment = (isRTL ? 'right' : 'left');
    }

    function alignRight() {
      opts.parentXAlignment = (isRTL ? 'left' : 'right');
    }

    function shiftDown() {
      opts.y += 15;
    }

    // Change the alignment of the popupmenu based on certain conditions
    (function doAlignment() {
      if (target.is('.btn-menu')) {
        if (isPagerMenu) {
          return alignRight();
        }

        if (insideToolbar) {
          if (!isNotFullToolbar) {
            return alignLeft();
          }
          if (insideToolbarTitle) {
            return alignLeft();
          }
          return alignRight();
        }

        return alignLeft();
      }

      if (target.is('.btn-actions')) {
        return alignRight();
      }

      if (target.is('.tab-more')) {
        return alignRight();
      }

      if ((target.is('.btn-split-menu, .tab, .searchfield-category-button') &&
        !target.parent('.pager-pagesize').length)) {
        return alignLeft();
      }

      return undefined;
    }());

    if (target.parents('.masthead').length > 0) {
      shiftDown();
    }

    // If inside a "page-container" element, constrain the popupmenu to that element
    // (fixes SOHO-6223)
    const container = this.element.parents('.page-container:not(.tab-container)');
    if (container.length) {
      opts.container = container.first();
    }

    //= ======================================================
    // END Temporary stuff until we sort out passing these settings
    // from the controls that utilize them
    //= ======================================================

    wrapper.one('afterplace.popupmenu', (thisE, positionObj) => {
      self.handleAfterPlace(thisE, positionObj);
    });

    this.wrapperPlace = new Place(wrapper, opts);
    this.wrapperPlace.place(opts);
  },

  handleAfterPlace(e, placementObj) {
    const wrapper = this.menu.parent('.popupmenu-wrapper');
    this.wrapperPlace.setArrowPosition(e, placementObj, wrapper);

    if (placementObj.height) {
      wrapper[0].style.height = '';
      this.menu[0].style.height = (placementObj.height) + (/(px|%)/i.test(`${placementObj.height}`) ? '' : 'px');
    }
    if (placementObj.width) {
      wrapper[0].style.width = '';
      this.menu[0].style.width = (placementObj.width) + (/(px|%)/i.test(`${placementObj.width}`) ? '' : 'px');
    }

    wrapper.triggerHandler('popupmenuafterplace', [placementObj]);
    return placementObj;
  },

  /**
   * Calls an external source.
   * @private
   * @param {jQuery.Event} [e] an event that triggered the Popupmenu to open
   *  (could be several types)
   * @param {boolean} [doOpen] causes the menu to re-open once the data has been reloaded.
   * @param {jQuery[]|HTMLElement} [contextElement] if passed, represents a submenu
   *  as the actionable, replaceable menu element instead of the main menu.
   * @param {boolean} [isSubmenu] Note that the request is a submenu for the callback.
  */
  callSource(e, doOpen, contextElement, isSubmenu) {
    if (typeof this.settings.beforeOpen !== 'function') {
      return;
    }

    const self = this;
    let targetMenu = this.menu;

    // Use a different menu, if applicable
    if (DOM.isElement(contextElement) && $(contextElement).is('.popupmenu, .submenu')) {
      targetMenu = $(contextElement);
      // Skip calling external source if submenu is already open
      if (contextElement.hasClass('is-open')) {
        return;
      }
    }

    const response = function (content) {
      const existingMenuItems = targetMenu.children();

      existingMenuItems
        .filter((i, item) => self.predefinedItems.index(item) === -1)
        .off()
        .remove();

      if (content === false) {
        return false;
      }

      const newContent = $(content);
      targetMenu.append(newContent);

      let wrapper = targetMenu.parent('.wrapper, .popupmenu-wrapper');
      if (!wrapper.length) {
        wrapper = targetMenu.wrap('<div class="wrapper">').parent();
      }
      wrapper.removeAttr('style');
      self.markupItems(targetMenu);

      if (doOpen) {
        if (!targetMenu.is(self.menu)) {
          self.openSubmenu(wrapper.parent('li'), true);
        } else {
          self.open(e, true);
        }
      }
      return true;
    };

    const callbackOpts = {};
    if (!targetMenu.is(this.menu)) {
      callbackOpts.contextElement = targetMenu;
    }

    callbackOpts.element = this.element;
    callbackOpts.isSubmenu = isSubmenu;

    if (typeof this.settings.beforeOpen === 'string') {
      window[this.settings.beforeOpen](response, callbackOpts);
      return;
    }

    this.settings.beforeOpen(response, callbackOpts);
  },

  /**
   * Opens the popupmenu, including repopulating data and setting up visual delays, if necessary.
   * @param {jQuery.Event} e the event that caused the menu to open
   * @param {boolean} ajaxReturn set to true if the open routine should not include a source call
   * @param {boolean} useDelay set to true if the menu should open on a delay (used in mobile environments where a software keybord is present)
   * @returns {void}
   */
  open(e, ajaxReturn, useDelay) {
    const self = this;
    /**
     * Fires before open.
     *
     * @event beforeopen
     * @memberof PopupMenu
     * @property {object} event - The jquery event object
     * @property {object} this menu instance
     */
    let canOpen = true;
    if (!this.element.hasClass('autocomplete')) {
      canOpen = this.element.triggerHandler('beforeopen', [this.menu]);
      if (canOpen === false) {
        return;
      }
    }

    // Check external AJAX source, if applicable
    if (!ajaxReturn) {
      canOpen = this.callSource(e, true);

      if (this.settings.beforeOpen) {
        return;
      }
    }

    // If there's no explicit run of this method without this flag, setup a delay and re-run the open method
    if (!useDelay) {
      if (env.os.name === 'ios') {
        setTimeout(() => {
          self.open(e, ajaxReturn, true);
        }, 400);
        return;
      }
    }

    const otherMenus = $('.popupmenu.is-open').filter(function () {
      return $(this).parents('.popupmenu').length === 0;
    }).not(this.menu); // close others.

    otherMenus.each(function () {
      const trigger = $(this).data('trigger');
      if (!trigger || !trigger.length) {
        return;
      }

      const api = $(this).data('trigger').data('popupmenu');
      if (api && typeof api.close === 'function') {
        api.close();
      }
    });

    // Close open tooltips associated with this menu's trigger element
    const tooltipAPI = this.element.data('tooltip');
    if (tooltipAPI && tooltipAPI.visible) {
      tooltipAPI.hide();
    }

    // Close open dropdowns
    const openDropdown = $('.dropdown.is-open');
    if (openDropdown.length > 0) {
      const dropDownApi = openDropdown.parent().prev().data('dropdown');
      if (dropDownApi) {
        dropDownApi.closeList('cancel');
      }
    }

    this.element.addClass('is-open');
    this.menu.addClass('is-open').attr('aria-hidden', 'false');

    if (this.element.hasClass('inverse')) {
      this.menu.parent('.popupmenu-wrapper').addClass('inverse');
    }

    this.position(e);
    utils.fixSVGIcons(this.menu);

    if (this.element.closest('.header').length > 0) {
      this.menu.parent()[0].style.zIndex = '9001';
    }

    // Check every anchor tag to see if it should be disabled.
    // Use the CSS class on its parent to determine whether or not to disable.
    this.menu.find('a').each(function () {
      const a = $(this);
      const li = a.parent();

      if (li.hasClass('is-disabled')) {
        li.addClass('is-disabled');
        a.attr('aria-disabled', 'true');
        a.attr('disabled', 'disabled');
      } else {
        li.removeClass('is-disabled');
        a.removeAttr('aria-disabled');
        a.removeAttr('disabled');
      }
    });

    // Close on Document Click ect..
    setTimeout(() => {
      $(document).on(`touchend.popupmenu.${self.id} click.popupmenu.${self.id}`, (thisE) => {
        const isPicker = (self.settings.menu === 'colorpicker-menu');

        if (thisE.button === 2) {
          return;
        }

        if (self.holdingDownClick) {
          delete self.holdingDownClick;
          return;
        }

        // Click functionality will toggle the menu - otherwise it closes and opens
        if ($(thisE.target).is(self.element) && !isPicker) {
          return;
        }

        if ($(thisE.target).closest('.popupmenu').length === 0) {
          self.close(true, self.settings.trigger === 'rightClick');
        }

        if ($(thisE.target).hasClass('colorpicker')) {
          self.close();
        }
      });

      // in desktop environments, close the list on viewport resize
      if (window.orientation === undefined) {
        $('body').on('resize.popupmenu', () => {
          self.handleCloseEvent();
        });
      }

      $(window).on('scroll.popupmenu', () => {
        self.close();
      });

      $('.scrollable, .modal.is-visible .modal-body-wrapper').on('scroll.popupmenu', () => {
        self.close();
      });

      /**
       * Fires on open.
       *
       * @event open
       * @memberof PopupMenu
       * @property {object} event - The jquery event object
       * @property {object} this menu instance
       */
      self.element.triggerHandler('open', [self.menu]);
    }, 300);

    // Hide on iFrame Clicks - only works if on same domain
    $('iframe').each(function () {
      const frame = $(this);
      frame.ready(() => {
        try {
          frame.contents().find('body').on('click.popupmenu', () => {
            self.close();
          });
        } catch (thisE) {
          // Ignore security errors on out of iframe
        }
      });
    });

    this.handleKeys();

    // hide and decorate submenus - we use a variation on
    let tracker = 0;
    let startY;
    let menuToClose;
    let timeout;

    self.menu.find('.popupmenu').removeClass('is-open');
    self.menu.on('mouseenter.popupmenu touchstart.popupmenu', '.submenu', function (thisE) {
      const menuitem = $(this);
      startY = thisE.pageX;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        self.openSubmenu(menuitem);
      }, 300);

      $(document).on(`mousemove.popupmenu.${this.id}`, (documentE) => {
        tracker = documentE.pageX;
      });
    }).on('mouseleave.popupmenu', '.submenu', function () {
      $(document).off(`mousemove.popupmenu.${this.id}`);

      menuToClose = $(this).find('ul');

      const hasWrapper = menuToClose.parent('.wrapper').length > 0;
      const isLeft = (hasWrapper ? parseInt(menuToClose.parent('.wrapper')[0].style.left, 10) : 0) < 0;
      let canClose = (tracker - startY) < 3.5;

      if (isLeft) {
        canClose = (tracker - startY) >= 0;
      }

      if (canClose) { // We are moving slopie to the menu
        menuToClose.removeClass('is-open').removeAttr('style');
        menuToClose.parent('.wrapper').removeAttr('style');
        menuToClose.parent().parent().removeClass('is-submenu-open');
        menuToClose = null;
      }
      clearTimeout(timeout);
    });

    if (self.settings.autoFocus) {
      setTimeout(() => {
        const excludes = ':not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)';
        let selection = self.menu.children(excludes).find('.is-selected').children('a');

        if (!selection.length) {
          selection = self.menu.children(excludes).first().children('a');
        }

        self.highlight(selection);
        /**
         * Fires after open.
         *
         * @event afteropen
         * @memberof PopupMenu
         * @property {object} event - The jquery event object
         * @property {object} this menu instance
         */
        self.element.triggerHandler('afteropen', [self.menu]);
      }, 1);
    }
  },

  /**
   * Only allows a menu to close if a key is no longer being pressed
   * @private
   * @returns {void}
   */
  handleCloseEvent() {
    if (this.holdingDownClick) {
      return;
    }

    this.close();
  },

  /**
   * Opens a top-level menu item's submenu, if applicable
   * @private
   * @param {jQuery[]} li the list item that needs to be opened.
   * @param {boolean} [ajaxReturn] if defined, prevents an external source from
   *  re-populating the menu before it opens.
   * @returns {void}
   */
  openSubmenu(li, ajaxReturn) {
    if (DOM.hasClass(li, 'is-disabled') || li[0].disabled) {
      return;
    }

    let submenu = li.children('.wrapper, .popupmenu');
    if (submenu.length && submenu.is('.wrapper')) {
      submenu = submenu.children('.popupmenu');
    }

    let canOpen = this.element.triggerHandler('beforeopen', [submenu]);
    if (canOpen === false) {
      return;
    }

    // Check external AJAX source, if applicable
    if (!ajaxReturn) {
      canOpen = this.callSource(null, true, submenu, true);
      if (this.settings.beforeOpen) {
        return;
      }
    }

    this.showSubmenu(li);
  },

  /**
   * Opens a top-level menu item's submenu, if applicable
   * @private
   * @param {jQuery[]} li the list item that needs to be opened.
   * @returns {void}
   */
  showSubmenu(li) {
    // Trigger an event so other components can listen to this element as a popupmenu trigger.
    this.element.triggerHandler('show-submenu', [li]);

    let wrapper = li.children('.wrapper').filter(':first');
    const isRTL = this.isRTL();
    const rtlPadding = 30;

    // Wrap if not wrapped (dynamic menu situation)
    if (wrapper.length === 0) {
      const ul = li.children('ul').filter(':first');
      ul.wrap('<div class="wrapper"></div>');
      wrapper = ul.parent();
    }

    const menu = wrapper.children('.popupmenu');
    let wrapperLeft = li.position().left + li.outerWidth();
    let wrapperWidth = 0;

    li.parent().find('.popupmenu').removeClass('is-open').removeAttr('style');

    wrapper.children('.popupmenu').addClass('is-open');
    wrapperWidth = wrapper.outerWidth();

    if (isRTL) {
      wrapperLeft = li.position().left - wrapperWidth;
    }
    wrapper[0].style.left = `${wrapperLeft}px`;
    wrapper[0].style.top = `${parseInt(li.position().top, 10) - 5}px`;

    // Handle Case where the menu is off to the right
    let menuWidth = menu.outerWidth();
    if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft()) ||
      (isRTL && wrapper.offset().left < 0)) {
      wrapper[0].style.left = '-9999px';
      menuWidth = menu.outerWidth();
      wrapperLeft = li.position().left - menuWidth;

      if (isRTL) {
        const parentMenuWidth = wrapper.closest('.popupmenu').outerWidth();
        wrapperLeft = parentMenuWidth - 4; // Move back across the parent menu
      }
      wrapper[0].style.left = `${wrapperLeft}px`;

      // Did it fit?
      if (wrapper.offset().left < 0 ||
        (isRTL &&
          (wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())
        )
      ) {
        // No. Push the menu's left offset onto the screen.
        wrapperLeft = li.position().left - menuWidth + Math.abs(wrapper.offset().left) + 40;
        if (isRTL) {
          wrapperLeft = li.position().left - menuWidth - rtlPadding;
        }
        wrapper[0].style.left = `${wrapperLeft}px`;
        menuWidth = menu.outerWidth();
      }

      // Do one more check to see if the right edge bleeds off the screen.
      // If it does, shrink the menu's X size.
      if ((wrapper.offset().left + menuWidth) >
        ($(window).width() + $(document).scrollLeft()) || (isRTL && wrapper.offset().left < 0)) {
        const differenceY = (wrapper.offset().left + menuWidth) -
          ($(window).width() + $(document).scrollLeft());
        menuWidth -= differenceY;
        menu[0].style.width = `${menuWidth}px`;
      }
    }

    // Handle Case where menu is off bottom
    let menuHeight = menu.outerHeight();
    if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
      // First try bumping up the menu to sit just above the bottom edge of the window.
      const bottomEdgeCoord = wrapper.offset().top + menuHeight;
      const differenceFromBottomY = bottomEdgeCoord -
        ($(window).height() + $(document).scrollTop());

      wrapper[0].style.top = `${wrapper.position().top - differenceFromBottomY}px`;

      // Does it fit?
      if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
        // No. Bump the menu up higher based on the menu's height and the extra
        // space from the main wrapper.
        const mainWrapperOffset = li.parents('.popupmenu-wrapper:first').offset().top;
        wrapper[0].style.top = `${($(window).height() + $(document).scrollTop()) -
          menuHeight - mainWrapperOffset}px`;
      }

      // Does it fit now?
      if ((wrapper.offset().top - $(document).scrollTop()) < 0) {
        // No. Push the menu down onto the screen from the top of the window edge.
        wrapper[0].style.top = 0;
        wrapper[0].style.top = `${wrapper.offset().top * -1}px`;
        menuHeight = menu.outerHeight();
      }

      // Do one more check to see if the bottom edge bleeds off the screen.
      // If it does, shrink the menu's Y size and make it scrollable.
      if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
        const differenceX = (wrapper.offset().top + menuHeight) -
          ($(window).height() + $(document).scrollTop());
        menuHeight = menuHeight - differenceX - 32;
        menu[0].style.height = `${menuHeight}px`;
      }
    }

    li.parent().find('.is-submenu-open').removeClass('is-submenu-open');
    li.addClass('is-submenu-open');
  },

  /**
   * Places a highlighted visual state on an item inside the menu
   * @private
   * @param {jQuery[]} anchor the anchor tag representing the menu item.
   * @returns {void}
   */
  highlight(anchor) {
    if (!anchor || !anchor.length) {
      return;
    }

    const li = anchor.parent();

    li.parent().children('li').removeClass('is-focused');
    li.addClass('is-focused');

    // Prevent chrome from scrolling - toolbar
    if (anchor) {
      anchor.focus();
    }
    li.closest('.header').scrollTop(0);
  },

  /**
   * Adds/removes checkmarks that are in selectable groups inside the Popupmenu
   * @param {jQuery[]} anchor the anchor tag representing the menu item.
   * @returns {array} updated references to the anchor and its state.
   */
  select(anchor) {
    const singleMenu = this.menu.is('.is-selectable');
    const multipleMenu = this.menu.is('.is-multiselectable');
    const singleSection = this.isInSingleSelectSection(anchor);
    const multipleSection = this.isInMultiselectSection(anchor);
    const parent = anchor.parent();
    const returnObj = [anchor];

    // If the entire menu is "selectable", place the checkmark where it's supposed to go.
    if (singleMenu || singleSection) {
      parent.prevUntil('.heading, .separator').add(parent.nextUntil('.heading, .separator')).removeClass('is-checked');
      parent.addClass('is-checked');
      returnObj.push('selected');
      return returnObj;
    }

    if (multipleMenu || multipleSection) {
      if (parent.hasClass('is-checked')) {
        parent.removeClass('is-checked');
        returnObj.push('deselected');
        return returnObj;
      }
      parent.addClass('is-checked');
      returnObj.push('selected');
      return returnObj;
    }

    return returnObj;
  },

  /**
   * Gets references to top-level menu items that are currently selected.
   * @returns {jQuery[]} elements inside the top-level menu that are selected.
   */
  getSelected() {
    if (!this.menu.is('.is-selectable, .is-multiselectable')) {
      return $();
    }

    return this.menu.children('.is-checked').children('a');
  },

  /**
   * Determines whether or not an anchor resides inside of a selectable Popupmenu section.
   * @param {jQuery[]} anchor the anchor tag being checked.
   * @returns {jQuery[]} elements inside the top-level menu that are selected.
   */
  isInSelectableSection(anchor) {
    const separator = anchor.parent().prevAll().filter('.separator').first();
    return (separator.hasClass('multi-selectable-section') || separator.hasClass('single-selectable-section'));
  },

  /**
   * Determines whether or not an anchor resides inside of a single-selectable Popupmenu section.
   * @param {jQuery[]} anchor the anchor tag being checked.
   * @returns {jQuery[]} elements inside the top-level menu that are selected
   *  within a single-selectable section.
   */
  isInSingleSelectSection(anchor) {
    return anchor.parent().prevAll().filter('.separator').first()
      .hasClass('single-selectable-section');
  },

  /**
   * Determines whether or not an anchor resides inside of a multi-selectable Popupmenu section.
   * @param {jQuery[]} anchor the anchor tag being checked.
   * @returns {jQuery[]} elements inside the top-level menu that are selected
   *  within a multi-selectable section.
   */
  isInMultiselectSection(anchor) {
    return anchor.parent().prevAll().filter('.separator').first()
      .hasClass('multi-selectable-section');
  },

  /**
   * Removes event listeners from all popupmenu elements.
   * @private
   * @returns {void}
   */
  detach() {
    $(document).off(`touchend.popupmenu.${this.id} click.popupmenu.${this.id} keydown.popupmenu`);
    $(window).off('scroll.popupmenu orientationchange.popupmenu');
    $('body').off('resize.popupmenu');
    $('.scrollable').off('scroll.popupmenu');

    this.menu.off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');

    $('iframe').each(function () {
      const frame = $(this);
      try {
        frame.contents().find('body').off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');
      } catch (e) {
        // Ignore security errors on out of iframe
      }
    });
  },

  /**
   * Close the open menu
   * @param {boolean} isCancelled Internally set option used if the operation is a cancel.
   *  Wont matter for manual api call.
   * @param {boolean} [noFocus] Do not return focus to the calling element (fx a button)
   */
  close(isCancelled, noFocus) {
    if (!isCancelled || isCancelled === undefined) {
      isCancelled = false;
    }

    if (!this.menu.hasClass('is-open')) {
      return;
    }

    const wrapper = this.menu.parent('.popupmenu-wrapper');
    const menu = this.menu.find('.popupmenu');

    this.menu.removeClass('is-open').attr('aria-hidden', 'true');
    if (this.menu[0]) {
      this.menu[0].style.height = '';
      this.menu[0].style.width = '';
    }

    if (wrapper[0]) {
      wrapper[0].style.left = '-999px';
      wrapper[0].style.height = '';
      wrapper[0].style.width = '';
    }

    this.menu.find('.submenu')
      .off([
        'mouseenter.popupmenu',
        'mouseleave.popupmenu'
      ].join(' '))
      .removeClass('is-submenu-open');

    if (menu[0]) {
      menu[0].style.left = '';
      menu[0].style.top = '';
      menu[0].style.height = '';
      menu[0].style.width = '';
    }

    this.menu.find('.is-focused').removeClass('is-focused');

    // Close all events
    $(document).off([
      `keydown.popupmenu.${this.id}`,
      `click.popupmenu.${this.id}`,
      `mousemove.popupmenu.${this.id}`,
      `touchend.popupmenu.${self.id}`
    ].join(' '));

    this.menu.off([
      'click.popupmenu',
      'touchend.popupmenu',
      'touchcancel.popupmenu',
      'mouseenter.popupmenu',
      'mouseleave.popupmenu'].join(' '));

    // Get rid of internal flags that check for how the menu was opened
    delete this.keydownThenClick;
    delete this.holdingDownClick;

    /**
     * Fires when close.
     *
     * @event close
     * @memberof PopupMenu
     * @property {object} event - The jquery event object
     * @property {object} close by cancelled
     */
    this.element.removeClass('is-open').triggerHandler('close', [isCancelled]);
    this.detach();

    if (this.settings.trigger === 'immediate') {
      this.destroy();
    }

    // On text input targets, don't refocus the input if the opening event was called by a touch
    if (this.element[0].tagName === 'INPUT' && this.openedWithTouch) {
      this.element.removeClass('longpress-target');
      delete this.openedWithTouch;
      return;
    }

    delete this.openedWithTouch;

    if (noFocus || !this.settings.returnFocus || env.features.touch) {
      return;
    }

    if (typeof this.settings.returnFocus === 'function') {
      this.settings.returnFocus(this, {
        triggerElement: this.element[0],
        menuElement: this.menu[0]
      });
      return;
    }

    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (this.element) {
      this.element.focus();
    }
  },

  /**
   * Removes bound events and generated markup from this component
   * @private
   * @returns {void}
   */
  teardown() {
    const self = this;
    const wrapper = this.menu.parent('.popupmenu-wrapper');

    if (this.ajaxContent) {
      this.ajaxContent.off().remove();
    }

    this.predefinedItems = $();

    this.menu.parent().off('contextmenu.popupmenu');
    if (this.element.hasClass('btn-actions')) {
      this.menu.parent().removeClass('bottom').find('.arrow').remove();
    }

    this.menu.off('dragstart.popupmenu');

    // TODO: Fix when we have time - shouldn't be referencing other controls here
    let insertTarget = this.element;
    const searchfield = this.element.parent().children('.searchfield');

    if (searchfield.length) {
      insertTarget = searchfield.first();
    }
    if (this.settings.attachToBody && insertTarget) {
      this.menu.unwrap();

      if (this.settings.removeOnDestroy) {
        this.menu.off().remove();
      }
    }
    if (this.menu && insertTarget && !this.settings.attachToBody) {
      this.menu.insertAfter(insertTarget);
    }

    this.menu.find('.submenu').children('a').each((i, item) => {
      const spantext = $(item).find('span').text();
      const text = spantext || $(item).text();
      $(item).find('span, svg').remove();
      $(item).text(text);
    });
    this.menu.find('.submenu').removeClass('submenu');

    function unwrapPopup(menu) {
      const thisWrapper = menu.parent();
      if (thisWrapper.is('.popupmenu-wrapper, .wrapper')) {
        menu.unwrap();
      }
    }

    // Unwrap submenus
    this.menu.find('.popupmenu').each(function () {
      unwrapPopup($(this));
    });

    if (self.wrapperPlace) {
      self.wrapperPlace.destroy();
      delete self.wrapperPlace;
    }
    wrapper.off().remove();

    if (this.menu[0]) {
      $.removeData(this.menu[0], 'trigger');
    }

    this.detach();
    this.element
      .removeAttr('aria-controls')
      .removeAttr('aria-haspopup')
      .off('touchend.popupmenu touchcancel.popupmenu click.popupmenu keydown.popupmenu keypress.popupmenu contextmenu.popupmenu updated.popupmenu');

    return this;
  },

  /**
   * Updates this Popupmenu instance with new settings
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    return this
      .teardown()
      .init();
  },

  /**
   * Teardown markup and detach all events.
   * @returns {void}
   */
  destroy() {
    this.close();
    this.teardown();
    this.menu.trigger('destroy');
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { PopupMenu, COMPONENT_NAME };
