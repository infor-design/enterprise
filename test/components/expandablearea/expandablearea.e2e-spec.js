const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Expandable Area Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/expandablearea/example-index?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('expandable-expander'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to toggle', async () => {
    const pane = await element(by.id('expandable-area-0-content'));
    const trigger = await element.all(by.className('expandable-expander')).first();

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'expandablearea-index')).toEqual(0);
    });
  }
});

describe('Expandable Custom Toggle Button Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/expandablearea/test-toggle-button?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.className('expandable-pane'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to toggle', async () => {
    const pane = await element(by.id('expandable-area-0-content'));
    const trigger = await element(by.id('trigger-btn'));

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'expandablearea-toggle')).toEqual(0);
    });
  }
});
