define([
  'intern!object',
  'intern/chai!expect',
  'jsdom',
], function(registerSuite, expect, JSDOM) {

  'use strict';

  // Setup jsdom environment
  var jsdom = JSDOM.jsdom;
  global.window = jsdom().defaultView;
  global.document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>');

  var Locale = require('js/Locale');
  global.window.Locale = Locale;

  registerSuite({

    name: 'Locale Control',

    // Checks the scaffolding we set up to make sure everything works
    'should exist': function() {
      expect(global.window.Locale).to.exist;
    }

  });

});
