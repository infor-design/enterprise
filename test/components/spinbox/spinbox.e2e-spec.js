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
