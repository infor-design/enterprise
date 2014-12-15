/**
* Timepicker Control (TODO: bitly link to docs)
*/

(function(factory) {
  'use strict';

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

  'use strict';

  $.fn.timepicker = function(options) {

    // Settings and Options
    var pluginName = 'timepicker',
        defaults = {
          mode: 'standard' // options: 'standard', 'startToEnd'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function TimePicker(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    TimePicker.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = $('<svg class="icon">' +
                         '<use xlink:href="#icon-timepicker"/>' +
                         '</svg>').insertAfter(this.element);

        // Add Aria
        this.element.attr('aria-haspopup', true);
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.on('click.datepicker', function () {
          self.openTimePopup();
          self.element.focus();
        });

        this.element.on('focus.datepicker', function () {
          self.mask();
        });

        this.handleKeys();
      },

      handleKeys: function() {

      },

      // Add masking with the mask function
      mask: function () {
        var timeFormat = Locale.calendar().timeFormat;

        settings.dateFormat = (typeof Locale === 'object' ?
                              timeFormat.short :
                              settings.dateFormat);

        if (this.element.data('mask')) {
          this.element.data('mask').destroy();
        }

        var mask = '## : ## am';

        this.element
          .attr('data-mask', mask)
          .attr('data-validate', 'time')
          .attr('data-mask-mode', 'time')
          .mask().validate();
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      openTimePopup: function() {
        var self = this,
          popupContent;

        if (this.element.is(':disabled')) {
          return;
        }

        if (this.popup && this.popup.is(':visible')) {
          self.popup.hide();
          popupContent = self.popup.find('.timepicker-content').empty();
        }

        /*

        // Build the inner-picker HTML
        if (!popupContent) {
          popupContent = $('<div class="timepicker-content"></div>');
        }
        var hourCounter = 1,
          hourSelect = $('<select class="hours dropdown"></select>');

        while(hourCounter < 13) {
          hourSelect.append($('<option value="'+ +'">'));
        }
        */

      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
      },

      isDisabled: function() {
        return this.element.prop('disabled');
      },

      // Teardown
      destroy: function() {
        this.trigger.remove();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend(instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new TimePicker(this, settings));
      }
    });
  };
}));
