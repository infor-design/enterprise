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

  $.fn.initialize = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'initialize',
        defaults = {
          locale: Locale.currentLocale.name || 'en-US'
        },
        settings;

      if (typeof options === 'string') {
        settings = {};
        settings.locale = options;
      } else {
        settings = $.extend({}, defaults, options);
      }

    /**
     * Page Bootstrapper
     * @constructor
     * @param {Object} element
     */
    function Initialize(element, settings) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Initialize.prototype = {
      init: function() {
        var self = this;

        Locale.set(this.settings.locale).done(function () {
          self.initAll();
        });

        return this;
      },

      initAll : function () {
        var self = this;

        // Iterate all objects we are initializing
        this.element.filter(':not(.no-init)').each(function() {
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
                if (!elem.is('.icon') && elem.parents('.toolbar').length && !elem.parents().hasClass('masthead')) {
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

          // Mobile Zoom Control
          // Needs manual invokation because the rest of initialization is scoped to the
          // calling element, which is the <body> tag.
          if ($.fn.zoom) {
            $('head').zoom();
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
            // Icons
            ['icon'],

            ['splitter'],

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

            //Listbuilder
            ['listbuilder'],

            //Composite Form Wrapper
            ['compositeform', '.composite-form'],

            //Progress
            ['progress', '.progress-bar'],

            //Format
            ['mask', 'input[data-mask]'],

            //Auto Complete
            ['autocomplete', '.autocomplete:not([data-init])'],

            //Multiselect
            ['multiselect', 'select[multiple]:not(.dropdown), .multiselect:not([data-init])'],

            //Button with Effects
            ['button', '.btn, .btn-toggle, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split, .btn-secondary-border'],

            //Hide Focus
            ['hideFocus', 'a.hide-focus, a.tick, a.hyperlink, .checkbox, .radio, .switch'],

            //Circle Pager
            ['circlepager'],

            //Track Dirty
            ['trackdirty', '[data-trackdirty="true"]'],

            //Clear x
            ['clearable', '[data-clearable="true"]'],

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

            ['expandablearea', '.expandable-area'],

            ['signin'],

            ['homepage'],

            ['lookup', '.lookup:not([data-init])'],

            ['wizard'],

            ['popdown', '[data-popdown]']
          ];

          //Do initialization for all the simple controls
          for(var i = 0; i < simplePluginMappings.length; i++) {
            simpleInit.apply(null, simplePluginMappings[i]);
          }

          if ($.fn.popupmenu) {
            // Don't double-invoke menu buttons
            var btnExcludes = ', .btn-actions, .btn-filter, .btn-menu';

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
            matchedItems('.btn-filter, .btn-menu, .btn-actions').filter(':not('+ noinitExcludes +')').each(function() {
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
                title = obj.attr('data-title'),
                placement = obj.attr('data-placement');

              obj.popover({
                content: $('#' + obj.attr('data-popover')),
                trigger: trigger ? trigger : 'click',
                title: title ? title : undefined,
                placement: placement || 'right'
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
            matchedItems('[data-validate-on="submit"]').validate();
          }

          matchedItems('.breadcrumb ol').attr('aria-label', Locale.translate('Breadcrumb'));
        });

        // NOTE: use of .triggerHandler() here causes event listeners for "initialized" to fire, but prevents the
        // "initialized" event from bubbling up the DOM.  It should be possible to initialize just the contents
        // of an element on the page without causing the entire page to re-initialize.
        this.element.triggerHandler('initialized');

        if ($.fn.validate) {
          self.element.validate();
        }

        return this;
      }

    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = new Initialize(this, settings); // jshint ignore:line
    });
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
