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

  it('can render from json arrays', function(done) {
    runner.client
      .getCssProperty('#063001', 'height', function(err, height) {
        globals.noError(err);
        height.value.should.equal('77px');
      })
      .call(done);
  });

  it('can render ifs', function(done) {
    runner.client
      .getCssProperty('#063001', 'border-left-color', function(err, color) {
        globals.noError(err);
        color.value.should.equal('rgba(213,0,14,1)');
      })
      .call(done);
  });

});
