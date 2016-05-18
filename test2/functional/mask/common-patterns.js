define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

  'use strict';

  registerSuite({

    name: 'Mask - Common Patterns',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/common'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'should format existing text on its initialization': function() {
      return this.remote
        .findById('phone-number')
          .click()
          .pressKeys('1234567890')
          .end()
          .sleep(100)
          .getProperty('value')
          .then(function(val) {
            expect(val).to.equal('(123) 456-7890')
          });
    }

  });

});
