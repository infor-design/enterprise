/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;
  //jQuery = require('../../../public/js/jquery-1.1.1.min.js'),
  //globalize = require('../../../js/globalize');

describe('Globalize [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/globalize');
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

  it('added lang to page', function(done) {
    runner.client
      .getAttribute('html', 'lang', function(err, attr) {
        attr.should.equal('en');
      }).call(done);
  });

  it('be able to get locale', function(done) {
    var test = function () {
      return Globalize.locale();
    };

    runner.client
       .execute(test, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('en');
      })
      .call(done);
  });

  it('get locale', function(done) {
    var test = function () {
      console.log('test');
      return Globalize.locale('de');
    };

    runner.client
       .execute(test, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('de');
      })
      .call(done);
  });

});
