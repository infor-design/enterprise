/*!
 Gramercy Controls v4.0.0 
 Date: 02-07-2014 33:02:01 
 Revision: undefined 
 */ 
 /**
* Page Bootstrapper
* @name Bootstrapper - Initializes Elements in the page with Inline Options or Defaults
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
    $('.modal').modal();

    //Buttons Linked to Message Dialogs
    $('button[data-message]').on('click', function () {
      var opts = $(this).attr('data-message');
      $('body').message(opts);
    });

    //Sliders
    $('.slider').slider();

    //Editors
    $('.editor').editor();
        $('#title').focus(function () {
      $('.editor').editor();
    });
  });

}));
