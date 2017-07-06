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

    /**
    * A trigger field for uploading a single file.
    *
    * @class FileUpload
    * @param {Boolean} none  &nbsp;-&nbsp; No options
    */
    function FileUpload(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // FileUpload Methods
    FileUpload.prototype = {

      init: function() {
        this.build();
      },

      // Example Method
      build: function() {
        var elem = this.element;
        this.fileInput = elem.find('input');

        elem.parent('.field').addClass('field-fileupload');

        //append markup
        var id = elem.find('input').attr('name'),
          elemClass = elem.find('input').attr('class'),
          instructions = Locale.translate('FileUpload'),
          label = $('<label for="'+ id +'-filename">'+ elem.text() +' <span class="audible">'+ instructions +'</span></label>'),
          shadowField = $('<input readonly id="'+ id +'-filename" class="fileupload-background-transparent'+ (elemClass ? ' '+ elemClass : '') +'" type="text">'),
          svg = '<span class="trigger" tabindex="-1">' + $.createIcon('folder') + '</span>';

        elem.before(label, shadowField);
        this.fileInput.after(svg);

        this.textInput = elem.parent().find('[type="text"]');
        this.textInput.on('keypress.fileupload', function (e) {
          if (e.which === 13 || e.which === 32) {
            e.stopPropagation();
            elem.find('input').trigger('click');
          }
        });

        if (this.fileInput.is(':disabled')) {
          this.textInput.prop('disabled', true);
        }

        if (this.fileInput.attr('readonly')) {
          this.textInput.prop('disabled', false);
          this.textInput[0].classList.remove('fileupload-background-transparent');
          this.fileInput.attr('disabled', 'disabled');
        }

        this.fileInput.attr('tabindex', '-1').on('change.fileupload', function () {
          elem.prev('input').val(this.files[0].name);
        });
      },

      /**
      * Teardown - Remove added markup and events
      */
      destroy: function() {
        this.fileInput.removeAttr('tabindex').off('change.fileupload');
        this.textInput.off('keypress.fileupload');
        this.element.closest('.field-fileupload')
          .removeClass('field-fileupload')
          .find('>label:first, >[type="text"]:first, .trigger, .icon-dirty, .msg-dirty').remove();

        $.removeData(this.element[0], pluginName);
      },

      /**
      * Disable the input and button.
      */
      disable: function() {
        this.textInput.prop('disabled', true);
        this.fileInput.prop('disabled', true);
      },

      /**
      * Enable the input and button.
      */
      enable: function() {
        this.textInput.prop('disabled', false).prop('readonly', false);
        this.fileInput.removeAttr('disabled');
      },

      /**
      * Make the input readonly and disable the button.
      */
      readonly: function() {
        this.textInput.prop('readonly', true);
        this.fileInput.prop('disabled', true);
      }

    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new FileUpload(this));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
