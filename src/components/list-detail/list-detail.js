import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { stringUtils } from '../../utils/string';
import { breakpoints } from '../../utils/breakpoints';

// Component Name
const COMPONENT_NAME = 'listdetail';
// Available breakpoint types for Edge Bleeding
const LIST_DETAIL_EDGE_BLEED_BREAKPOINTS = [
  'phone',
  'tablet'
];

/**
 * @class ListDetail
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {HTMLElement} [settings.backElement] defines a trigger button that will be used to "drill up" from the detail
 * back to the list on the responsive view of this pattern.
 * @param {boolean} [settings.edgeBleed=false] if true, will show an interactive edge of the "list" element while the
 * detail view is active.  Clicking the left edge (or a button in the left edge) will cause the "drillup" operation to occur
 * while making the list active.
 * @param {string} [settings.edgeBleedBreakpoint='phone'] Defines the breakpoint where the responsive "edge bleeding" style will occur.
 * @param {HTMLElement} [settings.listElement] the base element for the Soho component that will be used as the "List" to be chosen from.
 * Must implement a Soho Accordion or Listview element.
 * @param {HTMLElement} [settings.listCloseElement]  defines a trigger button element that can be used to collapse a bleeding-edge list drawer.
 * @param {HTMLElement} [settings.toggleElement] defines a trigger button that will be used to "toggle" the display of the listElement.
 * @param {HTMLElement} [settings.detailElement] the base element for the Soho component that will be used as "detail" or content area that can
 * change based on what is picked from the list.
 */
const LIST_DETAIL_DEFAULTS = {
  backElement: undefined,
  edgeBleed: false,
  edgeBleedBreakpoint: LIST_DETAIL_EDGE_BLEED_BREAKPOINTS[0],
  listElement: undefined,
  listCloseElement: undefined,
  toggleElement: undefined,
  detailElement: undefined
};

// Available Soho Elements to be used as the list
const LIST_DETAIL_SUPPORTED_LIST_TYPES = [
  'accordion',
  'listview'
];

/**
 * Gets the type of list component
 * @private
 * @param {HTMLElement} listElement the element being checked
 * @returns {string|undefined} the type of component, or undefined
 */
function getListType(listElement) {
  if (!(listElement instanceof HTMLElement)) {
    return undefined;
  }

  const components = Object.keys($(listElement).data());
  let type;
  components.forEach((key) => {
    if (LIST_DETAIL_SUPPORTED_LIST_TYPES.indexOf(key) > -1) {
      type = key;
    }
  });

  return type;
}

/**
 * Checks an HTMLElement for a Soho Component instance that can be used for the list
 * @private
 * @param {HTMLElement} listElement the element being checked
 * @returns {boolean} whether or not the element is a valid list type
 */
function isValidList(listElement) {
  if (!(listElement instanceof HTMLElement)) {
    return false;
  }

  const type = getListType(listElement);
  return type !== undefined;
}

/**
 * Implements cross-functionality between a list component and a content area that are described by
 * a Soho List/Detail pattern
 * @constructor
 * @param {HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 * @returns {void}
 */
function ListDetail(element, settings) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  this.element = element;
  this.settings = utils.mergeSettings(this.element, settings, LIST_DETAIL_DEFAULTS);
  this.init();
}

ListDetail.prototype = {

  /**
   * @private
   */
  init() {
    this.setInternalElementReference('listElement', elemType => isValidList(this.settings[elemType]));
    this.setInternalElementReference('detailElement');
    this.setInternalElementReference('backElement');
    this.setInternalElementReference('listCloseElement');
    this.setInternalElementReference('toggleElement');

    // Single confidence check for showing the detail area.
    this.showDetail = false;
    if (this.element.classList.contains('show-detail')) {
      this.showDetail = true;
    }

    this.showSidebar = true;

    // If a proper listElement has been provided, set a flag on its Component API
    // that notifies the API that it's controlling an adjacent detail area.
    if (this.listElement) {
      this.listComponentType = getListType(this.listElement);
      const API = this.getListAPI();
      if (API) {
        API.isControllingDetails = true;
      }
    }

    if (this.backElement) {
      this.backElement.classList.add('list-detail-back-button');

      // If it's an icon button, get a reference to the icon so we can change its state.
      const hasIcon = this.backElement.querySelector('.icon');
      if (hasIcon) {
        this.backElementIcon = hasIcon;
      }

      // Setup internal references that can be used to find out where a backElement
      // is located internally in this pattern instance.

      if (this.listContainsBackElement) {
        this.listContainsBackElement = this.listElement.contains(this.backElement);
      }
      
      this.detailContainsBackElement = this.detailElement.contains(this.backElement);
    }

    if (this.toggleElement) {
      this.mainElement = this.element.querySelector('.main');
      this.sidebarElement = this.element.querySelector('.sidebar');

      this.toggleElement.classList.add('list-detail-toggle-button');

      // If it's an icon button, get a reference to the icon so we can change its state.
      const hasIcon = this.toggleElement.querySelector('.icon');
      if (hasIcon) {
        this.toggleElementIcon = hasIcon;
        this.toggleElementIcon.classList.add('go-back');
      }
    }

    // Gets children list/detail components
    const children = this.element.querySelectorAll('.list-detail');
    if (children) {
      this.childrenListDetailElements = children;
    }

    // Change edgebleed setting
    if (this.settings.edgeBleed) {
      this.edgeBleed = true;
      this.element.classList.add(`bleeding-edge__${this.settings.edgeBleedBreakpoint}`);
    } else {
      this.edgeBleed = false;
      this.element.classList.remove('bleeding-edge__phone', 'bleeding-edge__tablet');
    }

    // Flags for responsive behavior
    this.setBreakpointChecks();

    this.handleEvents();
  },

  /**
   * Sets internal checks for certain breakpoints
   * @private
   * @returns {void}
   */
  setBreakpointChecks() {
    this.abovePhoneBreakpoint = breakpoints.isAbove('phone-to-tablet');
    this.aboveTabletBreakpoint = breakpoints.isAbove('desktop');
  },

  /**
   * Takes elements defined as settings properties, and evaluates them to determine if they
   * are valid. If so, they are set as internal component properties for future use.
   * @private
   * @param {string} elementType corresponds to a setting on the pattern that
   *  represents an element reference.
   * @param {function} [storageConditions] if defined as a function, will provide an
   *  additional set of parameters for determining if an HTMLElement is valid for this element type.
   * @returns {void}
   */
  setInternalElementReference(elementType, storageConditions) {
    if (typeof this.settings[elementType] === 'string' && this.settings[elementType].length) {
      const queryForElem = document.querySelector(this.settings[elementType]);
      if (queryForElem) {
        this.settings[elementType] = queryForElem;
      }
    }

    // Set to true to simply pass the next check, if a callback isn't provided.
    // Otherwise, resolve the callback (which should return a boolean)
    if (typeof storageConditions !== 'function') {
      storageConditions = true;
    } else {
      storageConditions = storageConditions(elementType);
    }

    if (this.settings[elementType] instanceof HTMLElement && storageConditions) {
      this[elementType] = this.settings[elementType];
    }
  },

  /**
   * @private
   * @listens drilldown custom jQuery event that causes the detail area to become active
   * @listens drillup custom jQuery event that causes the list area to become active
   * @listens click
   */
  handleEvents() {
    $(this.element).on(`drilldown.${COMPONENT_NAME}`, (e, item) => {
      e.stopPropagation();
      this.drilldown(item, e.target);
    }).on(`drillup.${COMPONENT_NAME}`, (e) => {
      e.stopPropagation();
      this.drillup();
    });

    if (this.backElement) {
      this.backElement.addEventListener('click', this.handleBackClick.bind(this));
    }

    if (this.toggleElement) {
      this.toggleElement.addEventListener('click', this.handleToggleClick.bind(this));
    }

    if (this.listCloseElement) {
      this.listCloseElement.addEventListener('click', this.handleClose.bind(this));
    }

    // Run certain responsive checks on page resize
    $('body').off(`resize.${COMPONENT_NAME}`).on(`resize.${COMPONENT_NAME}`, () => {
      this.handleResize();
    });
  },

  /**
   * Causes the list/detail pattern to activate the detail area, "drilling down"
   *  into it, away from the list area.
   * @param {HTMLElement} section provides context from the element chosen from the list
   * @param {HTMLElement} [eventTarget] will cause the drilldown operation to stop if the
   *  element provided isn't registered as the list in this list/detail instance (used when
   *  events trigger this method).
   * @returns {void}
   */
  drilldown(section, eventTarget) {
    if (this.showDetail) {
      return;
    }

    // If eventTarget's provided, check to see if it's the same element as the
    // stored ListElement.  If they're not, don't continue (could have been triggered
    // by an inner-detail area ListView/Accordion)
    if (eventTarget && eventTarget.innerHTML !== this.listElement.innerHTML) {
      return;
    }

    this.showDetail = true;
    this.element.classList.add('show-detail');

    this.addBackElementIconContext();

    if (!this.isAboveBreakpoint()) {
      this.getListAPI().disable();
    }

    // Pass an event to the Detail Area's main element with some context about
    // what was clicked inside the list.
    if (this.detailArea) {
      $(this.detailElement).triggerHandler('activatescreen', [section]);
    }
  },

  /**
   * Causes the list/detail pattern to activate the list area, "drilling up" from the detail area.
   * @returns {void}
   */
  drillup() {
    if (!this.showDetail) {
      return;
    }

    this.removeBackElementIconContext();

    this.getListAPI().enable();

    this.showDetail = false;
    this.element.classList.remove('show-detail');
  },

  /**
   * @private
   * @returns {void}
   */
  addBackElementIconContext() {
    if (this.showDetail && this.backElementIcon && !this.backElementIcon.classList.contains('go-back')) {
      this.backElementIcon.classList.add('go-back');
    }
  },

  /**
   * @private
   * @returns {void}
   */
  removeBackElementIconContext() {
    if (this.backElementIcon && this.backElementIcon.classList.contains('go-back')) {
      this.backElementIcon.classList.remove('go-back');
    }
  },

  toggleSidebar(hide) {
    if (hide) {
      this.sidebarElement.classList.add('hidden');
      this.mainElement.style.width = '100%';
      this.toggleElementIcon.classList.remove('go-back');
    } else {
      this.sidebarElement.classList.remove('hidden');
      this.mainElement.style.width = '';
      this.toggleElementIcon.classList.add('go-back');
    }

    this.showSidebar = !hide;
  },

  /**
   * Handles `click` events passed to the `backElement`.
   * @private
   * @param {Event} e `click` event
   * @returns {boolean} whether or not the click operation should be allowed to continue
   */
  handleBackClick(e) {
    function cancelClick() {
      // Prevent the normal `click` operation of the backElement.
      // (FX: if `backElement` is the App Menu trigger, prevents the App Menu from opening)
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    if (!this.showDetail) {
      // In "edgeBleed" configuration, the BackElement can be used to drill back into a previously
      // selected list item, if one was previously selected.
      if (this.edgeBleed) {
        const selected = this.getCurrentSelectedListItem();
        if (selected) {
          this.drilldown(selected);
          cancelClick();
          return false;
        }
      }

      return true;
    }

    this.drillup();

    if (this.childrenListDetailElements) {
      this.childrenListDetailElements.forEach((elem) => {
        const api = $(elem).data(COMPONENT_NAME);
        if (api && typeof api.drillup === 'function') {
          api.drillup();
        }
      });
    }

    cancelClick();
    return false;
  },

  /**
   * Handler for the listCloseElement's `click` event.
   * @returns {void}
   */
  handleToggleClick() {
    this.toggleSidebar(this.showSidebar); 
  },

  /**
   * Handler for the listCloseElement's `click` event.
   * @returns {void}
   */
  handleClose() {
    if (this.showDetail) {
      return;
    }

    // `selected` may be undefined here
    const selected = this.getCurrentSelectedListItem();
    this.drilldown(selected);
  },

  /**
   * Event handler for `body.on('resize')`. Runs whenever the page is resized.
   * @returns {void}
   */
  handleResize() {
    this.setBreakpointChecks();
    const listAPI = this.getListAPI();

    if (this.isAboveBreakpoint()) {
      if (this.edgeBleed && !this.showDetail && this.listElement.classList.contains('is-disabled')) {
        listAPI.enable();
      }
    } else if (this.edgeBleed && this.showDetail && !this.listElement.classList.contains('is-disabled')) {
      listAPI.disable();
    }

    // Removes the `go-back` class from the hamburger icon if we're above the breakpoint.
    if (this.isAboveBreakpoint()) {
      this.removeBackElementIconContext();
    } else {
      this.addBackElementIconContext();
      if (this.toggleElement) {
        this.toggleSidebar(false);
      }
    }

    // Make sure the list is always re-enabled on desktop
    if (breakpoints.isAbove('desktop')) {
      listAPI.enable();
    }
  },

  /**
   * Checks to see if the screen size is currently above the defined breakpoint
   * @returns {boolean} whether or not the screen size is larger than the defined breakpoint.
   */
  isAboveBreakpoint() {
    const breakpoint = this.settings.edgeBleedBreakpoint;
    const breakpointPropname = `above${stringUtils.capitalize(breakpoint)}Breakpoint`;

    return this[breakpointPropname];
  },

  /**
   * Gets a reference to the defined List Element's Component API.
   * @returns {object|undefined} a Soho Component API from a supported list type, or undefined
   * if no API currently exists.
   */
  getListAPI() {
    if (!this.listElement) {
      return undefined;
    }
    return $(this.listElement).data(this.listComponentType);
  },

  /**
   * Finds whatever item is currently selected by the listElement.
   * @returns {HTMLElement} a reference to that element.
   */
  getCurrentSelectedListItem() {
    if (!this.listElement) {
      return '';
    }

    let item;
    const API = this.getListAPI();

    switch (this.listComponentType) {
      case 'accordion':
        item = API.getSelected();
        break;
      default: // 'listview'
        item = API.getSelected();
        break;
    }

    // Most components are still using jQuery,
    // Run through a simple reference extraction to get at the HTMLElement
    item = DOM.convertToHTMLElement(item);

    return item;
  },

  /**
   * Updates the List/Detail pattern with new settings
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this.teardown();
    this.init();
  },

  /**
   * Removes all bound events and internal references to other components' elements/APIs
   * @private
   * @returns {void}
   */
  teardown() {
    $('body').off(`resize.${COMPONENT_NAME}`);

    $(this.element).off(`drilldown.${COMPONENT_NAME} drillup.${COMPONENT_NAME}`);

    if (this.backElement) {
      this.backElement.removeEventListener('click', this.handleBackClick.bind(this));
    }

    if (this.listCloseElement) {
      this.listCloseElement.removeEventListener('click', this.handleClose.bind(this));
    }

    if (this.listComponentType) {
      const API = this.getListAPI();
      if (API) {
        delete API.isControllingDetails;
      }
    }

    delete this.listElement;
    delete this.detailElement;
    delete this.backElement;
    delete this.backElementIcon;
    delete this.mainElement;
    delete this.sidebarElement;
    delete this.toggleElement;
    delete this.toggleElementIcon;
    delete this.edgeBleed;
    delete this.listContainsBackElement;
    delete this.detailContainsBackElement;
    delete this.childrenListDetailElements;
    delete this.showDetail;
    delete this.showSidebar;
  },

  /**
   * @private
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  }

};

export { ListDetail, COMPONENT_NAME };
