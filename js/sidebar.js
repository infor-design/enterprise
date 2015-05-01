/**
* Side Bar Menu Control (TODO: bitly link to soho xi docs)
*/

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
        timeout,
        isClick = false,
        header = $('.header').first(),
        sidebar = $('.sidebar-nav'),
        headerHeight = header.outerHeight();

      this.tracker = $('.section-tracker');
      this.trackedHeaders = $('.editorial > .main > .content').find('h2, h3');

      //Handle Scrolling events
      var scrollDiv = $(this.element).closest('.scrollable-container'),
        container = (scrollDiv.length ===1 ? scrollDiv : $(window));

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

        if (isClick) {
          return;
        }

        if (this.tracker) {
          return;
        }

        clearInterval(timeout);
        timeout = setTimeout(function () {

          self.trackedHeaders.each(function (i) {
            var elem = $(this);

            if (elem.offset().top - container.scrollTop() < 0) {
             self.tracker.find('.is-active').removeClass('is-active');
             $('[data-tracker="heading-'+ (i+1) +'"]').addClass('is-active');
            }

            if (container.scrollTop() < headerHeight) {
             self.tracker.find('.is-active').removeClass('is-active');
             $('[data-tracker="heading-0"]').addClass('is-active');
            }
          });

        }, 300);

      });

      if (this.tracker) {
        //append the links for the heading elements
        this.trackedHeaders.each(function (i) {
          var item = $(this),
            trackerItem = $('<a href="#" class="tracker-item">' + item.text() + '</a>');

          trackerItem.attr('data-tracker', 'heading-'+i);
          if (item.is('h3')) {
            trackerItem.addClass('is-indented');
          }
          if (i === 0) {
            trackerItem.addClass('is-active');
          }
          self.tracker.append(trackerItem);

        });

        //Get Rid of the 300ms Delay - Handle Clicking side bar menu items to access sections
        this.tracker.on('touchcancel.sidebar touchend.sidebar', 'a', function (e) {
          e.stopPropagation();
          e.preventDefault();
          $(this).trigger('click');
        }).on('click.sidebar', 'a', function (e) {
          e.preventDefault();

          var idx = $(this).attr('data-tracker').replace('heading-', ''),
            target = $(self.trackedHeaders[idx]);

          isClick = true;
          self.tracker.find('.is-active').removeClass('is-active');

          $('html, body').animate({scrollTop: target.offset().top - 100}, 250);
          $(this).addClass('is-active');
        });
      }
    },

    // Teardown - Remove added markup and events
    destroy: function() {
      $.removeData(this.element[0], pluginName);
      $(window).add('.editorial').off('scroll.sidebar');
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
