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

    /**
     * @constructor
     * @param {Object} element
     */
    function Toast(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Toast Methods
    Toast.prototype = {

      init: function() {
        this.settings = settings;
        this.show();
      },

      // Show a Single Toast Message
      show: function() {
        var self = this,
          settings = self.settings,
          maxHideTime = parseFloat(settings.timeout),
          isPausePlay = false,
          percentage = 100,
          timer,
          container = $('#toast-container'),
          toast = $('<div class="toast"><span class="toast-title">'+ settings.title+
            '</span><span class="toast-message">'+ settings.message + '</span></div>'),
          closeBtn = $('<button type="button" class="btn-icon btn-close" title="'+ Locale.translate('Close')+
            '" aria-hidden="true">' + $.createIcon('close') + '<span class="audible"> '+ Locale.translate('Close')+'</span></button>'),
          progress = $('<div class="toast-progress"></div>');

        if (!container.length) {
          container = $('<div id="toast-container" class="toast-container" aria-relevant="additions" aria-live="polite"></div>').appendTo('body');
        }

        container.removeClass('toast-top-left toast-top-right toast-bottom-right toast-bottom-left')
          .addClass('toast-' + settings.position.replace(' ', '-'));

        settings.timeout = settings.audibleOnly ? 100 : settings.timeout;

        // Start timer
        timer = new $.fn.timer(function() {
          self.remove(toast);
        }, settings.timeout);

        if (settings.progressBar) {
          toast.append(progress);
        }

        $(timer.event).on('update', function(e, data) {
          percentage = ((maxHideTime - data.counter) / maxHideTime) * 100;

          if (Locale.isRTL()) {
            percentage = 100 - percentage;
          }

          if (settings.progressBar) {
            progress.width(percentage + '%');
          }
        });

        container.append(toast);
        toast.addClass((settings.audibleOnly ? 'audible' : 'effect-scale'));
        toast.append(closeBtn);

        $(document).on('keydown keyup', function(e) {
          e = e || window.event;
          if(e.ctrlKey && e.altKey && e.keyCode === 80) { //[Control + Alt + P] - Pause/Play toggle
            isPausePlay = e.type === 'keydown' ? true : false;
            timer[isPausePlay ? 'pause' : 'resume']();
          }
        });

        toast.on('mousedown.toast touchstart.toast mouseup.toast touchend.toast', function (e) {
          isPausePlay = /mousedown|touchstart/i.test(e.type) ? true : false;
          timer[isPausePlay ? 'pause' : 'resume']();
        });

        closeBtn.on('click', function () {
          timer.cancel();
          self.remove(toast);
        });
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
        instance = $.data(this, pluginName, new Toast(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
