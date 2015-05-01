/**
* Responsive Messages
* Deps: modal
*/

$.fn.message = function(options) {

  // Settings and Options
  var defaults = {
        title: 'Message Title', //Title text or content shown in the message
        isError: false, //Show Title as an Error with an Icon
        message: 'Message Summary', //The message content or text
        width: 'auto',  //specify a given width or fit to content with auto
        buttons: null //Passed through to modal
      },
      settings = $.extend({}, defaults, options);

  // Plugin Constructor
  function Plugin(element) {
    this.element = $(element);
    this.init();
  }

  // Actual Plugin Code
  Plugin.prototype = {
    init: function() {
      var self = this,
        content;

      //Create the Markup
      this.message = $('<div class="modal"></div>');
      this.messageContent = $('<div class="modal-content"></div>');
      this.title = $('<h1 class="modal-title" id="message-title">' + settings.title + '</h1>').appendTo(this.messageContent);
      this.content = $('<div class="modal-body"><p class="message" id="message-text">'+ settings.message +'</p></div>').appendTo(this.messageContent);

      //Append The Content if Passed in
      if (!this.element.is('body')) {
        content = this.element;
        this.content.empty().append(content.show());
      }

      this.closeBtn = $('<button type="button" class="btn-primary btn-close">Close</button>').appendTo(this.content);
      this.message.append(this.messageContent).appendTo('body');
      this.message.modal({trigger: 'immediate', buttons: settings.buttons,
        resizable: settings.resizable, close: settings.close, isAlert: true});

      //Adjust Width if Set as a Setting
      if (settings.width !== 'auto') {
        this.content.closest('.modal').css({'max-width': 'none', 'width': settings.width});
      }

      //Setup the destroy event to fire on close.  Needs to fire after the "close" event on the modal.
      this.message.on('beforeClose', function () {
        var ok = self.element.triggerHandler('beforeClose');
        return ok;
      });
      this.message.on('beforeOpen', function () {
        var ok = self.element.triggerHandler('beforeOpen');
        return ok;
      });
      this.message.on('open', function () {
        self.element.trigger('open');
      });
      this.message.data('modal').element.on('afterClose', function() {
        self.destroy();
      });

      if (settings.isError) {
        this.title.addClass('is-error').prepend('<svg class="icon icon-error" focusable="false" aria-hidden="true"><use xlink:href="#icon-error"></svg>');
      } else {
        this.title.removeClass('is-error').find('svg').remove();
      }
    },
    destroy: function() {
      this.message.remove();
      $('body').off('beforeClose close beforeOpen open afterClose');
    }
  };

  // Support Chaining and Init the Control or Set Settings
  return this.each(function() {
    new Plugin(this, settings);
  });
};
