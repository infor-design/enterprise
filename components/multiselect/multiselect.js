import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery Components
import '../dropdown/dropdown.jquery';


/**
 *
 */
let COMPONENT_NAME = 'multiselect';


/**
 *
 */
let MULTISELECT_DEFAULTS = {
  filterMode: 'contains',
  maxSelected: undefined,
  moveSelected: 'all',
  showEmptyGroupHeaders: false,
  showSelectAll: false,
  source: undefined
};


/**
 * The MultiSelect Component allows selecting multiple items from a list
 *
 * @class MultiSelect
 * @param {string} filterMode  The search mode to use, can be 'contains' or 'startsWith'
 * @param {number} maxSelected  The max number of items which can be selected
 * @param {string} moveSelected   Move selected options in each group to just underneath their corresponding group headers.
 * @param {boolean} showEmptyGroupHeaders  If true groups with no items will still show the empty group header.
 * @param {boolean} showSelectAll  Show the select all text/option.
 * @param {Function} source  The calback for ajax.
 *
 */
function MultiSelect(element, settings) {
  this.settings = utils.mergeSettings(element, settings, MULTISELECT_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}


MultiSelect.prototype = {

  init: function() {
    this.build();
  },

  build: function() {
    var ddOpts = {
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
   */
  enable: function() {
    this.dropdown.enable();
  },

  /**
  * Disable the multiselect input
  */
  disable: function() {
    this.dropdown.disable();
  },

  /**
  * Trigger a rebuild due to settings change
  */
  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.build();
  },

  /**
  * Remove added markup and events
  */
  destroy: function() {
    this.dropdown.destroy();
    this.element.off();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};


export { MultiSelect, COMPONENT_NAME };
