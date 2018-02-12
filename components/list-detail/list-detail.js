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
 * @property {HTMLElement} listElement the base element for the Soho component that will
 *  be used as the "List" to be chosen from.  Must implement a Soho Accordion or Listview element
 */
const LIST_DETAIL_DEFAULTS = {
  listElement: undefined,
  detailElement: undefined,
};

/**
 * Checks an HTMLElement for a Soho Component instance that can be used for the list
 * @param {HTMLElement} listElement the element being checked
 * @returns {boolean} whether or not the element is a valid list type
 */
function isListType(listElement) {
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
    // Setup List Element
    if (typeof this.settings.listElement === 'string') {
      const queryForListElement = document.querySelector(this.settings.listElement);
      if (queryForListElement) {
        this.settings.listElement = queryForListElement;
      }
    }
    if (this.settings.listElement instanceof HTMLElement && isListType(this.settings.listElement)) {
      this.listElement = this.settings.listElement;
    }

    // Setup Detail Element
    if (typeof this.settings.detailElement === 'string') {
      const queryForDetailElement = document.querySelector(this.settings.detailElement);
      if (queryForDetailElement) {
        this.settings.detailElement = queryForDetailElement;
      }
    }
    if (this.settings.detailElement instanceof HTMLElement) {
      this.detailElement = this.settings.detailElement;
    }
  },

  /**
   * @private
   */
  teardown() {
    delete this.listElement;
    delete this.detailElement;
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
