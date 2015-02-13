/**
* Tab Control (TODO: bitly link to docs)
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
  // Events invoked by other plugins http://stackoverflow.com/questions/2360655
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
          tabCounts: false,
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Tabs(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    Tabs.prototype = {

      init: function(){
        this
          .setup()
          .build()
          .setupEvents();

        this.activate(0);
        this.setOverflow();
      },

      setup: function() {
        if (!this.settings.tabCounts && this.element.attr('data-tab-counts')) {
          this.settings.tabCounts = this.element.attr('data-tab-counts') === 'true';
        }
        return this;
      },

      build: function() {
        var self = this;

        self.container = $(this.element);
        if (self.settings.tabCounts) {
          self.container.addClass('has-counts');
        }

        //For each tab panel set the aria roles and hide it
        self.panels = self.container.children('div')
            .attr({'class': 'tab-panel', 'role': 'tabpanel'}).hide();

        self.panels.find('h2:first').attr('tabindex', '0');

        //Attach Tablist role and class to the tab headers container
        self.header = self.container.find('ul:first')
                    .attr({'class': 'tab-list', 'role': 'tablist',
                            'aria-multiselectable': 'false'});
        self.tablist = self.element.find('.tab-list');

        self.moreButton = self.tablist.next('.tab-more');

        // Add the markup for the "More" button if it doesn't exist.
        if (self.moreButton.length === 0) {
          var button = $('<div>').attr({'class': 'tab-more'});
          button.append( $('<span>').text('More')); //TODO: Localize
          button.append('<svg class="icon" aria-hidden="true"><use xlink:href="#icon-dropdown"></svg>');
          self.tablist.after(button);
          self.moreButton = button;
        }

        //for each item in the tabsList...
        self.anchors = self.header.find('li:not(.separator) > a');
        self.anchors.each(function () {
          var a = $(this);
          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');

          if (a.parent().hasClass('dismissible')) {
            $('<svg class="icon"><use xlink:href="#icon-delete"></svg>').insertAfter(a);
          }

          if (self.settings.tabCounts && $(this).find('.count').length === 0) {
            $(this).prepend('<span class="count">0 </span>');
          }
        });

        return this;
      },

      setupEvents: function() {
        var self = this,
          nonVisibleExcludes = ':not(.separator):not(.hidden)',
          allExcludes = ':not(.hidden):not(.separator):not(:disabled)';

        // Bind all "a" and "li" events to the tablist so that we can add/remove without issue
        self.tablist.on('click.tabs', 'li', function() {
          self.activate(self.tablist.find('li' + nonVisibleExcludes).index($(this)));
          if (self.popupmenu) {
            self.popupmenu.close();
          }
          $(this).find('a').focus();
        // Clicking the 'a' triggers the click on the 'li'
        }).on('click.tabs', 'a', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parent().trigger('click');
        }).on('click.tabs', '.icon', function(e) {
          e.preventDefault();
          e.stopPropagation();
          self.remove($(this).prev().attr('href'));
        }).on('focus.tabs', 'a', function() {
          var targetLi = $(this).parent();
          targetLi.addClass('is-focused');
          if (self.isTabOverflowed(targetLi)) {
            self.buildPopupMenu(self.container.find('li' + allExcludes).index(targetLi));
          }
        }).on('keydown.tabs', 'a', function(e) {

          if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.which < 32) {
            return;
          }

          var currentLi = $(this).parent(),
            targetLi,
            tabs = self.container.find('li' + allExcludes);

          function previousTab() {
            var i = tabs.index(currentLi) - 1;
            while (i > -1 && !targetLi) {
              if (tabs.eq(i).is(allExcludes)) {
                return tabs.eq(i);
              }
              i = i - 1;
            }
            return self.container.find('li' + allExcludes).last();
          }

          function nextTab() {
            var i = tabs.index(currentLi) + 1;
            while(i < tabs.length && !targetLi) {
              if (tabs.eq(i).is(allExcludes)) {
                return tabs.eq(i);
              }
              i++;
            }
            return self.container.find('li' + allExcludes).first();
          }

          switch(e.which) {
            case 38:
              e.preventDefault(); // jshint ignore:line
            case 37:
              targetLi = previousTab();
               e.preventDefault();
              break;
            case 40:
              e.preventDefault(); // jshint ignore:line
            case 39:
              targetLi = nextTab();
              e.preventDefault();
              break;
          }

          // Use the matching option in the popup menu if the target is hidden by overflow.
          if (self.isTabOverflowed(targetLi)) {
            e.preventDefault();
            var oldIndex = tabs.index(targetLi);
            // setTimeout is used to bypass triggering of the keyboard when self.buildPopupMenu() is invoked.
            setTimeout(function() {
              self.buildPopupMenu(oldIndex);
            }, 0);
            return;
          }

          targetLi.find('a').click();
        });

        self.tablist.find('a').on('blur.tabs', function() {
          $(this).parent().removeClass('is-focused');
        });

        // Setup the "more" function
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
        }).on('blur.tabs', function() {
          $(this).removeClass('is-focused');
        });

        // Check to see if we need to add/remove the more button on resize
        $(window).on('resize.tabs', function() {
          self.setOverflow();
        });

        return this;
      },

      activate: function(index){
        var self = this,
          a = self.anchors.eq(index),
          ui = {newTab: a.parent(),
                oldTab: self.anchors.parents().find('.is-selected'),
                panels: self.panels.eq(index),
                oldPanel: self.panels.filter(':visible')};

        var isCancelled = self.element.trigger('beforeActivate', null, ui);
        if (!isCancelled) {
          return;
        }

        //hide old tabs
        self.anchors.attr({
          'aria-selected': 'false',
          'aria-expanded': 'false',
          'tabindex': '-1'
        }).parent().removeClass('is-selected');

        self.panels.hide();

        //show current tab
        a.attr({
          'aria-selected': 'true',
          'aria-expanded': 'true',
          'tabindex': '0'
        }).parent().addClass('is-selected');

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

      // Adds a new tab into the list and properly binds events
      add: function(tabId, options, atIndex) {
        if (!tabId) {
          return this;
        }

        if (!options) {
          options = {};
        }

        // Sanitize
        tabId = '' + tabId.replace(/#/g, '');
        options.name = options.name ? options.name.toString() : '';
        options.isDismissible = options.isDismissible ? options.isDismissible === true : false;
        options.isDropdown = options.isDropdown ? options.isDropdown === true : false;

        function getObjectFromSelector(sourceString) {
          var contentType = typeof sourceString;
          switch(contentType) {
            case 'string':
              var hasId = sourceString.match(/#/g);
              // Text Content or a Selector.
              if (hasId !== null) {
                var obj = $(sourceString);
                sourceString = obj.length ? $(sourceString).clone() : sourceString;
              }
              // do nothing if it's just a string of text.
              break;
            case 'object':
              // jQuery object or HTML Element
              sourceString = $(sourceString).clone();
              break;
          }
        }
        if (options.content) {
          getObjectFromSelector(options.content);
        }
        if (options.dropdown) {
          getObjectFromSelector(options.dropdown);
        }

        // Build
        var tabHeaderMarkup = $('<li role="presentation" class="tab"></li>'),
          anchorMarkup = $('<a href="#'+ tabId +'" role="tab" aria-expanded="false" aria-selected="false" tabindex="-1">'+ options.name +'</a>'),
          tabContentMarkup = $('<div id="'+ tabId +'" class="tab-panel" role="tabpanel" style="display: none;"></div>');

        tabHeaderMarkup.html(anchorMarkup);
        tabContentMarkup.html(options.content);

        if (options.isDismissible) {
          tabHeaderMarkup.addClass('dismissible');
          tabHeaderMarkup.append('<svg class="icon"><use xlink:href="#icon-delete"></svg>');
        }

        if (this.settings.tabCounts) {
          anchorMarkup.prepend('<span class="count">0 </span>');
        }

        // Insert markup at the very end, or at the specified index.
        if (atIndex === undefined || isNaN(atIndex)) {
          this.tablist.append(tabHeaderMarkup);
          this.container.append(tabContentMarkup);
        } else {
          var tabs = this.tablist.find('li'),
            insertBefore = tabs.eq(atIndex).length > 0,
            targetIndex = insertBefore ? atIndex : tabs.length - 1;

          if (!insertBefore) {
            tabHeaderMarkup.insertAfter(tabs.eq(targetIndex));
            tabContentMarkup.insertAfter(this.container.children().eq(targetIndex + 2));
          } else {
            tabHeaderMarkup.insertBefore(tabs.eq(targetIndex));
            tabContentMarkup.insertBefore(this.container.children().eq(targetIndex + 2));
          }
        }

        // Add each new part to their respective collections.
        this.panels = this.panels.add(tabContentMarkup);
        this.anchors = this.anchors.add(anchorMarkup);

        // Adjust tablist height
        this.setOverflow();

        return this;
      },

      // Removes a tab from the list and cleans up properly
      remove: function(tabId) {
        if (!tabId) {
          return this;
        }
        tabId = tabId.replace(/#/g, '');

        var targetAnchor = this.anchors.filter('[href="#' + tabId + '"]'),
          targetLi = targetAnchor.parent(),
          targetPanel = this.panels.filter('#' + tabId);

        // Remove these from the collections
        this.panels = this.panels.not(targetPanel);
        this.anchors = this.anchors.not(targetAnchor);

        // Kill associated events
        targetLi.off('click.tabs');
        targetAnchor.off('click.tabs focus.tabs keydown.tabs');

        // Remove Markup
        targetLi.remove();
        targetPanel.remove();

        // Adjust tablist height
        this.setOverflow();

        return this;
      },

      // Hides a tab
      hide: function(tabId) {
        if (!tabId) {
          return;
        }
        this.anchors.filter('[href="#' + tabId + '"]').parent().addClass('hidden');
        return this;
      },

      // Shows a tab
      show: function(tabId) {
        if (!tabId) {
          return;
        }
        this.anchors.filter('[href="#' + tabId + '"]').parent().removeClass('hidden');
        return this;
      },

      setOverflow: function () {
        if (this.tablist[0].scrollHeight > this.tablist.outerHeight()) {
          this.element.addClass('has-more-button');
        } else {
          this.element.removeClass('has-more-button');
        }
        this.setMoreActive();
      },

      setMoreActive: function () {
        var self = this,
          selectedTab = self.header.find('.is-selected');

        if (self.isTabOverflowed(selectedTab)) {
          self.moreButton.addClass('is-selected');
        } else {
          self.moreButton.removeClass('is-selected');
        }
      },

      buildPopupMenu: function(startingIndex) {
        var self = this;
        if (self.popupmenu) {
          $('#tab-container-popupmenu').off('focus.popupmenu');
          self.popupmenu.close();
          $('#tab-container-popupmenu').remove();
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

        // Build menu options from hidden tabs
        var tabs = self.container.find('li:not(.separator)');
        $.each(tabs, function(i, item) {
          var popupLi;

          if (self.isTabOverflowed(item) && $(item).is(':not(.hidden)')) {
            // Add a separator to the list
            if (menuHtml.find('li').length > 0 && $(item).prev().is('.separator')) {
              $(item).prev().clone().appendTo(menuHtml);
            }
            if ($(item).is(':not(.separator)')) {
              popupLi = $(item).clone().removeClass('tab is-selected');
              popupLi
                .appendTo(menuHtml)
                .attr('data-original-tab-index', tabs.index($(item)));
            }
          }
        });

        self.tablist.find('li:not(.separator)').removeClass('is-focused');

        // Invoke the popup menu on the button.
        self.moreButton.popupmenu({
          autoFocus: false,
          menuId: 'tab-container-popupmenu',
          trigger: 'immediate'
        });
        self.moreButton.addClass('popup-is-open');
        self.popupmenu = self.moreButton.data('popupmenu');

        self.popupmenu.element.on('close.popupmenu', function() {
          $(this).off('close.popupmenu');
          self.moreButton.removeClass('popup-is-open');
          self.setMoreActive();
        });

        // Add the "is-selected" class to the currently focused item in this popup menu.
        self.popupmenu.menu.on('focus.popupmenu', 'a', function() {
          $(this).parents('ul').find('li').removeClass('is-selected');
          $(this).parent().addClass('is-selected');
          self.activate(parseInt($(this).parent().attr('data-original-tab-index')));
        }).on('destroy.popupmenu', function() {
          $('#tab-container-popupmenu').remove();
        });

        // If the optional startingIndex is provided, focus the popupmenu on the matching item.
        // Otherwise, focus the first item in the list.
        if (startingIndex) {
          self.popupmenu.menu.find('li[data-original-tab-index="' + startingIndex + '"] > a').focus();
        } else if (self.tablist.find('li.is-selected').index() !== -1) {
          self.popupmenu.menu.find('li[data-original-tab-index="' + self.tablist.find('li:not(.separator)').index(self.tablist.find('.is-selected')) + '"] > a').focus();
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
            var tabIndexes = this.tablist.find('[tabindex]');
            tabIndexes.each(function(i) {
              if ($(this)[0] === self.tablist.find('li > a')[0]) {
                $(tabIndexes[i-1]).focus();
                return false;
              }
            });
          }

          function prevMenuItem() {
            // If the first item in the popup menu is already focused, close the menu and focus
            // on the last visible item in the tabs list.
            var first = self.popupmenu.menu.find('li.is-selected:first-child');
            if (first.length > 0) {
              e.preventDefault();
              $(document).off(e);
              targetIndex = first.attr('data-original-tab-index') - 1;
              $(self.anchors[targetIndex]).click();
            }
          }

          function nextMenuItem() {
            // If the last item in the popup menu is already focused, close the menu and focus
            // on the first visible item in the tabs list.
            if (self.popupmenu.menu.find('li.is-selected:last-child').length > 0) {
              e.preventDefault();
              $(document).off(e);
              $(self.anchors[targetIndex]).click();
            }
          }

          switch(key) {
            case 13: // enter
              e.preventDefault();
              targetIndex = self.popupmenu.menu.find('li.is-selected').attr('data-original-tab-index');
              self.popupmenu.close();
              $(self.panels[targetIndex]).find('h2:first-child').focus();
              break;
            case 37: // left
              e.stopPropagation();
              e.preventDefault();
              $(document).trigger({type: 'keydown.popupmenu', which: 38});
              break;
            case 38: // up
              prevMenuItem();
              break;
            case 39: // right
              e.stopPropagation();
              e.preventDefault();
              $(document).trigger({type: 'keydown.popupmenu', which: 40});
              break;
            case 40: // down
              nextMenuItem();
              break;
          }
        });
      },

      // Used for checking if a particular tab (in the form of a jquery-wrapped list item) is spilled into
      // the overflow area of the tablist container <UL>.
      isTabOverflowed: function(li) {
        if (!li || li.length === 0) {
          return true;
        }
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
        targetFocus.prev().find('a').focus();
      },

      destroy: function(){
        this.panels.removeAttr('style');

        this.header
          .removeAttr('role')
          .removeAttr('aria-multiselectable');

        this.tablist.find('li')
          .off('click.tabs')
          .removeAttr('role')
          .removeClass('tab is-selected');

        this.anchors
          .off('click.tabs focus.tabs keydown.tabs')
          .removeAttr('role')
          .removeAttr('aria-expanded')
          .removeAttr('aria-selected')
          .removeAttr('tabindex');

        $(window).off('resize.tabs');

        if (this.moreButton.data('popupmenu')) {
          this.moreButton.data('popupmenu').destroy();
        }
        this.moreButton.remove();

        $.removeData(this.element[0], pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend(instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new Tabs(this, settings));
      }
    });
  };
}));
