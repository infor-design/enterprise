/**
* Demo JS Code
*/
$(function($) {

  $('#theme').on('change', function() {
    var theme = $(this).val();
    //swap style sheets..
    $('body').fadeOut(function() {
      $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
      $(this).fadeIn();
    });
  });

});
