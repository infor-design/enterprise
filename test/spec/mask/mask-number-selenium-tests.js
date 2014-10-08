/***************************
 * Format - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Number Format [selenium]', function(){
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

  it('should handle an existing number on its initialization', function(done) {
    runner.client
      .getValue('#number-previously-filled', function(err, value) {
        globals.noError(err);
        should.exist(value);
        //TODO value.should.equal('12,345.6789');
      })
      .call(done);
  });

  it('should format a number while typing from start to finish', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '123456', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        //TODO Works in UI value.should.equal('1,234.56');
      })
      .call(done);
  });

  it('should add a leading zero when typing a decimal point with no other numbers in place', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '', globals.noError)
      .setValue(input, '.', globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0.');
      })
      .call(done);
  });

  it('should automatically remove extra leading zeros', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '', globals.noError)
      .element(input)
      .keys(['0', '0', '0', '0', '0', '0'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0');
      })
      .call(done);
  });

  it('should remove a leading zero when typing any other integer before the decimal point', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '', globals.noError)
      .element(input)
      .keys(['0', '0', '0', '1'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1');
      })
      .call(done);
  });

  // http://jira.infor.com/browse/HFC-1822 - Comment on 08/Sep/14 12:57 PM
  it('should be able to select all characters and clear them by typing a decimal point', function(done) {
    var input = '#input-masked-number';
    // type a bunch of characters
    // select all of them (make sure the caret highlights all of them)
    // press the decimal key
    // test to see that the value of the input field is '.'
    // TODO: this test should work.
      runner.client
      /*.setValue(input, '', globals.noError)
      .setValue(input, '123456', globals.noError)
      .addValue(input, [
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL',
        '.'
      ], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0.');
      })*/
      .call(done);
  });

  it('should be able to replace a selected range and format the remaining number correctly', function(done) {
    var input = '#input-masked-number';
    runner.client
     /* TODO: fixme
      .setValue(input, '', globals.noError)
      .setValue(input, '812900', globals.noError)
      .addValue(input, [
        'Left arrow',
        'Left arrow',
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL',
        '3'
      ], globals.noError)
      .getValue(input, '', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('8,129.00');
      })*/
      .call(done);
  });

  // Added as a test case after it was discovered typing a new number after the '3' in '8,300' after deleting
  // a selected range resulted in the value becoming '83.100'.  This test case simply checks the mask to make
  // sure it retains the correct formatting after typing one more number.
  it('should continue to respect correct formatting when typing inbetween existing characters after pasting', function(done) {
    var input = '#input-masked-number';
    runner.client
      /* TODO: Fixme .addValue(input, ['1'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.not.equal('83.100');
        value.should.equal('8,310.0');
      })*/
      .call(done);
  });

  it('can handle pasted items from the clipboard and format them correctly', function(done) {
    var input = '#input-masked-number';
    var copyInput = '#copythis';
    runner.client
     /* TODO: Fixme
      .setValue(input, '', globals.noError)
      // add a combination of letters and numbers to the copy input
      .setValue(copyInput, ['x','9','x','9','x','9','x','9','x','9','x','9','x'], globals.noError)
      // select it and cut it
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
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL'
      ], globals.noError)
      .addValue(copyInput, ['Control', 'x', 'NULL'], globals.noError)
      // Paste the clipboard contents into the number input
      .addValue(input, ['Control', 'v', 'NULL'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('9,999.99');
      })*/
      .call(done);
  });

});
