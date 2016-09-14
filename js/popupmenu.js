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
        attachToBody: false,
        beforeOpen: null, //Ajax callback for open event
        ariaListbox: false,   //Switches aria to use listbox construct instead of menu construct (internal)
        eventObj: undefined  //Can pass in the event object so you can do a right click with immediate
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function PopupMenu(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.isIe11 = $('html').is('.ie11');
      this.init();
    }

    // Plugin Object
    PopupMenu.prototype = {
      init: function() {
        this.setup();
        this.addMarkup();
        this.handleEvents();
        this.iconFilteringSetup();
        this.fixSvg();
      },

      isRTL: function() {
        return $('html').attr('dir') === 'rtl';
      },

      fixSvg: function () {
        // Fix: chrome was not showing icons had to resets [xlink:href] attribute
        var self = this,
            isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

        if (!isChrome) {
          return;
        }

        setTimeout(function() {
          self.menu.find('svg.icon').each(function() {
            var use = $('use', this);
            use.attr('xlink:href', use.attr('xlink:href'));
          });
        }, 0);
      },

      setup: function() {
        if (this.element.attr('data-popupmenu') && !this.settings.menu) {
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
        if (!this.id) {
          this.id = (parseInt($('.popupmenu-wrapper').length, 10)+1).toString();
        }
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
        // to prevent containment issues. (Now a Preference)
        if (this.settings.attachToBody && this.menu.parent().not('body').length > 0) {
          this.originalParent = this.menu.parent();
          this.menu.detach().appendTo('body');
        }

        this.menu.addClass('popupmenu')
          .data('trigger', this.element)
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

        // If a button with no border append arrow markup
        var containerClass = this.element.parent().attr('class');
        if ((this.element.hasClass('btn-menu') ||
            this.element.hasClass('btn-actions') ||
            this.settings.menu === 'colorpicker-menu' ||
            this.element.closest('.toolbar').length > 0 ||
            this.element.closest('.masthead').length > 0 ||
            this.element.is('.searchfield-category-button') ||
            (containerClass && containerClass.indexOf('more') >= 0 && this.element.is(':not(.tab-more)')) ||
            containerClass && containerClass.indexOf('btn-group') >= 0)) {

          var arrow = $('<div class="arrow"></div>'),
            wrapper = this.menu.parent('.popupmenu-wrapper');

          wrapper.addClass('bottom').append(arrow);
        }

        // If inside of a ".field-short" container, make smaller
        if (this.element.closest('.field-short').length) {
          this.menu.addClass('popupmenu-short');
        }

        // If button is part of a header/masthead or a container using the "alternate" UI color, add the "alternate" class.
        if (containerClass !== undefined &&
          (this.element.closest('.masthead').not('.search-results .masthead').length > 0)) {
          this.menu.parent('.popupmenu-wrapper').addClass('alternate');
        }

        this.element.attr('aria-haspopup', true);
        this.element.attr('aria-controls', id);

        this.markupItems();
      },

      markupItems: function () {
        this.menu.find('li').attr('role', 'presentation');
        this.menu.find('.popupmenu').parent().parent().addClass('submenu');
        this.menu.find('.submenu').children('a').each(function(i, value) {
          var item = $(value);

          if (item.find('span').length === 0) {
            var text = $(item).text();
            item.html('<span>' + text + '</span>');
          }

          if (item.find('svg.arrow').length === 0) {
            item.append($.createIconElement({ classes: ['arrow', 'icon-dropdown'], icon: 'dropdown' }));
          }
          item.attr('aria-haspopup', 'true');

        });

        var anchor = this.menu.find('a'),
          isTranslatable = this.menu.hasClass('is-translatable');

        anchor.attr('tabindex', '-1').attr('role', (this.settings.ariaListbox ? 'option' : 'menuitem'));

        //Add Checked indication
        anchor.each(function () {
          var a = $(this);

          if (isTranslatable) {
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
          .on('click.popupmenu', function (e) {

            if (self.element.is(':disabled')) {
              return;
            }

            if (self.element.closest('.listview').length > 0) {
              e.stopPropagation();
              e.preventDefault();
            }

            if (self.menu.hasClass('is-open')){
              self.close();
            } else {
              self.open(e);
            }
          })
          .on('updated.popupmenu', function(e) {
            e.stopPropagation();
            self.updated();
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
            if (e.button === 2 || e.button === 0 && e.ctrlKey) {
              self.open(e);
              e.stopPropagation();
            }
            e.preventDefault();
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
      },

      handleKeys: function () {
        var self = this;
        //http://access.aol.com/dhtml-style-guide-working-group/#popupmenu

        //Handle Events in Anchors
        this.menu.onTouchClick('popupmenu', 'a')
          .on('click.popupmenu', 'a', function (e) {

          var anchor = $(this),
            href = anchor.attr('href'),
            selectionResult = [anchor];

          if (anchor.attr('disabled') || anchor.parent().is('.submenu') || anchor.parent().is('.is-disabled')) {
            //Do not close parent items of submenus on click
            e.preventDefault();
            return;
          }

          if (anchor.find('input[checkbox]').length > 0) {
            return;
          }

          if (self.element.hasClass('btn-filter')) {
            self.iconFilteringUpdate(anchor);
            e.preventDefault();
          }

          if (self.isInSelectableSection(anchor) || self.menu.hasClass('is-selectable') || self.menu.hasClass('is-multiselectable')) {
            selectionResult = self.select(anchor);
          }

          //Single toggle on off of checkbox class
          if (anchor.parent().hasClass('is-toggleable')) {
            anchor.parent().toggleClass('is-checked');
          }

          // Trigger a selected event containing the anchor that was selected
          self.element.trigger('selected', selectionResult);

          // MultiSelect Lists should act like other "multiselect" items and not close the menu when options are chosen.
          if (self.menu.hasClass('is-multiselectable') || self.isInMultiselectSection(anchor)) {
            return;
          }

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
          this.menu.on('mouseenter.popupmenu', 'li', function () {
            self.highlight($(this).children('a'));
          });
        }

        $(document).off('keydown.popupmenu.' + this.id).on('keydown.popupmenu.' + this.id, function (e) {
          var key = e.which,
            focus;

          //Close on escape
          if (key === 27) {
            e.stopPropagation();
            self.close(true);
          }

          if (key === 9) {
            e.stopPropagation();
            self.close(true);
          }

          //Select Checkboxes
          if (key === 32) {
            e.stopPropagation();

            var target = $(e.target),
              checkbox = target.find('input:checkbox');
            if (checkbox.length) {
              checkbox.trigger('click');
              return;
            }

            var a = $();

            // Return here and let Tabs control handle the spacebar
            if (target.is('.tab') || target.parent().is('.tab') || target.is('.tab-more')) {
              // Spacebar acts like Enter if there aren't any checkboxes (trigger links, etc)
              e.preventDefault();
              return;
            }

            if (target.is('li')) {
              a = target.children('a');
            }

            if (target.is('a')) {
              a = target;
            }

            if (a.length) {
              a.trigger('click');
              return;
            }
          }

          focus = self.menu.find(':focus');

          var isPicker = (self.settings.menu === 'colorpicker-menu'),
            isAutocomplete = self.element.is('.autocomplete');

          // Close Submenu
          if (key === 37 && !isAutocomplete) {
            e.stopPropagation();
            e.preventDefault();

            if (focus.closest('.popupmenu')[0] !== self.menu[0] && focus.closest('.popupmenu').length > 0) {
              focus.closest('.popupmenu').removeClass('is-open').parent().parent().removeClass('is-submenu-open');
              self.highlight(focus.closest('.popupmenu').parent().prev('a'));
            }
          }

          //Up on Up
          if ((!isPicker && key === 38) || (isPicker && key === 37)) {
             e.stopPropagation();
             e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().prevAll(excludes).length === 0) {
              if (focus.length === 0) {
                self.highlight(self.menu.children(excludes).last().find('a'));
              } else {
                self.highlight(focus.closest('.popupmenu').children(excludes).last().find('a'));
              }
              return;
            }
            self.highlight(focus.parent().prevAll(excludes).first().find('a'));
          }

          //Up a square
          if (isPicker && key === 38) {
            e.stopPropagation();
            e.preventDefault();

            if (focus.parent().prevAll(excludes).length > 0) {
              self.highlight($(focus.parent().prevAll(excludes)[9]).find('a'));
            }
          }

          //Right Open Submenu
          if (key === 39  && !isAutocomplete) {
            e.stopPropagation();
            e.preventDefault();

            if (focus.parent().hasClass('submenu')) {
              self.showSubmenu(focus.parent());
              self.highlight(focus.parent().find('.popupmenu a:first'));
            }
          }

          //Down
          if ((!isPicker && key === 40) || (isPicker && key === 39 && !isAutocomplete)) {
            e.stopPropagation();
            e.preventDefault();

            //Go back to Top on the last one
            if (focus.parent().nextAll(excludes).length === 0) {
              if (focus.length === 0) {
                self.highlight(self.menu.children(excludes).first().find('a'));
              } else {
                self.highlight(focus.closest('.popupmenu').children(excludes).first().find('a'));
              }
              return;
            }
            self.highlight(focus.parent().nextAll(excludes).first().find('a'));
          }

          //Down a square
          if ((isPicker && key === 40)) {
            e.stopPropagation();
            e.preventDefault();

            if (focus.parent().nextAll(excludes).length > 0) {
              self.highlight($(focus.parent().nextAll(excludes)[9]).find('a'));
            }
          }

        });
      },

      // Filtering icon initial setup
      iconFilteringSetup: function(alink) {
        if (this.element.hasClass('btn-filter')) {
          var svg = this.element.find('svg.icon-dropdown'),
            link = alink || $('li:first a', this.menu),
            audibleText = link.find('span').text();

          if (svg.length === 1) {
            this.element.append($.createIconElement({ classes: 'icon-dropdown', icon: 'dropdown' }));
          }

          svg.first().changeIcon(link.find('svg').getIconName());
          this.element.find('.audible').text(audibleText);
        }
      },

      // Filtering icon update
      iconFilteringUpdate: function(alink) {
        if (this.element.hasClass('btn-filter')) {
          var link = alink || $('li:first a', this.menu),
            audibleText = link.find('span').text();

          this.element.find('.audible').text(audibleText);
          this.element.find('svg:not(.ripple-effect):first').changeIcon(link.find('svg').getIconName());
        }
      },

      position: function(e) {
        var target = this.element,
          wrapper = this.menu.parent('.popupmenu-wrapper'),
          menuDimensions = {
            width: this.menu.outerWidth(),
            height: this.menu.outerHeight()
          },
          //xOffset = this.element.hasClass('btn-actions') ? (menuWidth) - 36 : 0,
          left, top,
          d;

        //Adjust width for filter button
        /*
        if (this.element.hasClass('btn-filter')) {
          xOffset = +10;
        }
        */

        if (target.is('svg, .icon') && target.closest('.tab').length) {
          target = target.closest('.tab');
        }

        function sanitizeAxis(axis) {
          return ((axis === 'x' || axis === 'y') ? axis : 'x');
        }

        function getCoordinates(e, axis) {
          axis = sanitizeAxis(axis);
          return e['page' + axis.toUpperCase()]; // use mouseX/mouseY if this doesn't work
        }

        function getBorder(axis) {
          return (axis === 'x' ? 'left' : 'top');
        }

        function getTargetOffset(el, axis) {
          axis = sanitizeAxis(axis);
          var border = getBorder(axis),
            offset = el.offset();
          return offset[border];
        }

        function isKeyboardEvent(e) {
          var eventTypes = ['keydown', 'keypress'];
          return (e && eventTypes.indexOf(e.type) > -1);
        }

        switch(this.settings.trigger) {
          case 'rightClick':
            left = getCoordinates(e, 'x');
            top = getCoordinates(e, 'y');
            break;
          case 'immediate':
            left = isKeyboardEvent(e) ? getCoordinates(e, 'x') : getTargetOffset(target, 'x');
            top = isKeyboardEvent(e) ? getCoordinates(e, 'y') : getTargetOffset(target, 'y');
            break;
          default:
            left = getTargetOffset(target, 'x');  //target.offset().left - (hasCloseParent(wrapper) ? wrapper.offsetParent().offset().left : 0) - xOffset
            top = getTargetOffset(target, 'y'); //target.offset().top + 10 + target.outerHeight()
            break;
        }

        function useArrow() {
          return target.is('.btn-menu, .btn-actions, .searchfield-category-button, .trigger');
        }
        function hideArrow() {
          if (useArrow()) {
            wrapper.find('.arrow').css({ 'display': 'none' });
          }
        }
        function centerArrow() {
          wrapper.find('.arrow').css({ 'right': 'auto', 'left': (target.width() / 2) + 'px' });
        }

        // Reset the arrow
        wrapper.find('.arrow').removeAttr('style');

        // if the target "is" a certain set of classes, or meets certain criteria, the target's
        // size (height or width) will be added to the left/top placement.
        function useTargetSize(axis) {
          var cssConstraints = {
            x: '',
            y: '.autocomplete, .btn-menu, .btn-actions, .searchfield-category-button, .trigger'
          };
          var jsConstraints = {
            x: function() {
              return false;
            },
            y: function() {
              return target.closest('.tab').length ||
                target.closest('.tab-more').length ||
                target.closest('.colorpicker-container').length;
            }
          };

          return target.is(cssConstraints[axis]) || jsConstraints[axis]();
        }

        // Same thing, but uses the "menu" size.
        function useMenuSize(axis) {
          var cssConstraints = {
            x: '.btn-actions',
            y: ''
          };
          return target.is(cssConstraints[axis]);
        }

        // Factor in the "size" of both the target element and the menu into the left/top positions
        // of the menu.
        function getAdjustedForSize(axis, value) {
          axis = sanitizeAxis(axis);
          var dimension = axis === 'x' ? 'Width' : 'Height';

          if (useTargetSize(axis)) {
            value = value + target['outer' + dimension]();
          }

          if (useMenuSize(axis)) {
            value = value - menuDimensions[dimension.toLowerCase()];
          }

          // Custom adjustments on a per-element/axis basis
          if (axis === 'x' && target.is('.btn-actions')) {
            value = value + target.outerWidth();
          }

          if (axis === 'y' && (target.is('.btn-actions, .searchfield-category-button') || target.closest('.colorpicker-container').length)) {
            value = value + 10; // extra spacing to keep arrow from overlapping
          }

          return value;
        }
        left = getAdjustedForSize('x', left);
        top = getAdjustedForSize('y', top);

        var modalParent = wrapper.closest('.modal'),
          mpOffset = modalParent.offset();
        function getModalParentOffset(axis) {
          axis = sanitizeAxis(axis);
          var border = getBorder(axis);
          return modalParent.length && !this.isIe11 ? mpOffset[border] : 0;
        }

        // Fix these values if we're sitting inside a modal, since the modal element is "fixed"
        left = left - getModalParentOffset('x');
        top = top - getModalParentOffset('y');

        // place the element so we can get some height/width and bleeds
        wrapper.css({'left': left, 'top': top});
        left = wrapper.offset().left;
        top = wrapper.offset().top;

        var scrollPosY = $(window).height() + $(document).scrollTop(),
          scrollPosX = $(window).width() + $(document).scrollLeft();

        //Handle Case where menu is off bottom
        if ((top + menuDimensions.height) > scrollPosY) {
          d = (top + menuDimensions.height) + getModalParentOffset('y') - scrollPosY;
          top = top - d;

          // Check if we've bled off the top edge.  If yes, shrink the menu's height
          if (top - $(document).scrollTop() < 0) {
            d = top * -1;
            top = top + d;
            menuDimensions.height = menuDimensions.height - d;
          }

          hideArrow();
          wrapper.css({'top': top});
          this.menu.css({'height': menuDimensions.height});
        }

        //Handle Case where menu is off the right
        if ((left + menuDimensions.width) > scrollPosX) {
          d = (left + menuDimensions.width) + getModalParentOffset('x') - scrollPosX;
          left = left - d;

          // Check if we've bled off the left edge.  If yes, shrink the menu's width
          if (left - $(document).scrollLeft() < 0) {
            d = left * -1;
            left = left + d;
            menuDimensions.width = menuDimensions.width - d;
          }

          hideArrow();
          wrapper.css({'left': left});
          this.menu.css({'width': menuDimensions.width});
        }

        //Handle Case where menu is off the left
        if (left - $(document).scrollLeft() < 0) {
          d = left * -1;
          left = left + d;

          hideArrow();
          wrapper.css({'left': left});
        }

        // reposition the arrow in some cases.
        if (this.element.is('.btn-menu') || this.element.is('.searchfield-category-button')) {
          centerArrow();
        }
      },

      open: function(e, ajaxReturn) {
        var self = this;

        var canOpen = this.element.triggerHandler('beforeopen', [this.menu]);
        if (canOpen === false) {
          return;
        }

        if (this.settings.beforeOpen && !ajaxReturn) {
         var response = function (content) {
            self.menu.empty().append(content);
            self.markupItems();
            self.open(e, true);
          };

          if (typeof settings.beforeOpen === 'string') {
            window[settings.beforeOpen](response);
            return;
          }

          settings.beforeOpen(response);
          return;
        }


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

          if (window.orientation === undefined) {
            $(window).on('resize.popupmenu', function() {
              self.close();
            });
          }

          $(window).on('scroll.popupmenu', function () {
            self.close();
          });

          $('.scrollable').on('scroll.popupmenu', function () {
            self.close();
          });

          self.element.trigger('open', [self.menu]);

          if (self.settings.trigger === 'rightClick') {
            self.element.on('click.popupmenu touchend.popupmenu', function () {
              self.close();
            });
          }
        }, 300);

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
            var excludes = ':not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)',
              selection = self.menu.children(excludes).find('.is-selected').children('a');

            if (!selection.length) {
              selection = self.menu.children(excludes).first().children('a');
            }

            self.highlight(selection);
            self.element.trigger('afteropen', [self.menu]);
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
          'top': (parseInt(li.position().top) - 5) + 'px'
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

      highlight: function(anchor) {
        if (!anchor || !anchor.length) {
          return false;
        }

        var li = anchor.parent();

        li.parent().children('li').removeClass('is-focused');
        li.addClass('is-focused');

        //Prevent chrome from scrolling - toolbar
        anchor.focus();
        li.closest('.header').scrollTop(0);

      },

      // adds/removes checkmarks that are in selectable groups inside the popupmenu
      select: function(anchor) {
        var singleMenu = this.menu.is('.is-selectable'),
          multipleMenu = this.menu.is('.is-multiselectable'),
          singleSection = this.isInSingleSelectSection(anchor),
          multipleSection = this.isInMultiselectSection(anchor),
          parent = anchor.parent(),
          returnObj = [anchor, 'selected'];

        if (!singleMenu && !multipleMenu && !singleSection && !multipleSection) {
          return;
        }

        // If the entire menu is "selectable", place the checkmark where it's supposed to go.
        if (singleMenu || singleSection) {
          parent.prevUntil('.heading, .separator').add(parent.nextUntil('.heading, .separator')).removeClass('is-checked');
          parent.addClass('is-checked');
          return returnObj;
        }

        if (multipleMenu || multipleSection) {
          if (parent.hasClass('is-checked')) {
            returnObj[1] = 'deselected';
            parent.removeClass('is-checked');
            return returnObj;
          }
          parent.addClass('is-checked');
          return returnObj;
        }
      },

      getSelected: function() {
        if (!this.menu.is('.is-selectable, .is-multiselectable')) {
          return $();
        }

        return this.menu.children('.is-checked').children('a');
      },

      isInSelectableSection: function(anchor) {
        var separator = anchor.parent().prevAll().filter('.separator').first();
        return (separator.hasClass('multi-selectable-section') || separator.hasClass('single-selectable-section'));
      },

      isInSingleSelectSection: function(anchor) {
        return anchor.parent().prevAll().filter('.separator').first().hasClass('single-selectable-section');
      },

      isInMultiselectSection: function(anchor) {
        return anchor.parent().prevAll().filter('.separator').first().hasClass('multi-selectable-section');
      },

      detach: function () {
        $(document).off('click.popupmenu touchend.popupmenu keydown.popupmenu');
        $(window).off('scroll.popupmenu resize.popupmenu');
        $('.scrollable').off('scroll.popupmenu');

        this.menu.off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');

        if (this.settings.trigger === 'rightClick') {
          this.element.off('click.popupmenu touchend.popupmenu');
        }

        $('iframe').each(function () {
          var frame = $(this);
          try {
            frame.contents().find('body').off('click.popupmenu touchend.popupmenu touchcancel.popupmenu');
          } catch (e) {
            //Ignore security errors on out of iframe
          }
        });
      },

      close: function (isCancelled, noFocus) {
        if (!isCancelled || isCancelled === undefined) {
          isCancelled = false;
        }

        this.menu.removeClass('is-open').attr('aria-hidden', 'true').css({'height': '', 'width': ''});
        this.menu.parent('.popupmenu-wrapper').css({'left': '-999px', 'height': '', 'width': ''});
        this.menu.find('.submenu').off('mouseenter mouseleave').removeClass('is-submenu-open');
        this.menu.find('.popupmenu').css({'left': '', 'top': '', 'height': '', 'width': ''});

        this.menu.find('.is-focused').removeClass('is-focused');

        // Close all events
        $(document).off('keydown.popupmenu.' + this.id + ' click.popupmenu.' + this.id + ' mousemove.popupmenu.' + this.id);
        this.menu.off('click.popupmenu touchend.popupmenu touchcancel.popupmenu mouseenter.popupmenu mouseleave.popupmenu');

        this.element.removeClass('is-open').triggerHandler('close', [isCancelled]);
        this.detach();

        if (this.settings.trigger === 'immediate') {
          this.destroy();
        }

        if (noFocus) {
          return;
        }

        this.element.focus();
      },

      teardown: function() {
        var wrapper = this.menu.parent('.popupmenu-wrapper');

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

        $.removeData(this.menu[0], 'trigger');
        wrapper.remove();

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
