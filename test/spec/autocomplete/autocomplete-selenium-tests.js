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
  it('should populate the input field with the correct text when a result is clicked', function(done) {
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
  it('can have a template that changes the way results are displayed', function(done) {
    runner.client
      // Key in a value into the templated autocomplete
      .setValue(AUTO_TEMPLATE, '', globals.noError)
      .addValue(AUTO_TEMPLATE, 'New', globals.noError)
      // Pause to allow the menu to populate and display
      .pause(500)
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
      .call(done);
  });

  // TODO: Tests for Enabled/Disabled/Destroy/Invoke

});
