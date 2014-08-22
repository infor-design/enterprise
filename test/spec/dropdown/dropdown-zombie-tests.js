/*****************************
 * Dropdown - Zombie Tests
 * These tests run using Zombie, and do not need a full browsing environment to run
*****************************/

var Browser = require('zombie'),
  runner;

//mocha -R spec
describe('Dropdown [zombie]', function() {
  var self = this,
    browser;

  before(function() {
    runner = globals.setup(undefined, '/tests/dropdown');
    browser = new Browser({ site: runner.site.currentUrl });
  });

  after(function() {
    //runner.site.server.close();
  });

  beforeEach(function(done) {
    browser.visit('/tests/dropdown', done);
  });

  it('should be in the right page', function() {
    browser.text('title').should.equal('Infor Html Controls - Tests');
  });

  it('should have first selected', function() {
     var item = browser.document.getElementById('states');
     item.selectedIndex.should.equal(0);

     item = browser.document.getElementById('states-shdo');
     item.value.should.equal('Alabama');
  });

  it('should support initial selection of an option', function() {
     var item = browser.document.getElementById('special');
     item.selectedIndex.should.equal(9);
  });

  it('should support special characters', function() {
     var item = browser.document.getElementById('special');
     item.options[item.selectedIndex].value.should.equal('a');
     item.options[item.selectedIndex].text.should.equal('Apostraphe\'s');
  });

  it('should not throw an error if its list is empty', function() {
     var item = browser.document.getElementById('empty');
     item.selectedIndex.should.equal(-1);
  });

  it('should ignore scripts inset as options', function() {
    //One element has a script expression that will give an error. try to click it
    browser.pressButton('#special-shdo', function () {
      //No Error happended but nothing to confirm
    });
  });

  it('should initialize while invisible', function() {
    var item = browser.document.getElementById('invisible-shdo');
    item.style.display.should.equal('none');
  });

  it('initializes in n ms', function() {
    //See how long it takes to initialize and make a test on > val
  });

  it('can be set to blank', function() {
    //Set value to '' and nothing should be shown. (How to prog set to blank)
  });

  it('shouldn\'t be able to open two lists at the same time', function() {
    // Try to open one list, then try to open the other,
    // and check to see if the list contents match the first list opened (they should only match the second).
  });

});
