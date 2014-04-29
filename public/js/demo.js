/**
* Demo JS Code
*/
$(function($) {
  var theme = $('#theme').val();

  //Change Theme when we select in the Drop Down
  $('#theme').on('change', function() {
    theme = $(this).val();
    //swap style sheets..
    $('body').fadeOut(function() {
      $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
      $(this).fadeIn();
    });
  });

  //Set Initial Theme
  if (theme !== 'grey-theme') {
    $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
  }

});
