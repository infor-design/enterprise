var app = require('../app'),
  Browser = require('zombie');

require('chai').should();

//mocha -R spec
describe('Select Should', function() {
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
    browser.visit('/tests/select', done);
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
     item.selectedIndex.should.equal(8);
  });

  it('support special chars', function() {
     var item = browser.document.getElementById('special');
     item.options[item.selectedIndex].value.should.equal('a');
     item.options[item.selectedIndex].text.should.equal('Apostraphe\'s');
  });

});
