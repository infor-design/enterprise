/***************************
 * Toats Message - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

/*
Test List:
-buttons
-error vs alert
-centers correctly
*/

describe('Toast [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/toast');
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

  it.skip('can be invoked', function(done) {

  });

});
