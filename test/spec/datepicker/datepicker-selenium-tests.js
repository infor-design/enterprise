/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Datepicker [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/datepicker');
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

  it('should be able to select one week from now', function(done) {
    var input = '#date-field';
    runner.client
      // Check the existing value from the previous test
      .setValue(input, '2/26/2015', globals.noError)
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('2/26/2015');
      })
      // Increment the value four times (use both right/up keys to make sure they are both working)
      .addValue(input, [
        'Down arrow',
        'Down arrow',
        'Enter'
      ], globals.noError)
      // Check the new value
      .getValue(input, function(err, results) {
        globals.noError(err);
        should.exist(results);
        results.should.equal('3/5/2015');
      }).call(done);
  });

});
