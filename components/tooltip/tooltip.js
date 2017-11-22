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
        content: null,
        offset: {top: 10, left: 10},
        placement: 'top',
        trigger: 'hover',
        title: null,
        beforeShow: null,
        popover: null ,
        closebutton: null,
        isError: false,
        isErrorColor: false,
        tooltipElement: null,
        parentElement: null,
        keepOpen: false,
        extraClass: null,
        placementOpts: {},
        maxWidth: null
      };

    /**
     * Tooltip and Popover Control
     * @constructor
     * @param {Object} element
     * @param {Object|Function} options
     * @param {(string|Function)} [options.content] - Takes title attribute or feed content. Can be a string or jQuery markup
     * @param {Object} [options.offset={top: 10, left: 10}] - How much room to leave
     * @param {string} [options.placement=top|bottom|right|offset]
     * @param {string} [options.trigger=hover] - supports click and immediate and hover (and maybe in future focus)
     * @param {string} [options.title] - Title for Infor Tips
     * @param {string} [options.beforeShow] - Call back for ajax tooltip
     * @param {string} [options.popover] - force it to be a popover (no content)
     * @param {string} [options.closebutton] - Show X close button next to title in popover
     * @param {Boolean} [options.isError=false] - Add error classes
     * @param {Boolean} [options.isErrorColor=false] - Add error color only not description
     * @param {string} [options.tooltipElement] - ID selector for an alternate element to use to contain the tooltip classes
     * @param {Object} [options.parentElement=this.element] - jQuery-wrapped element that gets passed to the 'place' behavior as the element to place the tooltip against.
     * @param {Boolean} [options.keepOpen=false] - Forces the tooltip to stay open in situations where it would normally close.
     * @param {string} [options.extraClass] - Extra css class
     * @param {string} [options.maxWidth] - Toolip max width
     */
    function Tooltip(element, options) {
      this.settings = $.extend({}, defaults, options);
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
        if ((!this.settings.popover && titleAttr && titleAttr.length) || (!this.settings.popover && this.settings.title)) {
          this.settings.content = this.settings.title ? this.settings.title : titleAttr;
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
          ((this.element.is('.dropdown, .multiselect')) ? this.activeElement : this.element)
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
          } else {
            self.show();
          }
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

        // Close the popup/tooltip on orientation changes (but not when keyboard is open)
        $(window).on('orientationchange.tooltip', function() {
          // Match every time.
          if (self.tooltip.hasClass('is-hidden')) {
            return;
          }
          self.close();
        }, false);

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
          this.content = content.addClass('hidden');
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
          content = Locale.translate(content, true) || content;

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
        this.content = $.sanitizeHTML(content);

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
        var titleArea = this.tooltip[0].querySelectorAll('.tooltip-title')[0],
          contentArea = this.tooltip[0].querySelectorAll('.tooltip-content')[0],
          extraClass = this.settings.extraClass,
          content = this.content,
          tooltip = this.tooltip[0],
          classes = 'tooltip is-hidden';

        if (extraClass) {
          classes += ' ' + extraClass;
        }
        tooltip.setAttribute('class', classes);

        if (titleArea) {
          titleArea.style.display = 'none';
        }

        if (!contentArea.previousElementSibling.classList.contains('arrow')) {
          contentArea.insertAdjacentHTML('beforebegin', '<div class="arrow"></div>');
        }

        if (typeof this.content === 'string') {
          contentArea.innerHTML = content;
        } else {
          contentArea.innerHTML = content[0].innerHTML;
        }
      },

      renderPopover: function() {
        var self = this,
          extraClass = this.settings.extraClass,
          content = this.content,
          contentArea = this.tooltip.find('.tooltip-content'),
          title = this.tooltip[0].querySelector('.tooltip-title'),
          classes = 'popover is-hidden';

        if (extraClass) {
          classes += ' ' + extraClass;
        }

        this.tooltip[0].setAttribute('class', classes);

        var popoverWidth;

        if (typeof content === 'string') {
          content = $(content);
          contentArea.html(content);
          contentArea.find('.hidden').removeClass('hidden');
          popoverWidth = contentArea.width();
        } else {
          contentArea.html(content);
          popoverWidth = this.settings.content.width();
        }

        if (!this.settings.placementOpts) {
          this.settings.placementOpts = {};
        }

        if (!this.settings.placementOpts.parent) {
          this.settings.placementOpts.parent = this.element;
        }

        content[0].classList.remove('hidden');
        contentArea[0].firstElementChild.classList.remove('hidden');

        var parentWidth = this.settings.placementOpts.parent.width();

        if (Locale.isRTL()) {
          this.settings.placementOpts.parentXAlignment = parentWidth > popoverWidth ? 'left' : 'right';
        } else {
          this.settings.placementOpts.parentXAlignment = parentWidth > popoverWidth ? 'right' : 'left';
        }

        if (this.settings.title !== null) {
          if (!title) {
            var titleFrag = document.createDocumentFragment();
            title = document.createElement('div');
            title.innerHTML = this.settings.title;
            title.classList.add('tooltip-title');
            titleFrag.appendChild(title);
            this.tooltip[0].insertBefore(titleFrag, this.tooltip[0].firstChild);
          } else {
            title.style.display = '';
            title.childNodes[0].nodeValue = this.settings.title;
          }
        } else {
          if(title) {
            title.style.display = 'none';
          }
        }

        if (this.settings.closebutton && title && !title.firstElementChild) {
          var closeBtnX = $(
            '<button type="button" class="btn-icon l-pull-right" style="margin-top: -9px">' +
              $.createIcon({ classes: ['icon-close'], icon: 'close' }) +
              '<span>Close</span>' +
            '</button>'
          ).on('click', function() {
            self.hide();
          });

          title.appendChild(closeBtnX[0]);
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

        this.tooltip[0].setAttribute('style', '');
        this.tooltip[0].classList.add(this.settings.placement);


        if (this.settings.isError || this.settings.isErrorColor) {
          this.tooltip[0].classList.add('is-error');
        }

        this.position();
        Soho.utils.fixSVGIcons(this.tooltip);
        this.element.trigger('show', [this.tooltip]);

        setTimeout(function () {
          $(document).on('mouseup.tooltip', function (e) {
            var target = $(e.target);

            if (self.settings.isError || self.settings.trigger === 'focus') {
             return;
            }

            if (target.is(self.element) && target.is('svg.icon')) {
              return;
            }

            if ($('#editor-popup').length && $('#colorpicker-menu').length) {
              return;
            }

            if (target.closest('.popover').length === 0 &&
                target.closest('.dropdown-list').length === 0) {
              self.hide(e);
            }
          })
          .on('keydown.tooltip', function (e) {
            if (e.which === 27 || self.settings.isError) {
              self.hide();
            }
          });

          if (self.settings.isError &&
              !self.element.is(':visible, .dropdown') &&
              self.element.is('[aria-describedby]')) {
            self.hide();
          }

          if (window.orientation === undefined) {
            $('body').on('resize.tooltip', function() {
              self.hide();
            });
          }

          // Hide on Page scroll
          $('body').on('scroll.tooltip', function() {
            self.hide();
          });

          self.element.closest('.modal-body-wrapper').on('scroll.tooltip', function() {
            self.hide();
          });

          self.element.closest('.scrollable').on('scroll.tooltip', function() {
            self.hide();
          });

          self.element.closest('.datagrid-body').on('scroll.tooltip', function() {
            self.hide();
          });

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

        if (this.settings.parentElement) {
          targetContainer = this.settings.parentElement;
        }

        //this.tooltip.detach().appendTo(targetContainer);
        targetContainer[0].appendChild(this.tooltip[0]);
      },

      // Placement behavior's "afterplace" handler.
      // DO NOT USE FOR ADDITIONAL POSITIONING.
      handleAfterPlace: function(e, placementObj) {
        this.tooltip.data('place').setArrowPosition(e, placementObj, this.tooltip);
        this.tooltip.triggerHandler('tooltipafterplace', [placementObj]);
      },

      position: function () {
        this.setTargetContainer();
        this.tooltip[0].classList.remove('is-hidden');

        var self = this,
          distance = this.isPopover ? 20 : 10,
          tooltipPlacementOpts = this.settings.placementOpts || {},
          opts = $.extend({}, {
            x: 0,
            y: distance,
            container: this.scrollparent,
            containerOffsetX: tooltipPlacementOpts.containerOffsetX || this.settings.offset.left,
            containerOffsetY: tooltipPlacementOpts.containerOffsetY || this.settings.offset.top,
            parent: tooltipPlacementOpts.parent || this.activeElement,
            placement: tooltipPlacementOpts.placement || this.settings.placement,
            strategies: ['flip', 'nudge']
          }, tooltipPlacementOpts);

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

        this.tooltip[0].classList.add('is-hidden');
        this.tooltip[0].style.left = '';
        this.tooltip[0].style.top = '';
        this.tooltip.find('.arrow').removeAttr('style');

        this.detachOpenEvents();

        if ($('.popover').not('.is-hidden').length === 0) {
          $(document).off('mouseup.tooltip keydown.tooltip');
          $('body').off('resize.tooltip');
        }

        this.element.trigger('hide', [this.tooltip]);
      },

      updated: function() {
        var self = this;

        if (self.settings.trigger === 'immediate') {
          setTimeout(function() {
            self.show();
          }, 100);
        } else {
          self.setContent();
        }

        return this;
      },

      detachOpenEvents: function () {

        this.tooltip.off('click.tooltip');
        $(document).off('mouseup.tooltip');
        $('body').off('resize.tooltip scroll.tooltip');
        this.element.closest('.modal-body-wrapper').off('scroll.tooltip');
        this.element.closest('.scrollable').off('scroll.tooltip');
        this.element.closest('.datagrid-body').off('scroll.tooltip');

      },

      teardown: function() {
        this.description.remove();
        this.descriptionId = undefined;
        this.activeElement = undefined;

        this.element.removeAttr('aria-describedby').removeAttr('aria-haspopup');
        if (!this.tooltip.hasClass('is-hidden')) {
          this.hide();
        }

        if (this.tooltip && this.tooltip.data('place')) {
          this.tooltip.data('place').destroy();
        }

        this.element.off('mouseenter.tooltip mouseleave.tooltip mousedown.tooltip click.tooltip mouseup.tooltip updated.tooltip focus.tooltip blur.tooltip');
        this.detachOpenEvents();

        $(window).off('orientationchange.tooltip');

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

      instance = $.data(this, pluginName, new Tooltip(this, options));
    });
  };

  // Popover & Tooltip are the same control
  $.fn.popover = $.fn.tooltip;

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
