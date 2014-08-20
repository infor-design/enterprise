/***************************
 * Dropdown - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    path        = require('path'),
    app = require('../../../app'),
    client = require('../../runner');

describe('Dropdown', function(){
  var port = 3001,
    host = 'http://localhost',
    server;
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    app.locals.enableLiveReload = false;
    server = app.listen(port);
    client
      .init()
      .url(host + ':' + port + '/tests/dropdown')
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
    client
      .getTitle(function(err, title) {
        expect(err).to.be.null;
        title.should.equal('Infor Html Controls - Tests');
      })
      .call(done);
  });

  // Checks the selectedIndex of the original <select> box for changes.
  it('should handle duplicate values', function(done) {
    client
      .isSelected('#secondDupe', function(err, value) {
        expect(err).to.be.null;
        expect(value).to.be.true;
      })
      /*
      .getAttribute('#dupes', 'selectedIndex', function(err, value) {
        expect(err).to.be.null;
        expect(value).to.equal('0');
      })
      */
      .click('#dupes-shdo', function(err) {
        expect(err).to.be.null;
      })
      .click('#list-option0', function(err) {
        expect(err).to.be.null;
      })
      /*
      .getAttribute('#dupes', 'selectedIndex', function(err, value) {
        expect(err).to.be.null;
        expect(value).to.equal('1');
      })
      */
      .isSelected('#firstDupe', function(err, value) {
        expect(err).to.be.null;
        expect(value).to.be.true;
      })
      .call(done);
  });

  it('should be able to add and invoke a new dropdown', function(done) {
    var id = 'destroyThis';

    client
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
      .saveScreenshot( 'phantomjs-test-01.png', function(err, image) {
        expect(err).to.be.null;
      })
      .click('#' + id + '-shdo', function(err) {
        expect(err).to.be.null;
      })
      .saveScreenshot( 'phantomjs-test-02.png', function(err, image) {
        expect(err).to.be.null;
      })
      .click('#list-option0', function(err) {
        expect(err).to.be.null;
      })
      .saveScreenshot( 'phantomjs-test-03.png', function(err, image) {
        expect(err).to.be.null;
      })
      .click('#' + id + '-shdo', function(err) {
        expect(err).to.be.null;
      })
      .click('#list-option1', function(err) {
        expect(err).to.be.null;
      })
      .call(done);
  });

  it('should be able to destroy itself and reset back to its original <select> tag', function(done) {
    var id = 'destroyThis';

    client
      // run the destroy method on the dropdown
      .execute('window.hnl.dd.data("dropdown").destroy();')
      .getCssProperty('#' + id, 'display', function(err, value) {
        expect(err).to.be.null;
        expect(value).to.equal('inline-block');
      })
      .click('#destroyThis-shdo', function(err) {
        expect(err).to.not.be.null;
      })
      .call(done);
  });

  it('should work correctly with a <form> reset', function(done) {
    client
      // check that the "selected" item in the #onAForm dropdown is indeed selected.
      .isSelected('#secondFormOpt', function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.true;
      })
      // use the SoHo dropdown to change the value of the original dropdown
      // to the first option instead of the second.
      .click('#onAForm-shdo', function(err) {
        expect(err).to.be.null;
      })
      .click('#list-option0', function(err) {
        expect(err).to.be.null;
      })
      // check that the originally "selected" item is no longer selected.
      .isSelected('#secondFormOpt', function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.false;
      })
      // click on the form reset button
      .click('#onAFormReset', function(err) {
        expect(err).to.be.null;
      })
      // check that the originally "selected" item is once again selected, due
      // to the form being reset.
      .isSelected('#secondFormOpt', function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.true;
      })
      .call(done);
  });

  after(function(done) {
    client.end();
    server.close();
    done();
  });
});
