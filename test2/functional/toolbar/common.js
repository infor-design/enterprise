define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

  'use strict';

  registerSuite({

    name: 'Toolbar - Common',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/toolbar/common'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'Lifecycle': {
      // Init
      // Teardown
      // Destroy
      // Reinvoke
    },

    'API Methods': {
      // Disable
      // Enable
    },

    'Events': {

      'Triggers': {
        // ""
      },

      'Listeners': {
        // "updated.toolbar"
      }

    }

  });

});
