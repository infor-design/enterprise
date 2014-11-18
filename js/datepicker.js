/**
* Datepicker Control (link to docs)
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

  $.fn.datepicker = function(options) {

    // Settings and Options
    var pluginName = 'datepicker',
        defaults = {
          dateFormat: '##/##/####'  //TODO from localization
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
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = $('<svg class="icon"><use xlink:href="#icon-datepicker"/></svg>').insertAfter(this.element);

        if (!this.element.data('mask')) {
          this.element.attr('data-mask', settings.dateFormat).mask();
        }
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.on('click.datepicker', function () {
          self.openCalendar();
          self.element.focus();
        });
      },

      openCalendar: function () {
        var header = $('<div class="datepicker-header">November 2014</div>'),
          table = $('<table class="datepicker-calendar"></table>'),
          footer = $('<div class="datepicker-header">November 2014</div>'),
          calendar = $('<div class="datepicker-popup"></div>').append(header, table, footer);

        this.trigger.popover({content: calendar, trigger: 'immediate',
            placement: 'offset', width: '200'});

      }
    };

    // Initialize the plugin (Once)
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
