/**
* File Upload Control (TODO: bitly link to soho xi docs)
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

  $.fn.fileupload = function() {

    'use strict';

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
        var elem = this.element,
          fileInput = elem.find('input');

        elem.parent('.field').addClass('field-fileupload');

        //append markup
        var id = elem.find('input').attr('name'),
          instructions = Locale.translate('FileUpload'),
          label = $('<label for="' + id+'-filename' + '">' +  elem.text() + ' <span class="audible">' + instructions + '</span></label>'),
          shadowField = $('<input id="' + id+'-filename' + '" type="text">'),
          svg = '<span class="trigger" tabindex="-1"><svg aria-hidden="true" focusable="false" class="icon"><use xlink:href="#icon-folder"/></svg></span>';

        elem.before(label, shadowField);
        fileInput.after(svg);

        var input = elem.parent().find('[type="text"]');
        input.on('keypress.fileupload', function (e) {
          if (e.which === 13) {
            elem.find('input').trigger('click');
          }
        });

        if (fileInput.is(':disabled')) {
          input.attr('disabled', 'disabled');
        }

        fileInput.attr('tabindex', '-1').on('change.fileupload', function () {
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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
