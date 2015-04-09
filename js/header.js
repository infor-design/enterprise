/**
* Header Control
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

  $.fn.header = function(options) {

     // Tab Settings and Options
    var pluginName = 'header',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Theme, Personalization, Language Changer, Scrolling
    Plugin.prototype = {
      init: function() {
         this.initPageChanger();
      },

      initPageChanger: function () {
        this.element.on('selected', function (e, link) {
          var ul = link.parent().parent(),
            origMenu = ul.attr('data-original-menu');

          ul.find('.is-checked').removeClass('is-checked');
          link.parent().addClass('is-checked');

          if (origMenu) {
            origMenu = $('#' + origMenu);
            var opt = origMenu.children('li').filter(function() {
              return $(this).children('a').text() === link.text();
            });

            origMenu.children('li').removeClass('is-checked');
            opt.addClass('is-checked');
          }

          // Change Theme
          if (link.attr('data-theme')) {
            $('body').fadeOut('fast', function() {
              $('#stylesheet').attr('href', '/stylesheets/'+ link.attr('data-theme') +'.css');
              $(this).fadeIn('fast');
            });
            return;
          }

          // TODO: Change Lang
          if (link.attr('data-lang')) {
            Locale.set(link.attr('data-lang'));
            return;
          }

          // Change Color
          var color = link.attr('data-rgbcolor');
          $('.is-personalizable').css('background-color', color);
        });
      }
    };

    // Keep the Chaining while Initializing the Control (Only Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

}));
