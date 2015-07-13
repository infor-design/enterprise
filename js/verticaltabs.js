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
          containerElement: null // If defined, uses a different container for tab panels instead of $(this.element)
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

        this.container = this.element;
        var container = $(this.settings.containerElement);
        if (container.length) {
          this.container = container;
        }

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

      getAnchor: function(href) {
        if (href.indexOf('#') === -1) {
          href = '#' + href;
        }
        return this.anchors.filter('[href="' + href + '"]');
      },

      getPanel: function(href) {
        return this.panels.filter('[id="' + href.replace(/#/g, '') + '"]');
      },

      getMenuItem: function(href) {
        if (href.indexOf('#') === -1) {
          href = '#' + href;
        }
        return this.moreMenu.children().children().filter('[data-href="'+ href +'"]').parent();
      },

      highlight: function(href) {
        if (!href) {
          return;
        }

        var a = this.getAnchor(href);
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
          a = self.getAnchor(href),
          newTab = a.parent(),
          oldTab = self.anchors.parents().filter('.is-selected'),
          newPanel = self.getPanel(href),
          oldPanel = self.panels.filter(':visible');

        // Cancel Activation if an event's triggered
        var isCancelled = self.element.trigger('beforeActivate', null);
        if (!isCancelled) {
          return;
        }

        oldPanel.removeAttr('style').hide();

        // Animate the new panel
        newPanel.show(0, function fadeInCallback() {
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

        // Focus
        a.focus();
      },

      handleEvents: function() {
        var self = this;

        this.tablist.on('focus.verticaltabs', 'a', function anchorFocusHandler(e) {
          if ($(this).parent().is('.is-disabled')) {
            e.preventDefault();
            return false;
          }

          self.anchors.parent().removeClass('is-focused');
          $(this).parent().addClass('is-focused');
        }).on('blur.verticaltabs', 'a', function anchorBlurHandler() {
          $(this).parent().removeClass('is-focused');
        }).onTouchClick('verticaltabs', 'a').on('click.verticaltabs', 'a', function anchorClickHandler(e) {
          return self.handleClick(e);
        }).on('keydown.verticaltabs', 'a', function anchorKeydownHandler(e) {
          return self.handleKeydown(e);
        }).onTouchClick('verticaltabs', 'li').on('click.verticaltabs', 'li', function liClickHandler() {
          $(this).children('a').trigger('click');
        });

        this.more.on('selected.verticaltabs', function popupmenuSelectedHandler(e, anchor) {
          self.activate(anchor.attr('data-href'));
        });

        /*
        $(window).on('resize.verticaltabs', function windowResizeHandler() {
          //self.moreMenuCheck();
        });
        */

        return this;
      },

      handleClick: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var a = $(e.target);
        if (a.parent().is('.is-disabled')) {
          return false;
        }

        this.activate(a.attr('href'));
        return true;
      },

      handleKeydown: function(e) {
        var key = e.which;

        // Pass through meta keys
        if (e.shiftKey || e.ctrlKey || e.metaKey || (e.altKey && key !== 8) || key === 9) {
          return true;
        }

        if (key === 37 || key === 38) { // left/up
          this.navigate(-1);
          return true;
        }

        if (key === 39 || key === 40) { // right/down
          this.navigate(1);
          return true;
        }

        if (key === 13 || key === 32) { // enter/spacebar
          this.activate(this.anchors.parent().filter('.is-focused').children('a').attr('href'));
          return true;
        }

        return false;
      },

      navigate: function(direction) {
        var lis = this.anchors.parent().filter(':not(.is-disabled):not(.hidden)'),
          current = lis.index(lis.filter('.is-focused')),
          next = current + direction,
          target;

        if (next >= 0 && next < lis.length) {
          target = lis.eq(next);
        }

        if (next >= lis.length) {
          target = lis.first();
        }

        if (next === -1) {
          target = lis.last();
        }

        this.highlight(target.children('a').attr('href'));
        return false;
      },

      // Adds a new tab into the list and properly binds events
      add: function(tabId, options, atIndex) {
        if (!tabId) {
          return this;
        }

        if (!options) {
          options = {};
        }

        // Sanitize
        tabId = '' + tabId.replace(/#/g, '');
        options.name = options.name ? options.name.toString() : '';

        function getObjectFromSelector(sourceString) {
          var contentType = typeof sourceString;
          switch(contentType) {
            case 'string':
              var hasId = sourceString.match(/#/g);
              // Text Content or a Selector.
              if (hasId !== null) {
                var obj = $(sourceString);
                sourceString = obj.length ? $(sourceString).clone() : sourceString;
              }
              // do nothing if it's just a string of text.
              break;
            case 'object':
              // jQuery object or HTML Element
              sourceString = $(sourceString).clone();
              break;
          }
        }
        if (options.content) {
          getObjectFromSelector(options.content);
        }

        // Build
        var tabHeaderMarkup = $('<li role="presentation" class="tab"></li>'),
          anchorMarkup = $('<a href="#'+ tabId +'" role="tab" aria-expanded="false" aria-selected="false" tabindex="-1">'+ options.name +'</a>'),
          tabContentMarkup = $('<div id="'+ tabId +'" class="tab-panel" role="tabpanel" style="display: none;"></div>'),
          moreMenuMarkup = $('<li role="presentation"><a href="#" data-href="#'+ tabId +'" tabindex="-1" role="menuitem">'+ options.name +'</a></li>');

        tabHeaderMarkup.html(anchorMarkup);
        tabContentMarkup.html(options.content);

        // Insert markup at the very end, or at the specified index.
        if (atIndex === undefined || isNaN(atIndex)) {
          this.tablist.append(tabHeaderMarkup);
          this.container.append(tabContentMarkup);
          this.moreMenu.append(moreMenuMarkup);
        } else {
          var tabs = this.tablist.children('li'),
            insertBefore = tabs.eq(atIndex).length > 0,
            targetIndex = insertBefore ? atIndex : tabs.length - 1;

          if (!insertBefore) {
            tabHeaderMarkup.insertAfter(tabs.eq(targetIndex));
            tabContentMarkup.insertAfter(this.container.children().filter('.tab-panel').eq(targetIndex));
            moreMenuMarkup.insertAfter(this.moreMenu.children().eq(targetIndex + 2));
          } else {
            tabHeaderMarkup.insertBefore(tabs.eq(targetIndex));
            tabContentMarkup.insertBefore(this.container.children().filter('.tab-panel').eq(targetIndex));
            moreMenuMarkup.insertBefore(this.moreMenu.children().eq(targetIndex));
          }
        }

        // Add each new part to their respective collections.
        this.panels = this.panels.add(tabContentMarkup);
        this.anchors = this.anchors.add(anchorMarkup);

        return this;
      },

      remove: function(tabId) {
        if (!tabId) {
          return this;
        }
        tabId = tabId.replace(/#/g, '');

        var targetAnchor = this.getAnchor(tabId),
          targetLi = targetAnchor.parent(),
          targetPanel = this.getPanel(tabId),
          targetMenuOpt = this.getMenuItem(tabId),
          targetLiIndex = this.tablist.children('li').index(targetLi),
          prevLi = targetLi.prev();

        // Remove these from the collections
        this.panels = this.panels.not(targetPanel);
        this.anchors = this.anchors.not(targetAnchor);

        // Remove Markup
        targetLi.remove();
        targetPanel.remove();
        targetMenuOpt.remove();

        // If any tabs are left in the list, set the previous tab as the currently active one.
        var count = targetLiIndex - 1;
        while (count > -1) {
          count = -1;
          if (prevLi.is('.separator') || prevLi.is(':hidden') || prevLi.is('.is-disabled')) {
            prevLi = prevLi.prev();
            count = count - 1;
          }
        }
        if (prevLi.length === 0) {
          return this;
        }

        var a = prevLi.children('a');
        this.activate(a.attr('href'));
        return this;
      },

      // Hides a tab
      hide: function(tabId) {
        var a = this.getAnchor(tabId);
        this.activatePrevious(tabId);
        return a.length ? a.parent().addClass('hidden') : null;
      },

      // Shows a tab
      show: function(tabId) {
        var a = this.getAnchor(tabId);
        return a.length ? a.parent().removeClass('hidden') : null;
      },

      // Disables an individual tab
      disableTab: function(tabId) {
        var a = this.getAnchor(tabId);
        this.activatePrevious(tabId);
        return a.length ? a.parent().addClass('is-disabled') : null;
      },

      // Enables an individual tab
      enableTab: function(tabId) {
        var a = this.getAnchor(tabId);
        return a.length ? a.parent().removeClass('is-disabled') : null;
      },

      // Takes a tab ID and returns a jquery object containing the previous available tab
      activatePrevious: function(tabId) {
        var tab = this.getAnchor(tabId).parent(),
          filter = 'li:not(.separator):not(.hidden):not(.is-disabled)',
          tabs = this.tablist.find(filter),
          target = tabs.eq(tabs.index(tab) - 1);

        while(target.length && !target.is(filter)) {
          target = tabs.eq(tabs.index(target) - 1);
        }

        if (tab.is('.is-selected') && target.length) {
          this.activate(target.children('a').attr('href'));
        }

        return target;
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
        this.tablist.off('focus.verticaltabs blur.verticaltabs click.verticaltabs keydown.verticaltabs', 'a')
          .offTouchClick('verticaltabs', 'a')
          .off('click.verticaltabs', 'li')
          .offTouchClick('verticaltabs', 'li');
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
