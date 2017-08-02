/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  var defaults = {
      caseSensitive: false,
      filterMode: 'startsWith',
      highlightMatchedText: false,
      highlightCallback: null
    },
    filterModes = ['startsWith', 'contains'];


  /**
  * Abstracted search/filter for use in other controls
  *
  * @class ListFilter
  * @param {Boolean} caseSensitive  &nbsp;-&nbsp; Set to true if searches ARE case sensitive
  * @param {String} filterMode  &nbsp;-&nbsp; Type of search can current be either 'startsWith' or 'contains'
  * @param {Boolean} highlightMatchedText  &nbsp;-&nbsp; Inserts markup that appears to highlight text
  * @param {Boolean} highlightCallback  &nbsp;-&nbsp; If defined, will execute this code for highlighting text instead of the built-in highlighting code
  *
  */
  function ListFilter(settings) {
    this.settings = $.extend({}, defaults, settings);
    Soho.logTimeStart('ListFilter');
    this.init();
    Soho.logTimeEnd('ListFilter');
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
        { setting: this.settings.filterMode, limits: filterModes, preset: defaults.filterMode }
      ];

      for (var i = 0; i < checks.length; i++) {
        setReasonableDefaults(checks[i].setting, checks[i].limits, checks[i].preset);
      }

      return this;
    },

    /**
    * Run the filter on the list for the given sreach term.
    * @param {Array} list  &nbsp;-&nbsp; The array to search.
    * @param {String} term  &nbsp;-&nbsp; The term to look for.
    * @returns {Array}
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

      function searchItemIterator(item) {
        var isString = typeof item === 'string',
          text = (isString ? item : $(item).text()),
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

    updated: function(settingsObj) {
      this.settings = $.extend({}, this.settings, settingsObj);
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

  // Add it to the Window for use
  window.ListFilter = ListFilter;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
