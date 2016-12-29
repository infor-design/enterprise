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
          useBreadcrumb: false, // If true, displays a breadcrumb on drilldown
          usePopupmenu: false, // If true, changes the Header Title into a popupmenu that can change the current page
          tabs: null, // If defined as an array of Tab objects, displays a series of tabs that represent application sections
          wizardTicks: null, // If defined as an array of Wizard Ticks, displays a Wizard Control that represents steps in a process
          useAlternate: false, // If true, use alternate background/text color for sub-navigation areas
          addScrollClass: false //If true a class will be added as the page scrolls up and down to the header for manipulation. Eg: Docs Page.
        },
        settings = $.extend({}, defaults, options);

    /**
     * Special Toolbar at the top of the page used to faciliate SoHo Xi Nav Patterns
     * @constructor
     * @param {Object} element
     */
    function Header(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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

        this.settings.tabs = !$.isArray(this.settings.tabs) ? null : this.settings.tabs;
        this.settings.wizardTicks = !$.isArray(this.settings.wizardTicks) ? null : this.settings.wizardTicks;

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
          var opts = $.fn.parseOptions(this.toolbarElem);
          this.toolbarElem.toolbar(opts);
        }
        this.toolbar = this.toolbarElem.data('toolbar');

        // Hamburger Icon is optional, but tracking it is necessary.
        this.titleButton = this.element.find('.title > .application-menu-trigger');
        this.hasTitleButton = this.titleButton.length > 0;

        if (this.hasTitleButton) {
          this.toolbarElem.addClass('has-title-button');
          var appMenu = $('#application-menu').data('applicationmenu');
          if (appMenu) {
            appMenu.modifyTriggers([this.titleButton], null, true);
          } else {
            $('#application-menu').applicationmenu({
              triggers: [this.titleButton]
            });
          }
        }

        // Application Tabs would be available from the Application Start, so activate them during build if they exist
        if (this.settings.tabs && this.settings.tabs.length) {
          this.buildTabs();
        }

        if (this.settings.wizardTicks && this.settings.wizardTicks.length) {
          this.buildWizard();
        }

        if (this.settings.usePopupmenu) {
          this.buildPopupmenu();
        }

        //Add a Scrolling Class to manipulate the header
        if (this.settings.addScrollClass) {
          var self =$(this.element),
            scrollDiv = $(this.element).next('.scrollable'),
            container = (scrollDiv.length === 1 ? scrollDiv : $(window)),
            scrollThreshold = this.settings.scrollThreshold ? this.settings.scrollThreshold : 15;

          container.on('scroll.header', function () {
            if (this.scrollTop > scrollThreshold) {
              self.addClass('is-scrolled-down');
            } else {
              self.removeClass('is-scrolled-down');
            }

          });

          if (container.scrollTop() > scrollThreshold ) {
            self.addClass('is-scrolled-down');
          }
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
          this.toolbar.element.triggerHandler('updated');
        }

        this.titleButton.find('.icon.app-header').addClass('go-back');
      },

      // Used for adding a Breadcrumb Element to the Header
      buildBreadcrumb: function() {
        var self = this,
          breadcrumbClass = 'has-breadcrumb';

        if (this.settings.useAlternate) {
          breadcrumbClass = 'has-alternate-breadcrumb';
        }
        this.element.addClass(breadcrumbClass);

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

        this.element.addClass(this.settings.useAlternate ? 'has-alternate-tabs' : 'has-tabs');
        this.tabsContainer[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');

        // NOTE: For demo purposes the markup for tab panels is already inside the Nav Patterns Test page.
        $('#header-tabs-level-1').removeAttr('style');
        $('#header-tabs-level-2').removeAttr('style');

        // Invoke Tabs Control
        this.tabsContainer.tabs({
          containerElement: '#maincontent'
        });
      },

      buildWizard: function() {
        this.element.addClass('has-wizard');

        this.wizard = this.element.find('.wizard');
        if (!this.wizard.length) {
          this.wizard = $('<div class="wizard"></div>').appendTo(this.element);
          var header = $('<div class="wizard-header"></div>').appendTo(this.wizard),
            bar = $('<div class="bar"></div>').appendTo(header);
          $('<div class="completed-range"></div>').appendTo(bar);

          // TODO: Flesh this out so the header control can build the Wizard Ticks based on options
          $('<a href="#" class="tick current"><span class="label">Context Apps</span></a>').appendTo(bar);
          $('<a href="#" class="tick"><span class="label">Utility Apps</span></a>').appendTo(bar);
          $('<a href="#" class="tick"><span class="label">Inbound Configuration</span></a>').appendTo(bar);
          $('<a href="#" class="tick"><span class="label">OID Mapping</span></a>').appendTo(bar);
        }

        this.wizard[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');

        // NOTE: For Demo Purposes, the shifting forms associated with the Wizard are coded
        // inside the Nav Patterns Test page.
        // TODO: Build shifting forms

        // Invoke the Wizard Control
        this.wizard.wizard();
      },

      buildPopupmenu: function() {
        var title = this.toolbarElem.children('.title');
        this.titlePopup = title.find('.btn-menu');
        if (!this.titlePopup.length) {
          var heading = title.find('h1'); // If H1 doesn't exist here, you're doing it wrong.
          heading.wrap('<button id="header-menu" type="button" class="btn-menu"></button>');
          this.titlePopup = heading.parent('.btn-menu');
        }
        this.titlePopupMenu = this.titlePopup.next('.popupmenu');
        if (!this.titlePopupMenu.length) {
          this.titlePopupMenu = $('<ul class="popupmenu is-selectable"></ul>').insertAfter(this.titlePopup);
          $('<li class="is-checked"><a href="#">Page One Title</a></li>' +
            '<li><a href="#">Page Two Title</a></li>' +
            '<li><a href="#">Page Three Title</a></li>' +
            '<li class="is-disabled"><a href="#">Page Four Title</a></li>' +
            '<li><a href="#">Page Five Title</a></li>').appendTo(this.titlePopupMenu);
        }
        this.titlePopupMenu.addClass('is-selectable');

        // Set the text on the Title
        this.titlePopup.children('h1').text(this.titlePopupMenu.children().first().text());

        // Invoke the Popupmenu on the Title
        this.titlePopup.button().popupmenu();

        // Update the Header toolbar to account for the new button
        this.toolbarElem.triggerHandler('updated');
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

        // Popupmenu Events
        if (this.settings.usePopupmenu) {
          this.titlePopup.on('selected.header', function(e, anchor) {
            $(this).children('h1').text(anchor.text());
          });
        }

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
        this.element.find('.page-changer').on('selected.header', function (e, link) {
          // Change Theme
          if (link.attr('data-theme')) {
            var theme = link.attr('data-theme');
            $('body').trigger('changetheme', theme.replace('-theme',''));
            return;
          }

          // TODO: Change Lang
          if (link.attr('data-lang')) {
            Locale.set(link.attr('data-lang'));
            return;
          }

          // Change Color
          var color = link.attr('data-rgbcolor');
          $('body').trigger('changecolors', [color]);
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
        if (this.settings.usePopupmenu) {
          this.removePopupmenu();
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
        this.removeWizard();
        this.removePopupmenu();
        this.removeButton();

        this.element.trigger('afterreset');
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
          this.toolbar.element.triggerHandler('updated');
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

          self.element.off(transitionEnd + '.breadcrumb-header');
          self.breadcrumb.off().remove();
          self.breadcrumb = $();
        }

        self.element.removeClass('has-breadcrumb').removeClass('has-alternate-breadcrumb');
        if (this.breadcrumb.is(':not(:hidden)')) {
          this.element.one(transitionEnd + '.breadcrumb-header', destroyBreadcrumb);
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

          self.element.off(transitionEnd + '.tabs-header');
          self.tabsContainer.data('tabs').destroy();
          self.tabsContainer.remove();
          self.tabsContainer = null;

          // NOTE: For demo purposes the markup for tab panels is already inside the Nav Patterns Test page.
          $('#header-tabs-level-1').css('display', 'none');
          $('#header-tabs-level-2').css('display', 'none');
        }

        this.element.removeClass('has-tabs').removeClass('has-alternate-tabs');
        if (this.tabsContainer.is(':not(:hidden)')) {
          this.element.one(transitionEnd + '.tabs-header', destroyTabs);
          timeout = setTimeout(destroyTabs, 300);
        } else {
          destroyTabs();
        }
      },

      removeWizard: function() {
        if (!this.wizard || !this.wizard.length) {
          return;
        }

        var self = this,
          transitionEnd = $.fn.transitionEndName(),
          timeout;

        function destroyWizard() {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          self.element.off(transitionEnd + '.wizard-header');
          self.wizard.data('wizard').destroy();
          self.wizard.remove();
          self.wizard = null;

        }

        this.element.removeClass('has-wizard');
        if (this.wizard.is(':not(:hidden)')) {
          this.element.one(transitionEnd + '.wizard-header', destroyWizard);
          timeout = setTimeout(destroyWizard, 300);
        } else {
          destroyWizard();
        }
      },

      removePopupmenu: function() {
        var self = this;

        if (!this.titlePopup || !this.titlePopup.length) {
          return;
        }

        this.titlePopup.data('popupmenu').destroy();
        this.titlePopup.data('button').destroy();
        this.titlePopupMenu.remove();
        this.titlePopup.children('h1').detach().insertBefore(self.titlePopup);
        this.titlePopup.remove();

        this.titlePopup = undefined;
        this.titlePopupMenu = undefined;

        this.toolbarElem.triggerHandler('updated');
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

        $.removeData(this.element[0], pluginName);
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
