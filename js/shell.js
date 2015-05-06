/**
* Shell Control Prototype (TODO: bitly link to soho xi docs)
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

  //NOTE: Just this part in files.

  $.fn.shell = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'shell',
        defaults = {
          propertyName: 'defaultValue'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Shell(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Shell.prototype = {

      init: function() {
        this.settings = settings;
        this.initPopover();
        this.initSideBar();
        this.initSearch();
      },

      initSearch: function () {
        var self = this;

        $('#search').on('keypress', function (e) {
          var search = $(this);

          if (e.which === 13) {
            self.openPopover(search.next('.mingle-popover'), parseInt(search.offset().left, 10) - 8);
          }
        });
      },

      initSideBar: function () {
        $('.mingle-sidebar-btn').on('click.shell', function () {
          $('.mingle-sidebar').toggleClass('is-closed');
          $('.mingle-application').toggleClass('is-full');
          $(this).toggleClass('is-closed');
        });
      },

      // Initialize Popover Logic
      initPopover: function() {
        var self = this;

        $('button[data-toggle="popover"]').attr('aria-haspopup', 'true').on('click', function() {
          var btn = $(this),
            popup = btn.next('.mingle-popover'),
            left = 0;

          if (popup.hasClass('open')) {
            self.closePopover(popup);
          } else {
            setTimeout(function() {
              left = parseInt(btn.offset().left, 10) - 8;

              if (btn.hasClass('mingle-user-btn')) {
                left = parseInt(btn.width(), 10) + parseInt(btn.position().left , 10) - 185;
              }

              if (btn.hasClass('mingle-share-btn')) {
                left = parseInt(btn.width(), 10) + parseInt(btn.position().left , 10) - 327;
              }

              self.openPopover(popup, left);
            }, ($('#search').width() > 35 ? 300 : 0));
          }
        });
      },

      closePopover: function (popup) {
        $(document).off('click.shell');
        $(window).on('off.shell');
        popup.removeClass('open');
      },

      openPopover: function (popup, left) {
        var self = this;

        if (left) {
          popup.css('left', left);
        }
        //position under the button
        popup.addClass('open');
        //add events to close on clickout
        setTimeout(function() {
          $(document).on('click.shell', function(e) {
            if ($(e.target).closest('.mingle-popover').length > 0) {
              return;
            }
            self.closePopover(popup);
          });

          //Close on iframe click
          $(window).on('blur.shell', function() {
            self.closePopover(popup);
          });
        }, 100);
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        $(document).off('click.shell');
        $(window).on('off.shell');
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Shell(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */

