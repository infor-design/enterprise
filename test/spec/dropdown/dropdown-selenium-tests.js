/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var handleError = globals.noError,
    runner;

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

  // smoke test, to figure out if we're even on the right page
  it('is on the correct page', function(done) {
    runner.client
      .getTitle(function(err, title) {
        should.not.exist(err);
        title.should.equal('Infor Html Controls - Tests');
      })
      .call(done);
  });

  it('should have its first item selected', function(done) {
    runner.client
      .getAttribute('#states', 'selectedIndex', function(err, index) {
        should.not.exist(err);
        index.should.equal('0');
      })
      .getAttribute('#states-shdo', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('Alabama');
      })
      .call(done);
  });

  it('should support initial selection of an option', function(done) {
    runner.client
      .getAttribute('#special', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('a');
      })
      .getAttribute('#special', 'selectedIndex', function(err, index) {
        should.not.exist(err);
        index.should.equal('9');
      })
      .call(done);
  });

  it('should support special characters', function(done) {
    runner.client
      .getAttribute('#special', 'selectedIndex', function(err, index) {
        should.not.exist(err);
        index.should.equal('9');
      })
      .click('#special-shdo', handleError)
      // move the scrollable dropdown list <div> down so that selenium can actually see the list option
      .execute('$("#dropdown-list").scrollTop(470);')
      .click('#list-option9', handleError)
      .getAttribute('#special-shdo', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('Apostraphe\'s');
      })
      .call(done);
  });

  it('should not throw an error if the original <select> tag has no options', function(done) {
    runner.client
      .getAttribute('#empty', 'selectedIndex', function(err, index) {
        should.not.exist(err);
        index.should.equal('-1');
      })
      .call(done);
  });

  // prevents script injection attacks.
  // by virtue of this dropdown box initializing and opening when clicked without an error,
  // this test should pass.
  it('should ignore <script> tags that are inset as options', function(done) {
    runner.client
      .click('#special-shdo', handleError)
      // move the scrollable dropdown list <div> down so that selenium can actually see the list option
      .execute('$("#dropdown-list").scrollTop(200);')
      .click('#list-option6', handleError)
      .call(done);
  });

  // Checks the selectedIndex of the original <select> box for changes.
  it('should handle duplicate values', function(done) {
    runner.client
      .isSelected('#secondDupe', function(err, value) {
        should.not.exist(err);
        value.should.equal(true);
      })
      .click('#dupes-shdo', handleError)
      .click('#list-option0', handleError)
      .isSelected('#firstDupe', function(err, value) {
        should.not.exist(err);
        value.should.equal(true);
      })
      .call(done);
  });

  it('should support setting its value to nothing (blank) programatically', function(done) {
    runner.client
      .execute('$("#dupes-shdo").val("");')
      .getAttribute('#dupes-shdo', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('');
      })
      .getAttribute('#dupes', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('');
      })
      .call(done);
  });

  it('should carry a "display:none;" CSS property from the original <select> tag, and initialize as invisible', function(done) {
    runner.client
      .getCssProperty('#invisible-shdo', 'display', function(err, display) {
        should.not.exist(err);
        display.value.should.equal('none');
      })
      .call(done);
  });

  it('should be able to add and invoke a new dropdown', function(done) {
    var id = 'destroyThis';

    runner.client
      // build the new markup containing the dropdown
      .execute('$("<div>").attr("id","destroy-container").addClass("field").prependTo("#dropdowns-container");')
      .execute('$("<label>").attr("for","' + id + '").addClass("label").text("Destroy This").appendTo("#destroy-container");')
      .execute('$("<select>").attr("id","' + id + '").appendTo("#destroy-container");')
      .execute('$("<option>").val("destroy1").text("Destroy 1").appendTo("#destroyThis");')
      .execute('$("<option>").val("destroy2").text("Destroy 2").appendTo("#destroyThis");')
      .execute('$("<option>").val("destroy3").text("Destroy 3").appendTo("#destroyThis");')
      .execute('window.hnl.dd = $("#' + id + '");')
      .execute('window.hnl.dd.dropdown();')

      // should be able to click on the new dropdown,
      // as well as both of its options.
      .click('#' + id + '-shdo', handleError)
      .click('#list-option0', handleError)
      .click('#' + id + '-shdo', handleError)
      .click('#list-option1', handleError)
      .call(done);
  });

  it('should be able to destroy itself and reset back to its original <select> tag', function(done) {
    var id = 'destroyThis';

    runner.client
      // run the destroy method on the dropdown
      .execute('window.hnl.dd.data("dropdown").destroy();')
      .getCssProperty('#' + id, 'display', function(err, display) {
        should.not.exist(err);
        display.value.should.equal('inline-block');
      })
      // should error out
      .click('#destroyThis-shdo', function(err) {
        should.exist(err);
      })
      .call(done);
  });

  it('should work correctly with a <form> reset', function(done) {
    runner.client
      // check that the "selected" item in the #onAForm dropdown is indeed selected.
      .isSelected('#secondFormOpt', function(err, result) {
        should.not.exist(err);
        result.should.equal(true);
      })
      // use the SoHo dropdown to change the value of the original dropdown
      // to the first option instead of the second.
      .click('#onAForm-shdo', handleError)
      .click('#list-option0', handleError)
      // check that the originally "selected" item is no longer selected.
      .isSelected('#secondFormOpt', function(err, result) {
        should.not.exist(err);
        result.should.equal(false);
      })
      // click on the form reset button
      .click('#onAFormReset', handleError)
      // check that the originally "selected" item is once again selected, due
      // to the form being reset.
      .isSelected('#secondFormOpt', function(err, result) {
        should.not.exist(err);
        result.should.equal(true);
      })
      // value of the SoHo dropdown box on screen should be the same as the <select> tag.
      .getAttribute('#onAForm-shdo', 'value', function(err, value) {
        should.not.exist(err);
        value.should.equal('Selected by Default');
      })
      .call(done);
  });

});
