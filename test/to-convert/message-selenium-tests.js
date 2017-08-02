/***************************
 * Message - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

/*
Test List:
-buttons
-error vs alert
-centers correctly
*/

// Used in the test where we add a new colorpicker to the page.
function addNewMarkup() {
  $('<div class="field"><label for="new-colorpicker">Choose Color</label> <input class="colorpicker" id="new-colorpicker" type="text"></div>').appendTo('body');
  return $('#new-colorpicker').length > 0;
}

describe('Message [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/message');
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

  it.skip('can be invoked', function(done) {

  });

});
