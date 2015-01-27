/**
* Searchfield Control (TODO: bitly link to soho xi docs)
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

  $.fn.searchfield = function(options) {

    // Settings and Options
    var pluginName = 'searchfield',
        defaults = {
          source: ['Delaware', 'Maryland', 'New Brunswick', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'New York City', 'New Zealand', 'News', 'Pennsylvania', 'Texas'],
          allResultsCallback: undefined
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function SearchField(element) {
      this.settings = settings;
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    SearchField.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .setupEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {
        // TODO: Get Icon from Design Team
        //$('<svg class="icon"><use xlink:href="#icon-search"/></svg>').insertAfter(this.element);

        // Build Autocomplete Settings
        var acSettings = {};
        if (this.settings.source) {
          acSettings.source = this.settings.source;
        }

        // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
        this.element.autocomplete(acSettings);
        this.autocomplete = this.element.data('autocomplete');

        return this;
      },

      setupEvents: function() {
        var self = this;

        this.element.on('updated.searchfield', function() {
          self.update();
        });

        // Insert the "view more results" link on the Autocomplete control's "populated" event
        this.element.on('populated.searchfield', function(e, items) {
          if (items.length > 0 ) {
            self.addMoreLink();
          }
        });

        // Override the 'click' listener created by Autocomplete (which overrides the default Popupmenu method)
        // to act differntly when the More Results link is activated.
        this.element.on('autocomplete-list-open.searchfield', function(e, items) {
          var list = $('#autocomplete-list');

          list.off('click.autocomplete').on('click.autocomplete', 'a', function (e) {
            var a = $(e.currentTarget),
              ret = a.text();

            if (!a.hasClass('more-results')) {
              // Only write text into the field on a regular result pick.
              self.element.val(a.text()).attr('aria-activedescendant', a.parent().attr('id'));
            } else {
              self.element.val('');

              // Trigger callback if one is defined
              var callback = self.settings.allResultsCallback;
              if (callback && typeof callback === 'function') {
                callback();
              }
            }

            if (a.parent().attr('data-value')) {
              for (var i = 0; i < items.length; i++) {
                if (items[i].value.toString() === a.parent().attr('data-value')) {
                  ret = items[i];
                }
              }
            }

            e.preventDefault();
            return false;
          });
        });

        return this;
      },

      addMoreLink: function() {
        var list = $('#autocomplete-list'),
          val = this.element.val();

        $('<li class="separator" role="presentation"></li>').appendTo(list);
        var more = $('<li role="presentation"></li>').appendTo(list);
        this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>').html('All Results For <i>' + val + '</i>').appendTo(more); // TODO: Localize
      },

      // Triggered by the "updated.searchfield" event
      update: function() {
        this.autocomplete.destroy();
        this.element.build();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.element.off('updated.searchfield beforeOpen.searchfield');
        this.autocomplete.destroy();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new SearchField(this, settings));
      }
    });
  };
}));
