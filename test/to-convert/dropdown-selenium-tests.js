/* eslint-disable */
/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Dropdown [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/dropdown');
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

  it('should have its first item selected', function(done) {
    runner.client
      .getAttribute('#states1111', 'selectedIndex')
      .call(done);
  });

  it('should support initial selection of an option', function(done) {
    runner.client
      .getAttribute('#special', 'value', function(err, value) {
        globals.noError(err);
        value.should.equal('a');
      })
      .getAttribute('#special', 'selectedIndex', function(err, index) {
        globals.noError(err);
        index.should.equal('10');
      })
      .call(done);
  });

  it('should support special characters', function(done) {
    runner.client
      .getAttribute('#special', 'selectedIndex', function(err, index) {
        globals.noError(err);
        index.should.equal('10');
      })
      .click('#special-shdo', globals.noError)
      // move the scrollable dropdown list <div> down so that selenium can actually see the list option
      .execute('$("#dropdown-list").scrollTop(470);')
      .click('#list-option9', globals.noError)
      .getAttribute('#special-shdo', 'value', function(err, value) {
        globals.noError(err);
        value.should.equal('Customer & Internal');
      })
      .call(done);
  });

  it('should not throw an error if the original <select> tag has no options', function(done) {
    runner.client
      .getAttribute('#empty', 'selectedIndex', function(err, index) {
        globals.noError(err);
        index.should.equal('-1');
      })
      .call(done);
  });

  // prevents script injection attacks.
  // by virtue of this dropdown box initializing and opening when clicked without an error,
  // this test should pass.
  it('should ignore <script> tags that are inset as options', function(done) {
    runner.client
      .click('#special-shdo', globals.noError)
      // move the scrollable dropdown list <div> down so that selenium can actually see the list option
      .execute('$("#dropdown-list").scrollTop(200);')
      .click('#list-option6', globals.noError)
      .call(done);
  });

  // Checks the selectedIndex of the original <select> box for changes.
  it('should handle duplicate values', function(done) {
    runner.client
      .isSelected('#secondDupe', function(err, value) {
        globals.noError(err);
        value.should.equal(true);
      })
      .click('#dupes-shdo', globals.noError)
      .click('#list-option0', globals.noError)
      .isSelected('#secondDupe', function(err, value) {
        globals.noError(err);
        value.should.equal(true);
      })
      .call(done);
  });

  it('should support setting its value to nothing (blank) programatically', function(done) {
    runner.client.execute('$("#blank").val("").trigger("updated");');

    runner.client.getAttribute('#blank', 'value', function(err, value) {
        globals.noError(err);
        value.should.equal('');
      })
      .getAttribute('#blank-shdo', 'value', function(err, value) {
        globals.noError(err);
        value.should.equal('');
      })
      .getText('#blank-shdo', function(err, value) {
        globals.noError(err);
        value.should.equal('');
      })
      .call(done);
  });

  it('should carry a "display:none;" CSS property from the original <select> tag, and initialize as invisible', function(done) {
    runner.client
      .getCssProperty('#invisible-shdo', 'display', function(err, display) {
        globals.noError(err);
        display.value.should.equal('none');
      })
      .call(done);
  });

  it('can be disabled', function(done) {
    runner.client
      // Reset clicks by clicking on the Body tag
      .click('body', globals.noError)
      // Execute the disable method
      .execute('$("#states").disable();')
      // Click on the psuedo-element
      .click('#states-shdo', globals.noError)
      // Check for the existence of Dropdown Menu Markup.  It should not exist.
      .isExisting('#dropdown-list', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can be enabled', function(done) {
    runner.client
      // Reset clicks by clicking on the Body tag
      .click('body', globals.noError)
      // Execute the disable method
      .execute('$("#states").enable();')
      // Click on the psuedo-element
      .click('#states-shdo', globals.noError)
      // Check for the existence of Dropdown Menu Markup.  It should not exist.
      .isExisting('#dropdown-list', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('can be destroyed', function(done) {
    runner.client
      // Reset clicks by clicking on the Body tag
      .click('body', globals.noError)
      // Run the Destroy method
      .execute('$("#states").data("dropdown").destroy();')
      // Check if the pseudo-markup for the Dropdown Control exists.  It shouldn't.
      .isExisting('#states-shdo', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // Reset clicks by clicking on the Body tag
      .click('body', globals.noError)
      // Re-invoke the Dropdown Control on #states
      .execute('$("#states").dropdown();')
      // Check if the pseudo-markup for the Dropdown Control exists.  It shouldn't.
      .isExisting('#states-shdo', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('should work correctly with a <form> reset', function(done) {
    runner.client
      // check that the "selected" item in the #form-dropdown dropdown is indeed selected.
      .isSelected('#option2', function(err, result) {
        globals.noError(err);
        result.should.equal(true);
      })
      // use the SoHo dropdown to change the value of the original dropdown
      // to the first option instead of the second.
      .click('#form-dropdown', globals.noError)
      .click('#option1', globals.noError)
      // check that the originally "selected" item is no longer selected.
      .isSelected('#option1', function(err, result) {
        globals.noError(err);
        result.should.equal(false);
      })
      // click on the form reset button
      .click('#reset-button', globals.noError)
      // check that the originally "selected" item is once again selected, due
      // to the form being reset.
      .isSelected('#option2', function(err, result) {
        globals.noError(err);
        result.should.equal(true);
      })
      // value of the SoHo dropdown box on screen should be the same as the <select> tag.
      .getAttribute('#form-dropdown', 'value', function(err, value) {
        globals.noError(err);
        value.should.equal('selectedByDefault');
      })
      .call(done);
  });

  it('should support being initialized as hidden', function(done) {

  });

});
