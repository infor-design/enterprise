/**
* Responsive Popup Menu Control (Context)
* @name popupmenu
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

  $.fn.popupmenu = function(options, callback) {

    // Settings and Options
    var pluginName = 'popupmenu',
      defaults = {
        menuId: null,  //Menu's Id
        trigger: 'click',  //click, rightClick, immediate
        autoFocus: false
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function PopupMenu(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    PopupMenu.prototype = {
      init: function() {
        this.addMarkup();
        this.handleEvents();
      },

      //Add markip including Aria
      addMarkup: function () {
        var id = settings.menuId;

        this.menu = $('#' + settings.menuId);
        //Use Next Element if no Id
        if (!settings.menuId) {
          this.menu = this.element.next('.popupmenu');
          this.menu.attr('id', 'popupmenu-'+ (parseInt($('.popupmenu-wrapper').length, 10)+1).toString());
          id = this.menu.attr('id');
        }

        // if the menu is deeply rooted inside the markup, detach it and append it to the <body> tag
        // to prevent containment issues.
        if (this.menu.parent().not('body').length > 0) {
          this.originalParent = this.menu.parent();
          this.menu.detach().appendTo('body');
        }

        this.menu.addClass('popupmenu')
          .attr('role', 'menu').attr('aria-hidden', 'true')
          .wrap('<div class="popupmenu-wrapper"></div>');

        // Wrap submenu ULs in a 'wrapper' to help break it out of overflow.
        this.menu.find('.popupmenu').each(function(i, elem) {
          if (!($(elem).parent().hasClass('wrapper'))) {
            $(elem).wrap('<div class="wrapper"></div>');
          }
        });

        //TODO: Follow up 'button expanded' in JAWS
        this.element.attr('aria-haspopup', true)
          .attr('aria-expanded', 'false')
          .attr('aria-owns', id);

        this.menu.find('li').attr('role', 'presentation');
        this.menu.find('.popupmenu').parent().parent().addClass('submenu');
        this.menu.find('.submenu').children('a').each(function(i, item) {
          if ($(item).find('span').length === 0) {
            var text = $(item).text();
            $(item).html('<span>' + text + '<span>');
          }
          if ($(item).find('svg.arrow').length === 0) {
            $(item).append('<svg class="icon arrow"><use xlink:href="#icon-dropdown"></svg>');
          }
        });
        this.menu.find('a').attr('tabindex', '-1').attr('role', 'menuitem');
        this.menu.find('li.is-disabled a, li.disabled a').attr('tabindex', '-1').attr('disabled', 'disabled');
      },

      handleEvents: function() {
        var self = this;

        if (settings.trigger === 'click' || settings.trigger === 'toggle') {
          this.element.on('click.popupmenu', function (e) {
            $(this).focus();
            if (self.menu.hasClass('is-open')){
              self.close();
            } else {
              self.open(e);
            }
          });
        }
        //settings.trigger
        if (settings.trigger === 'rightClick') {
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
            }
            e.stopPropagation();
          });
        }

        if (settings.trigger === 'immediate') {
          this.open();
        }

        this.element.on('keydown.popupmenu', function (e) {
          if (e.shiftKey && e.which === 121) {  //Shift F10
            self.open(e, true);
          }
        });
      },

      handleKeys: function () {
        var self = this;
        //http://access.aol.com/dhtml-style-guide-working-group/#popupmenu

        //Handle Events in Anchors
        this.menu.on('click.popmenu', 'a', function (e) {
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

          //Not a very usefull call back use closed events
          if (callback && href) {
            callback(href.substr(1), self.element , self.menu.offset(), $(this));
          }

          if (self.element.is('.autocomplete')) {
            return;
          }

          if (href && href.charAt(0) !== '#') {
            return true;
          }
          e.preventDefault();
        });

        $(document).on('keydown.popupmenu', function (e) {
          var key = e.which,
            focus,
            excludes = 'li:not(.separator):not(.group):not(.is-disabled)';

          //Close on escape
          if (key === 27) {
            self.close();
          }

          if (key === 9) {
            self.close();
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
            }
          }

          //Up on Up
          if (key === 38) {
             e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().prevAll(excludes).length === 0) {
              self.menu.parent().find(excludes).last().find('a').focus();
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
                self.menu.parent().find(excludes).first().find('a').focus();
              } else {
                focus.closest('.popupmenu').find(excludes).first().find('a').focus();
              }
              return;
            }
            focus.parent().nextAll(excludes).first().find('a').focus();
          }
        });
      },

      position: function(e) {
        var target = (e ? $(e.target) : this.element),
          wrapper = this.menu.parent('.popupmenu-wrapper'),
          menuWidth = this.menu.outerWidth(),
          menuHeight = this.menu.outerHeight();

        if (settings.trigger === 'rightClick' || (e !== null && e !== undefined && settings.trigger === 'immediate')) {
          wrapper.css({'left': (e.type === 'keypress' || e.type === 'keydown' ? target.offset().left : e.pageX),
                        'top': (e.type === 'keypress' || e.type === 'keydown' ? target.offset().top : e.pageY)});
        } else {
          wrapper.css({'left': target.offset().left - (wrapper.parent().length ===1 ? wrapper.offsetParent().offset().left : 0),
                        'top': target.offset().top - (wrapper.parent().length > 1 ? wrapper.parent().offset().top: 0) + target.outerHeight()});
        }

        //Handle Case where menu is off bottom
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          if (this.element.is(':not(.autocomplete)')) {
            wrapper.css({'top': ($(window).height() + $(document).scrollTop()) - menuHeight});

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

        //Handle Case where menu is off the bottom
        if ((wrapper.offset().left + menuWidth) > $(window).width()) {
          wrapper.css({'left': $(window).width() - menuWidth - ($(window).width() - target.offset().left) + target.outerWidth()});
        }
      },

      open: function(e) {
        var self = this;
        this.element.trigger('beforeOpen', [this.menu]);

        $('.popupmenu').not(this.menu).removeClass('is-open');  //close others.
        this.menu.addClass('is-open').attr('aria-hidden', 'false');
        self.position(e);

        //Close on Document Click ect..
        setTimeout(function () {
          $(document).on('click.popupmenu', function (e) {
            if (e.button === 2) {
              return;
            }

            if ($(e.target).closest('.popupmenu').length === 0) {
              self.close();
            }
          });

          $(window).on(' scroll.popupmenu resize.popupmenu', function () {
            self.close();
          });
          self.element.trigger('open', [self.menu]);
        }, 400);

        //Hide on iFrame Clicks
        $('iframe').ready(function () {
          $('iframe').contents().find('body').on('click.popupmenu', function () {
            self.close();
          });
        });

        this.handleKeys();
        this.element.attr('aria-expanded', 'true');

        //hide and decorate submenus - we use a variation on
        var tracker = 0, startY, menuToClose, timeout;

        self.menu.find('.popupmenu').removeClass('is-open');
        self.menu.on('mouseenter', '.submenu', function (e) {
          var menuitem = $(this);
          startY = e.pageX;

          clearTimeout(timeout);
          timeout = setTimeout(function () {
            self.showSubmenu(menuitem);
          }, 300);

          $(document).on('mousemove.popupmenu', function (e) {
            tracker = e.pageX;
          });
        }).on('mouseleave', '.submenu', function () {
          $(document).off('mousemove.popupmenu');

          menuToClose = $(this).find('ul');

          if ((tracker - startY) < 3.5) { //We are moving slopie to the menu
            menuToClose.removeClass('is-open').removeAttr('style');
            menuToClose.parent('.wrapper').removeAttr('style');
          }
          clearTimeout(timeout);
        });

        if (settings.autoFocus) {
          self.menu.find('li:not(.separator):not(.group):not(.is-disabled)').first().find('a').focus();
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
          'top': li.position().top
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
            wrapper.css('left', 0);
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
      },

      detach: function () {
        $(document).off('click.popupmenu keydown.popupmenu');
        $(window).off('scroll.popupmenu resize.popupmenu');
        this.menu.off('click.popmenu');
        $('iframe').contents().find('body').off('click.popupmenu');
      },

      close: function () {
        this.menu.removeClass('is-open').attr('aria-hidden', 'true').css({'height': '', 'width': ''});
        this.menu.parent('.popupmenu-wrapper').css({'left': '-999px', 'height': '', 'width': ''});
        this.menu.find('.submenu').off('mouseenter mouseleave');
        this.menu.find('.popupmenu').css({'left': '', 'top': '', 'height': '', 'width': ''});

        this.element.on('close.popupmenu', function (e) {
          $(this).off('close.popupmenu');
          e.stopPropagation();
        }); //do not propapagate events to parent

        this.element.trigger('close');
        this.element.focus().attr('aria-expanded', 'false');
        this.detach();

        if (settings.trigger === 'immediate') {
          this.destroy();
        }
      },

      destroy: function() {
        this.menu.parent().off('contextmenu.popupmenu');
        if (this.originalParent) {
          this.menu.detach().appendTo(this.originalParent);
        }
        this.menu.find('.submenu').children('a').each(function(i, item) {
          var text = $(item).find('span').text();
          $(item).find('span, svg').remove();
          $(item).text(text);
        });
        this.menu.unwrap().find('.popupmenu').unwrap();
        $.removeData(this.element[0], pluginName);
        this.detach();
        this.element
          .removeAttr('aria-owns')
          .removeAttr('aria-expanded')
          .removeAttr('aria-haspopup')
          .off('click.popupmenu keypress.popupmenu contextmenu.popupmenu mousedown.popupmenu');
        this.menu.trigger('destroy.popupmenu');
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new PopupMenu(this, settings));
      }
    });
  };

}));
