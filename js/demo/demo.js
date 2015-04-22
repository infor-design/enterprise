/**
* Code used in Samples and Demo Pages
*/

// Public Variable with some sample data
var demoTasks = [];
demoTasks.push({task:'063001', error: true, date: '10/11/2015' ,desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063002', date: '10/11/2015' , desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063003', date: '10/07/2015' , desc: 'Check #112412 parts ordering.'});
demoTasks.push({task:'063004', date: '10/07/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063005', date: '10/11/2015' , desc: 'Call XYZ Inc at 5 PM'});
demoTasks.push({task:'063006', error: true, date: '10/11/2015' , desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063007', date: '07/11/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063008', date: '10/11/2015' , desc: 'Part #5212132 has low inventory level'});
demoTasks.push({task:'063009', date: '10/07/2015' , desc: 'Check #212412 parts ordering.'});
demoTasks.push({task:'063010', date: '10/11/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063011', date: '10/11/2015' , desc: 'Call TMZ Inc at 5 PM'});
demoTasks.push({task:'063012', date: '07/08/2015' , desc: 'Part #6212132 has low inventory level'});

// Execute Page Code for Demo Page
$(function($) {

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
        click: function(e, modal) {
          modal.close();
        }
      }, {
        text: 'Yes',
        click: function(e, modal) {
          modal.close();
        },
        isDefault: true
      }]
    });

  });

  // Modal.html View Specifics
  $('#btn-add-comment').on('click', function() {

    $('body').modal({
      title: 'Add a Comment',
      content: '<small class="alert-text">Escalated (2X)</small><br><h3 style="padding: 0px 15px; margin-top: 8px;">Follow up action with HMM Global </h3><p style="padding: 0px 15px">Contact sales representative with the updated purchase <br> '+
          'order before submission.</p><br><label for="dialog-comment" class="audible">Comment</label><textarea name="dialog-comment" id="dialog-comment"></textarea>',
      buttons: [{
        text: 'Cancel',
        click: function(e, modal) {
          modal.close();
        }
      }, {
        text: 'Submit',
        click: function(e, modal) {
          modal.close();
        },
        isDefault: true
      }]
    });

  });

  // Toast.html View Specifics
  var cnt = 0;
  $('#show-toast-message').on('click', function() {


    cnt ++;
    $('body').toast({title: 'Application Offline' + cnt, message: 'This is a Toast message'});

  });


  // Autocomplete.html View Specifics
  // Setup an alternate source for the templated Autocomplete.
  $('#auto-template').autocomplete({
    source: '/api/states?term='
  }).on('selected', function (e, anchor) {
    console.log('Changed to: ' + $(anchor).parent().attr('data-value'));
  });

  // Searchfield.html View Specifics
  function searchfieldCallback(noResultsContent) {
    $('body').toast({
      title: noResultsContent,
      message: 'Show All Results Callback has been triggered'
    });
  }

  // Toast Message Callback for the Default Searchfield
  $('#searchfield').searchfield({
    allResultsCallback: searchfieldCallback,
    source: '/api/states?term='
  });
  $('#searchfield-default').searchfield({
    allResultsCallback: searchfieldCallback
  });

  // Setup an external source for the templated searchfield
  $('#searchfield-template').searchfield({
    source: '/api/states?term='
  }).on('selected', function (e, anchor) {
    console.log('Changed to: ' + $(anchor).parent().attr('data-value'));
  });

  // Run these on 'body.initialized' event
  $('body').on('initialized', function() {

    //----------------------------------------------------------
    //  Examples: Animated Pseudo-Element Icons
    //----------------------------------------------------------

    $('#icon-plus-minus').click(function() {
      $(this).toggleClass('active');
    });

    //----------------------------------------------------------
    //  Examples: Tabs
    //----------------------------------------------------------

    // Randomize the numbers on the Tabs Counts example
    $('#tabs-counts').find('li > a > .count').each(function() {
      $(this).text((Math.floor(Math.random() * (20 - 0)) + 0) + ' ');
    });

    //----------------------------------------------------------
    //  Examples: Contextual Action Panel
    //----------------------------------------------------------

    // Build the Datagrid that goes into the Settings-based Contextual Action Panel
    var data = [],
      columns = [];

    columns.push({ id: 'date', name: 'Date', field: 'date', width: 125, formatter: Formatters.Date});
    columns.push({ id: 'description', name: 'Description', field: 'description', width: 140, formatter: Formatters.Readonly});
    columns.push({ id: 'paidBy', name: 'Paid By', field: 'PaidBy', formatter: Formatters.Readonly});
    columns.push({ id: 'category', name: 'Category', field: 'category', formatter: Formatters.Readonly});
    columns.push({ id: 'projectWork', name: 'Project Work', field: 'projectWork', formatter: Formatters.Readonly});
    columns.push({ id: 'resource', name: 'Resource', field: 'resource', formatter: Formatters.Readonly});
    columns.push({ id: 'amount', name: 'Amount', field: 'amount', formatter: Formatters.Readonly});

    data.push({ date: new Date(2015, 1, 20), description: 'Pending Benefits', paidBy: 'PR', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Charles Dunn', amount: '$204.00' });
    data.push({ date: new Date(2015, 1, 24), description: 'Pending Wages', paidBy: 'PR', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$146.00' });
    data.push({ date: new Date(2015, 1, 24), description: 'Apple Computer INC', paidBy: 'AP', category: '2919 Supplies', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$1299.00' });
    data.push({ date: new Date(2015, 2, 02), description: 'PO #1292', paidBy: 'AP', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$398.00' });

    $('.contextual-action-panel > .datagrid').datagrid({
      columns: columns,
      dataset: data
    });

    // Build the Settings-based Contextual Action Panel
    $('#js-contextual-panel').contextualactionpanel({
      title: 'Expenses: $50,000.00',
      buttons: [
        {
          text: 'Currency',
          cssClass: 'btn-tertiary',
          click: function() {
            alert('Currency!');
          }
        },
        {
          text: 'Close',
          cssClass: 'btn-icon has-text',
          icon: '#icon-sr-close',
          click: function() {
            $(this).modal('close');
          }
        }
      ]
    });

    //----------------------------------------------------------
    //  Tests: Validation
    //----------------------------------------------------------

    // duplicates the "required" value checker
    function requiredCheck(value) {
      if (typeof value === 'string' && $.trim(value).length === 0) {
        return false;
      }
      return (value ? true : false);
    }

    // This test adds an additional validation rule.
    $.fn.validation.rules['also-required'] = {
      check: requiredCheck,
      message: 'This is a custom validation rule that duplicates the functionality of the "required" rule built into the validator, but has this really long message instead.  This is testing the size of error message tooltips, as well as testing that custom rules work properly.', //TODO - Localize
      async: false
    };

    $.fn.validation.rules['dd-required'] = {
      check: requiredCheck,
      message: 'This dropdown is required.  Please select an option from the Dropdown.',
      async: false
    };

  });

});
