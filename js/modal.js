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

  $.fn.modal = function(options) {

    // Settings and Options
    var pluginName = 'modal',
      defaults = {
        trigger: 'click', //Supports click, immediate
        buttons: null,  //Pass in the Buttons
        isAlert: false, //Adds alertdialog role
        content: null, //Ability to pass in dialog html content
        cssClass: null,  //Append a css class to top level
        autoFocus: true,
        id: null,  //Optionally tag a dialog with an id
        frameHeight: 180, //Extra Height
        frameWidth: 46 //Extra Width
      },
      settings = $.extend({}, defaults, options);

    /**
     * Responsive and Accessible Modal Control
     * @constructor
     * @param {Object} element
     */
    function Modal(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
      this.reStructure();
    }

    // Actual Plugin Code
    Modal.prototype = {
      init: function() {
        var self = this;

        // Used for tracking events tied to the Window object
        this.id = (parseInt($('.modal').length, 10)+1);
        this.trigger = $('button[data-modal="' + this.element.attr('id') + '"]');  //Find the button with same dialog ID
        this.overlay = $('<div class="overlay"></div>');
        this.oldActive = this.trigger;

        if (this.settings.trigger === 'click') {
          this.trigger.on('click.modal', function() {
            self.open();
          });
        }

        if (this.settings.trigger === 'immediate') {
          setTimeout(function() {
            self.open();
          }, 1);
        }

        self.isCancelled = false;

        //ensure is appended to body for new dom tree
        if (this.settings.content) {

          this.settings.trigger = this.settings.content instanceof jQuery ? this.settings.trigger : 'immediate';
          this.appendContent();
          setTimeout(function () {
            self.open();
          }, 1);
          return;
        }

        self.addButtons(this.settings.buttons);
        this.element.appendTo('body');
        this.element[0].style.display = 'none';
      },

      appendContent: function () {
        var isAppended = false;

        this.element = $(
          '<div class="modal">' +
            '<div class="modal-content">'+
              '<div class="modal-header"><h1 class="modal-title">'+ this.settings.title +'</h1></div>' +
              '<div class="modal-body-wrapper">'+
                '<div class="modal-body"></div>'+
              '</div>'+
            '</div>'+
          '</div>');

        if (this.settings.id) {
          this.element.attr('id', this.settings.id);
        }

        if ($(this.settings.content).is('.modal')) {
          this.element = $(this.settings.content);
        } else if (this.settings.content && this.settings.content.length > 0) {

          if (this.settings.content instanceof jQuery && this.settings.content.parent().is('.modal-body')) {
            isAppended = true;
            this.element = this.settings.content.closest('.modal');
          } else {
            var self = this,
              body = self.element.find('.modal-body');

            body.append(self.settings.content);
            Soho.utils.fixSVGIcons(body);
          }

          if (this.settings.content instanceof jQuery){
            this.settings.content.show();
          }
        }

        if (!isAppended) {
          this.element.appendTo('body');
        }

        if (this.settings.cssClass) {
          this.element.addClass(this.settings.cssClass);
        }

        if (this.settings.title) {
          this.element.find('.modal-title').text(this.settings.title);
        }

        if (!isAppended) {
          this.addButtons(this.settings.buttons);
        }
      },

      reStructure: function() {
        var body = $('.modal-body', this.element),
          hr = $('hr:first-child', body),
          buttonset = $('.modal-buttonset', this.element);

        if (body && body.length && !body.parent().hasClass('modal-body-wrapper')) {
          body.wrap('<div class="modal-body-wrapper"></div>');
        }
        if (hr && hr.length && !hr.parent().hasClass('modal-content')) {
          hr.insertAfter(this.element.find('.modal-header'));
        }
        if (buttonset && buttonset.length && !buttonset.parent().hasClass('modal-content')) {
          buttonset.insertAfter(this.element.find('.modal-body-wrapper'));
        }

      },

      disableSubmit: function () {
        var body = this.element,
          fields = body.find('[data-validate]:visible'),
          inlineBtns = body.find('.modal-buttonset button'),
          primaryButton = inlineBtns.filter('.btn-modal-primary').not('.no-validation');

        if (fields.length > 0) {
          primaryButton.removeAttr('disabled');

          var allValid = true;
          fields.each(function () {

            var field = $(this);
            if (field.closest('.datagrid-filter-wrapper').length > 0) {
              return;
            }

            var isVisible = field[0].offsetParent !== null;

            if (field.is('.required')) {
              if (isVisible && !field.val()) {
                allValid = false;
              }
            } else {
              field.checkValidation();
              if (isVisible && !field.isValid()) {
                allValid = false;
              }

            }

            if (allValid) {
              primaryButton.removeAttr('disabled');
            }
          });

          if (!allValid && !primaryButton.is(':disabled')) {
             primaryButton.attr('disabled', 'true');
          }
        }

      },

      addButtons: function(buttons) {
        var self = this,
          body = this.element.find('.modal-body'),
          bodywrapper = body.parent(),
          btnWidth = 100,
          isPanel = false,
          buttonset;

        this.modalButtons = buttons;

        if (!buttons) {
          var inlineBtns = this.element.find('.modal-buttonset button');
          // Buttons in markup
          btnWidth = 100/inlineBtns.length;
          for (var i = 0, l = inlineBtns.length; i < l; i++) {
            inlineBtns[i].style.width = btnWidth + '%';
          }
          inlineBtns.button();
          inlineBtns.not('[data-ng-click], [ng-click], [onclick], :submit').on('click.modal', function (e) {
            if ($(e.target).is('.btn-cancel')) {
              self.isCancelled = true;
            }
            self.close();
          });
          return;
        }

        if (this.element.is('.contextual-action-panel')) {
          isPanel = true;
          // construct the toolbar markup if a toolbar isn't found
          buttonset = this.element.find('.buttonset');
          if (!buttonset.length) {
            var toolbar = this.element.find('.toolbar');
            if (!toolbar.length) {
              $('<div class="toolbar"></div>').appendTo(this.element.find('.modal-header'));
            }
            buttonset = $('<div class="buttonset"></div>').appendTo(this.element.find('.toolbar'));
          }
        } else {
          buttonset = this.element.find('.modal-buttonset');
          if (!buttonset.length) {
            buttonset = $('<div class="modal-buttonset"></div>').insertAfter(bodywrapper);
          }
        }

        btnWidth = 100/buttons.length;

        if (buttons) {
          buttonset.empty();
        }

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button"></button>');
          btn.text(props.text);

          if (props.cssClass === 'separator') {
            btn = $('<div class="separator"></div>');
          }

          if (props.cssClass) {
            btn.attr('class', props.cssClass);
          } else {
            if (props.isDefault) {
              btn.addClass('btn-modal-primary');
            } else {
              btn.addClass('btn-modal');
            }
          }

          if (props.validate !== undefined && !props.validate) {
            btn.addClass('no-validation');
          }

          var attrs = {},
            attrTypes = ['id', 'name', 'text'];

          for (var i = 0; i < attrTypes.length; i++) {
            if (props[attrTypes[i]]) {
              attrs[attrTypes[i]] = props[attrTypes[i]];
            }
          }

          if (props.type === 'input') {
            var label = $('<label class="audible" for="filter">' + props.text + '</label>'),
              input = $('<input class="searchfield">').attr(attrs);

            buttonset.append(label, input);
            return;
          }

          if (props.icon && props.icon.charAt(0) === '#') {
            btn.html('<span>' + btn.text() + '</span>');
            $.createIconElement({
              classes: [props.icon === '#icon-close' ? 'icon-close' : ''],
              icon: props.icon.substr('#icon-'.length)
            }).prependTo(btn);
          }

          if (props.id) {
            btn.attr('id', props.id);
          }

          btn.on('click.modal', function(e) {
            if (props.click) {
              props.click.apply(self.element[0], [e, self]);
              return;
            }
            self.close();
          });

          if (!isPanel) {
            btn[0].style.width = btnWidth + '%';
          }

          btn.button();
          buttonset.append(btn);

        });

      },

      sizeInner: function () {
        var messageArea;
        messageArea = this.element.find('.detailed-message');
        //Set a max width
        var h = $(window).height() - messageArea.offset().top - 150;
        messageArea[0].style.maxHeight = h + 'px';
        messageArea[0].style.overflow = 'auto';
        messageArea[0].style.width = messageArea.width() + 'px';
      },

      open: function () {
        var self = this, messageArea,
          elemCanOpen = true;

        if (!this.trigger || this.trigger.length ===0) {
          this.oldActive = $(':focus');  //Save and restore focus for A11Y
        }

        this.element.after(this.overlay);
        if (this.element && !this.element.parent().hasClass('modal-wrapper')) {
          this.element.wrap('<div class="modal-page-container"><div class="modal-wrapper"></div>');
        }
        this.root = this.element.closest('.modal-page-container');

        messageArea = self.element.find('.detailed-message');
        if (messageArea.length === 1) {
          $('body').on('resize.modal-' + this.id, function () {
            self.sizeInner();
          });
          self.sizeInner();
        }

        elemCanOpen = this.element.triggerHandler('beforeopen');
        self.isCancelled = false;

        if (elemCanOpen === false) {
          self.overlay.remove();
          self.root[0].style.display = 'none';
          return false;
        }

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          this.style.zIndex = (1020 + (i + 1)).toString();

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay[0].style.zIndex = (1020 + i).toString();
          }
        });

        $('body > *').not(this.element).not('.modal, .overlay, .modal-page-container').attr('aria-hidden', 'true');

        // Ensure aria-labelled by points to the id
        if (this.settings.isAlert) {
          this.element.attr('aria-labeledby', 'message-title');
          this.element.attr('aria-describedby', 'message-text');
        } else {
          var h1 = this.element.find('h1:first'),
            id = h1.attr('id');

          if (!id) {
            id = (this.element.attr('id') ? this.element.attr('id') : 'h1')  + '-title';
            h1.attr('id', id);
          }

          var body = this.element.find('.modal-body'),
            descById = (this.element.attr('id') ? this.element.attr('id') : 'message') + '-text';

          this.element.attr('aria-labeledby', id);

          //Contextual Action Panel Case - Has a toolbar
          if (this.element.find('.toolbar .title').length) {
            this.element.find('.toolbar .title').attr('id', descById);
            this.element.attr('aria-describedby', descById);
          } else {
            body.attr('id', descById);
            this.element.attr('aria-describedby', descById);
          }

        }

        this.mainContent = $('body').children('.scrollable-container');
        if (!this.mainContent.length) {
          this.mainContent = $('body');
        }

        this.removeNoScroll = !this.mainContent.hasClass('no-scroll');
        this.mainContent.addClass('no-scroll');

        $('body').on('resize.modal-' + this.id, function() {
          self.resize();
        });

        //Center
        this.root[0].style.display = '';
        this.element[0].style.display = '';

        setTimeout(function() {
          self.resize();
          self.element.addClass('is-visible').attr('role', (self.settings.isAlert ? 'alertdialog' : 'dialog'));
          self.root.attr('aria-hidden', 'false');
          self.overlay.attr('aria-hidden', 'true');
          self.element.attr('aria-modal', 'true'); //This is a forward thinking approach, since aria-modal isn't actually supported by browsers or ATs yet
        }, 1);

        // Add the 'modal-engaged' class after all the HTML markup and CSS classes have a chance to be established
        // (Fixes an issue in non-V8 browsers (FF, IE) where animation doesn't work correctly).
        // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(this.element).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('.searchfield') || target.is('textarea') || target.is(':button') || target.is('.dropdown') || target.closest('.tab-list').length) {
            return;
          }

          if (e.which === 13 && self.isOnTop() &&
              !target.closest('form').find(':submit').length &&
              self.element.find('.btn-modal-primary:enabled').length) {

            e.stopPropagation();
            e.preventDefault();
            self.element.find('.btn-modal-primary:enabled').trigger('click');
          }
        });

        // Override this page's skip-link default functionality to instead focus the top
        // of this element if it's clicked.
        $('.skip-link').on('focus.modal', function(e) {
          e.preventDefault();
          self.getTabbableElements().first.focus();
        });

        function focusElement() {
          var focusElem = self.element.find(':focusable').not('.modal-header .searchfield').first();
          self.keepFocus();
          self.element.trigger('open', [self]);

          if (focusElem.length === 0) {
            focusElem = self.element.find('.btn-modal-primary');
          }

          if (focusElem.length === 1 && focusElem.is('.btn-modal')) {
            focusElem = self.element.find('.btn-modal-primary');
          }

          if (focusElem.length === 1 && focusElem.is('button') && !focusElem.is(':disabled')) {
            focusElem.addClass('hide-focus');
          }

          if (!self.settings.autoFocus) {
            return;
          }

          // If the selected element is a tab, actually make sure it's the "selected" tab.
          var selected, tabParent;
          if (focusElem.is('.tab:not(.is-selected) a')) {
            tabParent = focusElem.closest('.tab-container');
            selected = tabParent.find('.is-selected');
            if (selected.length) {
              focusElem = selected;
              tabParent.data('tabs').select(selected.children('a').attr('href'));
              return;
            }
          }

          // Otherwise, just focus
          focusElem.focus();

        }

        var pagerElem = self.element.find('.paginated');
        pagerElem.on('afterpaging', function () {
          self.resize();
        });

        setTimeout(function () {
          self.disableSubmit();
        }, 10);

        var fields = this.element.find('[data-validate]');
        fields.removeClass('disable-validation');

        setTimeout(function () {
          focusElement();
        }, 200);

        setTimeout(function () {
          self.element.trigger('afteropen');
        }, 300);

      },

      resize: function() {
        var calcHeight = ($(window).height()* 0.9)-this.settings.frameHeight, //90% -(180 :extra elements-height)
          calcWidth = ($(window).width()* 1)-this.settings.frameWidth;

        var wrapper = this.element.find('.modal-body-wrapper');

        //Remove width for backwards compat
        this.element.find('.modal-contents').css('width', '');

        if (wrapper.length) {
          wrapper[0].style.maxHeight = calcHeight + 'px';
          wrapper[0].style.maxWidth = calcWidth + 'px';
        }

        if (this.element.hasClass('lookup-modal')) {
          var table = this.element.find('.datagrid-body'),
            hasPager = this.element.find('.pager-toolbar'),
            container = table.closest('.datagrid-container');

          calcHeight = calcHeight - (container.prev().is('.toolbar') ? 130 : 60) - (container.next().is('.pager-toolbar') ? 35 : 0);
          table[0].style.maxHeight = calcHeight + (hasPager.length ? -15 : 0) + 'px';
          table[0].style.maxWidth = calcWidth + 'px';
        }

      },

      isOpen: function() {
        return this.element.is('.is-visible');
      },

      isOnTop: function () {
        var max = 0,
          dialog = this.element;

        $('.modal.is-visible').each(function () {
          var zIndex = this.style.zIndex;
          if (max < zIndex) {
            max = zIndex;
          }
        });

        return max === dialog[0].style.zIndex;
      },

      getTabbableElements: function() {
        var allTabbableElements = $(this.element).find('a[href], area[href], input:not([disabled]),' +
          'select:not([disabled]), textarea:not([disabled]),' +
          'button:not([disabled]), iframe, object, embed, *[tabindex],' +
          '*[contenteditable]').filter(':visible');
        return {
          first: allTabbableElements[0],
          last: allTabbableElements[allTabbableElements.length - 1]
        };
      },

      keepFocus: function() {
        var self = this, tabbableElements;

          $(self.element).on('keypress.modal keydown.modal', function (e) {
            var keyCode = e.which || e.keyCode;

            if (keyCode === 27) {
              setTimeout(function () {
                self.close();
              }, 0);
            }

            if (keyCode === 9) {
              tabbableElements = self.getTabbableElements();

              // Move focus to first element that can be tabbed if Shift isn't used
              if (e.target === tabbableElements.last && !e.shiftKey) {
                e.preventDefault();
                tabbableElements.first.focus();
              } else if (e.target === tabbableElements.first && e.shiftKey) {
                e.preventDefault();
                tabbableElements.last.focus();
              }

              self.element.find('#message-title').removeAttr('tabindex');
            }

          });
      },

      close: function (destroy) {
        if (!this.isOpen()) {
          return true;
        }

        var elemCanClose = this.element.triggerHandler('beforeclose'),
          self = this,
          fields = this.element.find('[data-validate]');

        this.root = this.element.closest('.modal-page-container');
        fields.addClass('disable-validation');

        if (elemCanClose === false) {
          return false;
        }

        if (this.mainContent && this.removeNoScroll) {
          this.mainContent.removeClass('no-scroll');
        }
        $('body').off('resize.modal-' + this.id);

        this.element.off('keypress.modal keydown.modal');
        this.element.removeClass('is-visible');

        this.overlay.attr('aria-hidden', 'true');
        if (this.root) {
          this.root.attr('aria-hidden', 'true');
        }

        if ($('.modal-page-container[aria-hidden="false"]').length < 1) {
          $('body').removeClass('modal-engaged');
          $('body > *').not(this.element.closest('.modal-page-container')).removeAttr('aria-hidden');
          $('.overlay').remove();
        }

        //Fire Events
        self.element.trigger('close', self.isCancelled);

        if (this.oldActive && $(this.oldActive).is('button:visible')) {
          this.oldActive.focus();
          this.oldActive = null;
        } else if (this.trigger.parents('.toolbar, .formatter-toolbar').length < 1) {
          this.trigger.focus();
        }

        //close tooltips
        $('#validation-errors, #tooltip, #validation-tooltip').addClass('is-hidden');

        // remove the event that changed this page's skip-link functionality in the open event.
        $('.skip-link').off('focus.modal');

        setTimeout( function() {
          self.overlay.remove();
          self.root[0].style.display = 'none';
          self.element.trigger('afterclose');

          if (self.settings.trigger === 'immediate' || destroy) {
            self.destroy();
          }
        }, 300); // should match the length of time needed for the overlay to fade out
      },

      // NOTE: Destroy method needs to function as a callback because it's
      destroy: function() {
        var self = this,
          canDestroy = this.element.trigger('beforedestroy');

        if (!canDestroy) {
          return;
        }

        function destroyCallback() {
          if (self.modalButtons) {
            self.element.find('button').off('click.modal');
          }

          if (self.element.find('.detailed-message').length === 1) {
            $('body').off('resize.modal-' + this.id);
          }

          if (self.settings.trigger === 'click') {
            self.trigger.off('click.modal');
          }

          self.element.closest('.modal-page-container').remove();
          $.removeData(self.element[0], 'modal');
        }

        if (!this.isOpen()) {
          destroyCallback();
          return;
        }

        this.element.one('afterclose.modal', function() {
          destroyCallback();
        });

        this.close(true);
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      var instance = $.data(this, pluginName),
        elem = $(this);

      if (!elem.is('.modal')) {
        instance = elem.closest('.modal').data(pluginName);
      }

      if (instance) {
        if (typeof instance[options] === 'function') {
          instance[options]();
        }
        instance.settings = $.extend({}, instance.settings, options);

        if (settings.trigger === 'immediate') {
          instance.open();
        }
        return;
      }

      instance = $.data(this, pluginName, new Modal(this, settings));
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
