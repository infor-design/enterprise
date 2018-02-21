define([
  'intern!object',
  'intern/chai!expect',
  'intern/order!../../../node_modules/jquery/dist/jquery'
], function(registerSuite, expect) {

  'use strict';

  // Sanity-checking tests
  // * Test non-AMD code
  // * Basic unit tests for the environment we're running in

  return registerSuite({
    name: 'Everything',

    'Basic Tests': function() {
      expect(true).to.be.true;
    },

    'Does the DOM exist?': function() {
      expect(window).to.exist;
    },

    'Dependencies': {
      'jQuery': {
        'Does jQuery exist?': function() {
          expect($).to.exist;
        },

        'Can we actually do stuff we jQuery?': function() {
          var newDOM = $('<div id="you-there"></div>');
          expect(newDOM).to.exist;
          expect(newDOM[0]).to.exist;
        }
      }
    },

  });

});
