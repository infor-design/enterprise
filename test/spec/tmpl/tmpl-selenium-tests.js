/***************************
 * Button - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Button [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/tmpl');
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

  it('can render arrays', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

  it('can render json', function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

  it('can render if's, function(done) {
    runner.client
      .getAttribute('#standard', 'type', function(err, value) {
        globals.noError(err);
        value.should.equal('button');
      })
      .call(done);
  });

});
