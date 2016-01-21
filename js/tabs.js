
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
          tabs = this.tablist.children('li' + excludes),
          selected = this.tablist.children('li.is-selected' + excludes);

        // If there are tabs present, activate the first one
        if (tabs.length) {
          if (!selected.length) {
            selected = tabs.first();
          }
          this.activate(selected.children('a').attr('href'));
        }

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
        return this;
      },

      build: function() {
        var self = this;

        this.container = this.element;
        // Special case for Header Tabs, find the page container use that as the container
        if (this.element.closest('.header').length > 0) {
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

        // Build Tab Counts
        if (self.settings.tabCounts) {
          self.container.addClass('has-counts');
        }

        //Attach Tablist role and class to the tab headers container
        self.tablist = self.element.children('.tab-list')
          .attr({
            'class': 'tab-list',
            'role': 'tablist',
            'aria-multiselectable': 'false'
          });

        self.focusState = self.container.children('.tab-focus-indicator');
        if (!self.focusState.length) {
          self.focusState = $('<div class="tab-focus-indicator" role="presentation"></div>').insertBefore(self.tablist);
        }

        self.animatedBar = self.container.children('.animated-bar');
        if (!self.animatedBar.length) {
          self.animatedBar = $('<div class="animated-bar" role="presentation"></div>').insertBefore(self.tablist);
        }

        // Add the markup for the "More" button if it doesn't exist.
        self.moreButton = self.tablist.next('.tab-more');
        if (self.moreButton.length === 0) {
          var button = $('<div>').attr({'class': 'tab-more'});
          button.append( $('<span>').text(Locale.translate('More')));
          button.append('<svg class="icon icon-more" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg>');
          self.tablist.after(button);
          self.moreButton = button;
        }

        //for each item in the tabsList...
        self.anchors = self.tablist.children('li:not(.separator)').children('a');
        self.anchors.each(function prepareAnchor() {
          var a = $(this);
          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');

          if (a.parent().hasClass('dismissible') && !a.parent().children('.icon').length) {
            $('<svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-close"></svg>').insertAfter(a);
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
              $('<svg class="icon icon-more" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg>').insertAfter(a);
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
          var href = a.attr('href');

          if (href !== undefined && href !== '#') {
            var panel = $(href);
            a.data('panel-link', panel);
            panel.data('tab-link', a);
            self.panels = self.panels.add($(href));
          }

          // If dropdown tab, add the contents of the dropdown
          // NOTE: dropdown tabs shouldn't have children, so they aren't accounted for here
          if (popup) {
            popup.menu.children('li').each(function() {
              var a = $(this).children('a'),
                href = a.attr('href'),
                panel = $(href);

              a.data('panel-link', panel);
              panel.data('tab-link', a);

              self.panels = self.panels.add(panel);
              self.anchors = self.anchors.add(a);
            });
          }
        }

        self.panels = $();
        self.anchors.each(associateAnchorWithPanel);
        self.panels
          .addClass('tab-panel')
          .attr({'role': 'tabpanel'}).hide()
          .find('h3:first').attr('tabindex', '0');

        return this;
      },

      setupEvents: function() {
        var self = this;

        // Clicking the 'a' triggers the click on the 'li'
        function routeAnchorClick(e) {
          e.preventDefault();
        }

        // Some tabs have icons that can be clicked and manipulated
        function handleIconClick(e) {
          var elem = $(this);
          if (elem.is('[disabled]') || elem.parent().hasClass('is-disabled')) {
            return;
          }

          if (elem.parent().hasClass('dismissible')) {
            e.preventDefault();
            e.stopPropagation();
            self.closeDismissibleTab($(this).prev().attr('href'));
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
          });
        }

        var ddTabs = self.tablist.find('li').filter('.has-popupmenu');
        ddTabs.each(dropdownTabEvents);

        function dismissibleTabEvents(i, tab) {
          var li = $(tab),
            a = li.children('a');

          a.on('keydown.tabs', function(e) {
            self.handleDismissibleTabKeydown(e);
          });
        }

        var dismissible = self.tablist.find('li').filter('is-dismissible');
        dismissible.each(dismissibleTabEvents);

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

        this.panels.on('keydown.tabs', function(e) {
          self.handlePanelKeydown(e);
        });

        // Check whether or not all of the tabs + more button are de-focused.
        // If true, the focus-state and animated bar need to revert positions
        // back to the currently selected tab.
        this.element.on('focusout.tabs', function allTabsFocusOut() {
          var noFocusedTabs = !$.contains(self.element[0], document.activeElement),
            noPopupMenusOpen = self.tablist.children('[aria-expanded="true"]').length === 0;

          if (noFocusedTabs && noPopupMenusOpen && !self.moreButton.is('.is-selected, .popup-is-open')) {
            //self.focusBar(self.tablist.find('.is-selected').first());
            self.positionFocusState();
          }
          self.checkFocusedElements();
        }).on('updated.tabs', function() {
          self.updated();
        }).on('activated.tabs', function(e) {
          // Stop propagation of the activate event from going higher up into the DOM tree
          e.stopPropagation();
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

        // Don't activate a dropdown tab.  Clicking triggers the Popupmenu Control attached.
        if (li.is('.has-popupmenu')) {
          return;
        }

        this.activate(a.attr('href'));
        if (this.popupmenu) {
          this.popupmenu.close();
        }

        this.focusState.removeClass('is-visible');

        // NOTE: If we switch the focusing-operations back to how they used to be (blue bar moving around with the focus state)
        // remove the below three lines and uncomment all the commented-out "this.focusBar()" directives.
        a.focus();
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
          dataFocusedClick = a.data('focused-by-click'),
          focusedByKeyboard = dataFocusedClick === undefined || (dataFocusedClick && dataFocusedClick === false);

        $.removeData(a[0], 'focused-by-click');

        if (this.isTabOverflowed(li)) {
          this.buildPopupMenu(a.attr('href'));
          this.moreButton.addClass('is-focused');
          this.positionFocusState(this.moreButton);
          //this.focusBar(this.moreButton);
        } else {
          li.addClass('is-focused');
          this.positionFocusState(a, focusedByKeyboard);
          //this.focusBar(li);
        }
      },

      handleMoreButtonFocus: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return;
        }

        var dataFocusedClick = this.moreButton.data('focused-by-click'),
          focusedByKeyboard = (dataFocusedClick && dataFocusedClick === false);
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
          currentA = currentLi.children('a'),
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

        function checkAngularClick() {
          if (currentA.attr('ng-click') || currentA.attr('data-ng-click')) { // Needed to fire the "Click" event in Angular situations
            currentA.click();
          }
        }

        switch(e.which) {
          case 8:
            if (e.altKey && currentLi.is('.dismissible')) {
              e.preventDefault();
              self.closeDismissibleTab(currentA.attr('href'));
            }
            return;
          case 13: // Enter
            self.focusState.removeClass('is-visible');
            return;
          case 32: // Spacebar
            if (currentLi.hasClass('has-popupmenu')) {
              currentLi.data('popupmenu').open();
              return;
            }
            self.activate(currentA.attr('href'));
            checkAngularClick();
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

      handleDismissibleTabKeydown: function(e) {
        var key = e.which,
          tab = $(e.target);

        if (tab.is('a')) {
          tab = tab.parent();
        }

        if (e.altKey && key === 46) { // Alt + Del
          if (tab.children('a').is('[disabled]') || tab.hasClass('is-disabled')) {
            return;
          }

          e.preventDefault();
          this.closeDismissibleTab(tab.children('a').attr('href'));
        }
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

      handlePanelKeydown: function(e) {
        var key = e.which,
          panel = $(e.target),
          a = this.anchors.filter('#' + panel.attr('id')),
          tab = this.anchors.filter('#' + panel.attr('id')).parent();

        if (tab.is('.dismissible')) {
          // Close a Dismissible Tab
          if (e.altKey && key === 46) { // Alt + Delete
            e.preventDefault();
            return this.closeDismissibleTab(a.attr('href'));
          }
        }

        // Takes focus away from elements inside a Tab Panel and brings focus to its corresponding Tab
        if ((e.ctrlKey && key === 38) && $.contains(document.activeElement, panel[0])) { // Ctrl + Up Arrow
          e.preventDefault();
          return this.activate(a.attr('href'));
        }
      },

      activate: function(href) {
        var self = this,
          a = this.anchors.filter('[href="' + href + '"]'),
          targetTab, targetPanel, oldTab, oldPanel;

        targetTab = a.parent();
        targetPanel = this.panels.filter('[id="'+ href.replace(/#/g, '') +'"]');
        oldTab = self.anchors.parents().filter('.is-selected');
        oldPanel = self.panels.filter(':visible');

        var isCancelled = self.element.trigger('beforeactivate', [a]);
        if (!isCancelled) {
          return;
        }

        self.panels.hide();
        self.element.trigger('activated', [a]);

        targetPanel.stop().fadeIn(250, function() {
          $('#tooltip').addClass('is-hidden');
          $('#dropdown-list, #multiselect-list').remove();
          self.element.trigger('afteractivate', [a]);
        });

        // Update the currently-selected tab
        self.updateAria(a);
        oldTab.removeClass('is-selected');

        if (targetTab.is('.tab')) {
          targetTab.addClass('is-selected');
        }

        var ddMenu = targetTab.parents('.popupmenu');
        if (ddMenu.length) {
          var tab = ddMenu.data('trigger');
          if (tab.length) {
            tab.addClass('is-selected');
          }
        }

        // Hide tooltips that may have been generated inside a tab.
        setTimeout(function () {
          $('#validation-tooltip').hide();
          $('#tooltip').hide();
        }, 100);
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

        var startFromZero = this.anchors.length === 0;

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
          tabHeaderMarkup.append('<svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-close"></svg>');
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

        // Link the two items via data()
        anchorMarkup.data('panel-link', tabContentMarkup);
        tabContentMarkup.data('tab-link', anchorMarkup);
        // TODO: When Dropdown Tabs can be added/removed, add that here

        // Adjust tablist height
        this.setOverflow();

        // If started from zero, position the focus state/bar and activate the tab
        if (startFromZero) {
          this.positionFocusState();
          this.focusBar(anchorMarkup.parent());
          this.activate(anchorMarkup.attr('href'));
          anchorMarkup.focus();
        }

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

        var canClose = this.element.triggerHandler('beforeclose', [targetLi]);
        if (canClose === false) {
          return false;
        }

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

        this.element.trigger('close', [targetLi]);

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
          if (!this.tablist.children('li:not(.separator)').length) {
            this.positionFocusState();
            this.defocusBar();
          }
          return this;
        }

        var a = prevLi.children('a');
        this.positionFocusState(a);
        this.activate(a.attr('href'));
        this.focusBar(prevLi);
        a.focus();

        this.element.trigger('afterclose', [targetLi]);

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
        if (!tabId) { return this; }

        var tab = this.getTabFromId(tabId);
        tab.addClass('hidden');
        this.findPreviousAvailableTab(tabId);
        return this;
      },

      // Shows a tab
      show: function(tabId) {
        if (!tabId) { return this; }

        var tab = this.getTabFromId(tabId);
        tab.removeClass('hidden');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Disables an individual tab
      disableTab: function(tabId) {
        if (!tabId) { return this; }

        var tab = this.getTabFromId(tabId);
        tab.addClass('is-disabled');
        this.findPreviousAvailableTab(tabId);
        return this;
      },

      // Enables an individual tab
      enableTab: function(tabId) {
        if (!tabId) { return this; }

        var tab = this.getTabFromId(tabId);
        tab.removeClass('is-disabled');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Renames a tab and resets the focusable bar/animation.
      rename: function(tabId, name) {
        if (!tabId || !name) {
          return;
        }

        var self = this,
          tab = this.getTabFromId(tabId);

        tab.children('a').text(name.toString());

        var doesTabExist = this.tablist.children('li').length < 2 ? tab : undefined;

        self.positionFocusState(doesTabExist);
        self.focusBar(doesTabExist);
      },

      // returns the currently active tab
      getActiveTab: function() {
        var visible = this.panels.filter(':visible');
        return this.anchors.filter('[href="#'+ visible.first().attr('id') +'"]');
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
        }

        this.focusBar();
        this.positionFocusState();

        return target;
      },

      setOverflow: function () {
        var self = this;

        if (self.tablist[0].scrollHeight > self.tablist.outerHeight() + 3.5) {
          self.element.addClass('has-more-button');
        } else {
          self.element.removeClass('has-more-button');
        }
        self.setMoreActive();

      },

      //Selects a Tab
      select: function (href) {
        var anchor = this.anchors.filter('[href="#' + href.replace(/#/g, '') + '"]');
        this.positionFocusState();
        this.focusBar(anchor.parent());
        this.activate(anchor.attr('href'));
        anchor.focus();
      },

      setMoreActive: function () {
        var self = this,
          selectedTab = self.tablist.find('.is-selected');

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
                .appendTo(menuHtml);

                // Remove onclick methods from the popup <li> because they are called
                // on the "select" event in context of the original button
              popupLi.children('a')
                .data('original-tab', $(item).children('a'))
                .removeAttr('onclick');
            }
            if ($(item).is('.has-popupmenu')) {
              var submenu = $('#' + $(item).attr('aria-controls')),
                clone = submenu.clone()
                .removeClass('has-popupmenu')
                .insertAfter(popupLi.children('a'));

              clone.children('li').each(function(i) {
                var li = $(this),
                  a = li.children('a'),
                  originalLi = submenu.children('li').eq(i),
                  originalA = originalLi.children('a');

                a.data('original-tab', originalA);
              });
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
        //self.focusBar(self.moreButton);

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

          // Focus the More Button
          // NOTE: If we switch the focusing-operations back to how they used to be (blue bar moving around with the focus state)
          // remove the line below.
          self.moreButton.focus();
        }

        self.moreButton
          .on('close.tabs', closeMenu)
          .on('selected.tabs', selectMenuOption);

        var menu = self.popupmenu.menu;

        function handleDestroy() {
          menu.off();
          self.focusState.removeClass('is-visible');
          $('#tab-container-popupmenu').remove();
        }

        menu.on('destroy.popupmenu', handleDestroy);

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
            currentMenuItem = $(e.target);

          function isFocusedElement() {
            return this === document.activeElement;
          }

          function prevMenuItem() {
            // If the first item in the popup menu is already focused, close the menu and focus
            // on the last visible item in the tabs list.
            var first = menu.find('li:first-child > a');
            if (first.filter(isFocusedElement).length > 0) {
              e.preventDefault();
              $(document).off(e);
              self.popupmenu.close();
              self.findLastVisibleTab();
            }
          }

          function nextMenuItem() {
            // If the last item in the popup menu is already focused, close the menu and focus
            // on the first visible item in the tabs list.
            var last = menu.find('li:last-child > a');
            if (last.filter(isFocusedElement).length > 0 && last.parent().is(':not(.submenu)')) {
              e.preventDefault();
              $(document).off(e);
              self.popupmenu.close();
              self.findFirstVisibleTab();
            }
          }

          switch(key) {
            case 37: // left
              if (currentMenuItem.is('a')) {
                if (currentMenuItem.parent().is(':not(:first-child)')) {
                  e.preventDefault(); // Prevent popupmenu from closing on left key
                }
                $(document).trigger({type: 'keydown.popupmenu', which: 38});
              }
              break;
            case 38: // up
              prevMenuItem();
              break;
            case 39: // right
              if (currentMenuItem.is('a') && !currentMenuItem.parent('.submenu').length) {
                $(document).trigger({type: 'keydown.popupmenu', which: 40});
              }
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
          paddingLeft, paddingRight, width;

        if (!target || target === undefined || !target.length || !self.anchors.length) {
          self.animatedBar.removeClass('visible').removeClass('no-transition');
          return;
        }
        paddingLeft = parseInt(target.css('padding-left'), 10) || 0;
        paddingRight = parseInt(target.css('padding-right'), 10) || 0;
        width = target.innerWidth();

        if (target.is('.tab')) {
          paddingLeft += parseInt(target.children('a').css('padding-left'), 10) || 0;
          paddingRight += parseInt(target.children('a').css('padding-right'), 10) || 0;
          width = target.children('a').width() + (paddingLeft*2);
          // Dirty hack
          if (target.is(':first-child, :last-child')) {
            width = width - 1;
          }
          if ($('html').hasClass('is-firefox')) {
            width = width - 1;
          }
        }
        if (target.is('.dismissible.tab') || target.is('.has-popupmenu.tab')) {
          paddingRight -= target.is('.has-popupmenu.tab') ? 0 : 20;
          width += 20;
        }
        if (target.is('.tab-more')) {
          //width -= 22;
        }

        var left = Locale.isRTL() ?
          (paddingRight + target.position().left) : (target.position().left);

        // Round the math results
        //width = Math.round(width);
        //left = Math.round(left);

        clearTimeout(self.animationTimeout);
        this.animatedBar.addClass('visible');
        this.animationTimeout = setTimeout(function() {

          self.animatedBar.css({'left': left + 'px', 'width': width + 'px'});
          if (callback && typeof callback === 'function') {
            callback();
          }
        }, 0);
      },

      defocusBar: function() {
        var self = this,
          left = Locale.isRTL() ? 0 : (self.animatedBar.position().left+(self.animatedBar.outerWidth()/2));

        clearTimeout(self.animationTimeout);
        this.animatedBar.css({'left': left +'px', 'width': '0'});

        this.animationTimeout = setTimeout(function() {
          self.animatedBar.removeClass('visible').removeAttr('style');
        }, 350);
      },

      positionFocusState: function(target, unhide) {
        var self = this;
        target = target !== undefined ? $(target) :
            self.moreButton.hasClass('is-selected') ? self.moreButton :
            self.tablist.children('.is-selected').length > 0 ? self.tablist.children('.is-selected').children('a') : undefined;

        if (!target || target === undefined || !target.length) {
          this.focusState.removeClass('is-visible');
          return;
        }

        var pos = target.offset(),
          offset = this.tablist.offset(),
          width = parseInt(target.outerWidth()),
          height = parseInt(target.outerHeight());

        // Modifications on a specific basis
        // NOTE:  Uncomment the first one if we have to change the state type back
        /*
        if (target.is('.tab:first-child > a')) {
          pos.left = pos.left - 10;
          width = width + 9;
        }
        */
        if (target.is('.dismissible.tab > a') || target.is('.has-popupmenu.tab > a')) {
          width = width + 22;
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

        if (unhide && unhide === true) {
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

        if (!this.disabledElems) {
          this.disabledElems = [];
        }

        var self = this,
          tabs = this.tablist.children('li:not(.separator)');

        tabs.each(function() {
          var li = $(this),
            a = li.children('a'),
            panel = $(a.attr('href'));

          if (li.is('.is-disabled') || a.prop('disabled') === true) {
            self.disabledElems.push({
              elem: li,
              originalTabindex: li.attr('tabindex'),
              originalDisabled: a.prop('disabled')
            });
          }

          li.addClass('is-disabled');
          a.prop('disabled', true);
          panel.addClass('is-disabled');
          panel.find('*').each(function() {
            var t = $(this);

            // These are shadow inputs.  They are already handled by virtue of running .disable() on the original select tag.
            if (t.is('input.dropdown, input.multiselect')) {
              return;
            }

            if (t.attr('tabindex') === '-1' || t.attr('disabled')) {
              self.disabledElems.push({
                elem: t,
                originalTabindex: t.attr('tabindex'),
                originalDisabled: t.prop('disabled')
              });
            }

            t.disable();
          });
        });

        this.updateAria($());
      },

      enable: function() {
        this.element.prop('disabled', false).removeClass('is-disabled');

        var self = this,
          tabs = this.tablist.children('li:not(.separator)');

        tabs.each(function() {
          var li = $(this),
            a = li.children('a'),
            panel = $(a.attr('href'));

          li.removeClass('is-disabled');
          a.prop('disabled', false);
          panel.removeClass('is-disabled');
          panel.find('*').each(function() {
            var t = $(this);
            if (t.enable && typeof t.enable === 'function') {
              t.enable();
            }
          });

          $.each(self.disabledElems, function(i, obj) {
            var attrTarget = obj.elem.is('.tab') ? obj.elem.children('a') : obj.elem;
            if (obj.elem.disable && typeof obj.elem.disable === 'function') {
              obj.elem.disable();
            }

            if (obj.elem.is('li')) {
              obj.elem.addClass('is-disabled');
              return;
            }

            // These are shadow inputs.  They are already handled by virtue of running .disable() on the original select tag.
            if (obj.elem.is('input.dropdown, input.multiselect')) {
              return;
            }

            obj.elem.attr('tabindex', obj.originalTabindex);
            attrTarget.prop('disabled', obj.originalDisabled);
          });
        });

        this.disabledElems = [];

        this.updateAria(this.tablist.find('.is-selected > a'));
      },

      closeDismissibleTab: function(tabId) {
        return this.remove(tabId);
      },

      teardown: function() {
        this.panels.removeAttr('style');

        this.tablist
          .off()
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
            popup.menu.children('li:not(.separator)').each(function() {
              var li = $(this),
                a = li.children('a'),
                panel = a.data('panel-link');

              $.removeData(a[0], 'panel-link');
              if (panel && panel.length) {
                $.removeData(panel[0], 'tab-link');
              }
            });
            popup.destroy();
          }
        });

        this.panels
          .off();

        this.anchors
          .off()
          .removeAttr('role')
          .removeAttr('aria-expanded')
          .removeAttr('aria-selected')
          .removeAttr('tabindex');

        this.element.off('focusout.tabs updated.tabs activate.tabs');
        $(window).off('resize.tabs' + this.tabsIndex);
        this.tabsIndex = undefined;

        if (this.moreButton.data('popupmenu')) {
          var popup = this.moreButton.data('popupmenu');
          popup.menu.find('li:not(.separator)').each(function() {
            var li = $(this),
              a = li.children('a');

            if (a.data('original-tab')) {
              $.removeData(a[0], 'original-tab');
            }
          });
          popup.destroy();
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
