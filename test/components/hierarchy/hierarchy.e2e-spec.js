const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Hierarchy index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hierarchy/example-index');
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
});
