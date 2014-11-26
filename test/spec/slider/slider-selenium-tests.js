/***************************
 * Slider - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Slider [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/slider');
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

  it('can be edited using arrow keys', function(done) {
    var input = '#regular';
    runner.client
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('0');
      })
      // Increment the value four times (use both right/up keys to make sure they are both working)
      .addValue(input, [
        'Up arrow',
        'Right arrow',
        'Up arrow',
        'Right arrow'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.not.equal('0');
      })
      // Decrement the value three times (use both down/left keys to make sure they're both working)
      .addValue(input, [
        'Left arrow',
        'Down arrow',
        'Left arrow',
        'Down arrow'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('0');
      })
      .call(done);
  });

  it('can be edited by clicking ticks on the range bar', function(done) {
    var input = '#simple-step',
      lowTick = '#simple-step-tick-1',
      highTick = '#simple-step-tick-4';

    runner.client
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('0');
      })
      // Click the down button twice
      .click(lowTick, globals.noError)
      // Check the value of the spinbox. It should have been decremented twice.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('1');
      })
      // Click the up button twice
      .click(highTick, globals.noError)
      // Check the value of the spinbox. It should have been incremented twice.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('4');
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    var disabled = '#disabled',
      lowTick = '#disabled-tick-1',
      highTick = '#disabled-tick-4';

    runner.client
      // Get the value of the disabled input to set a baseline
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('40');
      })
      // Attempt to click the spinbox controls.
      .click(up, globals.noError)
      // Check the value of the disabled input.  It should not have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      // Execute javascript on the page to enable to disabled spinbox.
      .execute('$("#disabled-spinbox").data("spinbox").enable();')
      // Attempt to click the spinbox controls.
      .click(up, globals.noError)
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1');
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    var disabled = '#disabled-spinbox',
      down = '#disabled-spinbox-down';

    runner.client
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1');
      })
      // Attempt to click the spinbox controls.
      .click(down, globals.noError)
      // Check the value of the disabled input.  It should not have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      // Execute javascript on the page to enable to disabled spinbox.
      .execute('$("#disabled-spinbox").data("spinbox").disable();')
      // Attempt to click the spinbox controls.
      .click(down, globals.noError)
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it('should respect the "min" attribute when arrow keys are used to lower its value', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Set the initial value to just above the "min" (which is -50)
      .setValue(input, '-49', globals.noError)
      // Use the keyboard to attempt to lower the number
      .addValue(input, [
        'Down arrow',
        'Down arrow',
        'Down arrow'
      ], globals.noError)
      // Check the input's value.  It should not have gone below -50.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('-50');
      })
      .call(done);
  });

  it('should respect the "min" attribute when numbers are typed to fill the input\'s value', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Set the initial value to nothing
      .setValue(input, '', globals.noError)
      // Use the keyboard to enter a number way lower than the minimum
      .addValue(input, ['-','9','9','9'], globals.noError)
      // Check the input's value.  It should have been adjusted to -50.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('-50');
      })
      .call(done);
  });

  it('should respect the "max" attribute when arrow keys are used to raise its value', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Set the initial value to just below the "max" (which is 50)
      .setValue(input, '49', globals.noError)
      // Use the keyboard to attempt to raise the number
      .addValue(input, [
        'Up arrow',
        'Up arrow',
        'Up arrow'
      ], globals.noError)
      // Check the input's value.  It should not have gone above 50.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      .call(done);
  });

  it('should respect the "max" attribute when numbers are typed to fill the input\'s value', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Set the initial value to nothing
      .setValue(input, '', globals.noError)
      // Use the keyboard to enter a number way higher than the maximum
      .addValue(input, ['9','9','9'], globals.noError)
      // Check the input's value.  It should have been adjusted to 50.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      .call(done);
  });

  it('should adjust its value by steps, if the "step" attribute is defined', function(done) {
    var input = '#stepped-spinbox';
    runner.client
      // Check to see if the "step" attribute is defined
      .getAttribute(input, 'step', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('3');
      })
      // Check the initial value of the input
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      // Increment the value 3 times.
      .addValue(input, ['Up arrow', 'Up arrow', 'Up arrow'], globals.noError)
      // Check the new value of the input.  Since the step attribute is "3", the new value should be 9.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('9');
      })
      // Decrement the value 3 times.
      .addValue(input, ['Down arrow', 'Down arrow', 'Down arrow'], globals.noError)
      // Check the new value of the input.  We should have set it back to 0.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it('should set its value to its "min" attribute if using the END key', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Press the END Key
      .addValue(input, ['End'], globals.noError)
      // Check to see if the value is -50
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('-50');
      })
      .call(done);
  });

  it('should set its value to its "max" attribute if using the HOME key', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Press the HOME Key
      .addValue(input, ['Home'], globals.noError)
      // Check to see if the value is 50
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('50');
      })
      .call(done);
  });

  it('will not accept more than one negative symbol inside the input when working with negative numbers', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Set the initial value of the spinbox to empty
      .setValue(input, '', globals.noError)
      // Attempt to key in two negative symbols
      .addValue(input, [
        'Subtract',
        'Subtract'
      ], globals.noError)
      // Check the value of the input to make sure that only one negative number exists inside
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('-');
      })
      .call(done);
  });

  it('should establish WAI-ARIA attributes for min and max value if those HTML5 attributes are present', function(done) {
    // #limited-spinbox has a "min" of -50, and a "max" of 50.
    var input = '#limited-spinbox';
    runner.client
      // Check for the WAI-ARIA attributes that should have been set on the spinbox's initialization.
      .getAttribute(input, 'aria-valuemin', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('-50');
      })
      .getAttribute(input, 'aria-valuemax', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('50');
      })
      .call(done);
  });

  it('can handle pasted content from the clipboard', function(done) {
    var input = '#reverse-weird-spinbox';
    var copyInput = '#regular-input';
    runner.client
      .setValue(input, '', globals.noError)
      // add a combination of letters and numbers to the copy input
      .setValue(copyInput, ['-','x','2','x','2','x'], globals.noError)
      // select it and cut it
      .addValue(copyInput, [
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL'
      ], globals.noError)
      .addValue(copyInput, [globals.keys.control, 'x', 'NULL'], globals.noError)
      // Paste the clipboard contents into the number input
      .addValue(input, [globals.keys.control, 'v', 'NULL'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('-22');
      })
      // Paste again
      .addValue(input, [globals.keys.control, 'v', 'NULL'], globals.noError)
      // Check the contents.  The value should now be set to the minimum value "-23" instead of being "-2222".
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('-23');
      })
      .call(done);
  });

  it('should update its WAI-ARIA "valuenow" attribute whenever its value is changed', function(done) {
    var input = '#limited-spinbox';
    runner.client
      // Reset the value to '0'
      .setValue(input, '', globals.noError)
      .addValue(input, ['0'], globals.noError)
      // Check the main value to make sure it took.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      // Check the "aria-valuenow" attribute to make sure it changed along with the value (from being keyed)
      .getAttribute(input, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      // Use the up arrow keys to adjust the value up.
      .addValue(input, [
        'Up arrow',
        'Up arrow',
        'Up arrow',
        'Up arrow',
        'Up arrow'
      ], globals.noError)
      // Make sure the value changed
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('5');
      })
      // Check the "aria-valuenow" attribute to make sure it changed along with the value (from being adjusted by arrows)
      .getAttribute(input, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('5');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      // Run the destroy method on one of the spinboxes
      .execute('$("#stepped-spinbox").data("spinbox").destroy();', globals.noError)
      // Check to see if its excess markup still exists.  It should not.
      .getTagName('#stepped-spinbox-up', function(err, tagName) {
        globals.noError(err);
        should.not.exist(tagName);
      })
      .call(done);
  });

  it('can be re-invoked', function(done) {
    var input = '#stepped-spinbox';
    runner.client
      // Set an initial value that will definitely be revoked upon the plugin initialization.
      .setValue(input, 'test', globals.noError)
      // Invoke a spinbox on the empty input
      .execute('$("'+ input + '").spinbox();')
      // Check the value of the spinbox.  It should be '0' because the sanitizer that runs on initialization
      // should have caught the alphabetic text and removed it.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it('should retain a valid initial value when it\'s invoked', function(done) {
    runner.client
      // Add a new input field and label to the page
      .execute(addNewSpinboxMarkup, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.value.should.equal(true);
      })
      // Make sure that it was added properly
      .getTagName('#new-spinbox', function(err, tagName) {
        globals.noError(err);
        should.exist(tagName);
        tagName.should.equal('input');
      })
      // Set a valid number value on the input
      .setValue('#new-spinbox', '27', globals.noError)
      // Invoke it as a spinbox
      .execute('$("#new-spinbox").spinbox();')
      // Check the value to make sure it was retained
      .getValue('#new-spinbox', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('27');
      })
      .call(done);
  });

});
