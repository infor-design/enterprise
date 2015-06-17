/***************************
 * Slider - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

// Helper Function for properly setting the value of an invoked slider
// setValue() in tests doesn't work properly with our slider.
function setSliderValue(sliderId, value) {
  $(sliderId).data('slider').value(value);
  $(sliderId).data('slider').updateRange();
}

// jshint ignore:start
function getSliderValue(sliderId) {
  return $(sliderId).data('slider').value();
}
// jshint ignore:end

// Helper Function that is run before all of the tests in this suite that adds
// ID attributes to certain Slider Handles & Ticks that we need to target for testings.
// This keeps the tests a little bit leaner in terms of targeting.
function addIDs() {
  var simpleStepTicks = $('#simple-step').data('slider').ticks,
    qualityTicks = $('#quality').data('slider').ticks,
    disabledTicks = $('#disabled').data('slider').ticks,
    tooltipTicks = $('#tooltips').data('slider').ticks,

    simpleStepHandle = $('#simple-step').data('slider').handles[0],
    regularHandle = $('#regular').data('slider').handles[0],
    qualityHandle = $('#quality').data('slider').handles[0],
    steppedHandle = $('#stepped').data('slider').handles[0],
    disabledHandle = $('#disabled').data('slider').handles[0],
    tooltipHandle0 = $('#tooltips').data('slider').handles[0],
    tooltipHandle1 = $('#tooltips').data('slider').handles[1];

  // Add IDs to handles
  simpleStepHandle.attr('id', 'simple-step-slider-handle');
  regularHandle.attr('id', 'regular-slider-handle');
  qualityHandle.attr('id', 'quality-slider-handle');
  steppedHandle.attr('id', 'stepped-slider-handle');
  disabledHandle.attr('id', 'disabled-slider-handle');
  tooltipHandle0.attr('id', 'tooltips-slider-handle-lower');
  tooltipHandle1.attr('id', 'tooltips-slider-handle-higher');

  // Loop through all ticks and add IDs
  for (var i = 0; i < simpleStepTicks.length; i++) {
    simpleStepTicks[i].element.attr('id', 'simple-step-tick-' + i);
  }
  for (i = 0; i < qualityTicks.length; i++) {
    qualityTicks[i].element.attr('id', 'quality-tick-' + i);
  }
  for (i = 0; i < disabledTicks.length; i++) {
    disabledTicks[i].element.attr('id', 'disabled-tick-' + i);
  }
  for (i = 0; i < tooltipTicks.length; i++) {
    tooltipTicks[i].element.attr('id', 'tooltips-tick-' + i);
  }
}

describe('Slider [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/slider');
    runner.client
      .execute('window.hnl = {};')
      .execute(addIDs, globals.noError)
      // NOTE: Had to set a specific window size to prevent failures
      // in PhantomJS regarding UI element clicks.
      .windowHandleSize({
          width: 1024,
          height: 768
      })
      .call(done);
  });

  it.skip('can be edited using arrow keys', function(done) {
    // Regular slider min = 0, max = 100, default value is 50.
    var input = '#regular',
      handle = '#regular-slider-handle';
    runner.client
      .execute(setSliderValue, input, [50], globals.noError)
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
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
        results.should.equal('54');
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

  it.skip('can be edited using PageUp and PageDown', function(done) {
    var input = '#regular',
      handle = '#regular-slider-handle';

    runner.client
      .execute(setSliderValue, input, [50], globals.noError)
      // Check the existing value from the previous test
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      .click(handle, globals.noError)
      // Decrement the value twice with PageDown (10% each time)
      .addValue(handle, [
        'Pagedown',
        'Pagedown'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('30');
      })
      // Increment the value twice with PageUp (10% each time)
      .addValue(handle, [
        'Pageup',
        'Pageup'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('50');
      })
      .call(done);
  });

  it.skip('can be edited by clicking ticks on the range bar', function(done) {
    var input = '#simple-step',
      lowTick = '#simple-step-tick-1',
      highTick = '#simple-step-tick-4';

    runner.client
      // Check the existing value from the previous test
      .execute(setSliderValue, input, [0], globals.noError)
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

  it.skip('can be enabled', function(done) {
    var disabled = '#disabled',
      lowTick = '#disabled-tick-1';

    runner.client
      .execute(setSliderValue, disabled, [2], globals.noError)
      // Get the value of the disabled input to set a baseline
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('2');
      })
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the disabled input.  It should not have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('2');
      })
      // Execute javascript on the page to enable to disabled slider.
      .execute('$("#disabled").data("slider").enable();')
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the (formerly) disabled input.  It should now have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1');
      })
      .call(done);
  });

  it.skip('can be disabled', function(done) {
    var disabled = '#disabled',
      lowTick = '#disabled-tick-1',
      highTick = '#disabled-tick-4';

    runner.client
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1');
      })
      // Attempt to click the slider controls.
      .click(highTick, globals.noError)
      // Check the value of the disabled input.  It should have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      // Execute javascript on the page to enable to disabled slider.
      .execute('$("#disabled").data("slider").disable();')
      // Attempt to click the slider controls.
      .click(lowTick, globals.noError)
      // Check the value of the (formerly) enabled input.  It shouldn't have changed.
      .getValue(disabled, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      .call(done);
  });

  it.skip('should respect the "min" attribute when arrow keys are used to lower its value', function(done) {
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

  it.skip('should respect the "max" attribute when arrow keys are used to raise its value', function(done) {
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

  it.skip('should adjust its value by steps, if the "step" attribute is defined', function(done) {
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

  it.skip('should set its value to its "min" attribute if using the END key', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Press the END Key
      .addValue(handle, ['End'], globals.noError)
      // Check to see if the value is 100
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('100');
      })
      .call(done);
  });

  it.skip('should set its value to its "max" attribute if using the HOME key', function(done) {
    var input = '#stepped',
      handle = '#stepped-slider-handle';
    runner.client
      // Press the HOME Key
      .addValue(handle, ['Home'], globals.noError)
      // Check to see if the value is 0
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it.skip('should establish WAI-ARIA attributes for min and max value if those HTML5 attributes are present', function(done) {
    // #limited-spinbox has a "min" of -50, and a "max" of 50.
    var input = '#simple-step-slider-handle';
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

  it.skip('should update its WAI-ARIA "valuenow" attribute whenever its value is changed', function(done) {
    var input = '#simple-step',
      handle = '#simple-step-slider-handle';
    runner.client
      // Check the input's value to make sure it's 4
      .execute(setSliderValue, input, [4], globals.noError)
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

  it.skip('can have two handles if the "data-range" attribute is set', function(done) {
    var input = '#tooltips',
      lower = '#tooltips-slider-handle-lower',
      higher = '#tooltips-slider-handle-higher';

    runner.client
      // Check to see if the data-range attribute is set
      .getAttribute(input, 'data-range', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      // Check to make sure there are two handles on this range with "aria-valuenow" attributes set.
      .getAttribute(lower, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('30');
      })
      .getAttribute(higher, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('80');
      })
      .call(done);
  });

  it.skip('should display a tooltip when its handles are focused if the "data-tooltip-content" attribute is set', function(done) {
    var input = '#tooltips',
      lower = '#tooltips-slider-handle-lower';

    runner.client
      // check to see if the "data-tooltip-content" attribute is defined
      .getAttribute(input, 'data-range', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      // attempt to trigger the tooltip by clicking on one of the handles
      .click(lower, globals.noError)
      // read the content of the tooltip to make sure it matches the current value of the handle.
      .getText('#tooltip > .tooltip-content', function(err, text) {
        globals.noError(err);
        should.exist(text);
        text.should.equal('$30');
      })
      .call(done);
  });

  // TODO: Come back and figure out why the value doesn't change in this test.
  // Testing this in the browser returns the expected results, but running it in the test suite fails
  // to properly change the values.
  it.skip('when "data-range" is active, while clicking a tick, it should move the handle closest to that tick into that position', function(done) {
    var lower = '#tooltips-slider-handle-lower',
      higher = '#tooltips-slider-handle-higher',
      tick25 = '#tooltips-slider-tick-1',
      tick50 = '#tooltips-slider-tick-2',
      tick75 = '#tooltips-slider-tick-3';

    runner.client
      .saveScreenshot('wtf.png')
      // Click the $25 tick, which is really close to the lower handle at $30.
      // The Lower handle should become $25.
      .click(tick25, globals.noError)
      .getAttribute(lower, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('25');
      })
      // Click the $75 tick, which is really close to the higher handle at $80.
      // The Higher handle should become $75.
      .click(tick75, globals.noError)
      .getAttribute(higher, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('75');
      })
      // When a point is clicked directly in the middle of the two handles, the higher handle wins out.
      // Click the $50 tick.  The Higher handle should become $50.
      .click(tick50, globals.noError)
      .getAttribute(higher, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('50');
      })
      .getAttribute(lower, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('25');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    var input = '#quality';
    runner.client
      .execute(setSliderValue, input, [4], globals.noError)
      // Run the destroy method on one of the slider
      .execute('$("' + input + '").data("slider").enable().destroy();', globals.noError)
      // Check to see if its excess markup still exists.  It should not.
      .getTagName('#quality-slider-handle', function(err, tagName) {
        globals.noError(err);
        should.not.exist(tagName);
      })
      .call(done);
  });

  it('can be re-invoked', function(done) {
    var input = '#quality',
      handle = '#quality-slider-handle';
    runner.client
      .execute('$("'+ input +'").slider();')
      // Need to re-establish the ID that we defined for the Quality slider's handle in the
      // "before()" section of this test suite
      .execute('$("'+ input +'").data("slider").handles[0].attr("id", "quality-slider-handle");', globals.noError)
      // Check the value of the slider.  It should now be 80.
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      // Check the "aria-valuenow" attribute on the handle to make sure the handle exists.
      .getAttribute(handle, 'aria-valuenow', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      .call(done);
  });

});
