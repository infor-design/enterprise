/**
* Responsive Messages
* Deps: modal
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

  $.fn.message = function(options) {

    // Settings and Options
    var defaults = {
          title: 'Message Title',
          message: 'Message Summary',
          width: 'auto',
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
        this.title = $('<h1 class="modal-title" tabindex="0">' + settings.title + '</h3>').appendTo(this.messageContent);
        this.content = $('<div class="modal-body"><p class="message">'+ settings.message +'</p></div>').appendTo(this.messageContent);

        //Append The Content if Passed in
        if (!this.element.is('body')) {
          content = this.element;
          this.content.empty().append(content.show());
        }

        this.closeBtn = $('<button type="button" class="btn-primary btn-close">Close</button>').appendTo(this.content);
        this.message.append(this.messageContent).appendTo('body');
        this.message.modal({trigger: 'immediate', buttons: settings.buttons,
          resizable: settings.resizable, close: settings.close});

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

}));
