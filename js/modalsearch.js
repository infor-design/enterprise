/**
* Modal Search Control (TODO: bitly link to soho xi docs)
* Used Mostly for the Site, but could be used elsewhere with some modifications
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.modalsearch = function(options) {

    // Settings and Options
    var pluginName = 'modalsearch',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ModalSearch(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ModalSearch.prototype = {
      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {
        this.element.modal();
        this.modal = this.element.data('modal');
        this.overlay = this.modal.overlay;
        this.searchInput = this.modal.element.find('#big-search-field');
        this.searchResults = this.modal.element.find('.search-results-list');

        this.modal.element.add(this.overlay).addClass('modal-search');

        this.searchResults.empty().append($('<p class="search-result none">' + Locale.translate('NoResults') + '</p>'));

        return this;
      },

      handleEvents: function() {
        var self = this;

        // Disconnect the Modal plugin's resize event, because CSS can completely handle window resizing
        // now that we don't need to calculate margins.
        $(window).off('resize.modal-' + this.modal.id);

        $(document).on('keydown.modalsearch', function(e) {
          var key = e.which;
          if (key === 27) { // Escape
            if (self.modal.isOpen()) {
              self.modal.close();
            }
          }
        });

        this.searchInput.on('keydown.modalsearch', function(e) {
          var key = e.which;
          if (key === 13) { // Enter
            self.handleAjax();
          }
        });

        // Listen for the 'requestend' event produced by this Control in order to render Search Results.
        this.modal.element.on('requestend.modalsearch', function(e, term, results) {
          self.renderSearchResults(e, term, results);
        }).on('open.modalsearch', function() {
          self.searchInput.focus();
        }); // triggered by the Modal Control

        return this;
      },

      // NOTE: Duplicates some code that's also found in Autocomplete AJAX request... not super DRY
      // TODO: Make the AJAX code more DRY
      handleAjax: function() {
        var self = this,
          sourceURL = this.searchInput.attr('data-source') || undefined,
          term = this.searchInput.val();

        if (!sourceURL || sourceURL === undefined) {
          console.warn('No source available for modal search...'); // TODO: Localize;
          return false;
        }

        sourceURL = sourceURL.toString();

        var done = function(searchTerm, response) {
          self.element.removeClass('is-busy');  //TODO: Need style for this
          self.element.trigger('requestend', [searchTerm, response]);
        };

        self.element
          .addClass('busy')
          .trigger('requeststart', [term]);

        // Source is always a URL
        var request = $.getJSON(sourceURL + term);
        request.done(function(data) {
          done(term, data);
        }).fail(function() {
          console.warn('Request to ' + sourceURL + term + ' could not be processed...');
          done(term, []);
        });
      },

      // Gets results from the Site Search (powered by Craft CMS) and renders it into the search results section.
      // CraftCMS returns a pre-rendered HTML template, so just append the results to the Search Results section.
      renderSearchResults: function(e, term, results) {
        this.searchResults
          .empty()
          .append(results);
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $(document).off('keydown.modalsearch');
        this.modal.element.off('requestend.modalsearch open.modalsearch');
        this.searchInput.off('keydown.modalsearch');
        this.element.data('modal').destroy();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new ModalSearch(this, settings));
      }
    });
  };
}));
