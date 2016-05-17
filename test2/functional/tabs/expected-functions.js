define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

  'use strict';

  registerSuite({

    name: 'Tabs - Expected Functionality',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/tabs/common'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'Basic Expected Functionality': {

      'should have the currently selected tab\'s corresponding panel activated': function() {
        this.skip();
      }

    },

    'Special Conditions': {

      'can be invoked with no tabs or panels present': function() {
        return this.remote
          .get(require.toUrl('http://localhost:4000/tests/tabs/no-initial-tabs'))
          .setTimeout(10)
          // Check for the existence of the "tab-more" DIV inside the Tab control to make sure it actually invoked
          .findByCssSelector('#empty > .tab-more')
            .then(function(el) {
              expect(el.length).to.equal(1);
            })
            .end()
          .findByCssSelector('#empty > .tab-list > li')
            .then(function(el) {
              expect(el.length).to.equal(0);
            }, function(err) {
              // Error should be thrown because Selenium won't be able to target any elements
              expect(err).to.exist;
            })
            .end()
          // Click the button that add
          .findById('addNewTabs')
            .click()
            .end()
          // Check that the invoked tabs control now has at least one tab
          .findByCssSelector('#empty > .tab-list > li')
            .getVisibleText()
            .then(function(text) {
              expect(text).to.equal('New Tab 0');
            })
            .end();
      }

    }

  });

});
