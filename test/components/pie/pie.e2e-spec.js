const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Pie Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/pie/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('item-a')).getAttribute('id')).toEqual('item-a');
    expect(await element(by.id('item-a')).getAttribute('data-automation-id')).toEqual('item-a-automation-id');
    expect(await element(by.id('item-a-legend')).getAttribute('id')).toEqual('item-a-legend');
    expect(await element(by.id('item-a-legend')).getAttribute('data-automation-id')).toEqual('item-a-automation-id-legend');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'pie')).toEqual(0);
    });
  }
});
