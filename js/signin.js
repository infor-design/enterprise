/**
* SignIn Control
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

  $.fn.signin = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'signin',
        defaults = {
          propertyName: 'defaultValue'
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
        this.handleKeys();
      },

      handleKeys: function() {
        var form = this.element.find('form'),
          self = this,
          cssIcon = $('<span class="icon-capslock"><span class="inner">' + Locale.translate('CapsLockOn') + '</span></span>');

          // Disable default [caps lock on] popup in IE
          document.msCapsLockWarningOff = true;

          this.element.on('keypress.signin', '[type="password"]', function (e) {
            var field = $(this),
              fieldParent = field.parent('.field');
              //TODO: Any way to prevent chrome and ie from showing???
            if (self.isCapslock(e)) {
              if(!$('.icon-capslock', fieldParent).length) {
                fieldParent.append(cssIcon);
                $('body').toast({audibleOnly: true, message: Locale.translate('CapsLockOn')});
              }
            }
            else {
              fieldParent.find('.icon-capslock').remove();
            }

            if (field.hasClass('error')) {
              fieldParent.find('.icon-capslock').remove();
            }
          })
          .on('blur.signin', '[type="password"]', function () {
             //$('.icon-capslock', $(this).parent('.field')).remove();
          });

          form.on('submit.signin', function () {
            var confirmPassword = $('#confirm-password');
            if (confirmPassword.length && ((!(confirmPassword.val()).length) || (confirmPassword.hasClass('error')))) {
              return false;
            }
            $('#username').val($('#username-display').val());
            $('#password').val($('#password-display').val());
            $('#new-password').val($('#new-password-display').val());
          });
      },

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

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        $('body').off('keypress.signin');
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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
