define([
    'intern!object',
    'intern/chai!expect',
    'leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

    'use strict';

    function invokeDropdown() {
      return $('#new').dropdown();
    }

    function destroyDropdown() {
      return $('#new').data('dropdown').destroy();
    }

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
        setup: function() {
          return this.remote
            .get(require.toUrl('http://localhost:4000/tests/dropdown/common'));
        },

        // NOTE: All tests in this group run without refreshing the page
        'can be invoked': function() {
          // Use jQuery to execute the constructor on a new dropdown element
          return this.remote
            .execute(invokeDropdown)
            .sleep(100)
            .findById('new-shdo')
              .then(function(element) {
                expect(element).to.exist;
              })
            .end()
            // Use jQuery to execute the destroy(); method on the new dropdown
            .execute(destroyDropdown)
            .sleep(100)
            .setTimeout(10)
            .findById('new-shdo')
              .then(null, function(error) {
                // Should error out because the pseudo-markup should no longer exist
                expect(error).to.exist;
              })
            .end()
            // use jQuery to execute the constructor again on the same dropdown element
            .execute(invokeDropdown)
            .sleep(100)
            .findById('new-shdo')
              .then(function(element) {
                expect(element).to.exist;
              })
            .end();
        }
      },

      'API States': {

        'Initialized states': {
          'should support being initialized as hidden': function() {
            // Check the original <select> tag for CSS like "visibility: hidden;" or "display: none;"
            // Check the pseudo markup to ensure that these properties carried over
            return this.remote
              .findById('invisible')
                .getSpecAttribute('style')
                .then(function(style) {
                  expect(style).to.equal('display: none;');
                })
                .end()
              .setTimeout(10)
              .findById('invisible-shdo')
                .then(null, function(error) {
                  // Should error out because while the markup exists, it can't be targeted
                  expect(error).to.exist;
                })
                .end();
          },

          'should support being initialized as disabled': function() {
            return this.remote
              .findById('disabled')
                .getProperty('disabled')
                .then(function(prop) {
                  expect(prop).to.equal(true);
                })
                .end()
              .findById('disabled-shdo')
                .getProperty('disabled')
                .then(function(prop) {
                  expect(prop).to.equal(true);
                })
                .end()
              .end();
          },

          'should support being initialized as read-only': function() {
            return this.remote
              .findById('readonly')
                .getSpecAttribute('readonly')
                .then(function(prop) {
                  expect(prop).to.equal('true');
                })
                .end()
              .findById('readonly-shdo')
                .getSpecAttribute('readonly')
                .then(function(prop) {
                  expect(prop).to.equal('true');
                })
                .end()
              .end();
          },
        },

        'Response to input while disabled': {
          setup: function() {
            return this.remote
              .get(require.toUrl('http://localhost:4000/tests/dropdown/common'));
          },

          'can not receive focus while disabled': function() {
            // select something focusable, attempt to key over to the dropdown without success
            return this.remote
              .findById('towns-optgroup-shdo')
                .click()
                .end()
              .pressKeys(k.TAB)
              // Make sure that the current item is focused
              .getActiveElement()
                .getProperty('id')
                .then(function(id) {
                  expect(id).to.equal('readonly-shdo');
                })
                .end();
          },

          'will not respond to clicks while disabled': function() {
            // attempt to click while the element is disabled
            return this.remote
              .findById('disabled-shdo')
                .click()
                .end()
              .setTimeout(10)
              // Check for the existence of the dropdown list.  It should not exist because
              // the dropdown should not have opened.
              .findById('dropdown-list')
                .then(function() {
                  throw 'Dropdown List should not have opened!';
                }, function(error) {
                  expect(error).to.exist;
                })
                .end();
          },

          'will not respond to taps while disabled': function() {
            this.skip();

            // attempt to tap while the element is disabled
            if (!this.remote.session._capabilties.touchEnabled) {
              this.skip();
            }

            return this.remote
              .findById('disabled-shdo')
                .tap()
                .end()
              .sleep(300)
              .findById('dropdown-list')
                .then(function() {
                  throw 'Dropdown List should not have opened!';
                }, function(error) {
                  expect(error).to.exist;
                })
                .end();
          },
        },

        'Response to input while in read-only mode': {
          'can be focused/defocused while in read-only mode': function() {
            // Use keyboard to focus/defocus
            return this.remote
              .findById('towns-optgroup-shdo')
                .click()
                .end()
              .pressKeys('')
                .end()
              // Make sure that the current item is focused
              .getActiveElement()
                .getProperty('id')
                .then(function(id) {
                  expect(id).to.equal('readonly-shdo');
                })
                .end()
              // Shift + Tab back to the original dropdown
              .pressKeys([k.SHIFT, k.TAB, k.NULL])
                .end()
              .getActiveElement()
                .getProperty('id')
                .then(function(id) {
                  expect(id).to.not.equal('readonly-shdo');
                });
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
