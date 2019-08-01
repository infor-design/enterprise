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
      const tabsEl = await element(by.id('module-tabs-controls'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(tabsEl.isPresent()).toEqual(true);
      expect(await browser.protractorImageComparison.checkElement(tabsEl, 'tabs-module-spillover')).toEqual(0);
    });
  }
});
