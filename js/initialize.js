/**
* Page Bootstrapper
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function ($) {

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
        elem.find('.tab-container').tabs();

        //Select / DropDowns
        elem.find('select.dropdown').not('.multiselect').dropdown();

        //Modals
        elem.find('.modal').modal();

        //Sliders
        elem.find('input[type="range"], .slider').slider();

        //Editors
        elem.find('.editor').editor();

        //Menu/Split/Action Buttons
        elem.find('.btn-menu').popupmenu();
        elem.find('.btn-actions:not([data-init])').popupmenu();

        //Context Menu
        elem.find('[data-popupmenu]').each(function () {
          var obj = $(this);
          obj.popupmenu({menuId: obj.attr('data-popupmenu'), trigger: 'rightClick'});
        });

        //Tooltips
        elem.find('[title]').tooltip();

        //Popovers
        elem.find('[data-popover]').each(function () {
          var obj = $(this),
            trigger = obj.attr('data-trigger'),
            title = obj.attr('data-title');

          obj.popover({content: $('#'+ obj.attr('data-popover')),
              trigger: trigger ? trigger : 'click',
              title: title ? title : 'Title Missing',
              placement: 'right'
          });
        });

        //Tree
        elem.find('.tree').tree();

        //Rating
        elem.find('.rating').rating();

        //Progress
        elem.find('.progress-bar').progress();

        //Format
        elem.find('input[data-mask]').mask();

        //Validation
        elem.find('[data-validate]').validate();
        elem.find('[data-validate-on="submit"]').validate();

        //Cardstack
        elem.find('.listview').each(function () {
          var cs = $(this),
            attr = cs.attr('data-dataset');

          if (window[attr]) {
            attr = window[attr];
          }
          $(this).listview({template: $('#' + cs.attr('data-tmpl') + '').html(),
              dataset: attr});
        });

        //Auto Complete
        elem.find('.autocomplete:not([data-init])').autocomplete();

        //Multiselect
        elem.find('select[multiple]:not(.dropdown), .multiselect:not([data-init])').multiselect();

        //Button with Effects
        elem.find('.btn, .btn-secondary, .btn-primary, .btn-destructive, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split').button();

        //Pager
        elem.find('.pager').pager();

        //Track Dirty
        elem.find('[data-trackdirty="true"]').trackdirty();

        //Text Area
        elem.find('textarea').textarea();

        //Spinbox
        elem.find('.spinbox').spinbox();

        //Color Picker
        elem.find('.colorpicker').colorpicker();

        //Date Picker
        elem.find('.datepicker').datepicker();

        //Time Picker
        elem.find('.timepicker').timepicker();

        //Busy Indicator
        elem.find('.busy').busyindicator();

        //Search Field
        elem.find('.searchfield:not([data-init])').searchfield();

        //Toolbar
        elem.find('.toolbar').toolbar();

        elem.find('.header').header();

        elem.find('.fileupload').fileupload();

        elem.find('.about').about();

        elem.find('.application-nav-trigger').appNav();

        elem.find('.accordion').accordion();

        elem.find('.contextual-action-panel-trigger:not(.no-init)').contextualactionpanel();

        elem.find('.sidebar-nav').sidebar();

        // TODO: Decide whether or not we are removing this completely
        //$('body').flyingfocus();
      });

      self.trigger('initialized');
      return returnObj;
    });
  };

}));
