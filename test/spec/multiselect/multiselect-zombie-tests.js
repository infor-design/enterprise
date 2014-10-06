/*****************************
 * Dropdown - Zombie Tests
 * These tests run using Zombie, and do not need a full browsing environment to run
*****************************/

var Browser = require('zombie'),
  runner;

//mocha -R spec
describe('Multiselect [zombie]', function() {
  var browser;

  before(function() {
    runner = globals.setup(undefined, '/tests/multiselect');
    browser = new Browser({ site: runner.site.currentUrl });
  });

  beforeEach(function(done) {
    browser.visit('/tests/multiselect',done);
  });

  it('should be in the right page', function() {
    browser.text('title').should.equal('SoHo Controls XI - Tests');
  });

  it('should have first selected', function() {
    var item = browser.document.getElementById('states-multi');
    item.selectedIndex.should.equal(0);

    var elem = browser.document.getElementById('option1-sel');
    elem.text.should.equal('Option One');

  });

});
