/**
* Autocomplete for inputs and searches
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  $.fn.autocomplete = function(options) {

    // Settings and Options
    var pluginName = 'autocomplete',
      defaults = {
        source: [], //Defines the data to use, must be specified.
        template: undefined // If defined, use this to draw the contents of each search result instead of the default draw routine.
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Autocomplete(element) {
      this.settings = settings;
      this.element = $(element);
      this.init();
    }

    // Check if an object is an array
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
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
        if (this.element.attr('data-autocomplete') !== 'source') {
          this.settings.source = this.element.attr('data-autocomplete');
        }

        this.addMarkup();
        this.handleEvents();
      },

      addMarkup: function () {
        this.element.addClass('autocomplete').attr('role', 'combobox')
          .attr('aria-owns', 'autocomplete-list')
          .attr('aria-autocomplete', 'list')
          .attr('aria-activedescendant', '');
      },

      openList: function (term, items) {
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

        // Pre-compile template.
        // Try to get an element first, and use its contents.
        // If the string provided isn't a selector, attempt to use it as a string, or fall back to the default template.
        var templateAttr = $(this.element.attr('data-tmpl'));
        this.tmpl = $(templateAttr).length ?
          $(templateAttr).text() :
          typeof templateAttr === 'string' ?
          templateAttr :
          $(this.settings.template).length ?
          $(this.settings.template).text() :
          typeof this.settings.template === 'string' ?
          this.settings.template :
          resultTemplate;

        // Error out if the Template system can't be found
        if (!Tmpl) {
          throw new Error('Could not load SoHo Xi Template Control');
        }

        for (var i = 0; i < items.length; i++) {
          var isString = typeof items[i] === 'string',
            option = (isString ? items[i] : items[i].label),
            baseData = {
              label: option
            },
            dataset = isString ? baseData : $.extend(baseData, items[i]),
            parts = option.toLowerCase().split(' ');
            containsTerm = false;

          $.each(parts, function() {
            if (this.indexOf(term) === 0) {
              containsTerm = true;
              return false;
            }
          });

          if (containsTerm) {
            matchingOptions.push(option);

            // Build the dataset that will be submitted to the template
            var regex = new RegExp('(' + term + ')', 'i');

            dataset.listItemId = 'ac-list-option' + i;
            dataset.label = option.replace(regex, '<i>$1</i>');
            dataset.hasValue = !isString && items[i].value !== undefined;

            if (dataset.hasValue) {
              dataset.value = items[i].value;
            }

            if (Tmpl) {
              var compiledTmpl = Tmpl.compile(this.tmpl),
                renderedTmpl = compiledTmpl.render(dataset);

              self.list.append(renderedTmpl);
            }
          }
        }

        this.element.addClass('is-open')
          .popupmenu({menuId: 'autocomplete-list', trigger: 'immediate', autoFocus: false})
          .on('close.autocomplete', function () {
            self.list.parent('.popupmenu-wrapper').remove();
            self.element.removeClass('is-open');
          });

        this.element.trigger('populated', [matchingOptions]);

        // Overrides the 'click' listener attached by the Popupmenu plugin

        self.list.off('click').on('click.autocomplete', 'a', function (e) {
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

          self.element.trigger('selected', [a]);
          self.element.data('popupmenu').close();

          e.preventDefault();
          return false;
        });

        var all = self.list.find('a').on('focus', function () {
          var anchor = $(this);
          all.parent('li').removeClass('is-selected');
          anchor.parent('li').addClass('is-selected');
          self.element.val(anchor.text().trim());
        });

        this.noSelect = true;
        this.element.trigger('autocomplete-list-open', items);
      },

      handleEvents: function () {
        //similar code as dropdown but close enough to be dry
        var buffer = '', timer, self = this;

        this.element.on('keypress.autocomplete', function (e) {
          var field = $(this);
          clearTimeout(timer);

          if (e.altKey && e.keyCode === 40) {  //open list
            self.openList(field.val(), settings.source);
            return;
          }

          timer = setTimeout(function () {

            buffer = field.val();
            if (buffer === '') {
              return;
            }
            buffer = buffer.toLowerCase();

            //This checks all printable characters - except backspace
            if (e.which === 0 || (e.charCode === 0 && e.which !== 8) || e.ctrlKey || e.metaKey || e.altKey) {
              return;
            }

            var sourceType = typeof settings.source,
              done = function(searchTerm, response) {
                self.element.removeClass('is-busy');  //TODO: Need style for this
                self.element.trigger('requestend', [searchTerm, response]);
              };

            self.element
              .addClass('busy')
              .trigger('requeststart', [buffer]);

            if (sourceType === 'function') {
              // Call the 'source' setting as a function with the done callback.
              settings.source(buffer, done);
            } else if (sourceType === 'object') {
              // Use the 'source' setting as pre-existing data.
              // Sanitize accordingly.
              var sourceData = isArray(settings.source) ? settings.source : [settings.source];
              done(buffer, sourceData);
            } else {
              // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
              var sourceURL = settings.source.toString(),
                request = $.getJSON(sourceURL + buffer);

              request.done(function(data) {
                done(buffer, data);
              }).fail(function() {
                console.warn('Request to ' + sourceURL + buffer + ' could not be processed...');
                done(buffer, []);
              });
            }

          }, 500); //no pref for this lets keep it simple.

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

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      destroy: function() {
        var popup = this.element.data('popupmenu');
        if (popup) {
          popup.destroy();
        }

        this.element.off('keypress.autocomplete focus.autocomplete requestend.autocomplete');
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
      }
    });
  };

}));
