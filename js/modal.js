/**
* Responsive and Accessible Modal Control
* @name modal
* @param {string} trigger - click, immediate,  manual
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

        try {
          this.oldActive = document.activeElement;  //Save and restore focus for A11Y
        } catch( e ) {
          this.oldActive = parent.document.activeElement; //iframe
        }

        this.trigger = $('button[data-modal="' + this.element.attr('id') + '"]');  //Find the button with same dialog ID
        this.overlay = $('<div class="overlay"></div>');

        if (settings.trigger === 'click') {
          this.trigger.on('click.modal', function() {
            self.open();
          });
        }

        if (settings.trigger === 'immediate') {
          setTimeout(function() {
            self.open();
          }, 1);
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
      revertTransition: function (doTop) {
        //Revert the transform so drag and dropping works as expected
        var elem = this.element,
          //parentRect = elem.parent()[0].getBoundingClientRect(),
          rect = elem[0].getBoundingClientRect();

        elem.css({'transition': 'all 0 ease 0', 'transform': 'none',
          'left': rect.left});

        if (doTop) {
          elem.css('top', rect.top);
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
          if (props.isLink) {
            btn = $('<a href="#" class="link"></a>').text(props.text);
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

        this.element.after(this.overlay);

        messageArea = self.element.find('.detailed-message');
        if (messageArea.length === 1) {
          $(window).on('resize.modal', function () {
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

        setTimeout(function () {
          self.element.find('.modal-title').focus();
          self.keepFocus();
          self.element.triggerHandler('open');
          self.element.find('.modal-body > div').triggerHandler('open');
        }, 300);

        $('body > *').not(this.element).not('.modal, .overlay').attr('aria-hidden', 'true');
        this.element.addClass('is-visible').attr('role', 'dialog');
        this.element.attr('aria-hidden', 'false');
        this.overlay.attr('aria-hidden', 'false');

        //Center on IE8
        if ($('html').hasClass('ie8')) {
          self.element.css({top:'50%',left:'50%', margin:'-'+(self.element.find('.modal-content').outerHeight() / 2)+'px 0 0 -'+(self.element.outerWidth() / 2)+'px'});
        }

        //Reset the transform on IE9 to enable text-caret visibility
        if ($('html').hasClass('ie9')) {
          self.revertTransition(true);
        }

        // Add the 'modal-engaged' class after all the HTML markup and CSS classes have a chance to be established
        // (Fixes an issue in non-V8 browsers (FF, IE) where animation doesn't work correctly).
        // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
        var x = this.overlay.width();
        $('body').addClass('modal-engaged');
        x = null;

        //Handle Default button.
        $(this.element).on('keypress.modal', function (e) {
          var target = $(e.target);

          if (target.is('textarea') || target.is(':button') || target.is('.dropdown')) {
            return;
          }

          if (e.which === 13 && self.isOnTop()) {
            e.stopPropagation();
            e.preventDefault();
            self.element.find('.btn-default').trigger('click.modal');
          }
        });

        // Override this page's skip-link default functionality to instead focus the top
        // of this element if it's clicked.
        $('.skip-link').on('focus.modal', function(e) {
          e.preventDefault();
          self.getTabbableElements().first.focus();
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

      getTabbableElements: function() {
        var allTabbableElements = $(this.element).find('a[href], area[href], input:not([disabled]),' +
          'select:not([disabled]), textarea:not([disabled]),' +
          'button:not([disabled]), iframe, object, embed, *[tabindex],' +
          '*[contenteditable]');
        return {
          first: allTabbableElements[0],
          last: allTabbableElements[allTabbableElements.length - 1]
        };
      },

      keepFocus: function() {
        var self = this,
          tabbableElements = self.getTabbableElements();

          $(self.element).on('keypress.modal keydown.modal', function (e) {
            var keyCode = e.which || e.keyCode;

            if (keyCode === 27) {
              self.close();
            }

            if (keyCode === 9) {
              // Move focus to first element that can be tabbed if Shift isn't used
              if (e.target === tabbableElements.last && !e.shiftKey) {
                e.preventDefault();
                tabbableElements.first.focus();
              } else if (e.target === tabbableElements.first && e.shiftKey) {
                e.preventDefault();
                tabbableElements.last.focus();
              }
            }
          });
      },

      close: function () {
        var self = this,
          elemCanClose = this.element.triggerHandler('beforeClose');

        if (elemCanClose === false) {
          return;
        }

        this.element.off('keypress.modal keydown.modal');
        this.element.removeClass('is-visible');
        this.overlay.attr('aria-hidden', 'true');
        this.element.attr('aria-hidden', 'true');
        if ($('.modal[aria-hidden="false"]').length < 1) {
          $('body').removeClass('modal-engaged');
          $('.modal').not(this.element).removeAttr('aria-hidden');
        }

        //Fire Events
        this.element.trigger('close', [this.isCancelled]);
        this.element.find('.modal-body > div').first().trigger('beforeClose', [this.isCancelled]);  //trigger on the content for messages

        if (this.oldActive && $(this.oldActive).is('button:visible')) {
          this.oldActive.focus();
          this.oldActive = null;
        } else {
          this.trigger.focus();
        }

        //close tooltips
        $('#validation-errors, #tooltip').addClass('is-hidden');

        // remove the event that changed this page's skip-link functionality in the open event.
        $('.skip-link').off('focus.modal');

        setTimeout( function() {
          self.overlay.remove();
          self.element.trigger('afterClose');
        }, 300); // should match the length of time needed for the overlay to fade out
      },

      destroy: function(){
        this.close();
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
        instance.settings = $.extend({}, defaults, options);

        if (settings.trigger === 'immediate') {
          instance.open();
        }
        return;
      }

      instance = $.data(this, pluginName, new Plugin(this, settings));
    });
  };

}));
