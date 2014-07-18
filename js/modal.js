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
          draggable: true,  //Can Drag the Dialog around.
          resizable: false, //Depricated - Resizable Dialogs.
          buttons: null
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

        self.isCancelled = false;
        this.element.find('.btn-close').on('click.modal', function() {
          self.close();
        });

        this.element.find('.btn-cancel, .link-cancel').on('click.modal', function() {
          self.isCancelled = true;
          self.close();
        });

        if (settings.buttons) {
          self.addButtons(settings.buttons);
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
          btn.text(props.text);
          if (props.isDefault) {
            btn.addClass('btn-default');
          }
          if (props.id) {
            btn.attr('id', props.id);
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
      sizeInner: function () {
        var messageArea;
        messageArea = this.element.find('.detailed-message');
        //Set a max width
        var h = $(window).height() - messageArea.offset().top - 150;
        messageArea.css({'max-height': h, 'overflow': 'auto', 'width': messageArea.width()});
      },
      open: function () {
        var self = this, messageArea,
          elemCanOpen = this.element.triggerHandler('beforeOpen'),
          bodyCanOpen = this.element.find('.modal-body > div').triggerHandler('beforeOpen');

        self.isCancelled = false;

        if (elemCanOpen === false || bodyCanOpen === false) {
          return false;
        }

        this.overlay.appendTo('body');
        messageArea = self.element.find('.detailed-message');
        if (messageArea.length === 1) {
          $(window).on('resize.modal', function () {
            self.sizeInner();
          });
          self.sizeInner();
        }
        this.element.addClass('is-visible').attr('role', 'dialog');

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          modal.css('z-index', '100' + (i + 1));

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', '100' + i);
          }

        });

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
          self.element.triggerHandler('open');
          self.element.find('.modal-body > div').triggerHandler('open');
        }, 300);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(document).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.dropdown')) {
            return;
          }

          if (e.which === 13 && self.isOnTop()) {
            self.element.find('.btn-default').trigger('click.modal');
          }
        });
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

      keepFocus: function() {
        var self = this,
          allTabbableElements = $(self.element).find('a[href], area[href], input:not([disabled]),' +
            'select:not([disabled]), textarea:not([disabled]),' +
            'button:not([disabled]), iframe, object, embed, *[tabindex],' +
            '*[contenteditable]'),
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
        var elemCanClose = this.element.triggerHandler('beforeClose'),
          bodyCanClose = this.element.find('.modal-body > div').first().triggerHandler('beforeClose');

        if (elemCanClose === false || bodyCanClose === false) {
          return;
        }

        this.element.removeClass('is-visible');
        $(document).off('keypress.modal');

        this.overlay.remove();
        $('body').removeClass('modal-engaged');
        $('body > *').not(this.element).removeAttr('aria-hidden');

        //Fire Events
        this.element.trigger('close', [this.isCancelled]);
        this.element.find('.modal-body > div').first().trigger('beforeClose', [this.isCancelled]);  //trigger on the content for messages

        if (this.oldActive && $(this.oldActive).is('button:visible')) {
          this.oldActive.focus();
          this.oldActive = null;
        } else {
          this.trigger.focus();
        }
      },

      destroy: function(){
        this.close();
        $.removeData(this.obj, pluginName);
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
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
