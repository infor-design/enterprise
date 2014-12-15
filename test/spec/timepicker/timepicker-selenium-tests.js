/***************************
 * Time Picker - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Time Picker [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/timepicker');
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

  it.skip('should have a test', function(done) {
    runner.client
      .call(done);
  });

});
