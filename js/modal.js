/**
* Responsive and Accessible Modal Control
* @name Tabs
* @param {string} propertyName - The Name of the Property
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

  $.fn.modal = function(options) {

    // Settings and Options
    var pluginName = 'modal',
        defaults = {
          trigger: 'click', //TODO: supports click, immediate,  manual
          draggable: false,  //Can Drag the Dialog around - Needs jQuery UI
          resizable: false, //Depricated - Resizable Dialogs - Needs jQuery UI
          buttons: []
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this;

        this.oldActive = document.activeElement;  //Save and restore focus for A11Y
        this.trigger = $('button[ data-modal="' + this.element.attr('id') + '"]');  //Find the button with same dialog ID
        this.overlay = $('<div class="overlay"></div>');

        if (settings.trigger === 'click') {
          this.trigger.on('click.modal', function() {
            self.open();
          });
        }

        if (settings.trigger === 'immediate') {
          setTimeout(function () {
            self.open();
          },1);
        }

        if (settings.draggable) {
          this.element.draggable({handle: '.modal-title', containment: 'document', start: function() {
            self.revertTransition();
          }});
        }

        if (settings.resizable) {
          this.element.resizable();
          this.element.find('.ui-resizable-handle').on('mousedown', function () {
            self.revertTransition(true);
          });
        }

        this.element.find('.btn-close').on('click.modal', function() {
          self.close();
        });

        if (settings.buttons.length > 0) {
          self.addButtons(settings.buttons);
        }
      },
      revertTransition: function (doTop) {
        //Revert the transform so drag and dropping works as expected
        var elem = this.element,
          parentRect = elem.parent()[0].getBoundingClientRect(),
          rect = elem[0].getBoundingClientRect();

        elem.css({'transition': 'all 0 ease 0', 'transform': 'none',
          'left': rect.left-parentRect.left});

        if (doTop) {
          elem.css('top', rect.top-parentRect.top+11);
        }
      },
      addButtons: function(buttons){
        var body = this.element.find('.modal-body'),
            self = this,
            buttonset = $('<div class="modal-buttonset"></div>').appendTo(body);

        buttonset.find('button').remove();
        body.find('.btn-default.btn-close').remove();

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button" class="btn"></button>');
          if (props.isLink) {
            btn = $('<a class="link"></a>');
          }
          btn.text(props.text);
          if (props.isDefault) {
            btn.addClass('btn-default');
          }
          btn.on('click.modal', function() {
            props.click.apply(self.element[0], arguments);
          });
          buttonset.append(btn);
        });
      },
      open: function () {
        var self = this;

        this.overlay.appendTo('body');
        this.element.addClass('is-visible').attr('role', 'dialog');
        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
        }, 400);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');
      },

      keepFocus: function() {
        var self = this,
        tabbableElements = 'a[href], area[href], input:not([disabled]),' +
        'select:not([disabled]), textarea:not([disabled]),' +
        'button:not([disabled]), iframe, object, embed, *[tabindex],' +
        '*[contenteditable]';

        var attach = function (context) {
          var allTabbableElements = context.querySelectorAll(tabbableElements),
          firstTabbableElement = allTabbableElements[0],
          lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

          var keyListener = function (event) {
            var keyCode = event.which || event.keyCode; // Get the current keycode

            //Prevent the default behavior of events
            event.preventDefault = event.preventDefault || function () {
              event.returnValue = false;
            };

            // If it is TAB
            if (keyCode === 9) {
              // Move focus to first element that can be tabbed if Shift isn't used
              if (event.target === lastTabbableElement && !event.shiftKey) {
                event.preventDefault();
                firstTabbableElement.focus();
              } else if (event.target === firstTabbableElement && event.shiftKey) {
                event.preventDefault();
                lastTabbableElement.focus();
              }
            }

            if (keyCode === 27) {
              self.close();
            }
          };

          context.addEventListener('keydown', keyListener, false);
        };
        attach(self.element[0]);
      },

      close: function () {
        var numOpen = 0;

        this.element.removeClass('is-visible');

        //Fire Events
        //this.element.trigger('close');

        //Remove Overlay if no more dialogs.
        $('.modal:visible').not(this.element).each(function() {
          if ($(this).css('visibility') === 'visible') {
            numOpen++;
          }
        });

        if (numOpen === 0) {
          this.overlay.remove();
          $('body > *').not(this.element).attr('aria-hidden', 'false');
          $('body').removeClass('modal-engaged');
        }

        if (this.oldActive) {
          this.oldActive.focus();
          this.oldActive = null;
        } else {
          this.trigger.focus();
        }
      },

      destroy: function(){
        $.removeData(this.obj, pluginName);
      }
    };

    // Support Chaining and Init the Control or Set Settings
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
