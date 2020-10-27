const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

let spinboxEl;
const spinboxId = 'regular-spinbox';

describe('Spinbox example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/spinbox/example-index');
    spinboxEl = await element(by.id(spinboxId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id(spinboxId))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const spinboxElWrapper = element(by.className('spinbox-wrapper'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(spinboxElWrapper), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(spinboxElWrapper, 'spinbox-init')).toEqual(0);
      await spinboxEl.sendKeys(protractor.Key.ARROW_UP);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.spinbox-wrapper.is-focused'))), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(spinboxElWrapper, 'spinbox-clicked')).toEqual(0);
    });
  }

  it('Should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('spinbox-id-1-wrapper')).getAttribute('id')).toEqual('spinbox-id-1-wrapper');
    expect(await element(by.id('spinbox-id-1-wrapper')).getAttribute('data-automation-id')).toEqual('spinbox-automation-id-1-wrapper');

    expect(await element(by.id('spinbox-id-1-spinbox')).getAttribute('id')).toEqual('spinbox-id-1-spinbox');
    expect(await element(by.id('spinbox-id-1-spinbox')).getAttribute('data-automation-id')).toEqual('spinbox-automation-id-1-spinbox');

    expect(await element(by.id('spinbox-id-1-btn-up')).getAttribute('id')).toEqual('spinbox-id-1-btn-up');
    expect(await element(by.id('spinbox-id-1-btn-up')).getAttribute('data-automation-id')).toEqual('spinbox-automation-id-1-btn-up');

    expect(await element(by.id('spinbox-id-1-btn-down')).getAttribute('id')).toEqual('spinbox-id-1-btn-down');
    expect(await element(by.id('spinbox-id-1-btn-down')).getAttribute('data-automation-id')).toEqual('spinbox-automation-id-1-btn-down');
  });

  it('Should be set with down arrow', async () => {
    await spinboxEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(spinboxEl), config.waitsFor);

    expect(await spinboxEl.getAttribute('value')).toEqual('0');
  });

  it('Should be set with up arrow', async () => {
    await spinboxEl.sendKeys(protractor.Key.ARROW_UP);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.spinbox-wrapper.is-focused'))), config.waitsFor);

    expect(await spinboxEl.getAttribute('value')).toEqual('1');
  });
});

describe('Spinbox Range Tests tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/spinbox/example-range-limits');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('limited-spinbox-2'))), config.waitsFor);
  });

  it('Should be able to type in range 100 to 200', async () => {
    await element(by.id('limited-spinbox-2')).clear();
    await element(by.id('limited-spinbox-2')).sendKeys('111');
    await element(by.id('limited-spinbox-2')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.id('limited-spinbox-2')).getAttribute('value')).toEqual('111');
  });

  it('Should be able to correct down', async () => {
    await element(by.id('limited-spinbox-2')).clear();
    await element(by.id('limited-spinbox-2')).sendKeys('50');
    await element(by.id('limited-spinbox-2')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.id('limited-spinbox-2')).getAttribute('value')).toEqual('100');
  });

  it('Should be able to correct up', async () => {
    await element(by.id('limited-spinbox-2')).clear();
    await element(by.id('limited-spinbox-2')).sendKeys('250');
    await element(by.id('limited-spinbox-2')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.id('limited-spinbox-2')).getAttribute('value')).toEqual('200');
  });

  it('Should be able to correct over', async () => {
    await element(by.id('limited-spinbox-2')).clear();
    await element(by.id('limited-spinbox-2')).sendKeys('999');
    await element(by.id('limited-spinbox-2')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.id('limited-spinbox-2')).getAttribute('value')).toEqual('200');
  });

  it('Should be able to correct text', async () => {
    await element(by.id('limited-spinbox-2')).clear();
    await element(by.id('limited-spinbox-2')).sendKeys('AA999');
    await element(by.id('limited-spinbox-2')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.id('limited-spinbox-2')).getAttribute('value')).toEqual('200');
  });
});
