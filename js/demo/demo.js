
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


  });

});
