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

        this.element.onTouchClick('lightbox').on('click.lightbox' + pluginName, function() {
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
        var img = new Image();
        img.src = this.settings.image;
        img.id = 'lightbox-full';

        $(img).hide();
        document.body.appendChild(img);

        $('body').modal({
          title: '',
          content: $('#lightbox-full'),
          buttons: [],
          id: 'lightbox-modal'
        }).on('open.' + pluginName, function() {
          $('.overlay').css('opacity', '.7');
        }).on('close.' + pluginName, function () {
          $('#lightbox-modal').remove();
        });

        //Do Ui Customizations
        var lightBox = $('#lightbox-modal');
        lightBox.addClass('lightbox-modal');
        lightBox.find('.modal-buttonset').remove();
        lightBox.find('.modal-header').remove();

        setTimeout(function () {

          $('.overlay').css('opacity', '.7').onTouchClick().on('click.' + pluginName, function () {
            $('body').data('modal').close();
          });

          lightBox.find('.modal-body-wrapper').css('max-height', '');
        } ,100);
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
