/* eslint-disable max-len */
const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnAutocomplete = async () => {
  const autocompleteEl = await element(by.css('#autocomplete-default'));
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
  await autocompleteEl.click();
};

describe('Autocomplete example-index tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/autocomplete/example-index?theme=${browser.params.theme}`);
  });

  it('Should open a filtered results list after focusing and keying text', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.css('#autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitFor);
    await autocompleteEl.sendKeys('new');
    const autocompleteListEl = await element(by.id('autocomplete-list'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteListEl), config.waitFor);

    expect(await element(by.id('autocomplete-list')).isDisplayed()).toBe(true);
  });

  it('Should fill the input field with the correct text contents when an item is clicked', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.css('#autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitFor);
    await autocompleteEl.sendKeys('new');

    const autocompleteListEl = await element(by.css('#autocomplete-list'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteListEl), config.waitFor);

    const njOption = await element(by.css('li[data-value="NJ"]'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(njOption), config.waitFor);
    await njOption.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element(by.id('autocomplete-default')).getAttribute('value')).toEqual('New Jersey');
  });

  if (utils.isChrome()) {
    it('Should fill the input field with the correct text contents when an item is chosen with the keyboard', async () => {
      const autocompleteEl = await element(by.css('#autocomplete-default'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitFor);
      await autocompleteEl.click();
      await browser.driver.switchTo().activeElement().clear();
      await browser.driver.switchTo().activeElement().sendKeys('new');
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('#ac-list-option0 span i'))), config.waitFor);
      await autocompleteEl.sendKeys(protractor.Key.ARROW_DOWN);
      await autocompleteEl.sendKeys(protractor.Key.ARROW_DOWN);
      await autocompleteEl.sendKeys(protractor.Key.ENTER);
      await browser.driver
        .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('autocomplete-list'))), config.waitsFor);

      expect(await element(by.id('autocomplete-default')).getAttribute('value')).toEqual('New Jersey');
    });
  }

  it('Should clear a dirty autocomplete field with `alt + backspace/del`', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.css('#autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitFor);
    await autocompleteEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await autocompleteEl.sendKeys('new');
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('autocomplete-list'))), config.waitFor);
    await autocompleteEl.sendKeys(protractor.Key.chord(protractor.Key.ALT, protractor.Key.BACK_SPACE));
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element(by.id('autocomplete-default')).getAttribute('value')).toEqual('');
  });
});
