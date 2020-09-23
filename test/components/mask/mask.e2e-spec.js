const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const inputId = 'percentage-field';

describe('Mask Percent Format Tests', () => {
  it('Should be type in en-US', async () => {
    await utils.setPage('/components/mask/test-percent-locale');
    const inputEl = await element(by.id(inputId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    await inputEl.clear();
    await inputEl.sendKeys('100');

    expect(await inputEl.getAttribute('value')).toEqual('100 %');
  });

  it('Should be type in tr-TR', async () => {
    await utils.setPage('/components/mask/test-percent-locale?locale=tr-TR');
    const inputEl = await element(by.id(inputId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await browser.driver.sleep(config.sleepShort);

    await inputEl.clear();
    await inputEl.sendKeys('100');

    expect(await inputEl.getAttribute('value')).toEqual('%100');
  });

  it('Should be type in ar-SA', async () => {
    await utils.setPage('/components/mask/test-percent-locale?locale=ar-SA');
    const inputEl = await element(by.id(inputId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await browser.driver.sleep(config.sleepShort);

    await inputEl.clear();
    await inputEl.sendKeys('100');

    expect(await inputEl.getAttribute('value')).toEqual('100 ٪');
  });

  it('Should be able to type in fr-FR', async () => {
    await utils.setPage('/components/mask/test-number-mask-gauntlet.html?locale=fr-FR');
    let inputEl = await element(by.id('number-dec-thousands'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await browser.driver.sleep(config.sleepShort);

    await inputEl.clear();
    await inputEl.sendKeys('1234,');

    expect(await inputEl.getAttribute('value')).toEqual('1 234,');

    inputEl = await element(by.id('longer-number-dec-thousands'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await browser.driver.sleep(config.sleepShort);

    await inputEl.clear();
    await inputEl.sendKeys('1234567,');

    expect(await inputEl.getAttribute('value')).toEqual('1 234 567,');

    inputEl = await element(by.id('way-longer-number-dec-thousands'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await browser.driver.sleep(config.sleepShort);

    await inputEl.clear();
    await inputEl.sendKeys('1234567890,');

    expect(await inputEl.getAttribute('value')).toEqual('1 234 567 890,');
  });
});

describe('Number Masks', () => {
  it('should correctly format on `input[type="number"]` fields', async () => {
    await utils.setPage('/components/mask/test-input-type-numeric');
    const inputEl = await element(by.id('test-input'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    await inputEl.clear();
    await inputEl.sendKeys('123.45');

    expect(await inputEl.getAttribute('value')).toEqual('123.45');

    await inputEl.clear();
    await inputEl.sendKeys('777777777777'); // 12

    expect(await inputEl.getAttribute('value')).toEqual('7777777'); // 7

    await (utils.checkForErrors());
  });
});

describe('Date Masks', () => {
  fit('allows removal and re-entry of all characters in a section with keyboard input', async () => {
    await utils.setPage('/components/mask/test-date-with-validation');
    const inputEl = await element(by.id('date'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    // Input date without leading zeros in day/month
    await inputEl.clear();
    await inputEl.sendKeys('1/1/2020');

    debugger;

    expect(await inputEl.getAttribute('value')).toEqual('1/1/2020');

    // Use the arrow keys to navigate back 5 characters (just before the second "1"),
    // then shift + arrow over the "1" to highlight it, then backspace to remove the "1".
    // Both slashes should be retained.
    await browser.actions()
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .keyDown(protractor.Key.SHIFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .keyUp(protractor.Key.SHIFT)
      .sendKeys(protractor.Key.BACK_SPACE)
      .perform();

    debugger;

    expect(await inputEl.getAttribute('value')).toEqual('1//2020');

    // Insert a new set of numbers between the slashes.
    // The leading zero should be respected.
    await inputEl.sendKeys('02');

    debugger;

    expect(await inputEl.getAttribute('value')).toEqual('1/02/2020');

    // Arrow to just after the first "1", backspace to remove it.
    // The first character in the field should be a "/" but this is temporary.
    await browser.actions()
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.ARROW_LEFT)
      .sendKeys(protractor.Key.BACK_SPACE)
      .perform();

    expect(await inputEl.getAttribute('value')).toEqual('/02/2020');

    // Add a leading zero plus the first number
    await inputEl.sendKeys('01');

    expect(await inputEl.getAttribute('value')).toEqual('01/02/2020');

    // Navigate with the keyboard to after the first slash, highlight the "02", and press "1".
    // Even though the formatting is off, "01/1/2020" is a valid date and can exist in the mask.
    await browser.actions()
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .keyDown(protractor.Key.SHIFT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .keyUp(protractor.Key.SHIFT)
      .sendKeys('1')
      .perform();

    expect(await inputEl.getAttribute('value')).toEqual('01/1/2020');

    // Try another couple weird dates for good measure (both of these failed when testing #4079)
    // Input date without leading zeros in day/month.
    await inputEl.clear();
    await inputEl.sendKeys('10/1/2018');

    expect(await inputEl.getAttribute('value')).toEqual('10/1/2018');

    await inputEl.clear();
    await inputEl.sendKeys('5/2/2015');

    expect(await inputEl.getAttribute('value')).toEqual('5/2/2015');
  });
});
