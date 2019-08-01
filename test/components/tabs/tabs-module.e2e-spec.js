const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickTabTest = async (index) => {
  const tabElTrigger = await element.all(by.className('tab')).get(index);
  await tabElTrigger.click();
  await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(element.all(by.className('tab-panel')).get(index)), config.waitsFor);

  expect(await element.all(by.className('tab-panel')).get(index).getAttribute('class')).toContain('can-show');
  expect(await element.all(by.className('tab')).get(index).getAttribute('class')).toContain('is-selected');
};

fdescribe('Tabs Module Toolbar tests', () => { //eslint-disable-line
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
