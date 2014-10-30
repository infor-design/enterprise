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
    runner = globals.setup(undefined, '/tests/form');
    browser = new Browser({ site: runner.site.currentUrl });
  });

  beforeEach(function(done) {
    browser.visit('/tests/form', done);
  });

  it('can trigger dirty', function() {
    //type in field - make sure svg icon and
    var item = browser.document.getElementById('department-code');
    browser.fill('#department-code', 'test', null);
    item.value.should.equal('test');

    var op = browser.document.getElementById('output');
    op.value.should.equal('changed');
  });

});

/*
var runner;


  it.skip('can trigger events to parent', function(done) {
    //type in field - make sure event is fired on object ('dirty')
    //make sure event is fired on body - current target should be the field
    //make sure event is fired on parent - current target should be the field
    runner.client.call(done);
  });

  it.skip('can reset', function(done) {
    //type in field - make sure svg icon and class is added
    //type again back to blank value - make sure svg icon and class is cleared
    runner.client.call(done);
  });

  it.skip('can be cleared on a single field', function(done) {
    //right the js to reset dirty - remove the svg and class (could be jquery function resetdirty)
    runner.client.call(done);
  });

  it.skip('can be cleared on a parent', function(done) {
    //right the js to reset by from the parent or body - reset all dirtys (could be jquery function resetdirty)
    runner.client.call(done);
  });

  it.skip('works on all fields', function(done) {
    //test it shows / fires on all field types
    runner.client.call(done);
  });

});
*/
