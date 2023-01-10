/* eslint-disable no-underscore-dangle */
require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/fr-FR.js');

describe('Mask Input Field Api', () => {
  let TEST_INPUT = null;
  let TEST_COMPONENT_API = null;
  const Locale = window.Soho.Locale;

  beforeAll(() => {
    // Setup the input field used for this test suite
    TEST_INPUT = document.createElement('input');
    TEST_INPUT.setAttribute('type', 'text');
    TEST_INPUT.setAttribute('id', 'masked');
    document.body.appendChild(TEST_INPUT);
    Locale.getLocale('ar-EG');
    Locale.getLocale('fr-FR');
    Locale.set('en-US');
  });

  beforeEach(() => {
    Locale.set('en-US');
  });

  it('should pass a basic confidence test', () => {
    expect(window.Soho).toBeDefined();
    expect(window.Soho.masks).toBeDefined();
    expect(window.Soho.components.MaskInput).toBeDefined();
  });

  it('should be invokable', () => {
    TEST_COMPONENT_API = new window.Soho.components.MaskInput(TEST_INPUT);
    const api = TEST_COMPONENT_API;

    expect(api).toBeDefined();
    expect(window.Soho.components.MaskInput).toBeDefined();

    // Check default settings
    expect(api.settings).toBeTruthy();
    expect(api.settings.maskAPI).toBeDefined();
  });

  it('should handle translation of deprecated settings', () => {
    // TODO: Check deprecated time settings
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'weird-settings');

    // deprecated date settings
    input.setAttribute('data-mask-mode', 'date');
    input.setAttribute('data-must-complete', 'true');

    const inputComponent = new window.Soho.components.MaskInput(input);

    expect(inputComponent.settings).toBeDefined();
    expect(inputComponent.settings).toBeTruthy();
    expect(inputComponent.settings.process).toBeDefined();
  });

  it('should be able to safely get a string value from an input field', () => {
    // Test `_getSafeRawValue()_`
    TEST_COMPONENT_API = new window.Soho.components.MaskInput(TEST_INPUT);

    expect(TEST_COMPONENT_API._getSafeRawValue('straight up text')).toEqual('straight up text');
    expect(TEST_COMPONENT_API._getSafeRawValue(300)).toEqual('300');
    expect(TEST_COMPONENT_API._getSafeRawValue(`${300}4545`)).toEqual('3004545');
    expect(TEST_COMPONENT_API._getSafeRawValue(null)).toEqual('');
    expect(TEST_COMPONENT_API._getSafeRawValue(undefined)).toEqual('');
  });

  it('should properly initialize with a value present', () => {
    // From SOHO-6293
    // `input1/inputComponent1` are a basic pattern-masked input with a value
    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'preset-text');
    input1.setAttribute('value', '1234567890');

    const inputComponent1 = new window.Soho.components.MaskInput(input1, {
      pattern: '(###) ###-####'
    });

    expect(inputComponent1.settings.pattern).toBeDefined();
    expect(input1.value).toEqual('(123) 456-7890');

    // `input2/inputComponent2` is a number mask
    const input2 = document.createElement('input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('id', 'preset-number-dec');
    input2.setAttribute('value', '1234567890');

    const inputComponent2 = new window.Soho.components.MaskInput(input2, {
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

    expect(inputComponent2.settings.patternOptions).toBeDefined();
    expect(inputComponent2.settings.patternOptions.integerLimit).toBeDefined();
    expect(inputComponent2.settings.patternOptions.integerLimit).toEqual(7);

    expect(inputComponent2.settings.patternOptions.decimalLimit).toBeDefined();
    expect(inputComponent2.settings.patternOptions.decimalLimit).toEqual(0);

    expect(inputComponent2.settings.patternOptions.allowThousands).toBeDefined();
    expect(inputComponent2.settings.patternOptions.allowThousands).toEqual(true);

    expect(input2.value).toEqual('1,234,567');

    // `input3/inputComponent3` is a number mask with decimals (tests SOHO-6293)
    const input3 = document.createElement('input');
    input3.setAttribute('type', 'text');
    input3.setAttribute('id', 'preset-number-dec');
    input3.setAttribute('value', '-5555.33');

    const inputComponent3 = new window.Soho.components.MaskInput(input3, {
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

    expect(inputComponent3.settings.patternOptions.allowNegative).toEqual(true);
    expect(inputComponent3.settings.patternOptions.allowDecimal).toEqual(true);
    expect(input3.value).toEqual('-5,555.33');
  });

  it('should be able to handle alternate characters for decimal, comma, and currency symbol)', () => {
    Locale.set('fr-FR');
    // From SOHO-4744 - We simulates the french locale (fr-FR)
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'french-text');
    input.setAttribute('value', '5333,66');

    const inputComponent = new window.Soho.components.MaskInput(input, {
      locale: 'fr-FR',
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

    expect(inputComponent.settings.patternOptions.symbols).toBeDefined();
    expect(inputComponent.settings.patternOptions.symbols.decimal).toEqual(',');
    expect(inputComponent.settings.patternOptions.symbols.thousands).toEqual(' ');
    expect(inputComponent.settings.patternOptions.symbols.currency).toEqual('€');
    expect(['5 333,66 €', '5 333,66 €']).toContain(input.value);
  });

  it('should display reversed prefix/suffix when in RTL mode', () => {
    Locale.set('ar-EG');
    // From  (SOHO-3259)
    // simulates locale 'ar-EG'
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'rtl');
    input.setAttribute('value', '123456789');

    const inputComponent = new window.Soho.components.MaskInput(input, {
      locale: 'ar-EG',
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

    expect(inputComponent.settings.patternOptions.symbols).toBeDefined();
    expect(inputComponent.settings.patternOptions.symbols.thousands).toEqual('٬');
    expect(inputComponent.settings.patternOptions.symbols.negative).toEqual('-');
    expect(input.value).toEqual('1٬234٬567-');
  });
});
