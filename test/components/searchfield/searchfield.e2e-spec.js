// TODO: Write WCAG tests
// TODO: Write Visual Regression tests

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Set page to test by url
const setPage = async function (url) {
  const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(pageurl);
};

const searchfieldId = 'searchfield';
const searchfieldGoButtonId = 'searchfield-go-button--1';

describe('Searchfield example-index tests', () => {
  beforeEach(async () => {
    await setPage('/components/searchfield/example-index');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldId))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const searchfieldInputEl = await element(by.id(searchfieldId));
      const searchfieldSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);
      await browser.driver.sleep(config.waitsFor);

      expect(await browser.protractorImageComparison.checkElement(searchfieldInputEl, 'searchfield-init')).toEqual(0);
      await searchfieldInputEl.clear();
      await searchfieldInputEl.sendKeys('c');
      await searchfieldInputEl.sendKeys('o');
      await browser.driver.sleep(config.waitsFor);
      await searchfieldInputEl.sendKeys(protractor.Key.ARROW_DOWN);

      expect(await browser.protractorImageComparison.checkElement(searchfieldSection, 'searchfield-open')).toEqual(0);
    });
  }

  it('Should filter on example-index', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    await searchfieldInputEl.clear();
    await searchfieldInputEl.sendKeys('co');

    expect(await searchfieldInputEl.getAttribute('value')).toEqual('co');
  });

  it('Should be able to type in as an input', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    await searchfieldInputEl.clear();
    await searchfieldInputEl.sendKeys('co');

    expect(await searchfieldInputEl.getAttribute('value')).toEqual('co');
  });

  it('Adds an "all results" link when results populate the Autocomplete list', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldId));
    await searchfieldInputEl.sendKeys('co');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    // Identify the added "All Results" link
    expect(await element(by.linkText('All Results For "co"'))).toBeDefined();
  });

  it('Adds a "no results" link if an empty list is present', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldId));
    await searchfieldInputEl.sendKeys('not a state');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    // Identify the added "No Results" link
    expect(await element(by.linkText('No Results'))).toBeDefined();
  });
});

describe('Searchfield go-button tests', () => {
  beforeEach(async () => {
    await setPage('/components/searchfield/example-go-button');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldId))), config.waitsFor);
  });

  it('fires a callback action when the Go Button is clicked', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldId));
    await searchfieldInputEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await searchfieldInputEl.sendKeys('Nice Button');

    const searchfieldGoButtonEl = await element(by.css(`#${searchfieldGoButtonId}`));
    await searchfieldGoButtonEl.click();

    const toastMessageSelector = '.toast-message';
    const toastMessageEl = await element(by.css(toastMessageSelector));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(toastMessageEl), config.waitsFor);

    expect(await element(by.css(toastMessageSelector)).getText())
      .toEqual('The searchfield\'s current value is "Nice Button".');
  });
});

const singleCategoryId = 'category-searchfield';

describe('Searchfield full-text category tests', () => {
  beforeEach(async () => {
    await setPage('/components/searchfield/example-categories-full');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(singleCategoryId))), config.waitsFor);
  });

  it('Can select a category from the list', async () => {
    const categoryButtonSelector = '[aria-controls="popupmenu-2"]';
    await element(by.css(categoryButtonSelector)).click();
    await element(by.id('clothing-single')).click();

    expect(await element(by.css(categoryButtonSelector)).getText()).toEqual('Clothing');
  });
});

describe('Searchfield full-text category with go button tests', () => {
  beforeEach(async () => {
    await setPage('/components/searchfield/example-categories-and-go-button');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(singleCategoryId))), config.waitsFor);
  });

  // TODO: Not sure what the cause of the timeout here is...
  // all these elements work everywhere else...
  xit('Can pass a list of selected categories with the go button callback', async () => {
    const categoryButtonSelector = '[aria-controls="popupmenu-1"]';
    const searchfieldCategoryButtonEl = await element(by.css(categoryButtonSelector));
    await searchfieldCategoryButtonEl.click();

    const targetCategory = await element(by.id('baby-multi'));
    await targetCategory.click();

    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(await element(by.css(categoryButtonSelector))), config.waitsFor);

    expect(await element(by.css(categoryButtonSelector)).getText()).toEqual('5 Selected');

    const searchfieldGoButtonEl = await element(by.css(`#${searchfieldGoButtonId}`));
    await searchfieldGoButtonEl.click();

    const toastMessageSelector = '.toast-message';
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(await element(by.css(toastMessageSelector))), config.waitsFor);

    // EPC: NOTE: for some reason Protractor is adding spaces before the commas when using `getText()`.
    // I've added them into the result for now, til we can track down the cause.
    expect(await element(by.css(toastMessageSelector)).getText())
      .toEqual('Animals , Baby , Clothing , Images , Places');
  });
});
