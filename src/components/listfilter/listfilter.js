import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { warnAboutDeprecation } from '../../utils/deprecated';

// The Name of this component.
const COMPONENT_NAME = 'ListFilter';

// Possible Filter Modes
const filterModes = [
  'startsWith',
  'contains',
  'keyword',
  'wordStartsWith',
  'phraseStartsWith'
];

/**
 * Matches the provided term against the beginning of all words in a text string.
 * @param {string} text searchable text.
 * @param {string} term the term for which to search in the text string.
 * @returns {boolean} true if the term is present.
 */
function wordStartsWithFilter(text, term) {
  const parts = text.split(' ');

  // Check all words for a match
  for (let a = 0; a < parts.length; a++) {
    if (parts[a].indexOf(term) === 0) {
      return true;
    }
  }

  // Direct Match
  if (text.indexOf(term) === 0) {
    return true;
  }

  // Partial dual word match
  if (term.indexOf(' ') > 0 && text.indexOf(term) > 0) {
    return true;
  }

  return false;
}

/**
 * Abstracted search/filter for use in other controls
 * @class ListFilter
 * @constructor
 *
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.caseSensitive=false]  Set to true if searches ARE case sensitive
 * @param {string} [settings.filterMode='startsWith']  Type of search can current be either 'startsWith' or 'contains'
 * @param {function} [settings.searchableTextCallback] If defined, will take each
  filterable item passed and return user-defined, searchable text content
 */

const LISTFILTER_DEFAULTS = {
  caseSensitive: false,
  filterMode: filterModes[3],
  searchableTextCallback: undefined
};

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

    // Warn about deprecated `startsWith` filter mode
    if (this.settings.filterMode === filterModes[0]) {
      warnAboutDeprecation('wordStartsWith (filter)', 'startsWith (filter)');
    }

    return this;
  },

  /**
   * Run the filter on the list for the given search term.
   * @param {array} list The array to search.
   * @param {string} term The term to look for.
   * @returns {boolean|array|jquery[]} false if filtering failed,
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

    // Gets the properties of an object and splices them into text
    function getObjectPropsAsText(thisItem) {
      let text = '';
      const props = Object.keys(thisItem);
      props.forEach((prop) => {
        const pad = text.length ? ' ' : '';
        text += `${pad}${thisItem[prop]}`;
      });
      return text;
    }

    // If a custom callback for getting searchable content is defined, return a
    // string result from that callback. Otherwise, perform the standard method
    // of grabbing text content.
    function getSearchableContent(item) {
      let santitize = true;
      if (typeof self.settings.searchableTextCallback === 'function') {
        return self.settings.searchableTextCallback(item);
      }

      let targetContent;
      if (typeof item === 'string') {
        targetContent = item;
      } else if (item instanceof $) {
        targetContent = $(item).text();
      } else if (item instanceof HTMLElement) {
        santitize = false; // safe from innerText and we wan encoding.
        targetContent = item.innerText;
      } else { // Object
        targetContent = getObjectPropsAsText(item);
      }

      let ret = targetContent;
      if (santitize) {
        ret = xssUtils.sanitizeHTML(targetContent);
      }
      return ret;
    }

    // Iterates through each list item and attempts to find the provided search term.
    function searchItemIterator(item) {
      let text = getSearchableContent(item);
      if (!self.settings.caseSensitive) {
        text = text.toLowerCase().trim();
      }

      let match = false;

      // `startsWith` filter is deprecated as of v4.20.x.
      // For checking if any word in the string begins with the term, use `wordStartsWith`.
      // For checking if a string begins with the term, use `phraseStartsWith`.
      const wordStartsWithFilters = ['startsWith', 'wordStartsWith'];
      if (wordStartsWithFilters.indexOf(self.settings.filterMode) > -1) {
        match = wordStartsWithFilter(text, term);
      }

      if (self.settings.filterMode === 'phraseStartsWith') {
        if (text.indexOf(term) === 0) {
          match = true;
        }
      }

      if (self.settings.filterMode === 'contains') {
        if (text.indexOf(term) >= 0) {
          match = true;
        }
      }

      if (self.settings.filterMode === 'keyword') {
        const keywords = term.split(' ');
        for (let i = 0; i < keywords.length; i++) {
          const keyword = keywords[i];
          if (text.indexOf(keyword) >= 0) {
            match = true;
            break;
          }
        }
      }

      // assume filtered server side
      if (self.settings.filterMode === null) {
        match = true;
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

    // If we're not dealing with jQuery, an empty array shouldn't be returned.
    if (!isJQuery && !items.length) {
      return false;
    }

    return items;
  },

  /**
   * Updates the ListFilter with new settings
   * @param {object} [settings] incoming settings
   * @returns {object} component instance
   */
  updated(settings) {
    this.settings = utils.mergeSettings(undefined, settings, this.settings);

    return this
      .teardown()
      .init();
  },

  /**
   * @private
   * @returns {object} component instance
   */
  teardown() {
    return this;
  },

  /**
   * @returns {object} component instance
   */
  destroy() {
    return this.teardown();
  }
};

export { ListFilter, COMPONENT_NAME };
