import { utils } from '../utils/utils';

// Component Name
const COMPONENT_NAME = 'listdetail';

// Available Soho Elements to be used as the list
const LIST_DETAIL_SUPPORTED_LIST_TYPES = [
  'accordion',
  'listview'
];

/**
 * Default List/Detail Settings
 * @namespace
 * @property {HTMLElement} [backElement] defines a trigger button that will be used
 *  to "drill up" from the detail back to the list on the responsive view of this pattern.
 * @property {boolean} edgeBleed if true, will show an interactive edge of the "list" element while
 *  the detail view is active.  Clicking the left edge (or a button in the left edge) will cause
 *  the "drillup" operation to occur while making the list active.
 * @property {HTMLElement} [listElement] the base element for the Soho component that will
 *  be used as the "List" to be chosen from.  Must implement a Soho Accordion or Listview element.
 * @property {HTMLElement} [detailElement] the base element for the Soho component that will
 *  be used as "detail" or content area that can change based on what is picked from the list.
 */
const LIST_DETAIL_DEFAULTS = {
  backElement: undefined,
  edgeBleed: false,
  listElement: undefined,
  detailElement: undefined
};

/**
 * Checks an HTMLElement for a Soho Component instance that can be used for the list
 * @param {HTMLElement} listElement the element being checked
 * @returns {boolean} whether or not the element is a valid list type
 */
function isListType(listElement) {
  if (!(listElement instanceof HTMLElement)) {
    return false;
  }

  const components = Object.keys($(listElement).data());
  let isList = false;
  components.forEach((key) => {
    if (LIST_DETAIL_SUPPORTED_LIST_TYPES.indexOf(key) > -1) {
      isList = true;
    }
  });
  return isList;
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
    this.setInternalElementReference('listElement', elemType => isListType(this.settings[elemType]));
    this.setInternalElementReference('detailElement');
    this.setInternalElementReference('backElement');

    // Single sanity-check for showing the detail area.
    this.showDetail = false;
    if (this.element.classList.contains('show-detail')) {
      this.showDetail = true;
    }

    if (this.backElement) {
      this.backElement.classList.add('list-detail-back-button');

      // If it's an icon button, get a reference to the icon so we can change its state.
      const hasIcon = this.backElement.querySelector('.icon');
      if (hasIcon) {
        this.backElementIcon = hasIcon;
      }

      //
      this.listContainsBackElement = this.listElement.contains(this.backElement);
      this.detailContainsBackElement = this.detailElement.contains(this.backElement);
    }

    // Gets children list/detail components
    const children = this.element.querySelectorAll('.list-detail');
    if (children) {
      this.childrenListDetailElements = children;
    }

    // Change edgebleed setting
    if (this.settings.edgeBleed) {
      this.edgeBleed = true;
      this.element.classList.add('bleeding-edge');
    } else {
      this.edgeBleed = false;
      this.element.classList.remove('bleeding-edge');
    }

    this.handleEvents();
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

    if (this.backElementIcon) {
      this.backElementIcon.classList.add('go-back');
    }

    // enable focusing of the Backbutton if the button is located inside of the
    // list or detail elements
    if (this.edgeBleed) {
      if (this.backElement && (this.listContainsBackElement || this.detailContainsBackElement)) {
        this.backElement.tabIndex = 0;
      }
    }

    // Pass an event to the Detail Area's main element with some context about
    // what was clicked inside the list.
    if (this.detailArea) {
      $(this.detailElement).triggerHandler('activate-screen', [section]);
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

    if (this.backElementIcon) {
      this.backElementIcon.classList.remove('go-back');
    }

    // disable focusing of the Backbutton if the button is located inside of the
    // list or detail elements
    if (this.edgeBleed) {
      if (this.backElement && (this.listContainsBackElement || this.detailContainsBackElement)) {
        this.backElement.tabIndex = -1;
      }
    }

    this.showDetail = false;
    this.element.classList.remove('show-detail');
  },

  /**
   * Handles `click` events passed to the `backElement`.
   * @private
   * @param {Event} e `click` event
   * @returns {boolean} whether or not the click operation should be allowed to continue
   */
  handleBackClick(e) {
    if (!this.showDetail) {
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

    // Prevent the normal `click` operation of the backElement.
    // (FX: if `backElement` is the App Menu trigger, prevents the App Menu from opening)
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
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
   * @private
   */
  teardown() {
    $(this.element).off(`drilldown.${COMPONENT_NAME}`);

    delete this.listElement;
    delete this.detailElement;
    delete this.backElement;
    delete this.backElementIcon;
    delete this.edgeBleed;
    delete this.listContainsBackElement;
    delete this.detailContainsBackElement;
    delete this.showDetail;
  },

  /**
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element, COMPONENT_NAME);
  }

};

export { ListDetail, COMPONENT_NAME };
