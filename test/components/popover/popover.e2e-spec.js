const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Popover Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popover/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display on click', async () => {
    await element(by.id('popover-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popover'))), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('.popover')).isDisplayed()).toBeTruthy();
  });

  it('Should be able to set id/automation id', async () => {
    await element(by.id('popover-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popover'))), config.waitsFor);

    await browser.driver.sleep(config.sleep);

    // Trigger and content wrapper are generated internally from the settings
    expect(await element(by.id('popover-trigger')).getAttribute('id')).toEqual('popover-trigger');
    expect(await element(by.id('popover-trigger')).getAttribute('data-automation-id')).toEqual('my-popover-automation-id-trigger');

    expect(await element(by.id('my-popover-id-title')).getAttribute('id')).toEqual('my-popover-id-title');
    expect(await element(by.id('my-popover-id-title')).getAttribute('data-automation-id')).toEqual('my-popover-automation-id-title');

    expect(await element(by.id('my-popover-id-btn-close')).getAttribute('id')).toEqual('my-popover-id-btn-close');
    expect(await element(by.id('my-popover-id-btn-close')).getAttribute('data-automation-id')).toEqual('my-popover-automation-id-btn-close');

    await element(by.id('popover-trigger')).click();

    expect(await element(by.css('.popover')).getAttribute('data-automation-id')).toEqual('my-popover-automation-id');

    // Content and buttons (Apply/View More) were user-defined and have automation ids applied directly
    expect(await element(by.id('popover-contents')).getAttribute('id')).toEqual('popover-contents');
    expect(await element(by.id('popover-contents')).getAttribute('data-automation-id')).toEqual('popover-contents-automation-id');

    expect(await element(by.id('popover-btn-apply')).getAttribute('id')).toEqual('popover-btn-apply');
    expect(await element(by.id('popover-btn-apply')).getAttribute('data-automation-id')).toEqual('popover-btn-apply-automation-id');

    expect(await element(by.id('popover-btn-view-more')).getAttribute('id')).toEqual('popover-btn-view-more');
    expect(await element(by.id('popover-btn-view-more')).getAttribute('data-automation-id')).toEqual('popover-btn-view-more-automation-id');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.id('popover-trigger')).click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popover'))), config.waitsFor);
      await utils.checkForErrors();

      const popoverEl = await element(by.className('popover'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(popoverEl, 'popover-index')).toEqual(0);
    });
  }
});
