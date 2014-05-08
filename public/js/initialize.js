/*!
 Gramercy Controls v4.0.0 
 Date: 08-05-2014 11:12:52 
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

  // Init Stuff on Document Reader
  $(function() {
    $('.tab-container').tabs();
    $('select').select();
  });

}));
