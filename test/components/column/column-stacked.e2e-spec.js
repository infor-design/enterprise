const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Column Stacked Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column-stacked/example-index?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.bar.series-11')).first()), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('columnstacked-2018-jan-bar')).getAttribute('id')).toEqual('columnstacked-2018-jan-bar');
    expect(await element(by.id('columnstacked-2018-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-jan-bar');
    expect(await element(by.id('columnstacked-2018-feb-bar')).getAttribute('id')).toEqual('columnstacked-2018-feb-bar');
    expect(await element(by.id('columnstacked-2018-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-feb-bar');
    expect(await element(by.id('columnstacked-2018-mar-bar')).getAttribute('id')).toEqual('columnstacked-2018-mar-bar');
    expect(await element(by.id('columnstacked-2018-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-mar-bar');
    expect(await element(by.id('columnstacked-2018-apr-bar')).getAttribute('id')).toEqual('columnstacked-2018-apr-bar');
    expect(await element(by.id('columnstacked-2018-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-apr-bar');
    expect(await element(by.id('columnstacked-2018-may-bar')).getAttribute('id')).toEqual('columnstacked-2018-may-bar');
    expect(await element(by.id('columnstacked-2018-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-may-bar');
    expect(await element(by.id('columnstacked-2018-jun-bar')).getAttribute('id')).toEqual('columnstacked-2018-jun-bar');
    expect(await element(by.id('columnstacked-2018-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-jun-bar');
    expect(await element(by.id('columnstacked-2018-jul-bar')).getAttribute('id')).toEqual('columnstacked-2018-jul-bar');
    expect(await element(by.id('columnstacked-2018-jul-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-jul-bar');
    expect(await element(by.id('columnstacked-2018-aug-bar')).getAttribute('id')).toEqual('columnstacked-2018-aug-bar');
    expect(await element(by.id('columnstacked-2018-aug-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-aug-bar');
    expect(await element(by.id('columnstacked-2018-sep-bar')).getAttribute('id')).toEqual('columnstacked-2018-sep-bar');
    expect(await element(by.id('columnstacked-2018-sep-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-sep-bar');
    expect(await element(by.id('columnstacked-2018-oct-bar')).getAttribute('id')).toEqual('columnstacked-2018-oct-bar');
    expect(await element(by.id('columnstacked-2018-oct-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-oct-bar');
    expect(await element(by.id('columnstacked-2018-nov-bar')).getAttribute('id')).toEqual('columnstacked-2018-nov-bar');
    expect(await element(by.id('columnstacked-2018-nov-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-nov-bar');
    expect(await element(by.id('columnstacked-2018-dec-bar')).getAttribute('id')).toEqual('columnstacked-2018-dec-bar');
    expect(await element(by.id('columnstacked-2018-dec-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-dec-bar');

    expect(await element(by.id('columnstacked-2017-jan-bar')).getAttribute('id')).toEqual('columnstacked-2017-jan-bar');
    expect(await element(by.id('columnstacked-2017-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-jan-bar');
    expect(await element(by.id('columnstacked-2017-feb-bar')).getAttribute('id')).toEqual('columnstacked-2017-feb-bar');
    expect(await element(by.id('columnstacked-2017-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-feb-bar');
    expect(await element(by.id('columnstacked-2017-mar-bar')).getAttribute('id')).toEqual('columnstacked-2017-mar-bar');
    expect(await element(by.id('columnstacked-2017-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-mar-bar');
    expect(await element(by.id('columnstacked-2017-apr-bar')).getAttribute('id')).toEqual('columnstacked-2017-apr-bar');
    expect(await element(by.id('columnstacked-2017-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-apr-bar');
    expect(await element(by.id('columnstacked-2017-may-bar')).getAttribute('id')).toEqual('columnstacked-2017-may-bar');
    expect(await element(by.id('columnstacked-2017-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-may-bar');
    expect(await element(by.id('columnstacked-2017-jun-bar')).getAttribute('id')).toEqual('columnstacked-2017-jun-bar');
    expect(await element(by.id('columnstacked-2017-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-jun-bar');
    expect(await element(by.id('columnstacked-2017-jul-bar')).getAttribute('id')).toEqual('columnstacked-2017-jul-bar');
    expect(await element(by.id('columnstacked-2017-jul-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-jul-bar');
    expect(await element(by.id('columnstacked-2017-aug-bar')).getAttribute('id')).toEqual('columnstacked-2017-aug-bar');
    expect(await element(by.id('columnstacked-2017-aug-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-aug-bar');
    expect(await element(by.id('columnstacked-2017-sep-bar')).getAttribute('id')).toEqual('columnstacked-2017-sep-bar');
    expect(await element(by.id('columnstacked-2017-sep-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-sep-bar');
    expect(await element(by.id('columnstacked-2017-oct-bar')).getAttribute('id')).toEqual('columnstacked-2017-oct-bar');
    expect(await element(by.id('columnstacked-2017-oct-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-oct-bar');
    expect(await element(by.id('columnstacked-2017-nov-bar')).getAttribute('id')).toEqual('columnstacked-2017-nov-bar');
    expect(await element(by.id('columnstacked-2017-nov-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-nov-bar');
    expect(await element(by.id('columnstacked-2017-dec-bar')).getAttribute('id')).toEqual('columnstacked-2017-dec-bar');
    expect(await element(by.id('columnstacked-2017-dec-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-dec-bar');

    expect(await element(by.id('columnstacked-2016-jan-bar')).getAttribute('id')).toEqual('columnstacked-2016-jan-bar');
    expect(await element(by.id('columnstacked-2016-jan-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-jan-bar');
    expect(await element(by.id('columnstacked-2016-feb-bar')).getAttribute('id')).toEqual('columnstacked-2016-feb-bar');
    expect(await element(by.id('columnstacked-2016-feb-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-feb-bar');
    expect(await element(by.id('columnstacked-2016-mar-bar')).getAttribute('id')).toEqual('columnstacked-2016-mar-bar');
    expect(await element(by.id('columnstacked-2016-mar-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-mar-bar');
    expect(await element(by.id('columnstacked-2016-apr-bar')).getAttribute('id')).toEqual('columnstacked-2016-apr-bar');
    expect(await element(by.id('columnstacked-2016-apr-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-apr-bar');
    expect(await element(by.id('columnstacked-2016-may-bar')).getAttribute('id')).toEqual('columnstacked-2016-may-bar');
    expect(await element(by.id('columnstacked-2016-may-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-may-bar');
    expect(await element(by.id('columnstacked-2016-jun-bar')).getAttribute('id')).toEqual('columnstacked-2016-jun-bar');
    expect(await element(by.id('columnstacked-2016-jun-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-jun-bar');
    expect(await element(by.id('columnstacked-2016-jul-bar')).getAttribute('id')).toEqual('columnstacked-2016-jul-bar');
    expect(await element(by.id('columnstacked-2016-jul-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-jul-bar');
    expect(await element(by.id('columnstacked-2016-aug-bar')).getAttribute('id')).toEqual('columnstacked-2016-aug-bar');
    expect(await element(by.id('columnstacked-2016-aug-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-aug-bar');
    expect(await element(by.id('columnstacked-2016-sep-bar')).getAttribute('id')).toEqual('columnstacked-2016-sep-bar');
    expect(await element(by.id('columnstacked-2016-sep-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-sep-bar');
    expect(await element(by.id('columnstacked-2016-oct-bar')).getAttribute('id')).toEqual('columnstacked-2016-oct-bar');
    expect(await element(by.id('columnstacked-2016-oct-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-oct-bar');
    expect(await element(by.id('columnstacked-2016-nov-bar')).getAttribute('id')).toEqual('columnstacked-2016-nov-bar');
    expect(await element(by.id('columnstacked-2016-nov-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-nov-bar');
    expect(await element(by.id('columnstacked-2016-dec-bar')).getAttribute('id')).toEqual('columnstacked-2016-dec-bar');
    expect(await element(by.id('columnstacked-2016-dec-bar')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-dec-bar');

    expect(await element(by.id('columnstacked-2018-legend')).getAttribute('id')).toEqual('columnstacked-2018-legend');
    expect(await element(by.id('columnstacked-2018-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2018-legend');

    expect(await element(by.id('columnstacked-2017-legend')).getAttribute('id')).toEqual('columnstacked-2017-legend');
    expect(await element(by.id('columnstacked-2017-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2017-legend');

    expect(await element(by.id('columnstacked-2016-legend')).getAttribute('id')).toEqual('columnstacked-2016-legend');
    expect(await element(by.id('columnstacked-2016-legend')).getAttribute('data-automation-id')).toEqual('automation-id-columnstacked-2016-legend');
  });
});
