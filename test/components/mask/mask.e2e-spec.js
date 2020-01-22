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
