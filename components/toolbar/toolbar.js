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


  $.fn.toolbar = function(options) {
    'use strict';

    var pluginName = 'toolbar',
        defaults = {
          rightAligned: false,
          maxVisibleButtons: 3,
          resizeContainers: true,
          favorButtonset: true
        },
        settings = $.extend({}, defaults, options);

    /**
     * The Toolbar Component manages various levels of application navigation.  It contains a group of buttons that functionally
     * related content. Each panel consists of two levels: the top level identifies the
     * category or section header, and the second level provides the associated options.
     *
     * @class Toolbar
     *
     * @param {boolean} rightAligned   &nbsp;-&nbsp; Will always attempt to right-align the contents of the toolbar.
     * @param {Number} maxVisibleButtons   &nbsp;-&nbsp; Total amount of buttons that can be present, not including the More button.
     * @param {boolean} resizeContainers   &nbsp;-&nbsp; If true, uses Javascript to size the Title and Buttonset elements in a way that shows as much of the Title area as possible.
     * @param {boolean} favorButtonset   &nbsp;-&nbsp; If "resizeContainers" is true, setting this to true will try to display as many buttons as possible while resizing the toolbar.  Setting to false attempts to show the entire title instead.
     */
    function Toolbar(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Toolbar.prototype = {

      /**
       * Initializes the Toolbar Component
       * @private
       * @chainable
       * @returns {this}
       */
      init: function() {
        return this
          .setup()
          .build()
          .handleEvents();
      },

      /**
       * Detects discrepencies in settings.  In general, configures the component based on user settings.
       * @private
       * @chainable
       * @returns {this}
       */
      setup: function() {
        // Can't have zero buttons
        if (this.settings.maxVisibleButtons <= 0) {
          this.settings.maxVisibleButtons = defaults.maxVisibleButtons;
        }

        return this;
      },

      /**
       * Adds additional markup, wraps some internal elements, and helps construct a complete Toolbar representation in the HTML Markup.  This method also builds the "More Actions" menu and ties its elements to the toolbar items.
       * @private
       * @chainable
       * @returns {this}
       */
      build: function() {
        var self = this;

        this.element.attr('role', 'toolbar');
        if (this.settings.resizeContainers && this.element.is(':not(:hidden)')) {
          this.element[0].classList.add('do-resize');
        }

        this.buildAriaLabel();

        // keep track of how many popupmenus there are with an ID.
        // Used for managing events that are bound to $(document)
        if (!this.id) {
          this.id = (parseInt($('.toolbar, .formatter-toolbar').index(this.element), 10));
        }

        // Check for a "title" element.  This element is optional.
        // If a title element exists, a tooltip will be created for when it's not
        // possible to show the entire title text on screen.
        this.title = this.element.children('.title');
        if (this.title.length) {
          this.element[0].classList.add('has-title');

          this.cutoffTitle = false;
          this.title.on('beforeshow.toolbar', function() {
            return self.cutoffTitle;
          }).tooltip({
            content: '' + this.title.text().trim()
          });
        } else {
          this.element[0].classList.remove('has-title');
        }

        // Container for main group of buttons and input fields.  Only these spill into the More menu.
        this.buttonset = this.element.children('.buttonset');
        if (!this.buttonset.length) {
          this.buttonset = $('<div class="buttonset"></div>');
          if (this.title.length) {
            this.buttonset.insertAfter(this.title);
          } else {
            this.buttonset.prependTo(this.element);
          }
        }

        this.buttonset[this.settings.rightAligned ? 'addClass' : 'removeClass']('right-aligned');

        // Add and invoke More Button, if it doesn't exist
        this.more = this.element.find('.btn-actions');
        if (this.more.length === 0 && !this.element.hasClass('no-actions-button')) {
          var moreContainer = this.element.find('.more');

          if (!moreContainer.length) {
            moreContainer = $('<div class="more"></div>').appendTo(this.element);
          }

          this.more = $('<button class="btn-actions" type="button"></button>')
            .html($.createIcon({icon: 'more'}) +
              '<span class="audible">'+Locale.translate('MoreActions')+'</span>')
            .appendTo(moreContainer);
        }

        // Reference all interactive items in the toolbar
        this.buttonsetItems = this.buttonset.children('button')
          .add(this.buttonset.find('input')); // Searchfield Wrappers

        // Items contains all actionable items in the toolbar, including the ones in the title, and the more button
        this.items = this.buttonsetItems
          .add(this.title.children('button'))
          .add(this.more);

        // Invoke buttons
        var buttons = this.items.filter('button, input[type="button"], [class^="btn"]');
        buttons.each(function() {
          var buttonControl = $(this).data('button');
          if (!buttonControl) {
            $(this).button();
          }
        });

        // Invoke searchfields
        var searchfields = this.items.filter('.searchfield, .toolbar-searchfield-wrapper, .searchfield-wrapper');
        searchfields.each(function(i, item) {
          var sf = $(item);
          if (sf.is('.toolbar-searchfield-wrapper, .searchfield-wrapper')) {
            sf = sf.children('.searchfield');
          }

          if (!sf.data('searchfield')) {
            var searchfieldOpts = $.extend({}, $.fn.parseOptions(sf[0]));
            sf.toolbarsearchfield(searchfieldOpts);
          }
        });

        // Setup the More Actions Menu.  Add Menu Items for existing buttons/elements in the toolbar, but
        // hide them initially.  They are revealed when overflow checking happens as the menu is opened.
        var popupMenuInstance = this.more.data('popupmenu'),
          moreAriaAttr = this.more.attr('aria-controls');

        if (!popupMenuInstance) {
          this.moreMenu = $('#' + moreAriaAttr);
          if (!this.moreMenu.length) {
            this.moreMenu = this.more.next('.popupmenu');
          }
          if (!this.moreMenu.length) {
            this.moreMenu = $('<ul id="popupmenu-toolbar-'+ this.id +'" class="popupmenu"></ul>').insertAfter(this.more);
          }
        } else {
          this.moreMenu = popupMenuInstance.menu;
        }

        this.defaultMenuItems = this.moreMenu.children('li:not(.separator)').length > 0;

        function menuItemFilter() {
          //jshint validthis:true
          return $(this).parent('.buttonset, .inline').length;
        }

        var menuItems = [];
        this.items.not(this.more).filter(menuItemFilter).each(function() {
          menuItems.push(self.buildMoreActionsMenuItem($(this)));
        });

        menuItems.reverse();
        $.each(menuItems, function(i, item) {
          if (item.text() !== '') {
            item.prependTo(self.moreMenu);
          }
        });

        // Setup an Event Listener that will refresh the contents of the More Actions
        // Menu's items each time the menu is opened.
        if (popupMenuInstance) {
          this.more
            .on('beforeopen.toolbar', function() {
              self.refreshMoreActionsMenu(self.moreMenu);
            })
            .triggerHandler('updated');
        } else {
          var actionButtonOpts = $.fn.parseOptions(this.more[0]);

          this.more.popupmenu($.extend({}, actionButtonOpts, {
            trigger: 'click',
            menu: this.moreMenu
          })).on('beforeopen.toolbar', function() {
            self.refreshMoreActionsMenu(self.moreMenu);
          });
        }

        // Setup the tabindexes of all items in the toolbar and set the starting active button.
        function setActiveToolbarItem() {
          self.items.attr('tabindex', '-1');

          var active = self.items.filter('.is-selected');
          if (active.length) {
            self.activeButton = active.first().attr('tabindex', '0');
            self.items.not(self.activeButton).removeClass('is-selected');
            return;
          }

          // Set active to the first item in the toolbar.
          active = self.items.filter(':visible:not(:disabled)').first().attr('tabindex', '0');
          self.activeButton = active;

          // If the whole toolbar is hidden (contextual toolbars, etc),
          // automatically set the first non-disabled item as visible
          if (self.element.is(':hidden, .is-hidden')) {
            self.activeButton = self.items.filter(':not(:disabled)').first().attr('tabindex', '0');
            return;
          }

          if (self.isItemOverflowed(active)) {
            active.attr('tabindex', '-1');
            self.activeButton = self.more.addClass('is-selected').attr('tabindex', '0');
          }
          return;
        }

        setActiveToolbarItem();

        // Toggles the More Menu based on overflow of toolbar items
        this.adjustMenuItemVisibility();
        this.handleResize();

        this.element.triggerHandler('rendered');
        return this;
      },

      /**
       * Builds a single "More Actions Menu" item from a source toolbar item.
       * Also sets up linkage between the menu item and the original toolbar item to allow events/properties
       * to propagate when the More Actions item is acted upon.
       * @param {jQuery[]} item - the source item from the toolbar.
       * @returns {jQuery[]} - a jQuery-wrapped <li> representing a More Actions menu implementation of the toolbar item.
       */
      buildMoreActionsMenuItem: function(item) {
        var isSplitButton = false;

        // If this item should be skipped, just return out
        if (item.data('skipit') === true) {
          item.data('skipit', undefined);
          return;
        }

        // Attempt to re-use an existing <li>, if possible.
        // If a new one is created, setup the linkage between the original element and its
        // "More Actions" menu counterpart.
        var a = item.data('action-button-link'),
          popupLi;

        if (!a || !a.length) {
          popupLi = $('<li></li>');
          a = $('<a href="#"></a>').appendTo(popupLi);

          // Setup data links between the buttons and their corresponding list items
          item.data('action-button-link', a);
          a.data('original-button', item);
        } else {
          popupLi = a.parent();
        }

        // Refresh states
        if (item.hasClass('hidden')) {
          popupLi.addClass('hidden');
        }
        if (item.is(':disabled')) {
          popupLi.addClass('is-disabled');
        } else {
          popupLi.removeClass('is-disabled');
        }

        // Refresh Text
        a.text(this.getItemText(item));

        // Pass along any icons except for the dropdown (which is added as part of the submenu design)
        var submenuDesignIcon = $.getBaseURL('#icon-dropdown');
        var icon = item.children('.icon').filter(function() {
          var iconName = $(this).getIconName();
          return iconName && iconName !== submenuDesignIcon && iconName.indexOf('dropdown') === -1;
        });

        if (icon && icon.length) {
          a.html('<span>' + a.text() + '</span>');
          icon.clone().detach().prependTo(a);
        }

        var linkspan = popupLi.find('b');
        if (linkspan.length) {
          this.moreMenu.addClass('has-icons');
          linkspan.detach().prependTo(popupLi);
        }

        function addItemLinksRecursively(menu, diffMenu, parentItem) {
          var children = menu.children('li'),
            id = diffMenu.attr('id');

          diffMenu.children('li').each(function(i, diffMenuItem) {
            var dmi = $(diffMenuItem), // "Diffed" Menu Item
              omi = children.eq(i), // Corresponding "Original" menu item
              dmiA = dmi.children('a'), // Anchor inside of "Diffed" menu item
              omiA = omi.children('a'), // Anchor inside of "Original" menu item
              dmiID = dmi.attr('id'),
              dmiAID = dmiA.attr('id');

            // replace menu item ids with spillover-menu specific ids.
            if (dmiID) {
              dmi.removeAttr('id').attr('data-original-menu-item', dmiID);
            }
            if (dmiAID) {
              dmiA.removeAttr('id').attr('data-original-menu-anchor', dmiAID);
            }

            omiA.data('action-button-link', dmiA);
            dmiA.data('original-button', omiA);

            var omiSubMenu = omi.children('.wrapper').children('.popupmenu'),
              dmiSubMenu = dmi.children('.wrapper').children('.popupmenu');

            if (omiSubMenu.length && dmiSubMenu.length) {
              addItemLinksRecursively(omiSubMenu, dmiSubMenu, dmi);
            }

            if (isSplitButton) {
              dmi.removeClass('is-checked');
            }
          });

          diffMenu.removeAttr('id').attr('data-original-menu', id);
          parentItem.addClass('submenu');

          var appendTarget;
          if (parentItem.is(popupLi)) {
            appendTarget = parentItem.children('.wrapper');
            if (!appendTarget || !appendTarget.length) {
              appendTarget = $('<div class="wrapper"></div>');
            }
            appendTarget.html(diffMenu);
            parentItem.append(appendTarget);
          }
        }

        if (item.is('.btn-menu')) {
          if (!item.data('popupmenu')) {
            item.popupmenu();
          } else {
            if (!a.children('.icon.arrow').length) {
              a.append($.createIcon({
                classes: 'icon arrow icon-dropdown',
                icon: 'dropdown'
              }));
            }
          }

          var menu = item.data('popupmenu').menu,
            diffMenu = menu.clone();

          addItemLinksRecursively(menu, diffMenu, popupLi);
        }

        if (item.is('[data-popdown]')) {
          item.popdown();
        }

        return popupLi;
      },

      /**
       * Refreshes the More Actions Menu items' text content, icons, states, and submenu content
       * based on changes made directly to their counterpart elements in the Toolbar.  Can also
       * optionally refresh only part of the menu.
       * @param {jQuery[]} menu - the menu/submenu to be refreshed.
       */
      refreshMoreActionsMenu: function(menu) {
        var self = this;

        $('li > a', menu).each(function () {
          var a = $(this),
              li = a.parent(),
              item = a.data('originalButton'),
              itemParent,
              text = self.getItemText(item),
              submenu;

          if (item) {
            if (a.find('span').length) {
              a.find('span').text(text.trim());
            } else {
              a.text(text.trim());
            }

            if (item.is('.hidden') || item.parent().is('.hidden')) {
              li.addClass('hidden');
            } else {
              li.removeClass('hidden');
            }

            if (item.parent().is('.is-disabled') || item.is(':disabled')) { // if it's disabled menu item, OR a disabled menu-button
              li.addClass('is-disabled');
              a.attr('tabindex', '-1');
            } else {
              li.removeClass('is-disabled');
              a.removeAttr('disabled');
            }

            if (item.is('a')) {
              itemParent = item.parent('li');

              if (itemParent.is('.is-checked')) {
                li.addClass('is-checked');
              } else {
                li.removeClass('is-checked');
              }
            }

            if (item.is('.btn-menu')) {
              submenu = a.parent().find('.popupmenu').first();
              self.refreshMoreActionsMenu(submenu);
            }
          }
        });
      },

      /**
       * Gets the complete text contnts of a Toolbar Item, in order to create its corresponding "more actions" menu item.
       *
       * Order of operations for populating the List Item text:
       * 1. span contents (.audible), then
       * 2. button title attribute, then
       * 3. tooltip text (if applicable)
       * @param {jQuery[]} item - the item being evaluated.
       * @returns {string} - the complete text representation.
       */
      getItemText: function (item) {
        if (!item) {
          return;
        }
        var span = item.find('.audible'),
          title = item.attr('title'),
          tooltip = item.data('tooltip'),
          tooltipText = tooltip && typeof tooltip.content === 'string' ? tooltip.content : undefined;

        var popupLiText = span.length ? span.text() :
          title !== '' && title !== undefined ? item.attr('title') :
          tooltipText ? tooltipText : item.text();

        return popupLiText;
      },

      /**
       * Sets up all necessary event handling on a Toolbar component
       * @private
       * @chainable
       * @returns {this}
       */
      handleEvents: function() {
        var self = this;

        this.items
          .off('keydown.toolbar').on('keydown.toolbar', function(e) {
            self.handleKeys(e);
          }).off('click.toolbar').on('click.toolbar', function(e) {
            self.handleClick(e);
          });

        this.items.filter('.btn-menu, .btn-actions')
          .off('close.toolbar').on('close.toolbar', function onClosePopup() {
            var el = $(this),
              last;

            if (el.is('.is-overflowed')) {
              last = self.getLastVisibleButton();
              if (last && last.length) {
                last[0].focus();
              }
              return;
            }

            el.focus();
            self.buttonset.scrollTop(0);
          });

        this.items.not(this.more).off('selected.toolbar').on('selected.toolbar', function(e, anchor) {
          e.stopPropagation();
          self.handleSelected(e, anchor);
        });

        this.more.on('keydown.toolbar', function(e) {
          self.handleKeys(e);
        }).on('beforeopen.toolbar', function() {
          self.adjustMenuItemVisibility();
        }).on('selected.toolbar', function(e, anchor) {
          e.stopPropagation();
          self.handleSelected(e, anchor);
        });

        // Handle possible AJAX calls on Toolbar Menu buttons
        // TODO: Need to handle mouseenter/touchstart/keydown events that will cause this to trigger,
        // instead of directly handling this itself.
        this.more
          .off('show-submenu.toolbar')
          .on('show-submenu.toolbar', function(e, li) {
          self.handleTransferToMenuButtonItem(e, li);
        });

        this.element.off('updated.toolbar').on('updated.toolbar', function(e) {
          e.stopPropagation();
          self.updated();
        }).off('recalculate-buttons.toolbar').on('recalculate-buttons.toolbar', function(e, containerDims) {
          self.handleResize(containerDims);
        }).off('scrollup.toolbar').on('scrollup.toolbar', function() {
          var moduleTabsParent = self.element.parents('.tab-container.module-tabs');
          if (moduleTabsParent.length) {
            moduleTabsParent.scrollTop(0);
          }
        });

        $('body').off('resize.toolbar-' + this.id).on('resize.toolbar-' + this.id, function() {
          self.handleResize();
        });

        // Trigger _handleResize()_ once to fix container sizes.
        this.handleResize();

        return this;
      },

      /**
       * Event Handler for the Soho Popupmenu's custom 'show-submenu' event, specifically for
       * the case of a menu button that's been spilled over into this Toolbar's More Actions menu.
       * @param {jQuery.Event} e
       * @param {jQuery[]} li - the `li.submenu` element.
       */
      handleTransferToMenuButtonItem: function(e, li) {
        var originalMenuButton = li.children('a').data('original-button');
        if (!originalMenuButton) {
          return;
        }

        var popupAPI = originalMenuButton.data('popupmenu');
        if (!popupAPI || typeof popupAPI.settings.beforeOpen !== 'function') {
          return;
        }

        // Call out to the MenuButton's AJAX source, get its contents, and populate
        // the corresponding More Actions menu sub-item.
        popupAPI.callSource(e);
        this.buildMoreActionsMenuItem(originalMenuButton);
      },

      /**
       * Event handler for the Soho `selected` event on toolbar items
       * @private
       * @listens {jQuery.Event} e
       * @param {jQuery.Event} e
       * @returns {undefined}
       */
      handleSelected: function(e, anchor) {
        var itemLink = anchor.data('original-button'),
          li = anchor.parent(),
          itemEvts,
          toolbarEvts,
          popup, popupTrigger;

        // Don't continue if hidden/readonly/disabled
        if (li.is('.hidden, .is-disabled') || anchor.is('[readonly], [disabled]')) {
          e.preventDefault();
          return;
        }

        if (itemLink && itemLink.length > 0) {
          itemEvts = itemLink.listEvents();
          toolbarEvts = this.element.listEvents();

          // Make sure the active button is set properly
          this.setActiveButton(itemLink);

          // Fire Angular Events
          if (itemLink.attr('ng-click') || itemLink.attr('data-ng-click')) {
            itemLink.trigger('click');
            return;
          }

          // Check the Toolbar Button for the existence of certain event types.
          // Checks the button, and checks the toolbar container element for delegated events.
          var evtTypes = ['click', 'touchend', 'touchcancel'];
          for (var i = 0; i < evtTypes.length; i++) {
            var type = evtTypes[i];

            // Check toolbar element for delegated-down events first
            if (toolbarEvts && toolbarEvts[type] && toolbarEvts[type].delegateCount > 0) {
              var el = this.element,
                evt = $.Event(type);

              evt.target = el.find(itemLink)[0];
              el.trigger(evt);
              return;
            }

            // Check for events directly on the element
            if ((itemEvts && itemEvts[type]) || itemLink[0]['on' + type]) {
              itemLink.trigger(type);
              return;
            }
          }

          // If the linked element is a child of a menu button, trigger its 'selected' event.
          popup = itemLink.parents('.popupmenu');
          popupTrigger = popup.data('trigger');
          if (popup.length && popupTrigger instanceof $ && popupTrigger.length) {
            popupTrigger.triggerHandler('selected', [itemLink]);
            return;
          }

          // Manually Trigger Select on the linked item, since it won't be done by another event
          this.triggerSelect(itemLink);
          return;
        }

        // If no item link exists, it's a pre-defined menu item.
        // Trigger 'selected' manually on the toolbar element.
        // Normally this would happen by virtue of triggering the "click" handlers on a linked button above.
        this.triggerSelect(anchor);
      },

      /**
       * Event handler for clicks on toolbar items
       * @private
       * @listens {jQuery.Event} e
       * @param {jQuery.Event} e
       * @returns {false}
       */
      handleClick: function(e) {
        this.setActiveButton($(e.currentTarget));
        this.triggerSelect($(e.currentTarget));
        return false;
      },

      /**
       * Event handler for key presses on toolbar items
       * @private
       * @listens {jQuery.Event} e
       * @param {jQuery.Event} e
       * @returns {undefined}
       */
      handleKeys: function(e) {
        var self = this,
          key = e.which,
          target = $(e.target),
          isActionButton = target.is('.btn-actions'),
          isRTL = Locale.isRTL();

        if ((key === 37 && target.is(':not(input)')) ||
          (key === 37 && target.is('input') && e.shiftKey) || // Shift + Left Arrow should be able to navigate away from Searchfields
          (key === 38 && target.is(':not(input.is-open)'))) { // Don't navigate away if Up Arrow in autocomplete field that is open
          e.preventDefault();

          if (isActionButton) {
            self.setActiveButton( isRTL ? self.getFirstVisibleButton() : self.getLastVisibleButton() );
          } else {
            self.navigate( isRTL ? 1 : -1 );
          }
        }

        if ((key === 39 && target.is(':not(input)')) ||
          (key === 39 && target.is('input') && e.shiftKey) || // Shift + Right Arrow should be able to navigate away from Searchfields
          (key === 40 && target.is(':not(input.is-open)'))) { // Don't navigate away if Down Arrow in autocomplete field that is open
          e.preventDefault();

          if (isActionButton) {
            self.setActiveButton( isRTL ? self.getLastVisibleButton() : self.getFirstVisibleButton() );
          } else {
            self.navigate( isRTL ? -1 : 1 );
          }
        }

        return;
      },

      /**
       * Re-renders the toolbar element and adjusts all internal parts to account for the new size.
       * @param {Object} [containerDims] - an object containing dimensions that can be set on the Toolbar's title and buttonset elements.
       * @param {number} [containerDims.title] - represents the width that will be applied to the title element
       * @param {number} [containerDims.buttonset] - represents the width that will be applied to the buttonset element
       * @returns {undefined}
       */
      handleResize: function(containerDims) {
        if (this.settings.resizeContainers) {
          var title = containerDims ? containerDims.title : undefined,
            buttonset = containerDims ? containerDims.buttonset : undefined;

          this.sizeContainers(title, buttonset);
        }

        var buttons = this._getButtonsetButtons();
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].removeClass('is-overflowed');
        }

        if (this.element.is(':not(:hidden)')) {
          this.adjustMenuItemVisibility();
          this.toggleMoreMenu(); // Added 9/16/2015 due to issue HFC-2876
        }
      },

      /**
       * Resizes the Toolbar's internal container areas (title, buttonset) to make efficient use of their space.
       * @private
       * @chainable
       * @param {number} titleSize - desired size of the title element.
       * @param {number} buttonsetSize - desired size of the buttonset element.
       * @returns {this}
       */
      sizeContainers: function(titleSize, buttonsetSize) {
        var containerElem = this.element[0],
          titleElem = this.title[0],
          buttonsetElem = this.buttonset[0],
          moreElem = this.more[0];

        // Don't do this at all unless we have a title element (which is optional)
        if (!this.title || !this.title.length) {
          return;
        }

        // If the element's hidden and has defined sizes, remove them so we can use the defaults.
        if (this.element.is(':hidden')) {
          buttonsetElem.style.width = '';
          titleElem.style.width = '';
          containerElem.classList.remove('do-resize');
          return;
        }

        var WHITE_SPACE = 30,
          MIN_TITLE_SIZE = 44 + WHITE_SPACE,
          MIN_BUTTONSET_SIZE = 0;

        buttonsetElem.style.width = '';
        titleElem.style.width = '';

        if (!containerElem.classList.contains('do-resize')) {
          containerElem.classList.add('do-resize');
        }

        var toolbarDims = $(containerElem).getHiddenSize(),
          buttonsetDims = $(buttonsetElem).getHiddenSize(),
          titleDims = $(titleElem).getHiddenSize(),
          moreDims = $(moreElem).getHiddenSize(),
          toolbarPadding = parseInt(toolbarDims.padding.left) + parseInt(toolbarDims.padding.right);

        if (isNaN(moreDims.width)) {
          moreDims.width = 50;
        }

        if (isNaN(buttonsetDims.width) || buttonsetDims.width < MIN_BUTTONSET_SIZE) {
          buttonsetDims.width = MIN_BUTTONSET_SIZE;
        }

        function addPx(val) {
          return val + 'px';
        }

        // Get the target size of the title element
        var targetTitleWidth, targetButtonsetWidth, d;
        this.cutoffTitle = false;

        // Setter functionality
        if (titleSize && buttonsetSize && !isNaN(titleSize) && !isNaN(buttonsetSize)) {
          targetTitleWidth = parseInt(titleSize);
          targetButtonsetWidth = parseInt(buttonsetSize);
        } else {
          if ((buttonsetDims.scrollWidth + titleDims.scrollWidth + moreDims.width + toolbarPadding) > toolbarDims.width) {
            if (this.settings.favorButtonset) {
              targetButtonsetWidth = buttonsetDims.width;
              targetTitleWidth = toolbarDims.width - (toolbarPadding + buttonsetDims.width + moreDims.width);
            } else {
              targetTitleWidth = titleDims.scrollWidth;
              targetButtonsetWidth = toolbarDims.width - (toolbarPadding + titleDims.scrollWidth + moreDims.width);
            }
          }
        }

        if (this.settings.favorButtonset) {
          // Cut off the buttonset anyway if title is completely hidden.  Something's gotta give!
          if (targetTitleWidth < MIN_TITLE_SIZE) {
            this.cutoffTitle = true;
            d = Math.abs(targetTitleWidth - MIN_TITLE_SIZE);
            targetTitleWidth = MIN_TITLE_SIZE;
            targetButtonsetWidth = targetButtonsetWidth - d;
          }

          buttonsetElem.style.width = addPx(targetButtonsetWidth + 2);
          titleElem.style.width = addPx(targetTitleWidth - 2);

          return this;
        }
        //==========================
        // Favor the title element
        // Cut off the title anyway if buttonset is completely hidden.  Something's gotta give!
        if (targetButtonsetWidth < MIN_BUTTONSET_SIZE) {
          this.cutoffTitle = true;
          d = Math.abs(targetButtonsetWidth - MIN_BUTTONSET_SIZE);
          targetButtonsetWidth = MIN_BUTTONSET_SIZE;
          targetTitleWidth = targetTitleWidth - d;
        }

        // Always favor the title by one extra px for Chrome
        titleElem.style.width = addPx(targetTitleWidth + 2);
        buttonsetElem.style.width = addPx(targetButtonsetWidth - 2);
        return this;
      },

      /**
       * Changes the "active" button on the toolbar.
       * @param {number} direction - can be `-1` (previous), `1` (next), or `0` (remain on current).
       * @returns {jQuery[]}
       */
      navigate: function (direction) {
        var items = this.items.filter(':visible:not(:disabled)'),
          current = items.index(this.activeButton),
          next = current + direction,
          target;

        if (next >= 0 && next < items.length) {
          target = items.eq(next);
        }

        if (next >= items.length) {
          target = items.first();
        }

        if (next === -1) {
          target = items.last();
        }

        if (this.isItemOverflowed(target)) {
          target = this.more;
        }

        this.setActiveButton(target);
        return false;
      },

      /**
       * Gets a reference to the last visible (not overflowed) button inside of the buttonset.
       * @returns {jQuery[]}
       */
      getLastVisibleButton: function() {
        var items = $(this.items.get().reverse()).not(this.more),
          target;

        var i = 0,
          elem;

        while(!target && i < items.length) {
          elem = $(items[i]);
          if (!this.isItemOverflowed(elem)) {
            target = elem;
            break;
          }
          i++;
        }

        if (!target || target.length === 0) {
          target = items.first();
        }

        while(target.length && target.is('.separator, *:disabled, *:hidden')) {
          target = target.prev();
        }

        return target;
      },

      /**
       * Gets a reference to the first visible (not overflowed) button inside of the buttonset.
       * @returns {jQuery[]}
       */
      getFirstVisibleButton: function() {
        var i = 0,
          items = this.items,
          target = items.eq(i);

        while(target.is('.separator, *:disabled, *:hidden')) {
          i++;
          target = items.eq(i);
        }

        return target;
      },

      /**
       * Sets the currently "active" (focused) Toolbar item
       * @param {jQuery[]} activeButton - the preferred target element to make active.
       * @param {boolean} [noFocus] - if defined, prevents this method from giving focus to the new active button.
       */
      setActiveButton: function(activeButton, noFocus) {
        // Return out of this if we're clicking the currently-active item
        if (activeButton[0] === this.activeButton[0]) {
          return;
        }

        var self = this;

        function getMoreOrLast() {
          if (self.hasNoMoreButton() || !self.element.hasClass('has-more-button')) {
            return self.getLastVisibleButton();
          }

          return self.more;
        }

        function getActiveButton() {
          // Menu items simply set the "More Actions" button as active
          if (activeButton.is('a')) {
            return getMoreOrLast();
          }

          // If it's the more button, hide the tooltip and set it as active
          var tooltip = self.more.data('tooltip');
          if (activeButton[0] === self.more[0]) {
            if (tooltip && tooltip.tooltip.is(':not(.hidden)')) {
              tooltip.hide();
            }
            return getMoreOrLast();
          }

          // Overflowed items also set
          if (self.isItemOverflowed(activeButton)) {
            if (!activeButton.is('.searchfield')) {
              return getMoreOrLast();
            }
          }

          return activeButton;
        }

        this.items.add(this.more).attr('tabindex', '-1').removeClass('is-selected');

        this.activeButton = getActiveButton();
        this.activeButton.addClass('is-selected').attr('tabindex', '0');

        if (!noFocus) {
          this.activeButton[0].focus();
          this.element.triggerHandler('navigate', [this.activeButton]);
        }
      },

      /**
       * Triggers a "selected" event on the base Toolbar element using a common element as an argument.
       * @param {HTMLElement|SVGElement|jQuery[]} element - a jQuery Object containing an anchor tag, button, or input field.
       */
      triggerSelect: function(element) {
        var elem = $(element);
        if (elem.is(this.more) || (elem.is('.btn-menu, li.submenu'))) {
          return;
        }

        this.element.triggerHandler('selected', [elem]);
      },

      /**
       * Assembles and returns a list of all buttons inside the Buttonset element.
       * @returns {Array}
       */
      _getButtonsetButtons: function() {
        var buttons = [],
          items = this.buttonsetItems,
          item;

        for (var i = 0; i < items.length; i++) {
          item = items.eq(i);
          if (item.data('action-button-link') !== undefined && item.is(':not(.searchfield)')) {
            buttons.push(item);
          }
        }

        return buttons;
      },

      /**
       * Gets and Iterates through a list of toolbar items and determines which are currently overflowed, and which are visible.
       * @param {Array} buttons - an Array of jQuery-wrapped elements that represents toolbar items.
       * @returns {VisibilitySortedToolbarItems}
       * @returns {VisibilitySortedToolbarItems.Array} visible - An array containing all visible items.
       * @returns {VisibilitySortedToolbarItems.Array} hidden - An array containing all hidden (overflowed) items.
      */
      getVisibleButtons: function(buttons) {
        var self = this,
          hiddenButtons = [],
          visibleButtons = [],
          i;

        if (!buttons || !Array.isArray(buttons)) {
          buttons = this._getButtonsetButtons();
        }

        for (i = 0; i < buttons.length; i++) {
          buttons[i][0].classList.remove('is-overflowed');
        }

        function getButtonVisibility(i, button) {
          if (!self.isItemOverflowed(button)) {
            visibleButtons.push(button);
          } else {
            hiddenButtons.push(button);
          }
        }

        for (i = 0; i < buttons.length; i++) {
          getButtonVisibility(i, buttons[i]);
        }

        return {
          visible: visibleButtons,
          hidden: hiddenButtons
        };
      },

      /**
       * Gets and Iterates through the full list of Toolbar Items and determines which ones should currently be present in the More Actions menu.
       * @param {Object} items - an object (normally generated by `_.getVisibleButtons()`) containing arrays of currently visible and hidden buttons, along with some meta-data.
       * @returns {undefined}
       */
      adjustMenuItemVisibility: function(items) {
        var iconDisplay = 'removeClass';

        if (!items) {
          items = this.getVisibleButtons();
        }

        function toggleClass($elem, doHide) {
          var elem = $elem[0],
            li = $elem.data('action-button-link').parent()[0],
            elemIsHidden = elem.classList.contains('hidden');

          if (doHide) {
            li.classList.add('hidden');
            elem.classList.remove('is-overflowed');

            /*
            if (elem.classList.contains('btn-split-menu') && elem.classList.contains('btn-menu')) {
              $elem.last().last().removeClass('is-overflowed');
            }
            */
            return;
          }

          if (!elemIsHidden) {
            li.classList.remove('hidden');
          }
          elem.classList.add('is-overflowed');

          /*
          if (elem.classList.contains('btn-split-menu') && elem.classList.contains('btn-menu')) {
            $elem.last().last().addClass('is-overflowed');
          }
          */

          if ($elem.find('.icon').length) {
            iconDisplay = 'addClass';
          }
        }

        var i = 0;
        for (i; i < items.visible.length; i++) {
          toggleClass(items.visible[i], true);
        }
        for (i = 0; i < items.hidden.length; i++) {
          toggleClass(items.hidden[i], false);
        }

        if (this.moreMenu.find('.icon').length) {
          iconDisplay = 'addClass';
        }

        this.moreMenu[iconDisplay]('has-icons');
      },

      /**
       * Detects whether or not a toolbar item is currently overflowed.  In general, toolbar items are considered overflow if their right-most edge sits past the right-most edge of the buttonset border.  There are some edge-cases.
       * @param {jQuery[]} item - the Toolbar item being tested.
       * @returns {boolean}
       */
      isItemOverflowed: function(item) {
        if (this.hasNoMoreButton()) {
          return false;
        }

        if (!item || item.length === 0) {
          return true;
        }

        // In cases where a Title is present and buttons are right-aligned, only show up to the maximum allowed.
        if (this.title.length && this.buttonsetItems.filter(':not(.hidden)').index(item) >= this.settings.maxVisibleButtons) { // Subtract one to account for the More Button
          // ONLY cause this to happen if there are at least two items that can be placed in the overflow menu.
          // This prevents ONE item from being present in the menu by itself
          //if (!this.buttonsetItems.last().is(item)) {
            //return true;
          //}
          return true;
        }

        if (this.buttonset.scrollTop() > 0) {
          this.buttonset.scrollTop(0);
        }

        // unwrap from jQuery
        if (item instanceof $ && item.length) {
          item = item[0];
        }

        var classList = item.classList,
          style = window.getComputedStyle(item);

        if (classList.contains('btn-actions')) {
          return true;
        }
        if (classList.contains('searchfield')) {
          return false;
        }
        if (style.display === 'none') {
          return true;
        }

        var isRTL = Locale.isRTL(),
          itemRect = item.getBoundingClientRect(),
          buttonsetRect = this.buttonset[0].getBoundingClientRect(),
          itemOutsideXEdge = isRTL ? (itemRect.left <= buttonsetRect.left) : (itemRect.right >= buttonsetRect.right),
          itemBelowYEdge = itemRect.bottom >= buttonsetRect.bottom;

        return (itemBelowYEdge === true || itemOutsideXEdge === true);
      },

      /**
       * Detection for this toolbar to have a More Button
       * @returns {boolean}
       */
      hasNoMoreButton: function() {
        return this.element[0].classList.contains('no-more-button');
      },

      /**
       * Determines whether or not the "more actions" button should be displayed.
       * @private
       * @returns {undefined}
       */
      toggleMoreMenu: function() {
        if (this.element.hasClass('no-actions-button')) {
          return;
        }

        var overflowItems = this.moreMenu.children('li:not(.separator)'),
          hiddenOverflowItems = overflowItems.not('.hidden');

        var method = 'removeClass';
        if (this.defaultMenuItems || hiddenOverflowItems.length > 0) {
          method = 'addClass';
        }

        this.element[method]('has-more-button');

        var popupAPI = this.more.data('popupmenu');
        if (method === 'removeClass') {
          if (!popupAPI) {
            return;
          }

          popupAPI.close();

          var menuItems = popupAPI.menu.find('li:not(.separator)').children('a'),
            shouldFocus = false;

          menuItems.add(this.more).each(function() {
            if (document.activeElement === this) {
              shouldFocus = true;
            }
          });

          if (shouldFocus) {
            this.getLastVisibleButton()[0].focus();
          }
        }
      },

      /**
       * Creates an `aria-label` attribute on the toolbar, for bettery accessibility
       * @private
       * @returns {undefined}
       */
      buildAriaLabel: function() {
        // Set up an aria-label as per AOL guidelines
        // http://access.aol.com/dhtml-style-guide-working-group/#toolbar
        if (!this.element.attr('aria-label')) {
          var isHeader = (this.element.closest('.header').length ===1),
            id = this.element.attr('id') || '',
            title = this.element.children('.title'),
            prevLabel = this.element.prev('label'),
            prevSpan = this.element.prev('.label'),
            labelText = isHeader ? $('header.header').find('h1').text() :
            title.length ? title.filter('div').text() :
            prevLabel.length ? prevLabel.text() :
            prevSpan.length ? prevSpan.text() : id + ' ' + Locale.translate('Toolbar');

          this.element.attr('aria-label', labelText.replace(/\s+/g,' ').trim());
        }
      },

      updated: function() {
        this
          .unbind()
          .teardown()
          .init();
      },

      /**
       * Enables the entire Toolbar component
       * @returns {undefined}
       */
      enable: function() {
        this.element.prop('disabled', false);
        this.items.prop('disabled', false);
        this.more.prop('disabled', false);
      },

      /**
       * Disables the entire Toolbar component
       * @returns {undefined}
       */
      disable: function() {
        this.element.prop('disabled', true);
        this.items.prop('disabled', true);
        this.more.prop('disabled', true).data('popupmenu').close();
      },

      /**
       * Removes currently associated event listeners from the Toolbar.
       * @private
       * @chainable
       * @returns {this}
       */
      unbind: function() {
        this.items
          .offTouchClick('toolbar')
          .off('keydown.toolbar click.toolbar focus.toolbar blur.toolbar');

        this.more.off('keydown.toolbar beforeopen.toolbar selected.toolbar');
        $('body').off('resize.toolbar-' + this.id);
        return this;
      },

      /**
       * Returns the Toolbar's internal markup to its original state.
       * @chainable
       * @returns {this}
       */
      teardown: function() {
        var self = this;

        if (this.title && this.title.length) {
          var dataTooltip = this.title.off('beforeshow.toolbar').data('tooltip');
          if (dataTooltip) {
            dataTooltip.destroy();
          }
        }

        this.moreMenu.children('li').each(function() {
          self.teardownMoreActionsMenuItem($(this), true);
        });
        return this;
      },

      /**
       * Tears down a More Actions Menu item.
       * @param {jQuery[]} item - the existing <li> from inside the More Actions menu.
       * @param {boolean} doRemove - if defined, causes the list item to be removed from the more actions menu.
       */
      teardownMoreActionsMenuItem: function(item, doRemove) {
        var self = this,
          li = $(item),
          a = li.children('a'),
          itemLink = a.data('original-button');

        a.off('updated.toolbar mousedown.toolbar click.toolbar touchend.toolbar touchcancel.toolbar recalculate-buttons.toolbar');

        var icons = li.find('.icon');
        if (icons.length) {
          icons.remove();
        }

        var submenuContainer;
        if (li.is('.submenu')) {
          submenuContainer = li.children('.wrapper').children('.popupmenu');
          submenuContainer.children('li').each(function(){
            self.teardownMoreActionsMenuItem($(this), true);
          });
        }

        if (itemLink && itemLink.length) {
          $.removeData(a[0], 'original-button');
          $.removeData(itemLink[0], 'action-button-link');
          a.remove();

          if (submenuContainer) {
            submenuContainer
              .off()
            .parent('.wrapper')
              .off()
              .remove();
          }

          if (doRemove) {
            li.remove();
          }
        }
      },

      /**
       * Destroys this Toolbar Component instance and completely disassociates it from its corresponding DOM Element.
       * @returns {undefined}
       */
      destroy: function() {
        this
          .unbind()
          .teardown();

        if (this.buttonset.children('.searchfield-wrapper').length) {
          var searchFields = this.buttonset.children('.searchfield-wrapper').children('.searchfield');
          if (searchFields.data('toolbarsearchfield')) {
            searchFields.data('toolbarsearchfield').destroy();
          }
        }

        /*
        // Remove split button wrappers
        if (this.splitButtonWrappers.length) {
          $.each(this.splitButtonWrappers, function(wrapper) {
            var els = wrapper.children().detach();
            els.insertAfter(wrapper);
            wrapper.remove();
          });
        }
        */

        if (this.more.length && this.more.data('popupmenu') !== undefined) {
          this.more.data('popupmenu').destroy();
        }

        this.element[0].classList.remove('do-resize');
        this.buttonset[0].style.width = '';
        if (this.title && this.title.length) {
          this.title[0].style.width = '';
        }

        this.element.removeAttr('role').removeAttr('aria-label');
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
        instance = $.data(this, pluginName, new Toolbar(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
