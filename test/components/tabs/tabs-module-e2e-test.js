const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Tabs Module Toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-index?theme=classic&layout=nofrills');
    const tabsEl = await element(by.id('module-tabs-controls'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-index', async () => {
      const containerEl = await element(by.css('.page-container.no-scroll:not(.tab-panel-container)'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'tabs-module')).toEqual(0);
    });
  }
});

describe('Tabs Module Appmenu Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-app-menu-button-audible.html?theme=classic&layout=nofrills');
    const tabsEl = await element(by.id('module-tabs-example'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress and still be accessible', async () => {
      const appMenuTrigger = await element(by.css('.tab.application-menu-trigger'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(appMenuTrigger, 'tabs-module-appmenu-trigger-audible')).toEqual(0);
      expect(appMenuTrigger.getText()).toBe('Menu');
    });
  }
});

describe('Tabs Module (rename API)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/test-lsf-addtabs-scenario-2');
    const tabsEl = await element(by.id('module-tabs-example'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  // Tests infor-design/enterprise#5105
  it('should rename the "More Tabs" menu link corresponding to a renamed tab', async () => {
    await element(by.css('.add-tab-button')).click();
    await element(by.css('.add-tab-button')).click();
    expect(await element(by.css('[href="#new-tab-1"]')).getText()).toEqual('1 Tab');
  });
});
