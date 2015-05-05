/**
* Searchfield Control (TODO: bitly link to soho xi docs)
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

  $.fn.searchfield = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'searchfield',
        defaults = {
          allResultsCallback: undefined,
          source: [],
          template: undefined // Template that can be passed
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
        this.build().setupEvents();
      },

      build: function() {
        if (!this.element.parent().hasClass('searchfield-wrapper')) {
          this.wrapper = this.element.wrap('<div class="searchfield-wrapper"></div>').parent();
        }

        // Add Icon
        if (this.wrapper.find('.icon').length === 0) {
          $('<svg class="icon"><use xlink:href="#icon-search-field"/></svg>').insertAfter(this.element);
        }

        // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
        // Autocomplete settings are fed the same settings as Searchfield
        this.element.autocomplete(this.settings);
        this.autocomplete = this.element.data('autocomplete');

        //Prevent browser typahead
        this.element.attr('autocomplete','off');
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
          } else {
            self.addNoneLink();
          }
        });

        // Override the 'click' listener created by Autocomplete (which overrides the default Popupmenu method)
        // to act differntly when the More Results link is activated.
        this.element.on('autocomplete-list-open.searchfield', function(e, items) {
          var list = $('#autocomplete-list');

          list.off('click').on('click.autocomplete', 'a', function (e) {
            var a = $(e.currentTarget),
              ret = a.text().trim(),
              isMoreLink = a.hasClass('more-results'),
              isNoneLink = a.hasClass('no-results');

            if (!isMoreLink && !isNoneLink) {
              // Only write text into the field on a regular result pick.
              self.element.attr('aria-activedescendant', a.parent().attr('id'));
            }

            if (isMoreLink) {
              // Trigger callback if one is defined
              var callback = self.settings.allResultsCallback;
              if (callback && typeof callback === 'function') {
                callback(ret);
              }
            }

            if (a.parent().attr('data-value')) {
              for (var i = 0; i < items.length; i++) {
                if (items[i].value.toString() === a.parent().attr('data-value')) {
                  ret = items[i];
                }
              }
            }

            self.element.trigger('selected', [a]);

            self.element.data('popupmenu').close();

            e.preventDefault();
            return false;
          });

          // Override the focus event created by the Autocomplete control to make the more link
          // and no-results link blank out the text inside the input.
          list.find('.more-results, .no-results').off('focus').on('focus.searchfield', function () {
            var anchor = $(this);
            list.find('li').removeClass('is-selected');
            anchor.parent('li').addClass('is-selected');
            self.element.val('');
          });

        });

        return this;
      },

      addMoreLink: function() {
        var list = $('#autocomplete-list'),
          val = this.element.val();

        $('<li class="separator" role="presentation"></li>').appendTo(list);
        var more = $('<li role="presentation"></li>').appendTo(list);
        this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('AllResults') + ' <i>' + val + '</i></span>').appendTo(more);
      },

      addNoneLink: function() {
        var list = $('#autocomplete-list'),
          none = $('<li role="presentation"></li>').appendTo(list);

        this.noneLink = $('<a href="#" class="no-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('NoResults') + '</span>').appendTo(none);
      },

      // Triggered by the "updated.searchfield" event
      update: function() {
        this.autocomplete.destroy();
        this.build();
      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.element.off('updated.searchfield populated.searchfield');
        this.autocomplete.destroy();

        this.element.next('.icon').remove();
        if (this.element.parent().hasClass('searchfield-wrapper')) {
          this.element.unwrap();
        }
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.update();
      } else {
        instance = $.data(this, pluginName, new SearchField(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
