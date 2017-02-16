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

  $.fn.tabs = function(options) {

    // Tab Settings and Options
    var pluginName = 'tabs',
        defaults = {
          addTabButton: false, // If set to true, creates a button at the end of the tab list that can be used to add an empty tab and panel
          addTabButtonCallback: null, // if defined as a function, will be used in-place of the default Tab Adding method
          ajaxOptions: null, // if defined, will be used by any internal Tabs AJAX calls as the desired request settings.
          containerElement: null, // Defines a separate element to be used for containing the tab panels.  Defaults to the Tab Container itself
          changeTabOnHashChange: false, // If true, will change the selected tab on invocation based on the URL that exists after the hash
          hashChangeCallback: null, // If defined as a function, provides an external method for adjusting the current page hash used by these tabs
          source: null, // If defined, will serve as a way of pulling in external content to fill tabs.
          sourceArguments: {}, // If a source method is defined, this flexible object can be passed into the source method, and augmented with parameters specific to the implementation.
          tabCounts: false, // If true, Displays a modifiable count above each tab.
        },
        tabContainerTypes = ['horizontal', 'vertical', 'module-tabs', 'header-tabs'],
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Tabs(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Actual Plugin Code
    Tabs.prototype = {

      init: function(){
        return this
          .setup()
          .build()
          .setupEvents();
      },

      setup: function() {
        // Used by the $(body).resize event to correctly identify the tabs container element
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
          this.container.addClass('tab-panel-container');
        }

        // Add a default tabs class of "horizontal" if it doesn't already exist
        var noClass = true;
        tabContainerTypes.forEach(function tabTypeIterator(val, i) {
          if (self.element.hasClass(tabContainerTypes[i])) {
            noClass = false;
          }
        });
        if (noClass) {
          if (this.element.closest('.header').length) {
            self.element.addClass('header-tabs');
          } else {
            self.element.addClass('horizontal');
          }
        }

        // Build Tab Counts
        if (self.settings.tabCounts) {
          self.container.addClass('has-counts');
        }

        //Attach Tablist role and class to the tab headers container
        self.tablist = self.element.children('.tab-list');
        if (!self.tablist.length) {
          self.tablist = self.element.children('.tab-list-container').children('.tab-list');
        }

        self.tablist
          .attr({
            'class': 'tab-list',
            'role': 'tablist',
            'aria-multiselectable': 'false'
          });

        if (this.hasSquareFocusState()) {
          self.focusState = self.container.children('.tab-focus-indicator');
          if (!self.focusState.length) {
            self.focusState = $('<div class="tab-focus-indicator" role="presentation"></div>').insertBefore(self.tablist);
          }
        }

        if (this.hasAnimatedBar()) {
          self.animatedBar = self.container.children('.animated-bar');
          if (!self.animatedBar.length) {
            self.animatedBar = $('<div class="animated-bar" role="presentation"></div>').insertBefore(self.tablist);
          }
        }

        // Add the markup for the "More" button if it doesn't exist.
        self.moreButton = self.tablist.next('.tab-more');
        if (!self.isVerticalTabs() && self.moreButton.length === 0) {
          var button = $('<div>').attr({'class': 'tab-more'});
          button.append( $('<span class="more-text">').text(Locale.translate('More')));
          button.append($.createIconElement({ classes: 'icon-more', icon: 'dropdown' }));
          self.tablist.after(button);
          self.moreButton = button;
        }

        // Add the application menu Module Tab, if applicable
        if (self.isModuleTabs() && !this.tablist.find('.application-menu-trigger').length) {
          var appMenuTrigger = $('<li class="tab application-menu-trigger"><a href="#">' +
            '<span class="icon app-header"><span class="one"></span><span class="two"></span><span class="three"></span></span>' +
            '<span>Menu</span>' +
            '</a></tab>');
          this.tablist.prepend(appMenuTrigger);
        }

        // Add Tab Button
        if (this.settings.addTabButton) {
          this.addTabButton = this.moreButton.next('.add-tab-button');
          if (!this.addTabButton || !this.addTabButton.length) {
            this.addTabButton = $('<div class="add-tab-button" tabindex="0" role="button">' +
              '<span aria-hidden="true" role="presentation">+</span>' +
              '<span class="audible">'+ Locale.translate('AddNewTab') +'</span>' +
              '</div>');
            this.addTabButton.insertAfter(this.moreButton);
            this.element.addClass('has-add-button');
          }
        }
        if (!this.settings.addTabButton && this.addTabButton && this.addTabButton.length) {
          this.addTabButton.remove();
          this.element.removeClass('has-add-button');
        }

        //for each item in the tabsList...
        self.anchors = self.tablist.children('li:not(.separator)').children('a');
        self.anchors.each(function prepareAnchor() {
          var a = $(this);
          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');

          if (a.parent().hasClass('dismissible') && !a.parent().children('.icon').length) {
            $.createIconElement({ icon: 'close', classes: 'icon close' }).insertAfter(a);
          }

          // Find and configure dropdown tabs
          var dd = a.nextAll('ul').first();
          if (dd.length > 0) {
            dd.addClass('dropdown-tab');
            var li = a.parent();

            li.addClass('has-popupmenu').popupmenu({
              menu: dd,
              trigger: 'click',
              attachToBody: true
            });

            a.removeAttr('role').removeAttr('aria-expanded').removeAttr('aria-selected');

            if (!a.parent().children('.icon.icon-more').length) {
              $.createIconElement({ classes: 'icon-more', icon: 'dropdown' }).insertAfter(a);
            }
          }

          if (self.settings.tabCounts && $(this).find('.count').length === 0) {
            $(this).prepend('<span class="count">0 </span>');
          }
        });

        // Build/manage tab panels
        function associateAnchorWithPanel() {
          var a = $(this),
            li = a.parent(),
            popup = li.data('popupmenu');

          // Associated the current one
          var href = a.attr('href');

          if (href.substr(0, 1) !== '#') {
            //is an outbound Link
            return;
          }

          if (href !== undefined && href !== '#') {
            var panel = $(href);

            if (li.is(':not(.has-popupmenu)') && !panel.length) {
              return;
            }

            a.data('panel-link', panel);
            panel.data('tab-link', a);
            self.panels = self.panels.add(panel);
          }

          // If dropdown tab, add the contents of the dropdown
          // NOTE: dropdown tabs shouldn't have children, so they aren't accounted for here
          if (popup) {
            popup.menu.children('li').each(function() {
              var li = $(this),
                a = li.children('a'),
                href = a.attr('href'),
                panel = $(href);

              a.data('panel-link', panel);
              panel.data('tab-link', a);

              self.panels = self.panels.add(panel);
              self.anchors = self.anchors.add(a);

              if (!li.hasClass('dismissible')) {
                return;
              }

              var icon = li.children('.icon');
              if (!icon.length) {
                icon = $.createIconElement({icon: 'close', classes: 'icon close'});
              }
              icon.detach().appendTo(a);

            }).on('click.popupmenu', '.icon', function iconClickHandler(e) {
              var icon = $(this),
                li = icon.closest('li');

              if (li.is('.dismissible') && icon.is('.icon')) {
                e.preventDefault();
                e.stopPropagation();
                self.closeDismissibleTab(li.children('a').attr('href'));
              }
            });
          }
        }

        self.panels = $();
        self.anchors.each(associateAnchorWithPanel);
        self.panels
          .addClass('tab-panel')
          .attr({'role': 'tabpanel'})
          .find('h3:first').attr('tabindex', '0');

        var excludes = ':not(.separator):not(.is-disabled):not(.is-hidden)',
          tabs = this.tablist.children('li' + excludes),
          selected = this.tablist.children('li.is-selected' + excludes),
          selectedAnchor = selected.children('a');

        // Setup a hash for nested tab controls
        self.nestedTabControls = self.panels.find('.tab-container');

        if (tabs.length) {
          // If the hashChange setting is on, change the selected tab to the one referenced by the hash
          if (this.settings.changeTabOnHashChange) {
            var hash = window.location.hash;
            if (hash && hash.length) {
              var matchingTabs = tabs.find('a[href="'+ hash +'"]');
              if (matchingTabs.length) {
                selected = matchingTabs.first().parent();
                selectedAnchor = selected.children('a');
              }
            }
          }

          // If there is no selected tab, try to find the first available tab (if there are any present)
          if (!selected.length) {
            selected = tabs.not('.add-tab-button, .application-menu-trigger').first();
            selectedAnchor = selected.children('a');
          }

          // If there are tabs present, activate the first one
          if (selected.length) {
            this.activate(selectedAnchor.attr('href'));
          }
        }

        if (this.isModuleTabs() && this.element.children('.toolbar').length) {
          this.element.addClass('has-toolbar');
        }

        this.setOverflow();

        if (this.hasSquareFocusState()) {
          this.positionFocusState(selectedAnchor);
        }

        if (this.hasAnimatedBar()) {
          this.animatedBar.addClass('no-transition');
          this.focusBar(undefined, function transitionRemover() {
            setTimeout(function() {
              self.animatedBar.removeClass('no-transition');
            }, 0);
          });
        }

        return this;
      },

      setupEvents: function() {
        var self = this;

        // Set animation bar if tabs under modal
        var modal = self.element.closest('.modal');
        if (modal.length) {
          modal.on('afteropen', function () {
            if (self.hasAnimatedBar()) {
              self.focusBar();
            }
          });
        }

        // Clicking the 'a' triggers the click on the 'li'
        function routeAnchorClick(e) {
          var a = $(e.currentTarget);

          if (a.attr('href').substr(0, 1) !== '#') {
            //is an outbound Link
            return;
          }

          e.preventDefault();
        }

        // Some tabs have icons that can be clicked and manipulated
        function handleIconClick(e) {
          var elem = $(this);
          if (elem.is('[disabled]') || elem.parent().hasClass('is-disabled')) {
            return;
          }

          var li = $(elem).parent();

          if (li.hasClass('dismissible')) {
            e.preventDefault();
            e.stopPropagation();
            self.closeDismissibleTab(li.children('a'));
          }
        }

        function handleTabBlur() {
          $(this).parent().removeClass('is-focused');
        }

        // Any events bound to individual tabs (li) and their anchors (a) are bound to the tablist
        // element so that tabs can be added/removed/hidden/shown without needing to change event bindings.
        this.tablist
          .onTouchClick('tabs', '> li')
          .on('click.tabs', '> li', function(e) {
            return self.handleTabClick(e, $(this));
          })
          .on('click.tabs touchend.tabs touchcancel.tabs', 'a', routeAnchorClick)
          .on('click.tabs touchend.tabs touchcancel.tabs', '.icon', handleIconClick)
          .on('focus.tabs', 'a', function(e) {
            return self.handleTabFocus(e, $(this));
          })
          .on('blur.tabs', 'a', handleTabBlur)
          .on('keydown.tabs', 'a', function(e) {
            return self.handleTabKeyDown(e);
          });

        // Setup a mousedown event on tabs to determine in the focus handler whether or a not a keystroked cause
        // a change in focus, or a click.  Keystroke focus changes cause different visual situations
        function addClickFocusData(e) {
          var tab = $(this);
          if (tab.is('.is-disabled')) {
            e.preventDefault();
            return false;
          }

          self.hideFocusState();
          tab.children('a').data('focused-by-click', true);
        }
        this.tablist.on('mousedown.tabs', '> li', addClickFocusData);
        this.moreButton.on('mousedown.tabs', addClickFocusData);

        // Setup events on Dropdown Tabs
        function dropdownTabEvents(i, tab) {
          var li = $(tab),
            a = li.children('a'),
            menu = li.data('popupmenu').menu;

          // Alt+Del or Alt+Backspace closes a dropdown tab item
          function closeDropdownMenuItem(e) {
            if (!e.altKey || !li.is('.dismissible')) {
              return;
            }

            self.closeDismissibleTab(a.attr('href'));
            return;
          }

          menu.on('keydown.popupmenu', 'a', function(e) {
            switch(e.which) {
              case 27: // escape
                li.addClass('is-selected');
                a.focus();
                break;
              case 8: // backspace (delete on Mac)
                closeDropdownMenuItem(e);
                break;
              case 46: // The actual delete key
                closeDropdownMenuItem(e);
                break;
            }
          });

          li.on('selected.tabs', function(e, anchor) {
            var href = $(anchor).attr('href');
            self.activate(href);

            if (self.hasSquareFocusState()) {
              self.positionFocusState(a);
            }

            if (self.hasAnimatedBar()) {
              self.focusBar(li);
            }

            a.focus();
            li.addClass('is-selected');
            return false;
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
        this.moreButton
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

        if (this.settings.addTabButton) {
          this.addTabButton
            .onTouchClick('tabs')
            .on('click.tabs', function() {
              self.handleAddButton();
            })
            .on('keydown.tabs', function(e) {
              self.handleAddButtonKeydown(e);
            })
            .on('focus.tabs', function(e) {
              self.handleAddButtonFocus(e);
            });
        }

        this.panels.on('keydown.tabs', function(e) {
          self.handlePanelKeydown(e);
        });

        // Check whether or not all of the tabs + more button are de-focused.
        // If true, the focus-state and animated bar need to revert positions
        // back to the currently selected tab.
        this.element.on('focusout.tabs', function allTabsFocusOut() {
          var noFocusedTabs = !$.contains(self.element[0], document.activeElement),
            noPopupMenusOpen = self.tablist.children('.has-popupmenu.is-open').length === 0;

          if (noFocusedTabs && noPopupMenusOpen && !self.moreButton.is('.is-selected, .popup-is-open')) {
            self.hideFocusState();
          }
        }).on('updated.tabs', function() {
          self.updated();
        }).on('activated.tabs', function(e) {
          // Stop propagation of the activate event from going higher up into the DOM tree
          e.stopPropagation();
        }).on('add.tabs', function(e, newTabId, newTabOptions, newTabIndex) {
          self.add(newTabId, newTabOptions, newTabIndex);
        }).on('remove.tabs', function(e, tabId) {
          self.remove(tabId);
        });

        // Check to see if we need to add/remove the more button on resize
        $('body').on('resize.tabs' + this.tabsIndex, function() {
          self.handleResize();
        });
        self.handleResize();

        return this;
      },

      handleTabClick: function(e, li) {
        if (this.element.is('.is-disabled') || (li && li.is('.is-disabled'))) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        var appMenuResult = this.handleAppMenuTabKeydown(e);
        if (!appMenuResult) {
          return;
        }

        var a = li.children('a');
        a.data('focused-by-click', true);

        if (this.popupmenu && this.popupmenu.element.hasClass('is-open')) {
          this.popupmenu.close();
        }

        // Don't activate a dropdown tab.  Clicking triggers the Popupmenu Control attached.
        if (li.is('.has-popupmenu')) {
          this.positionFocusState(a);
          return;
        }

        var href = a.attr('href');

        if (li.is('.add-tab-button')) {
          a = this.handleAddButton();
          li = a.parent();
          href = a.attr('href');
          this.element.trigger('tab-added', [a]);
        }

        this.activate(href);
        this.changeHash(href);

        if (this.hasSquareFocusState()) {
          this.focusState.removeClass('is-visible');
        }

        a.focus();

        // Hide these states
        this.focusBar(li);
        this.positionFocusState(a);

        if (this.isURL(href)) {
          return false;
        }
      },

      handleMoreButtonClick: function(e) {
        if (this.element.is('.is-disabled') || this.moreButton.is('.is-disabled')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        this.moreButton.data('focused-by-click', true);

        if (!(this.container.hasClass('has-more-button'))) {
          e.stopPropagation();
        }
        if (this.moreButton.hasClass('popup-is-open')) {
          this.popupmenu.close();
          this.moreButton.removeClass('popup-is-open');
        } else {
          this.buildPopupMenu();
        }

        this.hideFocusState();
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
        } else {
          li.addClass('is-focused');
          this.positionFocusState(a, focusedByKeyboard);
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

        if (this.hasSquareFocusState()) {
          this.focusState.removeClass('is-visible');
          this.positionFocusState(this.moreButton, focusedByKeyboard);
        }
      },

      handleTabKeyDown: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        if (e.shiftKey || e.ctrlKey || e.metaKey || (e.altKey && e.which !== 8)) {
          return;
        }

        var passableKeys = [8, 13, 32];

        function isPassableKey() {
          return $.inArray(e.which, passableKeys) > -1;
        }

        if ((e.which < 32 && !isPassableKey()) || e.which > 46) {
          return;
        }

        if (isPassableKey()) {
          var appMenuResult = this.handleAppMenuTabKeydown(e);
          if (!appMenuResult) {
            return;
          }
        }

        var self = this,
          allExcludes = ':not(.separator):not(.is-disabled):not(:hidden)',
          currentLi = $(e.currentTarget).parent(),
          currentA = currentLi.children('a'),
          targetLi,
          tabs = self.tablist.children('li' + allExcludes),
          isRTL = Locale.isRTL();

        function previousTab() {
          var i = tabs.index(currentLi) - 1;
          while (i > -1 && !targetLi) {
            if (tabs.eq(i).is(allExcludes)) {
              return tabs.eq(i);
            }
            i = i - 1;
          }

          if (self.settings.addTabButton) {
            return self.addTabButton;
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

          if (self.settings.addTabButton) {
            return self.addTabButton;
          }
          return self.tablist.children('li' + allExcludes).first();
        }

        function checkAngularClick() {
          if (currentA.attr('ng-click') || currentA.attr('data-ng-click')) { // Needed to fire the "Click" event in Angular situations
            currentA.click();
          }
        }

        function activate() {
          if (currentLi.hasClass('has-popupmenu')) {
            currentLi.data('popupmenu').open();
            return;
          }

          var href = currentA.attr('href');

          if (currentLi.is('.add-tab-button')) {
            currentA = self.handleAddButton();
            currentLi = currentA.parent();
            href = currentA.attr('href');
            self.element.trigger('tab-added', [currentA]);
          }

          self.activate(href);
          self.changeHash(href);
          self.focusBar(currentLi);
          checkAngularClick();
          currentA[0].focus();
          self.hideFocusState();

          // In the event that the activated tab is a full link that should be followed,
          // the keystroke events need to manually activate the link change.  Clicks are handled
          // automatically by the browser.
          self.handleOutboundLink(href);
        }

        switch(e.which) {
          case 8:
            if (e.altKey && currentLi.is('.dismissible')) {
              e.preventDefault();
              self.closeDismissibleTab(currentA.attr('href'));
            }
            return;
          case 13: // Enter
            activate();
            return false;
          case 32: // Spacebar
            activate();
            return false;
          case 38:
            targetLi = previousTab();
            e.preventDefault(); // jshint ignore:line
            break;
          case 37:
            targetLi = isRTL ? nextTab() : previousTab();
            e.preventDefault();
            break;
          case 40:
            targetLi = nextTab();
            e.preventDefault(); // jshint ignore:line
            break;
          case 39:
            targetLi = isRTL ? previousTab() : nextTab();
            e.preventDefault();
            break;
        }

        var isAddTabButton = targetLi.is('.add-tab-button'),
          focusStateTarget = isAddTabButton ? targetLi : targetLi.children('a');

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

        if (!isAddTabButton) {
          focusStateTarget.focus();
        } else {
          self.addTabButton.focus();
        }

        if (self.hasSquareFocusState()) {
          self.positionFocusState(focusStateTarget, true);
        }
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

      handleAppMenuTabKeydown: function(e) {
        var target = $(e.target),
          li = target.parent();

        if (!(li.is('.application-menu-trigger') || target.is('.application-menu-trigger'))) {
          return true;
        }

        // If the tab is an application-menu trigger, open the app menu
        // Used by Module Tabs
        var menu = $('#application-menu');
        if (!menu.length) {
          return false;
        }

        e.preventDefault();

        this.hideFocusState();

        if (menu.hasClass('is-open')) {
          menu.trigger('close-applicationmenu');
          return false;
        }

        menu.trigger('open-applicationmenu');
        return false;
      },

      handleMoreButtonKeydown: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        var self = this,
          isRTL = Locale.isRTL();

        function openMenu() {
          e.preventDefault();
          self.buildPopupMenu(self.tablist.find('.is-selected').children('a').attr('href'));
          self.positionFocusState(self.moreButton, true);
        }

        function lastTab() {
          e.preventDefault();
          self.findLastVisibleTab();
        }

        switch(e.which) {
          case 37: // left
            if (isRTL) {
              openMenu();
              break;
            }
            lastTab();
            break;
          case 38: // up
            lastTab();
            break;
          case 13: // enter
          case 32: // spacebar
            e.preventDefault(); //jshint ignore:line
          case 39: // right
            if (isRTL) {
              lastTab();
              break;
            }
            openMenu();
            break;
          case 40: // down
            openMenu();
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

      handleAddButton: function() {
        var cb = this.settings.addTabButtonCallback;
        if (cb && typeof cb === 'function') {
          var newTabId = cb();
          return this.anchors.filter('[href="#'+ newTabId +'"]');
        }

        function makeId() {
          var stringName = 'new-tab',
            existing = $('[id^="'+ stringName +'"]');

          if (!existing.length) {
            return stringName + '-0';
          }
          return stringName + '-' + existing.length;
        }

        function makeName(id) {
          var nameParts = id.toString().split('-');
          nameParts.forEach(function(val, i) {
            nameParts[i] = val.charAt(0).toUpperCase() + val.slice(1);
          });

          return nameParts.join(' ');
        }

        var newIndex = this.tablist.children().index(this.addTabButton),
          newId = makeId(),
          newName = makeName(newId),
          settings = {
            name: newName,
            content: '&nbsp;',
            isDismissible: true
          };

        if (newIndex < 0) {
          newIndex = this.tablist.find('li:not(.separator)').length;
        }

        // Allow the opportunity to pass in external settings for the new tab control
        var externalSettings = this.element.triggerHandler('before-tab-added', [newId, settings, newIndex]);
        if (!externalSettings) {
          this.add(newId, settings, newIndex);
          return this.anchors.filter('[href="#'+ newId +'"]');
        }

        if (externalSettings.newId && externalSettings.newId.length && typeof externalSettings.newId === 'string') {
          newId = externalSettings.newId;
        }
        if (externalSettings.settings && typeof externalSettings.settings === 'object') {
          settings = externalSettings.settings;
        }
        if (!isNaN(externalSettings.newIndex)) {
          newIndex = externalSettings.newIndex;
        }

        this.add(newId, settings, newIndex);
        return this.anchors.filter('[href="#'+ newId +'"]');
      },

      handleAddButtonKeydown: function(e) {
        if (this.element.is('.is-disabled')) {
          e.preventDefault();
          return false;
        }

        var self = this,
          isRTL = Locale.isRTL(),
          targetLi,
          filter = 'li:not(.separator):not(.is-disabled):not(:hidden)';

        function openMenu() {
          e.preventDefault();
          targetLi = self.tablist.find(filter).last();

          if (self.isTabOverflowed(targetLi)) {
            // Open the spillover
            self.buildPopupMenu(targetLi.children('a').attr('href'));
            self.positionFocusState(self.moreButton, true);
            return;
          }
        }

        function firstTab() {
          targetLi = self.tablist.find(filter).first();
        }

        switch(e.which) {
          case 37: // left
            if (isRTL) {
              firstTab();
              break;
            }
            openMenu();
            break;
          case 38: // up
            openMenu();
            break;
          case 13: // enter
          case 32: // spacebar
            e.preventDefault(); //jshint ignore:line
            return this.handleAddButton();
          case 39: // right
            if (isRTL) {
              openMenu();
              break;
            }
            firstTab();
            break;
          case 40: // down
            firstTab();
            break;
          default:
            return;
        }

        targetLi.children('a').focus();
      },

      handleAddButtonFocus: function() {
        var tabs = this.tablist.find('li:not(.separator)');
        tabs.add(this.moreButton).removeClass('is-focused');

        this.addTabButton.addClass('is-focused');
        this.positionFocusState(this.addTabButton, true);
      },

      handleResize: function() {
        this.setOverflow();

        var selected = this.tablist.find('.is-selected');
        if (!selected.length || this.moreButton.is('.is-selected') || this.isTabOverflowed(selected)) {
          selected = this.moreButton;
        }

        if (!selected.length) {
          this.defocusBar();
          this.hideFocusState();
        } else {
          this.focusBar(selected);
          this.positionFocusState(selected);
        }

        this.handleVerticalTabResize();
        this.renderVisiblePanel();
      },

      handleVerticalTabResize: function() {
        if (!this.isVerticalTabs()) {
          return;
        }

        // When tabs are full-size (part of a layout) CSS rules should handle this better
        // due to less strange sizing constraints.  JS resizing is necessary for nesting.
        if (!this.isNested() || this.isNestedInLayoutTabs() || this.isHidden()) {
          return;
        }

        var elemStyle = window.getComputedStyle(this.element[0]),
          elemOuterHeight = elemStyle.getPropertyValue('height') + elemStyle.getPropertyValue('margin-top') + elemStyle.getPropertyValue('margin-bottom');

        this.tablist[0].style.height = elemOuterHeight;
      },

      // Changes the location in the browser address bar to force outbound links.
      handleOutboundLink: function(href, useRelativePath) {
        if (href.charAt(0) === '#') {
          return false;
        }

        if (href.charAt(0) === '/' && (!useRelativePath || useRelativePath === false)) {
          href = window.location.origin + href;
        }

        window.location = href;
      },

      hasAnimatedBar: function() {
        return !this.isModuleTabs() && !this.isVerticalTabs();
      },

      hasSquareFocusState: function() {
        return true;
      },

      isModuleTabs: function() {
        return this.element.hasClass('module-tabs');
      },

      isVerticalTabs: function() {
        return this.element.hasClass('vertical');
      },

      isHeaderTabs: function() {
        return this.element.hasClass('header-tabs');
      },

      isHidden: function() {
        return this.element.is(':hidden');
      },

      isNested: function() {
        return this.element.closest('.tab-panel').length;
      },

      isActive: function(href) {
        if (!href || !href.length || (href.length === 1 && href.indexOf('#') < 1)) {
          return false;
        }

        var panel = this.getPanel(href);
        return panel[0].classList.contains('can-show');
      },

      isNestedInLayoutTabs: function() {
        var nestedInModuleTabs = this.element.closest('.module-tabs').length,
          nestedInHeaderTabs = this.element.closest('.header-tabs').length,
          hasTabContainerClass = this.element.closest('.tab-panel-container').length;

        return (nestedInModuleTabs > 0 || nestedInHeaderTabs > 0 || hasTabContainerClass > 0);
      },

      isTab: function(obj) {
        return obj instanceof jQuery && obj.length && obj.is('li.tab');
      },

      isAnchor: function(obj) {
        return obj instanceof jQuery && obj.length && obj.is('a');
      },

      getAnchor: function(href) {
        if (this.isAnchor(href)) {
          return href;
        }

        if (href.indexOf('#') === -1 && href.charAt(0) !== '/') {
          href = '#' + href;
        }
        return this.anchors.filter('[href="' + href + '"]');
      },

      getPanel: function(href) {
        if (this.isTab(href)) {
          href = href.children('a');
        }

        if (this.isAnchor(href)) {
          href = href.attr('href');
        }

        if (!href || href === '' || href === '#') {
          return $();
        }

        return this.panels.filter('[id="' + href.replace(/#/g, '') + '"]');
      },

      getMenuItem: function(href) {
        if (this.isAnchor(href)) {
          href = href.attr('href');
        }

        if (href.indexOf('#') === -1) {
          href = '#' + href;
        }
        return this.moreMenu.children().children().filter('[data-href="'+ href +'"]').parent();
      },

      // Takes a tab ID and returns a jquery object containing the previous available tab
      getPreviousTab: function(tabId) {
        var tab = this.getTab(null, tabId),
          filter = 'li:not(.separator):not(:hidden):not(.is-disabled)',
          tabs = this.tablist.find(filter),
          target = tabs.eq(tabs.index(tab) - 1);

        while(target.length && !target.is(filter)) {
          target = tabs.eq(tabs.index(target) - 1);
        }

        // Top-level Dropdown Tabs don't have an actual panel associated with them.
        // Get a Dropdown Tab's first child as the target.
        if (target.is('.has-popupmenu')) {
          var menuAPI = target.data('popupmenu');
          if (menuAPI) {
            target = menuAPI.menu.children('li').first();
          }
        }

        return target;
      },

      // Takes a tab ID and returns a jquery object containing the previous available tab
      // If an optional target Tab (li) is provided, use this to perform activation events
      activatePreviousTab: function(tabId, target) {
        var tab = this.getTab(null, tabId);

        if (!target || !(target instanceof jQuery)) {
          target = this.getPreviousTab(tabId);
        }

        if (!target.length) {
          this.hideFocusState();
          this.defocusBar();
          return target;
        }

        var a = target.children('a');
        if (tab.is('.is-selected')) {
          this.activate(a.attr('href'));
          a.focus();
        }
        this.positionFocusState(a);
        this.focusBar(target);

        return target;
      },

      isURL: function(href) {
        if (href.indexOf('#') === 0) {
          return false;
        }

        return true;
      },

      activate: function(href) {
        var self = this,
          a, targetTab, targetPanel, targetPanelElem, oldTab, oldPanel,
          selectedStateTarget,
          activeStateTarget;

        if (self.isURL(href)) {
          return this.callSource(href, true);
        }

        a = self.getAnchor(href);
        targetTab = a.parent();
        targetPanel = self.getPanel(href);
        targetPanelElem = targetPanel[0];
        oldTab = self.anchors.parents().filter('.is-selected');

        // Avoid filter(:visible)
        for (var i = 0; i < self.panels.length; i++) {
          if (self.panels[i].classList.contains('is-visible')) {
            oldPanel = $(self.panels[i]);
          }
        }

        if (!oldPanel) {
          oldPanel = self.panels;
        }

        var isCancelled = self.element.trigger('beforeactivate', [a]);
        if (!isCancelled) {
          return;
        }

        if (this.settings.source && targetPanel.length < 1) {
          return this.callSource(href);
        }

        oldPanel.removeClass('is-visible can-show').closeChildren();
        self.element.trigger('activated', [a]);

        targetPanelElem.classList.add('can-show');
        self.renderVisiblePanel();
        targetPanelElem.offsetHeight; // jshint ignore:line
        targetPanel.one($.fn.transitionEndName() + '.tabs', function() {
          self.element.trigger('afteractivated', [a]);
        });

        // Triggers the CSS Animation
        targetPanelElem.classList.add('is-visible');

        // Update the currently-selected tab
        self.updateAria(a);
        oldTab.add(this.moreButton).removeClass('is-selected');

        if (targetTab[0].classList.contains('tab')) {
          selectedStateTarget = targetTab;
          activeStateTarget = targetTab;
        }

        var ddMenu = targetTab.parents('.popupmenu'),
          ddTab;

        if (ddMenu.length) {
          ddTab = ddMenu.data('trigger');
          if (ddTab.length) {
            selectedStateTarget = ddTab;
            activeStateTarget = ddTab;
          }
        }

        if (this.isTabOverflowed(activeStateTarget)) {
          activeStateTarget = this.moreButton;
          selectedStateTarget = this.moreButton;
        }
        this.focusBar(activeStateTarget);

        selectedStateTarget.addClass('is-selected');

        // Fires a resize on any invoked child toolbars inside the tab panel.
        // Needed to fix issues with Toolbar alignment, since we can't properly detect
        // size on hidden elements.
        var childToolbars = targetPanel.find('.toolbar');
        if (childToolbars.length) {
          childToolbars.each(function() {
            var api = $(this).data('toolbar');
            if (api && typeof api.handleResize === 'function') {
              api.handleResize();
            }
          });
        }

      },

      /**
       * Calls an options-provided source method to fetch content that will be displayed inside a tab.
       * @param {string} href - string representing the target tab to load content under.
       * @param {function} callback - method that fires after a successful source call.
       * @returns {boolean|$.Deferred} true if source call was successful, false for failure/ignore, or a promise object that will fire callbacks in either "success" or "failure" scenarios.
       */
      callSource: function(href, isURL) {
        if ((isURL === undefined || isURL === null || isURL === false) && !this.settings.source) {
          return false;
        }

        var self = this,
          sourceType = typeof this.settings.source,
          response = function(htmlContent) {
            if (htmlContent === undefined || htmlContent === null) {
              return;
            }

            htmlContent = $.sanitizeHTML(htmlContent);

            // Get a new random tab ID for this tab if one can't be derived from the URL string
            if (isURL) {
              var anchor = self.tablist.find('[href="'+ href +'"]'),
                containerId = self.container[0].id || '',
                id = anchor.uniqueId('tab', containerId);

              href = '#' + id;
              // Replace the original URL on this anchor now that we've loaded content.
              anchor.attr('href', href);
            }

            self.createTabPanel(href, htmlContent, true);
            self.activate(href);

            self.container.triggerHandler('complete'); // For Busy Indicator
            self.container.trigger('requestend', [href, htmlContent]);
          };

        this.container.triggerHandler('start'); // For Busy Indicator
        this.container.trigger('requeststart');

        function handleStringSource(url, options) {
          var opts = $.extend({ dataType: 'html' }, options, {
            url: url
          });

          var request = $.ajax(opts);
          request.done(response);
          return request;
        }

        if (isURL) {
          return handleStringSource(href, this.ajaxOptions);
        }

        // return _true_ from this source function on if we're just loading straight content
        // return a promise if you'd like to setup async handling.
        if (sourceType === 'function') {
          return this.settings.source(response, href, this.settings.sourceArguments);
        }

        if (sourceType === 'string') {
          // Attempt to resolve source as a URL string.  Make an $.ajax() call with the URL
          var safeHref = href.replace(/#/g, ''),
            sourceURL = this.settings.source.toString(),
            hasHref = sourceURL.indexOf(safeHref) > -1;

          if (!hasHref) {
            var param = 'tab=' + safeHref,
              paramIndex = sourceURL.indexOf('?'),
              hashIndex = sourceURL.indexOf('#'),
              insertIndex = sourceURL.length;

            if (paramIndex < 0) {
              param = '?' + param;
              if (hashIndex > -1) {
                insertIndex = hashIndex + 1;
              }
            } else {
              param = param + '&';
              insertIndex = paramIndex + 1;
            }

            sourceURL = Soho.string.splice(sourceURL, insertIndex, 0, param);
          }

          return handleStringSource(sourceURL, this.ajaxOptions);
        }

        return false;
      },

      renderVisiblePanel: function() {
        // Recalculate all components inside of the visible tab to adjust widths/heights/display if necessary
        this.resizeNestedTabs();
        //TJM: Prioritizing performance fix.
        //this.panels.filter(':visible').handleResize();
      },

      changeHash: function(href) {
        if (!this.settings.changeTabOnHashChange) {
          return;
        }

        if (!href) {
          href = '';
        }

        href.replace(/#/g, '');

        var cb = this.settings.hashChangeCallback;
        if (cb && typeof cb === 'function') {
          cb(href);
        } else {
          window.location.hash = href;
        }

        this.element.triggerHandler('hash-change', [href]);
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

      resizeNestedTabs: function() {
        this.nestedTabControls.each(function(i, container) {
          var c = $(container),
            api = c.data('tabs');

          if (api && api.handleResize && typeof api.handleResize === 'function') {
            api.handleResize();
          }
        });
      },

      // Adds a new tab into the list and properly binds events
      add: function(tabId, options, atIndex) {
        if (!tabId) {
          return this;
        }

        if (!options) {
          options = {};
        }

        var startFromZero = this.tablist.find('li').not('.application-menu-trigger, .add-tab-button').length === 0;

        // Sanitize
        tabId = '' + tabId.replace(/#/g, '');
        options.name = options.name ? options.name.toString() : '&nbsp;';
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
          return sourceString;
        }

        if (options.content) {
          options.content = getObjectFromSelector(options.content);
        }
        if (options.dropdown) {
          options.dropdown = getObjectFromSelector(options.dropdown);
        }

        // Build
        var tabHeaderMarkup = $('<li role="presentation" class="tab"></li>'),
          anchorMarkup = $('<a href="#'+ tabId +'" role="tab" aria-expanded="false" aria-selected="false" tabindex="-1">'+ options.name +'</a>'),
          tabContentMarkup = this.createTabPanel(tabId, options.content);

        tabHeaderMarkup.html(anchorMarkup);

        if (options.isDismissible) {
          tabHeaderMarkup.addClass('dismissible');
          tabHeaderMarkup.append($.createIconElement({ icon: 'close', classes: 'close icon' }));
        }

        if (this.settings.tabCounts) {
          anchorMarkup.prepend('<span class="count">0 </span>');
        }

        if (options.dropdown) {
          // TODO: Need to implement the passing of Dropdown Tab menus into this method.
        }

        function insertIntoTabset(self, targetIndex) {
          var method,
            tabs = self.tablist.children('li'),
            nonSpecialTabs = tabs.not('.application-menu-trigger, .add-tab-button'),
            finalIndex = tabs.length - 1;

          if (!tabs.length) {
            tabHeaderMarkup.appendTo(self.tablist);
            tabContentMarkup.appendTo(self.container);
            return;
          }

          var addTabButton = tabs.filter('.add-tab-button'),
            appMenuTrigger = tabs.filter('.application-menu-trigger');

          // NOTE: Cannot simply do !targetIndex here because zero is a valid index
          if (targetIndex === undefined || targetIndex === null || isNaN(targetIndex)) {
            targetIndex = tabs.length;
          }

          function pastEndOfTabset(index) {
            return index > tabs.length - 1;
          }

          function atBeginningOfTabset(index) {
            return index <= 0;
          }

          if (tabs.length > nonSpecialTabs.length) {
            if (pastEndOfTabset(targetIndex) && addTabButton && addTabButton.length) {
              targetIndex = targetIndex - 1;
            }

            if (atBeginningOfTabset(targetIndex) && appMenuTrigger && appMenuTrigger.length) {
              targetIndex = targetIndex + 1;
            }
          }

          var conditionInsertTabBefore = tabs.eq(targetIndex).length > 0;

          finalIndex = conditionInsertTabBefore ? targetIndex : finalIndex;

          method = 'insertAfter';
          if (conditionInsertTabBefore) {
            method = 'insertBefore';
          }

          tabHeaderMarkup[method](tabs.eq(finalIndex));
          tabContentMarkup.appendTo(self.container);
          return;
        }

        insertIntoTabset(this, atIndex);

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
          this.positionFocusState(anchorMarkup);
          this.focusBar(tabHeaderMarkup);
          this.activate(anchorMarkup.attr('href'));
          anchorMarkup.focus();
        }

        return this;
      },

      // Removes a tab from the list and cleans up properly
      // NOTE: Does not take advantage of _activatePreviousTab()_ due to specific needs of selecting certain
      // Tabs/Anchors at certain times.
      remove: function(tabId) {
        var self = this,
          targetLi = this.doGetTab(null, tabId);

        if (!targetLi || !targetLi.length) {
          return;
        }

        var targetAnchor = targetLi.children('a'),
          targetPanel = this.getPanel(tabId),
          hasTargetPanel = (targetPanel && targetPanel.length),
          targetLiIndex = this.tablist.children('li').index(targetLi),
          notATab = '.application-menu-trigger, .separator, .is-disabled, :hidden',
          prevLi = targetLi.prev();

        var canClose = this.element.triggerHandler('beforeclose', [targetLi]);
        if (canClose === false) {
          return false;
        }

        var wasSelected = false;
        if (targetLi.hasClass('is-selected')) {
          wasSelected = true;
        } else {
          prevLi = this.tablist.children('li').not(notATab).filter('.is-selected');
        }

        // Remove these from the collections
        if (hasTargetPanel) {
          this.panels = this.panels.not(targetPanel);
        }
        this.anchors = this.anchors.not(targetAnchor);

        // Close Dropdown Tabs in a clean fashion
        var popupAPI = targetLi.data('popupmenu');
        if (targetLi.hasClass('has-popupmenu')) {
          if (popupAPI) {
            popupAPI.menu.children('li').each(function() {
              self.remove($(this).children('a').attr('href'));
            });
            popupAPI.destroy();
          }
        }

        // If this tab is inside of a Dropdown Tab's menu, detect if it was the last one
        // remaining, and if so, close the entire Dropdown Tab.
        // The actual check on these elements needs to be done AFTER the targetLi is removed
        // from a Dropdown Tab, to accurately check the number of list items remaining.
        // See: _isLastDropdownTabItem()_
        var parentMenu = targetLi.closest('.dropdown-tab'),
          trigger = parentMenu.data('trigger');

        // Kill associated events
        targetLi.off('click.tabs');
        targetAnchor.off('click.tabs focus.tabs keydown.tabs');

        // Remove Markup
        targetLi.remove();
        if (hasTargetPanel) {
          targetPanel.remove();
        }

        var menuItem = targetAnchor.data('moremenu-link');
        if (menuItem) {
          menuItem.parent().off().remove();
          $.removeData(targetAnchor[0], 'moremenu-link');
        }

        function isLastDropdownTabItem(menu) {
          return menu.length && menu.children('li:not(.separator)').length === 0;
        }
        if (isLastDropdownTabItem(parentMenu)) {
          prevLi = this.getPreviousTab(trigger);

          setTimeout(function() {
            self.remove(trigger);
          }, 1);
        }

        // Close dropdown tab's menu
        if (trigger && trigger.length) {
          trigger.data('popupmenu').close();
        }

        // Adjust tablist height
        this.setOverflow();

        this.element.trigger('close', [targetLi]);

        // If any tabs are left in the list, set the previous tab as the currently selected one.
        var count = targetLiIndex - 1;
        while (count > -1) {
          count = -1;
          if (prevLi.is(notATab)) {
            prevLi = prevLi.prev();
            count = count - 1;
          }
        }

        // If we find nothing, search for ANY available tab
        if (!prevLi.length) {
          prevLi = this.tablist.children('li').not(notATab).first();
        }

        // If there's really nothing, kick on out and defocus everything.
        if (!prevLi.length) {
          this.hideFocusState();
          this.defocusBar();

          this.element.trigger('afterclose', [targetLi]);
          return this;
        }

        var a = prevLi.children('a');
        this.positionFocusState(a);

        if (wasSelected) {
          this.activate(a.attr('href'));
        }

        this.focusBar(prevLi);
        a.focus();

        this.element.trigger('afterclose', [targetLi]);

        return this;
      },


      createTabPanel: function(tabId, content, doInsert) {
        tabId = tabId.replace(/#/g, '');

        // If a jQuery-wrapped element is provided, actually append the element.
        // If content is text/string, simply inline it.
        var markup = $('<div id="'+ tabId +'" class="tab-panel" role="tabpanel"></div>');
        if (content instanceof $) {
          markup.append(content);
        } else {
          markup[0].innerHTML = content || '';
        }

        if (doInsert === true) {
          this.container.append(markup);
        }

        this.panels = this.panels.add(markup);

        return markup;
      },

      checkPopupMenuItems: function(tab) {
        function getRemainingMenuItems(popupAPI) {
          if (!popupAPI || !popupAPI.menu) {
            return $();
          }
          var menu = popupAPI.menu,
            items = menu.children('li');

          if (!items.length) {
            popupAPI.destroy();
            return $();
          }
          return items;
        }

        if (tab.is('.has-popupmenu')) {
          return getRemainingMenuItems(tab.data('popupmenu'));
        }

        var ddTab = tab.closest('.dropdown-tab');
        if (!ddTab.length) {
          return $();
        }
        return getRemainingMenuItems(ddTab.data('popupmenu'));
      },

      getTab: function(e, tabId) {
        var self = this,
          tab = $();

        function getTabFromEvent(ev) {
          var t = $(ev.currentTarget);
          if (t.is('.tab')) {
            return t;
          }
          if (t.closest('.tab').length) {
            return t.closest('.tab').first();
          }
          return null;
        }

        function getTabFromId(id) {
          if (!id || id === '' || id === '#') {
            return null;
          }

          if (id.indexOf('#') === -1) {
            id = '#' + id;
          }

          var anchor = self.anchors.filter('[href="' + id + '"]');
          if (!anchor.length) {
            return null;
          }

          return anchor.parent();
        }

        // TabId can also be a jQuery object containing a tab.
        if (tabId instanceof $ && tabId.length > 0) {
          if (tabId.is('a')) {
            return tabId.parent();
          }
          return tabId;
        }

        return e ? getTabFromEvent(e) : tabId ? getTabFromId(tabId) : tab;
      },

      doGetTab: function(e, tabId) {
        if (!e && !tabId) { return $(); }
        if (e && !(e instanceof $.Event) && typeof e !== 'string') {
          return $();
        }

        if (e) {
          if (typeof e !== 'string') { // jQuery Event
            return this.getTab(e);
          }
          return this.getTab(null, e); // String containing a selector
        }

        // Straight to the TabID
        return this.getTab(null, tabId);
      },

      // Hides a tab
      hide: function(e, tabId) {
        var tab = this.doGetTab(e, tabId);

        if (tab.is('.is-selected')) {
          this.activatePreviousTab(tabId);
        }
        tab.addClass('hidden');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Shows a tab
      show: function(e, tabId) {
        var tab = this.doGetTab(e, tabId);

        tab.removeClass('hidden');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Disables an individual tab
      disableTab: function(e, tabId) {
        var tab = this.doGetTab(e, tabId);

        if (tab.is('.is-selected')) {
          this.activatePreviousTab(tabId);
        }
        tab.addClass('is-disabled');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Enables an individual tab
      enableTab: function(e, tabId) {
        var tab = this.doGetTab(e, tabId);

        tab.removeClass('is-disabled');
        this.focusBar();
        this.positionFocusState();
        return this;
      },

      // Renames a tab and resets the focusable bar/animation.
      rename: function(e, tabId, name) {
        // Backwards compatibility with 4.2.0
        if (e && typeof e === 'string') {
          name = tabId;
          tabId = e;
        }

        if (!name) {
          return;
        }

        var tab = this.doGetTab(e, tabId),
          hasCounts = this.settings.tabCounts,
          anchor = tab.children('a'),
          count;

        if (hasCounts) {
          count = anchor.find('.count').clone();
        }

        anchor.text(name.toString());

        if (hasCounts) {
          anchor.prepend(count);
        }

        var doesTabExist = this.tablist.children('li').length < 2 ? tab : undefined;

        this.positionFocusState(doesTabExist);
        this.focusBar(doesTabExist);
      },

      // For tabs with counts, updates the count and resets the focusable bar/animation
      updateCount: function(e, tabId, count) {
        // Backwards compatibility with 4.2.0
        if (e && typeof e === 'string') {
          count = tabId;
          tabId = e;
        }

        if (!this.settings.tabCounts || !count) {
          return;
        }

        var tab = this.doGetTab(e, tabId);

        tab.children('a').find('.count').text(count.toString() + ' ');

        var doesTabExist = this.tablist.children('li').length < 2 ? tab : undefined;

        this.positionFocusState(doesTabExist);
        this.focusBar(doesTabExist);
      },

      // returns the currently active tab
      getActiveTab: function() {
        var visible = this.panels.filter(':visible');
        return this.anchors.filter('[href="#'+ visible.first().attr('id') +'"]');
      },

      getVisibleTabs: function() {
        var self = this,
          tabHash = $();

        this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)')
          .each(function tabOverflowIterator() {
            var tab = $(this);

            if (!self.isTabOverflowed(tab)) {
              tabHash = tabHash.add(tab);
            }
          });

        return tabHash;
      },

      getOverflowTabs: function() {
        var self = this,
          tabHash = $();

        this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)')
          .each(function tabOverflowIterator() {
            var tab = $(this);

            if (self.isTabOverflowed(tab)) {
              tabHash = tabHash.add(tab);
            }
          });

        return tabHash;
      },

      setOverflow: function () {
        var elem = this.element[0],
          tablist = this.tablist[0],
          HAS_MORE = 'has-more-button',
          hasMoreIndex = elem.classList.contains(HAS_MORE),
          tablistStyle = window.getComputedStyle(tablist, null),
          tabListHeight = parseInt(tablistStyle.getPropertyValue('height')) + 1; // +1 to fix an IE bug

        // Recalc tab width before detection of overflow
        if (this.isModuleTabs()) {
          this.adjustModuleTabs();
        }

        // Add "has-more-button" class if we need it, remove it if we don't
        if (tablist.scrollHeight > tabListHeight) {
          if (!hasMoreIndex) {
            elem.classList.add(HAS_MORE);
          }
        } else if (hasMoreIndex) {
          elem.classList.remove(HAS_MORE);
        }

        this.adjustSpilloverNumber();
      },

      adjustModuleTabs: function() {
        var self = this,
          sizeableTabs = this.tablist.find('li:not(.separator):not(.application-menu-trigger)'),
          appTrigger = this.tablist.find('.application-menu-trigger'),
          hasAppTrigger = appTrigger.length > 0,
          tabContainerW = this.tablist.outerWidth(),
          defaultTabSize = 120,
          visibleTabSize = 120,
          appTriggerSize = (hasAppTrigger ? appTrigger.outerWidth() : 0);

        // Remove overflowed tabs
        sizeableTabs.removeAttr('style').each(function() {
          var t = $(this);
          if (self.isTabOverflowed(t)) {
            sizeableTabs = sizeableTabs.not(t);
          }
        });

        // Resize the more button to fit the entire space if no tabs can show
        // Math: +101 is the padding of the <ul class="tab-list"> element
        if (!sizeableTabs.length) {
          visibleTabSize = (tabContainerW - appTriggerSize + 101);
          this.moreButton[0].style.width = visibleTabSize + 'px';
          return;
        }

        // Math explanation:
        // Width of tab container - possible applcation menu trigger
        // Divided by number of visible tabs (doesn't include app menu trigger which shouldn't change size)
        // Minus one (for the left-side border of each tab)
        visibleTabSize = ((tabContainerW - appTriggerSize) / sizeableTabs.length - 1);

        if (visibleTabSize < defaultTabSize) {
          visibleTabSize = defaultTabSize;
        }

        for (var i = 0; i < sizeableTabs.length; i++) {
          sizeableTabs[i].style.width = visibleTabSize + 'px';
        }

        this.adjustSpilloverNumber();
      },

      adjustSpilloverNumber: function() {
         var moreDiv = this.moreButton.find('.more-text'),
          tabs = this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)'),
          overflowedTabs = this.getOverflowTabs();

        if (tabs.length <= overflowedTabs.length) {
          moreDiv.text('' + Locale.translate('Tabs'));
        } else {
          moreDiv.text('' + Locale.translate('More'));
        }

        var countDiv = this.moreButton.find('.count');
        if (!countDiv.length) {
          countDiv = $('<span class="count"></span>');
          this.moreButton.children('span').first().prepend(countDiv);
        }

        countDiv.text('' + overflowedTabs.length + ' ');

        return;
      },

      //Selects a Tab
      select: function (href) {
        var modHref = href.replace(/#/g, ''),
          anchor = this.getAnchor(modHref);

        this.positionFocusState(undefined, false);
        this.focusBar(anchor.parent());
        this.activate(anchor.attr('href'));
        this.changeHash(modHref);

        anchor.focus();
      },

      buildPopupMenu: function(startingHref) {
        var self = this;
        if (self.popupmenu) {
          self.popupmenu.destroy();
          $('#tab-container-popupmenu').off('focus.popupmenu').remove();
          $(document).off('keydown.popupmenu');
        }

        // Build the new markup for the popupmenu if it doesn't exist.
        // Reset it if it does exist.
        var menuHtml = $('#tab-container-popupmenu');
        if (menuHtml.length === 0) {
          menuHtml = $('<ul class="tab-list-spillover">').attr('id', 'tab-container-popupmenu').appendTo('body');
        } else {
          menuHtml.html('');
        }

        // Build menu options from overflowed tabs
        var tabs = self.tablist.children('li'),
          isRTL = Locale.isRTL();

        function buildMenuItem(item) {
          var $item = $(item),
            $itemA = $item.children('a');

          if (!self.isTabOverflowed($item) || $item.is(':hidden')) {
            return;
          }

          if ($item.is('.separator')) {
            $item.clone().appendTo(menuHtml);
            return;
          }

          var popupLi = $item.clone(),
            popupA = popupLi.children('a');

          popupLi[0].classList.remove('tab', 'is-selected');
          popupLi[0].removeAttribute('style');

          popupLi.children('.icon').off().appendTo(popupA);
          popupLi.appendTo(menuHtml);

          // Link tab to its corresponding "More Tabs" menu option
          $item.data('moremenu-link', popupA);

          // Link "More Tabs" menu option to its corresponding Tab.
          // Remove onclick methods from the popup <li> because they are called
          // on the "select" event in context of the original button
          popupA.data('original-tab', $itemA);
          popupA.onclick = undefined;

          if (!$item.is('.has-popupmenu')) {
            return;
          }

          // If this is a Dropdown Tab, clone its menu and add it to the "More Tabs" menu
          // As a submenu of the "popupLi".
          var submenu = $('#' + item.getAttribute('aria-controls')),
            clone = submenu.clone(),
            cloneLis = clone.children('li');

          clone[0].classList.remove('has-popupmenu');

          cloneLis.each(function(i) {
            var li = $(this),
              a = li.children('a'),
              originalLi = submenu.children('li').eq(i),
              originalA = originalLi.children('a');

            a.data('original-tab', originalA);
            originalA.data('moremenu-link', a);
          });

          clone.insertAfter(popupA);
        }

        // Build spillover menu options
        for (var i = 0; i < tabs.length; i++) {
          buildMenuItem(tabs[i]);
        }

        self.tablist.children('li:not(.separator)').removeClass('is-focused');

        // Invoke the popup menu on the button.
        self.moreButton.popupmenu({
          autoFocus: false,
          attachToBody: true,
          menu: 'tab-container-popupmenu',
          trigger: 'immediate',
          offset: {x: 3}
        });
        self.moreButton.addClass('popup-is-open');
        self.popupmenu = self.moreButton.data('popupmenu');

        if (self.hasSquareFocusState()) {
          self.positionFocusState(self.moreButton);
        }

        function closeMenu() {
          $(this).off('close.tabs selected.tabs');
          self.moreButton.removeClass('popup-is-open');
          self.positionFocusState(undefined);
          self.focusBar();
        }

        function selectMenuOption(e, anchor) {
          var href = anchor.attr('href'),
            id = href.substr(1, href.length),
            tab = self.doGetTab(id) || $(),
            a = tab ? tab.children('a') : $(),
            originalTab = anchor.data('original-tab').parent();

          if (originalTab.is('.add-tab-button')) {
            a = self.handleAddButton();
            originalTab = a.parent();
            href = a.attr('href');
            self.element.trigger('tab-added', [a]);
          }

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
          self.hideFocusState();
          $('#tab-container-popupmenu').remove();
        }

        function handleDismissibleIconClick(e) {
          var icon = $(this),
            li = icon.closest('li');

          if (!li.is('.dismissible') || !icon.is('.close')) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          self.closeDismissibleTab(li.children('a').attr('href'));
          self.popupmenu.close();
        }

        menu
          .on('destroy.popupmenu', handleDestroy)
          .on('touchend.popupmenu touchcancel.popupmenu', '.icon', handleDismissibleIconClick)
          .on('click.popupmenu', '.icon', handleDismissibleIconClick);

        // If the optional startingIndex is provided, focus the popupmenu on the matching item.
        // Otherwise, focus the first item in the list.
        if (startingHref) {
          self.popupmenu.highlight(menu.find('a[href="' + startingHref + '"]'));
        } else if (self.tablist.children('.is-selected').length > 0) {
          self.popupmenu.highlight(menu.find('a[href="' + self.tablist.children('.is-selected').children('a').attr('href') + '"]'));
        } else {
          self.popupmenu.highlight(menu.find('li:first-child > a'));
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

              if (self.settings.addTabButton) {
                self.addTabButton.focus();
                return;
              }
              self.findFirstVisibleTab();
            }
          }

          // Alt+Del or Alt+Backspace closes a dropdown tab item
          function closeDropdownMenuItem(e) {
            if (!e.altKey || !currentMenuItem.parent().is('.dismissible')) {
              return;
            }
            //self.popupmenu.close();
            self.closeDismissibleTab(currentMenuItem.attr('href'));
            return;
          }

          var pseudoKeycode;

          switch(key) {
            case 8:
            case 46:
              closeDropdownMenuItem(e);
              break;
            case 37: // left
              pseudoKeycode = isRTL ? 40 : 38;
              if (currentMenuItem.is('a')) {
                if (currentMenuItem.parent().is(':not(:first-child)')) {
                  e.preventDefault(); // Prevent popupmenu from closing on left key
                }
                $(document).trigger({type: 'keydown.popupmenu', which: pseudoKeycode});
              }
              break;
            case 38: // up
              prevMenuItem();
              break;
            case 39: // right
              pseudoKeycode = isRTL ? 38 : 40;
              if (currentMenuItem.is('a') && !currentMenuItem.parent('.submenu').length) {
                $(document).trigger({type: 'keydown.popupmenu', which: pseudoKeycode});
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
        if (this.isVerticalTabs()) {
          return false;
        }
        if (this.tablist.scrollTop() > 0) {
          this.tablist.scrollTop(0);
        }

        return li[0].getBoundingClientRect().top > this.tablist[0].getBoundingClientRect().top;
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
        if (!this.hasAnimatedBar()) {
          return;
        }

        if (!(li instanceof $) || !li.length) {
          return;
        }

        var self = this,
          target = li,
          paddingLeft, paddingRight, width,
          anchorStyle, targetStyle;

        this.animatedBar.removeClass('no-transition');

        if (!target || target === undefined || !target.length || !self.anchors.length) {
          this.animatedBar.removeClass('visible');
          return;
        }

        targetStyle = window.getComputedStyle(target[0], null);
        paddingLeft = parseInt(targetStyle.getPropertyValue('padding-left'), 10) || 0;
        paddingRight = parseInt(targetStyle.getPropertyValue('padding-right'), 10) || 0;
        width = parseInt(targetStyle.getPropertyValue('width')) || 0;

        if (target.is('.tab')) {
          anchorStyle = window.getComputedStyle(target.children('a')[0]);
          paddingLeft += parseInt(anchorStyle.getPropertyValue('padding-left'), 10) || 0;
          paddingRight += parseInt(anchorStyle.getPropertyValue('padding-right'), 10) || 0;
        }

        var left = Locale.isRTL() ?
          (paddingRight + target.position().left) : (target.position().left);

        clearTimeout(self.animationTimeout);
        this.animatedBar.addClass('visible');

        function animationTimeout(cb) {
          var style = self.animatedBar[0].style;
          style.left = left + 'px';
          style.width = width + 'px';

          if (cb && typeof cb === 'function') {
            cb();
          }
        }
        this.animationTimeout = setTimeout(animationTimeout.apply(this, [callback]), 0);
      },

      defocusBar: function() {
        if (!this.hasAnimatedBar()) {
          return;
        }

        var self = this,
          left = Locale.isRTL() ? 0 : (self.animatedBar.position().left+(self.animatedBar.outerWidth()/2));

        clearTimeout(self.animationTimeout);

        this.animatedBar[0].style.left = left + 'px';
        this.animatedBar[0].style.width = 0;

        this.animationTimeout = setTimeout(function() {
          if (self.animatedBar && self.animatedBar.length) {
            self.animatedBar.removeClass('visible').removeAttr('style');
          }
        }, 350);
      },

      hideFocusState: function() {
        if (this.hasSquareFocusState()) {
          this.focusState.removeClass('is-visible');
        }
      },

      positionFocusState: function(target, unhide) {
        if (!this.hasSquareFocusState()) {
          return;
        }

        var self = this;
        target = target !== undefined ? $(target) :
            self.moreButton.hasClass('is-selected') ? self.moreButton :
            self.tablist.children('.is-selected').length > 0 ? self.tablist.children('.is-selected').children('a') : undefined;

        if (!target || target === undefined || !target.length) {
          this.focusState.removeClass('is-visible');
          return;
        }

        // Use the parent <li> for anchors to get their dimensions.
        if (target.is('a')) {
          target = target.parent();
        }

        var focusStateElem = this.focusState[0],
          targetPos = target[0].getBoundingClientRect(),
          targetClassList = target[0].classList,
          isModuleTabs = this.isModuleTabs(),
          isRTL = Locale.isRTL(),
          parentContainer = this.element;

        function convertClientRectToObj(clientRect) {
          return {
            left: clientRect.left,
            right: clientRect.right,
            top: clientRect.top,
            bottom: clientRect.bottom,
            width: clientRect.width,
            height: clientRect.height
          };
        }

        function adjustForParentContainer(targetRectObj, parentElement) {
          var parentRect = parentElement[0].getBoundingClientRect();
          targetRectObj.top = targetRectObj.top - parentRect.top;

          if (isRTL) {
            targetRectObj.right = parentRect.right - targetRectObj.right;
          } else {
            targetRectObj.left = targetRectObj.left - parentRect.left;
          }

          // Dirty Hack for Module Tabs
          // TODO: Explore why this happens
          if (isModuleTabs) {
            targetRectObj.top = targetRectObj.top - 1;
          }

          return targetRectObj;
        }

        // convert ClientRects to objects so we can mess with them
        var targetPosObj = convertClientRectToObj(targetPos);

        // Adjust the values one more time if we have tabs contained inside of a page-container, or some other scrollable container.
        targetPosObj = adjustForParentContainer(targetPosObj, parentContainer);

        // build CSS string containing each prop and set it:
        var targetPosString = '';
        for (var property in targetPosObj) {
          if (targetPosObj.hasOwnProperty(property)) {
            if (targetPosString.length) {
              targetPosString += ' ';
            }
            targetPosString += '' + property + ': ' + targetPosObj[property] + 'px;';
          }
        }
        focusStateElem.setAttribute('style', targetPosString);

        var selected = targetClassList.contains('is-selected') ? 'add' : 'remove';
        focusStateElem.classList[selected]('is-selected');

        var doHide = unhide === true ? 'add' : 'remove';
        focusStateElem.classList[doHide]('is-visible');
      },

      checkFocusedElements: function() {
        var self = this,
          focusableItems = self.tablist;

        if (this.hasSquareFocusState() && focusableItems.find('.is-focused').length === 0 && !self.moreButton.hasClass('is-focused') && !self.moreButton.hasClass('popup-is-open')) {
          self.focusState.removeClass('is-visible');
        }

        if (this.hasAnimatedBar() && focusableItems.find('.is-selected').length === 0 && !self.moreButton.hasClass('is-selected')) {
          self.defocusBar();
        }
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Disables all tabs in the
      disableOtherTabs: function() {
        return this.disable(true);
      },

      disable: function(isPartial) {
        if (!isPartial) {
          this.element.prop('disabled', true).addClass('is-disabled');
        }

        if (!this.disabledElems) {
          this.disabledElems = [];
        }

        var self = this,
          tabs = this.tablist.children('li:not(.separator)');
          if (isPartial) {
            tabs = tabs.filter(':not(.application-menu-trigger)');
          }


        tabs.each(function() {
          var li = $(this);
          var a = li.children('a');

          if (isPartial && self.isActive(a.attr('href'))) {
            return;
          }

          if (li.is('.is-disabled') || a.prop('disabled') === true) {
            self.disabledElems.push({
              elem: li,
              originalTabindex: li.attr('tabindex'),
              originalDisabled: a.prop('disabled')
            });
          }

          li.addClass('is-disabled');
          a.prop('disabled', true);

          if (li.is('.application-menu-trigger') || li.is('.add-tab-button')) {
            return;
          }

          var panel = $(a.attr('href'));
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

        this.moreButton.addClass('is-disabled');

        if (this.isModuleTabs() && !isPartial) {
          this.element.children('.toolbar').disable();
        }

        this.updateAria($());
      },

      enable: function() {
        this.element.prop('disabled', false).removeClass('is-disabled');

        var self = this,
          tabs = this.tablist.children('li:not(.separator)');

        tabs.each(function() {
          var li = $(this);
          var a = li.children('a');

          li.removeClass('is-disabled');
          a.prop('disabled', false);

          if (li.is('.application-menu-trigger') || li.is('.add-tab-button')) {
            return;
          }

          var panel = $(a.attr('href'));
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

        this.moreButton.removeClass('is-disabled');

        if (this.isModuleTabs()) {
          this.element.children('.toolbar').enable();
        }

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

        this.element.off('focusout.tabs updated.tabs activated.tabs');
        $('body').off('resize.tabs' + this.tabsIndex);
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

        if (this.addTabButton && this.addTabButton.length) {
          this.addTabButton.off().remove();
          this.addTabButton = undefined;
        }

        this.moreButton.off().remove();
        this.moreButton = undefined;

        if (this.hasSquareFocusState()) {
          this.focusState.remove();
          this.focusState = undefined;
        }

        if (this.hasAnimatedBar()) {
          this.animatedBar.remove();
          this.animatedBar = undefined;
        }

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

  // Deprecated the old Vertical Tabs code in favor of using the Tabs class.
  $.fn.verticaltabs = $.fn.tabs;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
