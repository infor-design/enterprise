/**
 * Page Bootstrapper
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

  $.fn.initialize = function(locale) {
    var self = this,
      ua = navigator.userAgent || navigator.vendor || window.opera,
      html = $('html'); // User-agent string

    if (navigator.userAgent.indexOf('Safari')  !== -1 &&
        navigator.userAgent.indexOf('Chrome')  === -1 &&
        navigator.userAgent.indexOf('Android') === -1) {
      html.addClass('is-safari');
    }

    if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
      html.addClass('is-mac');
    }

    if (navigator.userAgent.indexOf('Firefox') > 0) {
      html.addClass('is-firefox');
    }

    //Class-based detection for IE
    if (ua.match(/Edge\//)) {
      html.addClass('ie ie-edge');
    }
    if (ua.match(/Trident/)) {
      html.addClass('ie');
    }
    if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
      ua.indexOf('MSIE 8.0') > -1 ||
      document.documentMode === 8) {
      html.addClass('ie8');
    }
    if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
      html.addClass('ie9');
    }
    if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
      html.addClass('ie10');
    } else {
      if (ua.match(/Trident\/7\./)) {
        html.addClass('ie11');
      }
    }

    // Class-based detection for iOS
    // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
    if ((/iPhone|iPod|iPad/).test(ua)) {
      html.addClass('ios');

      var iDevices = ['iPod', 'iPad', 'iPhone'];
      for (var i = 0; i < iDevices.length; i++) {
        if (new RegExp(iDevices[i]).test(ua)) {
          html.addClass(iDevices[i].toLowerCase());
        }
      }
    }

    var initAll = function () {
      var returnObj;

      //Iterate all objects we are initializing
      returnObj = self.filter(':not(svg):not(use):not(.no-init)').each(function() {
        var elem = $(this),
          noinitExcludes = '.no-init, [data-init]';

        function invokeWithInlineOptions(elem, plugin) {
          var options = $.fn.parseOptions(elem);
          $(elem)[plugin](options);
        }

        function matchedItems(selector) {
          var items = elem.find(selector);
          if (elem.filter(selector).length) {
            items = items.add(elem);
          }
          return items;
        }

        function simpleInit(plugin, selector) {
          //Allow only the plugin name to be specified if the default selector is a class with the same name
          //Like $.fn.header applying to elements that match .header
          if (typeof selector === 'undefined') {
            selector = '.' + plugin;
          }

          if ($.fn[plugin]) {
            matchedItems(selector).each(function () {
              var elem = $(this);

              if (elem.is(noinitExcludes) && selector !=='[data-trackdirty="true"]') {
                return;
              }

              if (elem.parents().hasClass('no-init')) {
                return;
              }

              // Don't invoke elements inside of "container" controls that need to invoke their internal
              // items in a specific order.
              if (elem.parents('.toolbar').length && !elem.parents().hasClass('masthead')) {
                return;
              }

              invokeWithInlineOptions(this, plugin);
            });
          }

          // Radio switch
          matchedItems('.radio-section input:radio.handle').change(function() {
            if (this.checked) {
              var option = $(this).closest('.option'),
              siblings = option.siblings(),
              fields = 'button, select, input[type="text"]';

              $(fields, option).removeAttr('disabled');
              $(fields, siblings).attr('disabled','disabled');
            }
          });
        }

        // Application Menu
        if ($.fn.applicationmenu) {
          matchedItems('#application-menu').applicationmenu({
            triggers: elem.find('.application-menu-trigger')
          });
        }

        // Personalization
        if ($.fn.personalize) {
          matchedItems('body').personalize();
        }

        //Array of plugin names and selectors (optional) for no-configuration initializations
        var simplePluginMappings = [
          //Tabs
          ['tabs', '.tab-container:not(.vertical)'],

          //Vertical Tabs
          ['verticaltabs', '.tab-container.vertical'],

          //Select / DropDowns
          ['dropdown', 'select.dropdown:not(.multiselect)'],
          ['dropdown', 'select.dropdown-xs:not(.multiselect)'],
          ['dropdown', 'select.dropdown-sm:not(.multiselect)'],
          ['dropdown', 'select.dropdown-lg:not(.multiselect)'],

          //Modals
          ['modal'],

          //Sliders
          ['slider', 'input[type="range"], .slider'],

          //Editors
          ['editor'],

          //Tooltips
          ['tooltip', '[title]'],

          //Tree
          ['tree'],

          //Rating
          ['rating'],

          //Light Box
          ['lightbox'],

          //Progress
          ['progress', '.progress-bar'],

          //Format
          ['mask', 'input[data-mask]'],

          //Auto Complete
          ['autocomplete', '.autocomplete:not([data-init])'],

          //Multiselect
          ['multiselect', 'select[multiple]:not(.dropdown), .multiselect:not([data-init])'],

          //Button with Effects
          ['button', '.btn, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split, .btn-secondary-border'],

          //Hide Focus
          ['hideFocus', 'a.hide-focus, a.tick, a.hyperlink'],

          //Pager
          ['pager', '.paginated'],

          //Track Dirty
          ['trackdirty', '[data-trackdirty="true"]'],

          //Text Area
          ['textarea', 'textarea'],

          //Spinbox
          ['spinbox'],

          //sort drag and drop
          ['arrange'],

          //Swap List
          ['swaplist'],

          //Color Picker
          ['colorpicker'],

          //Date Picker
          ['datepicker'],

          //Time Picker
          ['timepicker'],

          //Tag
          ['tag'],

          //Busy Indicator
          ['busyindicator','.busy, .busy-xs, .busy-sm'],

          ['header'],

          ['fileupload'],

          ['fileuploadadvanced', '.fileupload-advanced'],

          ['about'],

          ['contextualactionpanel', '.contextual-action-panel-trigger'],

          ['sidebar', '.sidebar-nav'],

          ['expandablearea', '.expandable-area'],

          ['modalsearch', '.modal-search'],

          ['signin'],

          ['homepage'],

          ['lookup', '.lookup:not([data-init])'],

          ['wizard'],

          ['splitter'],

          ['popdown', '[data-popdown]']
        ];

        //Do initialization for all the simple controls
        for(var i = 0; i < simplePluginMappings.length; i++) {
          simpleInit.apply(null, simplePluginMappings[i]);
        }

        if ($.fn.popupmenu) {
          // Don't double-invoke menu buttons
          var btnExcludes = ', .btn-actions, .btn-filtering, .btn-menu';

          //Context Menus
          matchedItems('[data-popupmenu]:not('+ noinitExcludes + btnExcludes + ')').each(function () {
            var triggerButton = $(this),
              options = $.extend({}, $.fn.parseOptions(this)),
              popupData = triggerButton.attr('data-popupmenu');

            if (popupData) {
              options.menuId = popupData;
            }

            triggerButton.popupmenu(options);
          });

          //Button-based Popup-Menus (Action/More Button, Menu Buttons, etc.)
          matchedItems('.btn-filtering, .btn-menu, .btn-actions').filter(':not('+ noinitExcludes +')').each(function() {
            var triggerButton = $(this);

            // Don't auto-invoke Toolbar's Popupmenus.
            // Toolbar needs to completely control its contents and invoke each one manually.
            if (triggerButton.parents('.toolbar').length > 0) {
              return;
            }

            invokeWithInlineOptions(triggerButton, 'popupmenu');
          });
        }

        //Popovers
        if ($.fn.popover) {
          matchedItems('[data-popover]:not('+ noinitExcludes +')').each(function () {
            var obj = $(this),
              trigger = obj.attr('data-trigger'),
              title = obj.attr('data-title');

            obj.popover({
              content: $('#' + obj.attr('data-popover')),
              trigger: trigger ? trigger : 'click',
              title: title ? title : undefined,
              placement: 'right'
            });
          });
        }

        //Cardstack
        if ($.fn.listview) {
          matchedItems('.listview:not('+ noinitExcludes +')').each(function () {
            var cs = $(this),
              attr = cs.attr('data-dataset'),
              tmpl = cs.attr('data-tmpl'),
              options = $.fn.parseOptions(this) || {};

            options.dataset = options.dataset || attr;
            options.template = options.template || tmpl;

            if (window[options.dataset]) {
              options.dataset = window[options.dataset];
            }
            if (options.template && options.template.length) {
              options.template = $('#' + options.template).html();
            }

            cs.listview(options);
          });
        }

        // Searchfield
        // NOTE:  The Toolbar Control itself understands how to invoke internal searchfields, so they
        // are excluded from this initializer.
        if ($.fn.searchfield) {
          var searchfields = matchedItems('.searchfield:not('+ noinitExcludes +')'),
            toolbarSearchfields = searchfields.filter(function() {
              return $(this).parents('.toolbar').length;
            });
          searchfields = searchfields.not(toolbarSearchfields);

          searchfields.each(function() {
            invokeWithInlineOptions(this, 'searchfield');
          });
        }

        // Accordion
        if ($.fn.accordion) {
          matchedItems('.accordion:not('+ noinitExcludes +')').each(function() {
            var a = $(this);
            if (a.parents('.application-menu').length) {
              return;
            }

            invokeWithInlineOptions(a, 'accordion');
          });
        }

        // Toolbar
        if ($.fn.toolbar) {
          matchedItems('.toolbar:not('+ noinitExcludes +')').each(function() {
            var t = $(this);
            // Don't re-invoke toolbars that are part of the page/section headers.
            // header.js manually invokes these toolbars during its setup process.
            if (t.parents('.header').length || t.parents('.contextual-action-panel').length) {
              return;
            }

            invokeWithInlineOptions(t, 'toolbar');
          });
        }

        matchedItems('[data-translate="text"]').each(function () {
          var obj = $(this);
          obj.text(Locale.translate(obj.text()));
        });

        //Toggle boxes on image list
        matchedItems('.block').on('click', function () {
          $(this).toggleClass('is-selected');
        });

        //Validation
        //Should be one of the last items to invoke
        if ($.fn.validate) {
          matchedItems('[data-validate]').validate();
          matchedItems('[data-validate-on="submit"]').validate();
        }

        if ($.fn.validate) {
          matchedItems('[data-validate]').validate();
          matchedItems('[data-validate-on="submit"]').validate();
        }

        matchedItems('.breadcrumb ol').attr('aria-label', Locale.translate('Breadcrumb'));
      });

      // NOTE: use of .triggerHandler() here causes event listeners for "initialized" to fire, but prevents the
      // "initialized" event from bubbling up the DOM.  It should be possible to initialize just the contents
      // of an element on the page without causing the entire page to re-initialize.
      self.triggerHandler('initialized');


      return returnObj;
    };

    //Just initialize no local provided.
    if (!locale) {
      initAll();
    } else {
      //Set Locale
      Locale.set(locale).done(initAll);
    }

    // Setup a global resize event trigger for controls to listen to
    $(window).on('resize', function() {
      $('body').triggerHandler('resize', [window]);
    });

    return this;
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
