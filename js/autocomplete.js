/**
* Autocomplete for inputs and searches
* @name autocomplete
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
        source: ['Alabama', 'Alaska', 'California', 'Delaware'] //Defines the data to use, must be specified.
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      //TODO: Idea is that data-autocomplete can be a url, 'source' or an array
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
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
        var self = this;

        term = term.toLowerCase();

        //append the list
        this.list = $('#autocomplete-list');
        if (this.list.length === 0) {
          this.list = $('<ul id="autocomplete-list" aria-expanded="true"></ul>').appendTo('body');
        }

        this.list.css({'height': 'auto', 'width': this.element.outerWidth()}).addClass('autocomplete');
        this.list.empty();

        for (var i = 0; i < items.length; i++) {
          var option = (typeof items[i] === 'string' ? items[i] : items[i].label);

          if (option.toLowerCase().indexOf(term) > -1) {
            //Highlight Term
            var exp = new RegExp('(' + term + ')', 'gi') ;
            option = option.replace(exp, '<i>$1</i>');
            var listOption = $('<li id="ac-list-option'+ i +'" role="option" role="listitem" ><a href="#" tabindex="-1">' + option + '</a></li>');
            if (typeof items[i] !== 'string') {
              listOption.attr('data-value', items[i].value);
            }
            self.list.append(listOption);
          }
        }

        this.element.addClass('is-open')
          .popupmenu({menuId: 'autocomplete-list', trigger: 'immediate', autoFocus: false})
          .on('close.autocomplete', function () {
            self.list.parent('.popupmenu-wrapper').remove();
            self.element.removeClass('is-open');
          });

        self.list.off('click.autocomplete').on('click.autocomplete', 'a', function (e) {
          var a = $(e.currentTarget),
            ret = a.text();

          self.element.val(a.text()).attr('aria-activedescendant', a.parent().attr('id'));

          if (a.parent().attr('data-value')) {
            for (var i = 0; i < items.length; i++) {
              if (items[i].value.toString() === a.parent().attr('data-value')) {
                ret = items[i];
              }
            }
          }

          self.element.trigger('selected', ret);

          e.preventDefault();
          return false;
        });

        var all = self.list.find('a').on('focus', function () {
          var anchor = $(this);
          all.parent('li').removeClass('is-selected');
          anchor.parent('li').addClass('is-selected');
          self.element.val(anchor.text());
        });

        this.noSelect = true;
        this.element.focus();
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

            //This checks all printable characters
            if (e.which === 0 || e.charCode === 0 || e.ctrlKey || e.metaKey || e.altKey) {
              return;
            }

            if (typeof settings.source === 'function') {
              var response = function(data) {
                self.element.removeClass('is-busy');  //TODO: Need style for this
                self.openList(buffer, data);
              };

              self.element.addClass('is-busy');
              settings.source(buffer, response);

            } else {
              self.openList(buffer, settings.source);
            }

          }, 500);  //no pref for this lets keep it simple.

        }).on('focus.autocomplete', function () {
          if (self.noSelect) {
            self.noSelect = false;
            return;
          }

          //select all
          setTimeout(function () {
            self.element.select();
          }, 10);
        });
      },

      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('keypress.autocomplete focus.autocomplete');
      }
    };

    // Initialize Once
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
