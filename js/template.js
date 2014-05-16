/**
* Responsive PLugin Control
* @name Tabs
* @param {string} propertyName - The Name of the Property defaults to defaultValue
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

  $.fn.pluginName = function( options ) {

    // Tab Settings and Options
    var pluginName = 'pluginName',
        defaults = {
          propertyName: 'defaultValue'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
        init: function(){
          var self = this;
          console.log(self);
        },

        _privateMethod: function(){

        },

        publicMethod: function(){

        },

        destroy: function(){
            $.removeData(this.obj, pluginName);
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
