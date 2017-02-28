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

  //NOTE: Just this part will show up in SoHo Xi Builds.
  $.fn.toolbar = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'toolbar',
        defaults = {
          rightAligned: false, // Will always attempt to right-align the contents of the toolbar.
          maxVisibleButtons: 3, // Total amount of buttons that can be present, not including the More button
          resizeContainers: false, // If true, uses Javascript to size the Title and Buttonset elements in a way that shows as much of the Title area as possible.
          favorButtonset: true // If "resizeContainers" is true, setting this to true will try to display as many buttons as possible while resizing the toolbar.  Setting to false attempts to show the entire title instead.
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
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

      init: function() {
        return this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        // Can't have zero buttons
        if (this.settings.maxVisibleButtons <= 0) {
          this.settings.maxVisibleButtons = 3;
        }

        return this;
      },

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
        this.items = this.buttonset.children('button')
          .add(this.buttonset.find('input')) // Searchfield Wrappers
          .add(this.title.children('button'))
          .add(this.more);

        this.buttonsetItems = this.buttonset.children('button, input')
          .add(this.buttonset.find('.searchfield-wrapper, .toolbar-searchfield-wrapper').children('input'));

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
        function buildMenuItem() {
          /*jshint validthis:true */
          var item = $(this),
            popupLi = $('<li></li>'),
            a = $('<a href="#"></a>').appendTo(popupLi);

          if (item.is(':hidden')) {
            popupLi.addClass('hidden');
          }
          if (item.is(':disabled')) {
            popupLi.addClass('is-disabled');
          } else {
            popupLi.removeClass('is-disabled');
          }

          a.text(self.getItemText(item));

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
            self.moreMenu.addClass('has-icons');
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
            });

            diffMenu.removeAttr('id').attr('data-original-menu', id);
            parentItem.addClass('submenu');

            if (parentItem.is(popupLi)) {
              diffMenu.wrap($('<div class="wrapper"></div>'));
              parentItem.append(diffMenu);
            }
          }

          if (item.is('.btn-menu')) {
            if (!item.data('popupmenu')) {
              item.popupmenu();
            }

            var menu = item.data('popupmenu').menu,
              diffMenu = menu.clone();

            addItemLinksRecursively(menu, diffMenu, popupLi);
          }

          if (item.is('[data-popdown]')) {
            item.popdown();
          }

          // Setup data links between the buttons and their corresponding list items
          item.data('action-button-link', a);
          popupLi.children('a').data('original-button', item);
          menuItems.push(popupLi);
        }

        this.items.not(this.more).filter(menuItemFilter).each(buildMenuItem);
        menuItems.reverse();
        $.each(menuItems, function(i, item) {
          if (item.text() !== '') {
            item.prependTo(self.moreMenu);
          }
        });

        //Refresh Text and Disabled
        function refreshTextAndDisabled(menu) {
          $('li > a', menu).each(function () {
            var a = $(this),
                item = a.data('originalButton'),
                text = self.getItemText(item),
                submenu;

            if (item) {
              if (a.find('span').length) {
                a.find('span').text(text.trim());
              } else {
                a.text(text.trim());
              }

              if (item.is('.hidden') || item.parent().is('.hidden')) {
                a.closest('li').addClass('hidden');
              } else {
                a.closest('li').removeClass('hidden');
              }

              if (item.parent().is('.is-disabled') || item.is(':disabled')) { // if it's disabled menu item, OR a disabled menu-button
                a.closest('li').addClass('is-disabled');
                a.attr('tabindex', '-1');
              } else {
                a.closest('li').removeClass('is-disabled');
                a.removeAttr('disabled');
              }

              if (item.is('.btn-menu')) {
                submenu = a.parent().find('.popupmenu').first();
                refreshTextAndDisabled(submenu);
              }
            }
          });
        }

        if (popupMenuInstance) {
          this.more
            .on('beforeopen.toolbar', function() {
              refreshTextAndDisabled(self.moreMenu);
            })
            .triggerHandler('updated');
        } else {
          var actionButtonOpts = $.fn.parseOptions(this.more[0]);

          this.more.popupmenu($.extend({}, actionButtonOpts, {
            trigger: 'click',
            menu: this.moreMenu
          })).on('beforeopen.toolbar', function() {
            refreshTextAndDisabled(self.moreMenu);
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
        this.handleResize();

        this.element.triggerHandler('rendered');
        return this;
      },

      // Order of operations for populating the List Item text:
      // span contents (.audible) >> button title attribute >> tooltip text (if applicable)
      getItemText: function (item) {
        if (!item) {
          return;
        }
        var span = item.find('.audible'),
          title = item.attr('title'),
          tooltip = item.data('tooltip'),
          tooltipText = tooltip ? tooltip.content : undefined;

        var popupLiText = span.length ? span.text() :
          title !== '' && title !== undefined ? item.attr('title') :
          tooltipText ? tooltipText : item.text();

        return popupLiText;
      },

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
            $(this).focus();
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

        this.element.off('updated.toolbar').on('updated.toolbar', function(e) {
          e.stopPropagation();
          self.updated();
        }).off('recalculate-buttons.toolbar').on('recalculate-buttons.toolbar', function(e, containerDims) {
          self.handleResize(containerDims);
        });

        $('body').off('resize.toolbar-' + this.id).on('resize.toolbar-' + this.id, function() {
          self.handleResize();
        });

        return this;
      },

      handleSelected: function(e, anchor) {
        var itemLink = anchor.data('original-button'),
          li = anchor.parent(),
          itemEvts,
          toolbarEvts;

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

          // Trigger Select on the linked item, since it won't be done by another event
          this.triggerSelect(itemLink);
          return;
        }

        // If no item link exists, it's a pre-defined menu item.
        // Trigger 'selected' manually on the toolbar element.
        // Normally this would happen by virtue of triggering the "click" handlers on a linked button above.
        this.triggerSelect(anchor);
      },

      handleClick: function(e) {
        this.setActiveButton($(e.currentTarget));
        this.triggerSelect($(e.currentTarget));
        return false;
      },

      handleKeys: function(e) {
        var self = this,
          key = e.which,
          target = $(e.target),
          isActionButton = target.is('.btn-actions'),
          isRTL = Locale.isRTL();

        /*
        if (target.is('.btn-actions')) {
          if (key === 37 || key === 38) { // Left/Up
            e.preventDefault();
            target = isRTL ? self.getFirstVisibleButton() : self.getLastVisibleButton();
          }

          if (key === 39 || (key === 40 && target.attr('aria-expanded') !== 'true')) { // Right (or Down if the menu's closed)
            e.preventDefault();
            target = isRTL ? self.getLastVisibleButton() : self.getFirstVisibleButton();
          }

          self.setActiveButton(target);
          return;
        }
        */

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

      handleResize: function(containerDims) {
        var buttons = this.getVisibleButtons();

        for (var i = 0; i < buttons.length; i++) {
          buttons.visible[i][0].classList.remove('is-overflowed');
        }

        if (this.settings.resizeContainers) {
          var title = containerDims ? containerDims.title : undefined,
            buttonset = containerDims ? containerDims.buttonset : undefined;

          this.sizeContainers(title, buttonset);
        }

        if (this.element.is(':not(:hidden)')) {
          this.adjustMenuItemVisibility();
          this.toggleMoreMenu(); // Added 9/16/2015 due to issue HFC-2876
        }
      },

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

        buttonsetElem.style.width = 'auto';
        titleElem.style.width = 'auto';

        if (!containerElem.classList.contains('do-resize')) {
          containerElem.classList.add('do-resize');
        }

        var toolbarStyle = window.getComputedStyle(containerElem),
          toolbarWidth = parseInt(toolbarStyle.width),
          padding = parseInt(toolbarStyle.paddingLeft) + parseInt(toolbarStyle.paddingRight),
          buttonsetWidth = parseInt(window.getComputedStyle(buttonsetElem).width) + WHITE_SPACE,
          moreWidth = moreElem !== undefined ? parseInt(window.getComputedStyle(moreElem).width) : 0,
          titleScrollWidth = titleElem.scrollWidth + 1;

        if (isNaN(moreWidth)) {
          moreWidth = 50;
        }

        if (isNaN(buttonsetWidth) || buttonsetWidth < MIN_BUTTONSET_SIZE) {
          buttonsetWidth = MIN_BUTTONSET_SIZE;
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
          if (this.settings.favorButtonset) {
            targetButtonsetWidth = buttonsetWidth;
            targetTitleWidth = toolbarWidth - (padding + buttonsetWidth + moreWidth);
          } else {
            targetTitleWidth = titleScrollWidth;
            targetButtonsetWidth = toolbarWidth - (padding + titleScrollWidth + moreWidth);
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

          buttonsetElem.style.width = addPx(targetButtonsetWidth);
          titleElem.style.width = addPx(targetTitleWidth);

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

        titleElem.style.width = addPx(targetTitleWidth);
        buttonsetElem.style.width = addPx(targetButtonsetWidth);
        return this;
      },

      // Go To a button
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

      // Gets the last button that's above the overflow line
      getLastVisibleButton: function() {
        var items = $(this.items.get().reverse()).not(this.more),
          target;

        var i = 0,
          elem;

        while(!target && i < items.length - 1) {
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

        while(target.is('.separator, *:disabled, *:hidden')) {
          target = target.next();
        }

        return target;
      },

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

      setActiveButton: function(activeButton, noFocus) {
        // Return out of this if we're clicking the currently-active item
        if (activeButton[0] === this.activeButton[0]) {
          return;
        }

        var self = this;

        function getActiveButton() {
          // Menu items simply set the "More Actions" button as active
          if (activeButton.is('a')) {
            return self.more;
          }

          // If it's the more button, hide the tooltip and set it as active
          var tooltip = self.more.data('tooltip');
          if (activeButton[0] === self.more[0]) {
            if (tooltip && tooltip.tooltip.is(':not(.hidden)')) {
              tooltip.hide();
            }
            return self.more;
          }

          // Overflowed items also set
          if (self.isItemOverflowed(activeButton)) {
            if (!activeButton.is('.searchfield')) {
              return self.more;
            }
          }

          return activeButton;
        }

        this.items.add(this.more).attr('tabindex', '-1').removeClass('is-selected');

        this.activeButton = getActiveButton();
        this.activeButton.addClass('is-selected').attr('tabindex', '0');

        if (!noFocus) {
          this.activeButton[0].focus();
        }
      },

      /** Triggers a "selected" event on the base Toolbar element using a common element as an argument.
       * @param {Object} element - a jQuery Object containing an anchor tag, button, or input field.
       */
      triggerSelect: function(element) {
        var elem = $(element);
        if (elem.is(this.more) || (elem.is('.btn-menu, li.submenu'))) {
          return;
        }

        this.element.triggerHandler('selected', [elem]);
      },

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
            return;
          }

          if (!elemIsHidden) {
            li.classList.remove('hidden');
          }
          elem.classList.add('is-overflowed');

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

      // Item is considered overflow if it's right-most edge sits past the right-most edge of the border.
      isItemOverflowed: function(item) {
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

      enable: function() {
        this.element.prop('disabled', false);
        this.items.prop('disabled', false);
        this.more.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.items.prop('disabled', true);
        this.more.prop('disabled', true).data('popupmenu').close();
      },

      unbind: function() {
        this.items
          .offTouchClick('toolbar')
          .off('keydown.toolbar click.toolbar focus.toolbar blur.toolbar');

        this.more.off('keydown.toolbar beforeopen.toolbar selected.toolbar');
        $('body').off('resize.toolbar-' + this.id);
        return this;
      },

      teardown: function() {
        function deconstructMenuItem(i, item) {
          var li = $(item),
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
            submenuContainer.children('li').each(deconstructMenuItem);
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

            li.remove();
          }

        }

        if (this.title && this.title.length) {
          this.title.off('beforeshow.toolbar').data('tooltip').destroy();
        }

        this.moreMenu.children('li').each(deconstructMenuItem);
        return this;
      },

      // Teardown - Remove added markup and events
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
