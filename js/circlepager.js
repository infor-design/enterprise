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

    // Plugin Constructor
    function Plugin(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.setElements();

        if (this.slides.length) {
          this.createControls();
          this.handleEvents();
          this.active();

          // Initialize active slide
          this.show();
        }
      },

      // Set elements
      setElements: function() {
        var s = this.settings;
        this.container = $('.slides', this.element);
        this.slides = $('.slide', this.element);
        this.activeIndex = s.startingSlide !== null &&
          s.startingSlide > -1 && s.startingSlide < this.slides.length ?
            s.startingSlide : 0;
      },

      // Create controls
      createControls: function() {
        var html = '<div class="controls">';

        for (var i=0,l=this.slides.length; i<l; i++) {
          var slide = $(this.slides[i]),
            text = slide.attr('data-button-text'),
            href = '#slide'+ i,
            isDisabled = '';

          if (slide.is('.active') && this.settings.startingSlide === null && !slide.is('.is-disabled')) {
            this.activeIndex = i;
          }

          if (slide.is('.is-disabled')) {
            isDisabled = ' disabled tabindex="-1"';
          }

          if (text && text.length) {
            href = ('#'+ $.trim(text)).toLowerCase().replace(/ /g, '-').replace(/--/g, '-');
          } else {
            text = 'Slide '+ i;
          }

          html += '<a href="'+ href +'" class="control-button"'+ isDisabled +'><span class="audible">'+ text +'</span></a>';
        }
        html += '</div>';

        this.element.append(html);
      },

      // Handle events
      handleEvents: function() {
        var self = this;

        this.controlButtons = $('.control-button', this.element);

        // Handle clicks for bottom bullet links
        this.controlButtons.on('click.circlepager', function(e) {
          e.preventDefault();
          var btn = $(this);
          if (btn.is('[disabled]')) {
            return;
          }
          self.show(btn.index());
        });

        // Handle keyboard events
        this.controlButtons.on('keydown.circlepager', function(e) {
          var key = e.which || e.keyCode || e.charCode || 0,
            handled = false,
            isRTL = Locale.isRTL();

          // Left and Right arrow keys
          if ([37, 39].indexOf(key) !== -1) {
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

        var isRTL = Locale.isRTL(),
          left = index > 0 ? ((isRTL ? '' : '-') + (index * 100) +'%') : 0;
        this.controlButtons.removeClass('is-active').eq(index).addClass('is-active').focus();
        this.container.css('left', left);
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

        if (this.controlButtons.eq(prev).is('[disabled]')) {
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

        if (this.controlButtons.eq(next).is('[disabled]')) {
          setTimeout(function() {
            self.next();
          }, 0);
          this.activeIndex = next;
          return false;
        }
        this.show(next);
      },

      // Make active
      active: function() {
        this.isActive = true;
        this.element.addClass('is-active');
        this.container.css('width', (100 * this.slides.length) +'%');
        this.slides.css('width', (100 / this.slides.length) +'%');
        this.show();
      },

      // Make un-active
      unactive: function() {
        this.isActive = false;
        this.element.removeClass('is-active').css('width', '');
        this.container.css({'width': '', 'left': ''});
      },

      unbind: function() {
        this.controlButtons.off('click.circlepager keydown.circlepager');
        $('.controls', this.element).remove();
        this.makeUnActive();
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
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
