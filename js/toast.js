/**
* Toast Control (TODO: bitly link to docs)
*/

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

  $.fn.toast = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'toast',
        defaults = {
          title: '(Title)',
          message: '(Content)',
          position: 'top right',  //top left, bottom left, bottom right (center??)
          audibleOnly: false,
          progressBar: true,
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
          closeBtn = $('<button type="button" class="btn-close" title="'+ Locale.translate('Close') +'" aria-hidden="true"></button>'),
          toast = $('<div class="toast"></div>'),
          progress = $('<div class="toast-progress"></div>');

        if (container.length === 0) {
          container = $('<div id="toast-container" class="toast-container" aria-relevant="additions" aria-live="polite" role="alert"></div>').appendTo('body');
        }

        //TODO: RTL
        container.removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
          .addClass('toast-' + this.settings.position.replace(' ', '-'));

        toast.append('<span class="toast-title">'+ this.settings.title + '</span>');
        toast.append('<span class="toast-message">'+ this.settings.message + '</span>');

        if (this.settings.progressBar) {
          toast.append(progress);
          var maxHideTime = parseFloat(self.settings.timeout),
              hideEta = new Date().getTime() + maxHideTime,
              interval = setInterval(function () {
            var percentage = ((hideEta - (new Date().getTime())) / maxHideTime) * 100;
            progress.width(percentage + '%');
          }, 10);
        }

        container.append(toast);
        toast.addClass((this.settings.audibleOnly ? 'audible' : 'effect-scale'));
        toast.append(closeBtn);

        closeBtn.on('click', function () {
          self.remove(toast);
          clearInterval(interval);
        });

        setTimeout(function () {
         self.remove(toast);
         clearInterval(interval);
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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
