define([
    'intern!object',
    'intern/chai!expect',
    'require'
], function (registerSuite, expect, require) {

    'use strict';

    /*
     * Tests the common functionality among all items in the SoHo Xi suite for this control.
     * This includes repsonses to basic functionality, common event triggers and API methods.
     */

    registerSuite({

      name: 'Dropdown - Common',

      setup: function() {
        return this.remote
          .get(require.toUrl('http://localhost:4000/tests/dropdown/common'))
            .setFindTimeout(5000)
            .setWindowSize(1024, 768);
      },

      'Lifecycle': {
        // NOTE: All tests in this group run without refreshing the page

        'can be invoked': function() {
          // Use jQuery to execute the constructor on a new dropdown element
          this.skip();
        },

        'can be destroyed': function() {
          // use jQuery to execute destroy method on the same dropdown element
          this.skip();
        },

        'can be re-invoked': function() {
          // use jQuery to execute the constructor on the same dropdown element
          this.skip();
        }
      },

      'API States': {

        'passing of CSS properties and HTML attributes to pseudo-markup': {
          'should support being initialized as hidden': function() {
            // Check the original <select> tag for CSS like "visibility: hidden;" or "display: none;"
            // Check the pseudo markup to ensure that these properties carried over
            this.skip();
          },

          'should support being initialized as disabled': function() {
            this.skip();
          },

          'should support being initialized as read-only': function() {
            this.skip();
          },
        },

        'response to input while disabled': {
          'can not receive focus while disabled': function() {
            // select something focusable, attempt to key over to the dropdown without success
            this.skip();
          },

          'will not respond to clicks while disabled': function() {
            // attempt to click while the element is disabled
            this.skip();
          },

          'will not respond to taps while disabled': function() {
            // attempt to tap while the element is disabled
            this.skip();
          },
        },

        'response to input while in read-only mode': {
          'can be focused/defocused while in read-only mode': function() {
            // Use keyboard to focus/defocus
            this.skip();
          },

          'can respond to clicks while in read-only mode, but will not open the menu': function() {
            this.skip();
          },

          'can respond to taps while in read-only mode, but will not open the menu': function() {
            this.skip();
          },

          'will ignore keyboarded attempts to open the menu while in read-only mode': function() {
            this.skip();
          }
        },

      },

      'API Methods': {
        'responds properly to "disable();"': function() {
          // use jQuery to run the disable() method on an existing dropdown
          this.skip();
        },

        'responds properly to "enable();"': function() {
          // use jQuery to run the enable() method on an existing dropdown
          this.skip();
        }
      },

      'Event Listeners': {
        // TODO: figure out how to test the standard events:
        // - beforeOpen
        // - open
        // - afterOpen
        // - rendered
        // - updated
      }

    });
});
