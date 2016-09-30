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
        offset: {top: 10, left: 0}, //how much room to leave
        placement: 'top',  //can be top/left/bottom/right/offset
        trigger: 'hover', //supports click and immediate and hover (and maybe in future focus)
        title: null, //Title for Infor Tips
        beforeShow: null, //Call back for ajax tooltip
        popover: null , //force it to be a popover (no content)
        closebutton: null, //Show X close button next to title in popover
        isError: false, //Add error classes
        isErrorColor: false, //Add error color only not description
        tooltipElement: null, // ID selector for an alternate element to use to contain the tooltip classes
        keepOpen: false, // Forces the tooltip to stay open in situations where it would normally close.
        extraClass: null, // Extra css class
        maxWidth: null // Toolip max width
      },
      settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Tooltip(element) {
      this.settings = $.extend({}, settings);
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

        this.descriptionId = $('.tooltip-description').length + 1;
        this.description = this.element.next('.tooltip-description');
        if (!this.description.length && settings.isError) {
          this.description = $('<span id="tooltip-description-'+ this.descriptionId +'" class="tooltip-description audible"></span>').insertAfter(this.element);
        }

        if (this.element.is('.dropdown, .multiselect')) {
          this.activeElement = this.element.nextAll('.dropdown-wrapper:first').find('>.dropdown');
        }

        settings.closebutton = (settings.closebutton || this.element.data('closebutton')) ? true : false;

        if (this.element.data('extraClass') && this.element.data('extraClass').length) {
          settings.extraClass = this.element.data('extraClass');
        }
      },

      addAria: function() {
        this.content = this.element.attr('title') || settings.content;
        this.description.text(this.content);
        this.content = this.addClassToLinks(this.content, 'links-clickable');

        if (!this.isPopover) {
          this.element.removeAttr('title').attr('aria-describedby', this.description.attr('id'));
        }

        if (this.isPopover && settings.trigger === 'click') {
          this.element.attr('aria-haspopup', true);
        }
      },

      addClassToLinks: function(content, thisClass) {
        var d = $('<div/>').html(content);
        $('a', d).addClass(thisClass);
        return d.html();
      },

      appendTooltip: function() {
        this.tooltip = settings.tooltipElement ? $(settings.tooltipElement) : $('#tooltip');
        if (!this.tooltip.length) {
          var name = (settings.tooltipElement ? settings.tooltipElement.substring(1, settings.tooltipElement.length) : 'tooltip');
          this.tooltip = $('<div class="' + (this.isPopover ? 'popover' : 'tooltip') + ' bottom is-hidden" role="tooltip" id="' + name + '"><div class="arrow"></div><div class="tooltip-content"></div></div>');
        }

        this.tooltip.place({
          container: this.scrollParent,
          parent: this.element,
          placement: this.settings.placement,
          strategy: 'flip'
        });

        this.setTargetContainer();
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
            .on('mouseleave.tooltip mousedown.tooltip click.tooltip mouseup.tooltip', function() {
                clearTimeout(timer);
                setTimeout(function() {
                  self.hide();
                }, delay);
            })
            .on('updated.tooltip', function() {
              self.updated();
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

        this.tooltip.on('afterplace.tooltip', function(e, x, y, bleedingWasFixed) {
          if (bleedingWasFixed) {
            $(this).find('.arrow').css('display', 'none');
          }
        });

      },

      setContent: function(content) {
        if ((!content || !content.length) && typeof settings.content !== 'function') {
          return false;
        }

        var self = this,
          contentArea,
          specified = false,
          closeBtnX = $('<button type="button" class="btn-icon l-pull-right"><span>Close</span></button>')
                        .prepend($.createIconElement({ classes: ['icon-close'], icon: 'close' }))
                        .css({'margin-top':'-9px'})
                        .on('click', function() {
                          self.hide();
                        });

        content = Locale.translate(content) || content;

        if (content.indexOf('#') === 0) {
          content = $(content).html();
          specified = true;
        }

        if (settings.extraClass && typeof settings.extraClass === 'string') {
          this.tooltip.addClass(settings.extraClass);
        } else {
          this.tooltip.removeAttr('class').addClass('tooltip bottom is-hidden');
        }

        if (this.isPopover) {
          contentArea = this.tooltip.find('.tooltip-content').html(settings.content).removeClass('hidden');
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

          if (settings.closebutton) {
            $('.tooltip-title', this.tooltip).append(closeBtnX);
          }

          contentArea.initialize();
          return true;

        } else {
          this.tooltip.find('.tooltip-title').hide();
        }

        this.tooltip.removeClass('popover').addClass('tooltip');
        if (typeof settings.content === 'function') {
          content = this.content = settings.content.call(this.element);
          if (!content) {
            return false;
          }
        }

        contentArea = this.tooltip.find('.tooltip-content');

        if (contentArea.prev('.arrow').length === 0) {
          contentArea.before('<div class="arrow"></div>');
        }

        if (specified) {
          contentArea.html(content);
        }
        else {
          contentArea.html('<p>' + (content === undefined ? '(Content)' : content) + '</p>');
        }
        return true;
      },

      // Alias for _show()_.
      open: function() {
        return this.show();
      },

      show: function(newSettings, ajaxReturn) {
        var self = this;
        this.isInPopup = false;

        if (newSettings) {
          settings = newSettings;
        }

        if (settings.beforeShow && !ajaxReturn) {
          var response = function (content) {
            self.content = content;
            self.show(settings, true);
          };

          if (typeof settings.beforeShow === 'string') {
            window[settings.beforeShow](response);
            return;
          }

          settings.beforeShow(response);
          return;
        }

        var okToShow = true;
        okToShow = this.setContent(this.content);
        if (okToShow  === false) {
          return;
        }

        okToShow = this.element.triggerHandler('beforeshow', [this.tooltip]);
        if (okToShow  === false) {
          return;
        }

        this.tooltip.removeAttr('style');
        this.tooltip.removeClass('bottom right left top offset is-error').addClass(settings.placement);

        if (settings.isError || settings.isErrorColor) {
          this.tooltip.addClass('is-error');
        }

        this.position();
        this.element.trigger('show', [this.tooltip]);

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

          if (settings.isError && !self.element.is(':visible') && !self.element.is('.dropdown')) {
            self.hide();
          }

          if (window.orientation === undefined) {
            $(window).on('resize.tooltip', function() {
              self.hide();
            });
          }

          // Click to close
          if (settings.isError) {
            self.tooltip.on('click.tooltip', function () {
              self.hide();
            });
          }

          self.element.trigger('aftershow', [self.tooltip]);

        }, 400);

      },

      // Places the tooltip element itself in the correct DOM element.
      // If the current element is inside a scrollable container, the tooltip element goes as high as possible in the DOM structure.
      setTargetContainer: function() {
        var targetContainer = $('body');

        // adjust the tooltip if the element is being scrolled inside a scrollable DIV
        this.scrollparent = this.element.closest('.page-container.scrollable');
        if (this.scrollparent.length) {
          targetContainer = this.scrollparent;
        }

        this.tooltip.detach().appendTo(targetContainer);
      },

      position: function () {
        this.setTargetContainer();
        this.tooltip.removeClass('is-hidden');

        var distance = this.isPopover ? 20 : 10,
          x = 0,
          y = distance,
          s = this.settings.placement;

        if (s === 'left' || s === 'right') {
          x = distance;
          y = 0;
        }

        this.tooltip.data('place').place({
          x: x,
          y: y,
          container: this.scrollParent,
          parent: this.element,
          placement: this.settings.placement,
          strategy: 'flip'
        });

        return this;

        /*
        var self = this,
          winH = window.innerHeight + $(document).scrollTop(),
          // subtract 2 from the window width to account for the tooltips
          // resizing themselves to fit within the CSS overflow boundary.
          winW = (window.innerWidth - 2) + $(document).scrollLeft(),
          scrollable = {
            deltaHeight: 0,
            deltaWidth: 0,
            offsetLeft: 0,
            offsetTop: 0
          };

        // Reset adjustments to panel and arrow
        this.tooltip.removeAttr('style');
        this.tooltip.find('.arrow').removeAttr('style');

        if (this.settings.maxWidth) {
          this.tooltip.css('max-width', this.settings.maxWidth + 'px');
        }

        if (this.scrollparent.length) {
          scrollable.offsetTop = this.scrollparent.scrollTop();
          scrollable.offsetLeft = this.scrollparent.scrollLeft();
          scrollable.deltaHeight = this.scrollparent.offset().top;
          scrollable.deltaWidth = this.scrollparent.offset().left;
          winH = winH - (this.scrollparent.offset().top + scrollable.offsetTop);
          winW = winW - (this.scrollparent.offset().left + scrollable.offsetLeft);
        }

        var rightOffset;
        switch(settings.placement) {
          case 'offset':
            // Used for error messages (validation)
            self.tooltip.addClass('bottom');
            self.placeBelowOffset(scrollable);
            break;
          case 'bottom':
            self.placeBelow(scrollable);
            var bottomOffset = self.tooltip.offset().top - scrollable.deltaHeight + self.tooltip.outerHeight();
            if (bottomOffset >= winH) {
              self.tooltip.removeClass('bottom').addClass('top');
              self.placeAbove(scrollable);
            }
            break;
          case 'top':
            self.placeAbove(scrollable);
            if (this.tooltip.offset().top - scrollable.deltaHeight <= 0) {
              self.tooltip.removeClass('top').addClass('bottom');
              self.placeBelow(scrollable);
            }
            break;
          case 'right':
            if (Locale.isRTL()) {
              self.placeToLeft(scrollable);
              if (this.tooltip.offset().left - scrollable.deltaWidth <= 0) {
                self.tooltip.removeClass('right').addClass('left');
                self.placeToRight(scrollable);
              }
            } else {
              self.placeToRight(scrollable);
              rightOffset = self.tooltip.offset().left - scrollable.deltaWidth + self.tooltip.outerWidth();
              if (rightOffset >= winW) {
                self.tooltip.removeClass('right').addClass('left');
                self.placeToLeft(scrollable);
              }
            }
            break;
          default: //left
            if (Locale.isRTL()) {
              self.placeToRight(scrollable);
              rightOffset = self.tooltip.offset().left - scrollable.deltaWidth + self.tooltip.outerWidth();
              if (rightOffset >= winW) {
                self.tooltip.removeClass('left').addClass('right');
                self.placeToLeft(scrollable);
              }
            } else {
              self.placeToLeft(scrollable);
              if (this.tooltip.offset().left - scrollable.deltaWidth <= 0) {
                self.tooltip.removeClass('left').addClass('right');
                self.placeToRight(scrollable);
              }
            }
            break;
        }

        // secondary check on bottom/top placements to see if the tooltip width is long enough
        // to bleed off the edge of the page.
        var o, arrow, arrowPosLeft, arrowPosTop, delta, headHtml, extra,
          el = self.activeElement;

        function setCurrentTooltipPos() {
          o = self.tooltip.offset();
          arrow = self.tooltip.find('.arrow');
          arrowPosLeft = 0;
          arrowPosTop = 0;
          delta = 0;
        }

        function offLeftEdgeCondition() {
          setCurrentTooltipPos();
          return o.left - scrollable.deltaWidth <= 0;
        }

        function offRightEdgeCondition() {
          setCurrentTooltipPos();
          return o.left - scrollable.deltaWidth + self.tooltip.outerWidth() - 10 >= winW;
        }

        function offTopEdgeCondition() {
          setCurrentTooltipPos();
          return o.top - scrollable.deltaHeight <= 0;
        }

        // Datepicker in editable datagrid
        if (el.prev().is('.datepicker')) {
          var thisEl = el.prev();

          // Check for bleeding off the left edge.
          if (offLeftEdgeCondition()) {
            arrow.removeAttr('style');
            self.tooltip.removeClass('top bottom').addClass('right');
            self.placeToRight(scrollable);
            arrow.css('left', '-12px');

            setCurrentTooltipPos();
            delta = thisEl.offset().left + thisEl.outerWidth() + 15;
            self.tooltip.css('left', delta);
          }
          // Check for bleeding off the right edge.
          if (offRightEdgeCondition()) {
            arrow.removeAttr('style');
            self.tooltip.removeClass('top bottom').addClass('left');
            self.placeToLeft(scrollable);
            arrow.css('left', 'auto');

            setCurrentTooltipPos();
            delta = thisEl.offset().left - self.tooltip.outerWidth() - 15;
            self.tooltip.css('left', delta);
          }

          if (offTopEdgeCondition()) {
            headHtml = $('html');
            extra = {offsetTop: 0, paddingTop: 0};
            if (headHtml.is('.is-firefox') || headHtml.is('.is-safari') || headHtml.is('.ie')) {
              extra.offsetTop = 8;
              extra.paddingTop = 8;
            }
            if (headHtml.is('.ie11') || headHtml.is('.ie9')) {
              extra.offsetTop = 13;
              extra.paddingTop = 15;
            }
            delta = (scrollable.deltaHeight - o.top - scrollable.offsetTop - 40);
            arrowPosTop = (self.tooltip.outerHeight()/2) - delta - (el.outerHeight()/2 + 40);

            if ((o.top + scrollable.offsetTop - extra.offsetTop) < 0) {
              delta -= scrollable.deltaHeight - extra.paddingTop;
              arrowPosTop = arrowPosTop + (el.outerHeight()/2);
            }
            self.tooltip.css({'top': delta});
            arrow.css('top', arrowPosTop);
          }


        }

        // All other elements
        else {
          if (/offset|bottom|top/i.test(settings.placement)) {
            // Check for bleeding off the left edge
            if (offLeftEdgeCondition()) {
              delta = (0 - (o.left - scrollable.deltaWidth) + 1) * -1;
              self.tooltip.css('left', o.left + delta);

              // Check again.  If it's still bleeding off the left edge, swap it to a right-placed Tooltip.
              if (offLeftEdgeCondition()) {
                self.tooltip.removeClass('top bottom').addClass('right');
                self.placeToRight(scrollable);
              }
            }

            // Check for bleeding off the right edge.
            if (offRightEdgeCondition()) {
              // need to explicitly set a width on the popover for this to work, otherwise popover contents will wrap
              // and cause it to grow wider:
              var top,
                tooltipWidth = self.tooltip.outerWidth() -10;

              el = self.activeElement;

              self.tooltip.removeClass('top bottom').addClass(Locale.isRTL() ? 'right' : 'left');
              self.tooltip.css('width', tooltipWidth);
              delta = (winW - (o.left - scrollable.deltaWidth + tooltipWidth +7) - 1) * -1;
              top = (el.offset().top - el.outerHeight() - (self.tooltip.outerHeight()/2) -3) + scrollable.offsetTop;
              self.tooltip.css({'left': Locale.isRTL() ? (el.offset().left - self.tooltip.outerWidth() -7) : (o.left - delta), 'top': top});
              arrowPosLeft = parseInt(arrow.css('left'), 10);
              arrow.css('left', Locale.isRTL() ? 'auto' : (arrowPosLeft + delta));

              // Check again.  If it's still bleeding off the edge, swap it to a left-placed Tooltip.
              if (offRightEdgeCondition()) {
                arrow.removeAttr('style');
                self.tooltip.removeClass('top bottom').addClass('left');
                self.placeToLeft(scrollable);
              }
            }

          }

          // If tooltip is hidden under header
          // TODO: this is dirty fix, need to come-up with different approch
          if (offTopEdgeCondition()) {
            headHtml = $('html');
            extra = {offsetTop: 0, paddingTop: 0};
            if (headHtml.is('.is-firefox') || headHtml.is('.is-safari') || headHtml.is('.ie')) {
              extra.offsetTop = 8;
              extra.paddingTop = 8;
            }
            if (headHtml.is('.ie11') || headHtml.is('.ie9')) {
              extra.offsetTop = 13;
              extra.paddingTop = 15;
            }
            delta = (scrollable.deltaHeight - o.top - scrollable.offsetTop);
            arrowPosTop = (self.tooltip.outerHeight()/2) - delta - (el.outerHeight()/2);

            if ((o.top + scrollable.offsetTop - extra.offsetTop) < 0) {
              delta -= scrollable.deltaHeight - extra.paddingTop;
              arrowPosTop = arrowPosTop + (el.outerHeight()/2);
            }
            self.tooltip.css({'top': delta});
            arrow.css('top', arrowPosTop);
          }
        }
        */

      },

      /*
      placeBelowOffset: function(scrollable) {
       var o = this.activeElement.offset(),
          isShortField = !!(this.activeElement.closest('.field-short').length),
          extraOffset = (this.element.parent().find('.icon').length > 1 ? -12 : 4),
          extraWidth = 10,
          lessTop = 0;

        if (this.activeElement.is('input.dropdown')) {
          extraWidth = -20;
          extraOffset = 16;
        }

        if (this.activeElement.is('.lookup') && this.activeElement.parent().is(':not(.field-short)')) {
          extraOffset = Locale.isRTL() ? 17 : -17;
        }

        this.tooltip.find('.arrow').css('right', '');

        if (this.activeElement.is('.timepicker') && this.activeElement.parent().is(':not(.field-short)')) {
          extraOffset = Locale.isRTL() ? 25 : -20;
        }

        if (this.activeElement.is('.datepicker') && this.activeElement.parent().is(':not(.field-short)')) {
          extraOffset = -15;
        }

        // Errors
        if (settings.isError) {
          extraOffset = (this.tooltip.outerWidth() === parseInt(this.tooltip.css('max-width'), 10)) ?
             7 : (isShortField ? (Locale.isRTL() ? -10 : 4) : 1);
          lessTop = 2;

          if (this.activeElement.is('.lookup')) {
            extraOffset = Locale.isRTL() ? 13 : -13;
          }

          if (this.activeElement.is('.editor')) {
            extraOffset = -5;
            lessTop = this.activeElement.outerHeight() - 22;
          }
          if (this.activeElement.is('textarea')) {
            lessTop = this.activeElement.outerHeight() - 22;
          }
          if (this.activeElement.is('.dropdown')) {
            if (this.tooltip.outerWidth() === parseInt(this.tooltip.css('max-width'), 10)) {
              extraWidth = -20;
              extraOffset = 10;
            } else {
              extraWidth = 10;
              extraOffset = (isShortField ? (Locale.isRTL() ? 10 : -10) : (Locale.isRTL() ? 10 : -20));
            }
          }
          if (this.activeElement.is('.spinbox')) {
            extraOffset =  Locale.isRTL() ? -5 : 4;
          }

          if (this.activeElement.is('.datepicker') || this.activeElement.is('.timepicker')) {
            extraOffset = Locale.isRTL() ? (isShortField ? 5 : 18) : (isShortField ? -9 : -23);
          }

          if (this.activeElement.is('.colorpicker')) {
            extraOffset = 11;
          }
        }

        var left = o.left + scrollable.offsetLeft + settings.offset.left + (this.activeElement.outerWidth() - this.tooltip.outerWidth()) + extraOffset - scrollable.deltaWidth;

        left = Locale.isRTL() ? (left - (this.activeElement.outerWidth() - this.tooltip.outerWidth())) : left;

        this.tooltip.css({'width': this.tooltip.width() + extraWidth,
                          'top' : o.top + scrollable.offsetTop + this.activeElement.outerHeight() + settings.offset.top - scrollable.deltaHeight - lessTop,
                          'left': left });
      },
      placeBelow: function (scrollable) {
        var o = this.activeElement.offset();
        this.tooltip.css({'top': o.top + scrollable.offsetTop + this.activeElement.outerHeight() + settings.offset.top - scrollable.deltaHeight,
                          'left': o.left + scrollable.offsetLeft + settings.offset.left + (this.activeElement.outerWidth()/2) - (this.tooltip.outerWidth() / 2) - scrollable.deltaWidth});
      },
      placeAbove: function (scrollable) {
        var o = this.activeElement.offset();
        this.tooltip.css({'top': o.top + scrollable.offsetTop - settings.offset.top - this.tooltip.outerHeight() - scrollable.deltaHeight,
                          'left': o.left + scrollable.offsetLeft + settings.offset.left + (this.activeElement.outerWidth()/2) - (this.tooltip.outerWidth() / 2) - scrollable.deltaWidth});
      },
      placeToRight: function (scrollable) {
        var o = this.activeElement.offset(),
          extraLeft = (this.isPopover ? 10 : 0);

        this.tooltip.removeAttr('style');
        this.tooltip.css({'top': o.top + scrollable.offsetTop - (this.tooltip.outerHeight() / 2) + (this.activeElement.outerHeight() / 2) - scrollable.deltaHeight,
                          'left': o.left + scrollable.offsetLeft + extraLeft + settings.offset.left + this.activeElement.outerWidth() + settings.offset.top - scrollable.deltaWidth});
      },
      placeToLeft: function (scrollable) {
        var o = this.activeElement.offset();
        this.tooltip.removeAttr('style');
        this.tooltip.css({'top': o.top + scrollable.offsetTop - (this.tooltip.outerHeight() / 2) + (this.activeElement.outerHeight() / 2) - scrollable.deltaHeight,
                          'left': o.left + scrollable.offsetLeft + settings.offset.left - (settings.offset.top + this.tooltip.outerWidth()) - scrollable.deltaWidth});
      },
      */

      // Alias for _hide()_ that works with the global _closeChildren()_ method.
      close: function() {
        return this.hide();
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

        this.element.trigger('hide', [this.tooltip]);
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      teardown: function() {
        this.description.remove();
        this.descriptionId = undefined;
        this.element.removeAttr('aria-describedby').removeAttr('aria-haspopup');
        if (!this.tooltip.hasClass('is-hidden')) {
          this.hide();
        }
        this.element.removeData(pluginName);
        this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip focus.tooltip blur.tooltip');

        return this;
      },

      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
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
