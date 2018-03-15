import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery Components
import '../dropdown/dropdown.jquery';

// Component Name
const COMPONENT_NAME = 'multiselect';

// Component Defaults
const MULTISELECT_DEFAULTS = {
  filterMode: 'contains',
  maxSelected: undefined,
  moveSelected: 'all',
  showEmptyGroupHeaders: false,
  showSelectAll: false,
  source: undefined
};

/**
 * The MultiSelect Component allows selecting multiple items from a list
 * @class MultiSelect
 * @constructor
 * @param {jQuery[]|HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 * @param {string} [settings.filterMode = 'contains']  The search mode to use, can be 'contains' or 'startsWith'
 * @param {number} [settings.maxSelected = null]  The max number of items which can be selected
 * @param {string} [settings.moveSelected = 'all']   Move selected options in each group to just underneath their corresponding group headers.
 * @param {boolean} [settings.showEmptyGroupHeaders = false]  If true groups with no items will still show the empty group header.
 * @param {boolean} [settings.showSelectAll = false]  Show the select all button and text .
 * @param {function} [settings.source]  The calback for ajax.
 */
function MultiSelect(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MULTISELECT_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

MultiSelect.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.build();
  },

  /**
   * @private
   * @returns {void}
   */
  build() {
    const ddOpts = {
      closeOnSelect: false,
      empty: true,
      moveSelected: 'all',
      multiple: true
    };

    if (this.settings.filterMode) {
      ddOpts.filterMode = this.settings.filterMode;
    }

    if (this.settings.source) {
      ddOpts.source = this.settings.source;
    }

    if (this.settings.maxSelected) {
      ddOpts.maxSelected = this.settings.maxSelected;
    }

    if (this.settings.moveSelected) {
      ddOpts.moveSelected = this.settings.moveSelected;
    }

    if (this.settings.showEmptyGroupHeaders) {
      ddOpts.showEmptyGroupHeaders = this.settings.showEmptyGroupHeaders;
    }

    if (this.settings.showSelectAll) {
      ddOpts.showSelectAll = this.settings.showSelectAll;
    }

    this.element.dropdown(ddOpts);
    this.dropdown = this.element.data('dropdown');

    return this;
  },

  /**
   * Enable the multiselect input
   * @returns {void}
   */
  enable() {
    this.dropdown.enable();
  },

  /**
  * Disable the multiselect input
  * @returns {void}
  */
  disable() {
    this.dropdown.disable();
  },

  /**
  * Trigger a rebuild due to settings change
  * @param {object} [settings] incoming settings
  * @returns {void}
  */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.build();
  },

  /**
   * Remove added markup and events
   * @returns {void}
   */
  destroy() {
    this.dropdown.destroy();
    this.element.off();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { MultiSelect, COMPONENT_NAME };
