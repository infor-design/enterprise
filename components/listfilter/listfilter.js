import * as debug from '../utils/debug';
import { utils } from '../utils/utils';


/**
 *
 */
let PLUGIN_NAME = 'ListFilter';


/**
 *
 */
let LISTFILTER_DEFAULTS = {
  caseSensitive: false,
  filterMode: 'startsWith',
  highlightMatchedText: false,
  highlightCallback: null,
  searchableTextCallback: undefined
};


/**
 *
 */
const filterModes = ['startsWith', 'contains'];


/**
* Abstracted search/filter for use in other controls
*
* @class ListFilter
* @param {Boolean} caseSensitive  Set to true if searches ARE case sensitive
* @param {String} filterMode  Type of search can current be either 'startsWith' or 'contains'
* @param {Boolean} highlightMatchedText  Inserts markup that appears to highlight text
* @param {function} highlightCallback  If defined, will execute this code for highlighting text instead of the built-in highlighting code
* @param {function} searchableTextCallback  If defined, will take each filterable item passed and return user-defined, searchable text content
*
*/
function ListFilter(settings) {
  this.settings = utils.mergeSettings(undefined, settings, LISTFILTER_DEFAULTS);
  debug.logTimeStart(PLUGIN_NAME);
  this.init();
  debug.logTimeEnd(PLUGIN_NAME);
}

ListFilter.prototype = {

  init: function() {
    // Sanitize Incoming Options
    function setReasonableDefaults(setting, limits, preset) {
      if ($.inArray(setting, limits) === -1) {
        setting = preset;
      }
    }

    var checks = [
      { setting: this.settings.filterMode, limits: filterModes, preset: LISTFILTER_DEFAULTS.filterMode }
    ];

    for (var i = 0; i < checks.length; i++) {
      setReasonableDefaults(checks[i].setting, checks[i].limits, checks[i].preset);
    }

    return this;
  },

  /**
  * Run the filter on the list for the given sreach term.
  * @param {Array} list  The array to search.
  * @param {String} term  The term to look for.
  * @returns {boolean|Array|jQuery[]}
  */
  filter: function(list, term) {
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

    var self = this,
      items = [],
      isJQuery = false;

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

    // If a custom callback for getting searchable content is defined, return a string result from that callback.
    // Otherwise, perform the standard method of grabbing text content.
    function getSearchableContent(item) {
      if (typeof self.settings.searchableTextCallback === 'function') {
        return self.settings.searchableTextCallback(item);
      }

      var isString = typeof item === 'string';
      return (isString ? item : $(item).text());
    }

    // Iterates through each list item and attempts to find the provided search term.
    function searchItemIterator(item) {
      var text = getSearchableContent(item),
        parts = text.split(' '),
        match = false;

      if (self.settings.filterMode === 'startsWith') {
        for (var a = 0; a < parts.length; a++) {
          if (parts[a].toLowerCase().indexOf(term) === 0) {
            match = true;
            break;
          }
        }

        //Direct Match
        if (text.toLowerCase().indexOf(term) === 0) {
          match = true;
        }

        //Partial dual word match
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

      return;
    }

    // Run the iterator
    list.forEach(searchItemIterator);

    // If we originally took in a jQuery selector, rebuild that jQuery selector with the relevant results.
    if (isJQuery) {
      items = $(items);
    }

    return items;
  },

  updated: function(settings) {
    this.settings = utils.mergeSettings(undefined, settings, this.settings);

    return this
      .teardown()
      .init();
  },

  teardown: function() {
    return this;
  },

  destroy: function() {
    return this.teardown();
  }
};


export { ListFilter, PLUGIN_NAME };
