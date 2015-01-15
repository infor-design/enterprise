/**
* Toast Control (TODO: bitly link to docs)
*/

(function(factory) {
  'use strict';

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

  'use strict';

  $.fn.toast = function(options) {

    // Settings and Options
    var pluginName = 'toast',
        defaults = {
          title: '(Title)',
          message: '(Content)',
          position: 'top right',  //top left, bottom left, bottom right (center??)
          audibleOnly: false,
          timeout: 6000
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
        this.settings = settings;
        this.show();
      },

      // Show a Single Toast Message
      show: function() {
        var self = this,
          container = $('#toast-container'),
          closeBtn = $('<button type="button" class="btn-close" aria-hidden="true"></button>'),  //TODO: Localize
          toast = $('<div class="toast"></div>');

        if (container.length === 0) {
          container = $('<div id="toast-container" class="toast-container" aria-relevant="additions" aria-live="polite" role="alert"></div>').appendTo('body');
        }

        //TODO: RTL
        container.removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
          .addClass('toast-' + this.settings.position.replace(' ', '-'));

        toast.append('<span class="toast-title">'+ this.settings.title + '</span>');
        toast.append('<span class="toast-message">'+ this.settings.message + '</span>');
        container.append(toast);
        toast.addClass((this.settings.audibleOnly ? 'audible' : 'effect-scale'));
        toast.append(closeBtn);

        closeBtn.on('click', function () {
          self.remove(toast);
        });

        setTimeout(function () {
         self.remove(toast);
        }, (this.settings.audibleOnly ? 100 : settings.timeout));
      },

      // Remove the Message and Animate
      remove: function (toast) {
        if (this.settings.audibleOnly) {
          toast.remove();
          return;
        }

        toast.addClass('effect-scale-hide');
        setTimeout(function () {
          toast.remove();
        }, 500);
      },

      // Teardown
      destroy: function() {
        $('#toast-container').remove();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
        instance.show();
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
