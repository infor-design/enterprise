const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

describe('Popdown Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/example-index?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should display on click', async () => {
    await element(by.id('popdown-example-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popdown'))), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
  });

  it('should have id/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('popdown')).getAttribute('id')).toEqual('popdown');
    expect(await element(by.id('popdown')).getAttribute('data-automation-id')).toEqual('popdown-automation-id');

    expect(await element(by.id('popover-listview-example')).getAttribute('id')).toEqual('popover-listview-example');
    expect(await element(by.id('popover-listview-example')).getAttribute('data-automation-id')).toEqual('popover-listview-example-automation-id');

    expect(await element(by.id('edit-cart')).getAttribute('id')).toEqual('edit-cart');
    expect(await element(by.id('edit-cart')).getAttribute('data-automation-id')).toEqual('edit-cart-automation-id');

    expect(await element(by.id('checkout')).getAttribute('id')).toEqual('checkout');
    expect(await element(by.id('checkout')).getAttribute('data-automation-id')).toEqual('checkout-automation-id');
  });
});

describe('Popdown first last tab Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/test-first-last-tab?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Popdown/Lookup integration Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/test-contains-lookup.html?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should remain open when an inner Lookup component is opened', async () => {
    // Open the Popdown
    await element(by.id('popdown-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popdown'))), config.waitsFor);

    // Open the Lookup
    await element(by.css('.lookup-wrapper > .trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.lookup-modal'))), config.waitsFor);

    // Test that the Popdown remained open
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();

    // Choose an option from the Lookup
    await element(by.css('#lookup-datagrid > div.datagrid-wrapper > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > a')).click();
    await browser.driver.sleep(config.sleep);

    // Test that the Popdown remained open
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
  });
});
