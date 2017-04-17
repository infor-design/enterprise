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

  $.fn.circlepager = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'circlepager',
        defaults = {
          groupBy: 1, // Max number of slides to show in one view
          startingSlide: null, // First showing slide/group, an 0-based integer
          loop: false // Setting loop: true will loop back after next/previous reached to end
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function CirclePager(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // CirclePager Methods
    CirclePager.prototype = {

      init: function() {
        this.setElements();

        if (this.slides.length) {
          this.createControls();
          this.handleEvents();
          this.showCollapsedView();
          this.initActiveSlide();
        }
      },

      // Set elements
      setElements: function() {
        var self = this,
          s = this.settings;

        this.container = $('.slides', this.element);
        this.slidesJQ = $('.slide', this.element);
        this.groupBy = s.groupBy;
        this.slides = [];
        this.slidesJQ.each(function() {
          self.slides.push({ node: $(this) });
        });

        if (this.slides.length) {
          // Do not go less than slide width
          this.element.css({'min-width': this.slidesJQ.eq(0).width() + 5});
        }

        this.activeIndex = s.startingSlide !== null &&
          s.startingSlide > -1 && s.startingSlide < this.slides.length ?
            s.startingSlide : 0;
      },

      // Create controls
      createControls: function() {
        var len = this.slides.length,
          html = '<div class="controls">',
          htmlContent = '',
          numOfButtons = 0,
          i, l, slide, temp, href, text, buttonText,
          last, lastIndex, isSingle, isDisabled,
          previousButton, nextButton;

        for (i = 0, l = len; i < l; i += this.groupBy) {
          temp = '';
          numOfButtons++;
          isSingle = (this.groupBy === 1) || (len - i === 1);
          text = Locale.translate(isSingle ? 'SlideOf' : 'SlidesOf') + '';
          // Keep href in english language only
          href = isSingle ? '#slide {0} of {1}' : '#slides {0} and {1} of {2}';

          // Collect as much bullets need to present
          for (var g = 0; g < this.groupBy && (i + g) < len; g++) {
            temp += (i + g + 1) + ', ';
          }
          text = text.replace(isSingle ? '{1}' : '{2}', len);
          href = href.replace(isSingle ? '{1}' : '{2}', len);
          temp = temp.slice(0, -2);
          lastIndex = temp.lastIndexOf(',');
          last = temp.substr(lastIndex + 2);

          // Controls for single slide in view
          if (isSingle) {
            isDisabled = '';
            slide = this.slides[i].node;

            // Set disabled
            if (slide.is('.is-disabled, [disabled]') && !slide.is('[disabled="false"]')) {
              isDisabled = ' disabled tabindex="-1"';
              this.slides[i].isDisabled = true;
            }

            // Set default starting slide
            if (slide.is('.active') && this.settings.startingSlide === null && isDisabled === '') {
              this.activeIndex = i;
            }

            // Use custom text if supplied
            buttonText = slide.attr('data-button-text');
            text = (buttonText && buttonText.length) ?
              buttonText : text.replace('{0}', temp);

            // href = (buttonText && buttonText.length) ?
            //   '#'+ $.trim(text) : href.replace('{0}', temp);
            href = href.replace('{0}', temp);

          }

          // Controls for multiple slides in view
          else {
            temp = temp.substr(0, lastIndex);
            text = text.replace('{1}', last).replace('{0}', temp);
            href = href.replace('{1}', last).replace('{0}', temp);
          }

          href = href.toLowerCase().replace(/[\s,--]+/g, '-');

          // console.log(href, text);
          htmlContent += '<a href="'+ href +'" class="control-button hyperlink hide-focus"'+ isDisabled +'><span class="audible">'+ text +'</span></a>';
        }

        html += htmlContent + '</div>';

        // Previous/Next buttons
        this.isBulletsNav = this.element.width() > numOfButtons * 29;
        previousButton = $('.btn-previous', this.element);
        nextButton = $('.btn-next', this.element);
        if (!this.isBulletsNav) {
          if (!previousButton.length) {
            html += '<button class="btn-previous" type="button">' + $.createIcon('left-arrow') + '<span class="audible">'+
                Locale.translate('Previous') +'</span></button>';
          }
          if (!nextButton.length) {
            html += '<button class="btn-next" type="button">' + $.createIcon('right-arrow') + '<span class="audible">'+
                Locale.translate('Next') +'</span></button>';
          }
        } else {
          previousButton.add(nextButton).remove();
        }

        this.element.append(html);
      },

      // Handle events
      handleEvents: function() {
        var self = this;

        // Previous button
        $('.btn-previous', this.element)
          .onTouchClick('circlepager')
          .on('click.circlepager', function (e) {
            self.prev();
            e.stopImmediatePropagation();
          });

        // Next button
        $('.btn-next', this.element)
          .onTouchClick('circlepager')
          .on('click.circlepager', function (e) {
            self.next();
            e.stopImmediatePropagation();
          });

        this.controlButtons = $('.control-button', this.element);
        this.controlButtons.each(function(index) {
          var btn = $(this);
          btn.hideFocus();

          // Handle clicks for bottom bullet links
          btn.on('click.circlepager', function(e) {
            e.preventDefault();
            if (self.slides[index].isDisabled) {
              return;
            }
            self.show(index);
          });

        });

        // Handle keyboard events

        // Prevent hidden slide's content to be get focused
        // on focusable elements in slides content
        this.element.on('focus.circlepager', '*', function(e) {
          var handled = false;
          if (!self.isVisibleInContainer($(this))) {
            var canfocus = self.element.find(':focusable');
            for (var i = 0, l = canfocus.length; i < l; i++) {
              if (self.isVisibleInContainer(canfocus.eq(i))) {
                canfocus.eq(i).focus();
                handled = true;
                break;
              }
            }
          }
          e.stopPropagation();
          if (handled) {
            return false;
          }
        });
        // Keydown on focusable elements in slides content to
        // prevent hidden slide's content to be get focused
        this.element.on('keydown.circlepager', '*', function(e) {
          var key = e.which || e.keyCode || e.charCode || 0,
            handled = false,
            canfocus = $(':focusable'),
            index = canfocus.index(this);

          if (key === 9) {//tab
            // Using shift key with tab (going backwards)
            if (e.shiftKey) {
              for (var i = index-1; i >= 0; i--) {
                if ((self.element.has(canfocus.eq(i)).length < 1) ||
                    (self.isVisibleInContainer(canfocus.eq(i)))) {
                  canfocus.eq(i).focus();
                  handled = true;
                  break;
                }
              }
            }
            // Using only tab key (going forward)
            else {
              if (!self.isVisibleInContainer(canfocus.eq(index + 1))) {
                self.controlButtons.first().focus();
                handled = true;
              }
            }
          }
          e.stopPropagation();
          if (handled) {
            return false;
          }
        });

        // Control buttons
        this.controlButtons.on('keydown.circlepager', function(e) {
          var key = e.which || e.keyCode || e.charCode || 0,
            handled = false,
            isRTL = Locale.isRTL();

          // Left and Right arrow keys
          if ([37, 39].indexOf(key) !== -1) {
            self.isFocus = true; // Move focus
            if (e.altKey) {
              // [Alt + Left/Right arrow] to move to the first or last
              if ((key === 37 && !isRTL) || (key === 39 && isRTL)) {
                self.first();
              } else {
                self.last();
              }
            }
            // Left and Right arrow keys to navigate
            else {
              if ((!isRTL && key === 37) || (isRTL && key === 39)) {
                self.prev();
              } else {
                self.next();
              }
              handled = true;
            }
          }

          if (handled) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });

        // Set max number of slides can view on resize
        $('body').on('resize.circlepager', function() {
          self.responsiveGroupBy();
        });

      }, // END: Handle Events ---------------------------------------------------------------------
      // Check if given element is visible in container
      isVisibleInContainer: function(element) {
        if (element && element[0]) {
          var eRect = element[0].getBoundingClientRect();
          var cRect = this.element[0].getBoundingClientRect();
          return (eRect.left > cRect.left && eRect.left < (cRect.left + cRect.width) &&
            eRect.top > cRect.top && eRect.top < (cRect.top + cRect.height));
        }
        return -1;
      },

      // Update number of slides to show in view
      updateGroupBy: function(numOfSlides) {
        if (!this.isActive) {
          return;
        }
        this.settings.groupBy = numOfSlides || 1;
        this.updated();
        return this;
      },

      // Make sure max number of slides to show in view
      responsiveGroupBy: function(numOfSlides) {
        if (!this.isActive) {
          return;
        }
        var self = this;
        this.groupBy = numOfSlides || this.settings.groupBy;
        this.unbind().slidesJQ.css('width', '');
        if (this.slides.length) {
          setTimeout(function() {
            self.createControls();
            self.handleEvents();
            self.showCollapsedView();
            self.initActiveSlide();
          }, 0);
        }
      },

      // Show slide
      show: function(index) {
        if (!this.isActive) {
          return;
        }
        index = typeof index !== 'undefined' ? index : this.activeIndex;
        this.activeIndex = index;

        // var isBulletsNav = this.element.width() > this.controlButtons.length * 30;
        var left = index > 0 ? ((Locale.isRTL() ? '' : '-') + (index * 100) +'%') : 0;
        this.controlButtons.removeClass('is-active').eq(index).addClass('is-active');
        this.container[0].style.left = left;

        // Make sure bullets navigation do not overflow
        // if (!isBulletsNav) {
        if (!this.isBulletsNav) {
          this.element.addClass('is-bullets-nav-hidden');
          this.controlButtons.find('span').addClass('audible').end()
            .eq(index).find('span').removeClass('audible');
        } else {
          this.element.removeClass('is-bullets-nav-hidden');
          this.controlButtons.find('span').addClass('audible');
        }

        // Set focus
        if (this.isFocus && this.isBulletsNav) {
        // if (this.isFocus && isBulletsNav) {
          this.isFocus = false;
          this.controlButtons.eq(index).focus();
        }
      },

      // First slide
      first: function() {
        this.show(0);
      },

      // Last slide
      last: function() {
        this.show(Math.round(this.slides.length/this.groupBy)-1);
      },

      // Previous slide
      prev: function() {
        var self = this,
          prev = this.activeIndex > 0 ?
            this.activeIndex - 1 : (this.settings.loop ? Math.round(this.slides.length/this.groupBy)-1 : 0);

        if (this.slides[prev].isDisabled) {
          setTimeout(function() {
            self.prev();
          }, 0);
          this.activeIndex = prev;
          return false;
        }
        this.show(prev);
      },

      // Next slide
      next: function() {
        var self = this,
          next = this.activeIndex >= Math.round(this.slides.length/this.groupBy)-1 ?
            (this.settings.loop ? 0 : this.activeIndex) : this.activeIndex + 1;

        if (this.slides[next].isDisabled) {
          setTimeout(function() {
            self.next();
          }, 0);
          this.activeIndex = next;
          return false;
        }
        this.show(next);
      },

      // Make active
      showCollapsedView: function() {
        this.isActive = true;
        this.element.addClass('is-active');
        this.container[0].style.width = (100 * this.slides.length) +'%';
        if (this.settings.groupBy > 1 &&
           (this.slidesJQ.eq(0).width() * this.groupBy > this.element.width())) {
          this.responsiveGroupBy(this.groupBy - 1);
          return;
        }
        for (var i = 0, l = this.slidesJQ.length; i < l; i++) {
          this.slidesJQ[i].style.width = ((100/this.groupBy) / this.slides.length) +'%';
        }
        this.show();
      },

      // Make un-active
      showExpandedView: function() {
        this.isActive = false;
        this.element.removeClass('is-active');
        this.element[0].style.width = '';
        this.container[0].style.width = '';
        this.container[0].style.left = '';
      },

      // Initialize active slide
      initActiveSlide: function() {
        if (this.slides[this.activeIndex].isDisabled) {
          this.next();
          return false;
        }
        this.show();
      },

      unbind: function() {
        $('body').off('resize.circlepager');
        this.element.off('focus.circlepager keydown.circlepager', '*');
        this.controlButtons.off('click.circlepager keydown.circlepager');
        $('.btn-previous, .btn-next', this.element).off('click.circlepager');
        $('.controls', this.element).remove();
        this.showExpandedView();
        return this;
      },

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
        instance = $.data(this, pluginName, new CirclePager(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
