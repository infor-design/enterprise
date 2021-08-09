const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Scatterplot Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/scatterplot/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('scatterplot-s1-jan-symbol')).getAttribute('id')).toEqual('scatterplot-s1-jan-symbol');
    expect(await element(by.id('scatterplot-s1-jan-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-jan-symbol');
    expect(await element(by.id('scatterplot-s1-feb-symbol')).getAttribute('id')).toEqual('scatterplot-s1-feb-symbol');
    expect(await element(by.id('scatterplot-s1-feb-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-feb-symbol');
    expect(await element(by.id('scatterplot-s1-mar-symbol')).getAttribute('id')).toEqual('scatterplot-s1-mar-symbol');
    expect(await element(by.id('scatterplot-s1-mar-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-mar-symbol');
    expect(await element(by.id('scatterplot-s1-apr-symbol')).getAttribute('id')).toEqual('scatterplot-s1-apr-symbol');
    expect(await element(by.id('scatterplot-s1-apr-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-apr-symbol');
    expect(await element(by.id('scatterplot-s1-may-symbol')).getAttribute('id')).toEqual('scatterplot-s1-may-symbol');
    expect(await element(by.id('scatterplot-s1-may-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-may-symbol');
    expect(await element(by.id('scatterplot-s1-jun-symbol')).getAttribute('id')).toEqual('scatterplot-s1-jun-symbol');
    expect(await element(by.id('scatterplot-s1-jun-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-jun-symbol');
    expect(await element(by.id('scatterplot-s1-jul-symbol')).getAttribute('id')).toEqual('scatterplot-s1-jul-symbol');
    expect(await element(by.id('scatterplot-s1-jul-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-jul-symbol');
    expect(await element(by.id('scatterplot-s1-aug-symbol')).getAttribute('id')).toEqual('scatterplot-s1-aug-symbol');
    expect(await element(by.id('scatterplot-s1-aug-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-aug-symbol');
    expect(await element(by.id('scatterplot-s1-sep-symbol')).getAttribute('id')).toEqual('scatterplot-s1-sep-symbol');
    expect(await element(by.id('scatterplot-s1-sep-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-sep-symbol');
    expect(await element(by.id('scatterplot-s1-oct-symbol')).getAttribute('id')).toEqual('scatterplot-s1-oct-symbol');
    expect(await element(by.id('scatterplot-s1-oct-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-oct-symbol');
    expect(await element(by.id('scatterplot-s1-nov-symbol')).getAttribute('id')).toEqual('scatterplot-s1-nov-symbol');
    expect(await element(by.id('scatterplot-s1-nov-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-nov-symbol');
    expect(await element(by.id('scatterplot-s1-dec-symbol')).getAttribute('id')).toEqual('scatterplot-s1-dec-symbol');
    expect(await element(by.id('scatterplot-s1-dec-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s1-dec-symbol');
    expect(await element(by.id('scatterplot-s2-jan-symbol')).getAttribute('id')).toEqual('scatterplot-s2-jan-symbol');
    expect(await element(by.id('scatterplot-s2-jan-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-jan-symbol');
    expect(await element(by.id('scatterplot-s2-feb-symbol')).getAttribute('id')).toEqual('scatterplot-s2-feb-symbol');
    expect(await element(by.id('scatterplot-s2-feb-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-feb-symbol');
    expect(await element(by.id('scatterplot-s2-mar-symbol')).getAttribute('id')).toEqual('scatterplot-s2-mar-symbol');
    expect(await element(by.id('scatterplot-s2-mar-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-mar-symbol');
    expect(await element(by.id('scatterplot-s2-apr-symbol')).getAttribute('id')).toEqual('scatterplot-s2-apr-symbol');
    expect(await element(by.id('scatterplot-s2-apr-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-apr-symbol');
    expect(await element(by.id('scatterplot-s2-may-symbol')).getAttribute('id')).toEqual('scatterplot-s2-may-symbol');
    expect(await element(by.id('scatterplot-s2-may-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-may-symbol');
    expect(await element(by.id('scatterplot-s2-jun-symbol')).getAttribute('id')).toEqual('scatterplot-s2-jun-symbol');
    expect(await element(by.id('scatterplot-s2-jun-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-jun-symbol');
    expect(await element(by.id('scatterplot-s2-jul-symbol')).getAttribute('id')).toEqual('scatterplot-s2-jul-symbol');
    expect(await element(by.id('scatterplot-s2-jul-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-jul-symbol');
    expect(await element(by.id('scatterplot-s2-aug-symbol')).getAttribute('id')).toEqual('scatterplot-s2-aug-symbol');
    expect(await element(by.id('scatterplot-s2-aug-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-aug-symbol');
    expect(await element(by.id('scatterplot-s2-sep-symbol')).getAttribute('id')).toEqual('scatterplot-s2-sep-symbol');
    expect(await element(by.id('scatterplot-s2-sep-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-sep-symbol');
    expect(await element(by.id('scatterplot-s2-oct-symbol')).getAttribute('id')).toEqual('scatterplot-s2-oct-symbol');
    expect(await element(by.id('scatterplot-s2-oct-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-oct-symbol');
    expect(await element(by.id('scatterplot-s2-nov-symbol')).getAttribute('id')).toEqual('scatterplot-s2-nov-symbol');
    expect(await element(by.id('scatterplot-s2-nov-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-nov-symbol');
    expect(await element(by.id('scatterplot-s2-dec-symbol')).getAttribute('id')).toEqual('scatterplot-s2-dec-symbol');
    expect(await element(by.id('scatterplot-s2-dec-symbol')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-s2-dec-symbol');

    expect(await element(by.id('scatterplot-series1-line')).getAttribute('id')).toEqual('scatterplot-series1-line');
    expect(await element(by.id('scatterplot-series1-line')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-series1-line');
    expect(await element(by.id('scatterplot-series2-line')).getAttribute('id')).toEqual('scatterplot-series2-line');
    expect(await element(by.id('scatterplot-series2-line')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-series2-line');

    expect(await element(by.id('scatterplot-series1-legend-0')).getAttribute('id')).toEqual('scatterplot-series1-legend-0');
    expect(await element(by.id('scatterplot-series1-legend-0')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-series1-legend-0');
    expect(await element(by.id('scatterplot-series2-legend-1')).getAttribute('id')).toEqual('scatterplot-series2-legend-1');
    expect(await element(by.id('scatterplot-series2-legend-1')).getAttribute('data-automation-id')).toEqual('automation-id-scatterplot-series2-legend-1');
  });
});
