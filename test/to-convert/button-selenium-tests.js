/***************************
 * Button - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Button [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/buttons');
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

  it('should have a "button" type attribute', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

  it('should have a specific height defined with CSS', function(done) {
    runner.client
      .getCssProperty('#standard', 'height', function(err, height) {
        globals.noError(err);
        height.value.should.equal('34px');
      })
      .call(done);
  });

  it('should have specific padding defined with CSS', function(done) {
    runner.client
      .getCssProperty('#standard', 'padding-top', function(err, padding) {
        globals.noError(err);
        padding.value.should.equal('0px');
      })
      .getCssProperty('#standard', 'padding-left', function(err, padding) {
        globals.noError(err);
        padding.value.should.equal('30px');
      })
      .call(done);
  });

  it('can have its disabled state programmatically changed', function(done) {
    runner.client
      .getAttribute('#disabled', 'disabled', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      .execute('$("#disabled").prop("disabled", false);')
      .getAttribute('#disabled', 'disabled', function(err, value) {
        globals.noError(err);
        should.not.exist(value);
      })
      .execute('$("#disabled").prop("disabled", true);')
      .getAttribute('#disabled', 'disabled', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      .call(done);
  });

});
