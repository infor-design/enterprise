/**
* Toolbar Control (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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
          maxVisibleButtons: 3 // Total amount of buttons that can be present, not including the More button
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Toolbar(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
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
        this.buildAriaLabel();

        // keep track of how many popupmenus there are with an ID.
        // Used for managing events that are bound to $(document)
        if (!this.id) {
          this.id = (parseInt($('.toolbar, .formatter-toolbar').length, 10)+1);
        }

        // Check for a "title" element.  This element is optional.
        this.title = this.element.children('.title');

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

        // Add and invoke More Button, if it doesn't exist
        this.more = this.element.find('.btn-actions');
        if (this.more.length === 0 && !this.element.hasClass('no-actions-button')) {
          var moreContainer = this.element.find('.more');

          if (!moreContainer.length) {
            moreContainer = $('<div class="more"></div>').appendTo(this.element);
          }

          this.more = $('<button class="btn-actions" type="button"></button>')
            .html('<svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-more"></svg>' +
              '<span class="audible">'+Locale.translate('MoreActions')+'</span>')
            .appendTo(moreContainer);
        }

        // Reference all interactive items in the toolbar
        this.items = this.buttonset.children('button, input')
          .add(this.buttonset.find('.searchfield-wrapper').children('input')) // Searchfield Wrappers
          .add(this.title.children('button'))
          .add(this.more);

        this.buttonsetItems = this.buttonset.children('button, input')
          .add(this.buttonset.find('.searchfield-wrapper').children('input'));

        // Invoke buttons
        this.items.filter('button, input[type="button"]').button();

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
            this.moreMenu = $('<ul class="popupmenu"></ul>').insertAfter(this.more);
          }
        } else {
          this.moreMenu = popupMenuInstance.menu;
        }
        this.defaultMenuItems = this.moreMenu.children('li:not(.separator)').length > 0;

        function menuItemFilter() {
          //jshint validthis:true
          return $(this).parent('.buttonset').length;
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
          }

          a.text(self.getItemText(item));

          // Pass along any icons except for the dropdown (which is added as part of the submenu design)
          var icon = item.children('.icon').filter(function(){
            return $(this).children('use').attr('xlink:href') !== '#icon-dropdown';
          });

          if (icon.length) {
            self.moreMenu.addClass('has-icons');
            a.html('<span>' + a.text() + '</span>');
            icon.clone().detach().prependTo(a);
          }

          var linkspan = popupLi.find('b');
          if (linkspan.length) {
            self.moreMenu.addClass('has-icons');
            linkspan.detach().prependTo(popupLi);
          }

          if (item.is('.searchfield')) {
            if (!item.data('searchfield')) {
              var searchfieldOpts = $.extend({}, $.fn.parseOptions(item[0]));
              item.toolbarsearchfield(searchfieldOpts);
            }
          }

          function addItemLinksRecursively(menu, diffMenu, parentItem) {
            var children = menu.children('li'),
              id = diffMenu.attr('id');

            diffMenu.children('li').each(function(i, diffMenuItem) {
              var dmi = $(diffMenuItem), // "Diffed" Menu Item
                omi = children.eq(i), // Corresponding "Original" menu item
                dmiA = dmi.children('a'), // Anchor inside of "Diffed" menu item
                omiA = omi.children('a'); // Anchor inside of "Original" menu item

              dmiA.removeAttr('id');

              omiA.data('action-button-link', dmiA);
              dmiA.data('original-button', omiA);

              var omiSubMenu = omi.children('.wrapper').children('.popupmenu'),
                dmiSubMenu = dmi.children('.wrapper').children('.popupmenu');

              if (dmiSubMenu.length && dmiSubMenu.length) {
                dmi.addClass('submenu');
                addItemLinksRecursively(dmiSubMenu, omiSubMenu, dmi);
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

        if (popupMenuInstance) {
          this.more.trigger('updated');
        } else {
          var actionButtonOpts = $.fn.parseOptions(this.more[0]);

          this.more.popupmenu($.extend({}, actionButtonOpts, {
            trigger: 'click',
            menu: this.moreMenu
          })).on('beforeopen', function() {
            //Refresh Text
            self.moreMenu.find('a').each(function () {
              var a = $(this),
                item = $(this).data('originalButton'),
                text = self.getItemText(item);

              if (item) {
                a.find('span').text(text.trim());
              }
            });
          });
        }

        // Setup the tabindexes of all items in the toolbar and set the starting active button.
        this.items.attr('tabindex', '-1');

        var active = this.items.filter('.is-selected');
        if (active.length) {
          this.activeButton = active.first().attr('tabindex', '0');
          this.items.not(this.activeButton).removeClass('is-selected');
        } else {
          active = this.items.filter(':visible:not(:disabled)').first();
          this.activeButton = active.attr('tabindex', '0');
        }

        if (this.isItemOverflowed(active)) {
          active.attr('tabindex', '-1');
          this.activeButton = this.more.addClass('is-selected').attr('tabindex', '0');
        }

        // Toggles the More Menu based on overflow of toolbar items
        this.adjustButtonVisibility();
        this.toggleMoreMenu();

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
          .on('keydown.toolbar', function(e) {
            self.handleKeys(e);
          }).on('click.toolbar', function(e) {
            self.handleClick(e);
          });

        this.items.filter('.btn-menu, .btn-actions')
          .on('close.toolbar', function onClosePopup() {
            $(this).focus();
          });

        this.items.not(this.more).on('selected.toolbar', function(e, anchor) {
          e.stopPropagation();
          self.handleSelected(e, anchor);
        });

        this.more.on('keydown.toolbar', function(e) {
          self.handleKeys(e);
        }).on('beforeOpen.toolbar', function() {
          self.checkOverflowItems();
        }).on('selected.toolbar', function(e, anchor) {
          e.stopPropagation();
          self.handleSelected(e, anchor);
        });

        this.element.on('updated.toolbar', function(e) {
          e.stopPropagation();
          self.updated();
        }).on('recalculateButtons.toolbar', function() {
          self.adjustButtonVisibility();
          self.toggleMoreMenu(); // Added 9/16/2015 due to issue HFC-2876
        });

        $(window).on('resize.toolbar-' + this.id, function() {
          self.adjustButtonVisibility();
          self.toggleMoreMenu();
        });

        return this;
      },

      handleSelected: function(e, anchor) {
        var itemLink = anchor.data('original-button'),
          itemEvts,
          toolbarEvts;

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
          target = $(e.target);

        if (target.is('.btn-actions')) {
          if (key === 37 || key === 38) { // Left/Up
            e.preventDefault();
            self.setActiveButton(self.getLastVisibleButton());
          }

          if (key === 39 || (key === 40 && target.attr('aria-expanded') !== 'true')) { // Right (or Down if the menu's closed)
            e.preventDefault();
            self.setActiveButton(self.getFirstVisibleButton());
          }
          return;
        }

        if ((key === 37 && target.is(':not(input)')) ||
          (key === 37 && target.is('input') && e.shiftKey) || // Shift + Left Arrow should be able to navigate away from Searchfields
          key === 38) {
          e.preventDefault();
          self.navigate(-1);
        }

        if ((key === 39 && target.is(':not(input)')) ||
          (key === 39 && target.is('input') && e.shiftKey) || // Shift + Right Arrow should be able to navigate away from Searchfields
          key === 40) {
          e.preventDefault();
          self.navigate(1);
        }

        return;
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
        var self = this,
          target;

        this.items.each(function(i) {
          if (self.isItemOverflowed($(this))) {
            target = self.items.eq(i - 1);
            return false;
          }
        });

        if (!target || target.length === 0) {
          target = this.items.not(this.more).last();
        }

        while(target.is('.separator, *:disabled, *:hidden')) {
          target = target.prev();
        }
        return target;
      },

      getFirstVisibleButton: function() {
        var target = this.items.eq(0);
        while(target.is('.separator, *:disabled, *:hidden')) {
          target = target.next();
        }
        return target;
      },

      setActiveButton: function(activeButton, noFocus) {
        this.items.attr('tabindex', '-1').removeClass('is-selected');
        this.more.attr('tabindex', '-1').removeClass('is-selected');

        // Menu Button
        if (activeButton.is('a')) {
          this.activeButton = activeButton.parents('.popupmenu').last().prev('button').attr('tabindex', '0');
          this.activeButton.focus();
          return;
        }

        // if the button that needs to be selected is overflowed, don't make it tabbable, but make
        // the more button tabbable instead.
        var tooltip = this.more.data('tooltip');
        if (activeButton[0] !== this.more[0] && this.isItemOverflowed(activeButton)) {
          // Don't activate the more button if we have a selected and active searchfield
          if (!activeButton.is('.searchfield')) {
            this.activeButton = this.more;
          } else {
            this.activeButton = activeButton;
          }
          this.activeButton.attr('tabindex', '0').addClass('is-selected');
        } else {
          this.activeButton = activeButton.addClass('is-selected').attr('tabindex', '0');
          if (tooltip && tooltip.tooltip.is(':not(.hidden)')) {
            tooltip.hide();
          }
        }

        if (!noFocus) {
          this.activeButton.focus();
        }
      },

      // Triggers a "selected" event on the base Toolbar element using a common element as an argument.
      // @param {Object} element - a jQuery Object containing an anchor tag, button, or input field.
      triggerSelect: function(element) {
        var elem = $(element);
        if (elem.is(this.more) || (elem.is('.btn-menu, li.submenu'))) {
          return;
        }

        this.element.trigger('selected', [elem]);
      },

      adjustButtonVisibility: function() {
        var self = this,
          visibleLis = [];

        function menuItemFilter() {
          // jshint validthis:true
          var i = $(this);
          return (i.data('action-button-link') && i.is(':not(.searchfield)'));
        }

        this.buttonsetItems.filter(menuItemFilter).removeClass('is-overflowed').each(function() {
          var i = $(this),
            li = i.data('action-button-link').parent();

          if (!self.isItemOverflowed(i)) {
            li.addClass('hidden');
          } else {
            li.removeClass('hidden');
            i.addClass('is-overflowed');
            visibleLis.push(li);
          }
        });

        return {
          visible: visibleLis
        };
      },

      // Item is considered overflow if it's right-most edge sits past the right-most edge of the border.
      isItemOverflowed: function(item) {
        if (!item || item.length === 0) {
          return true;
        }

        // In cases where a Title is present and buttons are right-aligned, only show up to the maximum allowed.
        if (this.title.length && (this.buttonsetItems.index(item) >= (this.settings.maxVisibleButtons - 1))) { // Subtract one to account for the More Button
          // ONLY cause this to happen if there are at least two items that can be placed in the overflow menu.
          // This prevents ONE item from being present in the menu by itself
          if (!this.buttonsetItems.last().is(item) || item.prev().is('.is-overflowed')) {
            return true;
          }
        }

        if (this.buttonset.scrollTop() > 0) {
          this.buttonset.scrollTop(0);
        }
        var offset = ($(item).offset().top + $(item).outerHeight()) - this.buttonset.offset().top;
        return offset >= this.buttonset.outerHeight() + 1;
      },

      checkOverflowItems: function() {
        var items = this.adjustButtonVisibility();

        if (!$.contains(this.buttonset[0], document.activeElement)) {
          if (items.visible.length) {
            items.visible[items.visible.length - 1].focus();
          } else {
            this.moreMenu.find('.hidden').last().next().focus();
          }
        }
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

        if (method === 'removeClass') {
          this.more.data('popupmenu').close();
        }
      },

      buildAriaLabel: function() {
        // Set up an aria-label as per AOL guidelines
        // http://access.aol.com/dhtml-style-guide-working-group/#toolbar
        if (!this.element.attr('aria-label')) {
          var isHeader = (this.element.closest('header.header').length ===1),
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
        // Rebuild the control
          .init();
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.buttons.prop('disabled', false);
        this.more.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.buttons.prop('disabled', true);
        this.more.prop('disabled', true).data('popupmenu').close();
      },

      unbind: function() {
        this.items
          .offTouchClick('toolbar')
          .off('keydown.toolbar click.toolbar focus.toolbar blur.toolbar');

        this.more.off('beforeOpen.toolbar selected.toolbar');
        $(window).off('resize.toolbar-' + this.id);
        return this;
      },

      teardown: function() {
        function deconstructMenuItem(i, item) {
          var li = $(item),
            a = li.children('a'),
            itemLink = a.data('original-button');

          a.off('mousedown.toolbar click.toolbar touchend.toolbar touchcancel.toolbar');

          if (itemLink && itemLink.length) {
            $.removeData(a[0], 'original-button');
            $.removeData(itemLink[0], 'action-button-link');
          }

          if (li.is('submenu')) {
            li.children('.wrapper').children('.popupmenu').children('li').each(deconstructMenuItem);
          }

          li.remove();
        }

        this.moreMenu.children('li').each(deconstructMenuItem);
        this.more.data('popupmenu').destroy();

        if (!this.defaultMenuItems) {
          this.moreMenu.remove();
        }

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
