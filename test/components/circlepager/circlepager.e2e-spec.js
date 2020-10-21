const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Circle pager example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/circlepager/example-index?layout=nofrills');
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

      expect(await browser.imageComparison.checkScreen('circlepager')).toEqual(0);
    });
  }

  it('Should be able to set id/automations', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('circlepager-id-1')).getAttribute('id')).toEqual('circlepager-id-1');
    expect(await element(by.id('circlepager-id-1')).getAttribute('data-automation-id')).toEqual('automation-id-circlepager-1');

    expect(await element(by.id('circlepager-id-1-control-1')).getAttribute('id')).toEqual('circlepager-id-1-control-1');
    expect(await element(by.id('circlepager-id-1-control-1')).getAttribute('data-automation-id')).toEqual('automation-id-circlepager-1-control-1');

    expect(await element(by.id('circlepager-id-1-control-2')).getAttribute('id')).toEqual('circlepager-id-1-control-2');
    expect(await element(by.id('circlepager-id-1-control-2')).getAttribute('data-automation-id')).toEqual('automation-id-circlepager-1-control-2');

    expect(await element(by.id('circlepager-id-1-control-3')).getAttribute('id')).toEqual('circlepager-id-1-control-3');
    expect(await element(by.id('circlepager-id-1-control-3')).getAttribute('data-automation-id')).toEqual('automation-id-circlepager-1-control-3');
  });
});

describe('Circle pager example-circlepager tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/pager/example-circlepager');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.circlepager'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show the circle pager', async () => {
    expect(await element.all(by.css('.example1 .slide-content')).first().getCssValue('padding-top')).toEqual('230px');
  });
});
