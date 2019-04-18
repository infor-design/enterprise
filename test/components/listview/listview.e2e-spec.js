const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Listview example-singleselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-singleselect');
    const listviewEl = await element(by.css('#period-end li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewEl), config.waitsFor);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-singleselect', async () => {
      const listviewSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(listviewSection), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(listviewSection, 'listview-singleselect-open')).toEqual(0);
    });
  }

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-singleselect', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should select one item on click', async () => {
    const listviewItemEl = await element(by.css('li[aria-posinset="1"]'));
    await listviewItemEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="true"]')).isPresent()).toBeTruthy();
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElement(element(by.className('selection-count')), '1 Selected'), config.waitsFor);

    expect(await element(by.className('selection-count')).getText()).toContain('1 Selected');
  });

  it('Should deselect one item on click', async () => {
    const listviewItemEl = await element(by.css('li[aria-posinset="1"]'));
    await listviewItemEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="true"]')).isPresent()).toBeTruthy();
    expect(await element(by.className('selection-count')).getText()).toContain('1 Selected');

    await listviewItemEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="false"]'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="false"]')).isPresent()).toBeTruthy();
  });

  it('Should tab into, and select, arrow key down over disabled item, and select item on space key', async () => {
    const listviewEl = await element(by.id('period-end'));
    const listviewItemElOne = await element(by.css('li[aria-posinset="1"]'));
    const listviewItemElTwo = await element(by.css('li[aria-posinset="2"]'));
    await listviewEl.sendKeys(protractor.Key.TAB);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="1"][aria-selected="true"]')).isPresent()).toBeTruthy();
    await listviewItemElOne.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);
    await listviewItemElTwo.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="3"].is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.className('selection-count')).getText()).toContain('1 Selected');
  });
});

describe('Listview example-multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-multiselect');
    const listviewEl = await element(by.css('#multiselect-listview li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewEl), config.waitsFor);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-multiselect', async () => {
      const listviewSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(listviewSection), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(listviewSection, 'listview-multiselect-open')).toEqual(0);
    });
  }

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-multiselect page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should select item on click', async () => {
    const listviewItemEl = await element(by.css('li[aria-posinset="1"]'));
    await listviewItemEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="true"]'))).toBeTruthy();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('selection-count'))), config.waitsFor);

    expect(await element(by.className('selection-count')).getText()).toContain('1 Selected');
  });

  it('Should deselect item on click', async () => {
    const listviewItemEl = await element(by.css('li[aria-posinset="1"]'));
    await listviewItemEl.click();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="true"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="true"]'))).toBeTruthy();
    expect(await element(by.className('selection-count')).getText()).toContain('1 Selected');

    listviewItemEl.click();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="false"]'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="false"]'))).toBeTruthy();
  });

  if (utils.isChrome() && browser.params.theme === 'light') {
    it('Should mouseover 1st, and change background-color', async () => {
      const listviewItemElOne = await element(by.css('li[aria-posinset="1"]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(listviewItemElOne), config.waitsFor);
      await browser.driver.actions().mouseMove(listviewItemElOne).perform();
      await browser.driver.sleep(config.sleep);
      // Value returned will be as the browser interprets it, tricky to form a proper assertion
      expect(await listviewItemElOne.getCssValue('background-color')).toBe('rgba(216, 216, 216, 1)');
    });
  }

  it('Should select two items on click', async () => {
    const listviewItemElOne = await element(by.css('li[aria-posinset="1"]'));
    const listviewItemElThree = await element(by.css('li[aria-posinset="3"]'));
    await listviewItemElOne.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="1"].is-selected'))), config.waitsFor);
    await listviewItemElThree.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="3"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="1"].is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="1"][aria-selected="true"]'))).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="3"].is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="3"][aria-selected="true"]')).isPresent()).toBeTruthy();
    expect(await element(by.className('selection-count')).getText()).toContain('2 Selected');
  });

  it('Should tab into, arrow key down over disabled item, and select each item on space key', async () => {
    const listviewEl = await element(by.id('multiselect-listview'));
    await listviewEl.sendKeys(protractor.Key.TAB);
    const listviewItemElOne = await element(by.css('li[aria-posinset="1"]'));
    await listviewItemElOne.sendKeys(protractor.Key.SPACE);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="1"].is-selected'))), config.waitsFor);
    await listviewItemElOne.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('li[aria-posinset="1"][tabindex="0"]'))).toBeTruthy();
    await listviewEl.sendKeys(protractor.Key.SPACE);
    const listviewItemElThree = await element(by.css('li[aria-posinset="3"]'));
    await listviewItemElThree.sendKeys(protractor.Key.SPACE);

    expect(await element(by.css('li[aria-posinset="1"].is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="1"][aria-selected="true"]')).isPresent()).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="3"].is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.className('selection-count')).getText()).toContain('2 Selected');
  });
});

describe('Listview example-mixed selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-mixed-selection');
    const listviewEl = await element(by.css('#task-listview li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-mixed selection page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should select item on click on checkbox', async () => {
    const listviewItemInputEl = await element(by.css('li[aria-posinset="1"] .label-text'));
    await listviewItemInputEl.click();

    expect(await element(by.className('is-selected')).isPresent()).toBeTruthy();
    expect(await element(by.css('li[aria-selected="true"]'))).toBeTruthy();
  });

  it('Should deselect item on click on checkbox', async () => {
    const listviewItemInputEl = await element(by.css('li[aria-posinset="1"] .label-text'));
    await listviewItemInputEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewItemInputEl), config.waitsFor);

    expect(await element(by.className('is-selected'))).toBeTruthy();
    expect(await element(by.css('li[aria-selected="true"]'))).toBeTruthy();

    await listviewItemInputEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-selected="false"]'))), config.waitsFor);

    expect(await element(by.css('li[aria-selected="false"]'))).toBeTruthy();
  });

  it('Should select two items on click on mixed selection', async () => {
    const listviewItemElOne = await element(by.css('li[aria-posinset="1"] .label-text'));
    const listviewItemElThree = await element(by.css('li[aria-posinset="3"] .label-text'));
    await listviewItemElOne.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="1"].is-selected'))), config.waitsFor);
    await listviewItemElThree.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="3"].is-selected'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="1"][aria-selected="true"]'))).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="3"][aria-selected="true"]')).isPresent()).toBeTruthy();
  });

  it('Should activate element on click outside of checkbox', async () => {
    await await element(by.css('li[aria-posinset="1"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="1"].is-activated'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="1"][aria-selected="false"]'))).toBeTruthy();
  });
});

describe('Listview example-search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-search');
    const listviewEl = await element(by.css('#search-listview li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-search page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should not render items that don\'t match the search term', async () => {
    const searchListviewEl = await element(by.id('gridfilter'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchListviewEl), config.waitsFor);
    await searchListviewEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await browser.driver.switchTo().activeElement().sendKeys('to');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElementValue(await element(by.id('gridfilter')), 'to'), config.waitsFor);

    // Should only be one search result
    expect(await element.all(by.css('#search-listview li')).count()).toEqual(1);
  });

  it('Should highlight the matching parts of search results', async () => {
    const searchListviewEl = await element(by.id('gridfilter'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchListviewEl), config.waitsFor);
    await searchListviewEl.click();
    await browser.driver.switchTo().activeElement().clear();
    await browser.driver.switchTo().activeElement().sendKeys('to');
    await browser.driver
      .wait(protractor.ExpectedConditions.textToBePresentInElementValue(await element(by.id('gridfilter')), 'to'), config.waitsFor);

    expect(await element.all(by.css('#search-listview li .highlight')).first().getText()).toContain('to');
  });
});

describe('Listview example-paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-paging');
    const listviewPagerEl = await element(by.css('.pager-toolbar.is-listview'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewPagerEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-paging page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should render initial page', async () => {
    expect(await element.all(by.css('.listview ul li')).count()).toEqual(10);
    expect(await element(by.css('.listview ul li:first-child')).getAttribute('aria-setsize')).toEqual('24');
    expect(await element(by.css('.listview ul li:last-child')).getAttribute('aria-posinset')).toEqual('10');
  });

  it('Should click page "2" in pager bar, and display new listings', async () => {
    const listviewPagerEl = await element.all(by.css('.pager-toolbar li.pager-no')).get(1);
    await listviewPagerEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('li[aria-posinset="12"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="12"] .listview-heading')).getText()).toContain('Maplewood St. Resurfacing');
  });

  it('Should click page next icon in pager bar, and display correct listings', async () => {
    const listviewPagerNextEl = await element(by.css('.pager-next'));
    await listviewPagerNextEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('li[aria-posinset="12"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="12"] .listview-heading')).getText()).toContain('Maplewood St. Resurfacing');
  });

  it('Should click page next two times, then prev once, and display correct listings', async () => {
    const listviewPagerPrevEl = await element(by.css('.pager-prev'));
    const listviewPagerNextEl = await element(by.css('.pager-next'));
    await listviewPagerNextEl.click();
    await listviewPagerNextEl.click();
    await listviewPagerPrevEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('li[aria-posinset="15"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="15"] .listview-heading')).getText()).toContain('Beechtree Dr. Resurfacing');
  });
});

describe('Listview example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-index');
    const listviewEl = await element(by.css('#task-listview li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewEl), config.waitsFor);
  });

  it('Should do nothing on a disabled item', async () => {
    await await element(by.css('li.is-disabled')).click();

    expect(await element(by.css('li.is-disabled')).getAttribute('disabled').isPresent()).toBeTruthy();
  });
});

describe('Listview example-paging-clientside tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-paging-clientside');
    const listviewPagerEl = await element(by.css('.pager-toolbar.is-listview'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewPagerEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-paging-clientside page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should click page "2" in pager-clientside bar, and display new listings', async () => {
    const listviewPagerEl = await element.all(by.css('.pager-toolbar li')).get(2);
    await listviewPagerEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('li[aria-posinset="12"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="12"] .listview-heading')).getText()).toContain('Maplewood St. Resurfacing');
  });

  it('Should click page next icon in pager-clientside bar, and display correct listings', async () => {
    await element(by.css('.pager-next')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('li[aria-posinset="12"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="12"] .listview-heading')).getText()).toContain('Maplewood St. Resurfacing');
  });

  it('Should click page next two times, then prev once, and display correct listing, clientside', async () => {
    const listviewPagerPrevEl = await element(by.css('.pager-prev'));
    const listviewPagerNextEl = await element(by.css('.pager-next'));
    await listviewPagerNextEl.click();
    await listviewPagerNextEl.click();
    await listviewPagerPrevEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('li[aria-posinset="11"] .listview-heading'))), config.waitsFor);

    expect(await element(by.css('li[aria-posinset="11"] .listview-heading')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('li[aria-posinset="11"] .listview-heading')).getText()).toContain('Fort Woods Swimming Pool');
  });
});

describe('Listview server-side indeterminate paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/test-paging-indeterminate?layout=nofrills');
    const listviewItem = await element(by.css('.listview li[role="option"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewItem), config.waitsFor);
  });

  it('can navigate to page 2', async () => {
    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(10);
    expect(await element(by.css('.listview li[role="option"]:first-child .listview-heading')).getText()).toEqual('Compressor 0');

    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(10);
    expect(await element(by.css('.listview li[role="option"]:first-child .listview-heading')).getText()).toEqual('Compressor 10');
  });

  it('can navigate to page 2, change page size, and reset', async () => {
    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(10);
    expect(await element(by.css('.listview li[role="option"]:first-child .listview-heading')).getText()).toEqual('Compressor 10');

    await element(by.css('.pager-toolbar .pager-pagesize button')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('popupmenu-1'))), config.waitsFor);
    await element(by.css('#popupmenu-1 li:nth-child(2) a')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('popupmenu-1'))), config.waitsFor);

    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(15);
    expect(await element(by.css('.listview li[role="option"]:last-child .listview-heading')).getText()).toEqual('Compressor 14');
  });
});

describe('Listview remove-clear tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/remove-clear');
    const listviewMultiSelectEl = await element(by.css('#multiselect-listview li'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewMultiSelectEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on remove-clear page', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should remove selected items, and update status pane', async () => {
    const listviewItemElOne = await element(by.css('li[aria-posinset="1"]'));
    const listviewItemElThree = await element(by.css('li[aria-posinset="3"]'));
    const listviewItemElFour = await element(by.css('li[aria-posinset="4"]'));
    const listviewRemove = await element(by.id('remove'));
    await listviewItemElOne.click();
    await listviewItemElThree.click();
    await listviewItemElFour.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('li[aria-posinset="4"].is-selected'))), config.waitsFor);

    expect(await element(by.className('status')).getText()).toContain('3 of 12 items selected');
    await listviewRemove.click();

    expect(await element(by.className('msg')).getText()).toContain('3 selected items removed');
  });
});

describe('Listview example-header-totals` tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listview/example-header-totals');
    const listviewButtonToggleEl = await element(by.css('.listview-header button'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewButtonToggleEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    fit('Should be accessible on init with no WCAG 2AA violations on example-header-total', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
      utils.reportAxeViolations(res);
    });
  }

  it('Should toggle listview on listviewer-header button click', async () => {
    await element(by.css('.listview-header button')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('listview')).getCssValue('height')).toEqual('0px');
  });
});

describe('Listview inside of List/Detail Pattern', () => {
  beforeEach(async () => {
    await utils.setPage('/patterns/list-detail-paging');
    const listviewItem = await element(by.css('.listview li[role="option"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewItem), config.waitsFor);
  });

  // Added for #922
  it('should handle paging', async () => {
    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(10);
    expect(await element(by.css('.pager-toolbar.is-listview')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-prev')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-prev a')).getAttribute('disabled')).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-next')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-next a')).getAttribute('disabled')).toBeFalsy();

    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(2);
    expect(await element(by.css('.pager-toolbar .pager-prev a')).getAttribute('disabled')).toBeFalsy();
    expect(await element(by.css('.pager-toolbar .pager-next a')).getAttribute('disabled')).toBeTruthy();
  });
});

describe('Listview with indeterminate paging inside of List/Detail Pattern', () => {
  beforeEach(async () => {
    await utils.setPage('/patterns/list-detail-paging-indeterminate');
    const listviewItem = await element(by.css('.listview li[role="option"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listviewItem), config.waitsFor);
  });

  it('should handle indeterminate paging', async () => {
    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(20);
    expect(await element(by.css('.listview li[role="option"]:first-child .listview-heading')).getText()).toEqual('Compressor 0');
    expect(await element(by.css('.listview li[role="option"]:last-child .listview-heading')).getText()).toEqual('Compressor 19');
    expect(await element(by.css('.pager-toolbar.is-listview')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-prev')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-prev a')).getAttribute('disabled')).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-next')).isPresent()).toBeTruthy();
    expect(await element(by.css('.pager-toolbar .pager-next a')).getAttribute('disabled')).toBeFalsy();

    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.listview li[role="option"]')).count()).toEqual(20);
    expect(await element(by.css('.listview li[role="option"]:first-child .listview-heading')).getText()).toEqual('Compressor 20');
    expect(await element(by.css('.listview li[role="option"]:last-child .listview-heading')).getText()).toEqual('Compressor 39');
    expect(await element(by.css('.pager-toolbar .pager-prev a')).getAttribute('disabled')).toBeFalsy();
    expect(await element(by.css('.pager-toolbar .pager-next a')).getAttribute('disabled')).toBeFalsy();
  });
});
