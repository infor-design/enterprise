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

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      await clickOnAutocomplete();
      const autocompleteEl = await element(by.id('autocomplete-default'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
      await autocompleteEl.sendKeys('a');
      const autocompleteListContainer = await element(by.id('maincontent'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteListContainer), config.waitsFor);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(autocompleteListContainer), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(autocompleteListContainer, 'autocomplete-open')).toEqual(0);
    });
  }

  it('Should open a filtered results list after focusing and keying text', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.css('#autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
    await autocompleteEl.sendKeys('new');
    const autocompleteListEl = await element(by.id('autocomplete-list'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteListEl), config.waitsFor);

    expect(await element(by.id('autocomplete-list')).isDisplayed()).toBe(true);
  });

  it('Should fill the input field with the correct text contents when an item is clicked', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.css('#autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
    await autocompleteEl.sendKeys('new');

    const autocompleteListEl = await element(by.css('#autocomplete-list'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteListEl), config.waitsFor);

    const njOption = await element(by.css('li[data-value="NJ"]'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(njOption), config.waitsFor);
    await njOption.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element(by.id('autocomplete-default')).getAttribute('value')).toEqual('New Jersey');
  });

  if (utils.isChrome()) {
    it('Should fill the input field with the correct text contents when an item is chosen with the keyboard', async () => {
      const autocompleteEl = await element(by.css('#autocomplete-default'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
      await autocompleteEl.click();
      await browser.driver.switchTo().activeElement().clear();
      await browser.driver.switchTo().activeElement().sendKeys('new');
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('#ac-list-option0 span i'))), config.waitsFor);
      await autocompleteEl.sendKeys(protractor.Key.ARROW_DOWN);
      await autocompleteEl.sendKeys(protractor.Key.ARROW_DOWN);
      await autocompleteEl.sendKeys(protractor.Key.ENTER);
      await browser.driver
        .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('autocomplete-list'))), config.waitsFor);

      expect(await element(by.id('autocomplete-default')).getAttribute('value')).toEqual('New Jersey');

      await utils.checkForErrors();
    });
  }

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('custom-id-autocomplete')).getAttribute('id')).toEqual('custom-id-autocomplete');
    expect(await element(by.id('custom-id-autocomplete')).getAttribute('data-automation-id')).toEqual('custom-automation-id-autocomplete');
  });
});

describe('Autocomplete ajax tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/autocomplete/example-ajax?theme=${browser.params.theme}`);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should handle ajax', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.id('autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
    await autocompleteEl.sendKeys('a');

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element.all(by.css('#autocomplete-list li')).count()).toEqual(5);
  });
});

describe('Autocomplete contains tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/autocomplete/example-contains?theme=${browser.params.theme}`);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should handle ajax', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.id('autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
    await autocompleteEl.sendKeys('as');

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element.all(by.css('#autocomplete-list li')).count()).toEqual(7);
  });
});

describe('Autocomplete keyword tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/autocomplete/example-keyword?theme=${browser.params.theme}`);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should handle ajax', async () => {
    await clickOnAutocomplete();
    const autocompleteEl = await element(by.id('autocomplete-default'));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(autocompleteEl), config.waitsFor);
    await autocompleteEl.sendKeys('as');

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(await element(by.id('autocomplete-list'))), config.waitsFor);

    expect(await element.all(by.css('#autocomplete-list li')).count()).toEqual(7);
  });
});

describe('Autocomplete focus tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/autocomplete/example-ajax`);
  });

  it('Should not steal focus away from other components if the user has tabbed out', async () => {
    await clickOnAutocomplete();

    // Type "Utah" and immediately tab to the next field
    await browser.actions()
      .sendKeys('utah')
      .sendKeys(protractor.Key.TAB).perform();

    // Wait for the amount of time necessary that would normally be needed for the list to open.
    await browser.driver.sleep(config.sleepLonger);

    // Make sure the list isn't there
    expect(await element(by.id('autocomplete-list')).isPresent()).toBeFalsy();
  });
});
