/*!
 Soho 2.0 Controls v4.0.0 
 Date: 18-08-2014 08:11:11 
 Revision: undefined 
 */ 
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

  // Init Stuff on Document Ready
  $(function() {
    //Tabs
    $('.tab-container').tabs();

    //Select / DropDowns
    $('select, .dropdown').dropdown();

    //Modals
    $('#modal-1').modal();

    //Buttons Linked to Message Dialogs
    $('button[data-message]').on('click', function () {
      var opts = $(this).attr('data-message');
      $('body').message(opts);
    });

    //Sliders
    $('.slider').slider();

    //Editors
    $('.editor').editor();

    //Menu Buttons
    $('.btn-menu').popupmenu();

    //Tooltips
    $('[title]').tooltip();
  });

}));
