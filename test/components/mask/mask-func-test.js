/**
 * @jest-environment jsdom
 */
import { MaskAPI } from '../../../src/components/mask/mask-api';
import { masks } from '../../../src/components/mask/masks';
import { Locale } from '../../../src/components/locale/locale';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');

describe('Mask API', () => {
  const DEFAULT_SETTINGS = {
    process: undefined,
    pipe: undefined
  };

  it.skip('Can be invoked', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    expect(api).toBeTruthy();
    expect(api).toBeTruthy();

    expect(window.Soho.components.MaskInput).toBeTruthy();

    // Check default settings
    expect(api.settings).toBeTruthy();
    expect(api.settings).toBeTruthy();

    // has basic functions
    expect(api.configure).toBeTruthy();
    expect(api.process).toBeTruthy();
  });

  it('should convert a legacy Soho pattern mask to an array', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);
    const maskDefinitions = masks.LEGACY_DEFS;

    // Credit Cards
    // eslint-disable-next-line no-underscore-dangle
    let result = api._convertPatternFromString('####-####-####-####', maskDefinitions);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.length).toEqual(19);

    // U.S. Phone Number
    // eslint-disable-next-line no-underscore-dangle
    result = api._convertPatternFromString('(###) ###-####', maskDefinitions);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.length).toEqual(14);
  });

  it('can convert a mask array into a placeholder array', () => {
    // Placeholder masks are used internally to figure out placement positions, and can be
    // used visually as the guide inside of an input field.
    const api = new MaskAPI(DEFAULT_SETTINGS);
    const mask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    // eslint-disable-next-line no-underscore-dangle
    const result = api._convertMaskToPlaceholder(mask, masks.PLACEHOLDER_CHAR);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result).toEqual('____-____-____-____');
  });

  it('should process patterns', () => {
    // Checks a basic "credit card" pattern mask
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const text = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
    const api = new MaskAPI(settings);
    const opts = {
      selection: {
        start: 0
      }
    };

    const result = api.process(text, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('0123-4567-8901-2345');
  });

  it('should properly identify caret traps in a pattern array', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);
    const caretTrap = masks.CARET_TRAP;
    const testMask = [/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, caretTrap, '.', caretTrap, /\d/, /\d/];

    // eslint-disable-next-line no-underscore-dangle
    const result = api._processCaretTraps(testMask);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();

    expect(result.maskWithoutCaretTraps).toBeTruthy();
    expect(result.indexes).toBeTruthy();
  });

  it('should retains text caret locations in simple mask results', () => {
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    const api = new MaskAPI(DEFAULT_SETTINGS);
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
    expect(caretPos).toBeTruthy();
    expect(caretPos).toBeTruthy();
    expect(caretPos).toEqual(1);
  });

  it('should properly adjust text caret placement when adding character literals', () => {
    const settings = DEFAULT_SETTINGS;
    settings.pattern = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const api = new MaskAPI(settings);
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
    expect(caretPos).toBeTruthy();
    expect(caretPos).toBeTruthy();
    expect(caretPos).toEqual(5);
  });

  /*
   *it('should be able to translate a string into a mask from an alternate locale', () => {
   *  TODO: SOHO-6294
   *  1. Grab French currency locale?
   *  2. run _conformToMask_ directly with mask, etc
   *});
   */
});

describe('Number Mask API', () => {
  const DEFAULT_SETTINGS = {
    process: 'number',
    pattern: masks.numberMask,
    pipe: undefined
  };

  it('should convert legacy settings to current settings', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowLeadingZeros: true, // should be `allowLeadingZeros`
        allowThousands: true,
        allowDecimal: true,
        allowNegative: true,
        integerLimit: 10,
        decimalLimit: 3,
        locale: 'en-US'
      }
    };

    const textValue = '00000.123';
    const result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('00000.123');
  });

  it('should process numbers', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    // Handle big numbers with thousands separators
    let textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        locale: 'en-US',
        allowThousands: true,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
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

  it('should process arabic numbers', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    // Handle big numbers with thousands separators
    let textValue = '١٢٣٤٥٦٧٨٩٠';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '١٢٣٤٥٦٧٨٩٠.٣٣';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠.٣٣');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-١٢٣٤٥٦٧٨٩٠.٥٥';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-١٢٣٤٥٦٧٨٩٠.٥٥');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '١٢٣٤';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣%');
  });

  it('should process hindi (devanagari) numbers', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        locale: 'hi-ID',
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('१२३४५६७८९०');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३४५६७८९०.११');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-१२३४५६७८९०.११');
  });

  it('should process hindi (devanagari) numbers with a percentage', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        locale: 'hi-ID',
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '१२३४';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३%');

    // Block letters on numbers
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = 'ोवमा';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('%');
  });

  it('should process chinese (financial) numbers', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    const textValue = '壹贰叁肆伍陆柒';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('壹贰叁肆伍陆柒');
  });

  it('should process chinese (normal) numbers', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    const textValue = '一二三四五六七七九';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('一二三四五六七七九');
  });

  it('should process number masks with leading zeros', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    // Handle big numbers with thousands separators
    let textValue = '00001';
    const opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        allowLeadingZeros: true,
        allowThousands: true,
        allowDecimal: true,
        allowNegative: true,
        integerLimit: 10,
        decimalLimit: 3,
        locale: 'en-US'
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.conformedValue).toBeTruthy();
    expect(result.conformedValue).toEqual('00001');

    textValue = '10000';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000');

    textValue = '00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('00000.123');

    textValue = '10000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.123');

    textValue = '10000.100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.100');

    textValue = '-00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-00000.123');
  });
});

describe('Date Mask API', () => {
  const DEFAULT_SETTINGS = {
    process: 'date',
    pattern: masks.dateMask,
    pipe: undefined
  };

  it('should process short dates', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

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

    expect(result.maskResult).toBeTruthy();
    expect(result.conformedValue).toEqual('11/11/1111');
  });

  it('should process short dates with no separators or other literals present', () => {
    const api = new MaskAPI(DEFAULT_SETTINGS);

    const textValue = '12122012';
    let opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        format: 'ddMMyyyy'
      }
    };
    let result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('12122012');

    opts = {
      selection: {
        start: 0
      },
      patternOptions: {
        format: 'Mdyyyy'
      }
    };
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('12122012');
  });
});
