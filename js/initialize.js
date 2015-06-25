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
    var self = this;

    if (!locale) {
      locale = 'en-US';
    }

    //Class-based detection for IE
    if (navigator.userAgent.match(/Trident/)) {
      $('html').addClass('ie');
    }
    if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
      navigator.userAgent.indexOf('MSIE 8.0') > -1 ||
      document.documentMode === 8) {
      $('html').addClass('ie8');
    }
    if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
      $('html').addClass('ie9');
    }
    if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
      $('html').addClass('ie10');
    } else {
      if (navigator.userAgent.match(/Trident\/7\./)) {
        $('html').addClass('ie11');
      }
    }

    //Set Locale
    Locale.set(locale).done(function () {
      var returnObj;

      //Iterate all objects we are initializing
      returnObj = self.filter(':not(svg):not(use):not(.no-init)').each(function() {
        var elem = $(this);

        function simpleInit(plugin, selector) {
          //Allow only the plugin name to be specified if the default selector is a class with the same name
          //Like $.fn.header applying to elements that match .header
          if (typeof selector === 'undefined') {
            selector = '.' + plugin;
          }

          if ($.fn[plugin]) {
            elem.find(selector).each(function () {
              var thisElem = $(this),
                opts = thisElem.attr('data-options');

              if (opts) {
                var properties = opts.split(', '),
                obj = {};

                properties.forEach(function(property) {
                  var tup = property.split(':');
                  obj[tup[0].replace('{','').replace('}','')] = tup[1].trim().replace('{','').replace('}','');
                });
                thisElem[plugin](obj);
              } else {
                thisElem[plugin](opts);
              }

            });
          }
        }

        if ($.fn.applicationmenu) {
          elem.find('#application-menu').applicationmenu({
            triggers: elem.find('.application-menu-trigger')
          });
        }

        //Array of plugin names and selectors (optional) for no-configuration initializations
        var simplePluginMappings = [
          //Tabs
          ['tabs', '.tab-container'],

          //Select / DropDowns
          ['dropdown', 'select.dropdown:not(.multiselect)'],

          //Modals
          ['modal'],

          //Sliders
          ['slider', 'input[type="range"], .slider'],

          //Editors
          ['editor'],

          //Menu/Split/Action Buttons
          ['popupmenu', '.btn-menu'],
          ['popupmenu', '.btn-actions:not([data-init])'],

          //Tooltips
          ['tooltip', '[title]'],

          //Tree
          ['tree'],

          //Rating
          ['rating'],

          //Progress
          ['progress', '.progress-bar'],

          //Format
          ['mask', 'input[data-mask]'],

          //Auto Complete
          ['autocomplete', '.autocomplete:not([data-init])'],

          //Multiselect
          ['multiselect', 'select[multiple]:not(.dropdown), .multiselect:not([data-init])'],

          //Button with Effects
          ['button', '.btn, .btn-secondary, .btn-primary, .btn-destructive, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split'],

          //Pager
          ['pager'],

          //Track Dirty
          ['trackdirty', '[data-trackdirty="true"]'],

          //Text Area
          ['textarea', 'textarea'],

          //Spinbox
          ['spinbox'],

          //Color Picker
          ['colorpicker'],

          //Date Picker
          ['datepicker'],

          //Time Picker
          ['timepicker'],

          //Busy Indicator
          ['busyindicator','.busy'],

          //Search Field
          ['searchfield', '.searchfield:not([data-init])'],

          //Toolbar
          ['toolbar'],

          ['header'],

          ['fileupload'],

          ['about'],

          ['accordion'],

          ['contextualactionpanel', '.contextual-action-panel-trigger:not(.no-init)'],

          ['sidebar', '.sidebar-nav'],

          ['expandablearea', '.expandable-area'],

          ['modalsearch', '.modal-search'],

          ['signin'],

          ['homepage'],

          ['lookup']
        ];

        //Do initialization for all the simple controls
        for(var i = 0; i < simplePluginMappings.length; i++) {
          simpleInit.apply(null, simplePluginMappings[i]);
        }

        //Context Menu
        if ($.fn.popupmenu) {
          elem.find('[data-popupmenu]').each(function () {
            var obj = $(this);
            obj.popupmenu({menuId: obj.attr('data-popupmenu'), trigger: 'rightClick'});
          });
        }

        //Popovers
        if ($.fn.popover) {
          elem.find('[data-popover]').each(function () {
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
          elem.find('.listview').each(function () {
            var cs = $(this),
              attr = cs.attr('data-dataset');

            if (window[attr]) {
              attr = window[attr];
            }
            $(this).listview({
              template: $('#' + cs.attr('data-tmpl') + '').html(),
              dataset: attr
            });
          });
        }

        elem.find('.modal-search .close').on('click', function () {
          $('.modal-search.modal').removeClass('is-visible');
          $('.modal-search.modal').hide();
          $('.overlay.modal-search').remove();
        });

        //Validation
        //Should be one of the last items to invoke
        if ($.fn.validate) {
          elem.find('[data-validate]').validate();
          elem.find('[data-validate-on="submit"]').validate();
        }

        elem.find('.breadcrumb ol').attr('aria-label', Locale.translate('Breadcrumb'));
      });

      self.trigger('initialized');
      return returnObj;
    });
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
