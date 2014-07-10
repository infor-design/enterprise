var app = require('../app'),
  Browser = require('zombie');

require('chai').should();

//mocha -R spec
describe('Dropdown Should', function() {
  var server, browser;

  before(function() {
    app.locals.enableLiveReload = false;
    server = app.listen(3001);
    browser = new Browser({site: 'http://localhost:3001'});
   });

  after(function() {
    server.close();
  });

  beforeEach(function(done) {
    browser.visit('/tests/dropdown', done);
  });

  it('be in the right page', function() {
    browser.text('title').should.equal('Infor Html Controls - Tests');
  });

  it('have first selected', function() {
     var item = browser.document.getElementById('states');
     item.selectedIndex.should.equal(0);

     item = browser.document.getElementById('states-shdo');
     item.value.should.equal('Alabama');
  });

  it('support initial selection', function() {
     var item = browser.document.getElementById('special');
     item.selectedIndex.should.equal(9);
  });

  it('support special chars', function() {
     var item = browser.document.getElementById('special');
     item.options[item.selectedIndex].value.should.equal('a');
     item.options[item.selectedIndex].text.should.equal('Apostraphe\'s');
  });

  it('not error on empty list', function() {
     var item = browser.document.getElementById('empty');
     item.selectedIndex.should.equal(-1);
  });

  it('ignore scripts', function() {
    //One element has a script expression that will give an error. try to click it
    browser.pressButton('#special-shdo', function () {
      console.log('ok');
    });
  });

  //TODO: Test Destroy
  it('should destroy', function() {
    //Make a select and label with display:none
    //Call .destroy on it. Should then show just the original select
  });

  it('initialize when invisible', function() {
    //Make a select and label with display:none
    //Then init the control and make sure it is not shown
  });

  it('Handles Duplicate Values', function() {
    //make an element with two duplicates
    //then try to select each and make sure selected index is correct
  });

  it('Initializes in n ms', function() {
    //See how long it takes to initialize and make a test on > val
  });

  it('Can be Set to blank', function() {
    //Set value to '' and nothing should be shown. (How to prog set to blank)
  });

  it('Form Reset Works', function() {
    //Place Drop Down In a Form. Set the value and then trigger reset. This should set the value back to the orginal
  });
});
