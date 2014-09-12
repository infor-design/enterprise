/**
* CardStack List Control
* @name cardstack
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  $.fn.cardstack = function(options) {

    // Settings and Options
    var pluginName = 'cardstack',
      defaults = {
        dataset: null,
        templateId: null
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Plugin.prototype = {
      init: function() {
        this.render();
      },

      render: function() {
        if (settings.dataset && settings.templateId) {
          console.log('rendering');
        }
      },

      destroy: function() {
        this.element.removeData(pluginName);
        this.element.empty();
      }
    };

    // Initializing the Control Once or Call Methods.
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
