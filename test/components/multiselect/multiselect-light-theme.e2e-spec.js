const AxeBuilder = require('axe-webdriverjs');

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const rules = requireHelper('default-axe-options');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axeOptions = { rules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnMultiselect = async () => {
  const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
  await browser.driver
    .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
  await multiselectEl.click();
};

describe('Multiselect example-states tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/multiselect/example-states');
  });

  it('Should open multiselect list on click', async () => {
    await clickOnMultiselect();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should scroll down to end of list, and Vermont should be visible', async () => {
    await clickOnMultiselect();

    await browser.executeScript('document.querySelector("ul[role=\'listbox\']").scrollTop = 10000');
    const multiselectElList = await element(by.css('ul[role="listbox"]'));
    const vermontOption = await element(by.css('li[data-val="VT"]'));
    const posVT = await vermontOption.getLocation();
    const multiselectElListSize = await multiselectElList.getSize();
    const posMultiselectElList = await multiselectElList.getLocation();

    expect(posVT.y > posMultiselectElList.y &&
      posVT.y < (posMultiselectElList.y + multiselectElListSize.height)).toBeTruthy();
  });

  if (!utils.isSafari()) {
    xit('Should show validation message error "Required" on tab out', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).get(2);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.TAB);

      expect(await element(by.css('.message-text')).getText()).toEqual('Required');
    });

    it('Should show validation message error "Required" on click', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).get(2);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await element.all(by.css('.trigger')).first().click();

      expect(await element(by.css('.message-text')).getText()).toEqual('Required');
    });
  }

  // Exclude IE11: Async timeout errors
  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      await clickOnMultiselect();

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });
  }
});

describe('Multiselect example-index tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/multiselect/example-index');
  });

  if (!utils.isSafari()) {
    it('Should arrow down to Arizona, and focus', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await multiselectEl.click();
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver.sleep(config.sleep);

      expect(await element(by.className('is-focused')).getText()).toEqual('Arizona');
    });

    xit('Should tab into deselect Alaska then tab out and input should be empty', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.ENTER);
      await multiselectEl.sendKeys(protractor.Key.TAB);

      expect(await element.all(by.css('.dropdown span')).first().getText()).toEqual('');
    });

    it('Should arrow down to Arizona select, arrow down, and select Arkansas, and update search input', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await multiselectEl.click();
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectEl.sendKeys(protractor.Key.SPACE);
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectEl.sendKeys(protractor.Key.SPACE);

      expect(await element(by.className('is-focused')).getText()).toEqual('Arkansas');
      const multiselectSearchElVal = element(by.id('dropdown-search')).getAttribute('value');

      expect(await multiselectSearchElVal).toEqual('Alaska, Arizona, Arkansas');
    });
  }

  if (utils.isChrome()) {
    xit('Should not visual regress', async () => {
      const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);

      expect(await browser.protractorImageComparison.checkScreen('multiselectPage')).toEqual(0);
    });
  }

  it('Should search for Colorado', async () => {
    const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await multiselectEl.click();
    const multiselectSearchEl = element(by.id('dropdown-search'));
    await multiselectSearchEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await browser.driver.switchTo().activeElement().sendKeys('Colorado');
    // Forcefully wait for focus shift
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('is-focused')).getText()).toEqual('Colorado');
  });

  it('Should do nothing on disabled', async () => {
    const multiselectEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).get(1);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);

    expect(await element.all(by.className('is-disabled')).first().getAttribute('disabled')).toBeTruthy();
    await multiselectEl.click();

    expect(await element.all(by.className('is-disabled')).first().getAttribute('disabled')).toBeTruthy();
  });
});

describe('Multiselect example-clear-all tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/multiselect/example-clear-all');
  });

  if (!utils.isSafari()) {
    it('Should clear all', async () => {
      const buttonEl = await element(by.id('btn-clear'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await element(by.css('.dropdown span')).getText()).toEqual('Orange');
      await buttonEl.click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('.dropdown span')).getText()).toEqual('');
    });
  }
});
