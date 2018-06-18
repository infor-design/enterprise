// TODO: Write WCAG tests
// TODO: Write Visual Regression tests

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Set page to test by url
const setPage = async function (url) {
  const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(pageurl);
};

let searchfieldInputEl;
const searchfieldId = 'searchfield';
const searchfieldListId = 'autocomplete-list';

fdescribe('Searchfield example-index tests', () => {
  beforeEach(async () => {
    await setPage('/components/searchfield/example-index');
    searchfieldInputEl = await element(by.id(searchfieldId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id(searchfieldId))), config.waitsFor);
  });

  it('Adds an "all results" link when results populate the Autocomplete list', async () => {
    await searchfieldInputEl.sendKeys('co');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    // Identify the added "All Results" link
    expect(await element(by.linkText('All Results For "co"'))).toBeDefined();
  });

  it('Adds a "no results" link if an empty list is present', async () => {
    await searchfieldInputEl.sendKeys('not a state');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    // Identify the added "No Results" link
    expect(await element(by.linkText('No Results'))).toBeDefined();
  });

  xit('can clear the filtered list with `alt + del/backspace`', async () => {
    await searchfieldInputEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await searchfieldInputEl.sendKeys('Definitely not a real state');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(await element(by.id(searchfieldListId))), config.waitFor);
    await element(by.id(searchfieldId)).sendKeys(protractor.Key.chord(protractor.Key.ALT, protractor.Key.DELETE));
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.id(searchfieldListEl))), config.waitFor);

    expect(await element(by.id(searchfieldId)).getAttribute('value')).toEqual('');
  });
});
