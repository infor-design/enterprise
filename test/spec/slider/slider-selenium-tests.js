/***************************
 * Slider - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

// Helper Function for properly setting the value of an invoked slider
// setValue() in tests doesn't work properly with our slider.
function setSliderValue(sliderId, value) {
  console.log('Value of $ = ' + $);
  $(sliderId).data('slider').value(value);
  $(sliderId).data('slider').updateRange();
}

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
    // Regular slider min = 0, max = 100, default value is 50.
    var input = '#regular',
      handle = '#regular-slider-handle';
    runner.client
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      // Focus the handle
      .click(handle, globals.noError)
      // Increment the value four times (use both right/up keys to make sure they are both working)
      .addValue(handle, [
        'Up arrow',
        'Right arrow',
        'Up arrow',
        'Right arrow'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('90');
      })
      // Decrement the value four times (use both down/left keys to make sure they're both working)
      .addValue(handle, [
        'Left arrow',
        'Down arrow',
        'Left arrow',
        'Down arrow'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
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
      // Check the value of the slider. It should have changed.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('1');
      })
      // Click the up button twice
      .click(highTick, globals.noError)
      // Check the value of the slider. It should have changed.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('4');
      })
      .call(done);
  });

  // TODO: Skipping because the Webdriver.io implementation of this doesn't seem to be working.
  // Redo this when we can.
  it.skip('can be edited by clicking and dragging the handle from one position to another', function(done) {
    var input = '#quality',
      handle = '#quality-slider-handle',
      target = '#quality-tick-4';

    runner.client
      .execute(setSliderValue, input, [40], globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('40');
      })
      .pause(100)
      .dragAndDrop(handle, target, globals.noError)
      .pause(100)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('80');
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    var disabled = '#disabled',
      lowTick = '#disabled-tick-1';

    runner.client
      // Get the value of the disabled input to set a baseline
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('40');
      })
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the disabled input.  It should not have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('40');
      })
      // Execute javascript on the page to enable to disabled slider.
      .execute('$("#disabled").data("slider").enable();')
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('20');
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    var disabled = '#disabled',
      lowTick = '#disabled-tick-1',
      highTick = '#disabled-tick-4';

    runner.client
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('20');
      })
      // Attempt to click the slider controls.
      .click(highTick, globals.noError)
      // Check the value of the disabled input.  It should have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('80');
      })
      // Execute javascript on the page to enable to disabled slider.
      .execute('$("#disabled").data("slider").disable();')
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the (formerly) enabled input.  It shouldn't have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('80');
      })
      .call(done);
  });

  it('should respect the "min" attribute when arrow keys are used to lower its value', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Set the initial value to just above the "min" (which is 0)
      .execute(setSliderValue, input, [5], globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('5');
      })
      // Use the keyboard to attempt to lower the number
      .click(handle, globals.noError)
      .addValue(handle, [
        'Down arrow',
        'Down arrow',
        'Down arrow'
      ], globals.noError)
      // Check the input's value.  It should not have gone below 0.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('0');
      })
      .call(done);
  });

  it('should respect the "max" attribute when arrow keys are used to raise its value', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Set the initial value to just below the "max" (which is 100)
      .execute(setSliderValue, input, [95], globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('95');
      })
      // Use the keyboard to attempt to raise the number
      .click(handle, globals.noError)
      .addValue(handle, [
        'Up arrow',
        'Up arrow',
        'Up arrow'
      ], globals.noError)
      // Check the input's value.  It should not have gone above 100.
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('100');
      })
      .call(done);
  });

  it('should adjust its value by steps, if the "step" attribute is defined', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Check to see if the "step" attribute is defined
      .getAttribute(input, 'step', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('5');
      })
      // Set an initial value of 50.  Check to make sure the value was properly set.
      .execute(setSliderValue, input, [50], globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      // Increment the value 3 times.
      .addValue(handle, ['Up arrow', 'Up arrow', 'Up arrow'], globals.noError)
      // Check the new value of the input.  Since the step attribute is "5", the new value should be 65.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('65');
      })
      // Decrement the value 3 times.
      .addValue(handle, ['Down arrow', 'Down arrow', 'Down arrow'], globals.noError)
      // Check the new value of the input.  We should have set it back to 50.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('50');
      })
      .call(done);
  });

  it('should set its value to its "min" attribute if using the END key', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Press the END Key
      .addValue(handle, ['End'], globals.noError)
      // Check to see if the value is 0
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it('should set its value to its "max" attribute if using the HOME key', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Press the HOME Key
      .addValue(handle, ['Home'], globals.noError)
      // Check to see if the value is 50
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('100');
      })
      .call(done);
  });

  it('should establish WAI-ARIA attributes for min and max value if those HTML5 attributes are present', function(done) {
    // #limited-spinbox has a "min" of -50, and a "max" of 50.
    var input = '#simple-step';
    runner.client
      // Check for the WAI-ARIA attributes that should have been set on the spinbox's initialization.
      .getAttribute(input, 'aria-valuemin', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .getAttribute(input, 'aria-valuemax', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('5');
      })
      .call(done);
  });

  it('should update its WAI-ARIA "valuenow" attribute whenever its value is changed', function(done) {
    var input = '#simple-step',
      handle = '#simple-step-slider-handle';
    runner.client
      // Check the input's value to make sure it's 4
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      // Check the handle's "aria-valuenow" attribute to make sure it is also 4.
      .getAttribute(handle, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      // Focus the handle and move it up two places.
      .click(handle, globals.noError)
      .addValue(handle, ['Left arrow', 'Left arrow'], globals.noError)
      // Check the main value to make sure it took.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('2');
      })
      // Check the "aria-valuenow" attribute to make sure it changed along with the value (from being keyed)
      .getAttribute(handle, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('2');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      // Run the destroy method on one of the slider
      .execute('$("#disabled").data("slider").enable().destroy();', globals.noError)
      // Check to see if its excess markup still exists.  It should not.
      .getTagName('#disabled-slider-handle', function(err, tagName) {
        globals.noError(err);
        should.not.exist(tagName);
      })
      .call(done);
  });

  it('can be re-invoked', function(done) {
    var input = '#disabled',
      handle = '#disabled-slider-handle';
    runner.client
      .execute('$("'+ input + '").slider();')
      // Check the value of the slider.  It should now be 80.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('80');
      })
      // Check the "aria-valuenow" attribute on the handle to make sure the handle exists.
      .getAttribute(handle, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('80');
      })
      .call(done);
  });

});
