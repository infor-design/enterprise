/**
* Button Control - Adds wripple effect
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  $.fn.button = function() {

    // Settings and Options
    var pluginName = 'button';

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {
      init: function() {
        // Add Ripple Effect
        this.element.addClass('ripple');
        this.element.on('mousedown.button touchstart.button', function (e) {
          var btn = $(this),
              ripple = $('<div></div>').addClass('ripple-effect'),
              btnOffset = btn.offset(),
              xPos = e.pageX - btnOffset.left,
              yPos = e.pageY - btnOffset.top;

         ripple.css({
              top: yPos - (ripple.height()/2),
              left: xPos - (ripple.width()/2)
            }).appendTo(btn);

          setTimeout(function(){
            ripple.remove();
          }, 1000);
        });
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
