/**
* A Group of Functions Related to Forms/ Form Fields
*/
(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }

}(function ($) {

  //Make something disabled by adding the disabled attribute or calling plugin
  $.fn.disable = function() {
    $.each(this.data(), function(index, value) {
      if (value.disable) {
        value.disable();
      }
    });
    this.prop('disabled', true);
    return this;
  };

  //Make something enabled by adding the disabled attribute or calling plugin
  $.fn.enable = function() {
    $.each(this.data(), function(index, value) {
      if (value.enable) {
        value.enable();
      }
    });
    this.prop('disabled', false);
    return this;
  };

  //Track Dirty on an Object: TODO
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
            cssClass = '';

          if (input.attr('data-trackdirty') !== 'true') {
            return;
          }

          //Add Class and Icon
          input.addClass('dirty');
          if (input.attr('type') === 'checkbox' || input.attr('type') === 'radio') {
            cssClass += ' checked';
          }
          if (!input.prev().is('.icon-dirty')) {
            input.before('<svg class="icon icon-dirty' + cssClass + '" focusable="false" aria-hidden="true"><use xlink:href="#icon-arrow-down"></svg>');
          }

          //Trigger Event
          input.trigger('dirty');

          //Handle Reseting value back
          if (valMethod(input) === input.data('original')) {
            input.removeClass('dirty');
            input.prev('.icon-dirty').remove();
          }
        });
      });
    return this;
  };

}));

