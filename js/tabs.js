/**
* Responsive Tab Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
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

  // Used for changing the stacking order of jQuery events.  This is needed to override certain
  // Events invoked by other plugins.
  // http://stackoverflow.com/questions/2360655
  $.fn.bindFirst = function(name, fn) {
    this.on(name, fn);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        // take out the handler we just inserted from the end
        var handler = handlers.pop();
        // move it at the beginning
        handlers.splice(0, 0, handler);
    });
  };

  $.fn.tabs = function(options) {

    // Tab Settings and Options
    var pluginName = 'tabs',
        defaults = {
          propertyName: 'value'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this,
          header = null;

        self.container = $(this.element);

        //For each tab panel set the aria roles and hide it
        self.panels = self.container.children('div')
            .attr({'class': 'tab-panel', 'role': 'tabpanel'}).hide();

        self.panels.find('h2:first').attr('tabindex', '0');

        //Attach Tablist role and class to the tab headers container
        header = self.container.find('ul:first')
                    .attr({'class': 'tab-list', 'role': 'tablist',
                            'aria-multiselectable': 'false'});
        self.tablist = self.element.find('.tab-list');

        // Add the markup for the "More" button if it doesn't exist.
        if (self.tablist.next('.tab-more').length === 0) {
          var button = $('<button>').attr({'class': 'tab-more', 'type': 'button', 'tabindex': '-1'});
          button.append( $('<span>').text('More') );
          button.append( $('<svg>').attr({'class': 'icon', 'viewBox': '0 0 32 32'}) );
          var use = $(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
          button.find('svg').append(use);
          self.tablist.after(button);
          use[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-dropdown-arrow');
        }

        //for each item in the tabsList...
        self.anchors = header.find('li > a');
        self.anchors.each( function () {
          var a = $(this);

          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');

          //Attach click events to tab and anchor
          a.parent().on('click.tabs', function () {
            self.activate($(this).index());
            if (self.popupmenu) {
              self.popupmenu.close();
            }
            $(this).find('a').focus();
          });

          a.on('click.tabs', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).parent().trigger('click');
          }).on('keydown.tabs', function (e) {

            var currentLi = $(this).parent(),
              targetLi,
              key = e.which;

            if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || key < 32) {
              return;
            }

            switch(key) {
              case 38:
                e.preventDefault(); // jshint ignore:line
              case 37:
                targetLi = currentLi.prev();
                if (targetLi.length === 0) {
                  targetLi = self.container.find('li:last');
                }
                break;
              case 40:
                e.preventDefault(); // jshint ignore:line
              case 39:
                targetLi = currentLi.next();
                if (targetLi.length === 0) {
                  targetLi = self.container.find('li:first');
                }
                break;
            }

            // Use the matching option in the popup menu if the target is hidden by overflow.
            if (self.isTabOverflowed(targetLi)) {
              e.preventDefault();
              var oldIndex = self.tablist.find(targetLi).index();
              // setTimeout is used to bypass triggering of the keyboard when self.buildPopupMenu() is invoked.
              setTimeout(function() {
                self.buildPopupMenu(oldIndex);
              }, 0);
              return;
            }

            targetLi.find('a').click().focus();
          }).on('focus.tabs', function(e) {
            e.preventDefault();
            var targetLi = a.parent();
            if (self.isTabOverflowed(targetLi)) {
              self.buildPopupMenu(targetLi.index());
            }
          });
        });

        // store a reference to the more button and set up events for it
        self.moreButton = self.element.find('.tab-more');
        self.moreButton.on('click.tabs', function(e) {
          if (!(self.container.hasClass('has-more-button'))) {
            e.stopPropagation();
          }
          if (self.moreButton.hasClass('popup-is-open')) {
            self.popupmenu.close();
            self.moreButton.removeClass('popup-is-open');
          } else {
            self.buildPopupMenu();
          }
        });

        self.activate(0);

        // Setup the "more" function
        $(window).on('resize.tabs', function() {
          self._setOverflow();
        });
        self._setOverflow();
      },

      activate: function(index){
        var self = this,
          a = self.anchors.eq(index),
          ui = {newTab: a.parent(),
                oldTab: self.anchors.parents().find('.is-selected'),
                panels: self.panels.eq(a.parent().index()),
                oldPanel: self.panels.filter(':visible')};

        var isCancelled = self.element.trigger('beforeActivate', null, ui);
        if (!isCancelled) {
          return;
        }

        //hide old tabs
        self.anchors.attr({'aria-selected': 'false', 'aria-expanded': 'false', 'tabindex': '-1'})
            .parent().removeClass('is-selected');

        self.panels.hide();

        //show current tab
        a.attr({'aria-selected': 'true', 'aria-expanded': 'true', 'tabindex': '0'})
          .parent().addClass('is-selected');

        ui.panels.stop().fadeIn(function() {
          $('#tooltip').addClass('is-hidden');
          $('#dropdown-list, #multiselect-list').remove();
          self.element.trigger('activate', null, ui);
        });

        //Init Label Widths..
        ui.panels.find('.autoLabelWidth').each(function() {
          var container = $(this),
            labels = container.find('.inforLabel');

          if (labels.autoWidth) {
            labels.autoWidth();
          }
        });

        ui.panels.find(':first-child').filter('h3').attr('tabindex', '0');
      },

      _setOverflow: function () {
        //TODO - Implement Overflow/Responsive
        var self = this;
        if (self.tablist[0].scrollHeight > 40 ) {
          self.element.addClass('has-more-button');
        } else {
          self.element.removeClass('has-more-button');
        }
      },

      buildPopupMenu: function(startingIndex) {
        var self = this;
        if (self.popupmenu) {
          $.each(self.popupmenu.element.find('li > a'), function(i, item) {
            $(item).off('focus');
          });
          self.popupmenu.close();
          $(document).off('keydown.popupmenu');
        }

        // Build the new markup for the popupmenu if it doesn't exist.
        // Reset it if it does exist.
        var menuHtml = $('#tab-container-popupmenu');
        if (menuHtml.length === 0) {
          menuHtml = $('<ul>').attr('id', 'tab-container-popupmenu').appendTo('body');
        } else {
          menuHtml.html('');
        }

        // Create menu items for all of the "invisible" tabs
        $.each(self.element.find('li'), function(i, item) {
          if (self.isTabOverflowed(item)) {
            var popupLi = $(item).clone().removeClass('tab is-selected').attr('data-original-tab-index', i).appendTo(menuHtml);
            popupLi.find('a').on('focus', function() {
              self.activate(i);
            });
          }
        });

        // Invoke the popup menu on the button.
        self.moreButton.popupmenu({
          menuId: 'tab-container-popupmenu',
          trigger: 'immediate'
        });
        self.moreButton.addClass('popup-is-open');
        self.popupmenu = self.moreButton.data('popupmenu');
        self.popupmenu.element.on('close', function() {
          self.moreButton.removeClass('popup-is-open');
        });

        // Add the "is-selected" class to the currently focused item in this popup menu.
        self.popupmenu.menu.on('focus.popupmenu', 'a', function() {
          $(this).parents('ul').find('li').removeClass('is-selected');
          $(this).parent().addClass('is-selected');
        });

        // If the optional startingIndex is provided, focus the popupmenu on the matching item.
        // Otherwise, focus the first item in the list.
        if (startingIndex) {
          self.popupmenu.menu.find('li[data-original-tab-index="' + startingIndex + '"] > a').focus();
        } else if (self.tablist.find('li.is-selected').index() !== -1) {
          self.popupmenu.menu.find('li[data-original-tab-index="' + self.tablist.find('li.is-selected').index() + '"] > a').focus();
        } else {
          self.popupmenu.menu.find('li:first-child > a').focus();
        }

        // Overrides a similar method in the popupmenu code that controls escaping of this menu when
        // pressing certain keys.  We override this here so that the controls act in a manner as if all tabs
        // are still visible (for accessiblity reasons), meaning you can use left and right to navigate the
        // popup menu options as if they were tabs.
        $(document).bindFirst('keydown.popupmenu', function(e) {
          var key = e.which,
            targetIndex = 0;

          // If you use Shift+Tab, close the menu and focus the last element on the page before the
          // tablist <UL> with a tabindex.
          if (e.shiftKey && key === 9) {
            e.preventDefault();
            self.popupmenu.close();
            e.stopImmediatePropagation();
            var tabIndexes = $('[tabindex]');
            tabIndexes.each(function(i) {
              if ($(this)[0] === self.tablist.find('li > a')[0]) {
                $(tabIndexes[i-1]).focus();
                return false;
              }
            });
          }

          switch(key) {
            case 13: // enter
              e.preventDefault();
              targetIndex = self.popupmenu.menu.find('li.is-selected').attr('data-original-tab-index');
              self.popupmenu.close();
              $(self.panels[targetIndex]).find('h2:first-child').focus();
              break;
            case 37: // left
              e.preventDefault();
              $(document).trigger({type: 'keydown.popupmenu', which: 38});
              break;
            case 38: // up
              // If the first item in the popup menu is already focused, close the menu and focus
              // on the last visible item in the tabs list.
              var first = self.popupmenu.menu.find('li.is-selected:first-child');
              if (first.length > 0) {
                e.preventDefault();
                targetIndex = first.attr('data-original-tab-index') - 1;
                $(self.anchors[targetIndex]).click();
              }
              break;
            case 39: // right
              e.preventDefault();
              $(document).trigger({type: 'keydown.popupmenu', which: 40});
              break;
            case 40: // down
              // If the last item in the popup menu is already focused, close the menu and focus
              // on the first visible item in the tabs list.
              if (self.popupmenu.menu.find('li.is-selected:last-child').length > 0) {
                e.preventDefault();
                $(self.anchors[targetIndex]).click();
              }
              break;
          }

        });
      },

      // Used for checking if a particular tab (in the form of a jquery-wrapped list item) is spilled into
      // the overflow area of the tablist container <UL>.
      isTabOverflowed: function(li) {
        if (this.tablist.scrollTop() > 0) {
          this.tablist.scrollTop(0);
        }
        var offset = $(li).offset().top - this.tablist.offset().top;
        return offset >= this.tablist.height();
      },

      findLastVisibleTab: function() {
        var targetFocus = this.tablist.find('li:first-child');
        while(!(this.isTabOverflowed(targetFocus))) {
          targetFocus = targetFocus.next('li');
        }
        targetFocus.prev().find('a').click().focus();
      },

      destroy: function(){
        $(window).off('resize.tabs');
        if (this.moreButton.data('popupmenu')) {
          this.moreButton.data('popupmenu').destroy();
          this.moreButton.remove();
        }
        $.removeData(this.obj, pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
