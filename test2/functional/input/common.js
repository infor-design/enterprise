define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

  'use strict';

  registerSuite({

    name: 'Tabs - Common',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/input/common'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'can have keys pressed': function() {
      return this.remote
        .findById('test-basic-input')
          .click()
          .pressKeys([
            'h', 'i', k.NULL
          ])
          .end()
        .findById('test-basic-input')
          .getProperty('value')
          .then(function(value) {
            expect(value).to.equal('hi');
          })
        .end();
    },

    'can tab into another field': function() {
      return this.remote
        .findById('test-basic-input')
          .click()
          .sleep(1000)
          .type(['\uE004', k.NULL ])
          .sleep(1000)
          .end()
        .getActiveElement()
          .getProperty('id')
          .then(function(id) {
            expect(id).to.equal('test-arrows');
          })
          // Should be focused
          .end();
    },

    'can press arrow keys': function() {
      return this.remote
        .findById('test-arrows')
          .click()
          .pressKeys([
            k.ARROW_UP, k.ARROW_DOWN, k.ARROW_LEFT, k.ARROW_RIGHT, k.TAB
          ])
          .end()
        // Check the 'console' on this test page to see if four keypresses made it to the page
        .sleep(2000)
        .findAllByCssSelector('#key-console > .demo-line')
          .then(function(items) {
            expect(items.length).to.equal(5);
          })
          .end();
    },

  });

});
