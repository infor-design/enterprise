/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

//http://www.webdriver.io/guide/usage/selectors.html
//
var runner;

describe('Multiselect [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/multiselect');
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

  // smoke test, to figure out if we're even on the right page
  it('should be in the right page', function(done) {
    runner.client
      .getTitle(function(err, title) {
        globals.noError(err);
        title.should.equal('SoHo Controls XI - Tests');
      })
      .call(done);

  });

  //see if the plugin can be initialized
  it('be able to init without errors', function(done) {
    runner.client
      .execute('$("select[multiple]").multiselect();')
      //.saveScreenshot('test.png') //needs brew install graphicsmagick
      .call(done);
  });

});
