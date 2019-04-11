const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Datagrid Alternate Row Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-alternate-row-shading?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render alternate rows', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(7);
    expect(await element.all(by.css('.datagrid-row.alt-shading')).count()).toEqual(3);
  });
});

describe('Datagrid Colspan Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-colspan?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datagrid-colspan')).toEqual(0);
    });
  }
});

describe('Datagrid Comments Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-comments?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datagrid-comments')).toEqual(0);
    });
  }
});

describe('Datagrid Custom Filter Option Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-custom-filter-conditions?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have custom filter options', async () => {
    const selector = '#example-custom-filter-conditions-datagrid-1-header-1 button';
    await element(by.css(selector)).click();

    expect(await element.all(await by.css('.popupmenu')).count()).toEqual(4);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('popupmenu-2'))), config.waitsFor);

    const text = await element(by.id('popupmenu-2')).getText();

    expect(await text.replace(/[\s\r\n]+/g, '')).toEqual('ContainsEquals');
  });
});

describe('Datagrid Editable Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-editable?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render row statuses', async () => {
    await element(by.id('toggle-row-status')).click();

    expect(await element.all(by.css('#datagrid .rowstatus-row-error')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-alert')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-info')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-in-progress')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-success')).count()).toEqual(1);
  });

  it('Should render row statuses across page', async () => {
    await element(by.id('toggle-row-status')).click();
    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(350);
    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('#datagrid .rowstatus-row-error')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-alert')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-info')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-in-progress')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-success')).count()).toEqual(1);
  });

  it('Should not show indicator on showNewRowIndicator false', async () => {
    await element(by.id('toggle-row-status')).click();
    await element.all(await by.css('.toolbar .btn-actions')).get(0).click();
    await browser.driver.sleep(350);
    await element(by.cssContainingText('li a', 'Add')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('#datagrid .rowstatus-row-new')).count()).toEqual(0);
    expect(await element.all(by.css('#datagrid .rowstatus-row-error')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-alert')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-info')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-in-progress')).count()).toEqual(1);
    expect(await element.all(by.css('#datagrid .rowstatus-row-success')).count()).toEqual(0);
  });
});

describe('Datagrid Empty Message Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-empty-message?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .empty-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render empty message', async () => {
    expect(await element(by.css('.datagrid-header-container + .empty-message'))).toBeTruthy();
  });
});

describe('Datagrid Expandable Cells Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-expandable-cells?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should expand on cell click', async () => {
    const elem = await element(by.css('#datagrid tbody tr:nth-child(3) td:nth-child(4)'));
    await elem.getSize().then((size) => {
      expect(size.height).toEqual(50);
    });
    await elem.click();
    await elem.getSize().then((size) => {
      expect(size.height).toBeGreaterThan(100);
    });
  });
});

describe('Datagrid Expandable Row Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-expandable-row?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should expand/collapse on row click', async () => {
    const detailRow = await element(by.css('#datagrid tbody tr:nth-child(4)'));
    const button = await element(by.css('#datagrid tbody tr:nth-child(3) td:nth-child(1) button'));
    await detailRow.getSize().then((size) => {
      expect(size.height).toEqual(0);
    });
    await button.click();
    await browser.driver.sleep(config.sleep);
    await detailRow.getSize().then((size) => {
      expect(size.height).toBeGreaterThan(150);
    });
    await button.click();
    await browser.driver.sleep(config.sleep);
    await detailRow.getSize().then((size) => {
      expect(size.height).toEqual(0);
    });
  });
});

describe('Datagrid filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-filter?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should single select row, filter and restore', async () => {
    expect(await element.all(by.css('.datagrid-body:nth-child(2) .datagrid-row')).count()).toEqual(9);
    await element(by.css('#datagrid .datagrid-body:nth-child(2) tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body:nth-child(2) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.id('example-filter-datagrid-1-header-filter-1')).clear();
    await element(by.id('example-filter-datagrid-1-header-filter-1')).sendKeys('2241202');
    await element(by.id('example-filter-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(350);

    expect(await element.all(by.css('.datagrid-body:nth-child(2) .datagrid-row')).count()).toEqual(1);

    await element(by.id('example-filter-datagrid-1-header-filter-1')).clear();
    await element(by.id('example-filter-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(350);

    expect(await element.all(by.css('.datagrid-body:nth-child(2) .datagrid-row')).count()).toEqual(9);
    expect(await element(by.css('#datagrid .datagrid-body:nth-child(2) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
  });
});

describe('Datagrid frozen column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-frozen-columns');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tr:first-child'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.id('datagrid'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datagrid-frozen')).toEqual(0);
    });
  }

  it('Should render frozen columns', async () => {
    // Check all containers rendered on the header
    expect(await element.all(by.css('.datagrid-header th')).count()).toEqual(15);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-header.right th')).count()).toEqual(1);

    // Check all containers rendered on the body
    expect(await element.all(by.css('.datagrid-body tr:first-child td')).count()).toEqual(15);
    expect(await element.all(by.css('.datagrid-body.left tr:first-child td')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-body.right tr:first-child td')).count()).toEqual(1);

    // Check all rows rendered on the body
    expect(await element.all(by.css('.datagrid-body tr')).count()).toEqual(150);
    expect(await element.all(by.css('.datagrid-body.left tr')).count()).toEqual(50);
    expect(await element.all(by.css('.datagrid-body.right tr')).count()).toEqual(50);
  });
});

describe('Datagrid grouping headers and filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-filter');

    const datagridEl = await element(by.css('.datagrid-rowgroup-header'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should filter and show groups', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(16);
    expect(await element.all(by.css('.datagrid-rowgroup-header')).count()).toEqual(7);

    await element(by.css('#example-grouping-filter-datagrid-1-header-filter-1')).sendKeys('Ha');
    await element(by.css('#example-grouping-filter-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(5);
    expect(await element.all(by.css('.datagrid-rowgroup-header')).count()).toEqual(2);
  });
});

describe('Datagrid grouping with paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-paging');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should handle click', async () => {
    const cell = '#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)';

    expect(await element(by.css(cell)).getText()).toEqual('214220');

    await element(by.css(cell)).click();

    expect(await element(by.css(cell)).getAttribute('tabindex')).toEqual('0');

    await element(by.css('.pager-next')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev'))), config.waitsFor);

    expect(await element(by.css(cell)).getText()).toEqual('214225');

    await element(by.css(cell)).click();

    expect(await element(by.css(cell)).getAttribute('tabindex')).toEqual('0');
  });

  it('Should handle selection', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-next a'))), config.waitsFor);

    const cell = '#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)';
    const row = '#datagrid .datagrid-body tbody tr:nth-child(2)';
    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('.pager-next')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev a'))), config.waitsFor);

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).not.toMatch('is-selected');
  });
});

describe('Datagrid index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-index?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show results', async () => {
    expect(await element(by.className('datagrid-result-count')).getText()).toBe('(7 Results)');
  });

  it('Should navigate with arrow keys', async () => {
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

    let cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('2');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

      const datagridEl = await element(by.id('datagrid'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(datagridEl, 'datagrid-index')).toEqual(0);
    });
  }
});

describe('Datagrid keyword search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-keyword-search?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should filter keyword results', async () => {
    expect(await element.all(by.css('.datagrid-body:nth-child(2) tr')).count()).toEqual(12);
    await element(by.id('gridfilter')).sendKeys('T');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-body:nth-child(2) tr')).count()).toEqual(11);
  });

  it('Should highlight keyword results', async () => {
    expect(await element.all(by.css('.datagrid-body:nth-child(2) tr')).count()).toEqual(12);
    await element(by.id('gridfilter')).sendKeys('26');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-body:nth-child(2) tr')).count()).toEqual(6);
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(6);
    expect(await element.all(by.css('.search-mode i')).get(0).getText()).toEqual('26');
  });
});

describe('Datagrid List Styles Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-list?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datagrid-islist')).toEqual(0);
    });
  }
});

describe('Datagrid mixed selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-mixed-selection');

    const datagridEl = await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow activation and deactivation', async () => {
    expect(await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('52106');
    await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
    await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-rowactivated');
  });

  it('Should handle selection ', async () => {
    await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-rowactivated');
    expect(await element(by.css('#datagrid-header .datagrid-body:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
  });
});

describe('Datagrid multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-multiselect');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow selection and deselection', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element(by.css('.selection-count')).getText()).toEqual('2 Selected');
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('.selection-count')).getText()).toEqual('1 Selected');
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });

  it('Should handle removing selected rows ', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(7);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)')).click();

    await element(by.id('remove-btn')).click();

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(5);
  });

  it('Should work with sort', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element(by.css('.selection-count')).getText()).toEqual('2 Selected');
    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('.selection-count')).getText()).toEqual('3 Selected');
    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(3);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(6) td:nth-child(2)')).click();

    expect(await element(by.css('.selection-count')).getText()).toEqual('2 Selected');
    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-paging');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to move to last', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-last a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('990');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('999');
  });

  it('Should be able to move to first', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-last a')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('.pager-first a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');
  });

  it('Should be able to move to next/prev', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('10');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('19');

    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');
  });

  it('Should be able to move to specific page', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-count input')).sendKeys(protractor.Key.BACK_SPACE);
    await element(by.css('.pager-count input')).sendKeys('5');
    await element(by.css('.pager-count input')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('40');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('49');
  });

  if (!utils.isCI()) {
    it('Should not move on a page that is more than the max', async () => {
      expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
      expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

      await element(by.css('.pager-count input')).clear();
      await element(by.css('.pager-count input')).sendKeys('101');
      await element(by.css('.pager-count input')).sendKeys(protractor.Key.ENTER);
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
      expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');
    });
  }
});

describe('Datagrid page size selector tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-page-size-selector');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle and use pagesize selector', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(3);
    await element(by.id('toggle-pagesize-selector')).click();
    await element(by.css('.pager-pagesize .btn-menu')).click();

    await element(by.css('#popupmenu-3 li:nth-child(2) a')).click();

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(10);
  });
});

describe('Datagrid single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-singleselect');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should single select rows', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
  });

  it('Should work with sort', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).getText()).toEqual('2142201');

    // Sort
    await element(by.css('#datagrid .datagrid-header th:nth-child(4)')).click();
    await browser.driver.sleep(350);
    await element(by.css('#datagrid .datagrid-header th:nth-child(4)')).click();

    expect(await element(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).getText()).toEqual('2142201');

    await browser.driver.sleep(350);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    await browser.driver.sleep(350);

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).getText()).toEqual('2642205');
  });
});

describe('Datagrid Client Side Filter and Sort Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-disable-client-filter-and-sort');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should retain sort indicator', async () => {
    await element(by.css('#datagrid thead th:nth-child(2) .datagrid-header-text')).click();

    expect(await element(by.css('#datagrid thead th:nth-child(2)')).getText()).toEqual('Product Id');
    await browser.driver.sleep(350);

    expect(await element(by.css('#datagrid thead th:nth-child(2)')).getAttribute('class')).toContain('is-sorted-asc');
  });

  it('Should retain filter criteria', async () => {
    await element(by.css('#datagrid thead th:nth-child(2) input')).sendKeys('22');

    expect(await element(by.css('#datagrid thead th:nth-child(2) input')).getAttribute('value')).toEqual('22');
    await browser.driver.sleep(500);

    expect(await element(by.css('#datagrid thead th:nth-child(2) input')).getAttribute('value')).toEqual('22');
  });

  it('Should retain both filter and sort criteria', async () => {
    await element(by.css('#datagrid thead th:nth-child(2) .datagrid-header-text')).click();
    await browser.driver.sleep(350);
    await element(by.css('#datagrid thead th:nth-child(2) input')).sendKeys('22');
    await browser.driver.sleep(500);

    expect(await element(by.css('#datagrid thead th:nth-child(2) input')).getAttribute('value')).toEqual('22');
    expect(await element(by.css('#datagrid thead th:nth-child(2)')).getAttribute('class')).toContain('is-sorted-asc');
  });
});

describe('Datagrid Lookup Editor', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-lookup-mask');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('should be usable with a Mask', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(3) td:nth-child(2)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('aaa');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('');

    await element(by.css(editCellSelector)).sendKeys('12345678');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('1234567');
  });
});

describe('Datagrid editor dropdown source tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editor-dropdown-source');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should datagrid exists', async () => {
    expect(await element(by.css('.datagrid-container'))).toBeTruthy();
  });

  it('Should highlight the selected value', async () => {
    const triggerEl = await element.all(await by.css('.datagrid-row')).first();
    const testEl = await triggerEl.all(by.tagName('td')).get(4);
    await testEl.click();

    expect(await element(by.css('.is-focused'))).toBeTruthy();
    const focusEl = await element(by.css('.is-focused'));

    expect(await focusEl.getText()).toEqual('Place On-Hold');
  });
});

describe('Datagrid Header Alignment With Ellipsis', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-ellipsis-header-align?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datagrid-header-align-short-row')).toEqual(0);
    });
  }
});

describe('Datagrid Empty Message Tests After Load', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-message-after-load');

    const datagridEl = await element(by.css('#datagrid .datagrid-body'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not show empty indicator initially', async () => {
    expect(await element.all(by.css('.empty-message')).count()).toEqual(0);
  });

  it('Should show empty indicator on load', async () => {
    await element(by.id('show-empty-message')).click();

    expect(await element.all(by.css('.empty-message')).count()).toEqual(1);
  });
});

describe('Datagrid contextmenu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-contextmenu');

    const datagridEl = await element(by.css('#readonly-datagrid .datagrid-body'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isBS()) {
    it('Should show context menu', async () => {
      const td = await element(by.css('#readonly-datagrid tr:first-child td:first-child')).getLocation();
      await browser.actions()
        .mouseMove(td)
        .click(protractor.Button.RIGHT)
        .perform();

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#grid-actions-menu'))), config.waitsFor);

      expect(await element(by.css('#grid-actions-menu > li:nth-child(1)')).getText()).toBe('Action One');
      expect(await element(by.css('#grid-actions-menu > li:nth-child(1)')).isDisplayed()).toBeTruthy();

      expect(await element(by.css('#grid-actions-menu > li:nth-child(3)')).getText()).toBe('Action Three');
      expect(await element(by.css('#grid-actions-menu > li:nth-child(3)')).isDisplayed()).toBeTruthy();

      expect(await element(by.css('#grid-actions-menu .submenu .popupmenu')).isDisplayed()).toBeFalsy();

      await browser.actions().mouseMove(element(by.css('#grid-actions-menu .submenu'))).perform();

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#grid-actions-menu .submenu .popupmenu'))), config.waitsFor);

      expect(await element(by.css('#grid-actions-menu .submenu ul > li:nth-child(1)')).getText()).toBe('Action Four');
      expect(await element(by.css('#grid-actions-menu .submenu ul > li:nth-child(1)')).isDisplayed()).toBeTruthy();
    });
  }
});

describe('Datagrid filter single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-singleselect');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should single select rows, filter and restore', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(8);
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys('23');
    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(1);

    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).clear();
    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(8);
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
  });
});

describe('Datagrid filter lookup custom click function tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-lookup-click-function');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should attempt to open the filter and have the correct popup', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(9);

    await element(by.css('#test-filter-lookup-click-function-datagrid-1-header-1 div.datagrid-filter-wrapper span.lookup-wrapper span.trigger')).click();

    expect(browser.driver.switchTo().alert().getText()).toBe('Grid information found');
    await browser.driver.switchTo().alert().accept();
  });
});

describe('Datagrid filter masks', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-mask');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should mask on text filters', async () => {
    await element(by.id('test-filter-mask-datagrid-1-header-filter-2')).sendKeys('Compressor');
    await element(by.id('test-filter-mask-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);
    await element(by.id('test-filter-mask-datagrid-1-header-filter-4')).sendKeys('999999');
    await element(by.id('test-filter-mask-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.id('test-filter-mask-datagrid-1-header-filter-2')).getAttribute('value')).toEqual('Compr');
    expect(await element(by.id('test-filter-mask-datagrid-1-header-filter-4')).getAttribute('value')).toEqual('999');
  });
});

describe('Datagrid grouping multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-grouping-multiselect');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select within groups', async () => {
    await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tbody tr:nth-child(3)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) tbody tr:nth-child(3)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tr:nth-child(7) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tbody tr:nth-child(7)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tbody tr:nth-child(8)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) tbody tr:nth-child(7)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) tbody tr:nth-child(8)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tr:nth-child(11) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) tr:nth-child(11)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) tr:nth-child(11)')).getAttribute('class')).toMatch('is-selected');

    // Expect it marked as selected on both sides (frozenColumns)
    expect(await element.all(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(1) .datagrid-row.is-selected')).count()).toEqual(3);
    expect(await element.all(by.css('#datagrid .datagrid-body-container .datagrid-body:nth-child(2) .datagrid-row.is-selected')).count()).toEqual(3);
  });
});

describe('Datagrid hide selection checkbox tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-hide-selection-checkbox');

    const datagridEl = await element(by.css('#datagrid .datagrid-header thead .datagrid-checkbox'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not show selection checkbox', async () => {
    expect(await element(by.css('#datagrid .datagrid-header thead .datagrid-checkbox')).isDisplayed()).toBeFalsy();
  });
});

describe('Datagrid loaddata selected rows tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-loaddata-selected-rows');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and reload and clear rows', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.id('clear')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });

  it('Should be able to select and reload and preserve rows', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.id('save')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);
  });
});

describe('Datagrid disableRowDeactivation setting tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-mixed-selection-disable-row-dectivation');

    const datagridEl = await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow activation but not deactivation', async () => {
    expect(await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('52106');
    await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
    await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
  });
});

describe('Datagrid multiselect with no selection checkbox', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-multiselect-no-checkboxes');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow multiselect with no selection checkbox', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
  });
});

describe('Datagrid disable last page', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-disable-lastpage');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be have last and next page disabled', async () => {
    expect(await element.all(by.css('.pager-toolbar .is-disabled')).count()).toEqual(2);
  });
});

describe('Datagrid paging force disabled', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-force-disabled');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able force disable and reenable the pager', async () => {
    await browser.driver.sleep(config.sleep);
    await element(by.id('force-disabled')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.pager-toolbar .is-disabled')).count()).toEqual(4);

    await element(by.id('force-enabled')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.pager-toolbar .is-disabled')).count()).toEqual(0);
  });
});

describe('Datagrid paging multiselect across pages', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-multiselect-select-across-page');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select across pages', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1).is-selected'))), config.waitsFor);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid paging multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-multiselect');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and when changing pages the selections reset', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid paging clientside multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-clientside-multiple');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select across pages', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid paging clientside single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-clientside-single');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select across pages', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);
  });
});

describe('Datagrid paging indeterminate multiple select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-indeterminate-multiple');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have it clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(await by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(await by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid paging indeterminate single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-indeterminate-single');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have it clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid paging serverside multi select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-serverside-multiple');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have selections clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid paging serverside multi select tests 2nd page', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-paging');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have selections clear when paging on 2nd page', async () => {
    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(10);
    expect(await element.all(by.css('.contextual-toolbar .title.selection-count')).getText()).toEqual(['10 Selected']);
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked.is-partial')).isPresent()).toBeFalsy();
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeTruthy();

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(8);
    expect(await element.all(by.css('.contextual-toolbar .title.selection-count')).getText()).toEqual(['8 Selected']);
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked.is-partial')).isPresent()).toBeTruthy();
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeTruthy();
  });
});

describe('Datagrid Paging with Summary Row test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-with-summary-row');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display summary row', async () => {
    expect(await element.all(by.css('tr.datagrid-summary-row')).count()).toEqual(1);
  });
});

describe('Datagrid paging serverside single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-serverside-single');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have selections clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next a')).click();
    await browser.driver.sleep(config.sleep);

    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev'))), config.waitsFor);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev a')).click();
    await browser.driver.sleep(config.sleep);

    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-next'))), config.waitsFor);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid select and focus row', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-select-and-focus-row');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should focus and activate the first row', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.is-selected.is-active-row')).count()).toEqual(1);
  });
});

describe('Datagrid select and filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-select-filter-issue');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should focus and activate the first row', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);

    await element(by.id('test-select-filter-issue-datagrid-1-header-filter-2')).sendKeys('1');
    await element(by.id('test-select-filter-issue-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);

    await utils.checkForErrors();

    expect(await element.all(by.css('tbody tr')).count()).toEqual(2);
    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);
    await utils.checkForErrors();

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await utils.checkForErrors();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid select event tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-selected-event');

    const datagridEl = await element(by.id('testing-datagrid'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should fire a toast on select', async () => {
    await element(by.css('#testing-datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(2)')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('toast-container'))), config.waitsFor);

    expect(await element.all(by.css('#toast-container .toast-message')).getText()).toEqual(['The row #1 containing the product name Compressor triggered a selected event']);
  });
});

describe('Datagrid timezone tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-timezone-formats?layout=nofrills&locale=nl-NL');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should Render Timezones', async () => {
    expect(await element(by.css('.datagrid tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('03-04-2019');
    let text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(2)')).getText();

    expect(['3/4/2019 00:00 GMT-5', '3/4/2019 00:00 GMT-4']).toContain(text);
    text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(3)')).getText();

    expect(['3/4/2019 00:00 Eastern-standaardtijd', '3/4/2019 00:00 Eastern-zomertijd']).toContain(text);

    text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(4)')).getText();

    expect(['03-04-2019 00:00 GMT-5', '03-04-2019 00:00 GMT-4']).toContain(text);

    text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(5)')).getText();

    expect(['03-04-2019 00:00 GMT-5', '03-04-2019 00:00 GMT-4']).toContain(text);
  });
});

describe('Datagrid select tree tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-multiselect');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should select parent nodes', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(4);
  });

  it('Should partially select root nodes', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);
    expect(await element.all(by.css('.is-partial')).count()).toEqual(1);
  });
});

describe('Datagrid tree do not select children tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-select-children');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not select children', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid tree do not select siblings tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-select-siblings');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should select siblings', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(5);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(8) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(3);
  });
});

describe('Datagrid tree single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-singleselect');

    const datagridEl = await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should single select', async () => {
    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(await by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(6) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-body tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);
  });
});

describe('Datagrid tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-tooltips');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show tooltip on text cut off', async () => {
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="4"] td[aria-colindex="9"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    let tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).toContain('is-hidden');

    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="5"] td[aria-colindex="9"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
  });

  it('Should show tooltip on header text cut off with ellipsis', async () => {
    await browser.actions().mouseMove(element(by.css('.datagrid-header thead th[data-column-id="orderDate"] .datagrid-column-wrapper'))).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    const tooltip = await element(by.css('.grid-tooltip'));

    expect(await element(by.css('.datagrid-header thead th[data-column-id="orderDate"]')).getAttribute('class')).toContain('text-ellipsis');
    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
  });
});

describe('Datagrid Row Activation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-row-activated');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show rowactivated', async () => {
    let row = await element(by.css('tbody tr[aria-rowindex="6"]'));

    expect(await row.getAttribute('class')).not.toContain('is-rowactivated');
    const cell = await element(by.css('tbody tr[aria-rowindex="6"] td[aria-colindex="2"]'));
    await cell.click();
    row = await element(by.css('tbody tr[aria-rowindex="6"]'));

    expect(await row.getAttribute('class')).toContain('is-rowactivated');
  });
});

describe('Datagrid Row Indeterminate Activation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-paging-indeterminate');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show activation row for indeterminate with mixed selection', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('tbody tr[aria-rowindex="2"]'))), config.waitsFor);

    expect(await element(by.css('tbody tr[aria-rowindex="2"]')).getAttribute('class')).not.toContain('is-rowactivated');
    await element(by.css('tbody tr[aria-rowindex="2"] td[aria-colindex="2"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('tbody tr[aria-rowindex="2"]'))), config.waitsFor);

    expect(await element(by.css('tbody tr[aria-rowindex="2"]')).getAttribute('class')).toContain('is-rowactivated');
    await element(by.css('li.pager-next a')).click();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('tbody tr[aria-rowindex="2"]'))), config.waitsFor);

    expect(await element(by.css('tbody tr[aria-rowindex="2"]')).getAttribute('class')).toContain('is-rowactivated');
  });
});

describe('Datagrid paging with empty dataset', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-empty-dataset?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#datagrid .empty-message'))), config.waitsFor);
  });

  it('should increase total page count when the pagesize is exceeded', async () => {
    expect(await element(by.css('#datagrid tbody tr[aria-rowindex]')).isPresent()).toBeFalsy();

    // Click 11 Times
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await element(by.id('add-btn')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#datagrid tbody tr[aria-rowindex]')).count()).toEqual(10);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(11 Results)');
    expect(await element(by.css('.pager-toolbar .pager-next a')).getAttribute('disabled')).toBeFalsy();

    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#datagrid tbody tr[aria-rowindex]')).count()).toEqual(1);
  });
});
