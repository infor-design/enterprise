const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const EC = protractor.ExpectedConditions;

const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnDropdown = async () => {
  const dropdownEl = element(by.css('div.dropdown'));
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
  await browser.driver.sleep(config.sleep);
  await dropdownEl.click();
};

describe('Dropdown example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open dropdown list on click', async () => {
    await clickOnDropdown();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should be able to select next element', async () => {
    const dropdownEl = await element(by.css('#custom-dropdown-id-1 + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);

    expect(await element(by.id('custom-dropdown-id-1')).getAttribute('value')).toEqual('NM');
  });

  it('Should select the active element on tab', async () => {
    const dropdownEl = await element(by.css('#custom-dropdown-id-1 + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(searchEl), config.waitsFor);

    await browser.driver.sleep(config.sleep);
    await browser.switchTo().activeElement().sendKeys('Oh');
    await browser.driver.sleep(config.sleep);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('custom-dropdown-id-1')).getAttribute('value')).toEqual('OH');
  });

  it('Should scroll down to end of list, and Vermont Should be visible', async () => {
    await clickOnDropdown();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);
    await browser.executeScript('document.querySelector("ul[role=\'listbox\']").scrollTop = 10000');
    await browser.driver.sleep(config.sleep);
    const dropdownElList = await element(by.css('ul[role="listbox"]'));
    const vermontOption = await element(by.css('li[data-val="VT"]'));
    const posVT = await vermontOption.getLocation();
    const dropdownElListSize = await dropdownElList.getSize();
    const posDropdownElList = await dropdownElList.getLocation();

    expect(posVT.y > posDropdownElList.y &&
      posVT.y < (posDropdownElList.y + dropdownElListSize.height)).toBeTruthy();
  });

  if (!utils.isIE()) {
    it('Should be accessible on click, and open with no WCAG 2AA violations', async () => { //eslint-disable-line
      await clickOnDropdown();
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

  if (!utils.isSafari()) {
    it('Should arrow down to New York, and focus', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      const dropdownSearchEl = await element(by.id('custom-dropdown-id-1-search'));
      await dropdownSearchEl.click();
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-focused'))), config.waitsFor);

      expect(await element(by.className('is-focused')).getText()).toEqual('New York');
    });
  }

  if (!utils.isSafari()) {
    it('Should not work when disabled', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await dropdownEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      const dropdownSearchEl = await element(by.id('custom-dropdown-id-1-search'));
      await dropdownSearchEl.click();
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-focused'))), config.waitsFor);

      expect(await element(by.className('is-focused')).getText()).toEqual('New York');
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const dropdownEl = element(by.css('div.dropdown'));
      const dropdownElList = element(by.id('dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownEl, 'dropdown-init')).toEqual(0);
      await clickOnDropdown();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownElList, 'dropdown-open')).toEqual(0);
    });
  }

  it('Should search for Colorado', async () => {
    const dropdownEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    const dropdownSearchEl = element(by.id('dropdown-search'));
    await dropdownSearchEl.click();
    await element(by.id('custom-dropdown-id-1-search')).clear().sendKeys('Colorado');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-focused .dropdown-highlight'))), config.waitsFor);

    expect(await element(by.className('is-focused')).getText()).toEqual('Colorado');
  });

  if (!utils.isSafari()) {
    it('Should keep the filter term in tact when pausing between keyboard presses', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver.sleep(config.sleep);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      await dropdownEl.sendKeys('New');

      // Wait for the list to open
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      const dropdownSearchEl = element(by.id('custom-dropdown-id-1-search'));

      await dropdownSearchEl.click();
      await dropdownSearchEl.sendKeys(' Jersey');

      await browser.driver.sleep(config.sleep);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);

      // SearchInput should display "New Jersey" and not just " Jersey"
      expect(await element(by.id('custom-dropdown-id-1-search')).getAttribute('value')).toEqual('New Jersey');
    });

    it('Should close an open list and tab to the next element without re-opening', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      await element(by.css('div.dropdown')).sendKeys('New');

      // Wait for the list to open
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);

      // Tab out
      await browser.actions().sendKeys(protractor.Key.TAB).perform();

      expect(await element(by.css('div.dropdown'))).not.toContain('is-open');
    });

    it('Should not allow the escape key to re-open a closed menu', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));

      await browser.driver
        .wait(EC.presenceOf(dropdownEl), config.waitsFor);
      await element(by.css('div.dropdown')).click();

      // Wait for the menu to be present
      // NOTE: Need to fix this once setTimeouts are removed (Github #794)
      // await browser.driver
      //  .wait(EC.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      await browser.driver.sleep(100);

      // First key press causes the menu to close
      await element(by.css('#custom-dropdown-id-1-search')).sendKeys(protractor.Key.ESCAPE);

      // Wait for the menu to disappear
      // NOTE: Need to fix this once setTimeouts are removed (Github #794)
      // await browser.driver
      //   .wait(EC.invisibilityOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
      await browser.driver.sleep(100);

      // Second key press should do nothing
      await element(by.css('div.dropdown')).sendKeys(protractor.Key.ESCAPE);

      // Sleep for a short period of time, because we're not sure if the menu will be present or not
      await browser.driver.sleep(100);

      // The Dropdown Pseudo element should no longer have focus
      expect(await element(by.css('div.dropdown')).getAttribute('class')).not.toContain('is-open');
    });

    it('Should be able to set id/automation id', async () => {
      await clickOnDropdown();
      await browser.driver.sleep(config.sleepShort);

      expect(await element(by.id('custom-dropdown-id-1')).getAttribute('id')).toEqual('custom-dropdown-id-1');
      expect(await element(by.id('custom-dropdown-id-1')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id');

      expect(await element(by.id('custom-dropdown-id-1-search')).getAttribute('id')).toEqual('custom-dropdown-id-1-search');
      expect(await element(by.id('custom-dropdown-id-1-search')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-search');

      expect(await element(by.id('custom-dropdown-id-1-search-label')).getAttribute('for')).toEqual('custom-dropdown-id-1-search');
      expect(await element(by.id('custom-dropdown-id-1-search-label')).getAttribute('id')).toEqual('custom-dropdown-id-1-search-label');
      expect(await element(by.id('custom-dropdown-id-1-search-label')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-search-label');

      expect(await element(by.id('custom-dropdown-id-1-dropdown')).getAttribute('id')).toEqual('custom-dropdown-id-1-dropdown');
      expect(await element(by.id('custom-dropdown-id-1-dropdown')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-dropdown');

      expect(await element(by.id('custom-dropdown-id-1-trigger')).getAttribute('id')).toEqual('custom-dropdown-id-1-trigger');
      expect(await element(by.id('custom-dropdown-id-1-trigger')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-trigger');

      expect(await element(by.id('custom-dropdown-id-1-listbox')).getAttribute('id')).toEqual('custom-dropdown-id-1-listbox');
      expect(await element(by.id('custom-dropdown-id-1-listbox')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-listbox');

      expect(await element(by.id('custom-dropdown-id-1-option-0')).getAttribute('id')).toEqual('custom-dropdown-id-1-option-0');
      expect(await element(by.id('custom-dropdown-id-1-option-0')).getAttribute('data-automation-id')).toEqual('custom-automation-dropdown-id-option-0');
    });
  }

  it('Should be able to reopen when closed by a menu button', async () => {
    let dropdownEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('custom-dropdown-id-1-search')).isDisplayed()).toBeTruthy();

    await element(by.css('.btn-actions')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('custom-dropdown-id-1-search')).isPresent()).toBeFalsy();
    await browser.driver.sleep(config.sleep);

    dropdownEl = await element(by.css('div.dropdown'));

    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('custom-dropdown-id-1-search')).isDisplayed()).toBeTruthy();
  });
});

describe('Dropdown example-ajax tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-ajax');
  });

  if (!utils.isSafari()) {
    it('Should make ajax request, and arrow down to New York, and focus', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.click();
      await browser.driver.sleep(config.sleep);
      const dropdownSearchEl = await element(by.id('dropdown-search'));
      await dropdownSearchEl.click();
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver.sleep(config.sleep);

      expect(await element(by.className('is-focused')).getText()).toEqual('American Samoa');
    });
  }
});

describe('Dropdown example-no-search-lsf tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-no-search-lsf');
  });

  it('Should select a Dropdown item when keying on a closed Dropdown component', async () => {
    const dropdownPseudoEl = await element.all(by.css('div.dropdown')).first();
    await browser.driver.sleep(config.sleep);

    await dropdownPseudoEl.sendKeys('r');
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('R - Rocket Raccoon');
  });

  it('Should cycle through dropdown options that begin with the same character', async () => {
    const dropdownPseudoEl = await element.all(by.css('div.dropdown')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownPseudoEl), config.waitsFor);

    await dropdownPseudoEl.sendKeys('t');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), 'T - Thor'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('T - Thor');

    await dropdownPseudoEl.sendKeys('t');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), 'T2 - Thanos'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('T2 - Thanos');

    await dropdownPseudoEl.sendKeys('t');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), 'T3 - That other one that won\'t get selected'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('T3 - That other one that won\'t get selected');

    await dropdownPseudoEl.sendKeys('t');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), 'T - Thor'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('T - Thor');
  });
});

describe('Dropdown example-no-search-filtering tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-no-search-filtering');
  });

  it('Should properly filter when multiple characters are typed ahead', async () => {
    const dropdownPseudoEl = await element.all(by.css('div.dropdown')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownPseudoEl), config.waitsFor);

    await dropdownPseudoEl.sendKeys('15');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '15'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('15');

    await dropdownPseudoEl.sendKeys('1');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '10'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('10');

    await dropdownPseudoEl.sendKeys('1');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '11'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('11');

    await dropdownPseudoEl.sendKeys('101');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '101'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('101');

    await dropdownPseudoEl.sendKeys('56');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '56'), config.waitsFor);

    expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('56');
  });

  if (!utils.isBS() && !utils.isCI()) {
    it('Should clear a previous dropdown selection when pressing DELETE', async () => {
      // On Macs, use "backspace" delete, instead of control keys' delete
      const keyPressed = utils.isMac() || utils.isBS() || utils.isCI() ? 'BACK_SPACE' : 'DELETE';
      const dropdownPseudoEl = await element.all(by.css('div.dropdown')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownPseudoEl), config.waitsFor);

      await dropdownPseudoEl.sendKeys('15');
      await browser.driver
        .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), '15'), config.waitsFor);

      expect(await element.all(by.css('div.dropdown')).first().getText()).toEqual('15');
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownPseudoEl), config.waitsFor);

      await dropdownPseudoEl.sendKeys(protractor.Key[keyPressed]);
      await browser.driver
        .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), ''), config.waitsFor);
      const dropdownHTML = await browser.executeScript('return document.querySelector("div.dropdown").innerHTML');

      expect(dropdownHTML).toEqual('<span><span class="audible">No-Search Dropdown </span></span>');
    });
  }
});

describe('Dropdown example-no-search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-no-search');
  });

  it('Should not change selection if a key is pressed that does not match a dropdown item', async () => {
    const dropdownPseudoEl = await element.all(by.css('div.dropdown')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownPseudoEl), config.waitsFor);

    await dropdownPseudoEl.sendKeys('z');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(await element.all(by.css('.dropdown span')).first(), ''), config.waitsFor);
    const dropdownHTML = await browser.executeScript('return document.querySelector("div.dropdown").innerHTML');

    expect(dropdownHTML).toEqual('<span><span class="audible">No-Search Dropdown </span></span>');
  });
});

describe('Dropdown typeahead-reloading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/test-reload-typeahead');
  });

  // Added to check highlighting of text characters
  // See Github #4141
  if (utils.isChrome() && utils.isCI()) {
    it('Highlights matched filter terms and should not visually regress', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      // Open the list
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);
      const dropdownSearchEl = await element(by.id('dropdown-search'));

      // Filter for "New"
      await dropdownSearchEl.sendKeys('New');
      await browser.driver.sleep(config.sleep);

      // Find the list element
      const listEl = await element(by.css('.dropdown-list'));

      // Make sure the matching text is highlighted and all results contain the match
      expect(await browser.imageComparison.checkElement(listEl, 'dropdown-highlight-filtered')).toEqual(0);
    });
  }

  if (!utils.isSafari()) {
    it('Should open with down arrow, make ajax request, filter to "new", make ajax request, down arrow to New Jersey, and focus', async () => {
      // Open the list
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      const dropdownSearchEl = await element(by.id('dropdown-search'));
      await dropdownSearchEl.click();

      // NOTE: Sleep simulates the Dropdown's default typeahead delay (300ms)
      await dropdownSearchEl.sendKeys('New');
      await browser.driver.sleep(config.sleep);

      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ENTER);

      expect(['', 'New Jersey']).toContain(await element.all(by.css('.dropdown span')).first().getText());
    });

    it('Should open by keying "new", make ajax request, down arrow to New Jersey, and focus', async () => {
      const dropdownEl = await element(by.css('div.dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      await dropdownEl.sendKeys('New');
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.dropdown.is-open'))), config.waitsFor);

      const dropdownSearchEl = await element(by.id('dropdown-search'));
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ENTER);

      expect(['<span class="audible">Typeahead-Reloaded Dropdown </span> New Jersey', 'New Jersey', ''])
        .toContain(await element.all(by.css('.dropdown span')).first().getText());
    });
  }
});

describe('Dropdown placeholder tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-placeholder');

    const dropdownEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
  });

  it('Show a placeholder', async () => {
    const selector = 'div.dropdown [data-placeholder-text]';
    const placeholderEl = await element(by.css(selector));

    expect(await element.all(by.css(selector)).count()).toEqual(1);
    expect(await placeholderEl.isDisplayed()).toBeTruthy();
    expect(await placeholderEl.getAttribute('data-placeholder-text')).toEqual('Select a State');
  });
});

describe('Dropdown placeholder with initially selected tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/test-placeholder-initial-selected');

    const dropdownEl = await element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
  });

  it('Should not show a placeholder', async () => {
    const selector = 'div.dropdown [data-placeholder-text]';
    const placeholderEl = await element(by.css(selector));

    expect(await element.all(by.css(selector)).count()).toEqual(1);
    expect(await placeholderEl.isDisplayed()).toBeTruthy();
    expect(await placeholderEl.getAttribute('data-placeholder-text')).toEqual('');
  });
});

describe('Dropdown readonly tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-readonly');
  });

  it('Should honor the tabindex', async () => {
    await element(by.css('#random-input-1')).sendKeys(protractor.Key.TAB);

    expect(await browser.driver.switchTo().activeElement().getText()).toEqual('Item 1');

    const dd = { id: 'readonly-dropdown', str: 'div.dropdown' };
    dd.el = await element(by.id(dd.id)).element(by.xpath('..')).element(by.css(dd.str));
    await dd.el.sendKeys(protractor.Key.TAB);

    expect(await browser.driver.switchTo().activeElement().getAttribute('id')).toEqual('random-input-2');
  });
});

describe('Dropdown xss tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/test-xss');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not inject scripts', async () => {
    const dropdownEl = await element(by.css('#states + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);

    expect(await element(by.id('states')).getAttribute('value')).toEqual('<script>window.alert(\'dropdown xss\')</script>XSS');
    await browser.driver.sleep(config.sleep);
    await utils.checkForErrors();
  });

  it('Should not inject scripts on reset list', async () => {
    const dropdownEl = await element(by.css('#states + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys('x');

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    expect(await element(by.id('list-option-1')).getText()).toEqual('<script>window.alert(\'dropdown xss\')</script>XSS');
    await utils.checkForErrors();
    await browser.driver.sleep(config.sleep);

    await searchEl.sendKeys(protractor.Key.BACK_SPACE);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('list-option-0')).getText()).toEqual('Hello');
    expect(await element(by.id('list-option-1')).getText()).toEqual('<script>window.alert(\'dropdown xss\')</script>XSS');
    expect(await element(by.id('list-option-2')).getText()).toEqual('World');

    await utils.checkForErrors();
  });

  it('Should not get confused filtering with encoding', async () => { //eslint-disable-line
    const dropdownEl = await element(by.css('#states + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys('l');

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    expect(await element(by.id('list-option-1')).getText()).toEqual('<script>window.alert(\'dropdown xss\')</script>XSS');
    await utils.checkForErrors();
  });

  it('Should filter on &', async () => { //eslint-disable-line
    const dropdownEl = await element(by.css('#states2 + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys('&');

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    expect(await element(by.id('list-option-1')).getText()).toEqual('Hello 0 1 2 & Hello 3 4 5');
    await utils.checkForErrors();
  });
});

describe('Dropdown badge tests', () => {
  it('Should not error on left to right', async () => {
    await utils.setPage('/components/dropdown/test-badges.html?layout=nofrills');
    await utils.checkForErrors();
  });

  it('Should not error on right to left', async () => {
    await utils.setPage('/components/dropdown/test-badges.html?layout=nofrills&&locale=he-IL');
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should look good on left to right', async () => {
      await utils.setPage('/components/dropdown/test-badges.html?layout=nofrills');
      const dropdownEl = element(by.css('div.dropdown'));
      const dropdownElList = element(by.id('dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownEl, 'dropdown-badges-init')).toEqual(0);
      await clickOnDropdown();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownElList, 'dropdown-badges-open')).toEqual(0);
    });

    it('Should look good on right to left', async () => {
      await utils.setPage('/components/dropdown/test-badges.html?layout=nofrills&&locale=he-IL');
      const dropdownEl = element(by.css('div.dropdown'));
      const dropdownElList = element(by.id('dropdown-list'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownEl, 'dropdown-badges-init-rtl')).toEqual(0);
      await clickOnDropdown();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownElList), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(dropdownElList, 'dropdown-badges-open-rtl')).toEqual(0);
    });
  }
});

describe('Dropdown selectValue() tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-setvalue?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should change its display value when its internal value changes (should not visually regress)', async () => {
      const dropdownEl = element(by.css('div.dropdown'));
      const updateBtnEl = element(by.css('#update-btn'));

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);

      // click the button to change the value of the Dropdown
      await updateBtnEl.click();

      // the update should occur and change to "Option Three"
      expect(await browser.imageComparison.checkElement(dropdownEl, 'dropdown-selectvalue')).toEqual(0);
    });
  }
});

describe('Dropdown with icons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-icons');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not change the last option icon when filtering', async () => {
    const dropdownEl = await element(by.css('select#example-icon + .dropdown-wrapper .dropdown'));

    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    const searchEl = await element(by.css('.dropdown-search'));
    await searchEl.clear().sendKeys(protractor.Key.BACK_SPACE);

    expect(await element(by.css('#list-option-4 svg use[href="#icon-notes"]')).getAttribute('href')).toEqual('#icon-notes');
  });
});

describe('Dropdown "No Search" stay-open behavior', () => {
  beforeEach(async () => {
    await utils.setPage('/components/dropdown/example-no-search-stay-open?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Highlights items that match search terms when the list is opened', async () => {
    // Find pseudo-elem and click
    const dropdownEl = element(by.css('div.dropdown'));
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();

    // Find search input
    await browser.driver.sleep(config.sleep);
    const searchInput = await element(by.id('dropdown-search'));

    // Find numbers that exist
    await searchInput.click();
    await searchInput.clear().sendKeys('102');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('is-focused')).getText()).toEqual('102');

    // Click to reset selection cursor, then find another
    await searchInput.click();
    await searchInput.clear().sendKeys('93');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('is-focused')).getText()).toEqual('93');

    // Try to find one that doesn't exist.  All items will become unhighlighted.
    await searchInput.click();
    await searchInput.clear().sendKeys('104');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('is-focused')).isPresent()).toBeFalsy();
  });

  it('can select keyed values with ENTER', async () => {
    // Find pseudo-elem and click
    const dropdownEl = element(by.css('div.dropdown'));
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();

    // Find search input
    await browser.driver.sleep(config.sleep);
    const searchInput = await element(by.id('dropdown-search'));

    // Highlight "102" and hit ENTER. 102 Should be selected.
    await searchInput.click();
    await searchInput.clear().sendKeys('102');
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(['', '102']).toContain(await element.all(by.css('div.dropdown span')).first().getText());
  });

  it('closes without selecting on pressing ESCAPE', async () => {
    // Find pseudo-elem and click
    const dropdownEl = element(by.css('div.dropdown'));
    await browser.driver.sleep(config.sleep);
    await dropdownEl.click();

    // Find search input
    await browser.driver.sleep(config.sleep);
    const searchInput = await element(by.id('dropdown-search'));

    // Highlight "75" and press ESCAPE. Nothing should be selected.
    await searchInput.click();
    await searchInput.clear().sendKeys('75');
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ESCAPE);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('div.dropdown span')).first().getText()).toBe('');
  });
});
