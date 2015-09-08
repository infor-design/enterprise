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

    if (!locale) {
      locale = 'en-US';
    }

    if (navigator.userAgent.indexOf('Safari')  !== -1 &&
        navigator.userAgent.indexOf('Chrome')  === -1 &&
        navigator.userAgent.indexOf('Android') === -1) {
      html.addClass('is-safari');
    }

    //Class-based detection for IE
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
              if (($(this).is('.no-init') || $(this).attr('data-init')) && selector !=='[data-trackdirty="true"]') {
                return;
              }

              var options = $.fn.parseOptions(this);
              $(this)[plugin](options);
            });
          }

          // Radio switch
          $('.radiosection input:radio.handle').change(function() {
            if (this.checked) {
              var option = $(this).closest('.option'),
              siblings = option.siblings(),
              fields = 'button, select, input[type="text"]';

              $(fields, option).removeAttr('disabled');
              $(fields, siblings).attr('disabled','disabled');
            }
          });
        }

        if ($.fn.applicationmenu) {
          elem.find('#application-menu').applicationmenu({
            triggers: elem.find('.application-menu-trigger')
          });
        }

        //Array of plugin names and selectors (optional) for no-configuration initializations
        var simplePluginMappings = [
          //Tabs
          ['tabs', '.tab-container:not(.vertical)'],

          //Vertical Tabs
          ['verticaltabs', '.tab-container.vertical'],

          //Select / DropDowns
          ['dropdown', 'select.dropdown:not(.multiselect)'],

          //Modals
          ['modal'],

          //Sliders
          ['slider', 'input[type="range"], .slider'],

          //Editors
          ['editor'],

          //Menu/Split/Action Buttons
          ['popupmenu', '.btn-filtering'],
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
          ['pager', '.paginated'],

          //Track Dirty
          ['trackdirty', '[data-trackdirty="true"]'],

          //Text Area
          ['textarea', 'textarea'],

          //Spinbox
          ['spinbox'],

          //sort drag and drop
          ['sort'],

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

          ['lookup', '.lookup:not([data-init])'],

          ['wizard'],

          ['popdown', '[data-popdown]']
        ];

        //Do initialization for all the simple controls
        for(var i = 0; i < simplePluginMappings.length; i++) {
          simpleInit.apply(null, simplePluginMappings[i]);
        }

        //Context Menu
        if ($.fn.popupmenu) {
          elem.find('[data-popupmenu]:not(.no-init):not([data-init])').each(function () {
            var obj = $(this);
            obj.popupmenu({menuId: obj.attr('data-popupmenu'), trigger: 'rightClick'});
          });
        }

        //Popovers
        if ($.fn.popover) {
          elem.find('[data-popover]:not(.no-init):not([data-init])').each(function () {
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
          elem.find('.listview:not(.no-init):not([data-init])').each(function () {
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

        elem.find('.modal-search .close').on('click', function () {
          $('.modal-search.modal').removeClass('is-visible');
          $('.modal-search.modal').hide();
          $('.overlay.modal-search').remove();
        });


        elem.find('[data-translate="text"]').each(function () {
          var obj = $(this);
          obj.text(Locale.translate(obj.text()));
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

      //Placeholder attribute in browsers that do not handle it
      $.fn.placeholderPolyfill();

      return returnObj;
    });

    return this;
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
