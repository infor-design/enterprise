define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

  'use strict';

  registerSuite({

    name: 'Text Area - Common',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/textarea/modal'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'validation position is correct': function() {
      this.skip();

      var fieldWidth = 0;

      return this.remote
        .findById('button-1')
          .click()
          .sleep(500)
          .end()
        .findById('context-desc')
          .sleep(500)
          .click()
          .getProperty('value')
          .then(function(value) {
            expect(value).to.equal('');
          }).end()
        .findById('context-name')
          .sleep(500)
          .click()
          .getProperty('value')
          .then(function(value) {
            expect(value).to.equal('');
          })
          .getComputedStyle('width')
          .then(function (width) {
            fieldWidth = width;
            expect(width).to.equal('300px');
          }).end()
       .findByCssSelector('.icon-error')
        .getComputedStyle('left')
        .then(function (left) {
            expect(left).to.equal('271px');
        });
    }

  });

});
