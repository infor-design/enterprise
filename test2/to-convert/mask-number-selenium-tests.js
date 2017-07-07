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
        value.should.equal('12,345.6789');
      })
      .call(done);
  });

  it('should format a number while typing from start to finish', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '')
      .element(input)
      .keys(['1','2','3','4','5'])
      .element(input)
      .keys(['6'])
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('1,234.56');
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
  // Skipped because this test doesn't run properly with Chrome due to an issue with WebdriverIO.
  // Copy/Paste keyboard controls are not implemented in all browser drivers.
  // https://github.com/webdriverio/webdriverio/issues/290
  it.skip('should be able to select all characters and clear them by typing a decimal point', function(done) {
    var input = '#input-masked-number';
    // type a bunch of characters
    // select all of them (make sure the caret highlights all of them)
    // press the decimal key
    // test to see that the value of the input field is '0.'
      runner.client
      .setValue(input, '', globals.noError)
      .addValue(input, ['1','2','3','4','5','6','NULL'], globals.noError)
      .addValue(input, [globals.keys.control,'a','NULL'], globals.noError)
      .addValue(input, ['.'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('0.');
      })
      .call(done);
  });

  // Some of the Selenium browser drivers seem to not position the first character typed correcly when using
  // this control. This test does a check on that to see what the problem is.
  it('should position the numbers typed correctly', function(done) {
    var input = '#input-masked-number';
    runner.client
      .setValue(input, '', globals.noError)
      .element(input)
      .keys(['8', '1', 'NULL'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('81');
      })
      .call(done);
  });

  it('should be able to replace a selected range and format the remaining number correctly', function(done) {
    var input = '#input-masked-number';
    // fill the number field completely.
    // select a small range of numbers.
    // replace them with a single number (3).
    // test to see if the value that now exists is formatted correctly.
    runner.client
      .setValue(input, '', globals.noError)
      .element(input)
      .keys(['8','1','2','9','0','0','0'])
      .keys(['Left arrow','Left arrow']) // Back the caret up past the decimal places
      .keys([
        'Shift',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'Left arrow',
        'NULL'
      ]) // highlight the decimal point and the four integer places.
      .keys(['3'])
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('8,300');
      })
      .call(done);
  });

  // Skipped because this test doesn't run properly with Chrome due to an issue with WebdriverIO.
  // Copy/Paste keyboard controls are not implemented in all browser drivers.
  // https://github.com/webdriverio/webdriverio/issues/290
  it.skip('can handle pasted items from the clipboard and format them correctly', function(done) {
    var input = '#input-masked-number';
    var copyInput = '#copythis';
    runner.client
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
      .addValue(copyInput, [globals.keys.control, 'x', 'NULL'], globals.noError)
      // Paste the clipboard contents into the number input
      // Need to paste twice because the size of the mask limits the amount of pasted content.
      .addValue(input, [globals.keys.control, 'v', 'NULL'], globals.noError)
      .addValue(input, [globals.keys.control, 'v', 'NULL'], globals.noError)
      .getValue(input, function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('9,999.99');
      })
      .call(done);
  });

});
