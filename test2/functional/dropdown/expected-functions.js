define([
    'intern!object',
    'intern/chai!expect',
    'require'
], function (registerSuite, expect, require) {

    'use strict';

    /*
     * Tests expected functionality of the dropdown control.
     * These are items that have been clearly defined as basic requirements for the control,
     * logical conclusions about how the control should work, etc.
     */

    registerSuite({

      name: 'Dropdown - Expected Functions',

      setup: function() {
        return this.remote
          .get(require.toUrl('http://localhost:4000/tests/dropdown/common'))
            .setFindTimeout(5000)
            .setWindowSize(1024, 768);
      },

      'Basic Expected Functionality': {
        'should have its first item selected, if no selected CSS class is present': function() {
          return this.remote
            // States Dropdown should not have any selectedIndex because nothing is selected.
            .findById('states')
              .getProperty('selectedIndex')
              .then(function(index) {
                expect(index).to.equal(0);
              })
              .end()
            // First item inside the Pseudo-markup should appear to be selected regardless.
            .findById('states-shdo')
              .getProperty('value')
              .then(function(val) {
                expect(val).to.be.ok; // jshint ignore:line
                expect(val).to.equal('Alabama');
              })
              .end();
        },

        'should automatically have an item selected if it was pre-defined in HTML markup': function() {
          var self = this,
            optionVal = 'raspberry',
            selectedVal;

          var result = self.remote
            // Get the current value of the hidden <select> tag.
            // It's selectedIndex attribute shouldn't be zero.
            .findById('preselected')
              .getProperty('value')
              .then(function(val) {
                selectedVal = val;
                expect(selectedVal).to.equal(optionVal);
              })
              .end()
            // Get the Psuedo-Markup and click it
            .findById('preselected-shdo')
              .click()
              .end()
            // The <li>'s "data-val" attribute should equal the original <option>'s value
            .findByCssSelector('#dropdown-list > ul > .is-selected')
              .getAttribute('data-val')
              .then(function(dataVal) {
                expect(dataVal).to.equal(selectedVal);
              })
              .end();

          return result;
        },

        'should support initializing with a blank or null value in the selected <option> tag': function() {
          this.skip();
        },

        'should support being initialized without any <option> tags present': function() {
          return this.remote
            .findById('no-opts')
              .getProperty('selectedIndex')
              .then(function(index) {
                expect(index).to.equal(-1);
              })
              .end()
            .findById('no-opts-shdo')
              .click()
              .end()
            .setTimeout(10)
            .findById('dropdown-list')
              .findByCssSelector('li')
                .then(function(result) {
                  expect(result.length).to.equal(0);
                }, function(error) {
                  expect(error).to.exist;
                })
                .end()
              .end();
        },

        'Form Usage': {

          beforeEach: function() {
            return this.remote
              .get(require.toUrl('http://localhost:4000/tests/dropdown/form-usage'));
          },

          'should properly reset if it exists inside a form, and the "reset" button is clicked': function() {
            return this.remote
              // Check the original value of the <select> tag
              .findById('in-form')
                .getProperty('value')
                .then(function(val) {
                  expect(val).to.equal('option2');
                })
                .end()
              // Change the dropdown option to Option 1
              .findById('in-form-shdo')
                .click()
                .end()
              .sleep(100)
              .findById('list-option1') // Option 1
                .click()
                .end()
              // Check the value of the <select>.  It should've changed to "option1"
              .findById('in-form')
                .getProperty('value')
                .then(function(val) {
                  expect(val).to.equal('option1');
                })
                .end()
              // Click the reset button
              .findById('reset-button')
                .click()
                .end()
              // Check the value of the <select> a second time.  It should be reset to "option2"
              .findById('in-form')
                .getProperty('value')
                .then(function(val) {
                  expect(val).to.equal('option2');
                })
                .end();
          }

        },

      },

      'Special Conditions': {
        beforeEach: function() {
          return this.remote
            .get(require.toUrl('http://localhost:4000/tests/dropdown/special-chars'));
        },

        'should ignore script tags that are inset as options': function() {
          // Prevents script injection attacks.
          // By virtue of this dropdown box initializing and opening when clicked without an error,
          // this test should pass.
          return this.remote
            .findById('special-shdo')
              .click()
              .end()
            // Click the option with <script> tags that trigger an alert();
            .findById('list-option6')
              .click()
              .end()
            .setTimeout(10)
            // setup an acceptAlert().  If it accepts an alert there's an issue with the code that handles
            // script injection.
            .acceptAlert()
              .then(function() {
                throw 'Alert Box should not have shown up!';
              }, function(error) {
                expect(error).to.exist;
              })
              .end();
        },

        'should properly handle <select> lists that have duplicate <option>\'s': function() {
          // Checks the selectedIndex attribute of the original <select> box to make sure it changes
          // when switching between values.
          this.skip();
        },

        'should support special characters inside an <option> tag\'s description': function() {
          var result = this.remote
            .findById('special')
              // Make sure we're on the right item in the list
              .getProperty('selectedIndex')
              .then(function(index) {
                expect(index).to.equal(10);
              })
              .end()
            .findById('special-shdo')
              .click()
              .end()
            .execute('$("#dropdown-list").scrollTop(470);')
              .end()
            .findById('list-option9')
              .click()
              .end()
            .findById('special-shdo')
              .getProperty('value')
              .then(function(val) {
                expect(val).to.equal('Customer & Internal');
              })
              .end();

          return result;
        }

      },

      'Control-specific events': {
        // TODO: figure out how to test Dropdown's public events:
        // - 'selected'
      }

    });
});
