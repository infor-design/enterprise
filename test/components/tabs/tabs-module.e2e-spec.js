const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tabs Module Toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-toolbar-with-spillover?layout=nofrills');
    const tabsEl = await element(by.id('module-tabs-controls'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      await element(by.id('submit')).click();
      await element(by.id('submit')).click();
      await element(by.id('submit')).click();
      await element(by.id('submit')).click();

      expect(containerEl.isPresent()).toEqual(true);
      expect(await browser.protractorImageComparison.checkElement(containerEl, 'tabs-module-spillover')).toEqual(0);
    });
  }
});
