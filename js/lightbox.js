/**
* Lightbox Control (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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
          image: ''
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Lightbox(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
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

        this.element.onTouchClick(pluginName).on('click.lightbox' + pluginName, function() {
          self.showImage();
        });

        return this;
      },

      // Show Image Fill Size
      showImage: function() {

        if (!this.settings.image) {
          return;
        }

        //Preload the image
        this.loadImage(this.settings.image);

        $('body').modal({
          title: '',
          content: $('#lightbox-full'),
          buttons: [],
          id: 'lightbox-modal',
          frameHeight: 0
        }).on('open', function() {
          $('.overlay').css('opacity', '.7');
        }).on('afterclose', function () {
          $('#lightbox-modal').remove();
        });

        //Do Ui Customizations
        this.lightBox = $('#lightbox-modal');
        this.lightBox.addClass('lightbox-modal');
        this.lightBox.find('.modal-buttonset').remove();
        this.lightBox.find('.modal-header').remove();

        setTimeout(function () {

          $('.overlay').css('opacity', '.65').onTouchClick(pluginName).on('click.' + pluginName, function () {
            $('body').data('modal').close();
          });

          $('body').data('modal').extraHeight = 0;

        } ,100);

        //Add Buttons
        this.addButtons();
      },

      //Add Button Code and Functionality
      addButtons: function () {
        var self = this,
          closeButton = $('<button class="btn-icon" type="button"><svg role="presentation" aria-hidden="true" focusable="false" class="icon close"><use xlink:href="#icon-close"/></svg><span class="audible">'+
            Locale.translate('Close') + '</span></button>');

        this.lightBox.find('.modal-body-wrapper').before(closeButton);
        closeButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
          $('body').data('modal').close();
        });

        this.previousButton = $('<button class="btn-icon btn-previous" type="button"><svg role="presentation" aria-hidden="true" focusable="false" class="icon close"><use xlink:href="#icon-previous-page"/></svg><span class="audible">'+
            Locale.translate('Previous') + '</span></button>');

        this.lightBox.find('.modal-body-wrapper').before(this.previousButton);

        this.previousButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
           self.loadSiblingImage('previous');
        });

        this.nextButton = $('<button class="btn-icon btn-next" type="button"><svg role="presentation" aria-hidden="true" focusable="false" class="icon close"><use xlink:href="#icon-next-page"/></svg><span class="audible">'+
            Locale.translate('Next') + '</span></button>');

        this.lightBox.find('.modal-body-wrapper').before(this.nextButton);
        this.nextButton.onTouchClick(pluginName).on('click.' + pluginName, function () {
          self.loadSiblingImage('next');
        });

        self.currentElement = self.element;
        self.refreshButtons();

      },

      loadImage: function(path) {
        var box = $('#lightbox-full');

        var img = new Image();
        img.src = path;
        img.id = 'lightbox-full';

        if (box.length > 0) {
          box.css('opacity', '0');

          setTimeout(function () {
            box.attr('src', path).css('opacity', '1');
          }, 300);

        } else {
          img.style.display = 'none';
          document.body.appendChild(img);
        }
      },

      refreshButtons: function () {
        var next = this.currentElement.next(),
          prev = this.currentElement.prev();

        if (next && next.length > 0) {
          this.nextButton.show();
        } else {
          this.nextButton.hide();
        }

        if (prev && prev.length > 0) {
          this.previousButton.show();
        } else {
          this.previousButton.hide();
        }
      },

      loadSiblingImage: function (direction) {
        var elem = (direction === 'next' ? this.currentElement.next() : this.currentElement.prev()),
          imagePath = elem && elem.length > 0 ? elem.data('lightbox').settings : '';

        if (imagePath) {
          this.loadImage(imagePath.image);
          this.currentElement = elem;
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
