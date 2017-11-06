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
        this.setElements();
        this.handleEvents();
      },

      // Set elements
      setElements: function() {
        var self = this;
        self.isFirefox = Soho.env.browser.name === 'firefox';
        self.isSafari = Soho.env.browser.name === 'safari';

        self.targetElem = self.element;
        self.field = self.element.closest('.field');
        self.trigger = self.field.find('.btn-actions');

        // Fix: Some reason firfox "event.relatedTarget" not working
        // with un-focusable elements(ie.. div) on focusout, use "contentEditable"
        // https://stackoverflow.com/a/43010274
        if (self.isFirefox && self.trigger.length) {
          self.trigger[0].contentEditable = true;
          self.trigger.on('keydown.' + pluginName, function(e) {
            var key = e.which || e.keyCode || e.charCode || 0;
            if (key !== 9) {
              e.preventDefault();
              e.stopPropagation();
            }
          });
        }

        // Adjust some setting for popupmenu this trigger(action button)
        setTimeout(function() {
          self.popupmenuApi = self.trigger.data('popupmenu');
          if (self.popupmenuApi) {
            self.popupmenuApi.settings.returnFocus = false;
            self.popupmenuApi.settings.offset.y = 10;
          }
        }, 100);

        return this;
      },

      // Handle Events
      handleEvents: function() {
        var self = this,
          datepicker = self.element.data('datepicker'),
          timepicker = self.element.data('timepicker'),
          dropdown = self.element.data('dropdown'),
          lookup = self.element.data('lookup') || self.element.hasClass('lookup'),
          isFileupload = self.element.is('.fileupload'),
          isSearchfield = self.element.is('.searchfield'),

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
          canUnactive = function(e) {
            var r = !isFocus(self.element);
            r = self.trigger.is(e.relatedTarget) ? false : r;
            r = self.trigger.is('.is-open') ? false : r;
            r = datepicker && datepicker.isOpen() ? false : r;
            r = timepicker && timepicker.isOpen() ? false : r;
            r = dropdown && dropdown.isOpen() ? false : r;
            r = lookup && lookup.modal && lookup.modal.isOpen() ? false : r;
            return r;
          };

        // Update target element
        self.targetElem = dropdown ? dropdown.pseudoElem : self.targetElem;
        self.targetElem = isFileupload ? self.field.find('.fileupload[type="text"]') : self.targetElem;

        // Adjust stack order for dropdown
        if (dropdown) {
          setTimeout(function() {
            self.trigger.data('popupmenu')
              .menu.closest('.popupmenu-wrapper').css({'z-index': '4502'});
          }, 0);
        }
        // Adjust return focus for timepicker
        if (timepicker) {
          timepicker.settings.returnFocus = false;
        }
        // Move trigger(action-button) in to lookup-wrapper
        if (lookup) {
          self.field.addClass('is-fieldoptions');
          if (lookup.icon) {
            self.field.on('click.' + pluginName, '.lookup-wrapper .trigger', function() {
              doActive();
            });
          }
        }
        // Bind fileupload events
        if (isFileupload) {
          self.element.on('change.' + pluginName, function() {
            self.targetElem.focus();
          });
          self.field.on('click.' + pluginName, 'label.fileclose .trigger', function() {
            self.targetElem.focus();
          });
          self.field.on('click.' + pluginName, 'label.fileupload .trigger', function() {
            doActive();
          });
        }
        // Move trigger(action-button) in to searchfield-wrapper
        if (isSearchfield) {
          setTimeout(function() {
            self.trigger.add(self.trigger.next('.popupmenu'))
              .appendTo(self.element.closest('.searchfield-wrapper'));
          }, 0);
        }

        // Element events
        self.targetElem
          .on('focusin.' + pluginName, function() {
            doActive();
          })
          .on('focusout.' + pluginName, function(e) {
            var delay = self.isSafari ? 200 : 0;
            setTimeout(function() {
              if (canUnactive(e)) {
                doUnactive();
              }
            }, delay);
          });

        // Trigger(action button) events
        self.trigger
          .on('focusin.' + pluginName +' click.' + pluginName, function() {
            doActive();
          })
          .on('focusout.' + pluginName, function(e) {
            if (canUnactive(e)) {
              doUnactive();
            }
          })
          .on('selected.' + pluginName, function() {
            self.popupmenuApi.settings.returnFocus = true;
          })
          .on('close.' + pluginName, function(e, isCancelled) {
            if (canUnactive(e) && isCancelled) {
              doUnactive();
            }
          });

        // FIX: Safari - by default does not get focus on some elements while using tab key
        // https://stackoverflow.com/a/29106095
        if (self.isSafari) {
          self.targetElem.on('keydown.' + pluginName, function(e) {
            var key = e.which || e.keyCode || e.charCode || 0;
            if (key === 9 && !e.shiftKey) {
              self.trigger.focus();
              doActive();
              e.preventDefault();
              e.stopPropagation();
            }
          });

          self.element
            .on('listopened.' + pluginName, function() {
              doActive();
            })
            .on('listclosed.' + pluginName, function() {
              doUnactive();
            });
        }

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
        this.field
          .add(this.element)
          .add(this.targetElem)
          .add(this.trigger)
          .off('.' + pluginName);
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
