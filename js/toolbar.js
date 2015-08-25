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
        defaults = {},
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
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {

        var self = this;
        this.element.attr('role', 'toolbar');
        this.buildAriaLabel();

        // keep track of how many popupmenus there are with an ID.
        // Used for managing events that are bound to $(document)
        this.id = (parseInt($('.toolbar, .formatter-toolbar').length, 10)+1);

        // Container for main group of buttons and input fields.  Only these spill into the More menu.
        this.buttonset = this.element.children('.buttonset');

        // Add and invoke More Button, if it doesn't exist
        this.more = this.element.find('.btn-actions');
        if (this.more.length === 0 && !this.element.hasClass('no-actions-button')) {
          var moreContainer = this.element.find('.more');
          if (!moreContainer.length) {
            moreContainer = $('<div class="more"></div>').appendTo(this.element);
          }
          this.more = $('<button class="btn-actions"></button>')
            .html('<svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-more"></svg>' +
              '<span class="audible">'+Locale.translate('MoreActions')+'</span>')
            .appendTo(moreContainer);
        }

        if (!this.more.data('button') && !this.element.hasClass('no-actions-button')) {
          this.more.button();
        }

        // Reference all interactive items in the toolbar
        this.items = this.buttonset.children('button, input')
          .add(this.buttonset.find('.searchfield-wrapper').children('input')) // Searchfield Wrappers
          .add(this.element.find('.title').children('button'))
          .add(this.more);

        // Setup the More Actions Menu.  Add Menu Items for existing buttons/elements in the toolbar, but
        // hide them initially.  They are revealed when overflow checking happens as the menu is opened.
        var popupPlugin = this.more.data('popupmenu');
        this.moreMenu = popupPlugin ? popupPlugin.menu : $('<ul class="popupmenu"></ul>').insertAfter(this.more);
        this.defaultMenuItems = this.moreMenu.find('li:not(.separator)').length > 0;

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

          // Order of operations for populating the List Item text:
          // span contents (.audible) >> button title attribute >> tooltip text (if applicable)
          var span = item.find('.audible'),
            title = item.attr('title'),
            tooltip = item.data('tooltip'),
            tooltipText = tooltip ? tooltip.content : undefined;

          var popupLiText = span.length ? span.text() :
            title !== '' && title !== undefined ? item.attr('title') :
            tooltipText ? tooltipText : item.text();

          a.text(popupLiText);

          // Pass along any icons except for the dropdown (which is added as part of the submenu design)
          var icon = item.find('.icon').filter(function(){
            return item.find('use').attr('xlink:href') !== '#icon-dropdown';
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

          if (item.is('.btn-menu')) {
            var submenu = item.data('popupmenu').menu.clone(),
              id = submenu.attr('id');

            submenu.removeAttr('id').attr('data-original-menu', id).wrap($('<div class="wrapper"></div>'));
            popupLi.addClass('submenu').append(submenu);
          }

          // Setup data links between the buttons and their corresponding list items
          item.data('action-button-link', a);
          popupLi.data('original-button', item);
          menuItems.push(popupLi);
        }

        this.items.filter(menuItemFilter).each(buildMenuItem);
        menuItems.reverse();
        $.each(menuItems, function(i, item) {
          item.prependTo(self.moreMenu);
        });

        if (!popupPlugin) {
          this.more.popupmenu({
            trigger: 'click',
            menu: this.moreMenu
          });
        }

        // Setup the tabindexes of all items in the toolbar and set the starting active button.
        this.more.attr('tabindex','-1');
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
        this.toggleMoreMenu();

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.items
          .onTouchClick('toolbar')
          .on('keydown.toolbar', function(e) {
            self.handleKeys(e);
          }).on('click.toolbar', function(e) {
            self.handleClick(e);
          }).on('focusin.toolbar', function(e) {
            self.handleFocus(e);
          }).on('blur.toolbar', function(e) {
            self.handleBlur(e);
          });

        this.more.on('keydown.toolbar', function(e) {
          self.handleKeys(e);
        }).on('beforeOpen.toolbar', function() {
          self.checkOverflowItems();
        }).on('selected.toolbar', function(e, anchor) {
          self.handleSelected(e, anchor);
        });

        this.element.on('updated.toolbar', function() {
          self.updated();
        }).on('recalculateButtons.toolbar', function() {
          self.adjustButtonVisibility();
        });

        $(window).on('resize.toolbar-' + this.id, function() {
          self.adjustButtonVisibility();
          self.toggleMoreMenu();
        });

        return this;
      },

      handleSelected: function(e, anchor) {
        var itemLink = anchor.parent().data('original-button'),
          itemEvts,
          toolbarEvts;

        if (itemLink && itemLink.length > 0) {
          itemEvts = itemLink.listEvents();
          toolbarEvts = this.element.listEvents();

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
            if (itemEvts[type] || itemLink[0]['on' + type]) {
              itemLink.trigger(type);
              return;
            }
          }

        }
      },

      handleClick: function(e) {
        this.setActiveButton($(e.currentTarget));
        return false;
      },

      handleFocus: function(e) {
        var item = $(e.target);

        if (item.is('.searchfield')) {
          this.element.addClass('searchfield-active');
        }

        return;
      },

      handleBlur: function(e) {
        var item = $(e.target);

        if (item.is('.searchfield')) {
          this.element.removeClass('searchfield-active');
        }

        return;
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

        if ((key === 37 && target.is(':not(input)')) || key === 38) {
          e.preventDefault();
          self.navigate(-1);
        }

        if ((key === 39 && target.is(':not(input)')) || key === 40) {
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
          this.activeButton = this.more.attr('tabindex', '0');
          activeButton.addClass('is-selected');
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

      adjustButtonVisibility: function() {
        var self = this,
          transitionEnd = $.fn.transitionEndName();
        this.items.each(function() {
          var item = $(this);

          // Don't do this for searchfields
          if (item.is('.searchfield')) {
            return;
          }

          if (self.isItemOverflowed(item)) {
            item.one(transitionEnd, function() {
              item.css('visibility', 'hidden');
            }).addClass('is-overflowed');

            if (document.activeElement === item[0] && item.is(':not(.btn-actions)')) {
              // set focus to last visible item
              self.getLastVisibleButton().focus();
            }
          } else {
            item.off(transitionEnd);
            item.css('visibility', '').removeClass('is-overflowed');
          }
        });
      },

      // Item is considered overflow if it's right-most edge sits past the right-most edge of the border.
      isItemOverflowed: function(item) {
        if (!item || item.length === 0) {
          return true;
        }

        if (this.buttonset.scrollLeft() > 0) {
          this.buttonset.scrollLeft(0);
        }
        var offset = ($(item).offset().left + $(item).outerWidth()) - this.buttonset.offset().left;
        return offset >= this.buttonset.width() + 1;
      },

      checkOverflowItems: function() {
        var self = this,
          visibleLis = [];

        function menuItemFilter(i, item) {
          return $(item).data('action-button-link');
        }

        this.items.filter(menuItemFilter).each(function() {
          var i = $(this),
            li = i.data('action-button-link').parent();

          if (!self.isItemOverflowed(i)) {
            li.addClass('hidden');
          } else {
            li.removeClass('hidden');
            visibleLis.push(li);
          }
        });

        if (visibleLis.length) {
          visibleLis[0].focus();
        } else {
          this.moreMenu.find('.hidden').last().next().focus();
        }
      },

      toggleMoreMenu: function() {
        if (this.element.hasClass('no-actions-button')) {
          return;
        }

        if (this.element.outerWidth() > 1 && this.buttonset.length > 0 && // Makes sure we're not animating Open or remaining Closed
          (this.buttonset[0].scrollWidth > this.buttonset.outerWidth() || // Inner scrolling area doesn't exceed control height
          this.defaultMenuItems)) { // No default menu items defined in the More Menu (will always show if there are)
          this.element.addClass('has-more-button');
        } else {
          this.element.removeClass('has-more-button');
        }
      },

      buildAriaLabel: function() {
        // Set up an aria-label as per AOL guidelines
        // http://access.aol.com/dhtml-style-guide-working-group/#toolbar
        if (!this.element.attr('aria-label')) {
          var isHeader = (this.element.closest('header.header').length ===1),
            id = this.element.attr('id') || '',
            title = this.element.find('.title'),
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
          .teardown();
        // Rebuild the control
        this
          .setup()
          .build()
          .handleEvents();
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.buttons.prop('disabled', false);
        this.moreButton.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.buttons.prop('disabled', true);
        this.moreButton.prop('disabled', true);
        this.popupmenu.close();
      },

      unbind: function() {
        this.items
          .offTouchClick()
          .off('keydown.toolbar click.toolbar focus.toolbar blur.toolbar');
        this.more.off('beforeOpen.toolbar selected.toolbar');
        $(window).off('resize.toolbar-' + this.id);
        return this;
      },

      teardown: function() {
        function menuItemFilter(i, item) {
          return $(item).data('action-button-link');
        }

        function deconstructMenuItem(i, item) {
          var a = $(item).data('action-button-link'),
            li = a.parent();

          a.off('mousedown.toolbar click.toolbar touchend.toolbar touchcancel.toolbar')
            .removeAttr('onclick').removeAttr('onmousedown');

          $.removeData(li[0], 'original-button');
          $.removeData(a[0], 'action-button-link');

          li.remove();
        }

        this.items.filter(menuItemFilter).each(deconstructMenuItem);
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this
          .unbind()
          .teardown();
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
