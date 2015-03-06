/***************************
 * Button - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Toolbar [selenium]', function(){
  this.timeout(99999999);

  function getFocusedElementID() {
    return document.activeElement.id;
  }

  function getNumberOfOverflowedItems() {
    return $('#toolbar-overflow-menu').find('li').length;
  }

  before(function(done) {
    runner = globals.setup(undefined, '/tests/toolbar');
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

  it('should navigate to next page item when Tab is pressed', function(done) {
    runner.client
      // Select/Focus the element
      .click('#first-2', globals.noError)
      // Tab out
      .keys(['Tab'], globals.noError)
      // the element that's now focused should be the first button of the second Toolbar
      .execute(getFocusedElementID, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('second-1');
      })
      .call(done);
  });

  it('should navigate to next/previous toolbar button when Arrow Keys are pressed', function(done) {
    runner.client
      // Select/Focus the element
      .click('#second-1', globals.noError)
      // Press arrow keys 3 times
      .keys(['Right arrow', 'Right arrow', 'Right arrow'], globals.noError)
      // The element that's now focused should be the fourth button on the second Toolbar
      .execute(getFocusedElementID, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal('second-4');
      })
      .call(done);
  });

  it('should have aria roles', function(done) {
    runner.client
      .getAttribute('#first', 'role', function(err, value) {
        globals.noError(err);
        value.should.equal('toolbar');
      })
      .getAttribute('#first', 'aria-label', function(err, value) {
        globals.noError(err);
        should.exist(value);
        value.should.equal('first Toolbar');
      })
      .call(done);
  });

  it('should move options that can\'t fit on the toolbar into an Overflow menu underneath an Action Button', function(done) {
    runner.client
      // Check for the visibility of the more button on the second toolbar.  It should be visible
      .isVisible('#second .btn-actions', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Click the more button
      .click('#second .btn-actions', globals.noError)
      // Check for the existence of the overflow menu markup
      .isExisting('#toolbar-overflow-menu', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Make sure that there are items inside the overflow menu list
      // At 1024x768 resolution, "Thirteenth" and "Fourteenth" should be the options that get spilled over
      .execute(getNumberOfOverflowedItems, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.value.should.equal(2);
      })
      .call(done);
  });

});
