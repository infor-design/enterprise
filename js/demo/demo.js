/**
* Code used in Samples and Demo Pages
*/


// Public Variable with some sample data
var demoTasks = [];
demoTasks.push({task:'063001', error: true, desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063002', desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063003', desc: 'Check #112412 parts ordering.'});
demoTasks.push({task:'063004', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063005', desc: 'Call XYZ Inc at 5 PM'});
demoTasks.push({task:'063006', error: true, desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063007', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063008', desc: 'Part #5212132 has low inventory level'});
demoTasks.push({task:'063009', desc: 'Check #212412 parts ordering.'});
demoTasks.push({task:'063010', desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063011', desc: 'Call TMZ Inc at 5 PM'});
demoTasks.push({task:'063012', desc: 'Part #6212132 has low inventory level'});

// Execute Page Code for Demo Page
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

  // Set Initial Theme
  if (theme !==undefined && theme !== 'grey-theme') {
    $('#stylesheet').attr('href', '/stylesheets/'+ theme +'.css');
  }

  // Message.html View Specifics
  $('#show-application-error').on('click', function() {
      $('body').message({
          title: 'Application Error',
          isError: true,
          message: 'This application has experienced a system error due to the lack of internet access. Please restart the application in order to proceed.',
          buttons: [{
              text: 'Restart Now',
              click: function() {
                  $(this).modal('close');
              },
              isDefault: true
          }]
      });
  });

  $('#show-fileupload-confirmation').on('click', function() {
      $('body').message({
          title: 'File Upload Complete',
          message: 'Your file "<b>photo.png</b>" was sucessfully uploaded to your personal folder and is now public for viewing.',
          buttons: [{
              text: 'Done',
              click: function() {
                  $(this).modal('close');
              },
              isDefault: true
          }]
      });
  });

  $('#show-delete-confirmation').on('click', function() {
      $('body').message({
          title: 'Delete this Application?',
          message: 'You are about to delete this application permanently. Would you like to proceed?',
          buttons: [{
              text: 'No',
              click: function() {
                  $(this).modal('close');
              }
          }, {
              text: 'Yes',
              click: function() {
                  $(this).modal('close');
              },
              isDefault: true
          }]
      });
  });


// Toast.html View Specifics
  $('#show-toast-message').on('click', function() {
      $('body').toast({title: 'Application Offline', message: 'This is a Toast message'});
  });

});
