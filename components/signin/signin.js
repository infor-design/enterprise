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

  $.fn.signin = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'signin',
        defaults = {},
        settings = $.extend({}, defaults, options);

    /**
     * @class {SignIn}
     * @constructor
     * @param {object} element
     */
    function SignIn(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    SignIn.prototype = {

      /**
       * @private
       */
      init: function() {
        this.settings = settings;
        this.handleKeys();
      },

      /**
       * Checks a keyboard event for a CAPS LOCK modifier.
       * @param {jQuery.Event} e
       * @returns {boolean}
       */
      isCapslock: function(e) {
        e = (e) ? e : window.event;
        var charCode = (e.which) ? e.which : ((e.keyCode) ? e.keyCode : false),
         shifton = (e.shiftKey) ? e.shiftKey : ((e.modifiers) ? (!!(e.modifiers & 4)) : false);

        if (charCode >= 97 && charCode <= 122 && shifton) {
          return true;
        }
        if (charCode >= 65 && charCode <= 90 && !shifton) {
          return true;
        }
        return false;
      },

      /**
       * Teardown - Remove added markup and events
       */
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        $('body').off('keypress.signin blur.signin change.signin');
      },

      /**
       * @fires SignIn#events
       * @param {object} keypress
       * @param {object} blur
       * @param {object} change
       *
       */
      handleKeys: function() {
        var self = this,
          cssIcon = $.createIconElement({ classes: 'icon-capslock', icon: 'capslock' });

        // Disable default [caps lock on] popup in IE
        document.msCapsLockWarningOff = true;

        this.element
        .on('keypress.signin', '[type="password"]', function (e) {
          var field = $(this),
            fieldParent = field.parent('.field'),
            iconCapslock = $('.icon-capslock', fieldParent);

          if (self.isCapslock(e) && !field.hasClass('error')) {
            if(!iconCapslock.length) {
              fieldParent.append(cssIcon);
              $('body').toast({audibleOnly: true, message: Locale.translate('CapsLockOn')});
            }
          } else {
            iconCapslock.remove();
          }

        })
        .on('blur.signin change.signin', '[type="password"]', function () {
          var field = $(this),
            fieldParent = field.closest('.field'),
            iconCapslock = $('.icon-capslock', fieldParent);

          // Wait for error class to be added
          setTimeout(function() {
            if (iconCapslock && iconCapslock.length) {
              if (field.hasClass('error')) {
                iconCapslock.remove();
              } else {
                fieldParent.append(cssIcon);
              }
            }
          }, 150);

        });
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new SignIn(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
