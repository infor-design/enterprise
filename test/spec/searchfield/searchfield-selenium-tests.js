/***************************
 * Searchfield - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

describe('Searchfield [selenium]', function(){
  this.timeout(99999999);

  var SEARCH_DEFAULT = '#searchfield-default',
    LIST = '#autocomplete-list',
    TOAST_CONTAINER = '#toast-container';

  before(function(done){
    runner = globals.setup(undefined, '/tests/searchfield');
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

  it('has an SVG icon', function(done) {
    runner.client
      .isExisting(SEARCH_DEFAULT + ' + svg', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('shows an option to display more results if it successfully finds matches', function(done) {
    runner.client
      // Make sure the default value is empty
      .setValue(SEARCH_DEFAULT, '', globals.noError)
      // Key in a value that will return search results
      .addValue(SEARCH_DEFAULT, 'a', globals.noError)
      // Pause to allow the menu to populate and display
      .pause(1000)
      // Check the page for the existence of the Autocomplete List
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Check the last item in the list to make sure it's the 'all results' option.
      .getText(LIST + ' li:last-child > a', function(err, text) {
        globals.noError(err);
        should.exist(text);
        text.should.equal('All Results For a');
      })
      .call(done);
  });

  // NOTE: This test expects that the previous test completed successfully
  it('can trigger a callback method if the "more results" option is activated', function(done) {
    runner.client
      // Click the 'More Results' link
      .click(LIST + ' li:last-child > a', globals.noError)
      .pause(1000)
      // There should be a toast message visible on the top right of the page.  Check for its existence
      .isExisting(TOAST_CONTAINER, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('shows a "no results" option in the list if no matches are found', function(done) {
    runner.client
      // Make sure the default value is empty
      .setValue(SEARCH_DEFAULT, '', globals.noError)
      // Key in a value that will return search results
      .addValue(SEARCH_DEFAULT, 'xyz12345', globals.noError)
      // Pause to allow the menu to populate and display
      .pause(1000)
      // Check the page for the existence of the Autocomplete List
      .isExisting(LIST, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Check the last item in the list to make sure it's the 'no results' option.
      .getText(LIST + ' li:last-child > a', function(err, text) {
        globals.noError(err);
        should.exist(text);
        text.should.equal('No Results');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      // Run the destroy method
      .execute('$("#searchfield-default").data("searchfield").destroy();', globals.noError)
      // Check for the existence of the SVG.  It should no longer be there
      .isExisting(SEARCH_DEFAULT + ' + svg', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // Re-invoke the autocomplete plugin on #auto-default
      .execute('$("#searchfield-default").searchfield();', globals.noError)
      // Check for the existence of the SVG.  It should be there
      .isExisting(SEARCH_DEFAULT + ' + svg', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    runner.client
      // Set a default value on the #auto-default autocomplete field
      .setValue(SEARCH_DEFAULT, '', globals.noError)
      // Run the disable() method
      .execute('$("#searchfield-default").disable();', globals.noError)
      .pause(20)
      // Attempt to key in a value on the field.
      .setValue(SEARCH_DEFAULT, 'Del', globals.noError)
      // Check the value of the field.  It should not have changed.
      .getValue(SEARCH_DEFAULT, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('');
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    runner.client
      // Run the enable() method
      .execute('$("#searchfield-default").enable();', globals.noError)
      // Attempt to key in a value
      .addValue(SEARCH_DEFAULT, 'Del', globals.noError)
      // Check the value of the field.  It should equal the 'Del' value we entered.
      .getValue(SEARCH_DEFAULT, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('Del');
      })
      .call(done);
  });

});
