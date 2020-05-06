const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnMultiselect = async () => {
  const multiselectEl = await element.all(by.css('div.dropdown')).first();
  await browser.driver
    .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
  await multiselectEl.click();
};

const setTimer = () => {
  let starttime = 0;
  browser.controlFlow().execute(() => {
    starttime = Date.now();
  });
  return {
    get elapsed() {
      return browser.controlFlow().execute(() => Date.now() - starttime);
    }
  };
};

describe('Multiselect example-states tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-states');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open multiselect list on click', async () => {
    await clickOnMultiselect();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should scroll down to end of list, and Vermont should be visible', async () => {
    await clickOnMultiselect();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

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
    it('Should show validation message error "Required" on tab out', async () => {
      const multiselectEl = await element.all(by.css('div.dropdown')).get(2);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);

      await multiselectEl.sendKeys(protractor.Key.TAB);
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('.message-text')).getText()).toEqual('Required');
    });
  }

  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      await clickOnMultiselect();
      const res = await axePageObjects(browser.params.theme);

      // Not sure why CI has one error we cannot inspect.
      if (utils.isCI()) {
        expect(res.violations.length).toBeLessThan(2);
      } else {
        expect(res.violations.length).toEqual(0);
      }
      if (res.violations.length > 0) {
        console.warn(res.violations);
      }
    });
  }
});

describe('Multiselect example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-index');
  });

  if (!utils.isSafari()) {
    it('Can navigate and properly focus dropdown list elements with the keyboard', async () => {
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await multiselectEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      const multiselectSearchEl = await element(by.id('dropdown-search'));
      await multiselectSearchEl.click();
      await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.className('is-focused'))), config.waitsFor);

      expect(await element(by.className('is-focused')).getText()).toEqual('Arizona');
    });

    // Edited for #920
    it('Can deselect all items and display an empty pseudo-element', async () => {
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await multiselectEl.click();

      const multiselectSearchEl = await element(by.id('dropdown-search'));
      await multiselectSearchEl.click();

      await browser.driver.sleep(config.sleep);

      await multiselectSearchEl.sendKeys(protractor.Key.ENTER);
      await multiselectSearchEl.sendKeys(protractor.Key.ESCAPE);

      const acceptableResults = [
        '', // on CI
        '<span class="audible">States (Max 10) </span>' // on Local
      ];

      expect(acceptableResults).toContain(await element.all(by.css('.dropdown span')).first().getText());
    });

    // Edited for #920
    it('Can select multiple items and display them in the pseudo-element', async () => {
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await multiselectEl.click();
      await element(by.id('dropdown-search')).click();

      const multiselectSearchEl = await element(by.id('dropdown-search'));
      await multiselectSearchEl.click();

      await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectSearchEl.sendKeys(protractor.Key.ENTER);
      await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await multiselectSearchEl.sendKeys(protractor.Key.ENTER);

      expect(await element(by.className('is-focused')).getText()).toEqual('Arkansas');

      await multiselectSearchEl.sendKeys(protractor.Key.ESCAPE);
      const multiselectSearchElVal = await element.all(by.css('div.dropdown')).first().getText();

      expect(await multiselectSearchElVal).toEqual('Alaska, Arizona, Arkansas');
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      const multiselectElList = await element(by.id('dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(multiselectEl, 'multiselect-init')).toEqual(0);

      await clickOnMultiselect();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectElList), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(multiselectElList, 'multiselect-open')).toEqual(0);
    });
  }

  it('Can show a filtered list of items that match a search term (Colorado)', async () => {
    const multiselectEl = await element.all(by.css('div.dropdown')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await multiselectEl.click();
    await element(by.id('dropdown-search')).click();
    await browser.driver.switchTo().activeElement().clear();
    await element(by.id('dropdown-search')).sendKeys('Colorado');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-focused .dropdown-highlight'))), config.waitsFor);

    expect(await element(by.className('is-focused')).getText()).toEqual('Colorado');
  });

  it('Should do nothing on disabled', async () => {
    const multiselectEl = await element.all(by.css('div.dropdown')).get(1);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);

    expect(await element.all(by.className('is-disabled')).first().getAttribute('disabled')).toBeTruthy();
    await multiselectEl.click();

    expect(await element.all(by.className('is-disabled')).first().getAttribute('disabled')).toBeTruthy();
  });
});

describe('Multiselect example-clear-all tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-clear-all');
  });

  if (!utils.isSafari()) {
    it('Should clear all', async () => {
      const buttonEl = await element(by.id('btn-clear'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await element.all(by.css('.dropdown span')).first().getText()).toEqual('Orange');
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), ''), config.waitsFor);

      expect(await element.all(by.css('.dropdown span')).first().getText()).toEqual('');
    });
  }
});

describe('Multiselect example-select-all-performance tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/test-select-all-performance');
  });

  xit('Should select all performance test', async () => {
    const timer = setTimer();
    await clickOnMultiselect();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

    const all = await element.all(by.css('.dropdown-option')).count();
    const selectAll = element(by.css('li.dropdown-select-all-list-item'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(selectAll), config.waitsFor);

    await selectAll.click();
    const selected = await element.all(by.css('.dropdown-option.is-selected')).count();

    expect(selected).toEqual(all);
    expect(timer.elapsed).toBeLessThan(1300);
  });

  xit('Should clear all selected performance test', async () => {
    const timer = setTimer();
    await clickOnMultiselect();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

    const all = await element.all(by.css('.dropdown-option')).count();
    const selectAll = element(by.css('li.dropdown-select-all-list-item'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(selectAll), config.waitsFor);

    await selectAll.click();
    let selected = await element.all(by.css('.dropdown-option.is-selected')).count();

    expect(selected).toEqual(all);

    await selectAll.click();
    selected = await element.all(by.css('.dropdown-option.is-selected')).count();

    expect(selected).toEqual(0);
    expect(timer.elapsed).toBeLessThan(2200);
  });
});

describe('Multiselect typeahead-reloading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/test-reload-typeahead');
  });

  if (!utils.isSafari()) {
    // Edited for #920
    it('Should make ajax calls properly on typeahead for multiple items', async () => {
      await browser.driver.sleep(config.sleep);

      // Open the list
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);
      const dropdownSearchEl = await element(by.id('dropdown-search'));

      // Search for "new" and select "New Jersey"
      // NOTE: Sleep simulates the Multiselect's default typeahead delay (300ms)
      await dropdownSearchEl.sendKeys('New');
      await browser.driver.sleep(config.sleep);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ENTER);

      await browser.driver.sleep(config.sleep);

      // Arrow down twice and select "New York"
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ENTER);
      await dropdownSearchEl.sendKeys(protractor.Key.ESCAPE);

      await browser.driver.sleep(config.sleep);

      const acceptableResults = [
        'New Jersey, New York', // on CI
        '<span class="audible">Typeahead-Reloaded Multiselect </span>New Jersey, New York', // on Local
      ];

      expect(acceptableResults).toContain(await element.all(by.css('.dropdown span')).first().getText());
    });
  }
});

describe('Multiselect placeholder tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-placeholder');

    const multiselectEl = await element(by.css('select.multiselect + .dropdown-wrapper div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
  });

  it('Show a placeholder', async () => {
    const selector = 'select.multiselect + .dropdown-wrapper div.dropdown [data-placeholder-text]';
    const placeholderEl = await element(by.css(selector));

    expect(await element.all(by.css(selector)).count()).toEqual(1);
    expect(await placeholderEl.isDisplayed()).toBeTruthy();
    expect(await placeholderEl.getAttribute('data-placeholder-text')).toEqual('Select a State');
  });
});

describe('Multiselect with Tags tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('Standard example should not visually regress', async () => {
      await utils.setPage('/components/multiselect/example-index');

      const multiselectStandardEl = await element(by.css('#multi-optgroup-tagged + .dropdown-wrapper div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectStandardEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      expect(await browser.protractorImageComparison.checkElement(multiselectStandardEl, 'multiselect-tags-standard')).toEqual(0);
    });

    it('Disabled example should not visually regress', async () => {
      await utils.setPage('/components/multiselect/example-index');

      const multiselectDisabledEl = await element(by.css('#multi-disabled-tagged + .dropdown-wrapper div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectDisabledEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      expect(await browser.protractorImageComparison.checkElement(multiselectDisabledEl, 'multiselect-tags-disabled')).toEqual(0);
    });
  }
});

describe('Multiselect `showSearchUnderSelected` tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-search-under-selected?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should not visually regress', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(400, 640);

    const multiEl = await element(by.css('div.multiselect'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiEl), config.waitsFor);

    // Just open the Dropdown
    await multiEl.click();
    const multiListEl = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiListEl), config.waitsFor);

    // Ensure the Searchfield is underneath
    expect(await browser.protractorImageComparison.checkScreen('multiselect-search-under-selected')).toEqual(0);

    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});
