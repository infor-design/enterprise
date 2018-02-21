define([
  'intern!object',
  'intern/chai!expect',
  'jsdom',
], function(registerSuite, expect) {

  var DEFAULT_SETTINGS = {
    process: undefined,
    pipe: undefined
  };

  registerSuite({

    name: 'Mask API',

    setup: function() {
      var jsdom = require('jsdom').jsdom;
      document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>');
      window = document.defaultView;

      require('components/locale/locale.js');
      Soho = window.Soho = {};

      // Load the Mask files we are testing

      require('components/utils/utils.js');
      require('components/mask/mask-api.js');
      require('components/mask/mask-functions.js');
      require('components/mask/masked-input.js');
    },

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
      var api = new Soho.Mask(DEFAULT_SETTINGS),
        maskDefinitions = Soho.masks.LEGACY_DEFS;

      // Credit Cards
      var result = api._convertPatternFromString('####-####-####-####', maskDefinitions);
      expect(result).to.exist;
      expect(result).to.be.a('array');
      expect(result).to.have.lengthOf(19);

      // U.S. Phone Number
      result = api._convertPatternFromString('(###) ###-####', maskDefinitions);
      expect(result).to.exist;
      expect(result).to.be.a('array');
      expect(result).to.have.lengthOf(14);
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
      var opts = {
        selection: {
          start: 0
        }
      };

      var result = api.process(text, opts);
      expect(result).to.exist;
      expect(result).to.be.a('object');
      expect(result.conformedValue).to.be.a('string');
      expect(result.conformedValue).to.equal('0123-4567-8901-2345');
    },


    'should process numbers': function() {
      var settings = DEFAULT_SETTINGS;
      settings.process = 'number';
      settings.pattern = Soho.masks.numberMask;
      var api = new Soho.Mask(settings);

      // Handle big numbers with thousands separators
      var textValue = '1111111111';
      var opts = {
        selection: {
          start: 0
        },
        patternOptions: {
          allowThousands: true,
          integerLimit: 10
        }
      };
      var result = api.process(textValue, opts);
      expect(result).to.exist;
      expect(result).to.be.a('object');
      expect(result.conformedValue).to.be.a('string');
      expect(result.conformedValue).to.equal('1,111,111,111');


      // Handle numbers with a decimal
      opts.patternOptions.allowDecimal = true;
      textValue = '2222222222.33';
      result = api.process(textValue, opts);
      expect(result.conformedValue).to.equal('2,222,222,222.33');


      // Handle Negative numbers
      opts.patternOptions.allowNegative = true;
      textValue = '-4444444444.55';
      result = api.process(textValue, opts);
      expect(result.conformedValue).to.equal('-4,444,444,444.55');


      // Handle Numbers with a prefix (currency)
      opts.patternOptions.allowNegative = false;
      opts.patternOptions.integerLimit = 4;
      opts.patternOptions.prefix = '$';
      textValue = '2345';
      result = api.process(textValue, opts);
      expect(result.conformedValue).to.equal('$2,345');


      // Handle Numbers with a suffix (percent)
      opts.patternOptions.integerLimit = 3;
      opts.patternOptions.prefix = '';
      opts.patternOptions.suffix = '%';
      textValue = '100';
      result = api.process(textValue, opts);
      expect(result.conformedValue).to.equal('100%');
    },


    'should process short dates': function() {
      var settings = DEFAULT_SETTINGS;
      settings.process = 'date';
      settings.pattern = Soho.masks.shortDateMask;
      var api = new Soho.Mask(settings);

      var textValue = '1111111111';
      var opts = {
        selection: {
          start: 0
        },
        patternOptions: {
          format: 'M/d/yyyy',
          symbols: {
            separator: '/'
          }
        }
      };
      var result = api.process(textValue, opts);

      expect(false).to.be.false;
    },


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
      var settings = DEFAULT_SETTINGS;
      settings.pattern = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];

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
        placeholderChar: Soho.masks.PLACEHOLDER_CHAR,
        caretTrapIndexes: []
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
      var api = new Soho.Mask(settings),
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


    //============================================
    // Utility Methods
    //============================================

    // TODO: SOHO-6294
    'can translate a string into a mask from an alternate locale': function() {
      // 1. Grab French currency locale?
      // 2. run _conformToMask_ directly with mask, etc


    },

  });

  var TEST_INPUT,
    TEST_COMPONENT_API;

  /**
   * Masked Input Field Tests
   */
  registerSuite({

    name: 'Masked Input Field',

    //============================================
    // Setup/Configuration
    //============================================

    setup: function() {
      // Setup the input field used for this test suite
      TEST_INPUT = document.createElement('input');
      TEST_INPUT.setAttribute('type', 'text');
      TEST_INPUT.setAttribute('id', 'masked');
      document.body.appendChild(TEST_INPUT);
    },

    'sanity test': function() {
      expect(window.Soho).to.exist;
      expect(window.Soho.components).to.exist;
      expect(window.Soho.components.MaskedInput).to.exist;
    },

    'can be invoked': function() {
      TEST_COMPONENT_API = new window.Soho.components.MaskedInput(TEST_INPUT);
      var api = TEST_COMPONENT_API;

      expect(api).to.exist;
      expect(api).to.be.instanceof(window.Soho.components.MaskedInput);

      // Check default settings
      expect(api.settings).to.be.an('object');
      expect(api.settings.maskAPI).to.exist;
    },

    'handles translation of deprecated settings': function() {
      var input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'weird-settings');

      // deprecated date settings
      input.setAttribute('data-mask-mode', 'date');
      input.setAttribute('data-must-complete', 'true');

      var inputComponent = new window.Soho.components.MaskedInput(input);

      expect(inputComponent.settings).to.exist;
      expect(inputComponent.settings).to.be.a('object');
      expect(inputComponent.settings).to.have.property('process', 'date');

      // TODO: Check deprecated time settings

    },

    //===============================================
    // Basic Functionality
    //===============================================

    // Test `_getSafeRawValue()_`
    'can safely get a string value from an input field': function() {
      expect(TEST_COMPONENT_API._getSafeRawValue('straight up text')).to.equal('straight up text');
      expect(TEST_COMPONENT_API._getSafeRawValue(300)).to.equal('300');
      expect(TEST_COMPONENT_API._getSafeRawValue(300 + '4545')).to.equal('3004545');
      expect(TEST_COMPONENT_API._getSafeRawValue(null)).to.equal('');
      expect(TEST_COMPONENT_API._getSafeRawValue(undefined)).to.equal('');
    },

    // TODO: SOHO-6293
    'initializes properly with a value present (SOHO-6293)': function() {

      // `input1/inputComponent1` are a basic pattern-masked input with a value
      var input1 = document.createElement('input');
      input1.setAttribute('type', 'text');
      input1.setAttribute('id', 'preset-text');
      input1.setAttribute('value', '1234567890');

      var inputComponent1 = new window.Soho.components.MaskedInput(input1, {
        pattern: '(###) ###-####'
      });
      expect(inputComponent1.settings).to.have.property('pattern');
      expect(input1.value).to.equal('(123) 456-7890');

      // `input2/inputComponent2` is a number mask
      var input2 = document.createElement('input');
      input2.setAttribute('type', 'text');
      input2.setAttribute('id', 'preset-number-dec');
      input2.setAttribute('value', '1234567890');

      var inputComponent2 = new window.Soho.components.MaskedInput(input2, {
        process: 'number',
        pattern: '#,###,###',
        patternOptions: {
          allowThousands: true,
          integerLimit: 7,
          decimalLimit: 0,
          symbols: {
            thousands: ',',
            decimal: '.'
          }
        }
      });
      expect(inputComponent2.settings).to.have.property('patternOptions');
      expect(inputComponent2.settings.patternOptions).to.have.property('integerLimit', 7);
      expect(inputComponent2.settings.patternOptions).to.have.property('decimalLimit', 0);
      expect(inputComponent2.settings.patternOptions).to.have.property('allowThousands', true);
      expect(input2.value).to.equal('1,234,567');

      // `input3/inputComponent3` is a number mask with decimals (tests SOHO-6293)
      var input3 = document.createElement('input');
      input3.setAttribute('type', 'text');
      input3.setAttribute('id', 'preset-number-dec');
      input3.setAttribute('value', '-5555.33');

      var inputComponent3 = new window.Soho.components.MaskedInput(input3, {
        process: 'number',
        pattern: '-#,###,###.00',
        patternOptions: {
          allowDecimal: true,
          allowNegative: true,
          allowThousands: true,
          integerLimit: 7,
          decimalLimit: 2,
          symbols: {
            negative: '-',
            thousands: ',',
            decimal: '.'
          }
        }
      });
      expect(inputComponent3.settings).to.have.property('patternOptions');
      expect(inputComponent3.settings.patternOptions).to.have.property('allowNegative', true);
      expect(inputComponent3.settings.patternOptions).to.have.property('allowDecimal', true);
      expect(input3.value).to.equal('-5,555.33');
    },

    // TODO: SOHO-4744
    // Simulates the french locale (fr-FR)
    'can have alternate characters for decimal, comma, and currency symbol (SOHO-4744)': function() {
      var input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'french-text');
      input.setAttribute('value', '5333,66');

      var inputComponent = new window.Soho.components.MaskedInput(input, {
        process: 'number',
        pattern: '# ###,00',
        patternOptions: {
          allowDecimal: true,
          allowThousands: true,
          integerLimit: 4,
          decimalLimit: 2,
          symbols: {
            decimal: ',',
            thousands: ' ',
            currency: '€'
          },
          suffix: ' €'
        }
      });
      expect(inputComponent.settings.patternOptions).to.have.property('symbols');
      expect(inputComponent.settings.patternOptions.symbols).to.have.property('decimal', ',');
      expect(inputComponent.settings.patternOptions.symbols).to.have.property('thousands', ' ');
      expect(inputComponent.settings.patternOptions.symbols).to.have.property('currency', '€');
      expect(input.value).to.equal('5 333,66 €');

    },

    // TODO: SOHO-3259
    // simulates locale 'ar-EG'
    'can display reversed prefix/suffix when in RTL mode (SOHO-3259)': function() {
      var input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'rtl');
      input.setAttribute('value', '123456789');

      var inputComponent = new window.Soho.components.MaskedInput(input, {
        process: 'number',
        pattern: '#٬###٬###-',
        patternOptions: {
          allowThousands: true,
          integerLimit: 7,
          symbols: {
            thousands: '٬',
            negative: '-'
          },
          suffix: '-'
        }
      });
      expect(inputComponent.settings.patternOptions).to.have.property('symbols');
      expect(inputComponent.settings.patternOptions.symbols).to.have.property('thousands', '٬');
      expect(inputComponent.settings.patternOptions.symbols).to.have.property('negative', '-');
      expect(input.value).to.equal('1٬234٬567-');
    }

  });

});
