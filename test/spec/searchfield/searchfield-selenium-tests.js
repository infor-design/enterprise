/***************************
 * Searchfield - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

describe('Searchfield [selenium]', function(){
  this.timeout(99999999);

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

  it.skip('has an SVG icon', function(done) {
    runner.client
      .call(done);
  });

  it.skip('shows an option to display more results if it successfully finds matches', function(done) {
    runner.client
      .call(done);
  });

  it.skip('can trigger a callback method if the "more results" option is activated', function(done) {
    runner.client
      .call(done);
  });

  it.skip('shows a "no results" option in the list if no matches are found', function(done) {
    runner.client
      .call(done);
  });

});
