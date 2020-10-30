const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Popdown Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display on click', async () => {
    await element(by.id('popdown-example-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popdown'))), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
  });

  it('Should have id/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('popdown')).getAttribute('id')).toEqual('popdown');
    expect(await element(by.id('popdown')).getAttribute('data-automation-id')).toEqual('popdown-automation-id');

    expect(await element(by.id('popdownpopover-listview-example')).getAttribute('id')).toEqual('popover-listview-example');
    expect(await element(by.id('popover-listview-example')).getAttribute('data-automation-id')).toEqual('popover-listview-example-automation-id');

    expect(await element(by.id('edit-cart')).getAttribute('id')).toEqual('edit-cart');
    expect(await element(by.id('edit-cart')).getAttribute('data-automation-id')).toEqual('edit-cart-automation-id');

    expect(await element(by.id('checkout')).getAttribute('id')).toEqual('checkout');
    expect(await element(by.id('checkout')).getAttribute('data-automation-id')).toEqual('checkout-automation-id');
  });
});

describe('Popdown (with Dropdown) Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/test-contains-dropdown?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should keep the Popdown open while focused on an inline-Dropdown component\'s list', async () => {
    // Open the Popdown
    await element(by.id('popdown-example-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popdown'))), config.waitsFor);

    // Open the Dropdown List
    await element(by.css('.popdown div.dropdown')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown-list'))), config.waitsFor);

    // Test that the Popdown remained open
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();

    // Choose an option from the Dropdown, which will close it.
    await element(by.css('li[data-val="1"]')).click();
    await browser.driver.sleep(config.sleep);

    // Test that the Popdown remained open
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
  });
});

describe('Popdown first last tab Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/test-first-last-tab?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  // 1. On open first input should be focused.
  // 2. On first input (Shift + Tab) should close and focus to previous.
  // 3. On last input Tab should close and focus to next.
  it('Should let close the popdown and if available focus to prev/next', async () => {
    const focusedId = () => browser.driver.switchTo().activeElement().getAttribute('id');
    // Tab on date field
    await element(by.css('#date-field-normal')).sendKeys(protractor.Key.TAB);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popdown'))), config.waitsFor);
    await browser.driver.sleep(config.sleepLonger);

    // Popdown should open and first input should be focused.
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('#first-name')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('#last-name')).isDisplayed()).toBeTruthy();
    expect(focusedId()).toEqual('first-name');

    // Tab on first input
    await element(by.css('#first-name')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepLonger);

    // Last input should be focused in popdown.
    expect(await focusedId()).toEqual('last-name');

    // Tab on last input in popdown
    await element(by.css('#last-name')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleepLonger);

    // Popdown should close and next input (another-field) should be focused.
    expect(await element(by.css('.popdown')).isDisplayed()).toBeFalsy();
    expect(await element(by.css('#first-name')).isDisplayed()).toBeFalsy();
    expect(await element(by.css('#last-name')).isDisplayed()).toBeFalsy();
    expect(await focusedId()).toEqual('another-field');

    // Shift + Tab on this next to popdown input (another-field)
    await element(by.css('#another-field'))
      .sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
    await browser.driver.sleep(config.sleepLonger);

    // Popdown should open again and first input should be focused.
    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('#first-name')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('#last-name')).isDisplayed()).toBeTruthy();
    expect(await focusedId()).toEqual('first-name');

    // Shift + Tab on first input in popdown
    await element(by.css('#first-name'))
      .sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
    await browser.driver.sleep(config.sleepLonger);

    // Popdown should close and previous input (date field) should be focused.
    expect(await element(by.css('.popdown')).isDisplayed()).toBeFalsy();
    expect(await element(by.css('#first-name')).isDisplayed()).toBeFalsy();
    expect(await element(by.css('#last-name')).isDisplayed()).toBeFalsy();
    expect(await focusedId()).toEqual('date-field-normal');
  });
});

describe('Popdown/Lookup integration Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popdown/test-contains-lookup.html?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should remain open when an inner Lookup component is opened', async () => {
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
