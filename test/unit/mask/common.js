define([
  'intern!object',
  'intern/chai!expect',
  'jsdom',
], function(registerSuite, expect) {

  var jsdom = require('jsdom').jsdom;
  document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>'); // jshint ignore:line
  window = document.defaultView;  // jshint ignore:line

  Locale = window.Locale = {}; // jshint ignore:line
  Soho = window.Soho = {}; // jshint ignore:line

  // Load the Mask files we are testing
  require('components/utils/utils.js');
  require('components/mask/mask-api.js');
  require('components/mask/mask-functions.js');
  require('components/mask/masked-input.js');

  var DEFAULT_SETTINGS = {
    process: undefined,
    pipe: undefined
  };

  registerSuite({

    name: 'Mask',

    //============================================
    // Setup/Configuration
    //============================================

    // Sanity Test
    'should exist': function() {
      expect(window.Soho).to.exist;
      expect(window.Soho.masks).to.exist;
      expect(window.Soho.Mask).to.exist;
    },

    'can be invoked': function() {
      var api = new Soho.Mask(DEFAULT_SETTINGS);

      expect(api).to.exist;
      expect(api).to.be.a('object');
      expect(api).to.be.an.instanceof(Soho.Mask);

      // Check default settings
      expect(api.settings).to.exist;
      expect(api.settings).to.be.a('object');

      // has basic functions
      expect(api.configure).to.be.a('function');
      expect(api.process).to.be.a('function');
    },

    // Makes sure that a legacy Soho pattern mask is properly converted to an array.
    'should convert a legacy Soho mask pattern string into a pattern array': function() {
      var api = new Soho.Mask(DEFAULT_SETTINGS);

      // Credit Cards
      var result = api._convertPatternFromString('####-####-####-####');
      expect(result).to.exist;
      expect(result).to.be.a('array');
      expect(result).to.have.lengthOf(19);

      // U.S. Phone Number
      result = api._convertPatternFromString('(###) ###-####');
      expect(result).to.exist;
      expect(result).to.be.a('array');
      expect(result).to.have.lengthOf(14);

      //
    },

    // Placeholder masks are used internally to figure out placement positions, and can be
    // used visually as the guide inside of an input field.
    'can convert a mask array into a placeholder array': function() {
      var api = new Soho.Mask(DEFAULT_SETTINGS),
        mask = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ],
        result = api._convertMaskToPlaceholder(mask, Soho.masks.PLACEHOLDER_CHAR);

      expect(result).to.exist;
      expect(result).to.be.a('string');
      expect(result).to.equal('____-____-____-____');
    },

    //==================================================
    // Mask Processing
    //==================================================

    // Checks a basic "credit card" pattern mask
    'should process patterns': function() {
      var settings = DEFAULT_SETTINGS;
      settings.pattern = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ]
      var text = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
      var api = new Soho.Mask(settings);

      // TODO: Make "opts" (different than settings?)
      var opts = {
        selection: {
          start: 0
        }
      };

      // process
      var result = api.process(text, opts);

      expect(result).to.exist;
      expect(result).to.be.a('object');
      expect(result.conformedValue).to.be.a('string');
      expect(result.conformedValue).to.equal('0123-4567-8901-2345');
    },


    // Checks a complex number mask with thousands separators and decimal places (and caret traps)
    'should process numbers': function() {
      var settings = DEFAULT_SETTINGS;
      settings.process = 'number';
      settings.pattern = Soho.masks.numberMask;

      // See if the provided number mask made it.
      expect(settings.pattern).to.be.a('function');
    },


    // Checks a complex number mask with thousands separators and decimal places (and caret traps)
    //'should process short dates': function() {
    //  expect(true).to.be.false;
    //},


    //==================================================
    // Caret Placement
    //==================================================

    // Private method that detects caret trap indicies
    'Properly identifies caret traps in a pattern array': function() {
      var api = new Soho.Mask(DEFAULT_SETTINGS),
        caretTrap = Soho.masks.CARET_TRAP,
        testMask = [/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, caretTrap, '.', caretTrap, /\d/, /\d/];

      var result = api._processCaretTraps(testMask);

      expect(result).to.exist;
      expect(result).to.be.an('object');

      expect(result).to.have.property('maskWithoutCaretTraps');
      expect(result.maskWithoutCaretTraps).to.have.deep.members([/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, '.', /\d/, /\d/]);

      expect(result).to.have.property('indexes');
      expect(result.indexes).to.have.deep.members([13, 14]);
    },

    'Retains text caret locations in simple mask results': function() {
      var api = new Soho.Mask(DEFAULT_SETTINGS),
        opts = {
          selection: {
            start: 1
          }
        };

      // Run the masking process
      var result = api.process('1', opts);

      // Run the caret adjustment
      var adjustCaretOpts = {
        previousMaskResult: '',
        previousPlaceholder: '',
        conformedValue: result.conformedValue,
        placeholder: result.placeholder,
        rawValue: '1',
        caretPos: result.caretPos,
        placeholderChar: Soho.masks.PLACEHOLDER_CHAR
      };

      var caretPos = api.adjustCaretPosition(adjustCaretOpts);

      // Under normal conditions where there are no caret traps and automatic adjustments due
      // to character literals, this will remain the same as the input value.
      expect(caretPos).to.exist;
      expect(caretPos).to.be.a('number');
      expect(caretPos).to.equal(1);
    },

    'Properly adjusts text caret placement when adding character literals': function() {
      var settings = DEFAULT_SETTINGS;
      settings.pattern = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
      var api = new Soho.Mask(DEFAULT_SETTINGS),
        textValue = '1234',
        opts = {
          selection: {
            start: 4
          }
        };

      // Run the masking process
      var result = api.process(textValue, opts);

      // Run the caret adjustment
      var adjustCaretOpts = {
        previousMaskResult: '',
        previousPlaceholder: '',
        conformedValue: result.conformedValue,
        placeholder: result.placeholder,
        rawValue: textValue,
        caretPos: result.caretPos,
        placeholderChar: Soho.masks.PLACEHOLDER_CHAR,
        caretTrapIndexes: []
      };

      var caretPos = api.adjustCaretPosition(adjustCaretOpts);

      // Caret should have moved one index forward to account for the dash added
      expect(caretPos).to.exist;
      expect(caretPos).to.be.a('number');
      expect(caretPos).to.equal(5);
    },

  });

});
