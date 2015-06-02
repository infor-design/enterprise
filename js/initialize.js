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

        //Tabs
        if ($.fn.tabs) {
          elem.find('.tab-container').tabs();
        }

        //Select / DropDowns
        if ($.fn.dropdown) {
          elem.find('select.dropdown').not('.multiselect').dropdown();
        }

        //Modals
        if ($.fn.modal) {
          elem.find('.modal').modal();
        }

        //Sliders
        if ($.fn.slider) {
          elem.find('input[type="range"], .slider').slider();
        }

        //Editors
        if ($.fn.editor) {
          elem.find('.editor').editor();
        }

        //Menu/Split/Action Buttons
        if ($.fn.popupmenu) {
          elem.find('.btn-menu').popupmenu();
          elem.find('.btn-actions:not([data-init])').popupmenu();

          //Context Menu
          elem.find('[data-popupmenu]').each(function () {
            var obj = $(this);
            obj.popupmenu({menuId: obj.attr('data-popupmenu'), trigger: 'rightClick'});
          });
        }

        //Tooltips
        if ($.fn.tooltip) {
          elem.find('[title]').tooltip();
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

        //Tree
        if ($.fn.tree) {
          elem.find('.tree').tree();
        }

        //Rating
        if ($.fn.rating) {
          elem.find('.rating').rating();
        }

        //Progress
        if ($.fn.progress) {
          elem.find('.progress-bar').progress();
        }

        //Format
        if ($.fn.mask) {
          elem.find('input[data-mask]').mask();
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

        //Auto Complete
        if ($.fn.autocomplete) {
          elem.find('.autocomplete:not([data-init])').autocomplete();
        }

        //Multiselect
        if ($.fn.multiselect) {
          elem.find('select[multiple]:not(.dropdown), .multiselect:not([data-init])').multiselect();
        }

        //Button with Effects
        if ($.fn.button) {
          elem.find('.btn, .btn-secondary, .btn-primary, .btn-destructive, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split').button();
        }

        //Pager
        if ($.fn.pager) {
          elem.find('.pager').pager();
        }

        //Track Dirty
        if ($.fn.trackdirty) {
          elem.find('[data-trackdirty="true"]').trackdirty();
        }

        //Text Area
        if ($.fn.textarea) {
          elem.find('textarea').textarea();
        }

        //Spinbox
        if ($.fn.spinbox) {
          elem.find('.spinbox').spinbox();
        }

        //Color Picker
        if ($.fn.colorpicker) {
          elem.find('.colorpicker').colorpicker();
        }

        //Date Picker
        if ($.fn.datepicker) {
          elem.find('.datepicker').datepicker();
        }

        //Time Picker
        if ($.fn.timepicker) {
          elem.find('.timepicker').timepicker();
        }

        //Busy Indicator
        if ($.fn.busyindicator) {
          elem.find('.busy').busyindicator();
        }

        //Search Field
        if ($.fn.searchfield) {
          elem.find('.searchfield:not([data-init])').searchfield();
        }

        //Toolbar
        if ($.fn.toolbar) {
          elem.find('.toolbar').toolbar();
        }

        if ($.fn.header) {
          elem.find('.header').header();
        }

        if ($.fn.fileupload) {
          elem.find('.fileupload').fileupload();
        }

        if ($.fn.about) {
          elem.find('.about').about();
        }

        if ($.fn.applicationmenu) {
          elem.find('#application-menu').applicationmenu({
            triggers: elem.find('.application-menu-trigger')
          });
        }

        if ($.fn.accordion) {
          elem.find('.accordion').accordion();
        }

        if ($.fn.contextualactionpanel) {
          elem.find('.contextual-action-panel-trigger:not(.no-init)').contextualactionpanel();
        }

        if ($.fn.sidebar) {
          elem.find('.sidebar-nav').sidebar();
        }

        if ($.fn.expandablearea) {
          elem.find('.expandable-area').expandablearea();
        }

        if ($.fn.modalsearch) {
          elem.find('.modal-search').modalsearch();
        }

        if ($.fn.signin) {
          elem.find('.signin').signin();
        }

        if ($.fn.homepage) {
          elem.find('.homepage').homepage();
        }

        if ($.fn.lookup) {
          elem.find('.lookup').lookup();
        }

        elem.find('.modal-search .close').on('click', function () {
          $('.modal-search.modal').removeClass('is-visible');
          $('.overlay.modal-search').remove();
        });

        //Validation
        //Should be one of the last items to invoke
        if ($.fn.validate) {
          elem.find('[data-validate]').validate();
          elem.find('[data-validate-on="submit"]').validate();
        }
      });

      self.trigger('initialized');
      return returnObj;
    });
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
