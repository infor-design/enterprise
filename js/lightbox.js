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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.lightbox = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'lightbox',
        defaults = {
          // Image src
          image: '',

          // If set to true, enables cyclic navigation. This means, if you click "next"
          // after you reach the last element, first element will be displayed (and vice versa).
          loop: true,

          // If set to false will loads fresh image each time
          cache: true
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Lightbox(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Lightbox Methods
    Lightbox.prototype = {
      init: function() {
        return this
          .build()
          .handleEvents();
      },

      // Add markup to the control
      build: function() {
        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.onTouchClick(pluginName).on('click.' + pluginName, function() {
          self.showImage();
        });

        $(window).on('resize.'+ pluginName, function() {
          self.resize();
        });

        return this;
      },

      // Show Image Fill Size
      showImage: function() {
        var self = this;

        if (!this.settings.image && !this.settings.image.length) {
          return;
        }

        // Preload the image
        self.loadImage(self.settings.image);

        $('body').modal({
          title: '',
          content: $('#lightbox-full'),
          buttons: [],
          id: 'lightbox-modal',
          frameHeight: 0
        })
        .on('open', function() {
          $('.overlay').css('opacity', '.7');
        })
        .on('afterclose', function () {
          var modal = $(this);

          $('#lightbox-modal').remove();
          $('.overlay').remove();
          modal.data('modal').destroy();
          modal.off('open').off('afterclose');
        });

        // Do Ui Customizations
        self.lightBox = $('#lightbox-modal');
        self.lightBox.addClass('lightbox-modal').find('.modal-buttonset, .modal-header').remove();

        setTimeout(function () {
          var modalApi = $('body').data('modal');

          // Activate busyindicator
          self.busyindicator = $('.modal-body-wrapper').addClass('busy').busyindicator();

          modalApi.extraHeight = 0;
          $(window).off('resize.modal-' + modalApi.id);

          $('.overlay').onTouchClick(pluginName).on('click.' + pluginName, function () {
            modalApi.close();
          });
        } ,100);

        //Add Buttons
        self.addButtons();
      },

      // Add Button Code and Functionality
      addButtons: function () {
        var self = this,
          closeButton = $('<button class="btn-icon" type="button">' + $.createIcon({ classes: ['close'], icon: 'close' }) + '<span class="audible">'+
            Locale.translate('Close') +'</span></button>');

        this.previousButton = $('<button class="btn-previous" type="button">' + $.createIcon('left-arrow') + '<span class="audible">'+
            Locale.translate('Previous') +'</span></button>');

        this.nextButton = $('<button class="btn-next" type="button">' + $.createIcon('right-arrow') + '<span class="audible">'+
            Locale.translate('Next') +'</span></button>');

        this.lightBox
          .css('overflow', 'visible')
          .find('.modal-content').before(closeButton, this.previousButton, this.nextButton);

        closeButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
          $('body').data('modal').close();
        });

        this.previousButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
           self.loadSiblingImage('previous');
        });

        this.nextButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
          self.loadSiblingImage('next');
        });

        self.currentElement = self.element;
        self.refreshButtons();

      },

      // Preload the image
      loadImage: function(path) {
        var self = this,
          box = $('#lightbox-full'),
          img = new Image();

        if (self.loadingInProcess) {
          return;
        }
        self.loadingInProcess = true;

        // Will loads fresh image each time, if set to false
        if (!this.settings.cache) {
          path += '?t=' + Math.random() + new Date().getTime();
        }

        img.src = path;
        img.id = 'lightbox-full';

        setTimeout(function () {
          self.busyindicator
            .scrollTop(0)
            .css({
              'max-height': self.getCalcHeight(),
              'overflow': 'hidden'
            })
            .trigger('start');
        }, 110);

        if (box.length) {
          box.css('opacity', '0');

          setTimeout(function () {
            box.attr('src', path).css('opacity', '1');
          }, 300);

        } else {
          img.style.display = 'none';
          document.body.appendChild(img);
        }

        img.onload = function () {
          self.resize();
          setTimeout(function () {
            self.busyindicator.css({'overflow': ''}).trigger('complete');
            self.loadingInProcess = false;
          }, 120);
        };
      },

      // Calculated modal height
      getCalcHeight: function() {
        return ($(window).height()* 0.9) - 100; //90% -(100 :extra elements-height);
      },

      // Resize
      resize: function() {
        var bodyHeight = $('.modal-body').height(),
          calcHeight = this.getCalcHeight();
        $('.modal-body-wrapper').css('max-height', bodyHeight > calcHeight ? calcHeight : '');
      },

      // Show/Hide next/previous buttons
      // if loop not set as "true"
      refreshButtons: function () {
        if (!this.settings.loop) {
          var next = this.currentElement.next(),
            prev = this.currentElement.prev();

          this.nextButton[next && next.length ? 'show' : 'hide']();
          this.previousButton[prev && prev.length ? 'show' : 'hide']();
        }
      },

      // Set next/previous buttons
      loadSiblingImage: function (direction) {

        // Avoid fire multiple clicks on next/previous buttons
        if (this.loadingInProcess) {
          return;
        }

        var self = this,
          boxes = $('.lightbox'),
          index = 0,
          el, settings;

        boxes.each(function(i) {
          if (this === self.currentElement[0]) {
            index = i;
            return false;
          }
        });

        el = (direction === 'next') ?
          (boxes.eq(index < (boxes.length-1) ? (index+1) : 0)) :
          (boxes.eq(index > 0 ? (index-1) : (boxes.length-1)));

        settings = el && el.length ? el.data('lightbox').settings : '';

        if (settings && settings.image && settings.image.length) {
          this.loadImage(settings.image);
          this.currentElement = el;
        }

        this.refreshButtons();
      },

      //Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      teardown: function() {
        this.element.off('updated.' + pluginName).
          offTouchClick().off('click.' + pluginName);
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
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
        instance = $.data(this, pluginName, new Lightbox(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
