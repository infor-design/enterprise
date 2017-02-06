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
          startingSlide: null, // First showing slide, an 0-based integer
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
        this.slides = [];
        this.slidesJQ.each(function() {
          self.slides.push({ node: $(this) });
        });

        this.activeIndex = s.startingSlide !== null &&
          s.startingSlide > -1 && s.startingSlide < this.slides.length ?
            s.startingSlide : 0;
      },

      // Create controls
      createControls: function() {
        var html = '<div class="controls">';

        for (var i=0,l=this.slides.length; i<l; i++) {
          var slide = this.slides[i].node,
            text = slide.attr('data-button-text'),
            href = '#slide'+ i,
            isDisabled = '';

          if (slide.is('.is-disabled, [disabled]') && !slide.is('[disabled="false"]')) {
            isDisabled = ' disabled tabindex="-1"';
            this.slides[i].isDisabled = true;
          }

          if (slide.is('.active') && this.settings.startingSlide === null && isDisabled === '') {
            this.activeIndex = i;
          }

          if (text && text.length) {
            href = ('#'+ $.trim(text)).toLowerCase().replace(/ /g, '-').replace(/--/g, '-');
          } else {
            text = 'Slide '+ i;
          }

          html += '<a href="'+ href +'" class="control-button hyperlink hide-focus"'+ isDisabled +'><span class="audible">'+ text +'</span></a>';
        }
        html += '</div>';

        this.element.append(html);
      },

      // Handle events
      handleEvents: function() {
        var self = this;
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

      }, // END: Handle Events ---------------------------------------------------------------------

      // Show slide
      show: function(index) {
        if (!this.isActive) {
          return;
        }
        index = typeof index !== 'undefined' ? index : this.activeIndex;
        this.activeIndex = index;

        var left = index > 0 ? ((Locale.isRTL() ? '' : '-') + (index * 100) +'%') : 0;
        this.controlButtons.removeClass('is-active').eq(index).addClass('is-active');
        this.container[0].style.left = left;

        // Set focus
        if (this.isFocus) {
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
        this.show(this.slides.length-1);
      },

      // Previous slide
      prev: function() {
        var self = this,
          prev = this.activeIndex > 0 ?
            this.activeIndex -1 : (this.settings.loop ? this.slides.length-1 : 0);

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
          next = this.activeIndex >= this.slides.length-1 ?
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
        for (var i = 0, l = this.slidesJQ.length; i < l; i++) {
          this.slidesJQ[i].style.width = (100 / this.slides.length) +'%';
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
        this.controlButtons.off('click.circlepager keydown.circlepager');
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
