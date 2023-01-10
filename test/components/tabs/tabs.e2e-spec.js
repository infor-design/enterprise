const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

const clickTabTest = async (index) => {
  const tabElTrigger = await element.all(by.className('tab')).get(index);
  await tabElTrigger.click();
  await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(element.all(by.className('tab-panel')).get(index)), config.waitsFor);

  expect(await element.all(by.className('tab-panel')).get(index).getAttribute('class')).toContain('can-show');
  expect(await element.all(by.className('tab')).get(index).getAttribute('class')).toContain('is-selected');
};

describe('Tabs click example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-index?theme=classic');
    const tabsEl = await element(by.id('tabs-normal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-index', async () => {
      const tabsEl = await element(by.id('tabs-normal'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-init')).toEqual(0);
    });
  }

  it('should open 5th tab, on click', async () => {
    await clickTabTest('4');
  });

  it('should open 5th tab, 3rd, then 2nd tab, on click screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tabs-normal'))), config.waitsFor);
    await clickTabTest('4');
    await clickTabTest('2');
    await clickTabTest('1');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should open 5th tab, open menu tab-popupmenu, and list correct tab on screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tabs-normal'))), config.waitsFor);
    await clickTabTest('4');
    await element(by.css('.tab-more .icon-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu.is-open'))), config.waitsFor);

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(4).getAttribute('class')).toContain('is-checked');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should open 5th tab, and select 1st tab on tab-popupmenu on screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tabs-normal'))), config.waitsFor);
    await clickTabTest('4');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
    await element(by.className('tab-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.tab-more.is-open'))), config.waitsFor);

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(4).getAttribute('class')).toContain('is-checked');
    await element.all(by.css('#tab-container-popupmenu li')).get(1).click();

    expect(await element(by.css('.tab-list .is-selected')).getText()).toContain('Opportunities');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should open 5th, 3rd, then 2nd tab, on click', async () => {
    await clickTabTest('4');
    await clickTabTest('2');
    await clickTabTest('1');
  });
});

describe('Tabs click example-counts tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-counts?theme=classic');
    const tabsEl = await element(by.id('tabs-counts'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-counts', async () => {
      const tabsEl = await element(by.id('tabs-counts'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-counts')).toEqual(0);
    });
  }

  it('should open 5th tab, on click on count', async () => {
    await clickTabTest('4');
  });

  it('should open 5th, 3rd, then 2nd tab, on click on count', async () => {
    await clickTabTest('4');
    await clickTabTest('2');
    await clickTabTest('1');
  });

  it('should open 4th tab, 3rd, then 2nd tab, on click screen width of 500px on count', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tabs-counts'))), config.waitsFor);
    await clickTabTest('3');
    await clickTabTest('2');
    await clickTabTest('1');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Tabs click example-counts new tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-counts?theme=new');
    const tabsEl = await element(by.id('tabs-counts'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-counts in new', async () => {
      const tabsEl = await element(by.id('tabs-counts'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-counts-new')).toEqual(0);
    });
  }
});

describe('Tabs keyboard example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-index');
    const tabsEl = await element(by.id('tabs-normal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);

    const selectedTab = await element(by.css('.tab.is-selected > a'));
    await selectedTab.click();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome()) {
    it('should open 5th tab, on arrow right', async () => {
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#tabs-normal-notes.is-visible'))), config.waitsFor);

      expect(await element(by.id('tabs-normal-notes')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('is-selected');
    });

    it('should open 5th tab, on arrow down', async () => {
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#tabs-normal-notes.is-visible'))), config.waitsFor);

      expect(await element(by.id('tabs-normal-notes')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('is-selected');
    });

    it('should open 1st tab, on arrow up', async () => {
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#tabs-normal-contracts.is-visible'))), config.waitsFor);

      expect(await element(by.id('tabs-normal-contracts')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(0).getAttribute('class')).toContain('is-selected');
    });

    it('should open 1st tab, on arrow left', async () => {
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#tabs-normal-contracts.is-visible'))), config.waitsFor);

      expect(await element(by.id('tabs-normal-contracts')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(0).getAttribute('class')).toContain('is-selected');
    });

    it('should arrow to 1st tab, open menu tab-popupmenu, and list correct tab on screen width of 500px', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(500, 600);
      await browser.driver.sleep(config.sleep);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#tabs-normal-contracts.is-visible'))), config.waitsFor);
      await browser.driver.sleep(config.sleep);
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu'))), config.waitsFor);

      expect(await element.all(by.css('#tab-container-popupmenu li')).get(0).getAttribute('class')).toContain('is-checked');
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Tabs click example-add-tab button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-add-tab-button?theme=classic');
    const tabsEl = await element(by.id('tab1'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  // See issue #4093
  it('should insert tabs at the end of the tab list when applicable', async () => {
    const inputNameEl = await element(by.css('#tab-name'));
    const inputContentEl = await element(by.css('#tab-content'));
    const inputTabIndexEl = await element(by.css('#tab-index'));
    const addBtn = await element(by.css('#add-capable-tabs .add-tab-button'));

    // Fill out form fields
    await inputNameEl.sendKeys('Riya');
    await inputContentEl.sendKeys('Riya');
    await inputTabIndexEl.sendKeys('3');

    // Click Add button
    await addBtn.click();

    // Analyze the list and ensure we have 4 tabs, with our new tab at the end
    expect(await element.all(by.className('tab')).get(3)).toBeDefined();
    expect(await element.all(by.className('tab')).get(3).getText()).toEqual('Riya');
  });

  it('should remove add on destroy', async () => {
    expect(await element.all(by.css('.add-tab-button')).count()).toEqual(1);
    await element(by.id('reinvoke')).click();

    expect(await element.all(by.css('.add-tab-button')).count()).toEqual(1);
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-add-tab-button', async () => {
      const tabsEl = await element(by.id('add-capable-tabs'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-add-tab')).toEqual(0);
    });
  }

  it('should add two tabs, on click, then click', async () => {
    await clickTabTest('1');
    const addTabEl = await element(by.className('add-tab-button'));
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(3)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(3).getAttribute('id')).toContain('new-tab-0');
    expect(await element.all(by.className('tab')).get(3).getAttribute('class')).toContain('dismissible');

    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(4)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(4).getAttribute('id')).toContain('new-tab-1');
    expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('dismissible');
  });

  it('should add two tabs, on click, then click, submenu should appear with correct selection at 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await clickTabTest('1');
    const addTabEl = await element(by.className('add-tab-button'));
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(3)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(3).getAttribute('id')).toContain('new-tab-0');
    expect(await element.all(by.className('tab')).get(3).getAttribute('class')).toContain('dismissible');

    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(4)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(4).getAttribute('id')).toContain('new-tab-1');
    expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('dismissible');

    await element(by.css('.tab-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu.is-open'))), config.waitsFor);
    await clickTabTest('2');
    await element(by.css('.tab-more')).click();

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(2).getAttribute('class')).toContain('is-checked');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should add two tabs, on click, submenu should select correct tab at 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await clickTabTest('1');
    const addTabEl = await element(by.className('add-tab-button'));
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(3)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(3).getAttribute('id')).toContain('new-tab-0');
    expect(await element.all(by.className('tab')).get(3).getAttribute('class')).toContain('dismissible');

    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(4)), config.waitsFor);

    expect(await element.all(by.className('tab-panel')).get(4).getAttribute('id')).toContain('new-tab-1');
    expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('dismissible');

    await element(by.css('.tab-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu.is-open'))), config.waitsFor);
    await element.all(by.css('#tab-container-popupmenu li')).get(4).click();

    expect(await element.all(by.className('tab')).get(4).getAttribute('class')).toContain('is-selected');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Tabs click example-dropdown-tabs tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-dropdown-tabs');
    const tabsContainerEl = await element(by.className('tab-list-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-dropdown-tabs?theme=classic', async () => {
      const tabsEl = await element(by.id('tabs-dropdown'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-dropdown')).toEqual(0);
    });
  }

  it('should open dropdown tab', async () => {
    await element.all(by.className('tab')).get(1).click();

    expect(await element.all(by.className('tab')).get(1).getAttribute('class')).toContain('is-open');
  });

  it('should select dropdown tab on click', async () => {
    await element.all(by.className('tab')).get(1).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.is-open'))), config.waitsFor);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.dropdown-tab'))), config.waitsFor);
    await element.all(by.css('.dropdown-tab li')).get(1).click();

    expect(await element(by.id('tabs-dropdown-paper-plates')).getAttribute('class')).toContain('can-show');
    expect(await element(by.id('tabs-dropdown-paper-plates')).getAttribute('class')).toContain('tab-panel');
    expect(await element(by.id('tabs-dropdown-paper-plates')).getAttribute('class')).toContain('is-visible');
  });
});

describe('Tabs click example-url-hash-change tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-url-hash-change');
    const tabsContainerEl = await element(by.id('tabs'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should correctly updated url on tab click', async () => {
    await element.all(by.className('tab')).get(1).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.urlContains('tab-number-two'), config.waitsFor);

    expect(await element.all(by.className('tab')).get(1).getAttribute('class')).toContain('is-selected');

    await element.all(by.className('tab')).get(3).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.urlContains('tab-number-four'), config.waitsFor);

    expect(await element.all(by.className('tab')).get(3).getAttribute('class')).toContain('is-selected');
  });
});

describe('Tabs ajax as source tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/test-ajax-source-as-string');
    const tabsContainerEl = await element(by.id('ajaxified-tabs'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  if (!utils.isCI() && !utils.isBS()) {
    it('should not have errors', async () => {
      await utils.checkForErrors();
    });

    // This test is being flaky on ci so ignoring there.
    it('should be able to activate tabs', async () => {
      expect(await element(by.id('tab-one')).getAttribute('innerHTML')).not.toBe('');

      await element.all(by.className('tab')).get(2).click();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#tab-three.is-visible'))), config.waitsFor);

      expect(await element(by.id('tab-three')).getAttribute('innerHTML')).not.toBe('');
    });
  }
});

describe('Tabs focus after enable/disable programmatically', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/example-enable-disable-individual-tabs-with-keydown');
    const tabsContainerEl = await element(by.id('programmatic-tabs'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should not change focus after enable/disable tab', async () => {
    let formTab = await element(by.css('a[href="#programmatic-tabs-form-elements"]')).element(by.xpath('..'));

    expect(await formTab.getAttribute('class')).toContain('tab');
    expect(await formTab.getAttribute('class')).not.toContain('is-disabled');

    let inputEl = await element(by.css('#disable'));
    await inputEl.click();
    await inputEl.sendKeys(protractor.Key.ARROW_DOWN);
    formTab = await element(by.css('a[href="#programmatic-tabs-form-elements"]')).element(by.xpath('..'));

    expect(await formTab.getAttribute('class')).toContain('tab');
    expect(await formTab.getAttribute('class')).toContain('is-disabled');
    expect(await browser.driver.switchTo().activeElement().getAttribute('id')).toEqual('disable');

    inputEl = await element(by.css('#enable'));
    await inputEl.click();
    await inputEl.sendKeys(protractor.Key.ARROW_DOWN);
    formTab = await element(by.css('a[href="#programmatic-tabs-form-elements"]')).element(by.xpath('..'));

    expect(await formTab.getAttribute('class')).toContain('tab');
    expect(await formTab.getAttribute('class')).not.toContain('is-disabled');
    expect(await browser.driver.switchTo().activeElement().getAttribute('id')).toEqual('enable');
  });
});

describe('Tabs nested tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/test-nested-horizontal-tabs');
    const tabsContainerEl = await element(by.id('main-tabs-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  // See Github #4356
  it('can remove nested child tabs', async () => {
    // Ensure nested tab container is loaded
    const nestedTabsContainerEl = await element(by.id('nested-tabs-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(nestedTabsContainerEl), config.waitsFor);

    // Check that Tab #4 exists
    expect(await element(by.id('tab4')).isPresent()).toBeTruthy();

    // Call the `destroy()` method
    const removeScript = "$('#nested-tabs-container').data('tabs').remove('tab4')";
    browser.executeScript(removeScript);

    // Check that Tab #4 no longer exists
    expect(await element(by.id('tab4')).isPresent()).toBe(false);
  });
});

describe('Tabs attributes tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs/test-attributes?layout=nofrills');
    const tabsContainerEl = await element(by.id('tabs-normal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsContainerEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should init tabs with automation ids', async () => {
    expect(await element(by.id('tabs-a-contracts')).getAttribute('data-automation-id')).toEqual('tabs-test-contracts-a');
  });

  it('should init more button with automation ids', async () => {
    expect(await element(by.css('#tabs-normal .tab-more')).getAttribute('data-automation-id')).toEqual('tabs-test-btn-more');
  });

  it('should init add button with automation ids', async () => {
    expect(await element(by.css('#tabs-normal .add-tab-button')).getAttribute('data-automation-id')).toEqual('tabs-test-btn-add');
  });

  it('should add correct attributes when clicking the add button', async () => {
    await element(by.css('#tabs-normal .add-tab-button')).click();
    const newTab = await element(by.css('[href="#new-tab-0"]'));

    expect(await newTab.getAttribute('data-automation-id')).toEqual('tabs-test-new-tab-0-a');
  });
});

if (utils.isChrome() && utils.isCI()) {
  xdescribe('Tabs counts position visual regression tests', () => {
    it('should show the counts on top of the labels', async () => {
      await utils.setPage('/components/tabs/example-counts?locale=de-DE');
      const maincontent = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(maincontent), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      // Resize the page to show the spillover
      await browser.driver.manage().window().setSize(766, 600);
      await browser.driver.sleep(config.sleepLonger);

      const tabMore = await element(by.css('.tab-more'));
      tabMore.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(maincontent, 'tabs-count-top')).toEqual(0);
    });

    it('should show the counts at the bottom of the labels', async () => {
      await utils.setPage('/components/tabs/example-counts?locale=pt-PT');
      const maincontent = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(maincontent), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      // Resize the page to show the spillover
      await browser.driver.manage().window().setSize(766, 600);
      await browser.driver.sleep(config.sleepLonger);

      const tabMore = await element(by.css('.tab-more'));
      tabMore.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(maincontent, 'tabs-count-bottom')).toEqual(0);
    });
  });
}
