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
        cssClass: null  //Append a css class to top level
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
        this.element = $(
          '<div class="modal">' +
            '<div class="modal-content">'+
              '<div class="modal-header"><h1 class="modal-title">'+ this.settings.title +'</h1></div>' +
              '<div class="modal-body-wrapper">'+
                '<div class="modal-body"></div>'+
              '</div>'+
            '</div>'+
          '</div>');

        this.element.find('.modal-body').append(this.settings.content);
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
          var inlineBtns = body.find('.modal-buttonset button');
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

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button"></button>');
          btn.text(props.text);

          if (props.cssClass) {
            btn.attr('class', props.cssClass);
          } else {
            if (props.isDefault) {
              btn.addClass('btn-modal-primary');
            } else {
              btn.addClass('btn-modal');
            }
          }

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
            input.searchfield();
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

        this.element.triggerHandler('beforeOpen');

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
          modal.css('z-index', (1000 + (i + 1)).toString());

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', (1000 + i).toString());
          }
        });

        // hide modal until it loaded, resized and centered
        self.element.css('opacity', 0);
        setTimeout(function () {
          $(window).trigger('resize');
          self.resize();
          self.element.css('opacity', 1);
          self.element.triggerHandler('afterOpen');
        }, 300);

        setTimeout(function () {
          var focusElem = self.element.find(':focusable:not(.searchfield):first');
          self.keepFocus();
          self.element.triggerHandler('open');

          if (focusElem.length === 0) {
            focusElem = self.element.find('.btn-modal-primary');
            focusElem = self.element.find('#message-title').attr('tabindex', '-1');
          }
          focusElem.focus();
        }, 10);

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

          if (target.is('textarea') || target.is(':button') || target.is('.dropdown')) {
            return;
          }

          if (e.which === 13 && self.isOnTop()) {
            e.stopPropagation();
            e.preventDefault();
           self.element.find('.btn-modal-primary').trigger('click');
          }
        });

        // Override this page's skip-link default functionality to instead focus the top
        // of this element if it's clicked.
        $('.skip-link').on('focus.modal', function(e) {
          e.preventDefault();
          self.getTabbableElements().first.focus();
        });

        setTimeout(function () {
          self.disableSubmit();
        }, 10);
      },

      resize: function() {
        var bodyHeight = $('.modal-body', this.element).height(),
          calcHeight = ($(window).height()* 0.9)-180; //90% -(160 :extra elements-height)

        $('.modal-body-wrapper', this.element).css('max-height', bodyHeight > calcHeight ? calcHeight : '');
        this.element.css({
          margin : '-' + (this.element.outerHeight() / 2) + 'px 0 0 -' + (this.element.outerWidth() / 2) + 'px'
        });
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

            // Don't allow the modal to close if we hit enter to select a tab
            if (keyCode === 13) {
              var tabContainerParents = $(e.target).parentsUntil(self.element).filter('.tab-container');
              if (tabContainerParents.length) {
                e.preventDefault();
                e.stopPropagation();
              }
            }

          });
      },

      close: function () {
        var elemCanClose = this.element.triggerHandler('beforeClose'),
          self = this;

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
          self.element.css({'display':'none'}).trigger('afterClose');
        }, 300); // should match the length of time needed for the overlay to fade out

        if (self.settings.content) {
          self.element.remove();
        }
      },

      destroy: function() {
        this.close();

        if (this.modalButtons) {
          this.element.find('button').off('click.modal');
        }

        if (this.element.find('.detailed-message').length === 1) {
          $(window).off('resize.modal-' + this.id);
        }

        if (this.settings.trigger === 'click') {
          this.trigger.off('click.modal');
        }

        $.removeData($(this.element),'modal');
        this.element.trigger('destroy.modal');
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
