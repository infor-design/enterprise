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

  $.fn.initialize = function() {

    return this.each(function() {
      var elem = $(this);
      elem = elem.find(':not(.no-init)');

      //Tabs
      elem.find('.tab-container').tabs();

      //Select / DropDowns
      elem.find('select, .dropdown').not('[multiple]').dropdown();

      //Modals
      elem.find('.modal').modal();

      //Buttons Linked to Message Dialogs
      elem.find('button[data-message]').on('click', function () {
        var opts = $(this).attr('data-message');
        $('body').message(opts);
      });

      //Sliders
      elem.find('.slider').slider();

      //Editors
      elem.find('.editor').editor();

      //Menu Buttons
      elem.find('.menubutton, .splitbutton-menu').popupmenu();

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
      elem.find('.cardstack').each(function () {
        var cs = $(this);
        $(this).cardstack({template: $('#' + cs.attr('data-tmpl') + '').html(),
            dataset: window[cs.attr('data-dataset')]});
      });

      //Auto Complete
      elem.find('[data-autocomplete]').autocomplete();

      //Multiselect
      elem.find('select[multiple]:not([data-init])').multiselect();

      //Button with Effects
      elem.find('.button, .button-secondary, .button-primary, .button-destructive, .button-menu').button();

      //Pager
      var pager = elem.find('.pager').pager();
      pager.on('paging', function (e, args) {
        console.log('Paging: '+ args.currentPage);
      });

      //Track Dirty
      elem.find('[data-trackdirty="true"]').trackdirty();

      //Text Area
      elem.find('textarea').textarea();

      //Spinbox
      elem.find('.spinbox').spinbox();

      //Class-based detection for IE
      if (!!navigator.userAgent.match(/Trident/)) {
        $('html').addClass('ie');
      }
      if (navigator.appVersion.indexOf('MSIE 8.0') > -1) {
        $('html').addClass('ie8');
      }
      if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
        $('html').addClass('ie8');
      }
      if (document.documentMode === 8) {
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
  };

  // Init Stuff on Document Ready
  $(function() {
    $('body').initialize();
  });

}));
