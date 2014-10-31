/**
* Textarea Control (TODO: link to docs)
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  $.fn.textarea = function(options) {

    // Settings and Options
    var pluginName = 'textarea',
        defaults = {
          characterCounter: true, //But needs a maxlength
          printable: true
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        if (settings.characterCounter && this.element.attr('maxlength')) {
          this.counter = $('<span class="textarea-wordcount">Chars Left..</span>').insertAfter(this.element);
        }
        if (settings.printable) {
          this.printarea = $('<div class="textarea-print"></div>').insertBefore(this.element);
        }
        this.handleEvents();
        this.update(this);
      },

      // Attach Events
      handleEvents: function() {
        var self = this;
        this.element.on('keyup.textarea, blur.textarea', function () {
          self.update(self);
        });
      },

      update: function (self) {
        var length = self.element.val().length,
          max = self.element.attr('maxlength'),
          text = (parseInt(max)-length).toString() + ' Characters Left';

          //TODO Localize
          if (self.counter) {
            if (length === 0) {
              text = 'Character count maximum of ' + max;
              self.counter.removeClass('empty').text(text);
            } else {
              self.counter.text(text);
              self.counter.addClass('empty').text(text);
            }

          }

          if (self.printarea) {
            self.printarea.text(self.element.val());
          }
      },

      // Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.printarea.remove();
        this.counter.remove();
        this.element.off('keyup.textarea');
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
