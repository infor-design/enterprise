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
        useCoordsForClick: false, //By default, menus open up underneath their target element.  Set this to true to use mouse coordinates for positioning a menu inside of its target element.
        eventObj: undefined,  //Can pass in the event object so you can do a right click with immediate,
        placementOpts: { // Gets passed to this control's Place behavior
          containerOffsetX: 10,
          containerOffsetY: 10,
          strategies: ['flip', 'shrink']
        },
        offset: {
          x: 0,
          y: 0,
        }
      },
      settings = $.extend({}, defaults, options);

    /**
     * Responsive Popup Menu Control (Context)
     * @constructor
     * @param {Object} element
     */
    function PopupMenu(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.isOldIe  = $('html').is('.ie11, .ie10, .ie9');
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Object
    PopupMenu.prototype = {
      init: function() {
        this.setup();
        this.addMarkup();
        this.handleEvents();
        this.iconFilteringSetup();

        // Allow for an external click event to be passed in from outside this code.
        // This event can be used to pass clientX/clientY coordinates for mouse cursor positioning.
        if (this.settings.trigger === 'immediate') {
          this.open(this.settings.eventObj);
        }
      },

      isRTL: function() {
        return $('html').attr('dir') === 'rtl';
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
        var id,
          leftClick = this.settings.trigger !== 'rightClick',
          immediate = this.settings.trigger === 'immediate';

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

        this.wrapper = this.menu.parent('.popupmenu-wrapper');
        this.wrapper.find('svg').icon();

        //Enforce Correct Modality
        this.menu.parent('.popupmenu-wrapper').attr('role', 'application').attr('aria-hidden', 'true');

        // Use "absolute" positioning on the menu insead of "fixed", only when the
        // menu lives <body> tag and we have a <body> element that is tall enough to
        // scroll and is allowed to scroll.
        function scrollableFilter() {
          var c = this ? this.style.overflow : null;
          return c !== 'auto' && c !== 'visible' && c !== 'scroll';
        }
        if (this.wrapper.parents().filter(scrollableFilter).length === 0) {
          this.wrapper[0].style.position = 'absolute';
        }

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

        //Add an Audible Label
        if (!leftClick && !immediate) {
          var audibleSpanId = 'popupmenu-f10-label';
          if ($('#'+audibleSpanId).length === 0) {
            this.element.after('<span style="display:none;" id="' + audibleSpanId + '">' + Locale.translate('PressShiftF10') + '</span>');
          }
          //PressShiftF10
          this.element.attr('aria-describedby', audibleSpanId);
        }
      },

      markupItems: function () {
        var self = this,
          lis = this.menu.find('li:not(.heading):not(.separator)'),
          menuClassName = this.menu[0].className,
          isTranslatable = Soho.DOM.classNameHas(menuClassName, 'isTranslatable');

        lis.each(function(i, li) {
          var a = $(li).children('a')[0], // TODO: do this better when we have the infrastructure
            span = $(a).children('span')[0],
            submenuWrapper = $(li).children('.wrapper')[0];
          li.setAttribute('role', 'presentation');

          if (a) {
            a.setAttribute('tabindex', '-1');
            a.setAttribute('role', (self.settings.ariaListbox ? 'option' : 'menuitem'));

            // Should be translated
            if (isTranslatable) {
              span.innerText = Locale.translate(span.innerText) || span.innerText;
            }

            // disabled menu items, by prop and by className
            if (Soho.DOM.classNameHas(li.className, 'is-disabled')) {
              a.setAttribute('aria-disabled', 'true');
              a.disabled = true;
            }

            if (a.hasAttribute('disabled')) {
              a.setAttribute('aria-disabled', 'true');
              a.disabled = true;
            }

            // menu items that contain submenus
            if (submenuWrapper instanceof HTMLElement) {
              li.className += (Soho.DOM.classNameExists(li) ? ' ' : '') + 'submenu';
            }
            if (Soho.DOM.classNameHas(li.className, 'submenu')) {
              var $a = $(a);

              // Add a span
              if (!span) {
                a.innerHTML = '<span>' + a.innerHTML + '</span>';
                span = $a.children('span')[0];
              }

              if ($a.find('svg.arrow').length === 0) {
                $a.append($.createIconElement({ classes: ['arrow', 'icon-dropdown'], icon: 'dropdown' }));
              }
              a.setAttribute('aria-haspopup', 'true');
            }

            // is-checked
            if (Soho.DOM.classNameHas(li.className, 'is-checked')) {
              a.setAttribute('role', 'menuitemcheckbox');
              a.setAttribute('aria-checked', true);
            }

            // is-not-checked
            if (Soho.DOM.classNameHas(li.className, 'is-not-checked')) {
              li.className = li.className.replace('is-not-checked', '');
              a.setAttribute('role', 'menuitemcheckbox');
              a.removeAttribute('aria-checked');
            }
          }
        });
      },

      handleEvents: function() {
        var self = this,
          leftClick = this.settings.trigger !== 'rightClick',
          immediate = this.settings.trigger === 'immediate';

        function disableBrowserContextMenu(e) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        function doOpen(e) {
          var rightClick = self.settings.trigger === 'rightClick';

          e.stopPropagation();
          e.preventDefault();

          if (rightClick && self.menu.hasClass('is-open')) {
            self.close();
            self.open(e);
            return;
          }

          if (self.menu.hasClass('is-open')){
            self.close();
          } else {
            self.open(e);
          }
        }

        if (leftClick && !immediate) {
          this.element
            .on('mousedown.popupmenu', function (e) {
              if (e.button > 0 || self.element.is(':disabled')) {
                return;
              }
              doOpen(e);
          });
        }

        //settings.trigger
        if (!leftClick) {
          this.menu.parent().on('contextmenu.popupmenu', disableBrowserContextMenu);
          this.element
            .on('contextmenu.popupmenu', disableBrowserContextMenu)
            .on('mousedown.popupmenu', function (e) {
              if (e.button === 2 || (e.button === 0 & e.ctrlKey)) {
                doOpen(e);
              }
            });
        }

        // Setup these next events no matter what trigger type is
        this.element.not('.autocomplete')
          .on('keydown.popupmenu', function (e) {
            switch(e.which) {
              case 13:
              case 32:
                self.open(e);
                break;
              case 121:
                if (e.shiftKey) { //Shift F10
                  self.open(e);
                }
                break;
            }
          })
          .off('updated.popupmenu')
          .on('updated.popupmenu', function(e) {
            e.stopPropagation();
            self.updated();
          });

          // Media Query Listener to detect a menu closing on mobile devices that change orientation.
          this.matchMedia = window.matchMedia('(orientation: landscape)');
          this.mediaQueryListener = function() {
            // Match every time.
            if (!self.menu.hasClass('is-open')) {
              return;
            }
            self.close();
          };
          this.matchMedia.addListener(this.mediaQueryListener);
      },

      handleKeys: function () {
        var self = this;
        //http://access.aol.com/dhtml-style-guide-working-group/#popupmenu

        //Handle Events in Anchors
        this.menu.onTouchClick('popupmenu', 'a')
          .on('click.popupmenu', 'a', function(e) {
            self.handleItemClick(e, $(this));
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
            e.stopImmediatePropagation();
            self.close(true);
            return false;
          }

          //Close on tab
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

      /**
       * Handles the action of clicking items in the popupmenu.
       * @param {$.Event} [e] - The jQuery Event object.
       * @return undefined;
       */
      handleItemClick: function(e, anchor) {
        var href = anchor.attr('href'),
          selectionResult = [anchor];

        if (!e && !anchor) {
          return;
        }

        if (anchor.parent().is('.submenu, .hidden, .is-disabled') || anchor[0].disabled) {
          //Do not close parent items of submenus on click
          e.preventDefault();
          return;
        }

        if (anchor.find('input[checkbox]').length > 0) {
          return;
        }

        if (this.element.hasClass('btn-filter')) {
          this.iconFilteringUpdate(anchor);
          e.preventDefault();
        }

        if (this.isInSelectableSection(anchor) || this.menu.hasClass('is-selectable') || this.menu.hasClass('is-multiselectable')) {
          selectionResult = this.select(anchor);
        }

        // Single toggle on off of checkbox class
        if (anchor.parent().hasClass('is-toggleable')) {
          anchor.parent().toggleClass('is-checked');
        }

        // Trigger a selected event containing the anchor that was selected
        // If an event object is not passed to `handleItemClick()`, assume it was due to this
        // event being triggered already, making it not necessary to re-trigger it.
        if (e) {
          if (selectionResult.length === 1) {
            selectionResult.push(undefined);
          }

          selectionResult.push(true);
          this.element.triggerHandler('selected', selectionResult);
        }

        // MultiSelect Lists should act like other "multiselect" items and not close the menu when options are chosen.
        if (this.menu.hasClass('is-multiselectable') || this.isInMultiselectSection(anchor)) {
          return;
        }

        this.close();

        if (this.element.is('.autocomplete')) {
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

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
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
        var self = this,
          target = this.element,
          isRTL = this.isRTL(),
          wrapper = this.menu.parent('.popupmenu-wrapper'),
          mouse =  {
            x: e && e.clientX ? e.clientX : (window.event && window.event.clientX) ? window.event.clientX : 0,
            y: e && e.clientY ? e.clientY : (window.event && window.event.clientY) ? window.event.clientY : 0
          },
          menuDimensions = {
            width: this.menu.outerWidth(),
            height: this.menu.outerHeight()
          };

        if (!wrapper.length) {
          return;
        }

        if (target.is('svg, .icon') && target.closest('.tab').length) {
          target = target.closest('.tab');
        }

        function getCoordinates(e, axis) {
          axis = ((axis === 'x' || axis === 'y') ? axis : 'x');
          return mouse[axis]; // use mouseX/mouseY if this doesn't work
        }

        // Reset the arrow
        wrapper.find('.arrow').removeAttr('style');

        var opts = $.extend({}, this.settings.placementOpts),
          strategies = ['flip'];

        if (!target.is('.autocomplete, .searchfield')) {
          strategies.push('nudge');
        }
        strategies.push('shrink-y');

        // If right-click or immediate (with an incoming event object), use coordinates from the event
        if ((this.settings.trigger === 'immediate' && this.settings.eventObj) || this.settings.trigger === 'rightClick') {
          opts.x = getCoordinates(e, 'x') - (isRTL ? menuDimensions.width : 0) + ((isRTL ? -1 : 1) * this.settings.offset.x);
          opts.y = getCoordinates(e, 'y') + this.settings.offset.y;

        } else {
          opts.x = this.settings.offset.x || 0;
          opts.y = this.settings.offset.y || 0;
          opts.parent = this.element;
          opts.placement = 'bottom';
        }
        opts.strategies = strategies;

        //=======================================================
        // BEGIN Temporary stuff until we sort out passing these settings from the controls that utilize them
        //=======================================================

        var toolbarParent = target.parents('.toolbar'),
          insideToolbar = toolbarParent.length > 0,
          insideToolbarTitle = target.parents('.title').length > 0,
          isNotFullToolbar = insideToolbar && toolbarParent.children('.buttonset, .title').length > 1,
          isPagerMenu = target.parents('.pager-pagesize').length > 0;

        function alignLeft() {
          opts.parentXAlignment = (isRTL ? 'right': 'left');
        }

        function alignRight() {
          opts.parentXAlignment = (isRTL ? 'left' : 'right');
        }

        function shiftDown() {
          opts.y = opts.y + 15;
        }

        // Change the alignment of the popupmenu based on certain conditions
        (function doAlignment() {
          if (target.is('.btn-menu')) {
            if (isPagerMenu) {
              return alignRight();
            }

            if (insideToolbar) {
              if (!isNotFullToolbar) {
                return alignLeft();
              }
              if (insideToolbarTitle) {
                return alignLeft();
              }
              return alignRight();
            }

            return alignLeft();
          }

          if (target.is('.btn-actions')) {
            return alignRight();
          }

          if (target.is('.tab-more')) {
            return alignRight();
          }

          if ((target.is('.btn-split-menu, .tab, .searchfield-category-button') &&
            !target.parent('.pager-pagesize').length)) {
              return alignLeft();
            }
        })();

        if (target.parents('.masthead').length > 0) {
          shiftDown();
        }

        //=======================================================
        // END Temporary stuff until we sort out passing these settings from the controls that utilize them
        //=======================================================

        wrapper.one('afterplace.popupmenu', function(e, positionObj) {
          self.handleAfterPlace(e, positionObj);
        });

        wrapper.place(opts);
        wrapper.data('place').place(opts);
      },

      handleAfterPlace: function(e, placementObj) {
        var wrapper = this.menu.parent('.popupmenu-wrapper');
        wrapper.data('place').setArrowPosition(e, placementObj, wrapper);

        if (placementObj.height) {
          wrapper[0].style.height = '';
          this.menu[0].style.height = (placementObj.height) + (/(px|%)/i.test(placementObj.height + '') ? '' : 'px');
        }
        if (placementObj.width) {
          wrapper[0].style.width = '';
          this.menu[0].style.width = (placementObj.width) + (/(px|%)/i.test(placementObj.width + '') ? '' : 'px');
        }

        wrapper.triggerHandler('popupmenuafterplace', [placementObj]);
        return placementObj;
      },

      open: function(e, ajaxReturn) {
        var self = this;

        var canOpen = this.element.triggerHandler('beforeopen', [this.menu]);
        if (canOpen === false) {
          return;
        }

        if (this.settings.beforeOpen && !ajaxReturn) {
          var response = function(content) {
            if (self.ajaxContent instanceof $) {
              self.ajaxContent.off().remove();
            }
            self.ajaxContent = $(content);
            self.menu.append(self.ajaxContent);
            self.markupItems();
            self.open(e, true);
          };

          if (typeof this.settings.beforeOpen === 'string') {
            window[this.settings.beforeOpen](response);
            return;
          }

          this.settings.beforeOpen(response);
          return;
        }

        var otherMenus = $('.popupmenu.is-open').filter(function() {
          return $(this).parents('.popupmenu').length === 0;
        }).not(this.menu);  //close others.

        otherMenus.each(function() {
          var api = $(this).data('trigger').data('popupmenu');
          if (api && typeof api.close === 'function') {
            api.close();
          }
        });

        this.element.addClass('is-open');
        this.menu.addClass('is-open').attr('aria-hidden', 'false');

        this.position(e);

        if (this.element.closest('.header').length > 0) {
          this.menu.parent()[0].style.zIndex =  '9001';
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
              self.close(true, self.settings.trigger ==='rightClick');
            }
          });

          if (window.orientation === undefined) {
            $('body').on('resize.popupmenu', function() {
              self.close();
            });
          }

          $(window).on('scroll.popupmenu', function () {
            self.close();
          });

          $('.scrollable').on('scroll.popupmenu', function () {
            self.close();
          });

          self.element.triggerHandler('open', [self.menu]);

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

          var isLeft = parseInt(menuToClose.parent('.wrapper')[0].style.left) < 0,
            canClose = (tracker - startY) < 3.5;

          if (isLeft) {
            canClose = (tracker - startY) >= 0;
          }

          if (canClose) { //We are moving slopie to the menu
            menuToClose.removeClass('is-open').removeAttr('style');
            menuToClose.parent('.wrapper').removeAttr('style');
            menuToClose.parent().parent().removeClass('is-submenu-open');
            menuToClose = null;
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
            self.element.triggerHandler('afteropen', [self.menu]);
          }, 1);
        }
      },

      showSubmenu: function (li) {
        if (Soho.DOM.classNameHas(li[0].className, 'is-disabled') || li[0].disabled) {
          return;
        }

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

        wrapper[0].style.left = (li.position().left + li.outerWidth()) + 'px';
        wrapper[0].style.top = (parseInt(li.position().top) - 5) + 'px';

        wrapper.children('.popupmenu').addClass('is-open');

        //Handle Case where the menu is off to the right
        var menuWidth = menu.outerWidth();
        if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
          wrapper[0].style.left = '-9999px';
          menuWidth = menu.outerWidth();
          wrapper[0].style.left = (li.position().left - menuWidth) + 'px';
          //Did it fit?
          if (wrapper.offset().left < 0) {
            //No. Push the menu's left offset onto the screen.
            wrapper[0].style.left = (li.position().left - menuWidth + Math.abs(wrapper.offset().left) + 40) + 'px';
            menuWidth = menu.outerWidth();
          }
          // Do one more check to see if the right edge bleeds off the screen.
          // If it does, shrink the menu's X size.
          if ((wrapper.offset().left + menuWidth) > ($(window).width() + $(document).scrollLeft())) {
            var differenceY = (wrapper.offset().left + menuWidth) - ($(window).width() + $(document).scrollLeft());
            menuWidth = menuWidth - differenceY;
            menu[0].style.width = menuWidth + 'px';
          }
        }

        //Handle Case where menu is off bottom
        var menuHeight = menu.outerHeight();
        if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
          // First try bumping up the menu to sit just above the bottom edge of the window.
          var bottomEdgeCoord = wrapper.offset().top + menuHeight,
            differenceFromBottomY = bottomEdgeCoord - ($(window).height() + $(document).scrollTop());

          wrapper[0].style.top = (wrapper.position().top - differenceFromBottomY) + 'px';

          // Does it fit?
          if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
            // No. Bump the menu up higher based on the menu's height and the extra space from the main wrapper.
            wrapper[0].style.top = (($(window).height() + $(document).scrollTop()) - menuHeight - mainWrapperOffset) + 'px';
          }

          // Does it fit now?
          if ((wrapper.offset().top - $(document).scrollTop()) < 0) {
            // No. Push the menu down onto the screen from the top of the window edge.
            wrapper[0].style.top = 0;
            wrapper[0].style.top = (wrapper.offset().top * -1) + 'px';
            menuHeight = menu.outerHeight();
          }

          // Do one more check to see if the bottom edge bleeds off the screen.
          // If it does, shrink the menu's Y size and make it scrollable.
          if ((wrapper.offset().top + menuHeight) > ($(window).height() + $(document).scrollTop())) {
            var differenceX = (wrapper.offset().top + menuHeight) - ($(window).height() + $(document).scrollTop());
            menuHeight = menuHeight - differenceX - 32;
            menu[0].style.height = menuHeight + 'px';
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
        $(window).off('scroll.popupmenu orientationchange.popupmenu');
        $('body').off('resize.popupmenu');
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

        var self = this,
          wrapper = this.menu.parent('.popupmenu-wrapper'),
          menu = this.menu.find('.popupmenu');

        this.menu.removeClass('is-open').attr('aria-hidden', 'true');
        if (this.menu[0]) {
          this.menu[0].style.height = '';
          this.menu[0].style.width = '';
        }

        if (wrapper[0]) {
          wrapper[0].style.left = '-999px';
          wrapper[0].style.height = '';
          wrapper[0].style.width = '';
        }

        this.menu.find('.submenu').off('mouseenter mouseleave').removeClass('is-submenu-open');
        if (menu[0]) {
          menu[0].style.left = '';
          menu[0].style.top = '';
          menu[0].style.height = '';
          menu[0].style.width = '';
        }

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

        self.element.removeClass('hide-focus').focus();
      },

      teardown: function() {
        var wrapper = this.menu.parent('.popupmenu-wrapper');

        if (this.ajaxContent) {
          this.ajaxContent.off().remove();
        }

        this.menu.parent().off('contextmenu.popupmenu');
        if (this.element.hasClass('btn-actions')) {
          this.menu.parent().removeClass('bottom').find('.arrow').remove();
        }

        if (this.originalParent) {
          this.menu.appendTo(this.originalParent);
        } else {
          this.menu.insertAfter(this.element);
        }

        this.menu.find('.submenu').children('a').each(function(i, item) {
          var text = $(item).find('span').text();
          $(item).find('span, svg').remove();
          $(item).text(text);
        });

        function unwrapPopup(menu) {
          var wrapper = menu.parent();
          if (wrapper.is('.popupmenu-wrapper')) {
            if (wrapper.data('place')) {
              wrapper.data('place').destroy();
            }
            menu.unwrap();
          }
        }

        //unwrapPopup(this.menu);
        this.menu.find('.popupmenu').each(function() {
          unwrapPopup($(this));
        });

        if (this.menu[0]) {
          $.removeData(this.menu[0], 'trigger');
        }

        if (wrapper.data('place')) {
          wrapper.data('place').destroy();
        }
        wrapper.off().remove();

        if (this.matchMedia) {
          this.matchMedia.removeListener(this.mediaQueryListener);
        }

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
