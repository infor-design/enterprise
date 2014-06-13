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

          if (settings.resize) {
            this.element.on('resize', function (e, ui) {
              settings.resize(e, ui);
              });
          }

          this.element.find('.ui-resizable-handle').on('mousedown', function () {
            self.revertTransition(true);
          });
        }

        this.element.find('.btn-close').on('click.modal', function() {
          self.close();
        });

        if (settings.buttons) {
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
            if (props.click) {
              props.click.apply(self.element[0], arguments);
              return;
            }
            self.close();
          });
          buttonset.append(btn);
        });
      },
      open: function () {
        var self = this;

        this.overlay.appendTo('body');

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
            modal.css('z-index', '100' + (i + 1));

            if (modal.data('modal') && modal.data('modal').overlay) {
              modal.data('modal').overlay.css('z-index', '100' + i);
            }
        });

        this.element.addClass('is-visible').attr('role', 'dialog');

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
        }, 400);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(document).on('keypress.modal', function (e) {
          if (e.which === 13) {
            self.element.find('.inforFormButton.default').trigger('click');
          }
        });
      },

      keepFocus: function() {
        var self = this,
          allTabbableElements = $(self.element).find(':tabbable'),
          firstTabbableElement = allTabbableElements[0],
          lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

          $(self.element).on('keypress.modal', function (e) {
            var keyCode = e.which || e.keyCode;

            if (keyCode === 27) {
              self.close();
            }

            if (keyCode === 9) {
              // Move focus to first element that can be tabbed if Shift isn't used
              if (e.target === lastTabbableElement && !e.shiftKey) {
                e.preventDefault();
                firstTabbableElement.focus();
              } else if (e.target === firstTabbableElement && e.shiftKey) {
                e.preventDefault();
                lastTabbableElement.focus();
              }
            }
          });
      },

      close: function () {
        this.element.removeClass('is-visible');
        this.overlay.remove();

        if (this.oldActive) {
          this.oldActive.focus();
          this.oldActive = null;
        } else {
          this.trigger.focus();
        }

        $(document).off('keypress.modal');
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
