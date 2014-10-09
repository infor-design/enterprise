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

  $.fn.popupmenu = function( options, callback ) {

    // Settings and Options
    var pluginName = 'popupmenu',
      defaults = {
        menuId: null,  //Menu's Id
        trigger: 'click',  //click, rightClick, immediate
        autoFocus: false
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.configureOptions();
        this.addMarkup();
        this.handleEvents();
      },

      configureOptions: function () {
        //Backwards Compat
        if (settings.invokeMethod) {
          settings.trigger = settings.invokeMethod;
        }
        if (settings.menu) {
          settings.menuId = settings.menu;
        }
      },

      //Add markip including Aria
      addMarkup: function () {
        var id = settings.menuId;

        this.menu = $('#' + settings.menuId);
        //Use Next Element if no Id
        if (!settings.menuId) {
          this.menu = this.element.next('.popupmenu');
          this.menu.attr('id', 'popupmenu-'+ (parseInt($('.popupmenu').length, 10)+1).toString());
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
            $(item).append('<svg class="icon arrow"><use xlink:href="#icon-dropdown-arrow"></svg>');
          }
        });
        this.menu.find('a').attr('tabindex', '-1').attr('role', 'menuitem');
        this.menu.find('li.is-disabled a, li.disabled a').attr('tabindex', '-1').attr('disabled', 'disabled');
      },

      handleEvents: function() {
        var self = this;

        if (settings.trigger === 'click' || settings.trigger === 'toggle') {
          this.element.on('click.popupmenu', function (e) {
            if (self.menu.hasClass('is-open')){
              self.close();
            } else {
              self.open(e);
            }
          });
        }
        //settings.trigger
        if (settings.trigger === 'rightClick') {
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

        this.element.on('keypress.popupmenu', function (e) {
          if (settings.trigger === 'rightClick' && e.shiftKey && e.keyCode === 121) {  //Shift F10
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

          self.close();
          //Not a very usefull call back use closed events
          if (callback && href) {
            callback(href.substr(1), self.element , self.menu.offset(), $(this));
          }

          self.element.trigger('selected', [anchor]);

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
              focus.closest('.popupmenu').removeClass('is-open').prev('a').focus();
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

        if (settings.trigger === 'rightClick') {
          wrapper.css({'left': (e.type === 'keypress' ? target.offset().left : e.pageX),
                        'top': (e.type === 'keypress' ? target.offset().top : e.pageY)});
        } else {
          wrapper.css({'left': target.offset().left - (wrapper.parent().length ===1 ? wrapper.offsetParent().offset().left : 0),
                        'top': target.offset().top - (wrapper.parent().length >1 ? wrapper.parent().offset().top: 0) + target.outerHeight() + (target.css('box-shadow') ? 2 : 0)});
        }

        //Handle Case where menu is off bottom
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          wrapper.css({'top': $(window).height() - menuHeight - ($(window).height() - target.offset().top)});

          //Did it fit?
          if (wrapper.offset().top < 0) {
            //No so see if more room on top or bottom and shrink
            if (target.offset().top > $(window).height() - target.offset().top + target.outerWidth) {
              //fits on top
            } else {
              //shrink to bottom
              wrapper.css({'left': target.offset().left - (wrapper.parent().length === 1 ? wrapper.parent().offset().left : 0),
                            'top': target.offset().top - (wrapper.parent().length >1 ? wrapper.parent().offset().top: 0) + target.outerHeight()});
              menuHeight = $(window).outerHeight() - (wrapper.offset().top + 45);
              wrapper.height(menuHeight);
              this.menu.height(menuHeight);
              //Note: 45 gives some space on the bottom
            }
          }
        }
        //Handle Case where menu is off left side
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
        self.menu.find('.submenu').on('mouseenter', function (e) {
          var menuitem = $(this);
          startY = e.pageX;

          clearTimeout(timeout);
          timeout = setTimeout(function () {
            self.showSubmenu(menuitem);
          }, 300);

          $(document).on('mousemove.popupmenu', function (e) {
            tracker = e.pageX;
          });
        }).on('mouseleave', function () {
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
        var menu = li.find('ul:first'),
          wrapper = li.children('.wrapper');
        li.parent().find('.popupmenu').removeClass('is-open');

        menu.addClass('is-open');
        wrapper.css({left: 0, top: 0});
        wrapper.css('width','');
        wrapper.css('width', menu.outerWidth()+1);
        wrapper.css({'left': li.outerWidth(), 'top': li.outerHeight()*(li.parent().index()-1)});

        //Handle Case where the menu is off to the right
        var menuWidth = menu.outerWidth();
        if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
          wrapper.css('left', 0 - menuWidth);
          //Did it fit?
          if (wrapper.offset().left < 0) {
            //No. Push the menu's left offset onto the screen
            wrapper.css('left', parseInt(wrapper.css('left')) + Math.abs(wrapper.offset().left));
            menuWidth = menu.outerWidth();
            //Does it fit now?
            if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
              //No, cut off the menu's right side until it fits within the right screen boundary
              var differenceY = (wrapper.offset().left + menuWidth) - ($(window).width() + $(document).scrollLeft());
              menuWidth = menuWidth - differenceY;
              menu.width(menuWidth);
              wrapper.width(menuWidth);
            }
          }
        }

        //Handle Case where menu is off bottom
        var menuHeight = menu.outerHeight();
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          wrapper.css('top', 0 - menuHeight);
          //Did it fit?
          if (wrapper.offset().top < 0) {
            //No. Push the menu's top offset onto the screen
            wrapper.css('top', parseInt(wrapper.css('top')) + Math.abs(wrapper.offset().top));
            menuHeight = menu.outerHeight();
            //Does it fit now?
            if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
              //No, cut off the menu's bottom edge until it fits within the bottom screen boundary
              var differenceX = (wrapper.offset().top + menuHeight) - ($(window).height() + $(document).scrollTop());
              menuHeight = menuHeight - differenceX - 32;
              menu.height(menuHeight);
              wrapper.height(menuHeight);
            }
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

        this.element.trigger('close.popupmenu');
        this.element.focus().attr('aria-expanded', 'false');
        this.detach();

        if (settings.trigger === 'immediate') {
          this.destroy();
        }
      },

      destroy: function() {
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
        this.element.off('click.popupmenu keypress.popupmenu contextmenu.popupmenu mousedown.popupmenu');
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
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
