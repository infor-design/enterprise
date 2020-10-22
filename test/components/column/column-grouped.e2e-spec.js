const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Column Grouped Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column-grouped/example-index');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('columngrouped-c1-jan-bar')).getAttribute('id')).toEqual('columngrouped-c1-jan-bar');
    expect(await element(by.id('columngrouped-c1-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-jan-bar');
    expect(await element(by.id('columngrouped-c1-feb-bar')).getAttribute('id')).toEqual('columngrouped-c1-feb-bar');
    expect(await element(by.id('columngrouped-c1-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-feb-bar');
    expect(await element(by.id('columngrouped-c1-mar-bar')).getAttribute('id')).toEqual('columngrouped-c1-mar-bar');
    expect(await element(by.id('columngrouped-c1-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-mar-bar');
    expect(await element(by.id('columngrouped-c1-apr-bar')).getAttribute('id')).toEqual('columngrouped-c1-apr-bar');
    expect(await element(by.id('columngrouped-c1-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-apr-bar');
    expect(await element(by.id('columngrouped-c1-may-bar')).getAttribute('id')).toEqual('columngrouped-c1-may-bar');
    expect(await element(by.id('columngrouped-c1-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-may-bar');
    expect(await element(by.id('columngrouped-c1-jun-bar')).getAttribute('id')).toEqual('columngrouped-c1-jun-bar');
    expect(await element(by.id('columngrouped-c1-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-jun-bar');

    expect(await element(by.id('columngrouped-c2-jan-bar')).getAttribute('id')).toEqual('columngrouped-c2-jan-bar');
    expect(await element(by.id('columngrouped-c2-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-jan-bar');
    expect(await element(by.id('columngrouped-c2-feb-bar')).getAttribute('id')).toEqual('columngrouped-c2-feb-bar');
    expect(await element(by.id('columngrouped-c2-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-feb-bar');
    expect(await element(by.id('columngrouped-c2-mar-bar')).getAttribute('id')).toEqual('columngrouped-c2-mar-bar');
    expect(await element(by.id('columngrouped-c2-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-mar-bar');
    expect(await element(by.id('columngrouped-c2-apr-bar')).getAttribute('id')).toEqual('columngrouped-c2-apr-bar');
    expect(await element(by.id('columngrouped-c2-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-apr-bar');
    expect(await element(by.id('columngrouped-c2-may-bar')).getAttribute('id')).toEqual('columngrouped-c2-may-bar');
    expect(await element(by.id('columngrouped-c2-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-may-bar');
    expect(await element(by.id('columngrouped-c2-jun-bar')).getAttribute('id')).toEqual('columngrouped-c2-jun-bar');
    expect(await element(by.id('columngrouped-c2-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c2-jun-bar');

    expect(await element(by.id('columngrouped-c3-jan-bar')).getAttribute('id')).toEqual('columngrouped-c3-jan-bar');
    expect(await element(by.id('columngrouped-c3-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-jan-bar');
    expect(await element(by.id('columngrouped-c3-feb-bar')).getAttribute('id')).toEqual('columngrouped-c3-feb-bar');
    expect(await element(by.id('columngrouped-c3-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-feb-bar');
    expect(await element(by.id('columngrouped-c3-mar-bar')).getAttribute('id')).toEqual('columngrouped-c3-mar-bar');
    expect(await element(by.id('columngrouped-c3-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-mar-bar');
    expect(await element(by.id('columngrouped-c3-apr-bar')).getAttribute('id')).toEqual('columngrouped-c3-apr-bar');
    expect(await element(by.id('columngrouped-c3-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-apr-bar');
    expect(await element(by.id('columngrouped-c3-may-bar')).getAttribute('id')).toEqual('columngrouped-c3-may-bar');
    expect(await element(by.id('columngrouped-c3-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-may-bar');
    expect(await element(by.id('columngrouped-c3-jun-bar')).getAttribute('id')).toEqual('columngrouped-c3-jun-bar');
    expect(await element(by.id('columngrouped-c3-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c3-jun-bar');

    expect(await element(by.id('columngrouped-c1-jan-legend')).getAttribute('id')).toEqual('columngrouped-c1-jan-legend');
    expect(await element(by.id('columngrouped-c1-jan-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-jan-legend');

    expect(await element(by.id('columngrouped-c1-feb-legend')).getAttribute('id')).toEqual('columngrouped-c1-feb-legend');
    expect(await element(by.id('columngrouped-c1-feb-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-feb-legend');

    expect(await element(by.id('columngrouped-c1-mar-legend')).getAttribute('id')).toEqual('columngrouped-c1-mar-legend');
    expect(await element(by.id('columngrouped-c1-mar-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-mar-legend');

    expect(await element(by.id('columngrouped-c1-apr-legend')).getAttribute('id')).toEqual('columngrouped-c1-apr-legend');
    expect(await element(by.id('columngrouped-c1-apr-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-apr-legend');

    expect(await element(by.id('columngrouped-c1-may-legend')).getAttribute('id')).toEqual('columngrouped-c1-may-legend');
    expect(await element(by.id('columngrouped-c1-may-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-may-legend');

    expect(await element(by.id('columngrouped-c1-jun-legend')).getAttribute('id')).toEqual('columngrouped-c1-jun-legend');
    expect(await element(by.id('columngrouped-c1-jun-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columngrouped-c1-jun-legend');
  });
});
