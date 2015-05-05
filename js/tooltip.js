/**
* Tooltip and Popover Control
*/

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

  $.fn.tooltip = function(options, args) {
    'use strict';

    // Settings and Options
    var pluginName = 'tooltip',
      defaults = {
        content: null, //Takes title attribute or feed content. Can be a function or jQuery markup
        offset: {top: 15, left: 0}, //how much room to leave
        placement: 'top',  //can be top/left/bottom/right/offset
        trigger: 'hover', //supports click and manual and hover (future focus)
        title: null, //Title for Infor Tips
        popover: null , //force it to be a popover (no content)
        isError: false, //Add error classes
        tooltipElement: null, // ID selector for an alternate element to use to contain the tooltip classes
        keepOpen: false // Forces the tooltip to stay open in situations where it would normally close.
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Tooltip(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Object
    Tooltip.prototype = {
      init: function() {
        this.setup();
        this.appendTooltip();
        this.handleEvents();
        this.addAria();
        this.isPopover = (settings.content !== null && typeof settings.content === 'object') || settings.popover;
      },

      setup: function() {
        // this.activeElement is the element that the tooltip displays and positions against
        this.activeElement = this.element;

        if (this.element.is('.dropdown, .multiselect')) {
          this.activeElement = $('#' + this.element.attr('id') + '-shdo');
        }
      },

      addAria: function() {
        var name = (settings.tooltipElement ? settings.tooltipElement.substring(1, settings.tooltipElement.length) : 'tooltip');
        this.content =  this.element.attr('title') || settings.content;

        if (!this.isPopover) {
          this.element.removeAttr('title').attr('aria-describedby', name);
        }

        if (this.isPopover && settings.trigger === 'click') {
          this.element.attr('aria-haspopup', true);
        }
      },

      appendTooltip: function() {
        this.tooltip = settings.tooltipElement ? $(settings.tooltipElement) : $('#tooltip');
        if (this.tooltip.length === 0) {
          var name = (settings.tooltipElement ? settings.tooltipElement.substring(1, settings.tooltipElement.length) : 'tooltip');
          this.tooltip = $('<div class="' + (this.isPopover ? 'popover' : 'tooltip') + ' bottom is-hidden" role="tooltip" id="' + name + '"><div class="arrow"></div><div class="tooltip-content"><p>(Content)</p></div></div>').appendTo('body');
        }
      },

      handleEvents: function() {
        var self = this, timer, delay = 400;

        if (settings.trigger === 'hover' && !settings.isError) {
          this.element
            .on('mouseenter.tooltip', function() {
              timer = setTimeout(function() {
                self.show();
              }, delay);
            })
            .on('mouseleave.tooltip mousedown.tooltip', function() {
                clearTimeout(timer);
                setTimeout(function() {
                  self.hide();
                }, delay);
            });
        }

        if (settings.trigger === 'click') {
          this.element.on('click.tooltip', function() {
            if (self.tooltip.hasClass('is-hidden')) {
              self.show();
            } else {
              self.hide();
            }
          });
        }

        if (settings.trigger === 'immediate') {
          timer = setTimeout(function() {
            if (self.tooltip.hasClass('is-hidden')) {
              self.show();
            } else {
              self.hide();
            }
          }, 1);
        }

        if (settings.trigger === 'focus') {
          this.element.on('focus.tooltip', function() {
            self.show();
          })
          .on('blur.tooltip', function() {
            self.hide();
          });
        }

        this.element.filter('button, a').on('focus.tooltip', function() {
          self.setContent(self.content);
        });

      },

      setContent: function(content) {
        if (this.isPopover) {
          this.tooltip.find('.tooltip-content').html(settings.content).removeClass('hidden');
          settings.content.removeClass('hidden');
          this.tooltip.removeClass('tooltip').addClass('popover');

          if (settings.title !== null) {
            var title = this.tooltip.find('.tooltip-title');
            if (title.length === 0) {
              title = $('<div class="tooltip-title"></div>').prependTo(this.tooltip);
            }
            title.html(settings.title).show();
          } else {
            this.tooltip.find('.tooltip-title').hide();
          }

          return;
        } else {
          this.tooltip.find('.tooltip-title').hide();
        }

        this.tooltip.removeClass('popover').addClass('tooltip');
        if (typeof settings.content === 'function') {
          content = this.content = settings.content.call(this.element);
        }

        this.tooltip.find('.tooltip-content').html('<p>' + (content === undefined ? '(Content)' : content) + '</p>');
      },

      show: function(newSettings) {
        var self = this;
        this.isInPopup = false;

        if (newSettings) {
          settings = newSettings;
        }

        this.setContent(this.content);
        this.element.trigger('beforeOpen', [this.tooltip]);

        this.tooltip.removeAttr('style');
        this.tooltip.removeClass('bottom right left top offset is-error').addClass(settings.placement);

        if (settings.isError) {
          this.tooltip.addClass('is-error');
        }

        this.tooltip.removeClass('is-hidden');
        this.position();
        this.element.trigger('open', [this.tooltip]);

        setTimeout(function () {
          $(document).on('mouseup.tooltip', function (e) {

            if (settings.isError || settings.trigger === 'focus') {
             return;
            }

            if ($(e.target).is(self.element) && $(e.target).is('svg.icon')) {
              return;
            }

            if ($(e.target).closest('.popover').length === 0 &&
                $(e.target).closest('.dropdown-list').length === 0) {
              self.hide(e);
            }
          })
          .on('keydown.tooltip', function (e) {
            if (e.which === 27 || settings.isError) {
              self.hide();
            }
          });

          $(window).on('resize.tooltip', function() {
            self.hide();
          });

          // Click to close
          if (settings.isError) {
            self.tooltip.on('click.tooltip', function () {
              self.hide();
            });
          }
        }, 400);

      },

      position: function () {
        var self = this,
          winH = window.innerHeight + $(document).scrollTop(),
          // subtract 2 from the window width to account for the tooltips
          // resizing themselves to fit within the CSS overflow boundary.
          winW = (window.innerWidth - 2) + $(document).scrollLeft();

        switch(settings.placement) {
          case 'offset':
            // Used for error messages (validation)
            self.tooltip.addClass('bottom');
            self.placeBelowOffset();
            break;
          case 'bottom':
            self.placeBelow();
            var bottomOffset = self.tooltip.offset().top + self.tooltip.outerHeight();
            if (bottomOffset >= winH) {
              self.tooltip.removeClass('bottom').addClass('top');
              self.placeAbove();
            }
            break;
          case 'top':
            self.placeAbove();
            if (this.tooltip.offset().top <= 0) {
              self.tooltip.removeClass('top').addClass('bottom');
              self.placeBelow();
            }
            break;
          case 'right':
            self.placeToRight();
            var rightOffset = self.tooltip.offset().left + self.tooltip.outerWidth();
            if (rightOffset >= winW) {
              self.tooltip.removeClass('right').addClass('left');
              self.placeToLeft();
            }
            break;
          default: //left
            self.placeToLeft();
            if (this.tooltip.offset().left <= 0) {
              self.tooltip.removeClass('left').addClass('right');
              self.placeToRight();
            }
            break;
        }

        // secondary check on bottom/top placements to see if the tooltip width is long enough
        // to bleed off the edge of the page.
        if (settings.placement === 'bottom' ||
            settings.placement === 'top' ) {

          if ( self.tooltip.offset().left <= 0 ) {
            self.tooltip.removeClass('top bottom').addClass('right');
            self.placeToRight();
          }

          if ( (self.tooltip.offset().left + self.tooltip.outerWidth()) >= winW ) {
            self.tooltip.removeClass('top bottom').addClass('left');
            self.placeToLeft();
          }

        }

      },
      placeBelowOffset: function() {
        var extraOffset = (this.element.parent().find('.icon').length > 1 ? -10 : 9);

        this.tooltip.css({'top' : this.activeElement.offset().top + this.activeElement.outerHeight() + settings.offset.top,
                          'left' : this.activeElement.offset().left + settings.offset.left + (this.activeElement.outerWidth() - this.tooltip.outerWidth()) + extraOffset });
      },
      placeBelow: function () {
        this.tooltip.css({'top': this.activeElement.offset().top + this.activeElement.outerHeight() + settings.offset.top,
                          'left': this.activeElement.offset().left + settings.offset.left + (this.activeElement.outerWidth()/2) - (this.tooltip.outerWidth() / 2)});
      },
      placeAbove: function () {
        this.tooltip.css({'top': this.activeElement.offset().top - settings.offset.top - this.tooltip.outerHeight(),
                          'left': this.activeElement.offset().left + settings.offset.left + (this.activeElement.outerWidth()/2) - (this.tooltip.outerWidth() / 2)});
      },
      placeToRight: function () {
        this.tooltip.removeAttr('style');
        this.tooltip.css({'top': this.activeElement.offset().top - (this.tooltip.outerHeight() / 2) + (this.activeElement.outerHeight() / 2),
                          'left': this.activeElement.offset().left + settings.offset.left + this.activeElement.outerWidth() + settings.offset.top});
      },
      placeToLeft: function () {
        this.tooltip.removeAttr('style');
        this.tooltip.css({'top': this.activeElement.offset().top - (this.tooltip.outerHeight() / 2) + (this.activeElement.outerHeight() / 2),
                          'left': this.activeElement.offset().left + settings.offset.left - (settings.offset.top + this.tooltip.outerWidth()) });
      },

      hide: function() {
        if (settings.keepOpen) {
          return;
        }

        if (this.isInPopup) {
          settings.content.addClass('hidden');
          return;
        }

        this.tooltip.addClass('is-hidden').css({'left': '', 'top': ''});
        this.tooltip.off('click.tooltip');

        if ($('.popover').not('.is-hidden').length === 0) {
          $(document).off('mouseup.tooltip keydown.tooltip');
          $(window).off('resize.tooltip');
        }

        // TODO document breaking change
        this.element.trigger('close', [this.tooltip]);
        this.element.trigger('hide', [this.tooltip]);
      },

      destroy: function() {
        if (!this.tooltip.hasClass('is-hidden')) {
          this.hide();
        }
        this.element.removeData(pluginName);
        this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip focus.tooltip blur.tooltip');
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {

      var instance = $.data(this, pluginName);

      //Allow one tooltip and one popover
      if (instance && (instance.settings.popover == null || instance.settings.popover !== settings.popover)) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }

        instance.settings = $.extend(instance.settings, options);

        if (settings.trigger === 'immediate') {
         setTimeout(function() {
            instance.show(settings);
          }, 100);
        }
      } else {
        instance = $.data(this, pluginName, new Tooltip(this, settings));
        instance.settings = settings;
      }
    });
  };

  // Popover & Tooltip are the same control
  $.fn.popover = $.fn.tooltip;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
