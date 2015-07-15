define([
    'intern!object',
    'intern/chai!expect',
    'require'
], function (registerSuite, expect, require) {
    registerSuite({

      name: 'Dropdown Control',

      setup: function() {
        return this.remote
          .get(require.toUrl('http://localhost:4000/tests/dropdown'))
            .setFindTimeout(5000)
            .setWindowSize(1024, 768);
      },

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
          optionVal = 'a',
          selectedVal;

        var result = self.remote
          // Get the current value of the hidden <select> tag.
          // It's selectedIndex attribute shouldn't be zero.
          .findById('special')
            .getProperty('value')
            .then(function(val) {
              selectedVal = val;
              expect(selectedVal).to.equal(optionVal);
            })
            .end()
          // Get the Psuedo-Markup and click it
          .findById('special-shdo')
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

      'should support special characters inside dropdown options': function() {
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

    });
});
