define([
  'intern!object',
  'intern/chai!expect'
], function(registerSuite, expect) {

  'use strict';

  // Sanity-checking tests
  // * Test non-AMD code
  // * Basic unit tests for the environment we're running in

  registerSuite({
    name: 'Everything',

    'Basic Tests': function() {
      expect(true).to.be.true; // jshint ignore:line
    }
  });

});
