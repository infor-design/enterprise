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
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */

 /**
  * Make something disabled
  * @function external:"jQuery.fn".disable
  */
  $.fn.disable = function() {
    $.each(this.data(), function(index, value) {
      if (value instanceof jQuery) {
        return;
      }

      if (value.disable) {
        value.disable();
      }
    });
    this.prop('disabled', true);
    return this;
  };

 /**
  * Make something enabled
  * @function external:"jQuery.fn".enabled
  */
  $.fn.enable = function() {
    $.each(this.data(), function(index, value) {
      if (value instanceof jQuery) {
        return;
      }

      if (value.enable) {
        value.enable();
      }
    });
    this.prop('disabled', false);
    return this;
  };

 /**
  * Make something readonly
  * @function external:"jQuery.fn".readonly
  */
  $.fn.readonly = function() {
    $.each(this.data(), function(index, value) {
      if (value instanceof jQuery) {
        return;
      }

      if (value.readonly) {
        value.readonly();
      }
    });
    this.prop('readonly', true);
    return this;
  };

 /**
  * Track Input is changed from last submit
  * @function external:"jQuery.fn".trackdirty
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
          if ((input.attr('type')==='checkbox' || input.attr('type')==='radio')) {
            cssClass +=' dirty-'+ input.attr('type') +
                      (input.is(':checked') ? ' is-checked' : '');
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

          //Handle reseting value back
          if (valMethod(input) === input.data('original')) {
            input.removeClass('dirty');
            $('.icon-dirty, .msg-dirty', field).remove();
            input.trigger('pristine');
            return;
          }

          //Trigger event
          input.trigger('dirty');

        });
      });
    return this;
  };

 /**
  * Labels without the "for" attribute
  */
  $(function () {
    var str, control,
      labelText = $('.label-text'),
      labels = labelText.closest('label, .label');

    labels.each(function () {
      control = $('input, textarea, select', this);
      str = control.attr('class');

      $(this).addClass(function () {
        // Add "inline" and "inline-{control}" class to label
        // assuming control class is first thing in class string
        return 'inline' + (str ? ' inline-'+ (str.indexOf(' ') === -1 ? str : str.substr(0, str.indexOf(' '))) : '');
      });
    });
  });

 /**
  * Fix: Radio buttons was not selecting when click and than use arrow keys on Firefox
  */
  $(function () {
    $('input:radio').on('click.radios', function() {
      this.focus();
    });
  });

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
