/**
* ListFilter - Abstracted search/filter for use in other controls
* TODO: Add Docs Link
*/

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
      filterMode: 'startsWith', // see "filterModes" var for possible values
      highlightMatchedText: false, // inserts markup that appears to highlight text
      highlightCallback: null // if defined, will execute this code for highlighting text instead of the built-in highlighting code
    },
    filterModes = ['startsWith', 'contains'];

  function ListFilter(settings) {
    this.settings = $.extend({}, defaults, settings);
    this.init();
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
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

    filter: function(list, term) {
      if (!list) {
        return false;
      }

      // Check incoming list
      if (!isArray(list) && !(list instanceof jQuery)) {
        return false;
      }

      var self = this,
        items = [],
        isJQuery = false;

      if (!isArray(list)) {
        if (list instanceof jQuery || typeof list === 'object') {
          list = $.makeArray(list);
          isJQuery = true;
        }
      }

      function searchItemIterator(item) {
        var isString = typeof item === 'string',
          text = (isString ? item : $(item).html()),
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

          // Highlight the search term in this result if the current settings allow for it
          if (self.settings.highlightMatchedText) {
            var cb = self.settings.highlightCallback;

            if (cb && typeof cb === 'function') {
              text = cb(text, term);
            } else {
              text = (function searchItemHighlighter(itemText, term) {
                // Base iterator for highlighting valid, searched items.
                // This won't run if a callback is present.
                var exp = new RegExp('(' + term + ')', 'gi');
                itemText = itemText.replace(exp, '<i>$1</i>');
                return itemText;
              })(text, term);
            }

            // Replace the content with
            if (isString) {
              item = text;
            } else {
              $(item).html(text);
            }
          }

          items.push(item);
        }

        return;
      }

      // Run the iterator
      list.forEach(searchItemIterator);

      // If we originally took in a jQuery selector, rebuild that jQuery selector with the relevant results.
      if (isJQuery) {
        var jqSelector = $();
        items.forEach(function(item) {
          jqSelector = jqSelector.add($(item));
        });

        items = jqSelector;
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
