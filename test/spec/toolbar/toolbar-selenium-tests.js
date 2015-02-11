/***************************
 * Button - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Toolbar [selenium]', function(){
  this.timeout(99999999);

  before(function(done) {
    runner = globals.setup(undefined, '/tests/toolbar');
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

  it.skip('tab should navigate to next page item', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

  it.skip('arrow should navigate to next toolbar button', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

  it.skip('should have aria roles', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });


});
