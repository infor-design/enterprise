
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

  /**
  * Tab Control
  */
  $.fn.tabs = function(options) {

    // Tab Settings and Options
    var pluginName = 'tabs',
        defaults = {
          containerElement: null,
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
        var self = this;
        this
          .setup()
          .build()
          .setupEvents();

        var excludes = ':not(.separator):not(.is-disabled):not(.is-hidden)',
          selected = this.tablist.children('li.is-selected' + excludes);
        if (!selected.length) {
          selected = this.tablist.children('li' + excludes).first();
        }

        this.activate(selected.children('a').attr('href'));
        this.setOverflow();

        // Focus the bar on the first element, but don't animate it on page load.
        this.animatedBar.addClass('no-transition');
        this.positionFocusState(selected);
        this.focusBar(undefined, function() {
          setTimeout(function() {
            self.animatedBar.removeClass('no-transition');
          }, 0);
        });
      },

      setup: function() {
        // Used by the window.resize event to correctly identify the tabs
        this.tabsIndex = $('.tab-container').index(this.element);

        if (!this.settings.tabCounts && this.element.attr('data-tab-counts')) {
          this.settings.tabCounts = this.element.attr('data-tab-counts') === 'true';
        }
        return this;
      },

      build: function() {
        var self = this;

        this.container = this.element;
        // Special case for Header Tabs, find the page container use that as the container
        if ($.contains($('body > header')[0], this.element[0])) {
          this.container = $('body > .page-container');
          if (!this.container.length) {
            this.container = this.element;
          }
        }
        // Setting containerElement overrides any changes to the tab panel container.
        var container = $(this.settings.containerElement);
        if (container.length) {
          this.container = container;
        }

        //Attach Tablist role and class to the tab headers container
        self.header = self.container.find('ul:first')
                        .attr({'class': 'tab-list', 'role': 'tablist',
                               'aria-multiselectable': 'false'});
        self.tablist = self.element.find('.tab-list');

        self.focusState = self.container.find('.tab-focus-indicator');
        if (!self.focusState.length) {
          self.focusState = $('<div class="tab-focus-indicator" role="presentation"></div>').insertBefore(self.tablist);
        }

        self.animatedBar = self.container.find('.animated-bar');
        if (!self.animatedBar.length) {
          self.animatedBar = $('<div class="animated-bar" role="presentation"></div>').insertBefore(self.tablist);
        }

        // Add the markup for the "More" button if it doesn't exist.
        self.moreButton = self.tablist.next('.tab-more');
        if (self.moreButton.length === 0) {
          var button = $('<div>').attr({'class': 'tab-more'});
          button.append( $('<span>').text(Locale.translate('More')));
          button.append('<svg class="icon icon-more" aria-hidden="true"><use xlink:href="#icon-dropdown"></svg>');
          self.tablist.after(button);
          self.moreButton = button;
        }

        //for each item in the tabsList...
        self.anchors = self.tablist.children('li:not(.separator):not(:hidden)').children('a');
        self.anchors.each(function () {
          var a = $(this);
          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');

          if (a.parent().hasClass('dismissible') && !a.parent().children('.icon').length) {
            $('<svg class="icon"><use xlink:href="#icon-close"></svg>').insertAfter(a);
          }

          // Find and configure dropdown tabs
          var dd = a.nextAll('ul').first();
          if (dd.length > 0) {
            var li = a.parent();

            li.addClass('has-popupmenu').popupmenu({
              menu: dd,
              trigger: 'click'
            });

            a.removeAttr('role').removeAttr('aria-expanded').removeAttr('aria-selected');

            if (!a.parent().children('.icon.icon-more').length) {
              $('<svg class="icon icon-more" focusable="false"><use xlink:href="#icon-dropdown"></svg>').insertAfter(a);
            }
          }

          if (self.settings.tabCounts && $(this).find('.count').length === 0) {
            $(this).prepend('<span class="count">0 </span>');
          }
        });

        // Build/manage tab panels
        function associateAnchorWithPanel() {
          var a = $(this),
            popup = a.parent().data('popupmenu');

          // Associated the current one
          var anchor = a.attr('href');
          if (!anchor || anchor === '#') {
            return;
          }

          self.panels = self.panels.add(anchor);

          // If dropdown tab, add the contents of the dropdown
          // NOTE: dropdown tabs shouldn't have children, so they aren't accounted for here
          if (popup) {
            popup.menu.children('li').each(function() {
              self.panels = self.panels.add( $($(this).children('a').attr('href')) );
            });
          }
        }

        self.panels = $();
        self.anchors.each(associateAnchorWithPanel);
        self.panels
          .attr({'class': 'tab-panel', 'role': 'tabpanel'}).hide()
          .find('h3:first').attr('tabindex', '0');

        return this;
      },

      setupEvents: function() {
        var self = this;

        // Clicking the 'a' triggers the click on the 'li'
        function routeAnchorClick(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parent().trigger('click');
        }

        // Some tabs have icons that can be clicked and manipulated
        function handleIconClick(e) {
          if ($(this).parent().hasClass('dismissible')) {
            e.preventDefault();
            e.stopPropagation();
            self.remove($(this).prev().attr('href'));
          }
        }

        function handleTabBlur() {
          $(this).parent().removeClass('is-focused');
        }

        // Any events bound to individual tabs (li) and their anchors (a) are bound to the tablist
        // element so that tabs can be added/removed/hidden/shown without needing to change event bindings.
        self.tablist
          .onTouchClick('tabs', '> li')
          .on('click.tabs', '> li', function(e) {
            self.handleTabClick(e, $(this));
          })
          .on('click.tabs touchend.tabs touchcancel.tabs', 'a', routeAnchorClick)
          .on('click.tabs touchend.tabs touchcancel.tabs', '.icon', handleIconClick)
          .on('focus.tabs', 'a', function(e) {
            self.handleTabFocus(e, $(this));
          })
          .on('blur.tabs', 'a', handleTabBlur)
          .on('keydown.tabs', 'a', function(e) {
            self.handleTabKeyDown(e);
          });

        // Setup a mousedown event on tabs to determine in the focus handler whether or a not a keystroked cause
        // a change in focus, or a click.  Keystroke focus changes cause different visual situations
        function addClickFocusData(e) {
          var tab = $(this);
          if (tab.is('.is-disabled')) {
            e.preventDefault();
            return false;
          }

          self.focusState.removeClass('is-visible');
          if (!tab.is(':focus')) {
            tab.children('a').data('focused-by-click', true);
          }
        }
        self.tablist.on('mousedown.tabs', '> li', addClickFocusData);
        self.moreButton.on('mousedown.tabs', addClickFocusData);

        // Setup events on Dropdown Tabs
        function dropdownTabEvents(i, tab) {
          var li = $(tab),
            a = li.children('a'),
            menu = li.data('popupmenu').menu;

          menu.on('keydown.popupmenu', 'a', function(e) {
            switch(e.which) {
              case 27: // escape
                li.addClass('is-selected');
                a.focus();
                break;
            }
          });

          li.on('selected.tabs', function(e, anchor) {
            var href = $(anchor).attr('href');
            self.activate(href);
            a.focus();
            self.updateAria(a);
            self.focusBar(li);
            self.positionFocusState();
          });
        }

        var ddTabs = self.tablist.find('li').filter('.has-popupmenu');
        ddTabs.each(dropdownTabEvents);

        // Setup the "more" function
        self.moreButton
          .onTouchClick('tabs')
          .on('click.tabs', function(e) {
            self.handleMoreButtonClick(e);
          })
          .on('keydown.tabs', function(e) {
            self.handleMoreButtonKeydown(e);
          })
          .on('focus.tabs', function(e) {
            self.handleMoreButtonFocus(e);
          });

        // Check whether or not all of the tabs + more button are de-focused.
        // If true, the focus-state and animated bar need to revert positions
        // back to the currently selected tab.
        this.element.on('focusout.tabs', function allTabsFocusOut() {
          var noFocusedTabs = !$.contains(self.element[0], document.activeElement),
            noPopupMenusOpen = self.tablist.children('[aria-expanded="true"]').length === 0;

          if (noFocusedTabs && noPopupMenusOpen && !self.moreButton.is('.is-selected, .popup-is-open')) {
            self.focusBar(self.tablist.find('.is-selected').first());
            self.positionFocusState();
          }
          self.checkFocusedElements();
        }).on('updated.tabs', function() {
          self.updated();
        });

        // Check to see if we need to add/remove the more button on resize
        $(window).on('resize.tabs' + this.tabsIndex, function resizeTabs() {
          self.setOverflow();
          self.positionFocusState();
          self.focusBar();
        });

        return this;
      },

      handleTabClick: function(e, li) {
        if (this.element.is('.is-disabled') || (li && li.is('.is-disabled'))) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        var nonVisibleExcludes = ':not(.separator):not(:hidden)',
          a = li.children('a');


        this.tablist.children('li' + nonVisibleExcludes).removeClass('is-selected');
        li.addClass('is-selected');

        // Don't activate a dropdown tab, but open its popupmenu.
        if (li.is('.has-popupmenu')) {
          li.data('popupmenu').open();
          return;
        }

        this.activate(li.find('a').attr('href'));
        if (this.popupmenu) {
          this.popupmenu.close();
        }
        a.focus();
        this.focusState.removeClass('is-visible');
        this.positionFocusState(a);
        this.focusBar(li);
      },

      handleMoreButtonClick: function(e) {
        if (this.element.is('.is-disabled') || this.moreButton.is('.is-disabled')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        if (!(this.container.hasClass('has-more-button'))) {
          e.stopPropagation();
        }
        if (this.moreButton.hasClass('popup-is-open')) {
          this.popupmenu.close();
          this.moreButton.removeClass('popup-is-open');
        } else {
          this.buildPopupMenu();
        }
        this.focusState.removeClass('is-visible');
      },

      handleTabFocus: function(e, a) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        var li = a.parent(),
          focusedByKeyboard = a.data('focused-by-click') !== true;
        $.removeData(a[0], 'focused-by-click');

        if (this.isTabOverflowed(li)) {
          this.buildPopupMenu(a.attr('href'));
          this.moreButton.addClass('is-focused');
          this.positionFocusState(this.moreButton);
          this.focusBar(this.moreButton);
        } else {
          li.addClass('is-focused');
          this.positionFocusState(a, focusedByKeyboard);
          this.focusBar(li);
        }
      },

      handleMoreButtonFocus: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return;
        }

        var focusedByKeyboard = this.moreButton.data('focused-by-click') !== true;
        $.removeData(this.moreButton[0], 'focused-by-click');

        this.focusState.removeClass('is-visible');
        this.positionFocusState(this.moreButton, focusedByKeyboard);
      },

      handleTabKeyDown: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        if (e.shiftKey || e.ctrlKey || e.metaKey || (e.altKey && e.which !== 8)) {
          return;
        }

        var passableKeys = [8, 13];

        if ((e.which < 32 && $.inArray(e.which, passableKeys) === -1) || e.which > 46) {
          return;
        }

        var self = this,
          allExcludes = ':not(.separator):not(.is-disabled):not(:hidden)',
          currentLi = $(e.currentTarget).parent(),
          targetLi,
          tabs = self.tablist.children('li' + allExcludes);

        function previousTab() {
          var i = tabs.index(currentLi) - 1;
          while (i > -1 && !targetLi) {
            if (tabs.eq(i).is(allExcludes)) {
              return tabs.eq(i);
            }
            i = i - 1;
          }
          return self.tablist.children('li' + allExcludes).last();
        }

        function nextTab() {
          var i = tabs.index(currentLi) + 1;
          while(i < tabs.length && !targetLi) {
            if (tabs.eq(i).is(allExcludes)) {
              return tabs.eq(i);
            }
            i++;
          }
          return self.tablist.children('li' + allExcludes).first();
        }

        switch(e.which) {
          case 8:
            if (e.altKey && currentLi.is('.dismissible')) {
              e.preventDefault();
              self.remove(currentLi.children('a').attr('href'));
            }
            return;
          case 13:
          case 32:
            if (currentLi.hasClass('has-popupmenu')) {
              currentLi.data('popupmenu').open();
              return;
            }
            self.activate(currentLi.children('a').attr('href'));
            self.focusState.removeClass('is-visible');
            return;
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
        if (this.isTabOverflowed(targetLi)) {
          e.preventDefault();
          var oldHref = targetLi.children('a').attr('href');
          // setTimeout is used to bypass triggering of the keyboard when self.buildPopupMenu() is invoked.
          setTimeout(function() {
            self.buildPopupMenu(oldHref);
          }, 0);
          return;
        }

        var a = targetLi.children('a').focus();
        self.positionFocusState(a, true);
      },

      handleMoreButtonKeydown: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        switch(e.which) {
          case 37: // left
          case 38: // up
            e.preventDefault();
            this.findLastVisibleTab();
            break;
          case 13: // enter
          case 32: // spacebar
            e.preventDefault(); //jshint ignore:line
          case 39: // right
          case 40: // down
            e.preventDefault();
            this.buildPopupMenu(this.tablist.find('.is-selected').children('a').attr('href'));
            this.positionFocusState(this.moreButton, true);
            break;
        }
      },

      activate: function(href) {
        var self = this,
          a = self.anchors.filter('[href="' + href + '"]'),
          ui = {
                newTab: a.parent(),
                oldTab: self.anchors.parents().filter('.is-selected'),
                panels: self.panels.filter('[id="' + href.replace(/#/g, '') + '"]'),
                oldPanel: self.panels.filter(':visible')
              };

        var isCancelled = self.element.trigger('beforeActivate', null, ui);
        if (!isCancelled) {
          return;
        }

        self.panels.hide();
        self.updateAria(a);

        ui.panels.stop().fadeIn(250, function() {
          $('#tooltip').addClass('is-hidden');
          $('#dropdown-list, #multiselect-list').remove();
          self.element.trigger('activate', null, ui);
        });

        ui.oldTab.removeClass('is-selected');
        ui.newTab.addClass('is-selected');

        //Init Label Widths..
        ui.panels.find('.autoLabelWidth').each(function() {
          var container = $(this),
            labels = container.find('.inforLabel');

          if (labels.autoWidth) {
            labels.autoWidth();
          }
        });
      },

      updateAria: function(a) {
        if (!a) {
          return;
        }
        //hide old tabs
        this.anchors.attr({
          'aria-selected': 'false',
          'aria-expanded': 'false',
          'tabindex': '-1'
        });
        this.moreButton.attr({
          'tabindex': '-1'
        });

        //show current tab
        if (a.length && this.element.is(':not(.is-disabled)')) {
          a.parent().removeClass('is-selected');
          if (!this.isTabOverflowed(a.parent())) {
            a.attr({
              'aria-selected': 'true',
              'aria-expanded': 'true',
              'tabindex': '0'
            }).parent().addClass('is-selected');
          } else {
            this.moreButton.attr({
              'tabindex': '0'
            });
          }
        }
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
          tabHeaderMarkup.append('<svg class="icon"><use xlink:href="#icon-close"></svg>');
        }

        if (this.settings.tabCounts) {
          anchorMarkup.prepend('<span class="count">0 </span>');
        }

        if (options.dropdown) {
          // TODO: Need to implement the passing of Dropdown Tab menus into this method.
        }

        // Insert markup at the very end, or at the specified index.
        if (atIndex === undefined || isNaN(atIndex)) {
          this.tablist.append(tabHeaderMarkup);
          this.container.append(tabContentMarkup);
        } else {
          var tabs = this.tablist.children('li'),
            insertBefore = tabs.eq(atIndex).length > 0,
            targetIndex = insertBefore ? atIndex : tabs.length - 1;

          if (!insertBefore) {
            tabHeaderMarkup.insertAfter(tabs.eq(targetIndex));
            tabContentMarkup.insertAfter(this.container.children().filter('.tab-panel').eq(targetIndex));
          } else {
            tabHeaderMarkup.insertBefore(tabs.eq(targetIndex));
            tabContentMarkup.insertBefore(this.container.children().filter('.tab-panel').eq(targetIndex));
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
          targetPanel = this.panels.filter('#' + tabId),
          targetLiIndex = this.tablist.children('li').index(targetLi),
          prevLi = targetLi.prev();

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

        // If any tabs are left in the list, set the previous tab as the currently active one.
        var count = targetLiIndex - 1;
        while (count > -1) {
          count = -1;
          if (prevLi.is('.separator') || prevLi.is(':hidden') || prevLi.is('.is-disabled')) {
            prevLi = prevLi.prev();
            count = count - 1;
          }
        }
        if (prevLi.length === 0) {
          return this;
        }

        var a = prevLi.children('a');
        this.positionFocusState(a);
        this.activate(a.attr('href'));
        this.focusBar(prevLi);
        return this;
      },

      getTabFromId: function(tabId) {
        if (!tabId) {
          return;
        }
        var anchor = this.anchors.filter('[href="#' + tabId + '"]');
        if (!anchor.length) {
          return;
        }

        return anchor.parent();
      },

      // Hides a tab
      hide: function(tabId) {
        var tab = this.getTabFromId(tabId);
        this.findPreviousAvailableTab(tabId);
        return tabId ? tab.addClass('hidden') : null;
      },

      // Shows a tab
      show: function(tabId) {
        var tab = this.getTabFromId(tabId);
        return tabId ? tab.removeClass('hidden') : null;
      },

      // Disables an individual tab
      disableTab: function(tabId) {
        var tab = this.getTabFromId(tabId);
        this.findPreviousAvailableTab(tabId);
        return tabId ? tab.addClass('is-disabled') : null;
      },

      // Enables an individual tab
      enableTab: function(tabId) {
        var tab = this.getTabFromId(tabId);
        return tabId ? tab.removeClass('is-disabled') : null;
      },

      // Takes a tab ID and returns a jquery object containing the previous available tab
      findPreviousAvailableTab: function(tabId) {
        var tab = this.getTabFromId(tabId),
          filter = 'li:not(.separator):not(.hidden):not(.is-disabled)',
          tabs = this.tablist.find(filter),
          target = tabs.eq(tabs.index(tab) - 1);

        while(target.length && !target.is(filter)) {
          target = tabs.eq(tabs.index(target) - 1);
        }

        if (tab.is('.is-selected') && target.length) {
          this.activate(target.children('a').attr('href'));
          target.children('a').focus();
          this.focusBar(target);
          this.positionFocusState();
        }

        return target;
      },

      setOverflow: function () {
        if (this.tablist[0].scrollHeight > this.tablist.outerHeight() + 1) {
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
          self.checkFocusedElements();
        }
      },

      buildPopupMenu: function(startingHref) {
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
        var tabs = self.tablist.children('li:not(.separator)');
        $.each(tabs, function(i, item) {
          var popupLi;

          if (self.isTabOverflowed(item) && $(item).is(':not(:hidden)')) {
            // Add a separator to the list
            if (menuHtml.find('li').length > 0 && $(item).prev().is('.separator')) {
              $(item).prev().clone().appendTo(menuHtml);
            }
            if ($(item).is(':not(.separator)')) {
              popupLi = $(item).clone().removeClass('tab is-selected');
              popupLi.find('.icon').remove(); // NOTE: Remove this to show the close icon in overflow menu
              popupLi
                .appendTo(menuHtml)
                .attr('data-tab-href', $(item).children('a').attr('href'));
                // Remove onclick methods from the popup <li> because they are called
                // on the "select" event in context of the original button
              popupLi.children('a').removeAttr('onclick');
            }
            if ($(item).is('.has-popupmenu')) {
              $('#' + $(item).attr('aria-controls')).clone()
                .removeClass('has-popupmenu')
                .insertAfter(popupLi.children('a'));
            }
          }
        });

        self.tablist.children('li:not(.separator)').removeClass('is-focused');

        // Invoke the popup menu on the button.
        self.moreButton.popupmenu({
          autoFocus: false,
          menu: 'tab-container-popupmenu',
          trigger: 'immediate'
        });
        self.moreButton.addClass('popup-is-open');
        self.popupmenu = self.moreButton.data('popupmenu');
        self.focusBar(self.moreButton);

        function closeMenu() {
          $(this).off('close.tabs selected.tabs');
          self.moreButton.removeClass('popup-is-open');
          self.setMoreActive();
          self.positionFocusState(undefined);
          self.focusBar();
        }

        function selectMenuOption(e, anchor) {
          var href = anchor.attr('href'),
            id = href.substr(1, href.length),
            tab = self.getTabFromId(id) || $(),
            a = tab ? tab.children('a') : $();

          self.activate(href);

          // Fire an onclick event associated with the original tab from the spillover menu
          if (tab.length && a.length && typeof a[0].onclick === 'function') {
            a[0].onclick.apply(a[0]);
          }
        }

        self.moreButton
          .on('close.tabs', closeMenu)
          .on('selected.tabs', selectMenuOption);

        var menu = self.popupmenu.menu;

        // Add the "is-selected" class to the currently focused item in this popup menu.
        function handleAnchorFocus() {
          $(this).parents('ul').find('li').removeClass('is-selected');
          $(this).parent().addClass('is-selected');
          self.moreButton.addClass('is-selected');
          self.focusBar();
        }

        function handleAnchorKeydown(e) {
          var target = $(e.currentTarget);
          switch(e.which) {
            case 13:
            case 32:
              e.preventDefault();
              target.parents('ul').find('li').removeClass('is-selected');
              target.addClass('is-selected');
              self.activate(target.attr('href'));
              break;
          }
        }

        function handleDestroy() {
          menu.off();
          self.focusState.removeClass('is-visible');
          $('#tab-container-popupmenu').remove();
        }

        menu
          .on('focus.popupmenu', 'a', handleAnchorFocus)
          .on('keydown.popupmenu', 'a', handleAnchorKeydown)
          .on('destroy.popupmenu', handleDestroy);

        // If the optional startingIndex is provided, focus the popupmenu on the matching item.
        // Otherwise, focus the first item in the list.
        if (startingHref) {
          menu.find('a[href="' + startingHref + '"]').focus();
        } else if (self.tablist.children('.is-selected').length > 0) {
          menu.find('a[href="' + self.tablist.children('.is-selected').children('a').attr('href') + '"]').focus();
        } else {
          menu.find('li:first-child > a').focus();
        }

        // Overrides a similar method in the popupmenu code that controls escaping of this menu when
        // pressing certain keys.  We override this here so that the controls act in a manner as if all tabs
        // are still visible (for accessiblity reasons), meaning you can use left and right to navigate the
        // popup menu options as if they were tabs.
        $(document).bindFirst('keydown.popupmenu', function handlePopupMenuKeydown(e) {
          var key = e.which,
            targetHref = '';

          function prevMenuItem() {
            // If the first item in the popup menu is already focused, close the menu and focus
            // on the last visible item in the tabs list.
            var first = menu.find('li.is-selected:first-child');
            if (first.length > 0) {
              e.preventDefault();
              $(document).off(e);
              self.popupmenu.close();
              self.findLastVisibleTab();
            }
          }

          function nextMenuItem() {
            // If the last item in the popup menu is already focused, close the menu and focus
            // on the first visible item in the tabs list.
            var last = menu.find('li.is-selected:last-child');
            if (last.length > 0 && last.is(':not(.submenu)')) {
              e.preventDefault();
              $(document).off(e);
              self.popupmenu.close();
              self.findFirstVisibleTab();
            }
          }

          switch(key) {
            case 13: // enter
            case 32: // spacebar
              e.preventDefault();
              targetHref = menu.find('li.is-selected').attr('data-tab-href');
              self.popupmenu.close();
              break;
            case 27: // escape
              e.preventDefault();
              self.popupmenu.close();
              self.tablist.children('.is-selected').children('a').focus();
              break;
            case 37: // left
              $(document).trigger({type: 'keydown.popupmenu', which: 38});
              break;
            case 38: // up
              prevMenuItem();
              break;
            case 39: // right
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
        var tabs = this.tablist.children('li:not(.separator):not(.hidden):not(.is-disabled)'),
          targetFocus = tabs.first();
        while(!(this.isTabOverflowed(targetFocus))) {
          targetFocus = tabs.eq(tabs.index(targetFocus) + 1);
        }
        tabs.eq(tabs.index(targetFocus) - 1).find('a').focus();
      },

      findFirstVisibleTab: function() {
        var tabs = this.tablist.children('li:not(.separator):not(.hidden):not(.is-disabled)');
        tabs.eq(0).find('a').focus();
      },

      focusBar: function(li, callback) {
        var self = this,
          target = li !== undefined ? li :
            self.moreButton.hasClass('is-selected') ? self.moreButton :
            self.tablist.children('.is-selected').length > 0 ? self.tablist.children('.is-selected') : undefined,
          paddingLeft = parseInt(target.css('padding-left'), 10) || 0,
          width = target.innerWidth();

        if (target.is('.tab')) {
          paddingLeft = paddingLeft + parseInt(target.children('a').css('padding-left'), 10) || 0;
          width = target.children('a').width();
        }
        if (target.is('.dismissible.tab') || target.is('.has-popupmenu.tab')) {
          width = width + 27;
        }
        if (target.is('.tab-more')) {
          width = width - 14;
        }

        if (target === undefined) {
          return;
        }
        clearTimeout(self.animationTimeout);
        this.animatedBar.addClass('visible');
        this.animationTimeout = setTimeout(function() {
          self.animatedBar.css({
            'left' : (paddingLeft + target.position().left) + 'px',
            'width' : width + 'px'
          });
          if (callback && typeof callback === 'function') {
            callback();
          }
        }, 0);
      },

      defocusBar: function() {
        var self = this,
          newLeft = (self.animatedBar.position().left + (self.animatedBar.outerWidth()/2)) + 'px';
        clearTimeout(self.animationTimeout);
        this.animatedBar.css({
          'left' : newLeft,
          'width' : '0'
        });
        this.animationTimeout = setTimeout(function() {
          self.animatedBar.removeClass('visible').removeAttr('style');
        }, 350);
      },

      positionFocusState: function(target, unhide) {
        var self = this;
        target = target !== undefined ? $(target) :
            self.moreButton.hasClass('is-selected') ? self.moreButton :
            self.tablist.children('.is-selected').length > 0 ? self.tablist.children('.is-selected').children('a') : undefined;

        var pos = target.offset(),
          offset = this.tablist.offset(),
          width = parseInt(target.outerWidth()),
          height = parseInt(target.outerHeight());

        // Modifications on a specific basis
        if (target.is('.tab:first-child > a')) {
          pos.left = pos.left - 10;
          width = width + 9;
        }
        if (target.is('.dismissible.tab > a') || target.is('.has-popupmenu.tab > a')) {
          width = width + 32;
        }
        if (target.is('.tab-more')) {
          if (this.settings.tabCounts) {
            height = height - 4;
            width = width + 11;
            pos.top = pos.top + 2;
          } else {
            height = height - 10;
            width = width + 11;
            pos.top = pos.top + 5;
          }
        }

        this.focusState.css({
          left: pos.left - offset.left,
          top: pos.top - offset.top,
          right: (pos.left - offset.left) + width,
          bottom: (pos.top - offset.top) + height,
          width: width,
          height: height
        });

        if (unhide === true) {
          this.focusState.addClass('is-visible');
        }
      },

      checkFocusedElements: function() {
        var self = this,
          focusableItems = self.tablist;

        if (focusableItems.find('.is-focused').length === 0 && !self.moreButton.hasClass('is-focused') && !self.moreButton.hasClass('popup-is-open')) {
          self.focusState.removeClass('is-visible');
        }

        if (focusableItems.find('.is-selected').length === 0 && !self.moreButton.hasClass('is-selected')) {
          self.defocusBar();
        }
      },

      updated: function() {
        this.teardown().init();
      },

      disable: function() {
        this.element.prop('disabled', true).addClass('is-disabled');
        this.updateAria($());
      },

      enable: function() {
        this.element.prop('disabled', false).removeClass('is-disabled');
        this.updateAria(this.tablist.find('.is-selected > a'));
      },


      teardown: function() {
        this.panels.removeAttr('style');

        this.header
          .removeAttr('role')
          .removeAttr('aria-multiselectable');

        var tabs = this.tablist.children('li');
        tabs
          .off()
          .removeAttr('role')
          .removeClass('is-selected');

        var dds = tabs.filter('.has-popupmenu');
        dds.each(function() {
          var popup = $(this).data('popupmenu');
          if (popup) {
            popup.destroy();
          }
        });

        this.tablist
          .off();

        this.anchors
          .off()
          .removeAttr('role')
          .removeAttr('aria-expanded')
          .removeAttr('aria-selected')
          .removeAttr('tabindex');

        this.element.off('focusout.tabs');
        $(window).off('resize.tabs' + this.tabsIndex);
        this.tabsIndex = undefined;

        if (this.moreButton.data('popupmenu')) {
          this.moreButton.data('popupmenu').destroy();
        }
        this.moreButton.off().remove();
        this.moreButton = undefined;
        this.focusState.remove();
        this.focusState = undefined;
        this.animatedBar.remove();
        this.animatedBar = undefined;

        return this;
      },

      destroy: function(){
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Tabs(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
