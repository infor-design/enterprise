define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'test/support/key-helper',
    'fs',
    'require'
], function (registerSuite, expect, k, keyhelper, fs, require) {

  'use strict';

  registerSuite({

    name: 'Mask (Common Patterns)',

    setup: function() {
      return this.remote
        .setFindTimeout(5000)
        .setWindowSize(1024, 768);
    },

    'should format text as its being typed into a field': function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/common-patterns'))
        .findById('phone-number')
          .click()
          .pressKeys('1234567890')
          .end()
        .sleep(100)
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.exist;
            expect(val).to.equal('(123) 456-7890');
          });
    },

    'can backspace once': function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/common-patterns'))
        .findById('phone-number')
          .click()
          .pressKeys('1234567890')
          .pressKeys([k.BACKSPACE])
          .end()
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.exist;
            expect(val).to.equal('(123) 456-789');
          });
    },

    'can use the keyboard to select and delete a range of characters': function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/common-patterns'))
        .findById('phone-number')
          .click()
          .pressKeys('1234567890')
          .pressKeys([
            k.ARROW_LEFT,
            k.SHIFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.NULL,
            k.BACKSPACE
          ])
          .end()
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.exist;
            expect(val).to.equal('(123) 450');
          });
    },

    'can select a range of characters and replace them with a single character': function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/common-patterns'))
        .findById('phone-number')
          .click()
          .pressKeys('1234567890')
          .pressKeys([
            k.ARROW_LEFT,
            k.SHIFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.ARROW_LEFT,
            k.NULL,
            '3'
          ])
          .end()
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.exist;
            expect(val).to.equal('(123) 456-30');
          });
    }

  });

});
