const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Area Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/area/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('area-a-jan-dot')).getAttribute('id')).toEqual('area-a-jan-dot');
    expect(await element(by.id('area-a-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-jan-dot');
    expect(await element(by.id('area-a-feb-dot')).getAttribute('id')).toEqual('area-a-feb-dot');
    expect(await element(by.id('area-a-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-feb-dot');
    expect(await element(by.id('area-a-mar-dot')).getAttribute('id')).toEqual('area-a-mar-dot');
    expect(await element(by.id('area-a-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-mar-dot');
    expect(await element(by.id('area-a-apr-dot')).getAttribute('id')).toEqual('area-a-apr-dot');
    expect(await element(by.id('area-a-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-apr-dot');
    expect(await element(by.id('area-a-may-dot')).getAttribute('id')).toEqual('area-a-may-dot');
    expect(await element(by.id('area-a-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-may-dot');
    expect(await element(by.id('area-a-jun-dot')).getAttribute('id')).toEqual('area-a-jun-dot');
    expect(await element(by.id('area-a-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-a-jun-dot');

    expect(await element(by.id('area-b-jan-dot')).getAttribute('id')).toEqual('area-b-jan-dot');
    expect(await element(by.id('area-b-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-jan-dot');
    expect(await element(by.id('area-b-feb-dot')).getAttribute('id')).toEqual('area-b-feb-dot');
    expect(await element(by.id('area-b-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-feb-dot');
    expect(await element(by.id('area-b-mar-dot')).getAttribute('id')).toEqual('area-b-mar-dot');
    expect(await element(by.id('area-b-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-mar-dot');
    expect(await element(by.id('area-b-apr-dot')).getAttribute('id')).toEqual('area-b-apr-dot');
    expect(await element(by.id('area-b-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-apr-dot');
    expect(await element(by.id('area-b-may-dot')).getAttribute('id')).toEqual('area-b-may-dot');
    expect(await element(by.id('area-b-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-may-dot');
    expect(await element(by.id('area-b-jun-dot')).getAttribute('id')).toEqual('area-b-jun-dot');
    expect(await element(by.id('area-b-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-b-jun-dot');

    expect(await element(by.id('area-c-jan-dot')).getAttribute('id')).toEqual('area-c-jan-dot');
    expect(await element(by.id('area-c-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-jan-dot');
    expect(await element(by.id('area-c-feb-dot')).getAttribute('id')).toEqual('area-c-feb-dot');
    expect(await element(by.id('area-c-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-feb-dot');
    expect(await element(by.id('area-c-mar-dot')).getAttribute('id')).toEqual('area-c-mar-dot');
    expect(await element(by.id('area-c-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-mar-dot');
    expect(await element(by.id('area-c-apr-dot')).getAttribute('id')).toEqual('area-c-apr-dot');
    expect(await element(by.id('area-c-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-apr-dot');
    expect(await element(by.id('area-c-may-dot')).getAttribute('id')).toEqual('area-c-may-dot');
    expect(await element(by.id('area-c-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-may-dot');
    expect(await element(by.id('area-c-jun-dot')).getAttribute('id')).toEqual('area-c-jun-dot');
    expect(await element(by.id('area-c-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-area-c-jun-dot');

    expect(await element(by.id('area-comp-a-line')).getAttribute('id')).toEqual('area-comp-a-line');
    expect(await element(by.id('area-comp-a-line')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-a-line');
    expect(await element(by.id('area-comp-b-line')).getAttribute('id')).toEqual('area-comp-b-line');
    expect(await element(by.id('area-comp-b-line')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-b-line');
    expect(await element(by.id('area-comp-c-line')).getAttribute('id')).toEqual('area-comp-c-line');
    expect(await element(by.id('area-comp-c-line')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-c-line');

    expect(await element(by.id('area-comp-a-legend')).getAttribute('id')).toEqual('area-comp-a-legend');
    expect(await element(by.id('area-comp-a-legend')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-a-legend');
    expect(await element(by.id('area-comp-b-legend')).getAttribute('id')).toEqual('area-comp-b-legend');
    expect(await element(by.id('area-comp-b-legend')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-b-legend');
    expect(await element(by.id('area-comp-c-legend')).getAttribute('id')).toEqual('area-comp-c-legend');
    expect(await element(by.id('area-comp-c-legend')).getAttribute('data-automation-id')).toEqual('automation-id-area-comp-c-legend');
  });
});

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
