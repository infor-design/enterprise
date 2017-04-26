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
 * @private
 */

 /**
  * Make something disabled
  * @private
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
  * @private
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
  * @private
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
  * @private
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
          var el = input,
            field = input.closest('.field'),
            label = $('label:visible', field),
            d = {class: '', style: ''};

          // Used element without .field wrapper
          if (!label[0]) {
            label = input.next('label');
          }

          if (input.attr('data-trackdirty') !== 'true') {
            return;
          }

          // Add class to element
          input.addClass('dirty');

          //Set css class
          if (input.is('[type="checkbox"], [type="radio"]')) {
            d.class += ' dirty-'+ input.attr('type');
            d.class += input.is(':checked') ? ' is-checked' : '';
          }
          if (input.is('select')) {
            d.class += ' is-select';
            el = $('.dropdown-wrapper input[type="text"]', field);
          }

          //Add class and icon
          d.icon = el.prev();
          if (!d.icon.is('.icon-dirty')) {
            if (input.is('[type="checkbox"]')) {
              d.rect = label[0].getBoundingClientRect();
              d.style = ' style="left:'+ d.rect.left +'px; top:'+ d.rect.top +'px;"';
            }
            d.icon = '<span class="icon-dirty'+ d.class +'"'+ d.style +'></span>';
            d.msg = Locale.translate('MsgDirty') || '';
            d.msg = '<span class="audible msg-dirty">'+ d.msg +'</span>';

            // Add icon and msg
            el.before(d.icon);
            label.append(d.msg);

            // Cache icon and msg
            d.icon = el.prev();
            d.msg = label.find('.msg-dirty');
          }

          //Handle reseting value back
          if (valMethod(input) === input.data('original')) {
            input.removeClass('dirty');
            $('.icon-dirty, .msg-dirty', field).add(d.icon).add(d.msg).remove();
            input.trigger('pristine');
            return;
          }

          //Trigger event
          input.trigger('dirty');

        });
      });
    return this;
  };

  // Fix: Labels without the "for" attribute
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

  // Fix: Radio buttons was not selecting when click and than use arrow keys on Firefox
  $(function () {
    $('input:radio').on('click.radios', function() {
      this.focus();
    });
  });

  // Add css classes to parent for apply special rules
  $(function () {
    var addCssClassToParent = function(elemArray, cssClass) {
      for (var i = 0, l = elemArray.length; i < l; i++) {
        $(elemArray[i]).parent().addClass(cssClass);
      }
    };
    addCssClassToParent($('.field > input:checkbox, .field > .inline-checkbox'), 'field-checkbox');
    addCssClassToParent($('.field > input:radio, .field > .inline-radio'), 'field-radio');
  });

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
