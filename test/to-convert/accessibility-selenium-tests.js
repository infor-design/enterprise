/***************************
 * Accessibility - Selenium Tests
 * These tests run using webdriverIO and Selenium, in a true browser environment
***************************/

var runner;

describe('Accessibility [selenium]', function(){
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/');
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

  //Note: Code Sniffer has an api, wonder if it can be called.
  it.skip('Every Input Field Has a Label', function(done) {
    // Scan for all inputs, textarea, select, look at the id, find a matching label with for
  });

  it.skip('Every Input Field Has unique id', function(done) {
    // Scan for all inputs, look at the id, make sure no others with ID
  });

  it.skip('Every link and label has some text', function(done) {
    // Make sure no links and labels are blank
  });

  it.skip('No links have the word click in them', function(done) {
    // Look for keywords like 'click' in links
    // Look for directional words (imagine.. You are blind so now left right top ect)
  });

  it.skip('All Svg Elements Should have focusable false and aria-hidden and role=presentation', function(done) {
    // Look for keywords like 'click' in links
    // Look for directional words (imagine.. You are blind so now left right top ect)
  });

});
