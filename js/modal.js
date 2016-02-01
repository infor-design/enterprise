/**
* Responsive and Accessible Modal Control
* @name modal
* @param {string} trigger - click, immediate,  manual
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

  $.fn.modal = function(options) {

    // Settings and Options
    var pluginName = 'modal',
      defaults = {
        trigger: 'click', //Supports click, immediate
        buttons: null,  //Pass in the Buttons
        isAlert: false, //Adds alertdialog role
        content: null, //Ability to pass in dialog html content
        cssClass: null,  //Append a css class to top level
        autoFocus: true
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Modal(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
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
          this.settings.trigger = 'immediate';
          this.appendContent();
          setTimeout(function () {
            self.open();
          }, 1);
          return;
        }

        self.addButtons(this.settings.buttons);
        this.element.css({'display':'none'}).appendTo('body');
      },

      appendContent: function () {
        var fullContent = false;

        this.element = $(
          '<div class="modal">' +
            '<div class="modal-content">'+
              '<div class="modal-header"><h1 class="modal-title">'+ this.settings.title +'</h1></div>' +
              '<div class="modal-body-wrapper">'+
                '<div class="modal-body"></div>'+
              '</div>'+
            '</div>'+
          '</div>');

        if ($(this.settings.content).is('.modal')) {
          this.element = $(this.settings.content);
          fullContent = true;
        } else {
          this.element.find('.modal-body').append(this.settings.content);
        }
        this.element.appendTo('body');

        if (this.settings.cssClass) {
          this.element.addClass(this.settings.cssClass);
        }

        this.addButtons(this.settings.buttons);

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
          fields = body.find('[data-validate]'),
          inlineBtns = body.find('.modal-buttonset button');

        if (fields.length > 0) {
          var allValid = true;
          fields.each(function () {

            var field = $(this);
            if (!field.val()) {
              allValid = false;
            }

            if (allValid) {
              inlineBtns.filter('.btn-modal-primary').not('.no-validation').removeAttr('disabled');
            }
          });

          if (!allValid && !inlineBtns.filter('.btn-modal-primary').is(':disabled')) {
             inlineBtns.filter('.btn-modal-primary').not('.no-validation').attr('disabled', 'true');
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
          inlineBtns.css('width', btnWidth + '%').button();
          inlineBtns.not('[ng-click], [onclick], :submit').on('click.modal', function (e) {
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

        var cnt = 0;
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

          if (cnt === 0) {
            btn.addClass('hide-focus');
          }
          cnt++;

          var attrs = {},
            attrTypes = ['id', 'name', 'text'];

          for (var i = 0; i < attrTypes.length; i++) {
            if (props[attrTypes[i]]) {
              if (attrTypes[i] === 'text') {
                attrs.placeholder = props[attrTypes[i]];
              }

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
            $('<svg class="icon '+ (props.icon === '#icon-close' ? 'icon-close' : '') +' " focusable="false" aria-hidden="true" role="presentation"><use xlink:href="' + props.icon + '"></use></svg>').prependTo(btn);
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
            btn.css('width', btnWidth + '%');
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
        messageArea.css({'max-height': h, 'overflow': 'auto', 'width': messageArea.width()});
      },

      open: function () {
        var self = this, messageArea,
          elemCanOpen = true;

        if (!this.trigger) {
          this.oldActive = $(':focus');  //Save and restore focus for A11Y
        }

         elemCanOpen = this.element.triggerHandler('beforeopen');

        self.isCancelled = false;

        if (elemCanOpen === false) {
          return false;
        }

        this.element.after(this.overlay);

        messageArea = self.element.find('.detailed-message');
        if (messageArea.length === 1) {
          $(window).on('resize.modal-' + this.id, function () {
            self.sizeInner();
          });
          self.sizeInner();
        }

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          modal.css('z-index', (1020 + (i + 1)).toString());

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', (1020 + i).toString());
          }
        });

        $('body > *').not(this.element).not('.modal, .overlay').attr('aria-hidden', 'true');

        // Ensure aria-labelled by points to the id
        if (this.settings.isAlert) {
          this.element.attr('aria-labeledby', 'message-title');
          this.element.attr('aria-describedby', 'message-text');
        } else {
          var h1 = this.element.find('h1:first'),
            id = h1.attr('id');

          if (!id) {
            id = this.element.attr('id') + '-title';
            h1.attr('id', id);
          }

          var body = this.element.find('.modal-body'),
            descById = (this.element.attr('id') ? this.element.attr('id') : 'message') + '-text';

          body.attr('id', descById);
          this.element.attr('aria-labeledby', id);
          this.element.attr('aria-describedby', descById);

          //Contextual Action Panel Case - Has a toolbar
          if (this.element.find('.toolbar .title').length) {
            this.element.find('.toolbar .title').attr('id', descById);
            this.element.attr('aria-describedby', descById);
          }

        }

        this.mainContent = $('body').children('.scrollable-container');
        if (!this.mainContent.length) {
          this.mainContent = $('body');
        }
        this.mainContent.addClass('no-scroll');

        $(window).on('resize.modal-' + this.id, function() {
          self.resize();
        });

        //Center
        this.element.css({'display': ''});
        setTimeout(function() {
          // TODO: Figure out why we need to do this twice in some cases
          if (self.element.css('margin') !== undefined) {
            self.resize();
          }
          self.resize();
          self.element.addClass('is-visible').attr('role', (self.settings.isAlert ? 'alertdialog' : 'dialog'));
          self.element.attr('aria-hidden', 'false');
          self.overlay.attr('aria-hidden', 'false');
          self.element.attr('aria-modal', 'true'); //This is a forward thinking approach, since aria-modal isn't actually supported by browsers or ATs yet
        }, 1);

        // Add the 'modal-engaged' class after all the HTML markup and CSS classes have a chance to be established
        // (Fixes an issue in non-V8 browsers (FF, IE) where animation doesn't work correctly).
        // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(this.element).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.dropdown') || target.closest('.tab-list').length) {
            return;
          }

          if (e.which === 13 && self.isOnTop()) {
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
          var focusElem = self.element.find(':focusable:not(.searchfield):first');
          self.keepFocus();
          self.element.trigger('open');

          if (focusElem.length === 0) {
            focusElem = self.element.find('.btn-modal-primary');
            focusElem = self.element.find('#message-title').attr('tabindex', '-1');
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
        var top, left,
          modalContent = $('.modal-content', this.element) ,
          bodyHeight = $('.modal-body', this.element).height(),
          calcHeight = ($(window).height()* 0.9)-180; //90% -(180 :extra elements-height)

        $('.modal-body-wrapper', this.element).css('max-height', bodyHeight > calcHeight ? calcHeight : '');

        this.extraPadding = this.isOpen() ? 0 : parseInt($('.modal-content', this.element).css('padding-left'), 10)- 2;
        this.extraPadding = this.settings.isAlert ? this.extraPadding *1.6 : this.extraPadding;

        left = (this.element.outerWidth() /2) + this.extraPadding;
        top = (this.element.outerHeight() /2) + this.extraPadding *1.4;

        this.element.css({
          margin : '-'+ top +'px 0 0 -'+ left +'px'
        });

        // target smaller height (ie. landscape iphone 4/5s)
        if (calcHeight < 110) {
          this.element.css({ 'margin-top': '-'+ (top-22) +'px', 'max-height': '99%'});
          modalContent.css({'padding-top': '15px'});
          $('.modal-title', modalContent).css({'margin-bottom': '15px'});
        }
      },

      isOpen: function() {
        return this.element.is('.is-visible');
      },

      isOnTop: function () {
        var max = 0,
          dialog = this.element;

        $('.modal.is-visible').each(function () {
          if (max < $(this).css('z-index')) {
            max = $(this).css('z-index');
          }
        });

        return max === dialog.css('z-index');
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

        fields.addClass('disable-validation');

        if (elemCanClose === false) {
          return false;
        }

        if (this.mainContent) {
          this.mainContent.removeClass('no-scroll');
        }
        $(window).off('resize.modal-' + this.id);

        this.element.off('keypress.modal keydown.modal');
        this.element.css('visibility', 'visible');
        this.element.removeClass('is-visible');

        this.overlay.attr('aria-hidden', 'true');
        this.element.attr('aria-hidden', 'true');
        if ($('.modal[aria-hidden="false"]').length < 1) {
          $('body').removeClass('modal-engaged');
          $('body > *').not(this.element).removeAttr('aria-hidden');
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
        $('#validation-errors, #tooltip').addClass('is-hidden');

        // remove the event that changed this page's skip-link functionality in the open event.
        $('.skip-link').off('focus.modal');

        setTimeout( function() {
          self.overlay.remove();
          self.element.css({'display':'none'}).trigger('afterclose');

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
            $(window).off('resize.modal-' + this.id);
          }

          if (self.settings.trigger === 'click') {
            self.trigger.off('click.modal');
          }

          self.element.remove();
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
