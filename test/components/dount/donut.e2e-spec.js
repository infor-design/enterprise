const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Donut Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/donut/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('comp-a')).getAttribute('id')).toEqual('comp-a');
    expect(await element(by.id('comp-a')).getAttribute('data-automation-id')).toEqual('comp-a-automation-id');
    expect(await element(by.id('comp-a-legend')).getAttribute('id')).toEqual('comp-a-legend');
    expect(await element(by.id('comp-a-legend')).getAttribute('data-automation-id')).toEqual('comp-a-automation-id-legend');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'donut')).toEqual(0);
    });
  }
});

describe('Donut Chart alerts tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/donut/example-alerts?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'donut-alerts')).toEqual(0);
    });
  }
});
