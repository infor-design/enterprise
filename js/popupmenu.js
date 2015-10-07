/**
* Responsive Popup Menu Control (Context)
* @name popupmen
*/

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

  $.fn.popupmenu = function(options) {

    // Settings and Options
    var pluginName = 'popupmenu',
      defaults = {
        menu: null,  //Menu's ID Selector, or a jQuery object representing a menu
        trigger: 'click',  //click, rightClick, immediate ect
        autoFocus: true,
        mouseFocus: true,
        ariaListbox: false,   //Switches aria to use listbox construct instead of menu construct (internal)
        eventObj: undefined  //Can pass in the event object so you can do a right click with immediate
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function PopupMenu(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    PopupMenu.prototype = {
      init: function() {
        this.setup();
        this.addMarkup();
        this.handleEvents();
        this.iconFilteringSetup();
      },

      setup: function() {
        if (this.element.attr('data-popupmenu') && (this.settings.menu === null || this.settings.menu === undefined)) {
          this.settings.menu = this.element.attr('data-popupmenu').replace(/#/g, '');
        }
        // Backwards compatibility for "menuId" menu options coming from other controls
        // that utilize the Popupmenu.
        if (this.settings.menuId) {
          this.settings.menu = this.settings.menuId;
          this.settings.menuId = undefined;
        }

        // keep track of how many popupmenus there are with an ID.
        // Used for managing events that are bound to $(document)
        this.id = (parseInt($('.popupmenu-wrapper').length, 10)+1).toString();
      },

      //Add markip including Aria
      addMarkup: function () {
        var id;

        switch(typeof this.settings.menu) {
          case 'string': // ID Selector
            id = this.settings.menu;
            this.menu = $('#' + this.settings.menu);
            break;
          case 'object': // jQuery Object
            if (this.settings.menu === null) {
              this.menu = this.element.next('.popupmenu');
            } else {
              this.menu = $(this.settings.menu);
            }

            id = this.menu.attr('id');
            if (!id || id === '') {
              this.menu.attr('id', 'popupmenu-' + this.id);
              id = this.menu.attr('id');
            }
            break;
        }

        //Reuse Same menu
        if (this.menu.parent().is('.popupmenu-wrapper')) {
          return;
        }

        if (this.menu.length === 0) {
          return false;
        }

        // if the menu is deeply rooted inside the markup, detach it and append it to the <body> tag
        // to prevent containment issues.
        if (this.menu.parent().not('body').length > 0) {
          this.originalParent = this.menu.parent();
          this.menu.detach().appendTo('body');
        }

        this.menu.addClass('popupmenu')
          .attr('role', (this.settings.ariaListbox ? 'listbox' : 'menu'))
          .wrap('<div class="popupmenu-wrapper"></div>');

        //Enforce Correct Modality
        this.menu.parent('.popupmenu-wrapper').attr('role', 'application').attr('aria-hidden', 'true');

        // Wrap submenu ULs in a 'wrapper' to help break it out of overflow.
        this.menu.find('.popupmenu').each(function(i, elem) {
          var popup = $(elem);

          if (!(popup.parent().hasClass('wrapper'))) {
            popup.wrap('<div class="wrapper"></div>');
          }

        });

        // If action button menu, append arrow markup
        var containerClass = this.element.parent().attr('class');
        if (containerClass !== undefined &&
           (this.element.hasClass('btn-actions') ||
            this.element.closest('.toolbar').length > 0 ||
            this.element.closest('.masthead').length > 0 ||
            containerClass.indexOf('more') >= 0 ||
            containerClass.indexOf('btn-group') >= 0)) {

          var arrow = $('<div class="arrow"></div>'),
            wrapper = this.menu.parent('.popupmenu-wrapper');

          wrapper.addClass('bottom').append(arrow);
        }

        // If button is part of a header/masthead or a container using the "alternate" UI color, add the "alternate" class.
        if (containerClass !== undefined &&
          (this.element.closest('.masthead').length > 0)) {
          this.menu.parent('.popupmenu-wrapper').addClass('alternate');
        }

        //TODO: Follow up 'button expanded' in JAWS
        this.element.attr('aria-haspopup', true);
        this.element.attr('aria-controls', id);

        this.menu.find('li').attr('role', 'presentation');
        this.menu.find('.popupmenu').parent().parent().addClass('submenu');
        this.menu.find('.submenu').children('a').each(function(i, value) {
          var item = $(value);

          if (item.find('span').length === 0) {
            var text = $(item).text();
            item.html('<span>' + text + '</span>');
          }
          if (item.find('svg.arrow').length === 0) {
            item.append('<svg class="icon arrow icon-dropdown" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></svg>');
          }
          item.attr('aria-haspopup', 'true');

        });

        var anchor = this.menu.find('a'),
          isTranslate = this.menu.hasClass('is-translate');

        anchor.attr('tabindex', '-1').attr('role', (this.settings.ariaListbox ? 'option' : 'menuitem'));

        //Add Checked indication
        anchor.each(function () {
          var a = $(this);

          if (isTranslate) {//is-translate
            var span = $('span', a);
            span.text(Locale.translate(span.text()) || span.text());
          }

          if (a.parent().hasClass('is-checked')) {
            a.attr({'role': 'menuitemcheckbox', 'aria-checked': 'true'});
          }
          if (a.parent().hasClass('is-not-checked')) {
            a.attr({'role': 'menuitemcheckbox', 'aria-checked': 'false'});
          }
        });

        this.menu.find('li.is-disabled a, li.disabled a').attr('tabindex', '-1').attr('disabled', 'disabled');
      },

      handleEvents: function() {
        var self = this;

        if (this.settings.trigger === 'click' || this.settings.trigger === 'toggle') {
         this.element.onTouchClick('popupmenu')
          .offTouchClick('popupmenu')
          .off('click.popupmenu')
          .on('click.popupmenu', function (e) {
            if (self.element.is(':disabled')) {
              return;
            }

            if (self.menu.hasClass('is-open')){
              self.close();
            } else {
              self.open(e);
            }
          });
        }
        //settings.trigger
        if (this.settings.trigger === 'rightClick') {
          this.menu.parent().on('contextmenu.popupmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });

          this.element.on('contextmenu.popupmenu', function (e) {
            e.preventDefault();
            return false;
          }).on('mousedown.popupmenu', function (e) {
            if (e.button === 2) {
              self.open(e);
              e.stopPropagation();
            }
          });

          //Add an Audible Label
          var id = 'popupmenu-f10-label';
          if ($('#'+id).length === 0) {
            this.element.after('<span style="display:none;" id="' + id + '">' + Locale.translate('PressShiftF10') + '</span>');
          }
          //PressShiftF10
          this.element.attr('aria-describedby', id);
        }

        if (this.settings.trigger === 'immediate') {
          this.open(this.settings.eventObj);
        }

        this.element.on('keydown.popupmenu', function (e) {
          if (e.shiftKey && e.which === 121) {  //Shift F10
            self.open(e, true);
          }
        });

        self.element.on('selected', function (e, link) {
          if(self.element.hasClass('btn-filtering')) {
            self.iconFilteringUpdate(link);
            e.preventDefault();
          }
        });

      },

      handleKeys: function () {
        var self = this;
        //http://access.aol.com/dhtml-style-guide-working-group/#popupmenu

        //Handle Events in Anchors
        this.menu.onTouchClick('popupmenu', 'a')
          .on('click.popupmenu', 'a', function (e) {

          var anchor = $(this),
            href = anchor.attr('href');

          if (anchor.parent().is('.submenu') || anchor.parent().is('.is-disabled')) {
            //Do not close parent items of submenus on click
            return;
          }

          if (anchor.find('input[checkbox]').length > 0) {
            return;
          }

          self.element.trigger('selected', [anchor]);
          self.close();

          if (self.element.is('.autocomplete')) {
            return;
          }

          if (href && href.charAt(0) !== '#') {
            if (anchor.attr('target') === '_blank') {
              window.open(href, '_blank');
            } else {
              window.location.href = href;
            }
            return true;
          }

          e.preventDefault();
          e.stopPropagation();
        });

        var excludes = 'li:not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)';
        //Select on Focus
        if (this.settings.mouseFocus) {
          this.menu.on('mouseenter.popupmenu', 'a', function () {
            $(this).focus();
          });
        }

        $(document).off('keydown.popupmenu.' + this.id).on('keydown.popupmenu.' + this.id, function (e) {
          var key = e.which,
            focus;

          //Close on escape
          if (key === 27) {
            self.close(true);
          }

          if (key === 9) {
            self.close(true);
          }

          //Select Checkboxes
          if (key === 32) {
            $(e.target).find('input:checkbox').trigger('click');
          }

          focus = self.menu.find(':focus');

          //Right Close Submenu
          if (key === 37) {
            e.preventDefault();
            if (focus.closest('.popupmenu')[0] !== self.menu[0] && focus.closest('.popupmenu').length > 0) {
              focus.closest('.popupmenu').removeClass('is-open').parent().prev('a').focus();
              focus.closest('.popupmenu').removeClass('is-open').parent().parent().removeClass('is-submenu-open');
            }
          }

          //Up on Up
          if (key === 38) {
             e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().prevAll(excludes).length === 0) {
              self.menu.children(excludes).last().find('a').focus();
              return;
            }
            focus.parent().prevAll(excludes).first().find('a').focus();
          }

          //Right Open Submenu
          if (key === 39) {
            e.preventDefault();
            if (focus.parent().hasClass('submenu')) {
              self.showSubmenu(focus.parent());
              focus.parent().find('.popupmenu a:first').focus();
            }
          }

          //Down
          if (key === 40) {
            e.preventDefault();
            //Go back to Top on the last one
            if (focus.parent().nextAll(excludes).length === 0) {
              if (focus.length === 0) {
                self.menu.children(excludes).first().find('a').focus();
              } else {
                focus.closest('.popupmenu').children(excludes).first().find('a').focus();
              }
              return;
            }
            focus.parent().nextAll(excludes).first().find('a').focus();
          }
        });
      },

      // Filtering icon initial setup
      iconFilteringSetup: function(alink) {
        if (this.element.hasClass('btn-filtering')) {
          var icon = $('use', this.element),
            link = alink || $('li:first a', this.menu);

          if(!icon.length) {
            this.element.append($('<svg class="icon icon-filter" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg>'));
            icon = $('use', this.element);
          }
          $('use', this.element).attr('xlink:href', $('use', link).attr('xlink:href'));
        }
      },

      // Filtering icon update
      iconFilteringUpdate: function(alink) {
        if (this.element.hasClass('btn-filtering')) {
          var link = alink || $('li:first a', this.menu);

          $('use', this.element).attr('xlink:href', $('use', link).attr('xlink:href'));
        }
      },

      position: function(e) {
        var target = (e ? $(e.target) : this.element),
          wrapper = this.menu.parent('.popupmenu-wrapper'),
          menuWidth = this.menu.outerWidth(),
          menuHeight = this.menu.outerHeight(),
          xOffset = this.element.hasClass('btn-actions') ? (menuWidth) - 34 : 0;

        if (this.settings.trigger === 'rightClick' || (e !== null && e !== undefined && this.settings.trigger === 'immediate')) {
          wrapper.css({'left': (e.type === 'keypress' || e.type === 'keydown' ? target.offset().left : e.pageX) - xOffset,
                        'top': (e.type === 'keypress' || e.type === 'keydown' ? target.offset().top : e.pageY) });
        } else {
          wrapper.css({'left': target.offset().left - (wrapper.parent().length ===1 ? wrapper.offsetParent().offset().left : 0) - xOffset,
                        'top': target.offset().top + 10 - (wrapper.parent().length > 1 ? wrapper.parent().offset().top: 0) + target.outerHeight() });
        }

        //Handle Case where menu is off bottom
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          if (this.element.is(':not(.autocomplete)')) {
            wrapper.css({'top': ($(window).height() + $(document).scrollTop()) - menuHeight});

            if (this.element.is('.btn-menu')) {
              //move on top and change arrow
              wrapper.css({'top': target.offset().top - menuHeight});
              wrapper.removeClass('bottom').addClass('top');
            }

            //Did it fit?
            if ((wrapper.offset().top - $(document).scrollTop()) < 0) {
              wrapper.css('top', 0);
              wrapper.css('top', $(document).scrollTop() + (wrapper.offset().top * -1));
              menuHeight = wrapper.outerHeight();
            }
          }

          // Do one more check to see if the bottom edge bleeds off the screen.
          // If it does, shrink the menu's Y size.
          if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
            var differenceX = (wrapper.offset().top + menuHeight) - ($(window).height() + $(document).scrollTop());
            menuHeight = menuHeight - differenceX - 32;
            this.menu.height(menuHeight);
          }
        }

        //Handle Case where menu is off the right
        if ((wrapper.offset().left + menuWidth) > $(window).width()) {
          wrapper.css({'left': $(window).width() - menuWidth - ($(window).width() - target.offset().left) + target.outerWidth()});
          wrapper.find('div.arrow').css({'left': 'auto', 'right': '10px'});
        }

        wrapper.find('.arrow').removeAttr('style');

        //Handle Case where menu is off the left
        if (wrapper.offset().left < 0) {
          wrapper.css({'left': this.element.offset().left});

          //move the arrow - might need better logic here.
          wrapper.find('.arrow').css({'left': '20px', 'right': 'unset'});
          this.menu.css('overflow', 'hidden');
        }

        if (this.element.hasClass('btn-menu')) {
          if (this.element.closest('.toolbar').length === 0) { // button is standalone
            //move the arrow - might need better logic here.
            wrapper.find('div.arrow').css('left', '25%');
          } else { // button exists inside toolbar
            wrapper.find('div.arrow').css({'left': '18px'});

            if (this.element.closest('.buttonset').length > 0 ) {
              wrapper.css({'left': (target.offset().left + target.outerWidth() + 5) - menuWidth});
              wrapper.find('div.arrow').css({'left': 'auto', 'right': '10px'});
            }
          }
        }

      },

      open: function(e) {
        var self = this;
        this.element.trigger('beforeOpen', [this.menu]);

        $('.popupmenu').not(this.menu).removeClass('is-open');  //close others.
        this.element.addClass('is-open');
        this.menu.addClass('is-open').attr('aria-hidden', 'false');

        self.position(e);

        if (this.element.closest('.header').length > 0) {
          this.menu.parent().css('z-index', '9001');
        }

        //Close on Document Click ect..
        setTimeout(function () {
          $(document).on('touchend.popupmenu.' + this.id +' click.popupmenu.' + this.id, function (e) {
            if (e.button === 2) {
              return;
            }

            //Click functionality will toggle the menu - otherwise it closes and opens
            if ($(e.target).is(self.element)) {
              return;
            }

            if ($(e.target).closest('.popupmenu').length === 0) {
              self.close();
            }
          });

          $(window).on('scroll.popupmenu resize.popupmenu', function () {
            self.close();
          });

          $('.scrollable').on('scroll.popupmenu', function () {
            self.close();
          });

          self.element.triggerHandler('open', [self.menu]);
          self.element.on('click.popupmenu touchend.popupmenu', function () {
            self.close();
          });

        }, 0);

        //Hide on iFrame Clicks - only works if on same domain
        $('iframe').each(function () {
          var frame = $(this);
          frame.ready(function () {

            try {
              frame.contents().find('body').on('click.popupmenu', function () {
                self.close();
              });
            } catch (e)  {
              //Ignore security errors on out of iframe
            }

          });
        });

        this.handleKeys();

        //hide and decorate submenus - we use a variation on
        var tracker = 0, startY, menuToClose, timeout;

        self.menu.find('.popupmenu').removeClass('is-open');
        self.menu.on('mouseenter.popupmenu touchstart.popupmenu', '.submenu', function (e) {
          var menuitem = $(this);
          startY = e.pageX;

          clearTimeout(timeout);
          timeout = setTimeout(function () {
            self.showSubmenu(menuitem);
          }, 300);

          $(document).on('mousemove.popupmenu.' + this.id, function (e) {
            tracker = e.pageX;
          });
        }).on('mouseleave.popupmenu', '.submenu', function () {
          $(document).off('mousemove.popupmenu.' + this.id);

          menuToClose = $(this).find('ul');

          var isLeft = parseInt(menuToClose.parent('.wrapper').css('left')) < 0,
            canClose = (tracker - startY) < 3.5;

          if (isLeft) {
            canClose = (tracker - startY) >= 0;
          }

          if (canClose) { //We are moving slopie to the menu
            menuToClose.removeClass('is-open').removeAttr('style');
            menuToClose.parent('.wrapper').removeAttr('style');
            menuToClose.parent().parent().removeClass('is-submenu-open');
            self.element.removeClass('is-open');
          }
          clearTimeout(timeout);
        });

        if (self.settings.autoFocus) {
          setTimeout(function () {
            self.menu.children('li:not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)').first().find('a').focus();
          }, 1);
        }
      },

      showSubmenu: function (li) {
        var wrapper = li.children('.wrapper').filter(':first');

        // Wrap if not wrapped (dynamic menu situation)
        if (wrapper.length === 0) {
          var ul = li.children('ul').filter(':first');
          ul.wrap('<div class="wrapper"></div>');
          wrapper = ul.parent();
        }


        var menu = wrapper.children('.popupmenu'),
          mainWrapperOffset = li.parents('.popupmenu-wrapper:first').offset().top;
        li.parent().find('.popupmenu').removeClass('is-open').removeAttr('style');

        wrapper.css({
          'left': li.position().left + li.outerWidth(),
          'top': (parseInt(li.position().top) - 11) + 'px'
        }).children('.popupmenu').addClass('is-open');

        //Handle Case where the menu is off to the right
        var menuWidth = menu.outerWidth();
        if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
          wrapper.css('left', -9999);
          menuWidth = menu.outerWidth();
          wrapper.css('left', li.position().left - menuWidth);
          //Did it fit?
          if (wrapper.offset().left < 0) {
            //No. Push the menu's left offset onto the screen.
            wrapper.css('left', li.position().left - menuWidth + Math.abs(wrapper.offset().left) + 40);
            menuWidth = menu.outerWidth();
          }
          // Do one more check to see if the right edge bleeds off the screen.
          // If it does, shrink the menu's X size.
          if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
            var differenceY = (wrapper.offset().left + menuWidth) - ($(window).width() + $(document).scrollLeft());
            menuWidth = menuWidth - differenceY;
            menu.width(menuWidth);
          }
        }

        //Handle Case where menu is off bottom
        var menuHeight = menu.outerHeight();
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          // First try bumping up the menu to sit just above the bottom edge of the window.
          var bottomEdgeCoord = wrapper.offset().top + menuHeight,
            differenceFromBottomY = bottomEdgeCoord - ($(window).height() + $(document).scrollTop());
          wrapper.css('top', wrapper.position().top - differenceFromBottomY);

          // Does it fit?
          if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
            // No. Bump the menu up higher based on the menu's height and the extra space from the main wrapper.
            wrapper.css('top', ($(window).height() + $(document).scrollTop()) - menuHeight - mainWrapperOffset);
          }

          // Does it fit now?
          if ((wrapper.offset().top - $(document).scrollTop()) < 0) {
            // No. Push the menu down onto the screen from the top of the window edge.
            wrapper.css('top', 0);
            wrapper.css('top', (wrapper.offset().top * -1));
            menuHeight = menu.outerHeight();
          }
          // Do one more check to see if the bottom edge bleeds off the screen.
          // If it does, shrink the menu's Y size and make it scrollable.
          if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
            var differenceX = (wrapper.offset().top + menuHeight) - ($(window).height() + $(document).scrollTop());
            menuHeight = menuHeight - differenceX - 32;
            menu.height(menuHeight);
          }
        }

        li.parent().find('.is-submenu-open').removeClass('is-submenu-open');
        li.addClass('is-submenu-open');
      },

      detach: function () {
        $(document).off('click.popupmenu touchend.popupmenu keydown.popupmenu');
        $(window).off('scroll.popupmenu resize.popupmenu');
        $('.scrollable').off('scroll.popupmenu');

        this.menu.off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');

        $('iframe').each(function () {
          var frame = $(this);
          try {
            frame.contents().find('body').off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');
          } catch (e) {
            //Ignore security errors on out of iframe
          }
        });
      },

      close: function (isCancelled) {
        if (!isCancelled || isCancelled === undefined) {
          isCancelled = false;
        }

        this.menu.removeClass('is-open').attr('aria-hidden', 'true').css({'height': '', 'width': ''});
        this.menu.parent('.popupmenu-wrapper').css({'left': '-999px', 'height': '', 'width': ''});
        this.menu.find('.submenu').off('mouseenter mouseleave').removeClass('is-submenu-open');
        this.menu.find('.popupmenu').css({'left': '', 'top': '', 'height': '', 'width': ''});

        this.element.on('close.popupmenu', function (e) {
          $(this).off('close.popupmenu');
          e.stopPropagation();
        }); //do not propapagate events to parent

        // Close all events
        $(document).off('keydown.popupmenu.' + this.id + ' click.popupmenu.' + this.id + ' mousemove.popupmenu.' + this.id);
        this.menu.off('click.popupmenu touchend.popupmenu touchcancel.popupmenu mouseenter.popupmenu mouseleave.popupmenu');

        this.element.removeClass('is-open').trigger('close', [isCancelled]);
        this.detach();

        if (this.settings.trigger === 'immediate') {
          this.destroy();
        }
      },

      teardown: function() {
        this.menu.parent().off('contextmenu.popupmenu');
        if (this.element.hasClass('btn-actions')) {
          this.menu.parent().removeClass('bottom').find('.arrow').remove();
        }
        if (this.originalParent) {
          this.menu.detach().appendTo(this.originalParent);
        }
        this.menu.find('.submenu').children('a').each(function(i, item) {
          var text = $(item).find('span').text();
          $(item).find('span, svg').remove();
          $(item).text(text);
        });

        function unwrapPopup(menu) {
          if (menu.parent().is('.popupmenu-wrapper')) {
            menu.unwrap();
          }
        }

        unwrapPopup(this.menu);
        this.menu.find('.popupmenu').each(function() {
          unwrapPopup($(this));
        });

        this.detach();
        this.element
          .removeAttr('aria-controls')
          .removeAttr('aria-haspopup')
          .off('touchend.popupmenu touchcancel.popupmenu click.popupmenu keypress.popupmenu contextmenu.popupmenu mousedown.popupmenu');

        return this;
      },

      updated: function() {
        this.teardown().init();
      },

      destroy: function() {
        this.teardown();
        this.menu.trigger('destroy');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new PopupMenu(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
