const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Error page example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/error-page/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const mainEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(mainEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('error-page')).toEqual(0);
    });
  }

  fit('Should be able to set id/automations', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('error-page-content-id-1')).getAttribute('id')).toEqual('error-page-content-id-1');
    expect(await element(by.id('error-page-content-id-1')).getAttribute('data-automation-id')).toEqual('automation-id-errorpage-1');

    expect(await element(by.id('error-page-btn-id-1')).getAttribute('id')).toEqual('error-page-btn-id-1');
    expect(await element(by.id('error-page-btn-id-1')).getAttribute('data-automation-id')).toEqual('automation-id-errorpage-btn-1');
  });
});
