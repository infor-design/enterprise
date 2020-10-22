const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Positive Negative Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/positive-negative/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('positive-negative-jan-target-bar')).getAttribute('id')).toEqual('positive-negative-jan-target-bar');
    expect(await element(by.id('positive-negative-jan-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jan-target-bar');
    expect(await element(by.id('positive-negative-feb-target-bar')).getAttribute('id')).toEqual('positive-negative-feb-target-bar');
    expect(await element(by.id('positive-negative-feb-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-feb-target-bar');
    expect(await element(by.id('positive-negative-mar-target-bar')).getAttribute('id')).toEqual('positive-negative-mar-target-bar');
    expect(await element(by.id('positive-negative-mar-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-mar-target-bar');
    expect(await element(by.id('positive-negative-apr-target-bar')).getAttribute('id')).toEqual('positive-negative-apr-target-bar');
    expect(await element(by.id('positive-negative-apr-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-apr-target-bar');
    expect(await element(by.id('positive-negative-may-target-bar')).getAttribute('id')).toEqual('positive-negative-may-target-bar');
    expect(await element(by.id('positive-negative-may-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-may-target-bar');
    expect(await element(by.id('positive-negative-jun-target-bar')).getAttribute('id')).toEqual('positive-negative-jun-target-bar');
    expect(await element(by.id('positive-negative-jun-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jun-target-bar');
    expect(await element(by.id('positive-negative-jul-target-bar')).getAttribute('id')).toEqual('positive-negative-jul-target-bar');
    expect(await element(by.id('positive-negative-jul-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jul-target-bar');
    expect(await element(by.id('positive-negative-aug-target-bar')).getAttribute('id')).toEqual('positive-negative-aug-target-bar');
    expect(await element(by.id('positive-negative-aug-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-aug-target-bar');
    expect(await element(by.id('positive-negative-sep-target-bar')).getAttribute('id')).toEqual('positive-negative-sep-target-bar');
    expect(await element(by.id('positive-negative-sep-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-sep-target-bar');
    expect(await element(by.id('positive-negative-oct-target-bar')).getAttribute('id')).toEqual('positive-negative-oct-target-bar');
    expect(await element(by.id('positive-negative-oct-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-oct-target-bar');
    expect(await element(by.id('positive-negative-nov-target-bar')).getAttribute('id')).toEqual('positive-negative-nov-target-bar');
    expect(await element(by.id('positive-negative-nov-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-nov-target-bar');
    expect(await element(by.id('positive-negative-dec-target-bar')).getAttribute('id')).toEqual('positive-negative-dec-target-bar');
    expect(await element(by.id('positive-negative-dec-target-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-dec-target-bar');

    expect(await element(by.id('positive-negative-jan-bar')).getAttribute('id')).toEqual('positive-negative-jan-bar');
    expect(await element(by.id('positive-negative-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jan-bar');
    expect(await element(by.id('positive-negative-feb-bar')).getAttribute('id')).toEqual('positive-negative-feb-bar');
    expect(await element(by.id('positive-negative-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-feb-bar');
    expect(await element(by.id('positive-negative-mar-bar')).getAttribute('id')).toEqual('positive-negative-mar-bar');
    expect(await element(by.id('positive-negative-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-mar-bar');
    expect(await element(by.id('positive-negative-apr-bar')).getAttribute('id')).toEqual('positive-negative-apr-bar');
    expect(await element(by.id('positive-negative-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-apr-bar');
    expect(await element(by.id('positive-negative-may-bar')).getAttribute('id')).toEqual('positive-negative-may-bar');
    expect(await element(by.id('positive-negative-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-may-bar');
    expect(await element(by.id('positive-negative-jun-bar')).getAttribute('id')).toEqual('positive-negative-jun-bar');
    expect(await element(by.id('positive-negative-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jun-bar');
    expect(await element(by.id('positive-negative-jul-bar')).getAttribute('id')).toEqual('positive-negative-jul-bar');
    expect(await element(by.id('positive-negative-jul-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-jul-bar');
    expect(await element(by.id('positive-negative-aug-bar')).getAttribute('id')).toEqual('positive-negative-aug-bar');
    expect(await element(by.id('positive-negative-aug-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-aug-bar');
    expect(await element(by.id('positive-negative-sep-bar')).getAttribute('id')).toEqual('positive-negative-sep-bar');
    expect(await element(by.id('positive-negative-sep-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-sep-bar');
    expect(await element(by.id('positive-negative-oct-bar')).getAttribute('id')).toEqual('positive-negative-oct-bar');
    expect(await element(by.id('positive-negative-oct-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-oct-bar');
    expect(await element(by.id('positive-negative-nov-bar')).getAttribute('id')).toEqual('positive-negative-nov-bar');
    expect(await element(by.id('positive-negative-nov-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-nov-bar');
    expect(await element(by.id('positive-negative-dec-bar')).getAttribute('id')).toEqual('positive-negative-dec-bar');
    expect(await element(by.id('positive-negative-dec-bar')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-dec-bar');

    expect(await element(by.id('positive-negative-revenue-legend')).getAttribute('id')).toEqual('positive-negative-revenue-legend');
    expect(await element(by.id('positive-negative-revenue-legend')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-revenue-legend');

    expect(await element(by.id('positive-negative-profit-legend')).getAttribute('id')).toEqual('positive-negative-profit-legend');
    expect(await element(by.id('positive-negative-profit-legend')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-profit-legend');

    expect(await element(by.id('positive-negative-loss-legend')).getAttribute('id')).toEqual('positive-negative-loss-legend');
    expect(await element(by.id('positive-negative-loss-legend')).getAttribute('data-automation-id')).toEqual('automation-id-positive-negative-loss-legend');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'positive-negative')).toEqual(0);
    });
  }
});
