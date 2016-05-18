define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'require'
], function (registerSuite, expect, k, require) {

    'use strict';

    function invokeDropdown() {
      return $('#new').dropdown();
    }

    function destroyDropdown() {
      return $('#new').data('dropdown').destroy();
    }

    var urlRoot = 'http://localhost:4000/tests/dropdown/';

    /*
     * Tests the common functionality among all items in the SoHo Xi suite for this control.
     * This includes repsonses to basic functionality, common event triggers and API methods.
     */

    registerSuite({

      name: 'Dropdown - Common',

      setup: function() {
        return this.remote
          .get(require.toUrl(urlRoot + 'common'))
            .setFindTimeout(5000)
            .setWindowSize(1024, 768);
      },

      'Lifecycle': {
        setup: function() {
          return this.remote
            .get(require.toUrl(urlRoot + 'common'));
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

          beforeEach: function() {
            return this.remote
              .get(urlRoot + 'common');
          },

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
          beforeEach: function() {
            return this.remote
              .get(require.toUrl(urlRoot + 'common'));
          },

          'can not receive focus while disabled': function() {
            // NOTE: This test is skipped because the tab key doesn't work in Firefox.  May be a bug in Intern/Webdriver
            // https://github.com/theintern/intern/issues/564
            this.skip();

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
              .setFindTimeout(10)
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
            // attempt to tap while the element is disabled
            if (!this.remote.session.capabilities.touchEnabled) {
              this.skip();
            }

            return this.remote
              .findById('disabled-shdo')
                .tap()
                .end()
              .setFindTimeout(10)
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
            // NOTE: This test is skipped because the tab key doesn't work in Firefox.  May be a bug in Intern/Webdriver
            // https://github.com/theintern/intern/issues/564
            this.skip();

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
            return this.remote
              .get(require.toUrl(urlRoot + 'readonly'))
              .setFindTimeout(10)
              // Click the dropdown pseudo element
              .findById('readonly-dropdown-shdo')
                .click()
                .end()
              // attempt to find the dropdown list (should not exist because this is a "readonly" dropdown)
              .findDisplayedById('dropdown-list')
                .then(function() {
                  throw 'Dropdown List should not have opened!';
                }, function(error) {
                  expect(error).to.exist;
                })
                .end()
              // Check the currently active element (should be the psuedo-element)
              .getActiveElement()
                .getAttribute('id')
                .then(function(id) {
                  expect(id).to.equal('readonly-dropdown-shdo');
                })
                .end();
          },

          'can respond to taps while in read-only mode, but will not open the menu': function() {
            // attempt to tap while the element is disabled
            if (!this.remote.session.capabilities.touchEnabled) {
              this.skip();
            }

            return this.remote;
          },

          'will not open the menu by keyboard while in read-only mode': function() {
            return this.remote
              .get(require.toUrl(urlRoot + 'readonly'))
              .setFindTimeout(10)
              // click the input that's above the readonly dropdown
              .findById('random-input-1')
                .click()
                .end()
              // Tab once to get to the dropdown
              .pressKeys([k.TAB, k.NULL])
                .end()
              // Make sure we're selected
              .getActiveElement()
                .getAttribute('id')
                .then(function(id) {
                  expect(id).to.equal('readonly-dropdown-shdo');
                })
                .end()
              // Activate the dropdown with Down Arrow
              .pressKeys([k.ARROW_DOWN])
                .end()
              // Getting the active element should still be the "shdo" element, since the menu should not have opened.
              .getActiveElement()
                .getAttribute('id')
                .then(function(id) {
                  expect(id).to.equal('readonly-dropdown-shdo');
                })
                .end();
          }
        },

      },

      'API Methods': {
        setup: function() {
            return this.remote
              .get(require.toUrl('http://localhost:4000/tests/dropdown/api-states'));
          },

        'responds properly to "disable();"': function() {
          // use jQuery to run the disable() method on an existing dropdown
          // // NOTE: A button inside test page manages the "disable()" API method.
          return this.remote
            .findById('disable')
              .click()
              .end()
            .setFindTimeout(10) // Prevents this test from hanging too long because the element won't exist
            .findById('states-test-shdo')
              .click()
              .end()
            .findById('dropdown-list')
              .then(function() {
                  throw 'Dropdown List should not have opened!';
                }, function(error) {
                  expect(error).to.exist;
                })
                .end();
        },

        'responds properly to "enable();"': function() {
          // use jQuery to run the enable() method on an existing dropdown.
          // NOTE: A button inside test page manages the "enable()" API method.
          return this.remote
            .findById('enable')
              .click()
              .end()
            // Click the body to reset some stuff
            .findByCssSelector('body')
              .click()
              .end()
            .sleep(100)
            // Click the states dropdown
            .findById('states-test-shdo')
              .click()
              .end()
            .sleep(100)
            .findById('dropdown-list')
              .then(function(element) {
                  expect(element).to.exist;
                }, function(error) {
                  throw 'Dropdown list should exist on the page, but is not available';
                })
                .end();
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
