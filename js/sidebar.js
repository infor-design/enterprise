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

  $.fn.sidebar = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'sidebar',
      defaults = {
        isSticky: true
      },
      settings = $.extend({}, defaults, options);

    /**
     * Side Bar Menu Control
     * @constructor
     * @param {Object} element
     */
    function Sidebar(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Sidebar.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
        this.isSafari = $('html').is('.is-safari');

        return this;
      },

      build: function() {
        var self = this;

        this.closestHeader = $('.header').first();
        this.sectionList = $('.section-tracker');
        this.sections = $('.editorial > .main > .content > h2'); //,h3

        //append the links for the heading elements
        this.sections.each(function (i) {
          var item = $(this).clone().children().remove().end(),
            id = 'heading' + i,
            link = $('<div><a href="#' + id + '" class="hyperlink' + (i === 0 ? ' is-active' : '') + '">' + item.text() + '</a></div>');

          $(this).attr('id', id);
          self.sectionList.append(link);
        });
        this.anchors = this.sectionList.find('a');

        this.editorialContainer = this.element.closest('.editorial');
        this.pageContainer = this.element.closest('.page-container');
        if (!this.pageContainer.length) {
          this.pageContainer = $(window);
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.anchors.onTouchClick('sidebar').on('click.sidebar', function (e) {
          self.handleAnchorClick(e);
        });

        if (!this.settings.isSticky) {
          return this;
        }

        this.pageContainer.on('scroll.sidebar', function(e) {
          self.handleScroll(e);
          self.adjustCurrentNavItem();
        });

        return this;
      },

      handleScroll: function() {
        this.element.removeAttr('style');

        var editorialContainerOffset = this.editorialContainer.position(),
          sidebarHeight = this.element.outerHeight(),
          containerTopBoundary = editorialContainerOffset.top,
          containerBottomBoundary = editorialContainerOffset.top + this.editorialContainer.outerHeight(true),
          distanceBetweenEditorialContainerAndBottom = this.pageContainer[0].scrollHeight - containerBottomBoundary,
          scrollTop = this.pageContainer.scrollTop();

        // Conditions
        var conditionAffixTop = scrollTop < containerTopBoundary,
          conditionScrollWithBody = scrollTop >= containerTopBoundary && scrollTop + sidebarHeight <= containerBottomBoundary,
          conditionAffixBottom = scrollTop + sidebarHeight > (containerBottomBoundary),
          add = '', remove = '',
          top;

        if (conditionAffixTop) {
          add = 'affix-top';
          remove = 'affix-bottom affix';
        }
        if (conditionScrollWithBody) {
          add = 'affix';
          remove = 'affix-bottom affix-top';
        }
        if (conditionAffixBottom) {
          add = 'affix-bottom';
          remove = 'affix affix-top';
          top = (this.pageContainer[0].scrollHeight - editorialContainerOffset.top - distanceBetweenEditorialContainerAndBottom - sidebarHeight) + 'px';
        }

        this.element.removeClass(remove);
        if (!this.element.hasClass(add)) {
          this.element.addClass(add);
        }

        if (top) {
          this.element[0].style.top = top;
        }

        return;
      },

      adjustCurrentNavItem: function() {
        if (this.dontAdjustWhileScrolling) {
          return;
        }

        var self = this,
          lastActive = this.sectionList.find('.is-active').removeClass('is-active');

        if (lastActive.length && lastActive.is($(document.activeElement))) {
          lastActive[0].blur();
        }

        this.sections.each(function () {
          var s = this;

          if (self.isOnScreen(s)) {
            var tag = $('a[href="#' + s.id + '"]');
            tag.addClass('is-active');
            tag.parent().prev().find('a').removeClass('is-active');
            return false;
          }
        });

        if (this.sectionList.find('.is-active').length === 0) {
          lastActive.addClass('is-active');
        }
        return;
      },

      handleAnchorClick: function(e) {
        var self = this,
          a = $(e.target);
        a.parent().parent().find('.is-active').removeClass('is-active');

        this.dontAdjustWhileScrolling = true;

        this.pageContainer.animate({
          scrollTop: $(a.attr('href')).position().top - 30
        }, {
          duration: 150,
          done: function() {
            self.dontAdjustWhileScrolling = false;
            a.addClass('is-active');
          }
        });

        e.preventDefault();
        return;
      },

      isOnScreen: function (element) {
        var el = $(element),
          pos = el.offset(),
          h = el.outerHeight(true),
          realBottom = pos.top + h;

        return pos.top < window.innerHeight && realBottom > 0;
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      teardown: function() {
        this.container.off('scroll.sidebar').off('scroll.sidebarMenu');
        this.anchors.offTouchClick('sidebar').off('click.sidebar');
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin just once
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Sidebar(this));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
