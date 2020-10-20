const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Treemap example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/treemap/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('custom-id')).getAttribute('id')).toEqual('custom-id');
    expect(await element(by.id('custom-id')).getAttribute('data-automation-id')).toEqual('custom-automation-id');
    expect(await element(by.id('custom-id-json')).getAttribute('id')).toEqual('custom-id-json');
    expect(await element(by.id('custom-id-json')).getAttribute('data-automation-id')).toEqual('custom-automation-id-json');
    expect(await element(by.id('custom-id-others')).getAttribute('id')).toEqual('custom-id-others');
    expect(await element(by.id('custom-id-others')).getAttribute('data-automation-id')).toEqual('custom-automation-id-others');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('treemap')).toEqual(0);
    });
  }
});
