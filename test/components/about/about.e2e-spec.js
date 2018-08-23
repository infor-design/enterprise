const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('About index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/about/example-index');
  });

  it('Should show the about dialog', async () => {
    const buttonEl = await element(by.id('about-trigger'));
    buttonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('about-modal'))), config.waitsFor);

    expect(await element(by.id('about-modal')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});
