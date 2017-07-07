/***************************
 * Tmpl - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Tmpl [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/tmpl');
    runner.client
      .execute('window.hnl = {};')
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  it.skip('can render from json arrays', function(done) {
    runner.client.call(done);
  });

  it.skip('can render ifs', function(done) {
    runner.client.call(done);
  });

});
