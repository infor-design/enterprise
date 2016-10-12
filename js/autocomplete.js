/**
* Autocomplete for inputs and searches
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

  $.fn.autocomplete = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'autocomplete',
      defaults = {
        source: [], //Defines the data to use, must be specified.
        template: undefined, // If defined, use this to draw the contents of each search result instead of the default draw routine.
        filterMode: 'startsWith',  // startsWith and contains Supported - false will not client side filter
        delay: 300, // delay is the delay between key strokes on the keypad before it thinks you stopped typing
        width: null, //width of the auto complete menu
        offset: null //left or top offset
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Autocomplete(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Default Autocomplete Result Item Template
    var resultTemplate = '<li id="{{listItemId}}" {{#hasValue}}data-value="{{value}}"{{/hasValue}} role="listitem">' + '\n\n' +
      '<a href="#" tabindex="-1">' + '\n\n' +
        '<span>{{{label}}}</span>' + '\n\n' +
      '</a>' + '\n\n' +
    '</li>';

    // Plugin Object
    Autocomplete.prototype = {

      init: function() {
        // data-autocomplete can be a url, 'source' or an array
        var data = this.element.attr('data-autocomplete');
        if (data && data !== 'source') {
          this.settings.source = data;
        }

        this.addMarkup();
        this.handleEvents();
      },

      addMarkup: function () {
        this.element.addClass('autocomplete').attr({
          'role': 'combobox',
          'autocomplete': 'off'
        });
      },

      isLoading: function() {
        return this.element.hasClass('is-loading') && this.element.hasClass('is-blocked');
      },

      openList: function (term, items) {
        if (this.element.is('[disabled], [readonly]') || this.isLoading()) {
          return;
        }

        var self = this,
          matchingOptions = [];

        term = term.toLowerCase();

        //append the list
        this.list = $('#autocomplete-list');
        if (this.list.length === 0) {
          this.list = $('<ul id="autocomplete-list" aria-expanded="true"></ul>').appendTo('body');
        }

        this.list.css({'height': 'auto', 'width': this.element.outerWidth()}).addClass('autocomplete');
        this.list.empty();

        if (this.settings.width) {
          this.list.css({'width': this.settings.width});
        }

        // Pre-compile template.
        // Try to get an element first, and use its contents.
        // If the string provided isn't a selector, attempt to use it as a string, or fall back to the default template.
        var templateAttr = $(this.element.attr('data-tmpl'));
        this.tmpl = $(templateAttr).length ? $(templateAttr).text() :
          typeof templateAttr === 'string' ? templateAttr :
          $(this.settings.template).length ? $(this.settings.template).text() :
          typeof this.settings.template === 'string' ? this.settings.template :
          resultTemplate;

        for (var i = 0; i < items.length; i++) {
          var isString = typeof items[i] === 'string',
            option = (isString ? items[i] : items[i].label),
            baseData = {
              label: option
            },
            dataset = isString ? baseData : $.extend(baseData, items[i]),
            parts = option.split(' '),
            containsTerm = !this.settings.filterMode ? true : false;

          if (this.settings.filterMode === 'startsWith') {
              for (var a = 0; a < parts.length; a++) {
                if (parts[a].toLowerCase().indexOf(term) === 0) {
                  containsTerm = true;
                }
              }

              //Direct Match
              if (option.toLowerCase().indexOf(term) === 0) {
                containsTerm = true;
              }

              if (term.indexOf(' ') > 0 && option.toLowerCase().indexOf(term) > 0) {
                //Partial dual word match
                containsTerm = true;
              }

          }

          if (this.settings.filterMode === 'contains') {
            if (option.toLowerCase().indexOf(term) >= 0) {
              containsTerm = true;
            }
          }

          if (containsTerm) {
            matchingOptions.push(option);

            // Build the dataset that will be submitted to the template
            dataset.listItemId = 'ac-list-option' + i;

            if (this.settings.filterMode === 'contains') {
              dataset.label = dataset.label.replace(new RegExp('(' + term + ')', 'ig'), '<i>$1</i>');
            } else {
              dataset.label = option.toLowerCase().indexOf(term)===0 ? '<i>' + option.substr(0,term.length) + '</i>' + option.substr(term.length) : option;

              var pos = option.toLowerCase().indexOf(term);
              if (pos > 0) {
                dataset.label = option.substr(0, pos) + '<i>' + option.substr(pos, term.length) + '</i>' + option.substr(term.length + pos);
              }
            }

            dataset.hasValue = !isString && items[i].value !== undefined;

            if (dataset.hasValue) {
              dataset.value = items[i].value;
            }

            if (typeof Tmpl !== 'undefined') {
              var compiledTmpl = Tmpl.compile(this.tmpl),
                renderedTmpl = compiledTmpl.render(dataset);

              self.list.append(renderedTmpl);
            } else {
              var listItem = $('<li role="listitem"></li>');
              listItem.attr('id', dataset.listItemId);
              listItem.attr('data-value', dataset.value);
              listItem.append('<a href="#" tabindex="-1"><span>' + dataset.label + '</span></a>');
              self.list.append(listItem);
            }
          }
        }

        this.element.addClass('is-open')
          .popupmenu({menuId: 'autocomplete-list', ariaListbox: true, mouseFocus: false, trigger: 'immediate', autoFocus: false})
          .on('close.autocomplete', function () {
            self.list.parent('.popupmenu-wrapper').remove();
            self.element.removeClass('is-open');
          });

        this.element.trigger('populated', [matchingOptions]);

        // Overrides the 'click' listener attached by the Popupmenu plugin

        self.list.off('click touchend').on('touchend.autocomplete click.autocomplete', 'a', function (e) {
          var a = $(e.currentTarget),
            ret = a.text().trim();

          self.element.attr('aria-activedescendant', a.parent().attr('id'));

          if (a.parent().attr('data-value')) {
            for (var i = 0; i < items.length; i++) {
              if (items[i].value.toString() === a.parent().attr('data-value')) {
                ret = items[i];
              }
            }
          }

          self.element
            .trigger('selected', [a, ret])
            .focus()
            .data('popupmenu').close();

          e.preventDefault();
          return false;
        });

        var all = self.list.find('a').on('focus.autocomplete touchend.autocomplete', function () {
          var anchor = $(this),
            text = anchor.text().trim();

          if (anchor.find('.display-value').length > 0) {
            text = anchor.find('.display-value').text().trim();
          }

          all.parent('li').removeClass('is-selected');
          anchor.parent('li').addClass('is-selected');

          self.element.val(text).focus();
        });

        if (this.settings.offset && this.settings.offset.left) {
          this.list.parent().css('left', parseInt(this.list.parent().css('left')) + this.settings.offset.left + 'px');
        }

        if (this.settings.offset && this.settings.offset.top) {
          this.list.parent().css('top', parseInt(this.list.parent().css('top')) + this.settings.offset.top + 'px');
        }

        // As chars are typed into the edit field, nothing was announced to indicate
        // that a value has been suggested, for the non-sighted user an offscreen span
        // added and will remove soon popup close that includes aria-live="polite"
        // which have the first suggested item automatically announced when it
        // appears without moving focus.
        self.list.parent('.popupmenu-wrapper').append(''+
          '<span id="ac-is-arialive" aria-live="polite" class="audible">'+
            $.trim(this.list.find('>li:first-child').text()) +
          '</span>');

        this.noSelect = true;
        this.element.trigger('listopen', [items]);
      },

      handleEvents: function () {
        //similar code as dropdown but close enough to be dry
        var buffer = '',
          timer, selected,
          self = this;

        this.element.on('updated.autocomplete', function() {
          self.updated();
        }).on('keydown.autocomplete', function(e) {
          if (self.isLoading()) {
            e.preventDefault();
            return false;
          }

          var excludes = 'li:not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)';
          //Down - select next
          if (e.keyCode === 40 && self.list && self.list.is(':visible')) {
            selected = self.list.find('.is-selected');
            if (selected.length) {
              self.noSelect = true;
              selected.removeClass('is-selected is-focused');
              selected.next(excludes).addClass('is-selected').find('a').focus();
              e.preventDefault();
              e.stopPropagation();
            }
          }

          //Up select prev
          if (e.keyCode === 38 && self.list && self.list.is(':visible')) {
            selected = self.list.find('.is-selected');
            if (selected.length) {
              self.noSelect = true;
              selected.removeClass('is-selected is-focused');
              selected.prev(excludes).addClass('is-selected').find('a').focus();
              e.preventDefault();
              e.stopPropagation();
            }
          }

          if ((e.keyCode === 9 || e.keyCode === 13) && self.list && self.list.is(':visible')) {
            self.list.find('.is-selected').find('a').trigger('click');
            if (self.element.data('popupmenu')) {
              self.element.data('popupmenu').close();
            }
            e.stopPropagation();
            e.preventDefault();
          }

          if (e.keyCode === 8 && self.list) {
            self.element.trigger('keypress');
          }

        })
        .on('keypress.autocomplete', function (e) {
          if (self.isLoading()) {
            e.preventDefault();
            return false;
          }

          var field = $(this);
          clearTimeout(timer);

          if (e.altKey && e.keyCode === 40) {  //open list
            self.openList(field.val(), self.settings.source);
            return;
          }

          timer = setTimeout(function () {
            if (self.isLoading()) {
              return;
            }

            buffer = field.val();
            if (buffer === '') {
              if (self.element.data('popupmenu')) {
                self.element.data('popupmenu').close();
              }
              return;
            }
            buffer = buffer;

            //This checks all printable characters - except backspace
            if (e.which === 0 || (e.charCode === 0 && e.which !== 8) || e.ctrlKey || e.metaKey || e.altKey) {
              return;
            }

            var sourceType = typeof self.settings.source,
              done = function(searchTerm, response) {
                self.element.triggerHandler('complete'); // For Busy Indicator
                self.element.trigger('requestend', [searchTerm, response]);
              };

            self.element.triggerHandler('start'); // For Busy Indicator
            self.element.trigger('requeststart', [buffer]);

            if (sourceType === 'function') {
              // Call the 'source' setting as a function with the done callback.
              self.settings.source(buffer, done);
            } else if (sourceType === 'object') {
              // Use the 'source' setting as pre-existing data.
              // Sanitize accordingly.
              var sourceData = $.isArray(self.settings.source) ? self.settings.source : [self.settings.source];
              done(buffer, sourceData);
            } else if (!self.settings.source) {
              return;
            } else {
              // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
              var sourceURL = self.settings.source.toString(),
                request = $.getJSON(sourceURL + buffer);

              request.done(function(data) {
                done(buffer, data);
              }).fail(function() {
                done(buffer, []);
              });
            }

          }, self.settings.delay);

        }).on('focus.autocomplete', function () {
          if (self.noSelect) {
            self.noSelect = false;
            return;
          }

          //select all
          setTimeout(function () {
            self.element.select();
          }, 10);
        }).on('requestend.autocomplete', function(e, buffer, data) {
          self.openList(buffer, data);
        });
      },

      updated: function() {
        this.teardown().init();
        return this;
      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      teardown: function(){
        var popup = this.element.data('popupmenu');
        if (popup) {
          popup.destroy();
        }

        this.element.off('keypress.autocomplete focus.autocomplete requestend.autocomplete updated.autocomplete');
        return this;
      },

      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize Once
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Autocomplete(this, settings));
      } else {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
