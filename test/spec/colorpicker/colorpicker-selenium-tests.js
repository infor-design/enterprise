/***************************
 * ColorPicker - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

/*
Test List:
-setValue
-getValue
-invoke
-disable
-enable
-dirty
-error
-required
*/

// Used in the test where we add a new colorpicker to the page.
function addNewMarkup() {
  $('<div class="field"><label for="new-colorpicker">Choose Color</label> <input class="colorpicker" id="new-colorpicker" type="text"></div>').appendTo('body');
  return $('#new-colorpicker').length > 0;
}

describe('Colorpicker [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/colorpicker');
    runner.client
      .execute('window.hnl = {};')
      // Need to run some jQuery code that adds element IDs to some of the spin button controls.
      // This helps us in our "click" and "click and hold" tests.
      .execute('$("#background-color").next().attr("id", "background-color-button");')
      .execute('$("#foreground-color").next().attr("id", "foreground-color-button");')

      // NOTE: Had to set a specific window size to prevent failures
      // in PhantomJS regarding UI element clicks.
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  it('can be edited using keyboard number input', function(done) {
    var input = '#background-color';
    runner.client
      // Check the inital value
      .setValue(input, '', globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('');
      })
      // Key in a number
      .addValue(input, ['f','f','f','f','f','f'], globals.noError)
      // Check the input for the value we just keyed in
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('#ffffff');
      })
      .call(done);
  });

  it('can click the drop down button', function(done) {
    var input = '#background-color',
      down = '#background-color-button';

    runner.client
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('#ffffff');
      })
      // Click the down button
      .click(down, globals.noError)
      .call(done);
  });

  it('can be enabled', function(done) {
    var input = '#foreground-color';

    runner.client
      // Get the value of the disabled input to set a baseline
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('#0896e9');
      })
      .isEnabled(input, function(err, isEnabled) {
        isEnabled.should.equal(false);
      })
      // Execute javascript on the page to enable to disabled spinbox.
      .execute('$("#foreground-color").enable();')
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .isEnabled(input, function(err, isEnabled) {
        isEnabled.should.equal(true);
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    var input = '#foreground-color';

    runner.client
      // Get the value of the disabled input to set a baseline
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('#0896e9');
      })
      .isEnabled(input, function(err, isEnabled) {
        isEnabled.should.equal(true);
      })
      // Execute javascript on the page to enable to disabled spinbox.
      .execute('$("#foreground-color").disable();')
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .isEnabled(input, function(err, isEnabled) {
        isEnabled.should.equal(false);
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      // Run the destroy method on one of the spinboxes
      .execute('$("#foreground-color").data("spinbox").destroy();', globals.noError)
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // Add a new input field and label to the page
      .execute(addNewMarkup, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.value.should.equal(true);
      })
      // Make sure that it was added properly
      .getTagName('#new-colorpicker', function(err, tagName) {
        globals.noError(err);
        should.exist(tagName);
        tagName.should.equal('input');
      })
      // Set a valid number value on the input
      .setValue('#new-colorpicker', '#ffffff', globals.noError)
      // Invoke it as a spinbox
      .execute('$("#new-colorpicker").colorpicker();')
      // Check the value to make sure it was retained
      .getValue('#new-colorpicker', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('#ffffff');
      })
      .call(done);
  });

  it('can get value', function(done) {
    runner.client
      .getValue('#new-colorpicker', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('#ffffff');
      })
      .call(done);
  });

  it('can set value', function(done) {
    runner.client
      .setValue('#new-colorpicker', '#000000', globals.noError)
      .getValue('#new-colorpicker', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('#000000');
      })
      .call(done);
  });

});
