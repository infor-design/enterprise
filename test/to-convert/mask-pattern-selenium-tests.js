/***************************
 * Format - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Pattern Format [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/mask');
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

  it('should format existing text on its initialization', function(done) {
    runner.client
      .getValue('#input-previously-filled', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(123) 456-7890');
      })
      .call(done);
  });

  it.skip('should format text as it\'s typed into the field', function(done) {
    var input = '#input-masked-phone';
    runner.client
      .setValue(input, '1234567890', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(123) 456-7890');
      })
      .call(done);
  });

  it.skip('should handle backspacing of one character', function(done) {
    var input = '#input-masked-phone';
    runner.client
      .setValue(input, '1234567890', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(123) 456-7890');
      })
      .element(input)
      .keys(['Back space'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        value.should.equal('(123) 456-789');
      })
      .call(done);
  });

  it.skip('should handle backspacing of multiple characters using a range selection', function(done) {
    var input = '#input-masked-phone';
    runner.client
      .element(input)
      .keys([
        'Left arrow',
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL',
        'Back space'
      ], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        value.should.equal('(123) 459');
      })
      .call(done);
  });

  it.skip('should handle deletion of a selected text range, followed by typing of a new character', function(done) {
    runner.client
      .setValue('#input-masked-phone', '', globals.noError)
      .addValue('#input-masked-phone', '1234567890', globals.noError)
      .getValue('#input-masked-phone', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(123) 456-7890');
      })
      .addValue('#input-masked-phone', [
        'Left arrow',
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL',
        '3'
      ], globals.noError)
      .getValue('#input-masked-phone', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(123) 456-30');
      })
      .call(done);
  });

  it.skip('should handle pasted text and format it correctly', function(done) {
    var input = '#input-masked-phone';
    var copyInput = '#copythis';
    runner.client
      // reset the Phone number input
      .setValue(input, '', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // Add data to the "copyThis" input offscreen
      .setValue(copyInput, ['x','0','x','0','x','0','x','0','x','0'], globals.noError)
      // Select it, and cut it
      .addValue(copyInput, [
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL'
      ], globals.noError)
      .addValue(copyInput, [globals.keys.control, 'x', 'NULL'], globals.noError)
      // Test the "copyThis" input to make sure that it's empty
      .getValue(copyInput, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('');
      })
      // Paste it into the other input
      .addValue(input, [globals.keys.control, 'v', 'NULL'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(000) 00');
      })
      .call(done);
  });

  // NOTE:  when this test runs, it will already have the copied text "x0x0x0x0x0"
  // stored in the clipboard from the previous test.
  it.skip('should handle pasting within existing text', function(done) {
    var input = '#input-masked-phone';
    runner.client
      .setValue(input, '3333333333', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(333) 333-3333');
      })
      // Select 5 characters in the input
      .addValue(input, [
        'Left arrow',
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL'
      ], globals.noError)
      // Paste the clipboard contents
      .addValue(input, [globals.keys.control, 'v', 'NULL'], global.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('(333) 300-0003');
      })
      .call(done);
  });

});
