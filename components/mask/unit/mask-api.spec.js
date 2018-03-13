/* eslint-disable no-underscore-dangle */
import { SohoMaskAPI } from '../../mask/mask-api';
import { masks } from '../../mask/masks';

describe('Mask API', () => {
  const DEFAULT_SETTINGS = {
    process: undefined,
    pipe: undefined
  };

  it('Should be an object', () => {
    expect(window.Soho).toBeDefined();
    expect(window.Soho.masks).toBeDefined();
    expect(window.Soho.components.MaskedInput).toBeDefined();
  });

  it('Can be invoked', () => {
    const api = new SohoMaskAPI(DEFAULT_SETTINGS);

    expect(api).toBeDefined();
    expect(api).toEqual(jasmine.any(Object));

    expect(window.Soho.components.MaskedInput).toBeDefined();

    // Check default settings
    expect(api.settings).toBeDefined();
    expect(api.settings).toEqual(jasmine.any(Object));

    // has basic functions
    expect(api.configure).toEqual(jasmine.any(Function));
    expect(api.process).toEqual(jasmine.any(Function));
  });

  it('Should convert a legacy Soho pattern mask to an array', () => {
    const api = new SohoMaskAPI(DEFAULT_SETTINGS);
    const maskDefinitions = masks.LEGACY_DEFS;

    // Credit Cards
    let result = api._convertPatternFromString('####-####-####-####', maskDefinitions);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(19);

    // U.S. Phone Number
    result = api._convertPatternFromString('(###) ###-####', maskDefinitions);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(14);
  });

  it('can convert a mask array into a placeholder array', () => {
    // Placeholder masks are used internally to figure out placement positions, and can be
    // used visually as the guide inside of an input field.
    const api = new SohoMaskAPI(DEFAULT_SETTINGS);
    const mask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const result = api._convertMaskToPlaceholder(mask, masks.PLACEHOLDER_CHAR);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(String));
    expect(result).toEqual('____-____-____-____');
  });

  it('should process patterns', () => {
    // Checks a basic "credit card" pattern mask
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const text = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
    const api = new SohoMaskAPI(settings);
    const opts = {
      selection: {
        start: 0
      }
    };

    const result = api.process(text, opts);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(Object));
    expect(result.conformedValue).toEqual(jasmine.any(String));
    expect(result.conformedValue).toEqual('0123-4567-8901-2345');
  });

  it('should process numbers', () => {
    const settings = DEFAULT_SETTINGS;
    settings.process = 'number';
    settings.pattern = masks.numberMask;
    const api = new SohoMaskAPI(settings);

    // Handle big numbers with thousands separators
    let textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowThousands: true,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(Object));
    expect(result.conformedValue).toEqual(jasmine.any(String));
    expect(result.conformedValue).toEqual('1,111,111,111');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '2222222222.33';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('2,222,222,222.33');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-4444444444.55';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-4,444,444,444.55');

    // Handle Numbers with a prefix (currency)
    opts.patternOptions.allowNegative = false;
    opts.patternOptions.integerLimit = 4;
    opts.patternOptions.prefix = '$';
    textValue = '2345';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('$2,345');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('100%');
  });

  it('Should process short dates', () => {
    const settings = DEFAULT_SETTINGS;
    settings.process = 'date';
    settings.pattern = masks.shortDateMask;
    const api = new SohoMaskAPI(settings);

    const textValue = '1111111111';
    const opts = {
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
    const result = api.process(textValue, opts);

    expect(result.maskResult).toBeFalsy();
  });

  it('Should properly identify caret traps in a pattern array', () => {
    const api = new SohoMaskAPI(DEFAULT_SETTINGS);
    const caretTrap = masks.CARET_TRAP;
    const testMask = [/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, caretTrap, '.', caretTrap, /\d/, /\d/];

    const result = api._processCaretTraps(testMask);

    expect(result).toBeDefined();
    expect(result).toEqual(jasmine.any(Object));

    expect(result.maskWithoutCaretTraps).toBeDefined();
    expect(result.maskWithoutCaretTraps).toEqual(jasmine.arrayContaining([/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, '.', /\d/, /\d/]));

    expect(result.indexes).toBeDefined();
    expect(result.indexes).toEqual(jasmine.arrayContaining([13, 14]));
  });

  it('Should retains text caret locations in simple mask results', () => {
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    const api = new SohoMaskAPI(DEFAULT_SETTINGS);
    const opts = {
      selection: {
        start: 1
      }
    };

    // Run the masking process
    const result = api.process('1', opts);

    // Run the caret adjustment
    const adjustCaretOpts = {
      previousMaskResult: '',
      previousPlaceholder: '',
      conformedValue: result.conformedValue,
      placeholder: result.placeholder,
      rawValue: '1',
      caretPos: result.caretPos,
      placeholderChar: masks.PLACEHOLDER_CHAR,
      caretTrapIndexes: []
    };

    const caretPos = api.adjustCaretPosition(adjustCaretOpts);

    // Under normal conditions where there are no caret traps and automatic adjustments due
    // to character literals, this will remain the same as the input value.
    expect(caretPos).toBeDefined();
    expect(caretPos).toEqual(jasmine.any(Number));
    expect(caretPos).toEqual(1);
  });

  it('Should properly adjust text caret placement when adding character literals', () => {
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const api = new SohoMaskAPI(settings);
    const textValue = '1234';
    const opts = {
      selection: {
        start: 4
      }
    };

    // Run the masking process
    const result = api.process(textValue, opts);

    // Run the caret adjustment
    const adjustCaretOpts = {
      previousMaskResult: '',
      previousPlaceholder: '',
      conformedValue: result.conformedValue,
      placeholder: result.placeholder,
      rawValue: textValue,
      caretPos: result.caretPos,
      placeholderChar: masks.PLACEHOLDER_CHAR,
      caretTrapIndexes: []
    };

    const caretPos = api.adjustCaretPosition(adjustCaretOpts);

    // Caret should have moved one index forward to account for the dash added
    expect(caretPos).toBeDefined();
    expect(caretPos).toEqual(jasmine.any(Number));
    expect(caretPos).toEqual(5);
  });

  // xit('Should be able to translate a string into a mask from an alternate locale', () => {
  // TODO: SOHO-6294
  // 1. Grab French currency locale?
  // 2. run _conformToMask_ directly with mask, etc
  // });
});
