var assert = require("chai").should(),
  Browser = require("zombie");

//mocha -R spec
describe('Gramercy Tests', function() {

  beforeEach(function() {
    // before EACH test, create a new zombie browser
    //
    // some useful options when things go wrong:
    // debug: true  =  outputs debug information for zombie
    // waitDuration: 500  =  will only wait 500 milliseconds
    //   for the page to load before moving on
    browser = new Browser();
  });

  it('Google.com', function(done){

      browser.visit('http://www.google.com', function () {
          browser.text('title').should.equal('Google');

          done();
      });
  });

});
