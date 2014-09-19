/*****************************
 * Dropdown - Zombie Tests
 * These tests run using Zombie, and do not need a full browsing environment to run
*****************************/

var Browser = require('zombie'),
  runner;

describe('Globalize [zombie]', function() {
  var browser, document, window;

  before(function() {
    runner = globals.setup(undefined, '/tests/globalize');
    browser = new Browser({ site: runner.site.currentUrl });
  });

  beforeEach(function(done) {
    browser.visit('/tests/globalize', done);
    document = browser.document;
    window = browser.window;
  });

  it('have lang set', function() {
    document.querySelector('html').lang.should.equal('en');
  });

  it('be able to read locale', function() {
    document.querySelector('html').lang.should.equal('en');
  });

  it('be able to set locale', function() {
    window.Globalize.locale('de').should.equal('de');
    document.querySelector('html').lang.should.equal('de');
  });

  it('Format Dates', function() {
    //window.Globalize.locale('en');
    //window.Globalize.formatDate(new Date(2000, 10, 8)).should.equal('08/10/2000');

    //window.Globalize.locale('de');
    //window.Globalize.formatDate(new Date(2000, 10, 8)).should.equal('08.10.00');
  });

});
