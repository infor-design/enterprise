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
        offset: {top: 10, left: 10}, //how much room to leave
        placement: 'top',  //can be top/left/bottom/right/offset
        trigger: 'hover', //supports click and immediate and hover (and maybe in future focus)
        title: null, //Title for Infor Tips
        beforeShow: null, //Call back for ajax tooltip
        popover: null , //force it to be a popover (no content)
        closebutton: null, //Show X close button next to title in popover
        isError: false, //Add error classes
        isErrorColor: false, //Add error color only not description
        tooltipElement: null, // ID selector for an alternate element to use to contain the tooltip classes
        parentElement: null, // jQuery-wrapped element that gets passed to the 'place' behavior as the element to place the tooltip against.  Defaults to "this.element" in tooltip, if not set.
        keepOpen: false, // Forces the tooltip to stay open in situations where it would normally close.
        extraClass: null, // Extra css class
        maxWidth: null // Toolip max width
      },
      settings = $.extend({}, defaults, options);

    function Tooltip(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    Tooltip.prototype = {
      init: function() {
        this.setup();
        this.appendTooltip();

        // Initial Content Setting.
        // Don't do this if we're using an "immediate" trigger because _setContent()_ is handled at
        // display time in that case.
        var shouldRender = this.settings.trigger !== 'immediate';
        if (shouldRender) {
          this.setContent(this.settings.content, true);
        }

        this.handleEvents();
      },

      setup: function() {
        // "this.activeElement" is the target element that the Tooltip will display itself against
        this.activeElement = this.settings.parentElement instanceof $ && this.settings.parentElement.length ? this.settings.parentElement : this.element;

        this.descriptionId = $('.tooltip-description').length + 1;
        this.description = this.element.parent().find('.tooltip-description');
        if (!this.description.length && this.settings.isError) {
          this.description = $('<span id="tooltip-description-'+ this.descriptionId +'" class="tooltip-description audible"></span>').insertAfter(this.element);
        }

        if (this.element.is('.dropdown, .multiselect')) {
          this.activeElement = this.element.nextAll('.dropdown-wrapper:first').find('>.dropdown');
        }

        var titleAttr = this.element.attr('title');
        if (titleAttr && titleAttr.length) {
          this.settings.content = titleAttr;
          this.element.removeAttr('title');
        }

        this.isPopover = (this.settings.content !== null && typeof this.settings.content === 'object') || this.settings.popover === true;

        this.settings.closebutton = (this.settings.closebutton || this.element.data('closebutton')) ? true : false;

        if (this.element.data('extraClass') && this.element.data('extraClass').length) {
          this.settings.extraClass = this.element.data('extraClass');
        }

        this.isRTL = Locale.isRTL();
      },

      addAria: function() {
        if (!this.content) {
          return;
        }

        this.description.text(this.content);
        this.content = this.addClassToLinks(this.content, 'links-clickable');

        if (!this.isPopover) {
          this.element.removeAttr('title').attr('aria-describedby', this.description.attr('id'));
        }

        if (this.isPopover && this.settings.trigger === 'click') {
          this.element.attr('aria-haspopup', true);
        }
      },

      addClassToLinks: function(content, thisClass) {
        var isjQuery = (content instanceof $ && content.length > 0);
        if (isjQuery) {
          return content;
        }

        var d = $('<div/>').html(content);
        $('a', d).addClass(thisClass);
        return d.html();
      },

      appendTooltip: function() {
        this.tooltip = this.settings.tooltipElement ? $(this.settings.tooltipElement) : $('#tooltip');
        if (!this.tooltip.length) {
          var name = (this.settings.tooltipElement ? this.settings.tooltipElement.substring(1, this.settings.tooltipElement.length) : 'tooltip');
          this.tooltip = $('<div class="' + (this.isPopover ? 'popover' : 'tooltip') + ' bottom is-hidden" role="tooltip" id="' + name + '"><div class="arrow"></div><div class="tooltip-content"></div></div>');
        }

        this.tooltip.place({
          container: this.scrollparent,
          parent: this.activeElement,
          placement: this.settings.placement,
          strategy: 'flip'
        });

        this.setTargetContainer();
      },

      handleEvents: function() {
        var self = this, timer, delay = 400;

        if (this.settings.trigger === 'hover' && !this.settings.isError) {
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

        function toggleTooltipDisplay() {
          if (!self.tooltip.hasClass('is-hidden')) {
            self.hide();
          }
          self.show();
        }

        if (this.settings.trigger === 'click') {
          this.element.on('click.tooltip', function() {
            toggleTooltipDisplay();
          });
        }

        if (this.settings.trigger === 'immediate') {
          timer = setTimeout(function() {
            toggleTooltipDisplay();
          }, 1);
        }

        // Uncomment the line below to get focus support on some elements all the time, regardless of trigger setting.
        //var isFocusable = (this.element.filter('button, a').length && this.settings.trigger !== 'click') || this.settings.trigger === 'focus';
        var isFocusable = this.settings.trigger === 'focus';
        if (isFocusable) {
          this.element.on('focus.tooltip', function() {
            self.show();
          })
          .on('blur.tooltip', function() {
            if (!self.settings.keepOpen) {
              self.hide();
            }
          });
        }

        // Media Query Listener to detect a menu closing on mobile devices that change orientation.
        this.matchMedia = window.matchMedia('(orientation: landscape)');
        this.mediaQueryListener = function() {
          // Match every time.
          if (self.tooltip.hasClass('is-hidden')) {
            return;
          }
          self.close();
        };
        this.matchMedia.addListener(this.mediaQueryListener);
      },

      setContent: function(content, dontRender) {
        var self = this,
          specified,
          settingsContent = this.settings.content,
          noIncomingContent = (content === undefined || content === null),
          noSettingsContent = (settingsContent === undefined || settingsContent === null);

        function doRender() {
          if (dontRender === true) {
            return;
          }
          self.addAria();
          self.render();
        }

        // If all sources of content are undefined, just return false and don't show anything.
        if (noIncomingContent && noSettingsContent) {
          return false;
        }

        // If the settingsContent type is a function, we need to re-run that function to update the content.
        // NOTE: If you need to use a function to generate content, understand that the tooltip/popover will not
        // cache your content for future reuse.  It will ALWAYS override incoming content.
        if (typeof settingsContent === 'function') {
          content = settingsContent;
        }

        // Use the pre-set content if we have no incoming content
        if (noIncomingContent) {
          content = settingsContent;
        }

        // If the incoming/preset content is exactly the same as the stored content, don't continue with this step.
        // Deep object comparison for jQuery objects is done further down the chain.
        if (content === this.content) {
          doRender();
          return true;
        }

        // jQuery-wrapped elements don't get manipulated.
        // Simply store the reference, render, and return.
        if (content instanceof $ && content.length) {
          this.content = content;
          doRender();
          return true;
        }

        // Handle setting of content based on its Object type.
        // If type isn't handled, the tooltip will not display.
        if (typeof content === 'string') {
          if (!content.length) {
            return false;
          }

          // Could be a translation definition
          content = Locale.translate(content) || content;

          // Could be an ID attribute
          // If it matches an element already on the page, grab that element's content and store the reference only.
          if (content.indexOf('#') === 0) {
            var contentCheck = $('' + content);
            if (contentCheck.length) {
              this.content = contentCheck;
              doRender();
              return true;
            }
            return false;
          }

        // functions
        } else if (typeof content === 'function') {
          var callbackResult = content.call(this.element);
          if (!callbackResult || typeof callbackResult !== 'string' || !callbackResult.length) {
            return false;
          }
          content = callbackResult;

        // if type isn't handled, return false
        } else {
          return false;
        }

        // Store an internal copy of the processed content
        this.content = content;

        // Wrap tooltip content in <p> tags if there isn't already one present.
        // Only happens for non-jQuery markup.
        if (!specified) {
          this.content = '<p>' + this.content + '</p>';
        }

        doRender();
        return true;
      },

      render: function() {
        if (this.isPopover) {
          return this.renderPopover();
        }
        return this.renderTooltip();
      },

      renderTooltip: function() {
        var titleArea = this.tooltip.find('.tooltip-title'),
          contentArea = this.tooltip.find('.tooltip-content'),
          cssClass = 'tooltip' + (this.settings.extraClass ? ' ' + this.settings.extraClass : '') + ' is-hidden',
          content = this.content;

        this.tooltip.attr('class', cssClass);
        titleArea.hide();

        // Generate an arrow if one doesn't already exist
        if (contentArea.prev('.arrow').length === 0) {
          contentArea.before('<div class="arrow"></div>');
        }

        if (typeof content === 'string') {
          content = $(content);
        }

        contentArea.html(content).removeClass('hidden');
        content.removeClass('hidden');
      },

      renderPopover: function() {
        var self = this,
          cssClass = 'popover' + (this.settings.extraClass ? ' ' + this.settings.extraClass : '') + ' is-hidden',
          contentArea = this.tooltip.find('.tooltip-content'),
          content = this.content;

        if (typeof this.content === 'string') {
          content = $(content);
        }

        // Use currently-set content to render a popover
        contentArea.html(content).removeClass('hidden');
        content.removeClass('hidden');

        this.tooltip.attr('class', cssClass);

        if (this.settings.title !== null) {
          var title = this.tooltip.find('.tooltip-title');
          if (title.length === 0) {
            title = $('<div class="tooltip-title"></div>').prependTo(this.tooltip);
          }
          title.html(this.settings.title).show();
        } else {
          this.tooltip.find('.tooltip-title').hide();
        }

        if (this.settings.closebutton) {
          var closeBtnX = $(
            '<button type="button" class="btn-icon l-pull-right" style="margin-top: -9px">'+
              $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
              '<span>Close</span>'+
            '</button>'
          ).on('click', function() {
            self.hide();
          });
          $('.tooltip-title', this.tooltip).append(closeBtnX);
        }

        content.initialize();
      },

      // Alias for _show()_.
      open: function() {
        return this.show();
      },

      show: function(newSettings, ajaxReturn) {
        var self = this;
        this.isInPopup = false;

        if (newSettings) {
          this.settings = $.extend({}, this.settings, newSettings);
        }

        if (this.settings.beforeShow && !ajaxReturn) {
          var response = function (content) {
            self.show({content: content}, true);
          };

          if (typeof this.settings.beforeShow === 'string') {
            window[this.settings.beforeShow](response);
            return;
          }

          this.settings.beforeShow(response);
          return;
        }

        var okToShow = true;

        okToShow = this.setContent(this.content);
        if (okToShow === false) {
          return;
        }

        okToShow = this.element.triggerHandler('beforeshow', [this.tooltip]);
        if (okToShow === false) {
          return;
        }

        this.tooltip.removeAttr('style');
        this.tooltip.addClass(this.settings.placement);

        if (this.settings.isError || this.settings.isErrorColor) {
          this.tooltip.addClass('is-error');
        }

        this.position();
        this.element.trigger('show', [this.tooltip]);

        setTimeout(function () {
          $(document).on('mouseup.tooltip', function (e) {

            if (self.settings.isError || self.settings.trigger === 'focus') {
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
            if (e.which === 27 || self.settings.isError) {
              self.hide();
            }
          });

          if (self.settings.isError && !self.element.is(':visible') && !self.element.is('.dropdown')) {
            self.hide();
          }

          if (window.orientation === undefined) {
            $('body').on('resize.tooltip', function() {
              self.hide();
            });
          }

          // Click to close
          if (self.settings.isError) {
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

      // Placement behavior's "afterplace" handler.
      // DO NOT USE FOR ADDITONAL POSITIONING.
      handleAfterPlace: function(e, placementObj) {
        this.tooltip.data('place').setArrowPosition(e, placementObj, this.tooltip);
        this.tooltip.triggerHandler('tooltipafterplace', [placementObj]);
      },

      position: function () {
        this.setTargetContainer();
        this.tooltip.removeClass('is-hidden');

        var self = this,
          distance = this.isPopover ? 20 : 10,
          tooltipPlacementOpts = this.settings.placementOpts || {},
          opts = $.extend({}, tooltipPlacementOpts, {
            x: 0,
            y: distance,
            container: this.scrollparent,
            containerOffsetX: tooltipPlacementOpts.containerOffsetX || this.settings.offset.left,
            containerOffsetY: tooltipPlacementOpts.containerOffsetY || this.settings.offset.top,
            parent: tooltipPlacementOpts.parent || this.activeElement,
            placement: tooltipPlacementOpts.placement || this.settings.placement,
            strategies: ['flip', 'nudge']
          });

        if (opts.placement === 'left' || opts.placement === 'right') {
          opts.x = distance;
          opts.y = 0;
        }

        this.tooltip.one('afterplace.tooltip', function(e, placementObj) {
          self.handleAfterPlace(e, placementObj);
        });

        this.tooltip.data('place').place(opts);
        return this;
      },

      // Alias for _hide()_ that works with the global _closeChildren()_ method.
      close: function() {
        return this.hide();
      },

      hide: function() {
        if (this.settings.keepOpen) {
          return;
        }

        if (this.isInPopup) {
          this.settings.content.addClass('hidden');
          return;
        }

        this.tooltip.addClass('is-hidden').css({'left': '', 'top': ''});
        this.tooltip.find('.arrow').removeAttr('style');

        this.tooltip.off('click.tooltip');

        if ($('.popover').not('.is-hidden').length === 0) {
          $(document).off('mouseup.tooltip keydown.tooltip');
          $(window).off('resize.tooltip');
        }

        this.element.trigger('hide', [this.tooltip]);
      },

      updated: function() {
        var self = this;

        if (settings.trigger === 'immediate') {
          setTimeout(function() {
            self.show();
          }, 100);
        } else {
          self.setContent();
        }

        return this;
      },

      teardown: function() {
        this.description.remove();
        this.descriptionId = undefined;
        this.element.removeAttr('aria-describedby').removeAttr('aria-haspopup');
        if (!this.tooltip.hasClass('is-hidden')) {
          this.hide();
        }

        this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip focus.tooltip blur.tooltip');

        if (this.matchMedia) {
          this.matchMedia.removeListener(this.mediaQueryListener);
        }

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
      if (instance /*&& (instance.settings.popover == null || instance.settings.popover !== settings.popover)*/) {
        if (typeof instance[options] === 'function') {
          instance[options](args);
        }

        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();

        return;
      }

      instance = $.data(this, pluginName, new Tooltip(this, settings));
    });
  };

  // Popover & Tooltip are the same control
  $.fn.popover = $.fn.tooltip;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
