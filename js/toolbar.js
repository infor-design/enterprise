/**
* Toolbar Control (TODO: bitly link to soho xi docs)
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.toolbar = function(options) {

    // Settings and Options
    var pluginName = 'toolbar',
        defaults = {
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Toolbar(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Toolbar.prototype = {

      init: function() {
        this.settings = $.extend({}, settings);
        this.setup();
        this.handleEvents();
      },

      setup: function () {
       this.element.attr('role', 'toolbar');

        // Set up an aria-label as per AOL guidelines
        // http://access.aol.com/dhtml-style-guide-working-group/#toolbar
        if (!this.element.attr('aria-label')) {
          var id = this.element.attr('id') || '',
            title = this.element.find('.title'),
            prevLabel = this.element.prev('label'),
            prevSpan = this.element.prev('.label'),
            labelText = title.length ? title.text() :
            prevLabel.length ? prevLabel.text() :
            prevSpan.length ? prevSpan.text() : id + ' Toolbar'; // TODO: Localize

          this.element.attr('aria-label', labelText.replace(/\s+/g,' ').trim());
        }

        this.buttonset = this.element.find('.buttonset');

        if (!this.buttonset.length) {
          this.buttonset = $('<div class="buttonset"></div>').appendTo(this.buttonset);
        }

        this.moreButton = this.element.find('.btn-actions');

        if (!this.moreButton.length) {
          var container = $('<div class="more"></div>').appendTo(this.element);
          this.moreButton = $('<button class="btn-actions" data-init="true" tabindex="-1"></button>').appendTo(container);
          $('<svg class="icon" focusable="false"><use xlink:href="#action-button"></use></svg>').appendTo(this.moreButton);
          $('<span class="audible">Actions</span>').appendTo(this.moreButton); // TODO: Localize
        }

        if (this.moreButton.data('popupmenu')) {
          this.moreButton.data('popupmenu').destroy();
        }

        if (!this.moreButton.data('button')) {
          this.moreButton.button();
        }
        this.moreButton.attr('tabindex', '-1');

        this.buttons = this.buttonset.find('button');
        this.buttons.attr('tabindex', '-1');
        var active = this.buttons.filter('.is-selected');
        if (active.length) {
          this.activeButton = active.first().attr('tabindex', '0');
          this.buttons.not(this.activeButton).removeClass('is-selected');
        } else {
          this.activeButton = this.buttons.filter(':visible:not(:disabled)').first().attr('tabindex', '0');
        }

        this.setOverflow();
      },

      // Go To a button
      navigate: function (direction) {
        var buttons = this.buttons.filter(':visible:not(:disabled)'),
          current = buttons.index(this.activeButton),
          next = current + direction,
          last;

        if (next >= 0 && next < buttons.length) {
          if (this.isButtonOverflowed(buttons.eq(next))) {
            this.setActiveButton(this.moreButton);
            this.buildPopupMenu(buttons.eq(next));
          } else {
            this.setActiveButton(buttons.eq(next));
          }
          return false;
        }

        if (next >= buttons.length) {
          this.setActiveButton(buttons.first());
          return false;
        }

        if (next === -1) {
          last = buttons.last();
          if (this.isButtonOverflowed(last)) {
            this.setActiveButton(this.moreButton);
            this.buildPopupMenu(last);
          } else {
            this.setActiveButton(last);
          }
          return false;
        }
      },

      setActiveButton: function(activeButton) {
        this.buttons.attr('tabindex', '-1').removeClass('is-selected');
        this.moreButton.attr('tabindex', '-1').removeClass('is-selected');

        if (activeButton.is('a')) {
          this.activeButton = activeButton.parents('.popupmenu').last().prev('button').attr('tabindex', '0');
          this.activeButton.focus();
          return;
        }

        // if the button that needs to be selected is overflowed, don't make it tabbable, but make
        // the more button tabbable instead.
        if (activeButton[0] !== this.moreButton[0] && this.isButtonOverflowed(activeButton)) {
          this.activeButton = this.moreButton.attr('tabindex', '0');
          activeButton.addClass('is-selected');
        } else {
          this.activeButton = activeButton.addClass('is-selected').attr('tabindex', '0');
        }
        this.activeButton.focus();
      },

      handleClick: function(e) {
        this.setActiveButton($(e.currentTarget));
        return false;
      },

      handleEvents: function() {
        var self = this;

        this.buttonset.on('keydown.toolbar', 'button', function(e) {
          self.handleKeys(e);
        }).on('touchend.toolbar touchcancel.toolbar', 'button', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(e.target).click();
        }).on('click.toolbar', 'button', function(e) {
          self.handleClick(e);
        });

        this.moreButton.on('touchend.toolbar touchcancel.toolbar', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(e.target).click();
        }).on('click.toolbar', function(e) {
          if (!(self.element.hasClass('has-more-button'))) {
            e.stopPropagation();
          }
          self.buildPopupMenu();
        }).on('keydown.toolbar', function(e) {
          switch(e.which) {
            case 37: // left
            case 38: // up
              e.preventDefault();
              self.setActiveButton(self.getLastVisibleButton());
              break;
            case 13: // enter
            case 32: // spacebar
              if ($(this).hasClass('popup-is-open')) {
                return false;
              } //jshint ignore:line
            case 39: // right
            case 40: // down
              e.preventDefault();
              self.buildPopupMenu();
              break;
          }
        });

        $(window).on('resize.toolbar', function() {
          self.setOverflow();
        });
      },

      // Handle Arrow Keys
      handleKeys: function(e) {
        var self = this,
          key = e.which;

        if (key === 37 || key === 38) {
          self.navigate(-1);
        }

        if (key === 39 || key === 40) {
          self.navigate(1);
        }
      },

      // NOTE: Tabs has similar code... not very DRY...
      setOverflow: function() {
        if (this.buttonset[0].scrollHeight > this.element.outerHeight() + 1) {
          this.element.addClass('has-more-button');
        } else {
          this.element.removeClass('has-more-button');
        }
      },

      // NOTE: Tabs has similar code... not very DRY
      isButtonOverflowed: function(button) {
        if (!button || button.length === 0) {
          return true;
        }
        if (this.buttonset.scrollTop() > 0) {
          this.buttonset.scrollTop(0);
        }
        var offset = $(button).offset().top - this.buttonset.offset().top;
        return offset >= this.buttonset.height();
      },

      // Gets the last button that's above the overflow line
      getLastVisibleButton: function() {
        var self = this,
          target;
        this.buttons.each(function(i) {
          if (self.isButtonOverflowed($(this))) {
            target = self.buttons.eq(i - 1);
            return false;
          }
        });
        while(target.is('.separator') || target.is('.overflow-break') || target.is(':disabled') || target.is(':hidden')) {
          target = target.prev();
        }
        return target;
      },

      getFirstVisibleButton: function() {
        var target = this.buttons.eq(0);
        while(target.is('.separator') || target.is('.overflow-break') ||  target.is(':disabled') || target.is(':hidden')) {
          target = target.next();
        }
        return target;
      },

      buildPopupMenu: function(startingButton) {
        var self = this,
          menuHtml = $('#toolbar-overflow-menu'),
          buttons = this.buttons.filter(':not(:hidden)'),
          menuOpts = $();

        function selectListOption(e) {
          var listOpts = menuHtml.find('li:not(.separator):not(.overflow-break)'),
            selected = menuHtml.find('.is-selected'),
            button = menuOpts.eq(listOpts.index(selected));

          if (selected.parents('.submenu').length > 0) {
            button = selected.children('a');
          }

          self.setActiveButton(button);

          // Only click the button if this isn't being filtered from a 'select' event
          // (select event is triggered in PopupMenu by a click)
          if (!e || e.type !== 'selected') {
            button.trigger('click');
          }
        }

        if (self.popupmenu) {
          self.popupmenu.close();
          self.moreButton.removeClass('popup-is-open');
          $('#toolbar-overflow-menu').remove();
          $(document).off('keydown.popupmenu');
        }

        // Generate new list markup for menu if it doesn't exist
        if (!menuHtml.length) {
          menuHtml = $('<ul id="toolbar-overflow-menu" class="popupmenu toolbar-options"></ul>').appendTo('body');
        }
        menuHtml.empty();

        buttons.each(function() {
          var button = $(this),
            pastOverflowBreak = false,
            popupLi;

          if (!pastOverflowBreak && button.prevAll('.overflow-break').length) {
            pastOverflowBreak = true;
          }
          if (!pastOverflowBreak && !self.isButtonOverflowed(button)) {
            return;
          }

          if (menuHtml.find('li').length > 0 && button.prev().is('.separator')) {
            button.prev().clone().appendTo(menuHtml);
          }
          popupLi = $('<li></li>').appendTo(menuHtml);
          popupLi.html($('<a></a>').append(button.html()));

          if (button.is(':hidden')) {
            popupLi.addClass('hidden');
          }
          if (button.is(':disabled')) {
            popupLi.addClass('is-disabled');
          }

          // Pass along any icons except for the dropdown (which is added as part of the submenu design)
          var icon = popupLi.find('.icon').filter(function(){
            return $(this).find('use').attr('xlink:href') !== '#icon-dropdown';
          });
          if (icon.length) {
            menuHtml.addClass('has-icons');
            icon.detach().prependTo(popupLi);
          }

          var linkspan = popupLi.find('b');
          if (linkspan.length) {
            menuHtml.addClass('has-icons');
            linkspan.detach().prependTo(popupLi);
          }

          if (button.is('.btn-menu')) {
            var submenu = button.data('popupmenu').menu.clone().wrap($('<div class="wrapper"></div>'));
            popupLi.addClass('submenu').append(submenu);
          }

          // Order of operations for populating the List Item text:
          // span contents (.audible) >> button title attribute >> tooltip text (if applicable)
          var text = popupLi.find('.audible'),
            title = button.attr('title'),
            tooltip = button.data('tooltip'),
            tooltipText = tooltip ? tooltip.content : undefined;

          var popupLiText = text.length ? text.removeClass('audible').text() :
            title !== '' && title !== undefined ? button.attr('title') :
            tooltipText ? tooltipText : button.text();

          popupLi.find('.audible').remove();
          popupLi.children('a').text(popupLiText);

          if (!menuOpts) {
            menuOpts = button;
          } else {
            menuOpts = menuOpts.add(button);
          }
        });

        self.moreButton
          .popupmenu({
            autoFocus: false,
            menu: menuHtml,
            trigger: 'immediate'
          })
          .addClass('popup-is-open');

        self.popupmenu = self.moreButton.data('popupmenu');

        menuHtml.on('focus.popupmenu', 'a', function() {
          menuHtml.find('li').removeClass('is-selected');
          $(this).parent().addClass('is-selected');
        }).on('destroy.popupmenu', function() {
          menuHtml.off().remove();
        });

        self.moreButton.one('close.popupmenu', function() {
          $(this).off('selected.popupmenu close.popupmenu');
          $(document).off(this.popupmenuKeyboardEvent);
          this.popupmenuKeyboardEvent = undefined;
          self.moreButton.removeClass('popup-is-open');
        }).on('selected.popupmenu', function(e) {
          // internal popupmenu event that fires when an option is clicked
          selectListOption(e);
        });

        // If the optional startingIndex is provided, focus the popupmenu on the matching item.
        // Otherwise, focus the first item in the list.
        var index = 0;
        if (startingButton) {
          index = menuOpts.index(startingButton);
        } else {
          var focused = menuOpts.filter('.is-selected');
          if (focused.length > 0) {
            index = menuOpts.index(focused);
          }
        }
        menuHtml.children('li').eq(index).children('a').focus();

        // Overrides a similar method in the popupmenu code that controls escaping of this menu when
        // pressing certain keys.  We override this here so that the controls act in a manner as if all tabs
        // are still visible (for accessiblity reasons), meaning you can use left and right to navigate the
        // popup menu options as if they were tabs.
        setTimeout(function() {
          $(document).bindFirst('keydown.popupmenu', function(e) {
            this.popupmenuKeyboardEvent = e;
            var key = e.which;

            function prevMenuItem() {
              // If the first item in the popup menu is already focused, close the menu and focus
              // on the last visible item in the tabs list.
              var firstInList = menuHtml.find('li:not(.separator):not(.overflow-break):not(.is-disabled):visible').first(),
                selected = menuHtml.find('.is-selected');
              if (firstInList[0] === selected[0]) {
                e.preventDefault();
                $(document).off(e);
                self.popupmenu.close();
                self.setActiveButton(self.getLastVisibleButton());
              }
            }

            function nextMenuItem() {
              // If the last item in the popup menu is already focused, close the menu and focus
              // on the first visible item in the tabs list.
              var lastInList = menuHtml.find('li:not(.separator):not(.overflow-break):not(.is-disabled):visible').last(),
                selected = menuHtml.find('.is-selected');
              if (lastInList[0] === selected[0]) {
                e.preventDefault();
                $(document).off(e);
                self.popupmenu.close();
                self.setActiveButton(self.getFirstVisibleButton());
              }
            }

            switch(key) {
              case 13: // enter
              case 32: // space
                e.preventDefault();
                if ($(e.target).is(':not(.submenu)')) {
                  selectListOption();
                  self.popupmenu.close();
                }
                break;
              case 27: // escape
                e.preventDefault();
                var target = self.getLastVisibleButton();
                self.setActiveButton(target);
                break;
              case 37: // left
                if ($(e.target).parents('.wrapper').length === 0) { // is currently selected item inside a submenu that can be closed?
                  e.stopPropagation();
                  e.preventDefault();
                  $(document).trigger({type: 'keydown.popupmenu', which: 38});
                }
                break;
              case 38: // up
                prevMenuItem();
                break;
              case 39: // right
                if ($(e.target).is(':not(.submenu)')) { // is currently selected menu item a parent?
                  e.stopPropagation();
                  e.preventDefault();
                  $(document).trigger({type: 'keydown.popupmenu', which: 40});
                }
                break;
              case 40: // down
                nextMenuItem();
                break;
            }
          });
         }, 0);
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new Toolbar(this, settings));
      }
    });
  };
}));
