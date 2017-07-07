/***************************
 * Time Picker - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Time Picker [selenium]', function(){
  this.timeout(99999999);

  // Global variables for input field names
  var TIME_FIELD = '#time-field',
    TIME_FIELD_TRIGGER = '#time-field + svg',
    DISABLED_FIELD = '#time-field-disabled',
    DISABLED_FIELD_TRIGGER = '#time-field-disabled + svg',
    ROUNDING_FIELD = '#rounding-time-field',
    HOURS_INPUT = '#timepicker-hours',
    HOURS_DD = '#timepicker-hours-shdo',
    MINUTES_INPUT = '#timepicker-minutes',
    MINUTES_DD = '#timepicker-minutes-shdo',
    PERIOD_INPUT = '#timepicker-period',
    PERIOD_DD = '#timepicker-period-shdo',
    DD_LIST = '#dropdown-list',
    SET_TIME_LINK = '#timepicker-popup .set-time';

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/timepicker');
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

  it('can be modified by typing a value into the input box', function(done) {
    runner.client
      // check the original value
      .getValue(TIME_FIELD, globals.noError)
      // key in a value
      .setValue(TIME_FIELD, '1054am', globals.noError)
      // check the input box's value.  It should have been modified by the
      // Mask plugin to be a correcly-formatted time
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:54 am');
      })
      .call(done);
  });

  it.skip('can be modified by using the keyboard to activate and maniuplate its popover panel', function(done) {
    runner.client
      // set the default value back to nothing
      .setValue(TIME_FIELD, '', globals.noError)
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // use the down arrow to open the popover
      .addValue(TIME_FIELD, ['Down arrow'], globals.noError)
      // popover is now open.  Press down arrow 3 times to set the "hours" dropdown to 4, and 'Enter' to accept it
      .addValue(HOURS_DD, ['Down arrow', 'Down arrow', 'Down arrow', 'Enter'], globals.noError)
      // check the value of the hours input to make sure it's '4'
      .getValue(HOURS_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('4');
      })
      // set the value of the "minutes" dropdown
      .addValue(MINUTES_DD, [
        'Down arrow',
        'Down arrow',
        'Down arrow',
        'Down arrow',
        'Down arrow',
        'Down arrow',
        'Enter'
        ], globals.noError)
      // check the value of the minutes input to make sure it's '30'
      .getValue(MINUTES_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('30');
      })
      // set the value of the "period" dropdown
      .addValue(PERIOD_DD, ['Down arrow', 'Enter'], globals.noError)
      // check the value of the period input to make sure it's 'PM'
      .getValue(PERIOD_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('PM');
      })
      // Tab off of the period Drop down (which focuses on the 'set time' link), and hit Enter to accept the value
      .addValue(PERIOD_DD, ['Tab', 'Enter'], globals.noError)
      // Check the value of the Timepicker input field.  It should equal '4 : 30 PM'
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('3:30');
      })
      .call(done);
  });

  it.skip('can be modified by clicking on the trigger to open its popover panel, ' +
     'and clicking and choosing values from the panel\'s dropdowns', function(done) {
    runner.client
      // set and check the original value of the input
      .setValue(TIME_FIELD, '', globals.noError)
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // click on the trigger to activate the popover
      .click(TIME_FIELD_TRIGGER, globals.noError)
      // click the first dropdown to open the list
      .click(HOURS_DD, globals.noError)
      // click the fourth list item in the list (will have a value of '4')
      .click(DD_LIST + ' li:nth-child(0n + 4)')
      // check the value of the hours input to make sure it equals '3'
      .getValue(HOURS_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('3');
      })
      // click the first dropdown to open the list
      .click(MINUTES_DD, globals.noError)
      // click the sixth list item in the list (will have a value of '30')
      .click(DD_LIST + ' li:nth-child(0n + 7)')
      // check the value of the hours input to make sure it equals '30'
      .getValue(MINUTES_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('30');
      })
      // click the first dropdown to open the list
      .click(PERIOD_DD, globals.noError)
      // click the sixth list item in the list (will have a value of 'pm')
      //.click(DD_LIST + ' li:nth-child(0n + 2)')
      // check the value of the hours input to make sure it equals 'pm'
      //.getValue(PERIOD_INPUT, function(err, value) {
      //  globals.noError(err);
      //  should.exist(value);
      //  value.should.equal('PM');
      //})
      // click the Set Time link
      .click(SET_TIME_LINK, globals.noError)
      // Check the value of the Timepicker input field.  It should equal '4 : 30 pm'
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('3:30');
      })
      .call(done);
  });

  it.skip('should not be modified if the Escape key is pressed, even if values in the dropdowns have been changed', function(done) {
    runner.client
      // set the default value back to nothing
      .setValue(TIME_FIELD, '1055PM', globals.noError)
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:55');
      })
      // use the down arrow to open the popover
      .addValue(TIME_FIELD, ['Down arrow'], globals.noError)
      // popover is now open.  Press up arrow 3 times to set the "hours" dropdown to 7, and 'Enter' to accept it
      .addValue(HOURS_DD, ['Up arrow', 'Up arrow', 'Up arrow', 'Enter'], globals.noError)
      // check the value of the hours input to make sure it's '4'
      .getValue(HOURS_INPUT, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('7');
      })
      // press the Escape key
      .addValue(HOURS_DD, ['Escape'], globals.noError)
      // the popover menu is now closed.  Check the value to make sure it's remained at 10:55
      .getValue(TIME_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:55');
      })
      .call(done);
  });

  it('should not pass validation if an invalid time is submitted', function(done) {
    runner.client
      .setValue(TIME_FIELD, '', globals.noError)
      // Set the input field to an obviously wrong time
      .addValue(TIME_FIELD, '1361PM', globals.noError)
      // Check to see if the time was formatted
      .getValue(TIME_FIELD, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('13:61 PM');
      })
      // Tab out.  This should activate validation
      .addValue(TIME_FIELD, ['Tab'], globals.noError)
      // Check the CSS class of the field to see if the error class was appended.
      // Needs to pause for a short time because the visual validation stuff takes some time to appear.
      .pause(400)
      .getAttribute(TIME_FIELD, 'class', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.contain('error');
      })
      .call(done);
  });

  it('should round minutes to the nearest minute interval if the "roundToIncrement" setting has been toggled on', function(done) {
    runner.client
      // Set and check the original value of the input
      .setValue(ROUNDING_FIELD, '', globals.noError)
      .getValue(ROUNDING_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // Key in a time that doesn't match up to any of the predefined intervals on the 10s
      .setValue(ROUNDING_FIELD, '1013pm', globals.noError)
      .addValue(ROUNDING_FIELD, ['Tab'], globals.noError)
      // Check the value.  It should've rounded down to 10:10 pm
      .getValue(ROUNDING_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:10 pm');
      })
      // Reset the value to nothing and check the input
      .setValue(ROUNDING_FIELD, '', globals.noError)
      .getValue(ROUNDING_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // Key in a time that doesn't match up to any of the predefined intervals on the 10s
      .setValue(ROUNDING_FIELD, '1016pm', globals.noError)
      .addValue(ROUNDING_FIELD, ['Tab'], globals.noError)
      // Check the value.  It should've rounded up to 10:20 pm
      .getValue(ROUNDING_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:20 pm');
      })
      .call(done);
  });

  it.skip('can be enabled', function(done) {
    runner.client
      // set and check the original value of the input
      .setValue(DISABLED_FIELD, '', globals.noError)
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // attempt to key in a time
      .setValue(DISABLED_FIELD, '1054am', globals.noError)
      // check the value. It should not have changed.
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // enable the input
      .execute('$("' + DISABLED_FIELD + '").enable();')
      // attempt to key in a new time
      .setValue(DISABLED_FIELD, '1054am', globals.noError)
      // check the value. It should have changed now that the input's been enabled.
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:54 am');
      })
      .call(done);
  });

  it.skip('can be disabled', function(done) {
    runner.client
      // Check the initial value of the input
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:54 am');
      })
      // Change the value
      .setValue(DISABLED_FIELD, '', globals.noError)
      // Check the value, it should be empty
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // disable the input
      .execute('$("' + DISABLED_FIELD + '").disable();')
      // attempt to key in a new time
      .setValue(DISABLED_FIELD, '1054am', globals.noError)
      // check the value. It should not have changed now that the input's been disabled.
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      .execute('$("' + DISABLED_FIELD + '").enable();')
      .execute('$("' + DISABLED_FIELD + '").data("timepicker").destroy();')
      // Attempt to find the previously-existing trigger for the popup menu.
      // It shouldn't exist, and this should fail.
      .isExisting(DISABLED_FIELD_TRIGGER, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // set a non-time-formatted value on the input field.
      .setValue(DISABLED_FIELD, '1054PM', globals.noError)
      // invoke the timepicker
      .execute('$("' + DISABLED_FIELD + '").timepicker();')
      // check to see if the Mask inside the timepicker correctly formatted the date
      .getValue(DISABLED_FIELD, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('10:54 PM');
      })
      // check to see if the trigger field now exists
      .isExisting(DISABLED_FIELD_TRIGGER, function(err, result) {
        globals.noError(err);
        should.exist(result);
      })
      .call(done);
  });

});
