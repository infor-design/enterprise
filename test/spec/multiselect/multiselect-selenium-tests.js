/***************************
 * MutliSelect - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Multiselect [selenium]', function(){
  this.timeout(99999999);

  // NOTE:
  // The controls on the MultiSelect test page are configured to use results from an AJAX call as the source
  // of each dropdown list.  If all tests begin to fail or strange results happen, make sure the
  // test suite is correctly setting up and using the API first.  Make sure any calls to the API
  // use RELATIVE paths, not absolute paths, since the test suite may be configured to use different
  // ports.

  var STATES = '#states-multi',
    STATES_TEXTBOX = '#states-multi-textbox',
    FRUITS_TEXTBOX = '#fruits-multi-textbox',
    DDLIST = '#dropdown-list';

  // Adds IDs to the 'textbox' DIV generated for each Mutliselect Control for easier targeting
  function addIds() {
    $('#states-multi-shdo').prev().attr('id', 'states-multi-textbox');
    $('#towns-multi-optgroup-shdo').prev().attr('id', 'towns-multi-optgroup-textbox');
    $('#fruits-multi-shdo').prev().attr('id', 'fruits-multi-textbox');
  }

  function getJQueryVal(selector) {
    return $(selector).val();
  }

  before(function(done){
    runner = globals.setup(undefined, '/tests/multiselect');
    runner.client
      .execute('window.hnl = {};')
      .execute(addIds, globals.noError)
      // NOTE: Had to set a specific window size to prevent failures
      // in PhantomJS regarding UI element clicks.
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  it.skip('activates/deactivates a dropdown list by clicking', function(done) {
    runner.client
      // Sanity check to make sure the Dropdown List isn't already there
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      // Click the textbox
      .click(STATES_TEXTBOX, globals.noError)
      // Check to see if the dropdown list is visible
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Close the list by clicking somewhere else
      .click('body', globals.noError)
      // Check again.  The list markup should be gone again.
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it.skip('activates a dropdown list when using the Up/Down Arrow keys', function(done) {
    runner.client
      // Focus the Multi-Select and press the down arrow
      .addValue(STATES_TEXTBOX, ['Down Arrow'], globals.noError)
      // Check to see if the Multi-Select markup exists
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Press the escape key to leave the menu
      .keys(['Escape'], globals.noError)
      // Check again for the Multi-Select markup.  It shouldn't exist
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      // Focus the Multi-Select and press the up arrow
      .addValue(STATES_TEXTBOX, ['Up Arrow'], globals.noError)
      // Check again to see if the Multi-Select markup exists.  It should be open
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Press the escape key to leave the menu
      .keys(['Escape'], globals.noError)
      // Check again for the Multi-Select markup.  It should once again not exist
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  // Skipping this test for now because for some reason, the keystrokes aren't working for selecting elements.
  // May have something to do with the currently active element.  However, tried individually selecting list items and
  // got the same result.
  it.skip('will not allow more than the "data-maxselected" attribute\'s specified number of selected options in the list', function(done) {
    runner.client
      // The States Multiselect's "data-maxselected" attribute is 10.
      // Open the States Multiselect
      .click(STATES_TEXTBOX, globals.noError)
      // Use the Keyboard to try to select the first 12 options in the list.
      .addValue(DDLIST, [
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow',
        'Space', 'Down arrow'
      ], globals.noError)
      // Close the list by clicking somewhere else
      .click('body', globals.noError)
      // Check the Value of the States Mutliselect's original Select Box.  It should only have the first 10 options
      // in the list selected (The last one should be District of Columbia)
      .execute(getJQueryVal, STATES, function(err, result) {
        globals.noError(err);
        should.exist(result);
        console.dir(result);
      })
      .call(done);
  });

  it.skip('can be destroyed', function(done) {
    runner.client
      // Run the destroy() method
      .execute('$("#states-multi").data("multiselect").destroy();')
      // Check for the existence of the textbox markup.  It shouldn't exist
      .isExisting(STATES_TEXTBOX, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it.skip('can be invoked', function(done) {
    runner.client
      // Attempt to reinvoke the multi-select
      .execute('$("#states-multi").multiselect();')
      // Re-add the ID for our testing purposes
      .execute('$("#states-multi-shdo").prev().attr("id", "states-multi-textbox")')
      // Check for the existence of the textbox markup.  It should now be there.
      .isExisting(STATES_TEXTBOX, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Try clicking the textbox markup to see if the events rebound.  The menu should open.
      .click(STATES_TEXTBOX, globals.noError)
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Click somewhere else to close the list and reset
      .click('body', globals.noError)
      .call(done);
  });

  it.skip('can be enabled', function(done) {
    runner.client
      // Try clicking the disabled field.  The Dropdown menu should not open.
      .click(FRUITS_TEXTBOX, globals.noError)
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      // Run the enable() method
      .execute('$("#fruits-multi").enable();')
      // Try clicking again.  The dropdown menu should now show.
      .click(FRUITS_TEXTBOX, globals.noError)
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Click somewhere else to close the list and reset
      .click('body', globals.noError)
      .call(done);
  });

  it.skip('can be disabled', function(done) {
    runner.client
      // Try clicking the disabled field.  The Dropdown menu should open.
      .click(FRUITS_TEXTBOX, globals.noError)
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Click somewhere else to close the list and reset
      .click('body', globals.noError)
      // run the disable() method
      .execute('$("#fruits-multi").disable();')
      // Try clicking again.  The dropdown menu shouldn't display.
      .click(FRUITS_TEXTBOX, globals.noError)
      .isExisting(DDLIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

});
