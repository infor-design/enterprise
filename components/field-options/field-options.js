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

  $.fn.fieldoptions = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'fieldoptions',
        defaults = {
        },
        settings = $.extend({}, defaults, options);

    /**
    *
    * @class FieldOptions
    */
    function FieldOptions(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // FieldOptions Methods
    FieldOptions.prototype = {

      init: function() {
        this.trigger = this.element.closest('.field').find('.btn-actions');
        this.handleEvents();
      },

      // Handle Events
      handleEvents: function() {
        var self = this,
          datepicker = self.element.data('datepicker'),
          timepicker = self.element.data('timepicker'),

          // Helper functions
          isFocus = function(elem) {
            return $(':focus').is(elem);
          },
          doActive = function() {
            self.element.add(self.trigger).addClass('is-active');
          },
          doUnactive = function() {
            self.element.add(self.trigger).removeClass('is-active');
          },
          canUnactive = function() {
            var r = !isFocus(self.trigger);

            r = datepicker && datepicker.isOpen() ? false : r;
            r = timepicker && timepicker.isOpen() ? false : r;
            return r;
          };

        // Element events
        self.element
          .on('focus.' + pluginName, function() {
            var delay = timepicker ? 30 : 0;
            setTimeout(function() {
              doActive();
            }, delay);
          })
          .on('blur.' + pluginName, function() {
            setTimeout(function() {
              if (canUnactive()) {
                doUnactive();
              }
            }, 0);
          });

          // Trigger(action button) events
          self.trigger
            .on('focus.' + pluginName, function() {
              doActive();
            })
            .on('blur.' + pluginName, function() {
              setTimeout(function() {
                if (!self.trigger.is('.is-open') && canUnactive()) {
                  doUnactive();
                }
              }, 0);
            })
            .on('close.' + pluginName, function() {
              setTimeout(function() {
                if (canUnactive()) {
                  doUnactive();
                }
              }, 0);
            });

        return this;
      }, // END: Handle Events -------------------------------------------------

      // Make enable
      enable: function () {
        this.trigger.prop('disabled', false);
        return this;
      },

      // Make disable
      disable: function () {
        this.trigger.prop('disabled', true);
        return this;
      },

      // Unbind all events
      unbind: function() {
        this.element.off(
          'focus.' + pluginName +
          ' blur.' + pluginName
        );
        this.trigger.off(
          'focus.' + pluginName +
          ' blur.' + pluginName +
          ' close.' + pluginName
        );
        return this;
      },

      // Update this plugin
      updated: function() {
        return this
          .unbind()
          .init();
      },

      // Teardown
      destroy: function() {
        this.unbind();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new FieldOptions(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
