const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tabs Module Toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-index?layout=nofrills');
    const tabsEl = await element(by.id('module-tabs-controls'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const containerEl = await element(by.css('.page-container.no-scroll:not(.tab-panel-container)'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'tabs-module')).toEqual(0);
    });
  }
});

fdescribe('Tabs Module Appmenu Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-app-menu-button-audible.html?layout=nofrills');
    const tabsEl = await element(by.id('module-tabs-example'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress and still be accessible', async () => {
      const appMenuTrigger = await element(by.css('.tab.application-menu-trigger'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(appMenuTrigger, 'tabs-module-appmenu-trigger-audible')).toEqual(0);
      expect(appMenuTrigger.getText()).toBe('Menu');
    });
  }
});
