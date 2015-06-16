/**
* Header Control (TODO: Link to Docs)
* Special Toolbar at the top of the page used to faciliate SoHo Xi Nav Patterns
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

  $.fn.header = function(options) {

    'use strict';

    // Tab Settings and Options
    var pluginName = 'header',
        defaults = {
          demoOptions: true, // Used to enable/disable default SoHo Xi options for demo purposes
          useBackButton: true, // If true, displays a back button next to the title in the header toolbar
          useBreadcrumb: true, // If true, displays a breadcrumb on drilldown
          tabs: null, // If defined as an array of Tab objects, displays a series of tabs that represent application sections
          useAlternate: true // If true, use alternate background/text color for sub-navigation areas
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Header(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    Header.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents();

        // Theme, Personalization, Language Changer, Scrolling
        if (this.settings.demoOptions) {
          this.initPageChanger();
        }
      },

      setup: function() {
        // TODO: Settings all work independently, but give better descriptions
        this.settings.demoOptions = this.element.attr('data-demo-options') ? this.element.attr('data-demo-options') === 'true' : this.settings.demoOptions;
        this.settings.useBackButton = this.element.attr('data-use-backbutton') ? this.element.attr('data-use-backbutton') === 'true' : this.settings.useBackButton;
        this.settings.useBreadcrumb = this.element.attr('data-use-breadcrumb') ? this.element.attr('data-use-breadcrumb') === 'true' : this.settings.useBreadcrumb;
        this.settings.useAlternate = this.element.attr('data-use-alternate') ? this.element.attr('data-use-alternate') === 'true' : this.settings.useAlternate;

        this.settings.tabs = !Array.isArray(this.settings.tabs) ? undefined : this.settings.tabs;

        this.titleText = this.element.find('.title > h1');

        // Used to track levels deep
        this.levelsDeep = [];
        this.levelsDeep.push('' + this.titleText.text());

        return this;
      },

      build: function() {
        this.toolbarElem = this.element.find('.toolbar');

        // Build toolbar if it doesn't exist
        if (!this.toolbarElem.data('toolbar')) {
          this.toolbarElem.toolbar();
        }
        this.toolbar = this.toolbarElem.data('toolbar');

        // Hamburger Icon is optional, but tracking it is necessary.
        this.titleButton = this.element.find('.title > .application-menu-trigger');
        this.hasTitleButton = this.titleButton.length > 0;

        if (this.hasTitleButton) {
          this.toolbarElem.addClass('has-title-button');
        }

        // Application Tabs would be available from the Application Start, so activate them during build if they exist
        if (this.settings.tabs && this.settings.tabs.length) {
          this.buildTabs();
        }

        return this;
      },

      buildTitleButton: function() {
        if (this.levelsDeep.length > 1 && !this.hasTitleButton && !this.titleButton.length) {
          this.titleButton = $('<button class="btn-icon back-button" type="button"></button>');
          this.titleButton.html('<span class="audible">'+ Locale.translate('Drillup') +'</span>' +
            '<span class="icon app-header go-back">' +
              '<span class="one"></span>' +
              '<span class="two"></span>' +
              '<span class="three"></span>' +
            '</span>');
          this.titleButton.prependTo(this.element.find('.title'));

          // Need to trigger an update on the toolbar control to make sure tabindexes and events are all firing on the button
          this.toolbar.element.trigger('updated');
        }

        this.titleButton.find('.icon.app-header').addClass('go-back');
      },

      // Used for adding a Breadcrumb Element to the Header
      buildBreadcrumb: function() {
        var self = this;
        this.element.addClass('has-breadcrumb');

        this.breadcrumb = this.element.find('.breadcrumb');
        if (!this.breadcrumb.length) {
          this.breadcrumb = $('<nav class="breadcrumb" role="navigation" style="display: none;"></nav>').appendTo(this.element);
          this.breadcrumb.on('click', 'a', function(e) {
            self.handleBreadcrumbClick(e);
          });
        }

        this.breadcrumb[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');
        this.adjustBreadcrumb();
      },

      // Builds Breadcrumb markup that reflects the current state of the application
      adjustBreadcrumb: function() {
        var last = this.levelsDeep[this.levelsDeep.length - 1];
        this.breadcrumb.empty();

        var bcMarkup = $('<ol aria-label="breadcrumb"></ol>').appendTo(this.breadcrumb);
        $.each(this.levelsDeep, function(i, txt) {
          var current = '';
          if (last === txt) {
            current = ' current';
          }

          bcMarkup.append($('<li><a href="#" class="hyperlink'+ current +'">'+ txt +'</a></li>'));
        });
      },

      buildTabs: function() {
        this.tabsContainer = this.element.find('.tab-container');
        if (!this.tabsContainer.length) {
          this.tabsContainer = $('<div class="tab-container"></div>').appendTo(this.element);

          // TODO: Flesh this out so that the header control can build tabs based on options
          var tablist = $('<ul class="tab-list" role="tablist"></ul>').appendTo(this.tabsContainer);
          $('<li class="tab"><a href="#header-tabs-home" role="tab">SoHo Xi Controls | Patterns</a></li>').appendTo(tablist);
          $('<li class="tab"><a href="#header-tabs-level-1" role="tab">Level 1 Detail</a></li>').appendTo(tablist);
          $('<li class="tab"><a href="#header-tabs-level-2" role="tab">Level 2 Detail</a></li>').appendTo(tablist);
        }

        this.element.addClass('has-tabs');
        this.tabsContainer[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');

        // NOTE: For demo purposes the markup for tab panels is already inside the Nav Patterns Test page.
        $('#header-tabs-level-1').removeAttr('style');
        $('#header-tabs-level-2').removeAttr('style');

        // Invoke Tabs Control
        this.tabsContainer.tabs();
      },

      handleEvents: function() {
        var self = this;

        this.element
          .on('updated.header', function() {
            self.updated();
          })
          .on('reset.header', function() {
            self.reset();
          })
          .on('drilldown.header', function(e, viewTitle) {
            self.drilldown(viewTitle);
          })
          .on('drillup.header', function(e, viewTitle) {
            self.drillup(viewTitle);
          });

        // Events for the title button.  e.preventDefault(); stops Application Menu functionality while drilled
        this.titleButton.bindFirst('click.header', function(e) {
          if (self.levelsDeep.length > 1) {
            e.stopImmediatePropagation();
            self.drillup();
            e.returnValue = false;
          }
        });

        return this;
      },

      handleBreadcrumbClick: function(e) {
        var selected = $(e.target).parent(),
          breadcrumbs = this.breadcrumb.find('li'),
          selectedIndex = breadcrumbs.index(selected),
          delta;

        if (selected.hasClass('current')) {
          return;
        }

        if (selectedIndex === 0) {
          return this.reset();
        }

        if (selectedIndex < breadcrumbs.length - 1) {
          delta = (breadcrumbs.length - 1) - selectedIndex;
          while (delta > 0) {
            this.drillup();
            delta = delta - 1;
          }
        }
      },

      initPageChanger: function () {
        this.element.on('selected', function (e, link) {
          var ul = link.parent().parent(),
            origMenu = ul.attr('data-original-menu');

          ul.find('.is-checked').removeClass('is-checked');
          link.parent().addClass('is-checked');

          if (origMenu) {
            origMenu = $('#' + origMenu);
            var opt = origMenu.children('li').filter(function() {
              return $(this).children('a').text() === link.text();
            });

            origMenu.children('li').removeClass('is-checked');
            opt.addClass('is-checked');
          }

          // Change Theme
          if (link.attr('data-theme')) {
            $('body').fadeOut('fast', function() {
              $('#stylesheet').attr('href', '/stylesheets/'+ link.attr('data-theme') +'.css');
              $(this).fadeIn('slow');
            });
            return;
          }

          // TODO: Change Lang
          if (link.attr('data-lang')) {
            Locale.set(link.attr('data-lang'));
            return;
          }

          // Change Color
          var color = link.attr('data-rgbcolor');
          $('.is-personalizable').css('background-color', color);
        });
      },

      // Activates the Drilldown Header View
      drilldown: function(viewTitle) {
        this.element.addClass('is-drilldown');
        this.levelsDeep.push(viewTitle.toString());
        this.titleText.text(this.levelsDeep[this.levelsDeep.length - 1]);

        if (this.settings.useBackButton) {
          this.buildTitleButton();
        }

        if (this.settings.useBreadcrumb) {
          if (!this.breadcrumb || !this.breadcrumb.length) {
            this.buildBreadcrumb();
            this.breadcrumb.css({'display': 'block', 'height': 'auto'});
          } else {
            this.adjustBreadcrumb();
          }
        }
      },

      drillup: function(viewTitle) {
        var title;
        this.element.removeClass('is-drilldown');

        if (this.levelsDeep.length > 1) {
          this.levelsDeep.pop();
          title = this.levelsDeep[this.levelsDeep.length - 1];
        }

        if (viewTitle !== undefined) {
          title = viewTitle;
        }

        if (this.levelsDeep.length > 1) {
          if (this.settings.useBreadcrumb) {
            this.adjustBreadcrumb();
          }
          this.titleText.text(title);
          return;
        }

        // Completely reset all the way back to normal
        title = this.levelsDeep[0];

        if (this.settings.useBackButton) {
          this.removeButton();
        }
        if (this.settings.useBreadcrumb) {
          this.removeBreadcrumb();
        }

        this.titleText.text(title);
        this.element.trigger('drillTop');
      },

      reset: function() {
        while (this.levelsDeep.length > 1) {
          this.levelsDeep.pop();
        }
        this.titleText.text(this.levelsDeep[0]);

        this.removeBreadcrumb();
        this.removeTabs();
        this.removeButton();

        this.element.trigger('afterReset');
        return this;
      },

      removeButton: function() {
        if (this.hasTitleButton) {
          this.titleButton.find('.icon.app-header').removeClass('go-back');
          return;
        }

        if (this.titleButton && this.titleButton.length) {
          this.titleButton.remove();
          this.titleButton = $();

          // Need to trigger an update on the toolbar control to make sure tabindexes and events are all firing on the button
          this.toolbar.element.trigger('updated');
        }
      },

      removeBreadcrumb: function() {
        if (!this.breadcrumb || !this.breadcrumb.length) {
          return;
        }

        var self = this,
          transitionEnd = $.fn.transitionEndName(),
          timeout;

        function destroyBreadcrumb() {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          self.element.off(transitionEnd + '.header');
          self.breadcrumb.off().remove();
          self.breadcrumb = $();
        }

        self.element.removeClass('has-breadcrumb');
        if (this.breadcrumb.is(':not(:hidden)')) {
          this.element.one(transitionEnd + '.header', destroyBreadcrumb);
          timeout = setTimeout(destroyBreadcrumb, 300);
        } else {
          destroyBreadcrumb();
        }
      },

      removeTabs: function() {
        if (!this.tabsContainer || !this.tabsContainer.length) {
          return;
        }

        var self = this,
          transitionEnd = $.fn.transitionEndName(),
          timeout;

        function destroyTabs() {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          self.element.off(transitionEnd + '.header');
          self.tabsContainer.data('tabs').destroy();
          self.tabsContainer.remove();
          self.tabsContainer = null;

          // NOTE: For demo purposes the markup for tab panels is already inside the Nav Patterns Test page.
          $('#header-tabs-level-1').css('display', 'none');
          $('#header-tabs-level-2').css('display', 'none');
        }

        this.element.removeClass('has-tabs');
        if (this.tabsContainer.is(':not(:hidden)')) {
          this.element.one(transitionEnd + '.header', destroyTabs);
          timeout = setTimeout(destroyTabs, 300);
        } else {
          destroyTabs();
        }
      },

      // teardown events
      unbind: function() {
        this.titleButton.off('click.header');
        this.element.off('drilldown.header drillup.header');
        return this;
      },

      updated: function() {
        this
          .reset()
          .unbind()
          .init();
      },

      destroy: function() {
        this.unbind();
        if (this.hasTitleButton) {
          this.toolbarElem.removeClass('has-title-button');
        }

        $.removeData(this[0], pluginName);
      }
    };

    // Keep the Chaining while Initializing the Control (Only Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Header(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
