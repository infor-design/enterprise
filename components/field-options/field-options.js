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
        self.hoverElem = self.targetElem;
        self.field = self.element.closest('.field, .radio-group');
        self.fieldParent = self.element.closest('.field').parent();
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
          isSpinbox = self.element.is('.spinbox'),
          isColorpicker = self.element.is('.colorpicker'),
          isRadio = self.element.closest('.radio-group').length > 0,
          isFieldset = self.element.is('.data') && self.element.closest('.summary-form').length > 0,

          // Helper functions
          isFocus = function(elem) {
            return $(':focus').is(elem);
          },
          addFocused = function(elem) {
            (elem || self.element).addClass('is-focused');
          },
          removeFocused = function(elem) {
            (elem || self.element).removeClass('is-focused');
          },
          doActive = function() {
            self.element.add(self.trigger).add(self.field).add(self.fieldParent).addClass('is-active');
          },
          doUnactive = function() {
            self.element.add(self.trigger).add(self.field).add(self.fieldParent).removeClass('is-active');
          },
          canUnactive = function(e) {
            var r = !isFocus(self.element);
            r = self.trigger.is(e.relatedTarget) ? false : r;
            r = self.trigger.is('.is-open') ? false : r;
            r = datepicker && datepicker.isOpen() ? false : r;
            r = timepicker && timepicker.isOpen() ? false : r;
            r = $(e.relatedTarget).prev().is(self.element) ? false : r;
            r = dropdown && dropdown.isOpen() ? false : r;
            r = lookup && lookup.modal && lookup.modal.isOpen() ? false : r;
            r = isColorpicker && self.element.is('.is-open') ? false : r;
            return r;
          },
          onPopupToggle = function(elem) {
            if (elem.trigger) {
              elem.trigger
                .off('show.' + pluginName).on('show.' + pluginName, function () {
                  doActive();
                })
                .off('hide.' + pluginName).on('hide.' + pluginName, function (e) {
                  if (canUnactive(e)) {
                    doUnactive();
                    self.element.removeClass('is-open');
                  }
                });
            }
          },
          getTriggerTopVal = function() {
            var height = self.element.height();

            if (isFieldset) {
              var lineHeight = parseInt(self.element.css('line-height'), 10);
              if (height > lineHeight) {
                self.element.css({'margin-bottom': '', 'padding-bottom': ''});
                return ((height - lineHeight)/2) * -1;
              } else {
                self.element.css({'margin-bottom': '8px', 'padding-bottom': '12px'});
                return 6;
              }
            }
            else if (isRadio) {
              return ((height - self.trigger.height())/2) * -1;
            }
          },
          setTriggerCssTop = function() {
            self.trigger.css({top:  getTriggerTopVal() +'px'});
          };

        // Update target element
        self.targetElem = dropdown ? dropdown.pseudoElem : self.targetElem;
        self.targetElem = isFileupload ? self.field.find('.fileupload[type="text"]') : self.targetElem;

        // Update hover element
        self.hoverElem = isSpinbox ? self.element.add(self.field.find('.down, .up')) : self.targetElem;
        self.hoverElem = isColorpicker ? self.element.add(self.field.find('.colorpicker-container, .swatch, .trigger')) : self.hoverElem;

        // Set is-hover for field
        self.hoverElem
          .on('mouseenter.' + pluginName, function() {
            self.field.addClass('is-hover');
          })
          .on('mouseleave.' + pluginName, function() {
            self.field.removeClass('is-hover');
          });

        // Adjust stack order for dropdown
        if (dropdown) {
          setTimeout(function() {
            var popupMenu = self.trigger.data('popupmenu');
            if (popupMenu) {
              popupMenu.menu.closest('.popupmenu-wrapper').css({'z-index': '4502'});
            }
          }, 0);
        }
        // Bind active/unactive on show datepicker or timepicker
        if (datepicker || timepicker) {
          if (datepicker) {
            onPopupToggle(datepicker);
          } else {
            onPopupToggle(timepicker);
          }
        }
        // Adjust return focus for timepicker
        if (timepicker) {
          timepicker.settings.returnFocus = false;
        }
        // Move trigger(action-button) in to lookup-wrapper
        if (lookup || isColorpicker) {
          self.field.addClass('is-fieldoptions');
          self.field.on('click.' + pluginName, '.lookup-wrapper .trigger, .colorpicker-container .trigger', function() {
            doActive();
          });

          if (isColorpicker) {
            self.element
              .off('beforeopen.' + pluginName).on('beforeopen.' + pluginName, function () {
                doActive();
              });
          }
        }
        // Bind fileupload events
        if (isFileupload) {
          self.element.on('change.' + pluginName, function() {
            self.targetElem.focus();
          });
          self.field.on('click.' + pluginName, '.trigger, .trigger-close', function() {
            doActive();
          });
        }
        // Spinbox add parent css class
        if (isSpinbox) {
          self.field.addClass('is-fieldoptions');
        }
        // Move trigger(action-button) in to searchfield-wrapper
        if (isSearchfield) {
          self.field.addClass('is-fieldoptions');
          setTimeout(function() {
            self.trigger.add(self.trigger.next('.popupmenu'))
              .appendTo(self.element.closest('.searchfield-wrapper'));
          }, 0);
        }
        // Fieldset - set trigger(action-button) top value and bind events
        if (isFieldset) {
          setTriggerCssTop();
          self.targetElem.add(self.trigger).on('keydown.' + pluginName, function(e) {
            var key = e.which || e.keyCode || e.charCode || 0;
            if (key === 13) {
              setTimeout(function() {
                doActive();
              }, 0);
            }
          });
          self.targetElem.attr('tabindex', 0)
          .on('click.' + pluginName, function() {
            doActive();
          });
          $(document).on('click.' + pluginName, function(e) {
            if (!$(e.target).is(self.element)) {
              doUnactive();
            }
          });
          $('body').on('resize.' + pluginName, function() {
            setTriggerCssTop();
          });
        }
        // Radio group - set trigger(action-button) top value and bind events
        if (isRadio) {
          setTriggerCssTop();
          self.element.find('.radio')
            .on('focusin.' + pluginName, function() {
              var delay = self.isSafari ? 200 : 0;
              addFocused();
              setTimeout(function() {
                doActive();
              }, delay);
            })
            .on('focusout.' + pluginName, function() {
              removeFocused();
            });
          $('body').on('resize.' + pluginName, function() {
            setTriggerCssTop();
          });
        }

        // Element events
        self.targetElem
          .on('focusin.' + pluginName, function() {
            doActive();
            if (isRadio && self.isSafari) {
              addFocused();
            }
          })
          .on('focusout.' + pluginName, function(e) {
            var delay = self.isSafari ? 200 : 0;
            if (isRadio && self.isSafari) {
              removeFocused();
            }
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
        if (self.isSafari || isFileupload) {
          if (isRadio) {
            self.element.attr('tabindex', 0);
          }
          self.targetElem.on('keydown.' + pluginName, function(e) {
            var key = e.which || e.keyCode || e.charCode || 0;
            if (key === 9 && !e.shiftKey) {
              if (isRadio) {
                self.targetElem.find(':checked, .radio:first').not(':disabled').focus();
                self.targetElem.find('.radio')
                .off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
                  var key = e.which || e.keyCode || e.charCode || 0;
                  if (key === 9 && !e.shiftKey) {
                    setTimeout(function() {
                      self.trigger.focus();
                    }, 0);
                  }
                });
              }
              else {
                self.trigger.focus();
              }
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
        $(document)
          .add('body')
          .add(this.field)
          .add(this.element)
          .add(this.trigger)
          .add(this.hoverElem)
          .add(this.targetElem)
          .add(this.element.find('.radio'))
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
