/**
* Resizable Control (TODO: bitly link to docs)
*/

(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function ($) {


  'use strict';

  $.fn.resize = function(options) {

    // Settings and Options
    var pluginName = 'resize',
        defaults = {
          axis: 'x'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        //Original Prototype http://jsfiddle.net/41h9pcpb/2/
        this.handleEvents();
      },

      // Handle Touch/Mouse Resize
      handleEvents: function() {
        var self = this;
        self.handle = null;

        this.element.find('.resize-handle').drag({axis: settings.axis}).on('drag.resziable', function (e, args) {
          self.element.width(args.left);
        });
      },

      // Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
        instance.show();
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
