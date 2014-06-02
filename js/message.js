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
          close: null,
          resize: null,
          button: []  //Passed through to modal
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

        this.closeBtn = $('<button type="button" class="btn-default btn-close">Close</button>').appendTo(this.content);
        this.message.append(this.messageContent).appendTo('body').modal({trigger: 'immediate', buttons: settings.buttons,
          resizable: settings.resizable, close: settings.close, resize: settings.resize});

        //Adjust Width if Set as a Setting
        if (settings.width !== 'auto') {
          this.content.closest('.modal').css({'max-width': 'none', 'width': settings.width});
        }

        //Call Close As an Option - For backwards Compat
        if (settings.close) {
          this.content.on('close', function (e) {
            settings.close(e, self.content);
          });
        }
        this.message.on('close', function () {
          if (content) {
            content.hide().appendTo('body');
          }
          self.message.remove();
        });
      }
    };

    // Support Chaining and Init the Control or Set Settings
    return this.each(function() {
      new Plugin(this, settings);
    });
  };

  //Migrate
  $.fn.inforMessageDialog = $.fn.message;

}));
