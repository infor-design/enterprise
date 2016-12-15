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
          showAllResults: true,
          categories: undefined, // If defined as an array, displays a dropdown containing categories that can be used to filter results.
          categoryMultiselect: false, // If true, creates a multiselectable Categories list
          showCategoryText: false, // If true, will show any available categories that are selected to the left of the Dropdown field.
          source: undefined,
          template: undefined, // Template that can be passed
          clearable: false //Has an X to clear
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function SearchField(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    SearchField.prototype = {

      init: function() {
        this.inlineLabel = this.element.closest('label');
        this.inlineLabelText = this.inlineLabel.find('.label-text');
        this.isInlineLabel = this.element.parent().is('.inline');
        this.build().setupEvents();
      },

      build: function() {
        var self = this;

        this.optionsParseBoolean();
        this.label = this.element.prev('label, .label');

        // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
        // Autocomplete settings are fed the same settings as Searchfield
        if (this.settings.source || this.element.attr('data-autocomplete')) {
          this.element.autocomplete(this.settings);
        }
        this.autocomplete = this.element.data('autocomplete');

        //Prevent browser typahead
        this.element.attr('autocomplete','off');

        this.wrapper = this.element.parent('.searchfield-wrapper');
        if (!this.wrapper || !this.wrapper.length) {
          if (this.isInlineLabel) {
            this.wrapper = this.inlineLabel.addClass('searchfield-wrapper');
          }
          else {
            this.wrapper = this.element.wrap('<span class="searchfield-wrapper"></span>').parent();
          }

          // Label for toolbar-inlined searchfields needs to be inside the wrapper to help with positioning.
          if (this.element.closest('.toolbar').length) {
            this.label.prependTo(this.wrapper);
          }

          var customClasses = ['context', 'alternate'],
            c;
          for (var i = 0; i < customClasses.length; i++) {
            if (this.element.hasClass(customClasses[i])) {
              c = customClasses[i];
              this.wrapper.addClass(c);
              this.element.removeClass(c);
            }
          }
        }

        // Add Icon
        var icon = this.wrapper.find('.icon:not(.icon-dropdown)');
        if (!icon || !icon.length) {
          icon = $.createIconElement('search').insertAfter(this.element).icon();
        }

        // Change icon to a trigger button if we're dealing with categories
        if (this.hasCategories()) {
          this.wrapper.addClass('has-categories');

          this.button = icon.parent('.searchfield-category-button');
          if (!this.button.length) {
            this.button = icon.wrap('<button type="button" class="btn searchfield-category-button"></button>').parent();
          }
          icon = this.button;

          if (this.settings.showCategoryText) {
            this.wrapper.addClass('show-category');
          }

          var ddIcon = icon.find('.icon-dropdown');
          if (!ddIcon.length) {
            ddIcon = $.createIconElement({ classes: 'icon-dropdown', icon: 'dropdown' }).icon();
          }
          ddIcon.appendTo(icon);

          this.list = this.wrapper.find('ul.popupmenu');
          if (!this.list || !this.list.length) {
            this.list = $('<ul class="popupmenu"></ul>');
          }

          // Handle Single vs Multi-Selectable Lists
          var categoryListType = this.settings.categoryMultiselect ? 'is-multiselectable' : 'is-selectable';
          this.list.addClass(categoryListType);
          var removeListType = 'is-selectable';
          if (!this.settings.categoryMultiselect) {
            removeListType = 'is-multiselectable';
          }
          this.list.removeClass(removeListType);

          this.list.empty();

          this.settings.categories.forEach(function(val) {
            self.list.append('<li><a href="#">' + val + '</a></li>');
          });
          this.list.insertAfter(icon);

          icon.popupmenu({
            menu: this.list,
            offset: {
              y: 10
            }
          });
        }

        // Swap icon position to in-front if we have an "alternate" class.
        if (this.wrapper.hasClass('context') || this.wrapper.hasClass('has-categories') ) {
          icon.insertBefore(this.element);
        }

        if (this.settings.clearable) {
          this.element.clearable();
        }

        return this;
      },

      // Set boolean value if strings
      optionsParseBoolean: function() {
        var i, l,
          arr = [
            'showAllResults',
            'categoryMultiselect',
            'showCategoryText',
            'clearable'
          ];
        for (i=0,l=arr.length; i<l; i++) {
          this.settings[arr[i]] = this.parseBoolean(this.settings[arr[i]]);
        }
      },

      hasCategories: function() {
        return this.settings.categories && $.isArray(this.settings.categories) && this.settings.categories.length > 0;
      },

      setupEvents: function() {
        var self = this;

        this.element.on('updated.searchfield', function() {
          self.updated();
        }).on('focus.searchfield', function(e) {
          self.handleFocus(e);
        }).on('blur.searchfield', function(e) {
          self.handleBlur(e);
        }).onTouchClick('searchfield', '.searchfield')
        .on('click.searchfield', function(e) {
          self.handleClick(e);
        }).on('keydown.searchfield', function(e) {
          self.handleKeydown(e);
        }).on('beforeopen.searchfield', function(e, menu) { // propagates from Autocomplete's Popupmenu
          self.handlePopupBeforeOpen(e, menu);
        });

        this.wrapper.on('mouseenter.searchfield', function() {
          $(this).addClass('is-hovered');
        }).on('mouseleave.searchfield', function() {
          $(this).removeClass('is-hovered');
        });

        if (this.hasCategories()) {
          this.button.on('selected.searchfield deselected.searchfield', function(e, anchor, toggleMethod) {
            self.handleCategorySelection(e, anchor, toggleMethod);
          }).on('focus.searchfield', function(e) {
            self.handleCategoryFocus(e);
          }).on('blur.searchfield', function(e) {
            self.handleCategoryBlur(e);
          }).on('close.searchfield', function(e) { // Popupmenu Close
            self.handlePopupClose(e);
          });
        }

        // Insert the "view more results" link on the Autocomplete control's "populated" event
        this.element.on('populated.searchfield', function(e, items) {
          if (items.length > 0) {
            if (self.settings.showAllResults) {
              self.addMoreLink();
            }
          } else {
            self.addNoneLink();
          }
        });

        // Override the 'click' listener created by Autocomplete (which overrides the default Popupmenu method)
        // to act differntly when the More Results link is activated.
        this.element.on('listopen.searchfield', function(e, items) {
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

            self.element.trigger('selected', [a, ret]);
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

      recalculateParent: function() {
        var toolbar = this.element.closest('.toolbar');
        if (toolbar.length) {
          // Setup a timed event that will send a signal to a parent toolbar, telling it to recalculate which buttons are visible.
          // Needs to be done after a CSS animation on the searchfield finishes.
          // TODO: Bolster this to work with CSS TransitonEnd
          setTimeout(function() {
            toolbar.triggerHandler('recalculate-buttons');
          }, 300);
        }
      },

      // Activates a toolbar-based searchfield and keeps it "open".  Instead of closing it on blur, sets up
      // an explicit, out-of-bounds click/tap that will serve to close it when the user acts.
      setAsActive: function() {
        if (this.element.hasClass('active')) {
          return;
        }

        var self = this;

        // Activate
        this.element.addClass('active');
        var toolbar = this.element.closest('.toolbar, [class$="-toolbar"]');
        if (toolbar.length) {
          toolbar.addClass('searchfield-active');
        }

        // if Toolbar Searchfield, allow that control to handle adding this class
        if (!this.wrapper.is('.toolbar-searchfield-wrapper')) {
          this.wrapper.addClass('has-focus');
        }

        setTimeout(function() {
          function deactivate(e) {
            var target = $(e.target),
              elems = self.element.add(self.element.parent('.searchfield-wrapper'));
            if (target.is(elems)) {
              return;
            }

            //self.element.removeClass('active').blur();
            toolbar.removeClass('searchfield-active');
            $(document).offTouchClick('searchfield').off('click.searchfield');
          }

          $(document).onTouchClick('searchfield', '.searchfield').on('click.searchfield', function(e) {
            deactivate(e);
          });

          self.element.one('blur.searchfield', function(e) {
            deactivate(e);
          });
        }, 100);
        this.recalculateParent();
      },

      handleFocus: function() {
        this.setAsActive();
      },

      handleBlur: function() {
        var self = this;
        this.recalculateParent();

        if (!this.wrapper.is('.toolbar-searchfield-wrapper')) {
          setTimeout(function() {
            self.wrapper.removeClass('has-focus');
          }, 10);
        }

      },

      handleClick: function() {
        this.setAsActive();
      },

      handleKeydown: function(e) {
        var key = e.which;

        if (key === 27) {
          this.clear();
        }
      },

      // Modifies the menu at $('#autocomplete-list') to propagate/remove style classes on the Searchfield element.
      handlePopupBeforeOpen: function(e, menu) {
        if (!menu) {
          return;
        }

        var contextClassMethod = this.wrapper.hasClass('context') ? 'addClass' : 'removeClass',
          altClassMethod = this.wrapper.hasClass('alternate') ? 'addClass' : 'removeClass';

        menu[contextClassMethod]('context');
        menu[altClassMethod]('alternate');

        return true;
      },

      handleCategorySelection: function(e, anchor) {
        if (!this.settings.showCategoryText) {
          return;
        }

        var
          text = '' + anchor.text().trim(),
          button = this.wrapper.find('.btn'),
          span = button.find('span');

        if (!button || !button.length) {
          return;
        }

        if (!span || !span.length) {
          span = $('<span class="category"></span>').insertAfter(button.find('.icon').first());
        }

        span.empty();

        var item = this.list.find('.is-checked');
        if (!item.length) {
          return;
        }

        if (item.length > 1) {
          text = item.length + ' ' + Locale.translate('Selected');
        } else {
          text = item.text().trim();
        }

        span.text(text);
      },

      handleCategoryFocus: function() {
        // if Toolbar Searchfield, allow that control to handle adding this class
        if (this.wrapper.is('.toolbar-searchfield-wrapper')) {
          return;
        }

        this.wrapper.addClass('has-focus');
      },

      handleCategoryBlur: function() {
        // if Toolbar Searchfield, allow that control to handle adding this class
        if (this.wrapper.is('.toolbar-searchfield-wrapper')) {
          return;
        }

        this.wrapper.removeClass('has-focus');
      },

      handlePopupClose: function() {
        return this.setAsActive();
      },

      clear: function() {
        this.element.val('').trigger('change').focus();
      },

      addMoreLink: function() {
        var list = $('#autocomplete-list'),
          val = this.element.val();

        $('<li class="separator" role="presentation"></li>').appendTo(list);
        var more = $('<li role="presentation"></li>').appendTo(list);
        this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('AllResults') + ' "' + val + '"</span>').appendTo(more);
      },

      addNoneLink: function() {
        var list = $('#autocomplete-list'),
          none = $('<li role="presentation"></li>').appendTo(list);

        this.noneLink = $('<a href="#" class="no-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('NoResults') + '</span>').appendTo(none);
      },

      // Triggered by the "updated.searchfield" event
      updated: function() {
        this.teardown().init();
      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      // Performs the usual Boolean coercion with the exception of
      // the strings "false" (case insensitive) and "0"
      parseBoolean: function(b) {
        return !(/^(false|0)$/i).test(b) && !!b;
      },

      teardown: function() {
        this.element.off('updated.searchfield focus.searchfield blur.searchfield click.searchfield keydown.searchfield beforeopen.searchfield listopen.searchfield');

        if (this.autocomplete) {
          this.autocomplete.destroy();
        }

        if (this.wrapper.hasClass('context')) {
          this.element.addClass('context');
        }

        this.element.next('.icon').remove();
        if (this.element.parent().hasClass('searchfield-wrapper')) {
          this.element.unwrap();
        }

        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new SearchField(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
