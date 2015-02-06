/***************************
 * Charts - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

describe('Charts [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/charts');
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

  it.skip('Can Reload Chart Data', function(done) {

  });

});
