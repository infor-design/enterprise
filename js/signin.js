/**
* SignIn Control (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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

  //NOTE: Just this part will show up in SoHo Xi Builds.

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
        var form = this.element.find('form');

        //-----------------------------------------------------------
        var isCapslock = function(e) {
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
        };
        var passwordFields = this.element.find('[type="password"]');
        passwordFields.on('keypress.signin', function (e) {
          console.log(isCapslock(e));
        });
        //-----------------------------------------------------------

        /* TODO: Caps Like Down
          var passwordFields = this.element.find('[type="password"]'),
          passwordFields.on('keypress.signin', function (e) {

          if (e.which === 13) {
            form.submit();
          }


          var input = $(this);
          setTimeout(function () {
            var key = String.fromCharCode(e.which),
              val = input.val();

            if (val === '') {
              return;
            }

            if (key.toUpperCase() === key && key.toLowerCase() !== key && !e.shiftKey ) {
               console.log();
            }
          }, 10);
        });*/

        form.on('submit.signin', function () {
          var $cPass = $('#confirm-password');
          if($cPass.length && ((!($cPass.val()).length) || ($cPass.hasClass('error')))) {
            return false;
          }
          $('#username').val($('#username-dsp').val());
          $('#password').val($('#password-dsp').val());
          $('#new-password').val($('#new-password-dsp').val());
          //console.log($(this).serialize());
        });

      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
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
