const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bubble example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bubble/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('bubble')).toEqual(0);
    });
  }

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('bubble-s1-jan-dot')).getAttribute('id')).toEqual('bubble-s1-jan-dot');
    expect(await element(by.id('bubble-s1-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-jan-dot');
    expect(await element(by.id('bubble-s1-feb-dot')).getAttribute('id')).toEqual('bubble-s1-feb-dot');
    expect(await element(by.id('bubble-s1-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-feb-dot');
    expect(await element(by.id('bubble-s1-mar-dot')).getAttribute('id')).toEqual('bubble-s1-mar-dot');
    expect(await element(by.id('bubble-s1-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-mar-dot');
    expect(await element(by.id('bubble-s1-apr-dot')).getAttribute('id')).toEqual('bubble-s1-apr-dot');
    expect(await element(by.id('bubble-s1-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-apr-dot');
    expect(await element(by.id('bubble-s1-may-dot')).getAttribute('id')).toEqual('bubble-s1-may-dot');
    expect(await element(by.id('bubble-s1-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-may-dot');
    expect(await element(by.id('bubble-s1-jun-dot')).getAttribute('id')).toEqual('bubble-s1-jun-dot');
    expect(await element(by.id('bubble-s1-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-jun-dot');
    expect(await element(by.id('bubble-s1-jul-dot')).getAttribute('id')).toEqual('bubble-s1-jul-dot');
    expect(await element(by.id('bubble-s1-jul-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-jul-dot');
    expect(await element(by.id('bubble-s1-aug-dot')).getAttribute('id')).toEqual('bubble-s1-aug-dot');
    expect(await element(by.id('bubble-s1-aug-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-aug-dot');
    expect(await element(by.id('bubble-s1-sep-dot')).getAttribute('id')).toEqual('bubble-s1-sep-dot');
    expect(await element(by.id('bubble-s1-sep-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-sep-dot');
    expect(await element(by.id('bubble-s1-oct-dot')).getAttribute('id')).toEqual('bubble-s1-oct-dot');
    expect(await element(by.id('bubble-s1-oct-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-oct-dot');
    expect(await element(by.id('bubble-s1-nov-dot')).getAttribute('id')).toEqual('bubble-s1-nov-dot');
    expect(await element(by.id('bubble-s1-nov-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-nov-dot');
    expect(await element(by.id('bubble-s1-dec-dot')).getAttribute('id')).toEqual('bubble-s1-dec-dot');
    expect(await element(by.id('bubble-s1-dec-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s1-dec-dot');

    expect(await element(by.id('bubble-s2-jan-dot')).getAttribute('id')).toEqual('bubble-s2-jan-dot');
    expect(await element(by.id('bubble-s2-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-jan-dot');
    expect(await element(by.id('bubble-s2-feb-dot')).getAttribute('id')).toEqual('bubble-s2-feb-dot');
    expect(await element(by.id('bubble-s2-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-feb-dot');
    expect(await element(by.id('bubble-s2-mar-dot')).getAttribute('id')).toEqual('bubble-s2-mar-dot');
    expect(await element(by.id('bubble-s2-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-mar-dot');
    expect(await element(by.id('bubble-s2-apr-dot')).getAttribute('id')).toEqual('bubble-s2-apr-dot');
    expect(await element(by.id('bubble-s2-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-apr-dot');
    expect(await element(by.id('bubble-s2-may-dot')).getAttribute('id')).toEqual('bubble-s2-may-dot');
    expect(await element(by.id('bubble-s2-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-may-dot');
    expect(await element(by.id('bubble-s2-jun-dot')).getAttribute('id')).toEqual('bubble-s2-jun-dot');
    expect(await element(by.id('bubble-s2-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-jun-dot');
    expect(await element(by.id('bubble-s2-jul-dot')).getAttribute('id')).toEqual('bubble-s2-jul-dot');
    expect(await element(by.id('bubble-s2-jul-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-jul-dot');
    expect(await element(by.id('bubble-s2-aug-dot')).getAttribute('id')).toEqual('bubble-s2-aug-dot');
    expect(await element(by.id('bubble-s2-aug-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-aug-dot');
    expect(await element(by.id('bubble-s2-sep-dot')).getAttribute('id')).toEqual('bubble-s2-sep-dot');
    expect(await element(by.id('bubble-s2-sep-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-sep-dot');
    expect(await element(by.id('bubble-s2-oct-dot')).getAttribute('id')).toEqual('bubble-s2-oct-dot');
    expect(await element(by.id('bubble-s2-oct-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-oct-dot');
    expect(await element(by.id('bubble-s2-nov-dot')).getAttribute('id')).toEqual('bubble-s2-nov-dot');
    expect(await element(by.id('bubble-s2-nov-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-nov-dot');
    expect(await element(by.id('bubble-s2-dec-dot')).getAttribute('id')).toEqual('bubble-s2-dec-dot');
    expect(await element(by.id('bubble-s2-dec-dot')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-s2-dec-dot');

    expect(await element(by.id('bubble-series1-line')).getAttribute('id')).toEqual('bubble-series1-line');
    expect(await element(by.id('bubble-series1-line')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-series1-line');
    expect(await element(by.id('bubble-series2-line')).getAttribute('id')).toEqual('bubble-series2-line');
    expect(await element(by.id('bubble-series2-line')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-series2-line');

    expect(await element(by.id('bubble-series1-legend-0')).getAttribute('id')).toEqual('bubble-series1-legend-0');
    expect(await element(by.id('bubble-series1-legend-0')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-series1-legend-0');
    expect(await element(by.id('bubble-series2-legend-1')).getAttribute('id')).toEqual('bubble-series2-legend-1');
    expect(await element(by.id('bubble-series2-legend-1')).getAttribute('data-automation-id')).toEqual('automation-id-bubble-series2-legend-1');
  });
});
