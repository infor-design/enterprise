
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

  /**
  * Make something disabled
  */
  $.fn.disable = function() {
    $.each(this.data(), function(index, value) {
      if (value.disable) {
        value.disable();
      }
    });
    this.prop('disabled', true);
    return this;
  };

  /**
  * Make something enabled
  */
  $.fn.enable = function() {
    $.each(this.data(), function(index, value) {
      if (value.enable) {
        value.enable();
      }
    });
    this.prop('disabled', false);
    return this;
  };

  /**
  * Make something readonly
  */
  $.fn.readonly = function() {
    $.each(this.data(), function(index, value) {
      if (value.readonly) {
        value.readonly();
      }
    });
    this.prop('readonly', true);
    return this;
  };

  /**
  * Track Input is changed from last submit
  */
  $.fn.trackdirty = function() {
      this.each(function () {
        var input = $(this);

        function valMethod(elem) {
          switch(elem.attr('type')) {
            case 'checkbox':
            case 'radio':
              return elem.prop('checked');
            default:
              return elem.val();
          }
        }

        input.data('original', valMethod(input))
         .on('change.dirty', function () {
          var input = $(this),
            el = input,
            field = input.closest('.field'),
            cssClass = '';

          if (input.attr('data-trackdirty') !== 'true') {
            return;
          }

          //Set css class
          input.addClass('dirty');
          if ((input.attr('type')==='checkbox' || input.attr('type')==='radio') && input.is(':checked')) {
            cssClass += ' is-checked';
          }
          if (input.is('select')) {
            cssClass += ' is-select';
            el = $('.dropdown-wrapper input[type="text"]', field);
          }

          //Add class and icon
          if (!el.prev().is('.icon-dirty')) {            
            el.before('<span class="icon-dirty' + cssClass + '"></span>');            
            $('label:visible', field).append('<span class="audible msg-dirty">'+ Locale.translate('MsgDirty') +'</span>');
          }

          //Trigger event
          input.trigger('dirty');

          //Handle reseting value back
          if (valMethod(input) === input.data('original')) {
            input.removeClass('dirty');
            $('.icon-dirty, .msg-dirty', field).remove();
          }
        });
      });
    return this;
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
