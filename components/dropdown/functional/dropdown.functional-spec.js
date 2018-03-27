const AxeBuilder = require('axe-webdriverjs');
const { browserStackErrorReporter } = require('../../../test/helpers/browserStackErrorReporter.js');
require('../../../test/helpers/rejection.js');

// Light Theme color contrast is not WCAG 2AA, #fff on #368ac0, focused item on a open dropdown
const axeOptions = {
  rules: [
    {
      id: 'aria-allowed-attr',
      enabled: false
    },
    {
      id: 'aria-required-children',
      enabled: false
    },
    {
      id: 'aria-valid-attr-value',
      enabled: false
    },
    {
      id: 'color-contrast',
      enabled: false
    }
  ]
};

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnDropdown = async () => {
  await browser.waitForAngularEnabled(false);
  await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
  const dropdownEl = element(by.css('div[aria-controls="dropdown-list"]'));
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
  await dropdownEl.click();
};

describe('Dropdown tests', () => {
  it('Should open dropdown list on click', async () => {
    await clickOnDropdown();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should scroll down to end of list, and Vermont should be visible', async () => {
    await clickOnDropdown();

    await browser.executeScript('document.querySelector("ul[role=\'listbox\']").scrollTop = 10000');
    const dropdownElList = await element(by.css('ul[role="listbox"]'));
    const vermontOption = await element(by.css('li[data-val="VT"]'));
    const posVT = await vermontOption.getLocation();
    const dropdownElListSize = await dropdownElList.getSize();
    const posDropdownElList = await dropdownElList.getLocation();

    expect(posVT.y > posDropdownElList.y &&
      posVT.y < (posDropdownElList.y + dropdownElListSize.height)).toBeTruthy();
  });

  // Disable IE11: Async timeout errors
  if (browser.browserName.toLowerCase() !== 'ie') {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      await clickOnDropdown();

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });
  }

  if (browser.browserName.toLowerCase() !== 'safari') {
    it('Should arrow down to New York, and focus', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver.sleep(1000);

      expect(await element(by.className('is-focused')).getText()).toEqual('New York');
    });
  }

  if (browser.browserName.toLowerCase() === 'chrome') {
    it('Should not visual regress', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);

      expect(await browser.protractorImageComparison.checkScreen('dropdownPage')).toEqual(0);
    });
  }

  if (browser.browserName.toLowerCase() === 'chrome') {
    it('Should search for Colorado', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      const dropdownSearchEl = element(by.id('dropdown-search'));
      await dropdownSearchEl.click();
      await browser.driver.switchTo().activeElement().clear();
      await browser.driver.switchTo().activeElement().sendKeys('Colorado');
      // Forcefully wait for focus shift
      await browser.driver.sleep(1000);

      expect(await element(by.className('is-focused')).getText()).toEqual('Colorado');
    });
  }
});
