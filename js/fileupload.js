/**
* File Upload Control (TODO: bitly link to soho xi docs)
*/

(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function ($) {

  'use strict';

  $.fn.fileupload = function() {

    // Settings and Options
    var pluginName = 'fileupload';

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.build();
      },

      // Example Method
      build: function() {
        var elem = this.element;

        elem.parent('.field').addClass('field-fileupload');

        elem.find('span').attr({'tabindex': '0', 'role' : 'button'})
          .on('keypress.fileupload', function (e) {
            if (e.which === 13) {
              elem.find('input').trigger('click');
            }
          });

        elem.find('input').attr('tabindex', '-1').on('change.fileupload', function () {
          var fileInput = $(this);
          elem.prev('input').val(fileInput.val());
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
      if (!instance) {
        instance = $.data(this, pluginName, new Plugin(this));
      }
    });
  };
}));
