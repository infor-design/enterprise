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
          $('#username-hidden').val($('#username').val());
          $('#password-hidden').val($('#password').val());
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
