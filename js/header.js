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
          alternateBreadcrumb: true // If true, uses alternate breadcrumb color
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
        this.settings.alternateBreadcrumb = this.element.attr('data-alternate-breadcrumb') ? this.element.attr('data-alternate-breadcrumb') === 'true' : this.settings.alternateBreadcrumb;

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

        // Track breadcrumb
        this.breadcrumb = $();

        return this;
      },

      buildTitleButton: function() {
        var self = this;
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

        // Events for the title button.  e.preventDefault(); stops Application Menu functionality while drilled
        if (this.levelsDeep.length < 3) {
          this.titleButton.bindFirst('click.header', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.drillup();
          });
        }
      },

      // Used for adding a Breadcrumb Element to the Header
      buildBreadcrumb: function() {
        this.element.addClass('has-breadcrumb');

        this.breadcrumb = this.element.find('.breadcrumb');
        if (!this.breadcrumb.length) {
          this.breadcrumb = $('<nav class="breadcrumb" role="navigation" style="display: none;"></nav>').appendTo(this.element);
        }

        if (this.settings.alternateBreadcrumb) {
          this.breadcrumb.addClass('alternate');
        }

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

      handleEvents: function() {
        var self = this;

        this.element.on('drilldown.header', function(e, viewTitle) {
          self.drilldown(viewTitle);
        });
        this.element.on('drillup.header', function(e, viewTitle) {
          self.drillup(viewTitle);
        });

        return this;
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

        if (this.settings.useBreadcrumb && !this.breadcrumb.length) {
          this.buildBreadcrumb();
          this.breadcrumb.css('display', 'block').animateOpen();
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

        if (this.levelsDeep.length < 2) {
          title = this.levelsDeep[0];

          if (this.settings.useBackButton) {
            this.removeButton();
          }

          if (this.settings.useBreadcrumb) {
            this.removeBreadcrumb();
          }
        } else {
          if (this.settings.useBreadcrumb) {
            this.adjustBreadcrumb();
          }
        }

        this.titleText.text(title);
      },

      removeButton: function() {
        this.titleButton.off('click.header');

        if (this.hasTitleButton) {
          this.titleButton.find('.icon.app-header').removeClass('go-back');
        }

        if (!this.hasTitleButton && this.titleButton && this.titleButton.length) {
          this.titleButton.remove();
          this.titleButton = $();

          // Need to trigger an update on the toolbar control to make sure tabindexes and events are all firing on the button
          this.toolbar.element.trigger('updated');
        }
      },

      removeBreadcrumb: function() {
        var self = this;
        function destroyBreadcrumb() {
          self.breadcrumb.remove();
          self.breadcrumb = $();

          self.element.removeClass('has-breadcrumb');
        }

        if (this.breadcrumb.is(':not(:hidden)')) {
          this.breadcrumb.on('animateClosedComplete.header', destroyBreadcrumb).animateClosed();
        } else {
          destroyBreadcrumb();
        }
      },

      // teardown events
      unbind: function() {
        this.element.off('drilldown.header drillup.header');
        return this;
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
      } else {
        instance = $.data(this, pluginName, new Header(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
