// Code used in Samples and Demo Pages

// Public Variable with some sample data

var demoBuilderItems = [];
demoBuilderItems.push({ id: 1, orderId: '4231212-3', items: 0, companyName: 'John Smith Construction', total: '$0.00' });
demoBuilderItems.push({ id: 2, orderId: '1092212-3', items: 4, companyName: 'Top Grade Construction', total: '$10,000.00' });
demoBuilderItems.push({ id: 3, orderId: '6721212-3', items: 0, companyName: 'Riverhead Building Supply', total: '$0.00' });
demoBuilderItems.push({ id: 4, orderId: '6731212-3', items: 37, companyName: 'United Starwars Construction', total: '$22,509.99' });
demoBuilderItems.push({ id: 5, orderId: '5343890-3', items: 8, companyName: 'United Construction', total: '$1,550.00' });
demoBuilderItems.push({ id: 6, orderId: '4989943-3', items: 156, companyName: 'Top Grade-A Construction', total: '$800.00' });
demoBuilderItems.push({ id: 7, orderId: '8972384-3', items: 10, companyName: 'Top Grade Construction', total: '$1,300.00' });
demoBuilderItems.push({ id: 8, orderId: '2903866-3', items: 96, companyName: 'Top Grade-A Construction', total: '$1,900.00' });
demoBuilderItems = demoBuilderItems.concat(demoBuilderItems); // Duplicate it

var demoSwaplist = [];
demoSwaplist.push({id: 1, value: 'opt-1', text: 'Option A'});
demoSwaplist.push({id: 2, value: 'opt-2', text: 'Option B'});
demoSwaplist.push({id: 3, value: 'opt-3', text: 'Option C'});
demoSwaplist.push({id: 4, value: 'opt-4', text: 'Option D'});
demoSwaplist.push({id: 5, value: 'opt-5', text: 'Option E', disabled: true});
demoSwaplist.push({id: 6, value: 'opt-6', text: 'Option F'});
demoSwaplist.push({id: 7, value: 'opt-7', text: 'Option G'/*, selected: true*/});
demoSwaplist.push({id: 8, value: 'opt-8', text: 'Option H'});
demoSwaplist.push({id: 9, value: 'opt-9', text: 'Option I'});

// Execute Page Code for Demo Page
$(function($) {

  // Modal.html View Specifics
  $('#btn-add-comment').on('click', function() {

    $('body').modal({
      title: 'Add a Comment',
      content: '<small class="alert-text">Escalated (2X)</small><br><h3 style="padding: 0px 15px; margin-top: 8px;">Follow up action with HMM Global </h3><p style="padding: 0px 15px">Contact sales representative with the updated purchase <br> '+
          'order before submission.</p><br><label for="dialog-comment" class="audible">Comment</label><textarea name="dialog-comment" style="width: 100%" id="dialog-comment"></textarea>',
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
    $('body').toast({title: 'Sample Message ' + cnt, message: 'This is a Toast message'});
  });

  // Autocomplete.html View Specifics
  // Setup an alternate source for the templated Autocomplete.
  $('#auto-template').autocomplete({
    source: function (req, resp) {
      var data = [];
      data.push({ label: 'John Smith', email: 'John.Smith@example.com', value: '0' });
      data.push({ label: 'Alex Mills', email: 'Alex.Mills@example.com', value: '1' });
      data.push({ label: 'Steve Mills', email: 'Steve.Mills@example.com', value: '2' });
      data.push({ label: 'Quincy Adams', email: 'Quincy.Adams@example.com', value: '3' });
      data.push({ label: 'Paul Thompson', email: 'Paul.Thompson@example.com', value: '4' });
      resp(req, data);
    }
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

    $('#icon-app-header').click(function() {
      var mode = $(this).data('mode');
      if (!mode || mode === undefined) {
        mode = 0;
      }
      mode++;

      switch(mode) {
        case 1:
          $(this).removeClass('close').addClass('go-back');
          break;
        case 2:
          $(this).removeClass('go-back').addClass('close');
          break;
        case 3:
          $(this).removeClass('close').removeClass('go-back');
          mode = 0;
          break;
      }

      $(this).data('mode', mode);
    });

    $('#icon-app-drawer').click(function() {
      $(this).toggleClass('active');
    });

    // in the Masthead
    $('#application-switcher').click(function() {
      $(this).children('.app-drawer').toggleClass('active');
    });

    //----------------------------------------------------------
    //  Examples: Accordion
    //----------------------------------------------------------

    // Find any accordion control that has a "data-demo-set-links" attribute set to true.
    // If found, change any non-empty and non-hashed (static) links to a relative link that reroutes to the current page.
    // Use this as a convenient alternative to having to change 1000 links every time a demo page gets moved.
    // Example: change "/path/to" to "/controls/accordion", if the URL is "http://localhost:4000/controls/accordion".
    $('.accordion').filter('[data-demo-set-links]').each(function() {
      var relativePath = window.location.pathname,
        links = $(this).find('a').filter(function() {
        var href = $(this).attr('href');
        return href !== '' && href !== '#';
      });

      links.attr('href', relativePath);
    });

    //----------------------------------------------------------
    //  Examples: Tabs
    //----------------------------------------------------------

    // Randomize the numbers on the Tabs Counts example
    $('#tabs-counts').find('li > a > .count').each(function() {
      $(this).text((Math.floor(Math.random() * (20 - 0)) + 0) + ' ');
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
      check: function() {
        return false;
      },
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
