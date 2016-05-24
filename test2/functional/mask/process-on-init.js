define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'test2/support/helpers',
    'require'
], function (registerSuite, expect, k, helpers, require) {

  'use strict';

  registerSuite({

    name: 'Mask (Process on Initialize)',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/process-on-init'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'should format text on init according to its defined pattern': function() {
      return this.remote
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.equal('(123) 456-7890')
          });
    }

  });

});
