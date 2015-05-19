/***************************
 * Tabs - Selenium Tests
 * These tests run using webdriverJS and Selenium, in a true browser environment
***************************/

var runner;

describe('Tabs [selenium]', function(){
  this.timeout(99999999);

  // Global variables for input field names
  var TABS = '#tabs-regular',
    TAB_4 = '#tab4',
    NEW_TAB = '#newTab';

  function addTab() {
    var content = '<h2>New Tab Content</h2><p>Here is some new tab content</p>',
      opts = {
        name: 'New Tab',
        content: content
      };
    $('#tabs-regular').data('tabs').add('newTab', opts);
  }

  function removeTab() {
    $('#tabs-regular').data('tabs').remove('newTab');
  }

  function hideTab() {
    $('#tabs-regular').data('tabs').hide('tab4');
  }

  function showTab() {
    $('#tabs-regular').data('tabs').show('tab4');
  }

  //Start Server - Make a Web Driver Connection
  before(function(done){
    runner = globals.setup(undefined, '/tests/tabs');
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

  it('can be destroyed', function(done) {
    runner.client
      // Run the destroy method
      .execute('$("#tabs-regular").data("tabs").destroy();', globals.noError)
      // Check the visibility of one of the hidden tab panels to see if they can be seen
      .isVisible(TAB_4, function(err, result) {
        globals.noError(err);
        should.exist(result);
      })
      .call(done);
  });

  it('can be invoked', function(done) {
    runner.client
      // re-invoke the tabs plugin on the #tabs id
      .execute('$("'+ TABS +'").tabs();', globals.noError)
      // Check to see if the more button exists (markup should have been re-added by the setup method)
      .isExisting(TABS + ' .tab-more', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('can add a new tab', function(done) {
    runner.client
      // run the Tab control's add() method
      .execute(addTab, globals.noError)
      // attempt to find the newTab Id
      .isExisting(NEW_TAB, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it('can remove an existing tab', function(done) {
    runner.client
      // run the Tab control's add() method
      .execute(removeTab, globals.noError)
      // attempt to find the newTab Id
      .isExisting(NEW_TAB, function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can hide a tab', function(done) {
    runner.client
      // Check the visibility of one of the tabs.  It should be visible.
      .isVisible('a[href="' + TAB_4 + '"]', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      // Run the Tab control's hide() method.
      .execute(hideTab, globals.noError)
      // Check the visibility again.  It should be hidden now.
      .isVisible('a[href="' + TAB_4 + '"]', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      .call(done);
  });

  it('can show a tab', function(done) {
    runner.client
      // Check the visibility of one of the tabs.  It should be hidden.
      .isVisible('a[href="' + TAB_4 + '"]', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      // Run the Tab control's show() method.
      .execute(showTab, globals.noError)
      // Check the visibility again.  It should be visible now.
      .isVisible('a[href="' + TAB_4 + '"]', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

  it.skip('displays a "More" button if there are enough tabs to push the tab list into overflow', function(done) {
    runner.client
      // Check to see if the More button is currently visible.  It should not be at 1024px wide with 4 tabs.
      .isVisible(TABS + ' .tab-more', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(false);
      })
      // Change the width of the window to something smaller
      .windowHandleSize({
          width: 320,
          height: 768
      })
      // Check for the more button's visibility again.  It should show now.
      .isVisible(TABS + ' .tab-more', function(err, result) {
        globals.noError(err);
        should.exist(result);
        result.should.equal(true);
      })
      .call(done);
  });

});
