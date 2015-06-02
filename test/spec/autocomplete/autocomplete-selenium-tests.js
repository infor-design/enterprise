/***************************
 * Autocomplete - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

describe('Autocomplete [selenium]', function(){
  this.timeout(99999999);

  var AUTO_DEFAULT = '#auto-default',
    AUTO_TEMPLATE = '#auto-template',
    LIST = '#autocomplete-list';

  before(function(done){
    runner = globals.setup(undefined, '/tests/autocomplete');
    runner.client
      .execute('window.hnl = {};')
      // NOTE: Had to set a specific window size to prevent failures
      // in PhantomJS regarding UI element clicks.
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  it('shows a list of search results when keying a matching value', function(done) {
    runner.client
      // Make sure the default value is empty
      .setValue(AUTO_DEFAULT, '', globals.noError)
      // Key in a value that will return search results
      .addValue(AUTO_DEFAULT, 'a', globals.noError)
      // Pause to allow the menu to populate and display
      .pause(500)
      // Check the page for the existence of the Autocomplete List
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Scan the Autocomplete List for options that match the search query.
      // By default the plugin contains a source with four state names.
      .getText(LIST + ' li:first-child > a', function(err, text) {
        globals.noError(err);
        should.exist(text);
        text.should.equal('Alabama');
      })
      .call(done);
  });

  // NOTE: This test depends on the test above completing successfully
  it.skip('should populate the input field with the correct text when a result is clicked', function(done) {
    runner.client
      // Click the first result
      .click(LIST + ' li:first-child > a', globals.noError)
      // Check the value of the input
      .getValue(AUTO_DEFAULT, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('Alabama');
      })
      .call(done);
  });

  // NOTE: More of an integration test than a unit test (touches the backend)
  // TODO: Use a Mocking framework for this?
  it.skip('can have a template that changes the way results are displayed', function(done) {
    runner.client
      // Key in a value into the templated autocomplete
      .setValue(AUTO_TEMPLATE, '', globals.noError)
      .addValue(AUTO_TEMPLATE, 'New', globals.noError)
      // Pause to allow the menu to populate and display
      .pause(1000)
      // Check the page for the existence of the Autocomplete List
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Check one of the search results for an SVG element that will appear because of the template
      .isExisting(LIST + ' li:first-child svg', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Choose a menu item to close the menu
      .click(LIST + ' li:first-child > a', globals.noError)
      .call(done);
  });

  it.skip('can be destroyed', function(done) {
    runner.client
      // Run the destroy method
      .execute('$("#auto-default").data("autocomplete").destroy();', globals.noError)
      // Key in some text into the field and wait.
      // The popup menu should not exist after the wait period.
      .setValue(AUTO_DEFAULT, '', globals.noError)
      .addValue(AUTO_DEFAULT, 'Hey There', globals.noError)
      .pause(500)
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // Re-invoke the autocomplete plugin on #auto-default
      .execute('$("#auto-default").autocomplete();', globals.noError)
      // Key some text into the field and wait.
      // The popup menu should show up after the wait period.
      .setValue(AUTO_DEFAULT, '', globals.noError)
      .addValue(AUTO_DEFAULT, 'Hey There', globals.noError)
      .pause(1000)
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    runner.client
      // Set a default value on the #auto-default autocomplete field
      .setValue(AUTO_DEFAULT, '', globals.noError)
      // Run the disable() method
      .execute('$("#auto-default").disable();', globals.noError)
      // Attempt to key in a value on the field.
      .addValue(AUTO_DEFAULT, 'Del', globals.noError)
      // Check the value of the field.  It should not have changed.
      .getValue(AUTO_DEFAULT, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('');
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    runner.client
      // Run the enable() method
      .execute('$("#auto-default").enable();', globals.noError)
      .pause(20)
      // Attempt to key in a value
      .setValue(AUTO_DEFAULT, 'Del', globals.noError)
      // Check the value of the field.  It should equal the 'Del' value we entered.
      .getValue(AUTO_DEFAULT, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('Del');
      })
      .call(done);
  });

});
