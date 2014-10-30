/**
* A Group of Functions Related to Forms/ Form Fields
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

  //Make something disabled by adding the disabled attribute or calling plugin
  $.fn.disable = function() {
    $.each(this.data(), function(index, value) {
      if (value.disable) {
        value.disable();
      }
    });
    this.attr('disabled', 'disabled');
    return this;
  };

  //Make something enabled by adding the disabled attribute or calling plugin
  $.fn.enable = function() {
    $.each(this.data(), function(index, value) {
      if (value.enable) {
        value.enable();
      }
    });
    this.removeAttr('disabled');
    return this;
  };

  //Track Dirty on an Object: TODO
  $.fn.trackdirty = function() {
      this.each(function () {
        var input = $(this);
        input.data('original', input.val())
           .on('change.dirty', function () {

            //Add Class and Icon
            input.addClass('dirty');
            if (!input.prev().is('.icon-dirty')) {
              input.before('<svg class="icon icon-dirty"><use xlink:href="#icon-dropdown-arrow"></svg>');
            }

            //Trigger Event
            input.trigger('dirty');

            //Handle Reseting value back
            if (input.val() === input.data('original')) {
              input.removeClass('dirty');
              input.prev('.icon-dirty').remove();
            }
          });
      });
    return this;
  };

}));
