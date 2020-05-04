const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Popover Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popover/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display on click', async () => {
    await element(by.id('popover-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popover'))), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('.popover')).isDisplayed()).toBeTruthy();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.id('popover-trigger')).click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popover'))), config.waitsFor);
      await utils.checkForErrors();

      const popoverEl = await element(by.className('popover'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(popoverEl, 'popover-index')).toEqual(0);
    });
  }
});
