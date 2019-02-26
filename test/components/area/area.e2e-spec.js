const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Area empty tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/area/test-empty');
  });

  it('Should show the empty area', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.empty-message'))), config.waitsFor);

    expect(await element(by.css('.empty-message'))).toBeTruthy();
    expect(await element(by.css('.empty-title')).getText()).toEqual('No Data Available');
  });
});
