/***************************
 * Radio Buttons - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

function serializationHelper() {
  return $('#radio-serialization-test').serialize();
}

describe('Radio Button [selenium]', function(){
  this.timeout(99999999);

  before(function(done){
    runner = globals.setup(undefined, '/tests/radios');
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

  it('can be hidden', function(done) {
    runner.client
      .execute('$(\'[for="option1"]\').hide();')
      .getAttribute('[for="option1"]', 'style', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('display: none;');
      })
      .call(done);
  });

  it('can be made visible', function(done) {
    runner.client
      .execute('$(\'[for="option1"]\').show();')
      .getAttribute('[for="option1"]', 'style', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal('display: inline-block;');
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    runner.client
      // Option 1 isn't selected by default
      .getAttribute('#option1', 'checked', function(err, value) {
        globals.noError(err);
        should.not.exist(value);
      })
      .execute('$("#option1").prop("disabled", true);')
      .click('[for="option1"]', globals.noError)
      // Value should not have changed.
      .getAttribute('#option1', 'checked', function(err, value) {
        globals.noError(err);
        should.not.exist(value);
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    runner.client
      .execute('$("#option1").prop("disabled", false);')
      .click('[for="option1"]', globals.noError)
      // Value should have changed.
      .getAttribute('#option1', 'checked', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      .call(done);
  });

  it('can be focused programatically', function(done) {
    runner.client
      .execute('$("#option2")[0].focus();')
      .execute('return document.activeElement.id;', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('option2');
      })
      .call(done);
  });

  it('should allow it\'s value to be set with jQuery', function(done) {
    runner.client
      .execute('$("#option2").prop("checked", true);')
      .getAttribute('#option2', 'checked', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('true');
      })
      .call(done);
  });

  it('should be serialized as part of a form', function(done) {
    runner.client
      // runs $(form).serialize(); returns the result.
      .execute(serializationHelper, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('formOptions=chicken');
      })
      .call(done);
  });

  // TODO: Complete this test
  it.skip('can be aligned on the page in any position', function(done) {
    runner.client
      .call(done);
  });

});
