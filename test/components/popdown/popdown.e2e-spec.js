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
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.popdown'))), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('.popdown')).isDisplayed()).toBeTruthy();
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
