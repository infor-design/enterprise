/**
* Vertical Tabs Control (TODO: bitly link to soho xi docs)
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

  $.fn.verticaltabs = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'verticaltabs',
        defaults = {
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function VerticalTabs(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    VerticalTabs.prototype = {

      init: function() {
        this
          .build()
          .handleEvents();
      },

      build: function() {
        var self = this;

        this.tablist = self.element.find('.tab-list');
        this.tablist.attr({
          'class': 'tab-list',
          'role': 'tablist',
          'aria-multiselectable': 'false'
        });

        this.anchors = this.tablist.children('li:not(.separator)').children('a');

        // Info bar is only shown on small form factors
        this.info = this.element.find('.info');
        if (!this.info.length) {
          this.info = $('<div class="info"></div>')
            .html('<span class="current-tab">(Current Tab)</span>')
            .insertBefore(this.tablist);
        }

        // More button is only shown on small form factors
        this.more = this.info.find('.btn-actions');
        if (!this.more.length) {
          this.more = $('<button class="btn-actions"></button>')
            .html('<svg class="icon" focusable="false"><use xlink:href="#icon-more"></svg>' +
              '<span class="audible">'+Locale.translate('MoreActions')+'</span>')
            .appendTo(this.info);
        }

        this.moreMenu = this.more.next('.popupmenu');
        if (!this.moreMenu.length) {
          this.moreMenu = $('<ul class="popupmenu"></ul>').insertAfter(this.more);
        }
        this.moreMenu.addClass('is-padded');
        this.defaultMoreItems = this.moreMenu.children('li');
        this.anchors.each(function moreMenuBuilder() {
          var li = $(this).parent().clone(),
            a = li.children('a');

          li.removeClass('tab').removeAttr('role');
          if (li.hasClass('is-selected')) {
            li.addClass('is-checked').removeClass('is-selected');
          }

          a.attr('data-href', a.attr('href')).attr('href', '#').removeAttr('tabindex').removeAttr('role');

          li.appendTo(self.moreMenu);
        });

        // Invoke the popupmenu
        this.more.popupmenu({
          menu: this.moreMenu,
          trigger: 'click'
        });

        // Add ARIA attributes to the anchors
        this.anchors.each(function anchorSetupIterator() {
          var a = $(this);
          a.attr({'role': 'tab', 'aria-expanded': 'false', 'aria-selected': 'false', 'tabindex': '-1'})
           .parent().attr('role', 'presentation').addClass('tab');
        });

        // Build/manage tab panels
        var selected = $();
        function associateAnchorWithPanel() {
          var a = $(this);
          self.panels = self.panels.add( $(a.attr('href')) );
          if (a.parent().is('.is-selected')) {
            selected = a;
          }
        }
        self.panels = $();
        self.anchors.each(associateAnchorWithPanel);
        self.panels
          .attr({'class': 'tab-panel', 'role': 'tabpanel'}).hide()
          .find('h3:first').attr('tabindex', '0');

        if (!selected.length) {
          selected = self.anchors.first().addClass('is-selected');
        }
        this.activate(selected.attr('href'));

        return this;
      },

      getAnchorByHref: function(href) {
        return this.anchors.filter('[href="' + href + '"]');
      },

      getPanelByHref: function(href) {
        return this.panels.filter('[id="' + href.replace(/#/g, '') + '"]');
      },

      highlight: function(href) {
        if (!href) {
          return;
        }

        var a = this.getAnchorByHref(href);
        if (!a.length || a.is('.is-disabled')) {
          return;
        }

        // defocus other tabs
        this.anchors.attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        }).parent().removeClass('is-focused');

        //focus current tab
        a.attr({
          'aria-selected': 'true',
          'tabindex': '0'
        }).parent().addClass('is-focused');

      },

      activate: function(href) {
        var self = this,
          a = self.getAnchorByHref(href),
          newTab = a.parent(),
          oldTab = self.anchors.parents().filter('.is-selected'),
          newPanel = self.getPanelByHref(href),
          oldPanel = self.panels.filter(':visible');

        // Cancel Activation if an event's triggered
        var isCancelled = self.element.trigger('beforeActivate', null);
        if (!isCancelled) {
          return;
        }

        oldPanel.hide();

        // Animate the new panel
        newPanel.stop().fadeIn(250, function fadeInCallback() {
          $(this).removeAttr('style');
          $('#tooltip').addClass('is-hidden');
          $('#dropdown-list, #multiselect-list').remove();
          self.element.trigger('activate', null);
        });

        // Update Tabs
        oldTab.removeClass('is-selected').children('a').attr({'aria-expanded': 'false'});
        newTab.addClass('is-selected').children('a').attr({'aria-expanded': 'true'});
        if (newTab.attr('aria-selected') !== 'true') {
          this.highlight(href);
        }

        // Update More Menu
        this.moreMenu.children('li').removeClass('is-checked')
          .children('a').filter('[data-href="' + href + '"]').parent().addClass('is-checked');

        // Update Title
        this.info.children('.current-tab').text(a.text().trim());
      },

      handleEvents: function() {
        var self = this;

        this.anchors.on('focus.verticaltabs', function anchorFocusHandler() {
          $(this).addClass('is-focused');
        }).on('blur.verticaltabs', function anchorBlurHandler() {
          $(this).removeClass('is-focused');
        }).on('click.verticaltabs', function anchorClickHandler() {
          self.activate($(this).attr('href'));
        }).on('keydown.verticaltabs', function anchorKeydownHandler(e) {
          self.handleKeydown(e);
        });

        this.anchors.parent().on('click.verticaltabs', function liClickHandler() {
          $(this).children('a').triggerHandler('click');
        });

        this.more.on('selected.verticaltabs', function popupmenuSelectedHandler(e, anchor) {
          self.activate(anchor.attr('data-href'));
        });

        $(window).on('resize.verticaltabs', function windowResizeHandler() {
          self.moreMenuCheck();
        });

        return this;
      },

      handleKeydown: function(e) {
        var key = e.which;

        if (key === 37 || key === 38) { // left/up
          this.navigate(-1);
        }

        if (key === 39 || key === 40) { // right/down
          this.navigate(1);
        }
      },

      navigate: function(direction) {
        var anchors = this.anchors.parent().filter(':not(.is-disabled):not(.is-hidden)').children('a'),
          current = anchors.index(anchors.filter('.is-selected')),
          next = current + direction,
          target;

        if (next >= 0 && next < anchors.length) {
          target = anchors.eq(next);
        }

        if (next >= anchors.length) {
          target = anchors.first();
        }

        if (next === -1) {
          target = anchors.last();
        }

        this.activate(target.attr('href'));
        return false;
      },

      moreMenuCheck: function() {
        // Check if below Phone/Tablet breakpoint:
        if ($(window).width() <= 767) {
          if (this.element.hasClass('more-visible')) {
            this.showMoreMenu();
          }
        } else {
          if (!this.element.hasClass('more-visible')) {
            this.hideMoreMenu();
          }
        }
      },

      showMoreMenu: function() {
        this.element.addClass('more-visible');
      },

      hideMoreMenu: function() {
        this.element.removeClass('more-visible');
      },

      unbind: function() {
        this.anchors.off('focus.verticaltabs blur.verticaltabs click.verticaltabs');
        this.anchors.parent().off('click.verticaltabs');
        this.more.off('selected.verticaltabs');

        $(window).off('resize.verticaltabs');

        return this;
      },

      unbuild: function() {
        this.moreMenu.empty();
        if (this.defaultMoreItems.length) {
          this.moreMenu.append(this.defaultMoreItems);
        }

        this.anchors.each(function anchorTeardownIterator() {
          var a = $(this);
          a
            .removeAttr('role').removeAttr('aria-expanded').removeAttr('aria-selected').removeAttr('tabindex')
            .parent().removeAttr('role');
        });

        return this;
      },

      updated: function() {
        this
          .unbind()
          .unbuild();

        return this.init();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this
          .unbind()
          .unbuild();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new VerticalTabs(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
