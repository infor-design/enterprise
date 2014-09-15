/**
* Demo JS Code
*/
$(function($) {
  var theme = $('#theme').val();

  //Change Theme when we select in the Drop Down
  $('#theme').on('change', function() {
    theme = $(this).val();
    //swap style sheets..
    $('body').fadeOut('fast', function() {
      $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
      $(this).fadeIn('fast');
    });
  });

  //Set Initial Theme
  if (theme !==undefined && theme !== 'grey-theme') {
    $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
  }

});

//Public Variable with some sample data
var demoTasks = [];
demoTasks.push({task:'063001', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063002', desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063003', desc: 'Check #112412 parts ordering.'});
demoTasks.push({task:'063004', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063005', desc: 'Call XYZ Inc at 5 PM'});
demoTasks.push({task:'063006', desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063007', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063008', desc: 'Part #5212132 has low inventory level'});
demoTasks.push({task:'063009', desc: 'Check #212412 parts ordering.'});
demoTasks.push({task:'063010', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063011', desc: 'Call TMZ Inc at 5 PM'});
demoTasks.push({task:'063012', desc: 'Part #6212132 has low inventory level'});

