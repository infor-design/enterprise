const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Hierarchy index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hierarchy/example-index?nofrills=true');
  });

  it('Should Render', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('hierarchy'))), config.waitsFor);

    expect(await element(by.id('hierarchy')).isDisplayed()).toBeTruthy();
    expect(await element.all(by.css('.leaf')).count()).toEqual(27);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const pageContainerEl = await element(by.className('page-container'));
      await browser.driver.sleep(config.waitsFor);

      expect(await browser.protractorImageComparison.checkElement(pageContainerEl, 'hierarchy-index')).toEqual(0);
    });
  }
});
