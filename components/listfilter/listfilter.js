import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// The Name of this component.
const COMPONENT_NAME = 'ListFilter';

// Possible Filter Modes
const filterModes = ['startsWith', 'contains'];

/**
 * ListFilter default settings
 * @namespace
 * @param {boolean} caseSensitive  Set to true if searches ARE case sensitive
 * @param {string} filterMode  Type of search can current be either 'startsWith' or 'contains'
 * @param {boolean} highlightMatchedText  Inserts markup that appears to highlight text
 * @param {function} highlightCallback  If defined, will execute this code for highlighting text
 * instead of the built-in highlighting code
 * @param {function} searchableTextCallback  If defined, will take each filterable item passed and
 * return user-defined, searchable text content
 */
const LISTFILTER_DEFAULTS = {
  caseSensitive: false,
  filterMode: filterModes[0],
  highlightMatchedText: false,
  highlightCallback: null,
  searchableTextCallback: undefined
};

/**
 * Abstracted search/filter for use in other controls
 * @class ListFilter
 * @constructor
 * @param {object} [settings] incoming settings
 */
function ListFilter(settings) {
  this.settings = utils.mergeSettings(undefined, settings, LISTFILTER_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

ListFilter.prototype = {

  /**
   * Sanitize Incoming Options
   * @private
   * @returns {this} component instance
   */
  init() {
    function setReasonableDefaults(setting, limits, preset) {
      if ($.inArray(setting, limits) === -1) {
        setting = preset;
      }
    }

    const checks = [
      {
        setting: this.settings.filterMode,
        limits: filterModes,
        preset: LISTFILTER_DEFAULTS.filterMode
      }
    ];

    for (let i = 0; i < checks.length; i++) {
      setReasonableDefaults(checks[i].setting, checks[i].limits, checks[i].preset);
    }

    return this;
  },

  /**
   * Run the filter on the list for the given search term.
   * @param {array} list The array to search.
   * @param {string} term The term to look for.
   * @returns {boolean|Array|jQuery[]} false if filtering failed,
   *  or an array/jQuery of items that matched the filter.
   */
  filter(list, term) {
    if (!list) {
      return false;
    }

    // Check incoming list type
    if (!$.isArray(list) && !(list instanceof jQuery)) {
      return false;
    }

    // Search term must exist and must not be nothing
    if (!term || typeof term !== 'string' || !term.length) {
      return false;
    }

    const self = this;
    let items = [];
    let isJQuery = false;

    // make search term lowercase if the search is not case-senstive
    if (!this.settings.caseSensitive) {
      term = term.toLowerCase();
    }

    // If it's not an array, build an array of the incoming object(s) for iterating through
    if (!$.isArray(list)) {
      if (list instanceof jQuery || typeof list === 'object') {
        list = $.makeArray(list);
        isJQuery = true;
      }
    }

    // If a custom callback for getting searchable content is defined, return a
    // string result from that callback. Otherwise, perform the standard method
    // of grabbing text content.
    function getSearchableContent(item) {
      if (typeof self.settings.searchableTextCallback === 'function') {
        return self.settings.searchableTextCallback(item);
      }

      const isString = typeof item === 'string';
      return (isString ? item : $(item).text());
    }

    // Iterates through each list item and attempts to find the provided search term.
    function searchItemIterator(item) {
      const text = getSearchableContent(item);
      const parts = text.split(' ');
      let match = false;

      if (self.settings.filterMode === 'startsWith') {
        for (let a = 0; a < parts.length; a++) {
          if (parts[a].toLowerCase().indexOf(term) === 0) {
            match = true;
            break;
          }
        }

        // Direct Match
        if (text.toLowerCase().indexOf(term) === 0) {
          match = true;
        }

        // Partial dual word match
        if (term.indexOf(' ') > 0 && text.toLowerCase().indexOf(term) > 0) {
          match = true;
        }
      }

      if (self.settings.filterMode === 'contains') {
        if (text.toLowerCase().indexOf(term) >= 0) {
          match = true;
        }
      }

      if (match) {
        items.push(item);
      }
    }

    // Run the iterator
    list.forEach(searchItemIterator);

    // If we originally took in a jQuery selector, rebuild that jQuery selector
    // with the relevant results.
    if (isJQuery) {
      items = $(items);
    }

    return items;
  },

  /**
   * Updates the ListFilter with new settings
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    this.settings = utils.mergeSettings(undefined, settings, this.settings);

    return this
      .teardown()
      .init();
  },

  /**
   * @private
   * @returns {this} component instance
   */
  teardown() {
    return this;
  },

  /**
   * @returns {this} component instance
   */
  destroy() {
    return this.teardown();
  }
};

export { ListFilter, COMPONENT_NAME };
