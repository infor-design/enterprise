/***************************
 * Toats Message - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

/*
Test List:
-buttons
-error vs alert
-centers correctly
*/

describe('Toast [selenium]', function(){
  this.timeout(10000);

  before(function(done){
    runner = globals.setup(undefined, '/tests/toast');
    runner.client
      .execute('window.hnl = {};')
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  //Click each button and test the position
  it('can be invoked in 4 directions', function(done) {
    runner.client
      .click('#show-toast-top-left', globals.noError)
      // Check the position of the toast message
      .getCssProperty('#toast-container', 'left', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .getCssProperty('#toast-container', 'top', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .click('#show-toast-top-right', globals.noError)
      // Check the position of the toast message
      .getCssProperty('#toast-container', 'right', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .getCssProperty('#toast-container', 'top', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .click('#show-toast-bottom-left', globals.noError)
      // Check the position of the toast message
      .getCssProperty('#toast-container', 'left', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .getCssProperty('#toast-container', 'bottom', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .click('#show-toast-bottom-right', globals.noError)
      // Check the position of the toast message
      .getCssProperty('#toast-container', 'right', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .getCssProperty('#toast-container', 'bottom', function(err, display) {
        globals.noError(err);
        display.value.should.equal('10px');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      .getTagName('#toast-container', function(err, tagName) {
        tagName.should.equal('div');
      })
      .execute('$("body").data("toast").destroy();')
      .getTagName('#toast-container', function(err, tagName) {
        should.not.exist(tagName);
      })
      .call(done);
  });

});
