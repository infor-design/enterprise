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
      locale = 'en';
    }

    //Set Locale
    Locale.set(locale).done(function () {

      //Iterate all objects we are initializing
      return self.each(function() {

        var elem = $(this);
        elem = elem.find(':not(.no-init)');

        //Tabs
        elem.find('.tab-container').tabs();

        //Select / DropDowns
        elem.find('select, .dropdown').not('[multiple]').dropdown();

        //Modals
        elem.find('.modal').modal();

        //Sliders
        elem.find('input[type="range"], .slider').slider();

        //Editors
        elem.find('.editor').editor();

        //Menu/Split Buttons
        elem.find('.btn-menu').popupmenu();

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

        //Format
        elem.find('input[data-mask]').mask();

        //Validation
        elem.find('[data-validate]').validate();
        elem.find('[data-validate-on="submit"]').validate();

        //Cardstack
        elem.find('.cardlist').each(function () {
          var cs = $(this);
          $(this).cardlist({template: $('#' + cs.attr('data-tmpl') + '').html(),
              dataset: window[cs.attr('data-dataset')]});
        });

        //Auto Complete
        elem.find('[data-autocomplete]:not([data-init])').autocomplete();

        //Multiselect
        elem.find('select[multiple]:not([data-init])').multiselect();

        //Button with Effects
        elem.find('.btn, .btn-secondary, .btn-primary, .btn-destructive').button();

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
        elem.find('.busy').busyIndicator();

        //Class-based detection for IE
        if (!!navigator.userAgent.match(/Trident/)) {
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
        }
        if (!!navigator.userAgent.match(/Trident\/7\./)) {
          $('html').addClass('ie11');
        }
      });

    });
  };

}));
