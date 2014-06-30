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

        this.element.find('.btn-close').on('click.modal', function() {
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
        body.find('.inforFormButton.default.btn-close').remove();

        $.each(buttons, function (name, props) {
          var btn = $('<button type="button" class="inforFormButton"></button>');
          btn.text(props.text);
          if (props.isDefault) {
            btn.addClass('default');
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
      open: function () {
        var self = this;

        this.overlay.appendTo('body');
        this.element.addClass('is-visible').attr('role', 'dialog');

        //Look for other nested dialogs and adjust the zindex.
        $('.modal').each(function (i) {
          var modal = $(this);
          modal.css('z-index', '900' + (i + 1));

          if (modal.data('modal') && modal.data('modal').overlay) {
            modal.data('modal').overlay.css('z-index', '100' + i);
          }

        });

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
        }, 300);

        $('body > *').not(this.element).attr('aria-hidden', 'true');
        $('body').addClass('modal-engaged');

        //Handle Default button.
        $(document).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.inforDropDownList')
              || target.is('.inforSearchField') || target.closest('.inforDataGrid').length > 0) {
            return;
          }
          if (e.which === 13) {
            self.element.find('.inforFormButton.default').trigger('click');
          }
        });
      },

      keepFocus: function() {
        var self = this,
          allTabbableElements = $(self.element).find('a[href], area[href], input:not([disabled]),' +
            'select:not([disabled]), textarea:not([disabled]),' +
            'button:not([disabled]), iframe, object, embed, *[tabindex],' +
            '*[contenteditable]'),
          firstTabbableElement = allTabbableElements[0],
          lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];
          console.log(allTabbableElements);

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
        $(document).off('keypress.modal');

        this.overlay.remove();
        $('body').removeClass('modal-engaged');
        $('body > *').not(this.element).removeAttr('aria-hidden');

        //Fire Events
        this.element.trigger('close');
        this.element.find('.modal-body > div').trigger('close');  //trigger on the content for messages

        if (settings.close) { //Fire Event if passed as an option.
          settings.close(this.element);
        }

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
