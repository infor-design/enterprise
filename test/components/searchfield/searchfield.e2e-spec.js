// TODO: Write WCAG tests
// TODO: Write Visual Regression tests

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const searchfieldId = 'searchfield';
const searchfieldGoButtonId = 'searchfield-go-button--1';

fdescribe('Searchfield example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/searchfield/example-index');
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
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(searchfieldInputEl, 'searchfield-init')).toEqual(0);
      await searchfieldInputEl.clear();
      await searchfieldInputEl.sendKeys('c');
      await searchfieldInputEl.sendKeys('o');
      await browser.driver.sleep(config.sleep);
      await searchfieldInputEl.sendKeys(protractor.Key.ARROW_DOWN);

      expect(await browser.imageComparison.checkElement(searchfieldSection, 'searchfield-open')).toEqual(0);
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

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('searchfield')).getAttribute('id')).toEqual('searchfield');
    expect(await element(by.id('searchfield')).getAttribute('data-automation-id')).toEqual('searchfield-automation-id');

    expect(await element(by.css('.searchfield-wrapper button.close')).getAttribute('data-automation-id')).toEqual('searchfield-automation-id-btn-close');
  });
});

describe('Searchfield go-button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/searchfield/example-go-button');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldId))), config.waitsFor);
  });

  it('fires a callback action when the Go Button is clicked', async () => {
    await element(by.id(searchfieldId)).sendKeys('Nice Button');

    const searchfieldGoButtonEl = await element(by.css(`#${searchfieldGoButtonId}`));
    await searchfieldGoButtonEl.click();

    const toastMessageSelector = '.toast-message';
    const toastMessageEl = await element(by.css(toastMessageSelector));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(toastMessageEl), config.waitsFor);

    expect(await element(by.css(toastMessageSelector)).getText())
      .toEqual('The searchfield\'s current value is "Nice Button".');
  });
});

const singleCategoryId = 'category-searchfield';

describe('Searchfield full-text category tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/searchfield/example-categories-full');
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

const searchfieldClearId = 'searchfield';

describe('Searchfield clearable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/searchfield/example-clear-api.html');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldClearId))), config.waitsFor);
  });

  it('Should clear the searchfield', async () => {
    const searchfieldInputEl = await element(by.id(searchfieldClearId));
    const closeBtn = await element(by.css('.close'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);

    await searchfieldInputEl.clear();
    await searchfieldInputEl.sendKeys('ne');

    await closeBtn.click();

    expect(await searchfieldInputEl.getText()).toEqual('');
  });
});

if (utils.isChrome() && utils.isCI()) {
  describe('Searchfield `collapseSize` tests', () => {
    beforeEach(async () => {
      await utils.setPage('/components/searchfield/test-configure-close-size?layout=nofrills');
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.toolbar-section.search'))), config.waitsFor);
      await browser.driver.sleep(config.sleep);
    });

    it('Should not visual regress on test-configure-close-size', async () => {
      expect(await browser.imageComparison.checkElement(element(by.css('.toolbar-section.search')), 'searchfield-collapse-size')).toEqual(0);
    });
  });

  describe('Searchfield placement tests', () => {
    beforeEach(async () => {
      await utils.setPage('/components/searchfield/test-place-on-bottom.html?layout=nofrills');
      await browser.driver
        .wait(protractor.ExpectedConditions
          .presenceOf(element(by.id('searchfield-template'))), config.waitsFor);
    });

    it('should correctly place the results list above the field if it can\'t fit beneath (visual regression)', async () => {
      // shrink the page to check ajax menu button in the overflow
      const windowSize = await browser.driver.manage().window().getSize();
      browser.driver.manage().window().setSize(640, 480);
      await browser.driver.sleep(config.sleep);

      const searchfieldInputEl = await element(by.id('searchfield-template'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      await searchfieldInputEl.clear();
      await searchfieldInputEl.sendKeys('n');
      await browser.driver.sleep(config.sleep);

      // blur the input field first, so we don't accidentaly get a text cursor in the screen capture.
      await browser.executeScript('document.activeElement.blur();').then(async () => {
        expect(await browser.imageComparison.checkElement(await element(by.css('.container')), 'searchfield-above-01')).toEqual(0);
      });

      await searchfieldInputEl.sendKeys('ew');
      await browser.driver.sleep(config.sleep);

      // blur the input field first, so we don't accidentaly get a text cursor in the screen capture.
      await browser.executeScript('document.activeElement.blur();').then(async () => {
        expect(await browser.imageComparison.checkElement(await element(by.css('.container')), 'searchfield-above-02')).toEqual(0);
      });

      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  });
}
