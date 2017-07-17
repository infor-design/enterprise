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

  $.fn.message = function(options) {

    // Settings and Options
    var pluginName = 'message',
      defaults = {
          title: 'Message Title',
          isError: false,
          message: 'Message Summary',
          width: 'auto',
          buttons: null,
          cssClass: null,
          returnFocus: null
        },
        settings = $.extend({}, defaults, options);

    /**
    * The Message Component is used to show warning / error messages.
    *
    * @class Message
    * @param {String} title  &nbsp;-&nbsp; Title text or content shown in the message
    * @param {Boolean} isError  &nbsp;-&nbsp; If true, will show title styled as an error with an error icon
    * @param {String} message  &nbsp;-&nbsp; The message content or text
    * @param {Number} width  &nbsp;-&nbsp; Pass a specific with or defaults to auto
    * @param {Object} buttons  &nbsp;-&nbsp; Array of buttons to add to the message (see modal examples as well)
    * @param {String} cssClass  &nbsp;-&nbsp; Extra Class to add to the dialog for customization.
    * @param {String} returnFocus  &nbsp;-&nbsp; JQuery Element selector to focus on return
    *
    */
    function Message(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Actual Plugin Code
    Message.prototype = {

      init: function() {
        var self = this,
          content;

        //Create the Markup
        this.message = $('<div class="modal message"></div>');
        this.messageContent = $('<div class="modal-content"></div>');
        this.title = $('<h1 class="modal-title" id="message-title">' + settings.title + '</h1>').appendTo(this.messageContent).wrap('<div class="modal-header"></div>');
        this.content = $('<div class="modal-body"><p class="message" id="message-text">'+ settings.message +'</p></div>').appendTo(this.messageContent);

        //Append The Content if Passed in
        if (!this.element.is('body')) {
          content = this.element;
          this.content.empty().append(content.show());
        }

        this.message.append(this.messageContent).appendTo('body');
        this.message.modal({trigger: 'immediate', buttons: settings.buttons,
          resizable: settings.resizable, close: settings.close, isAlert: true});

        //Adjust Width if Set as a Setting
        if (settings.width !== 'auto') {
          this.content.closest('.modal')[0].style.maxWidth = 'none';
          this.content.closest('.modal')[0].style.width = settings.width + (/(px|%)/i.test(settings.width + '') ? '' : 'px');
        }

        if (settings.cssClass) {
          this.message.addClass(settings.cssClass);
        }

        //Setup the destroy event to fire on close.  Needs to fire after the "close" event on the modal.
        this.message.on('beforeclose.message', function () {
          var ok = self.element.triggerHandler('beforeclose');
          return ok;
        }).on('beforeopen.message', function () {
          var ok = self.element.triggerHandler('beforeopen');
          return ok;
        }).on('open.message', function () {
          self.element.trigger('open');
        }).on('afterclose.message', function() {
          self.destroy();
          if (settings.returnFocus) {
            settings.returnFocus.focus();
          }

          $(document).off('keypress.message keydown.message');
        });

        $(document).on('keypress.message keydown.message', function (e) {
          var keyCode = e.which || e.keyCode;

          if (keyCode === 27) {
            setTimeout(function () {
              var modalData = self.message.data('modal');
              if (modalData !== undefined) {
                modalData.close();
              }
            }, 0);
          }
        });

        if (settings.isError) {
          this.title.addClass('is-error').prepend($.createIconElement('error'));
        } else {
          this.title.removeClass('is-error').find('svg').remove();
        }
      },

      /**
       * Tear Down and destroy events. However the message will destroy itself on close.
       **/
      destroy: function() {
        var modalData = this.message.data('modal');
        if (modalData !== undefined) {
          modalData.destroy();
        }

        this.message
          .off('beforeclose.message beforeopen.message open.message afterclose.message')
          .remove();
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      new Message(this, settings);
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
