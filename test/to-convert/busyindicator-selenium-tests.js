/***************************
 * Busy Indicator - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

// Detect whether or not the busy indicator exists.
function busyIndicatorExists() {
  return $('body').find('.busy-indicator').length > 0;
}

describe('Busy Indicator [selenium]', function(){
  this.timeout(99999999);

  var STANDALONE_BUSY_TRIGGER = '#busy-start-trigger';

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/busyindicator');
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

  it.skip('can be activated after it\'s been invoked', function(done) {
    runner.client
      .click(STANDALONE_BUSY_TRIGGER, globals.noError())
      .pause(30)
      .execute(busyIndicatorExists, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal(true);
      })
      .call(done);
  });

  // TODO: Add More Tests

});
