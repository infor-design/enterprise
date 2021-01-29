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

fdescribe('Multiselect example-states tests', () => {
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

fdescribe('Multiselect example-index tests', () => {
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
      // Open Multiselect
      await browser.driver.sleep(config.sleep);
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      await multiselectEl.click();

      // Click the search
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);
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
      // Open Multiselect
      await browser.driver.sleep(config.sleep);
      const multiselectEl = await element.all(by.css('div.dropdown')).first();
      await multiselectEl.click();

      // Click on the search input
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);
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

      expect(await browser.imageComparison.checkElement(multiselectEl, 'multiselect-init')).toEqual(0);

      await clickOnMultiselect();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectElList), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(multiselectElList, 'multiselect-open')).toEqual(0);
    });
  }

  it('Can show a filtered list of items that match a search term (Colorado)', async () => {
    // Open Multiselect
    await browser.driver.sleep(config.sleep);
    const multiselectEl = await element.all(by.css('div.dropdown')).first();
    await multiselectEl.click();

    // Click on the search input
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

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

    expect(await element.all(by.css('.is-disabled'))).toBeTruthy();
    await multiselectEl.click();

    expect(await element.all(by.css('.is-disabled'))).toBeTruthy();
  });
});

fdescribe('Multiselect example-clear-all tests', () => {
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

fdescribe('Multiselect typeahead-reloading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/test-reload-typeahead');
  });

  // Added to check highlighting of text characters
  // See Github #4141
  if (utils.isChrome() && utils.isCI()) {
    it('Highlights matched filter terms and should not visually regress', async () => {
      const multiselectEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      // Open the list
      await multiselectEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);
      const multiselectSearchEl = await element(by.id('dropdown-search'));

      // Filter for "New"
      await multiselectSearchEl.sendKeys('New');
      await browser.driver.sleep(config.sleep);

      // Find the list element
      const listEl = await element(by.css('.dropdown-list.multiple'));

      // Make sure the matching text is highlighted and all results contain the match
      expect(await browser.imageComparison.checkElement(listEl, 'multiselect-highlight-filtered')).toEqual(0);
    });
  }

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

fdescribe('Multiselect placeholder tests', () => {
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

fdescribe('Multiselect header strings tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/test-header-strings');

    const multiselectEl = await element(by.css('select.multiselect + .dropdown-wrapper div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have custom header strings', async () => {
    const selector = '#dropdown-list .group-label';
    await clickOnMultiselect();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-open'))), config.waitsFor);

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
    expect(await element.all(by.css(selector)).get(0).getText()).toBe('Chosen');
    expect(await element.all(by.css(selector)).get(1).getText()).toBe('Available to choose');
  });
});

fdescribe('Multiselect with Tags tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('Standard example should not visually regress', async () => {
      await utils.setPage('/components/multiselect/example-index');

      const multiselectStandardEl = await element(by.css('#multi-optgroup-tagged + .dropdown-wrapper div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectStandardEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      expect(await browser.imageComparison.checkElement(multiselectStandardEl, 'multiselect-tags-standard')).toEqual(0);
    });

    it('Disabled example should not visually regress', async () => {
      await utils.setPage('/components/multiselect/example-index');

      const multiselectDisabledEl = await element(by.css('#multi-disabled-tagged + .dropdown-wrapper div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(multiselectDisabledEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      expect(await browser.imageComparison.checkElement(multiselectDisabledEl, 'multiselect-tags-disabled')).toEqual(0);
    });
  }
});

fdescribe('Multiselect `showSearchUnderSelected` tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/multiselect/example-search-under-selected?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(400, 640);

      const multiEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(multiEl), config.waitsFor);

      // Just open the Dropdown
      await multiEl.click();
      const multiListEl = await element(by.css('#dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(multiListEl), config.waitsFor);

      // The test environment creates an incorrect baseline with the standard dropdown icon unless we
      // type a space and backspace first (simulating a search).
      const inputEl = await element(by.css('#dropdown-search'));
      await inputEl.click();
      await inputEl.sendKeys('n');
      await browser.driver.sleep(config.sleep);
      await inputEl.sendKeys(protractor.Key.BACK_SPACE);
      await browser.driver.sleep(config.sleep);

      // Ensure the Searchfield is underneath
      expect(await browser.imageComparison.checkScreen('multiselect-search-under-selected')).toEqual(0);

      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

fdescribe('Multiselect select all behavior tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      await utils.setPage('/components/multiselect/test-select-all-tags.html?layout=nofrills');

      // Resize page to fit a "full" Multiselect
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(500, 800);

      // Find/Open the Multiselect
      const multiEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(multiEl), config.waitsFor);
      await multiEl.click();
      const multiListEl = await element(by.css('#dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(multiListEl), config.waitsFor);

      // Click "Select All"
      await element(by.css('#dropdown-select-all-anchor')).click();

      // Snap a photo
      expect(await browser.imageComparison.checkScreen('multiselect-select-all-tags')).toEqual(0);

      // Put page back to original size
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }

  it('should not allow the tag list to become taller than the `tagListMaxHeight` setting', async () => {
    await utils.setPage('/components/multiselect/test-select-all-tags.html?layout=nofrills');

    // Find/Open the Multiselect
    const multiEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(multiEl), config.waitsFor);
    await multiEl.click();
    const multiListEl = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(multiListEl), config.waitsFor);

    // Click "Select All"
    await element(by.css('#dropdown-select-all-anchor')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('div.dropdown > .tag-list')).getAttribute('style')).toContain('max-height: 120px;');
  });

  it('should not display an option for selecting all items if no items are present', async () => {
    await utils.setPage('/components/multiselect/test-select-all-no-opts.html?layout=nofrills');

    // Find/Open the Multiselect
    const multiEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(multiEl), config.waitsFor);
    await multiEl.click();
    const multiListEl = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(multiListEl), config.waitsFor);

    // No checkbox for "Select All" should be present
    expect(await element(by.css('#dropdown-select-all-anchor')).isPresent()).toBeFalsy();
  });

  it('should only "Select All" filtered items by default', async () => {
    await utils.setPage('/components/multiselect/test-select-all-tags.html?layout=nofrills');

    // Find/Open the Multiselect with Typeahead Reloading by pressing "F"
    const multiEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(multiEl), config.waitsFor);
    await multiEl.sendKeys('f');
    await browser.driver.sleep(config.sleep);

    // Click "Select All"
    await element(by.css('#dropdown-select-all-anchor')).click();
    await browser.driver.sleep(config.sleep);

    // Track the number of selected items
    const selected = await element.all(by.css('.dropdown-option.is-selected')).count();

    expect(selected).toEqual(4);
  });
});
