/**
* Side Bar Menu Control
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

  $.fn.sidebar = function() {
    'use strict';

    // Settings and Options
    var pluginName = 'sidebar';

    // Plugin Constructor
    function Sidebar(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Sidebar.prototype = {

      init: function() {
        this.handleEvents();
      },

      handleEvents: function() {
        var self = this,
          header = $('.header').first(),
          sidebar = $('.sidebar-nav');

        if (sidebar.attr('data-is-sticky') === 'false') {
          return;
        }

        this.sectionList = $('.section-tracker');
        this.sections = $('.editorial > .main > .content').find('h2, h3');

        //Handle Scrolling events
        var scrollDiv = $(this.element).closest('.scrollable'),
          container = (scrollDiv.length ===1 ? scrollDiv : $(window));

        if (self.sectionList) {
          var efficientScroll = $.fn.debounce(function() {

            self.sectionList.find('.is-active').removeClass('is-active');
            self.sections.each(function () {
              if (self.isOnScreen(this)) {
                $('a[href="#' + this.id + '"]').addClass('is-active');
              }
              return;
            });

          }, 10);
          container.on('scroll.sidebarMenu', efficientScroll);
        }

        container.on('scroll.sidebar', function () {
          if (!sidebar.is(':visible')) {
            return;
          }

          var offsetScrollTop = sidebar.offset().top - 30;

          if (header.offset().top + header.outerHeight() > offsetScrollTop) {
            sidebar.addClass('is-sticky');
          } else {
            sidebar.removeClass('is-sticky');
          }

        });

        if (this.sectionList) {

          //append the links for the heading elements
          this.sections.each(function (i) {
            var item = $(this),
              id = 'heading'+i,
              link = $('<div><a href="#' + id + '" class="hyperlink' + (i === 0 ? ' is-active' : '') + '">' + item.text() + '</a></div>');

            item.attr('id', id);
            self.sectionList.append(link);
          });

          this.sectionList.find('a').on('touchcancel.sidebar touchend.sidebar', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).trigger('click');
          }).on('click.sidebar', function () {
            var a = $(this);

            a.parent().parent().find('.is-active').removeClass('is-active');
            a.addClass('is-active');
          });

        }
      },

      isOnScreen: function (element) {
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        var scrollDiv = $(this.element).closest('.scrollable'),
          container = (scrollDiv.length ===1 ? scrollDiv : $(window));

        container.off('scroll.sidebar').off('scroll.sidebarMenu');
        this.tracker.offf('touchcancel.sidebar touchend.sidebar click.sidebar');
      }
    };

    // Initialize the plugin just once
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Sidebar(this));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
