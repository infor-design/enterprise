/* eslint-disable compat/compat */
// eslint-disable-next-line import/no-extraneous-dependencies
const { browser, element } = require('protractor');

const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
const until = protractor.ExpectedConditions;
requireHelper('rejection');

/**
 * general CSS selectors used throughout these tests
 */
const S = {
  gridRow: ({ row, nthLastRow } = {}) => {
    const rSelector = row ? `:nth-${nthLastRow ? 'last-' : ''}child(${row})` : '';
    return `#datagrid .datagrid-wrapper tbody tr${rSelector}`;
  },
  gridColumn: ({ row, column, nthLastRow } = {}) => {
    const cSelector = column ? `:nth-child(${column})` : '';
    const rSelector = row ? `:nth-${nthLastRow ? 'last-' : ''}child(${row})` : '';
    return `#datagrid .datagrid-wrapper tbody tr${rSelector} td${cSelector}`;
  },
  gridRowCheckbox: ({ row, column = 1, checked }) => {
    const checkedState = `${!checked ? ':not(' : ''}.is-checked${!checked ? ')' : ''}`;

    return (
      `#datagrid .datagrid-wrapper tbody tr:nth-child(${row}) ` +
      `td:nth-child(${column}) ` +
      `${checkedState}`
    );
  },
  removeRowButton: () => '#remove-btn'
};

const openPersonalizationDialog = async () => {
  await element.all(by.css('.btn-actions')).first().click();
  await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.is-open'))), config.waitsFor);
  await element(by.css('li a[data-option="personalize-columns"')).click();
  await browser.driver.sleep(config.sleep);
  await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.modal-content'))), config.waitsFor);
  await browser.driver.sleep(config.sleep);
};

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

describe('Datagrid Column Sizing Setting Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-columnsizing?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-columnsizing')).toEqual(0);
    });
  }
});

describe('Datagrid Default Column Width Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-books?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-books')).toEqual(0);
    });
  }
});

describe('Datagrid Colspan Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-colspan?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should hide colspan columns in personalize', async () => {
    await openPersonalizationDialog();

    expect(await element(by.css('input[data-column-id="productId"]')).isEnabled()).toBe(false);
    expect(await element(by.css('input[data-column-id="productDesc"]')).isEnabled()).toBe(false);
    expect(await element(by.css('input[data-column-id="activity"]')).isEnabled()).toBe(false);
    expect(await element(by.css('input[data-column-id="status"]')).isEnabled()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-colspan')).toEqual(0);
    });
  }
});

describe('Datagrid Compact Row Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-compact-mode?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on compact', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-compact')).toEqual(0);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress after toggle', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);
      await element(by.id('toggle-compact')).click();

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-compact-toggle')).toEqual(0);
    });
  }
});

describe('Datagrid Colspan Frozen Column Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-colspan?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should markup frozen colspan columns', async () => {
    expect(await element(by.css('#datagrid .left tr:nth-child(3) td:nth-child(2)')).getAttribute('class')).toEqual('is-spanned-last');
    expect(await element(by.css('#datagrid .left tr:nth-child(3) td:nth-child(2)')).getAttribute('colspan')).toEqual('3');
    expect(await element(by.css('#datagrid .center tr:nth-child(3) td:nth-child(3)')).getAttribute('class')).toEqual('');
    expect(await element(by.css('#datagrid .center tr:nth-child(3) td:nth-child(3)')).getAttribute('colspan')).toEqual(null);

    expect(await element(by.css('#datagrid .left tr:nth-child(4) td:nth-child(2)')).getAttribute('class')).toEqual('is-spanned-last');
    expect(await element(by.css('#datagrid .left tr:nth-child(4) td:nth-child(2)')).getAttribute('colspan')).toEqual('7');
    expect(await element(by.css('#datagrid .center tr:nth-child(4) td:nth-child(3)')).getAttribute('class')).toEqual('is-spanned-hidden');
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-colspan-frozen2')).toEqual(0);
    });
  }
});

describe('Datagrid Colspan Frozen Column and Single Select Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-colspan-and-single-select?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should markup frozen colspan columns', async () => {
    expect(await element(by.css('#datagrid .left tr:nth-child(3) td:nth-child(1)')).getAttribute('class')).toEqual('is-spanned-last');
    expect(await element(by.css('#datagrid .left tr:nth-child(3) td:nth-child(1)')).getAttribute('colspan')).toEqual('3');
    expect(await element(by.css('#datagrid .center tr:nth-child(3) td:nth-child(2)')).getAttribute('class')).toEqual('is-spanned-hidden');
    expect(await element(by.css('#datagrid .center tr:nth-child(3) td:nth-child(2)')).getAttribute('colspan')).toEqual(null);

    expect(await element(by.css('#datagrid .left tr:nth-child(4) td:nth-child(1)')).getAttribute('class')).toEqual('is-spanned-last');
    expect(await element(by.css('#datagrid .left tr:nth-child(4) td:nth-child(1)')).getAttribute('colspan')).toEqual('7');
    expect(await element(by.css('#datagrid .center tr:nth-child(4) td:nth-child(2)')).getAttribute('class')).toEqual('is-spanned-hidden');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-colspan-frozen-single2')).toEqual(0);
    });
  }
});

describe('Datagrid Colspan Frozen Column and Grouped Header Hide/Show Column Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-grouped-headers-hide-show-columns?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should markup frozen colspan columns', async () => {
    expect(await element.all(by.css('.datagrid-header-groups th')).count()).toEqual(7);
    expect(await element.all(by.css('#datagrid th[role="columnheader"]')).count()).toEqual(9);
    expect(await element.all(by.css('#datagrid tr:nth-child(5) td')).count()).toEqual(9);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-colspan-frozen-group-hide-sow')).toEqual(0);
    });
  }
});

describe('Datagrid Comments Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-comments?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-comments')).toEqual(0);
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
    const selector = '#example-custom-filter-conditions-datagrid-1-header-0 button';
    await element(by.css(selector)).click();

    expect(await element.all(await by.css('.popupmenu')).count()).toEqual(5);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('popupmenu-2'))), config.waitsFor);

    const text = await element(by.id('popupmenu-2')).getText();

    expect(await text.replace(/[\s\r\n]+/g, '')).toEqual('ContainsEquals');
  });

  it('Should be able to reorder filter options', async () => {
    const selector = '#example-custom-filter-conditions-datagrid-1-header-1 button';
    await element(by.css(selector)).click();

    expect(await element.all(await by.css('.popupmenu')).count()).toEqual(5);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('popupmenu-2'))), config.waitsFor);

    const text = await element(by.id('popupmenu-2')).getText();

    expect(await text.replace(/[\s\r\n]+/g, '')).toEqual('EqualsDoesNotEqualContainsDoesNotContainIsEmptyIsNotEmptyEndsWithDoesNotEndWithStartsWithDoesNotStartWith');
  });
});

describe('Datagrid Disable Rows Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-disabled-rows?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should Make Rows Disabled', async () => {
    expect(await element(by.css('#datagrid tbody tr:nth-child(2)')).getAttribute('aria-disabled')).toEqual('true');
    expect(await element(by.css('#datagrid tbody tr:nth-child(4)')).getAttribute('aria-disabled')).toEqual('true');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-disabled-rows')).toEqual(0);
    });
  }
});

describe('Datagrid Editable Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-editable?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
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
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(350);
    await element(by.css('.pager-prev .btn-icon')).click();
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
    await utils.checkForErrors();
  });
});

describe('Datagrid Empty Message Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-empty-message?theme=classic&layout=nofrills');

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

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-empty-message')).toEqual(0);
    });
  }
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

  it('Should generate automation ids', async () => {
    expect(await element(by.id('custom-id-btn-expand-row-0')).getAttribute('id')).toEqual('custom-id-btn-expand-row-0');
    expect(await element(by.id('custom-id-btn-expand-row-0')).getAttribute('data-automation-id')).toEqual('custom-automation-id-btn-expand-row-0');

    expect(await element(by.id('custom-id-btn-expand-row-6')).getAttribute('id')).toEqual('custom-id-btn-expand-row-6');
    expect(await element(by.id('custom-id-btn-expand-row-6')).getAttribute('data-automation-id')).toEqual('custom-automation-id-btn-expand-row-6');
  });

  it('Should expand/collapse on row click', async () => {
    const detailRow = await element(by.css('#datagrid tbody tr:nth-child(4)'));
    const button = await element(by.css('#datagrid tbody tr:nth-child(3) td:nth-child(1) button'));
    await detailRow.getSize().then((size) => {
      expect(size.height).toEqual(0);
    });
    await button.click();
    await browser.driver.sleep(config.sleepLonger);
    await detailRow.getSize().then((size) => {
      expect(size.height).toBeGreaterThan(150);
    });
    await button.click();
    await browser.driver.sleep(config.sleepLonger);
    await detailRow.getSize().then((size) => {
      expect(size.height).toEqual(0);
    });
  });
});

describe('Datagrid filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-filter?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should generate automation ids', async () => {
    expect(await element(by.id('custom-id-btn-filter-productname')).getAttribute('id')).toEqual('custom-id-btn-filter-productname');
    expect(await element(by.id('custom-id-btn-filter-productname')).getAttribute('data-automation-id')).toEqual('custom-automation-id-btn-filter-productname');

    expect(await element(by.id('custom-id-filter-productname')).getAttribute('id')).toEqual('custom-id-filter-productname');
    expect(await element(by.id('custom-id-filter-productname')).getAttribute('data-automation-id')).toEqual('custom-automation-id-filter-productname');
  });

  it('Should single select row, filter and restore', async () => {
    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) .datagrid-row')).count()).toEqual(9);
    await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.id('custom-id-filter-productid')).clear();
    await element(by.id('custom-id-filter-productid')).sendKeys('2241202');
    await element(by.id('custom-id-filter-productid')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(350);

    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) .datagrid-row')).count()).toEqual(1);

    await element(by.id('custom-id-filter-productid')).clear();
    await element(by.id('custom-id-filter-productid')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(350);

    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) .datagrid-row')).count()).toEqual(9);
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
  });

  it('Should render editors in the filter row when frozen', async () => {
    expect(await element(by.css('#custom-id-filter-productid + .trigger')).isPresent()).toBeTruthy();
  });

  it('Should render and filter type contents', async () => {
    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) .datagrid-row')).count()).toEqual(9);
    const selectEl = await element(by.id('custom-id-filter-activity1'));
    const selectElParent = await selectEl.element(by.xpath('..'));
    let multiselectEl = await selectElParent.element(by.css('div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await multiselectEl.click();
    multiselectEl = await selectElParent.element(by.css('div.dropdown.is-open'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await element.all(by.css('#dropdown-list #list-option-0')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) .datagrid-row')).count()).toEqual(1);
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-filter')).toEqual(0);
    });
  }
});

describe('Datagrid filter RTL tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-filter?locale=ar-SA&theme=classic&layout=nofrills');

    const datagridEl = await element.all(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await element(by.css('#custom-id-col-id .btn-filter')).click();
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);
      await element(by.css('#custom-id-col-id .btn-filter')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-filter-rtl')).toEqual(0);
    });
  }
});

describe('Datagrid filter alternate row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-alternate-row-shading?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    expect(await element.all(by.css('.datagrid-wrapper .datagrid-row')).count()).toEqual(8);

    await element(by.id('test-filter-alternate-row-shading-datagrid-1-header-filter-1')).clear();
    await element(by.id('test-filter-alternate-row-shading-datagrid-1-header-filter-1')).sendKeys('22');
    await element(by.id('test-filter-alternate-row-shading-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(350);

    expect(await element.all(by.css('.datagrid-wrapper .datagrid-row')).count()).toEqual(6);
    expect(await element.all(by.css('.datagrid-wrapper .datagrid-row.alt-shading')).count()).toEqual(3);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-filter-alt-row-shading')).toEqual(0);
    });
  }
});

describe('Datagrid filter medium row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-medium-rowheight?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-filter-medium-rowheight')).toEqual(0);
    });
  }
});

describe('Datagrid filter short row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-short-rowheight?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-filter-short-rowheight')).toEqual(0);
    });
  }
});

describe('Datagrid filter treeGrid paging', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-filter-paging?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should filter treeGrid with paging', async () => {
    const sel = {
      rows: '#datagrid .datagrid-wrapper tbody tr',
      filter: '#datagrid th[data-field="position"] .datagrid-filter-wrapper',
      filterGreaterThan: '.popupmenu.is-open .greater-than a'
    };
    const getVisibleRowsCount = async () => {
      const all = await element.all(by.css(sel.rows)).count();
      const hidden = await element.all(by.css(`${sel.rows}.is-hidden`)).count();
      return all - hidden;
    };

    expect(await getVisibleRowsCount()).toEqual(5);
    await element(by.css(`${sel.filter} .btn-filter`)).click();
    const popupEl = await element(by.css('.popupmenu.is-open'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(popupEl), config.waitsFor);
    await element(by.css(sel.filterGreaterThan)).click();
    await element(by.css(`${sel.filter} input[type="text"]`)).clear();
    await element(by.css(`${sel.filter} input[type="text"]`)).sendKeys('30');
    await element(by.css(`${sel.filter} input[type="text"]`)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await getVisibleRowsCount()).toEqual(3);
    await element(by.css(`${sel.filter} input[type="text"]`)).clear();
    await element(by.css(`${sel.filter} input[type="text"]`)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await getVisibleRowsCount()).toEqual(5);
  });
});

describe('Datagrid form button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-form-buttons?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show item when clicked with keyboard', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(6)')).click();
    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    const toast = element.all(by.css('#toast-container .toast-message')).first();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(toast), config.waitsFor);

    expect(await toast.getText()).toEqual('Id : 4 was clicked.');
  });

  it('Should show item when clicked', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(6) button')).click();
    const toast = element.all(by.css('#toast-container .toast-message')).first();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(toast), config.waitsFor);

    expect(await toast.getText()).toEqual('Id : 4 was clicked.');
  });
});

describe('Datagrid frozen column grouped rows tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-grouped-headers');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:first-child'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render grouped headers with frozen columns', async () => {
    expect(await element.all(by.css('.datagrid-header-groups')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(6);
    expect(await element.all(by.css('.datagrid-header.center th')).count()).toEqual(9);
    expect(await element(by.css('.datagrid-header.center .datagrid-header-groups th:nth-child(2)')).getText()).toEqual('Column Group One');
    expect(await element(by.css('.datagrid-header.center .datagrid-header-groups th:nth-child(3)')).getText()).toEqual('Column Group Two');
  });
});

describe('Datagrid frozen column grouped rows show row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-grouped-headers-short-row');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:first-child'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render grouped headers with frozen columns', async () => {
    expect(await element.all(by.css('.datagrid-header-groups')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-header.center th')).count()).toEqual(13);
    expect(await element(by.css('.datagrid-header.center .datagrid-header-groups th:nth-child(4)')).getText()).toEqual('Group Header 1');
    expect(await element(by.css('.datagrid-header.center .datagrid-header-groups th:nth-child(5)')).getText()).toEqual('Group Header 2');
  });
});

describe('Datagrid frozen column grouped rows hide columns tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-grouped-headers-hide-column');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:first-child'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render grouped headers with hidden columns', async () => {
    expect(await element.all(by.css('.datagrid-header-groups')).count()).toEqual(2);
    expect(await element.all(by.css('[colspan]')).count()).toEqual(9);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-header.center th')).count()).toEqual(13);
    expect(await element(by.css('.datagrid-header.center .datagrid-header-groups th:nth-child(4)')).getText()).toEqual('Group Header 1');
  });
});

describe('Datagrid frozen column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-frozen-columns?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:first-child'));
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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-frozen')).toEqual(0);
    });
  }

  it('Should render frozen columns', async () => {
    // Check all containers rendered on the header
    expect(await element.all(by.css('.datagrid-header th')).count()).toEqual(15);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-header.right th')).count()).toEqual(1);

    // Check all containers rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr:first-child td')).count()).toEqual(15);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr:first-child td')).count()).toEqual(2);
    expect(await element.all(by.css('.datagrid-wrapper.right tbody tr:first-child td')).count()).toEqual(1);

    // Check all rows rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr')).count()).toEqual(150);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr')).count()).toEqual(50);
    expect(await element.all(by.css('.datagrid-wrapper.right tbody tr')).count()).toEqual(50);
  });

  it('Should hide frozen columns in personalize', async () => {
    await openPersonalizationDialog();

    expect(await element(by.css('input[data-column-id="productId"]')).isEnabled()).toBe(false);
    expect(await element(by.css('input[data-column-id="productName"]')).isEnabled()).toBe(false);
  });

  it('Should render after sort', async () => {
    await element(by.css('#datagrid .datagrid-header.center th:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-header.center th:nth-child(2)')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-wrapper.left thead')).count()).toEqual(1);
    expect(await element.all(by.css('.datagrid-wrapper.center thead')).count()).toEqual(1);
    expect(await element.all(by.css('.datagrid-wrapper.right thead')).count()).toEqual(1);
    expect(await element.all(by.css('.datagrid-wrapper.left colgroup')).count()).toEqual(1);
    expect(await element.all(by.css('.datagrid-wrapper.center colgroup')).count()).toEqual(1);
    expect(await element.all(by.css('.datagrid-wrapper.right colgroup')).count()).toEqual(1);
  });
});

describe('Datagrid grouping and editing tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-editable?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:first-child'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  xit('Should remove rows and the pager will change', async () => {
    expect(await element(by.css('span.pager-total-pages')).getText()).toEqual('3');
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(1)')).click();
    await element(by.css('#remove-btn')).click();

    expect(await element(by.css('span.pager-total-pages')).getText()).toEqual('2');
  });

  it('addRow should work with grouping', async () => {
    await element(by.id('add-btn')).click();

    expect(await element(by.css('.rowstatus-cell .icon-rowstatus use')).getAttribute('href')).toEqual('#icon-exclamation');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)')).getText()).toEqual('17');
  });

  it('rowStatus should work with grouping', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.id('alert-btn')).click();

    expect(await element(by.css('.rowstatus-cell .icon-rowstatus use')).getAttribute('href')).toEqual('#icon-exclamation');
    expect(await element(by.css('tr.rowstatus-row-error')).isPresent()).toBe(true);
  });

  it('Editing should work with grouping', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).click();
    await browser.driver.sleep(config.sleepShort);
    await browser.actions().sendKeys('Test').perform();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(3)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getText()).toEqual('Test');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getAttribute('class')).toContain('is-dirty-cell');
  });

  it('Should show dirty indicator when changing page', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).click();
    await browser.driver.sleep(config.sleepShort);
    await browser.actions().sendKeys('Test').perform();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(3)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getText()).toEqual('Test');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getAttribute('class')).toContain('is-dirty-cell');

    await element(by.css('.pager-next')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev'))), config.waitsFor);

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getText()).toEqual('Alpert Fan Inc.');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getAttribute('class')).not.toContain('is-dirty-cell');

    await element(by.css('.pager-prev')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getText()).toEqual('Test');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4) td:nth-child(4)')).getAttribute('class')).toContain('is-dirty-cell');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-grouping-editing')).toEqual(0);
    });
  }
});

describe('Datagrid grouping headers and filter tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-filter?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.datagrid-rowgroup-header'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should filter and show groups', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(18);
    expect(await element.all(by.css('.datagrid-rowgroup-header')).count()).toEqual(7);

    await element(by.css('#example-grouping-filter-datagrid-1-header-filter-1')).sendKeys('Ha');
    await element(by.css('#example-grouping-filter-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(5);
    expect(await element.all(by.css('.datagrid-rowgroup-header')).count()).toEqual(2);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-grouping')).toEqual(0);
    });
  }
});

describe('Datagrid grouping with paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-paging');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should handle click', async () => {
    const cell = '#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)';

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
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-next .btn-icon'))), config.waitsFor);

    const cell = '#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)';
    const row = '#datagrid .datagrid-wrapper tbody tr:nth-child(2)';
    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('.pager-next')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev .btn-icon'))), config.waitsFor);

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');

    await element(by.css(cell)).click();

    expect(await element(by.css(row)).getAttribute('class')).not.toMatch('is-selected');
  });

  it('Should work to select all and deselect all', async () => {
    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('tr.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(5);
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('tr.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid grouping totals tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-totals?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.datagrid-rowgroup-header'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show some groups expanded and some collapsed', async () => {
    expect(await element.all(by.css('.datagrid-rowgroup-header.is-expanded')).count()).toEqual(3);
    expect(await element.all(by.css('.datagrid-rowgroup-header')).count()).toEqual(7);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-grouping-totals')).toEqual(0);
    });
  }
});

describe('Datagrid index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-index?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should generate automation ids', async () => {
    expect(await element(by.id('custom-id-col-productid')).getAttribute('id')).toEqual('custom-id-col-productid');
    expect(await element(by.id('custom-id-col-productid')).getAttribute('data-automation-id')).toEqual('custom-automation-id-col-productid');

    expect(await element(by.id('custom-id-title')).getAttribute('id')).toEqual('custom-id-title');
    expect(await element(by.id('custom-id-title')).getAttribute('data-automation-id')).toEqual('custom-automation-id-title');

    expect(await element(by.id('custom-id-actions')).getAttribute('id')).toEqual('custom-id-actions');
    expect(await element(by.id('custom-id-actions')).getAttribute('data-automation-id')).toEqual('custom-automation-id-actions');
  });

  it('Should show results', async () => {
    expect(await element(by.className('datagrid-result-count')).getText()).toBe('(7 results)');
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
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();

      const datagridEl = await element(by.id('datagrid'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(datagridEl, 'datagrid-index')).toEqual(0);
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

  it('Should generate automation ids', async () => {
    expect(await element(by.id('custom-id-title')).getAttribute('id')).toEqual('custom-id-title');
    expect(await element(by.id('custom-id-title')).getAttribute('data-automation-id')).toEqual('custom-automation-id-title');

    expect(await element(by.id('gridfilter')).getAttribute('id')).toEqual('gridfilter');
    expect(await element(by.id('gridfilter')).getAttribute('data-automation-id')).toEqual('custom-automation-id-search');
  });

  it('Should filter keyword results', async () => {
    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) tbody tr')).count()).toEqual(12);
    await element(by.id('gridfilter')).sendKeys('T');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) tbody tr')).count()).toEqual(11);
  });

  it('Should highlight keyword results', async () => {
    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) tbody tr')).count()).toEqual(12);
    await element(by.id('gridfilter')).sendKeys('26');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-wrapper:nth-child(2) tbody tr')).count()).toEqual(6);
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(6);
    expect(await element.all(by.css('.search-mode i')).get(0).getText()).toEqual('26');
  });
});

describe('Datagrid List Styles Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-list?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-islist')).toEqual(0);
    });
  }
});

describe('Datagrid mixed selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-mixed-selection?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow activation and deactivation', async () => {
    expect(await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('52106');
    await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
    await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-rowactivated');
  });

  it('Should handle selection ', async () => {
    await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-rowactivated');
    expect(await element(by.css('#datagrid-header .datagrid-wrapper:nth-child(1) tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-mixed-selection')).toEqual(0);
    });
  }
});

describe('Datagrid multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-multiselect.html?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(3)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have aria selected mixed when partly selected', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('.datagrid-checkbox.is-partial')).getAttribute('aria-checked')).toEqual('mixed');
  });

  it('Should handle removing selected rows ', async () => {
    await browser.wait(until.presenceOf($(S.gridRow())));
    const prevRowCount = await $$(S.gridRow()).count();

    expect(prevRowCount).toEqual(7);

    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: false }))));
    await $(S.gridColumn({ row: 1, column: 1 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: true }))));

    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: false }))));
    await $(S.gridColumn({ row: 2, column: 1 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: true }))));

    await $(S.removeRowButton()).click();

    await Promise.all([
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount - 1 })))),
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount }))))
    ]);

    expect(await $$(S.gridRow()).count()).toEqual(prevRowCount - 2);
  });

  it('Should have aria-checked and not aria-selected', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).getAttribute('aria-checked')).toEqual('true');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1) .datagrid-checkbox')).getAttribute('aria-selected')).toEqual(null);
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('aria-selected')).toEqual('true');
  });

  it('Should be able to tab into the header checkbox.', async () => {
    await browser.driver.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await browser.driver.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await browser.driver.switchTo().activeElement().sendKeys(protractor.Key.SPACE);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.selection-count')).getText()).toEqual('7 Selected');
  });

  it('Should work with sort', async () => {
    // select row 1
    await browser.wait(until.presenceOf($(S.gridColumn({ row: 1, column: 2 }))));
    await $(S.gridColumn({ row: 1, column: 2 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: true }))));
    // select row 2
    await browser.wait(until.presenceOf($(S.gridColumn({ row: 2, column: 2 }))));
    await $(S.gridColumn({ row: 2, column: 2 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: true }))));

    expect(await element(by.css('.selection-count')).getText()).toEqual('2 Selected');
    // sort ascending
    await browser.wait(
      until.presenceOf($('#datagrid .datagrid-header th.is-sortable:nth-child(2) .datagrid-header-text'))
    );
    await element(by.css('#datagrid .datagrid-header th.is-sortable:nth-child(2) .datagrid-header-text')).click();

    // sort descending
    await browser.wait(
      until.presenceOf($('#datagrid .datagrid-header th.is-sorted-asc:nth-child(2) .datagrid-header-text'))
    );
    await element(by.css('#datagrid .datagrid-header th.is-sorted-asc:nth-child(2) .datagrid-header-text')).click();
    await browser.wait(
      until.presenceOf($('#datagrid .datagrid-header th.is-sorted-desc:nth-child(2) .datagrid-header-text'))
    );

    // select another row now that sort is flipped
    await browser.wait(until.presenceOf($(S.gridColumn({ row: 1, column: 2 }))));
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: true }))));

    expect(await element(by.css('.selection-count')).getText()).toEqual('3 Selected');
    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(3);

    await browser.wait(until.presenceOf($(S.gridColumn({ row: 2, nthLastRow: true, column: 2 }))));
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-last-child(2) td:nth-child(2)')).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, nthLastRow: true, checked: false }))));

    expect(await element(by.css('.selection-count')).getText()).toEqual('2 Selected');
    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });

  it('Should hide checkbox column in personalize', async () => {
    await openPersonalizationDialog();

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(5);
  });

  it('Should remove two rows after selecting them in order', async () => {
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: false }))));
    await $(S.gridColumn({ row: 1, column: 2 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: true }))));

    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: false }))));
    await $(S.gridColumn({ row: 2, checked: false })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: true }))));

    const prevRowCount = await $$(S.gridRow()).count();
    await browser.wait(until.presenceOf($(S.removeRowButton())));
    await $(S.removeRowButton()).click();

    await Promise.all([
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount - 1 })))),
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount }))))
    ]);

    expect(await $$(S.gridRow()).count()).toEqual(prevRowCount - 2);
    expect(await $(S.gridColumn({ row: 1, column: 2 })).getText()).toEqual('2342203');
    expect(await $(S.gridColumn({ row: 2, column: 2 })).getText()).toEqual('2445204');
  });

  it('Should remove two rows after selecting them in reverse order', async () => {
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: false }))));
    await $(S.gridColumn({ row: 2, column: 2 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 2, checked: true }))));
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: false }))));
    await $(S.gridColumn({ row: 1, column: 2 })).click();
    await browser.wait(until.presenceOf($(S.gridRowCheckbox({ row: 1, checked: true }))));
    const prevRowCount = await $$(S.gridRow()).count();
    await browser.wait(until.presenceOf($(S.removeRowButton())));
    await $(S.removeRowButton()).click();
    await Promise.all([
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount - 1 })))),
      browser.wait(until.stalenessOf($(S.gridRow({ row: prevRowCount }))))
    ]);

    expect(await ($$(S.gridRow()).count())).toEqual(prevRowCount - 2);
    expect(await $(S.gridColumn({ row: 1, column: 2 })).getText()).toEqual('2342203');
    expect(await $(S.gridColumn({ row: 2, column: 2 })).getText()).toEqual('2445204');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-multiselect')).toEqual(0);
    });
  }
});

describe('Datagrid Nested Datagrid tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-nested-grids?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should expand and be clickable', async () => {
    await element(by.css('[aria-rowindex="1"] [aria-colindex="1"] button')).click();
    await browser.driver.sleep(config.sleep);

    await element.all(by.css('.row-btn')).first().click();

    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('.toast-message')).getText()).toEqual('The row #0 cell # 5 was clicked');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await element(by.css('[aria-rowindex="1"] [aria-colindex="1"] button')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-nested')).toEqual(0);
    });
  }
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

    await element(by.css('.pager-last .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('990');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('999');
  });

  xit('Should be able to move to first', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-last .btn-icon')).click();
    await element(by.css('.pager-first .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');
  });

  it('Should be able to move to next/prev', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('10');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('19');

    await element(by.css('.pager-prev .btn-icon')).click();
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

  it('Should sort correctly', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('999');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('990');
  });

  it('Should have correct header checkbox states', async () => {
    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(10);
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeTruthy();
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeFalsy();
  });

  it('Should have be able to filter and show counts', async () => {
    expect(await element.all(by.css('#datagrid tr.datagrid-row')).count()).toEqual(10);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(all 1000)');

    await element(by.id('example-paging-datagrid-1-header-filter-2')).sendKeys('214220');
    await element(by.id('example-paging-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('#datagrid tr.datagrid-row')).count()).toEqual(1);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(1 of 1000)');

    await element(by.id('example-paging-datagrid-1-header-filter-2')).clear();
    await element(by.id('example-paging-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('#datagrid tr.datagrid-row')).count()).toEqual(10);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(all 1000)');
  });

  if (!utils.isCI()) {
    it('Should work with sort', async () => {
      expect(await element(by.css('#datagrid .datagrid-header th:nth-child(2).is-sorted-desc')).isPresent()).toBeFalsy();

      await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('#datagrid .datagrid-header th:nth-child(2).is-sorted-desc')).isPresent()).toBeTruthy();

      await element(by.css('.pager-next .btn-icon')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.css('.pager-prev .btn-icon')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('#datagrid .datagrid-header th:nth-child(2).is-sorted-desc')).isPresent()).toBeTruthy();
    });
  }

  if (!utils.isCI()) {
    it('Should not move on a page that is more than the max', async () => {
      expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
      expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');

      await element(by.css('.pager-count input')).clear();
      await browser.driver.sleep(config.sleepShort);
      await element(by.css('.pager-count input')).sendKeys('101');
      await browser.driver.sleep(config.sleepShort);
      await element(by.css('.pager-count input')).sendKeys(protractor.Key.ENTER);
      await browser.driver.sleep(config.sleepShort);

      expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) span')).getText()).toEqual('0');
      expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) span')).getText()).toEqual('9');
    });
  }
});

describe('Datagrid paging client side tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-paging-client-side');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to do a keyword search', async () => {
    await element(by.id('gridfilter')).sendKeys('ressor 2');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(111 of 1,000 results)');
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(10);
  });

  it('Should be able to move to keyword search and sort', async () => {
    await element(by.id('gridfilter')).sendKeys('ressor 1');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(111 of 1,000 results)');
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(10);

    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(111 of 1,000 results)');
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(10);
  });

  it('Should be able to move to keyword search and page', async () => {
    await element(by.id('gridfilter')).sendKeys('ressor 1');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(111 of 1,000 results)');
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(10);

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(111 of 1,000 results)');
    expect(await element.all(by.css('.search-mode i')).count()).toEqual(10);
  });

  it('Should be able to move to last', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');

    await element(by.css('.pager-last .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('990');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('999');
  });

  xit('Should be able to move to first', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');

    await element(by.css('.pager-last .btn-icon')).click();
    await element(by.css('.pager-first .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');
  });

  it('Should be able to move to next/prev', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('10');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('19');

    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');
  });

  it('Should be able to move to specific page', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');

    await element(by.css('.pager-count input')).sendKeys(protractor.Key.BACK_SPACE);
    await element(by.css('.pager-count input')).sendKeys('5');
    await element(by.css('.pager-count input')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('40');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('49');
  });

  it('Should sort correctly', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('0');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('9');

    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(2) div')).getText()).toEqual('999');
    expect(await element(by.css('tbody tr:nth-child(10) td:nth-child(2) div')).getText()).toEqual('990');
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
    await element(by.css('li.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('tbody tr[aria-rowindex="2"]'))), config.waitsFor);

    expect(await element(by.css('tbody tr[aria-rowindex="2"]')).getAttribute('class')).toContain('is-rowactivated');
  });

  it('Should reset selections after changing page', async () => {
    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(5);

    await element(by.css('.pager-next')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid Row Row Reorder', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-reorder?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show on hover', async () => {
    await browser.actions()
      .mouseMove(await element(by.css('#datagrid thead th:nth-child(2)'))).perform();

    expect(await element(by.css('#datagrid thead th:nth-child(2)')).isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);
      await browser.actions()
        .mouseMove(await element(by.css('#datagrid thead th:nth-child(2)'))).perform();

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-row-reorder')).toEqual(0);
    });
  }
});

describe('Datagrid Row Numbers', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-row-numbers?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should number rows', async () => {
    expect(await element(by.css('#datagrid tr:nth-child(1) td:nth-child(1)')).getText()).toBe('1');
    expect(await element(by.css('#datagrid tr:nth-child(1) td:nth-child(2)')).getText()).toBe('214220');
    expect(await element(by.css('#datagrid tr:nth-child(20) td:nth-child(1)')).getText()).toBe('20');
    expect(await element(by.css('#datagrid tr:nth-child(20) td:nth-child(2)')).getText()).toBe('214239');
  });

  it('Should number rows on sort', async () => {
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();
    await browser.driver.sleep(350);
    await element(by.css('#datagrid .datagrid-header th:nth-child(2)')).click();

    expect(await element(by.css('#datagrid tr:nth-child(1) td:nth-child(1)')).getText()).toBe('1');
    expect(await element(by.css('#datagrid tr:nth-child(1) td:nth-child(2)')).getText()).toBe('214319');
    expect(await element(by.css('#datagrid tr:nth-child(20) td:nth-child(1)')).getText()).toBe('20');
    expect(await element(by.css('#datagrid tr:nth-child(20) td:nth-child(2)')).getText()).toBe('214300');
  });
});

describe('Datagrid Date default values', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-accept-default-date-value?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render dates and N/A', async () => {
    expect(await element(by.css('tbody tr:nth-child(1) td:nth-child(5) div')).getText()).toEqual('01.10.2018');
    expect(await element(by.css('tbody tr:nth-child(2) td:nth-child(5) div')).getText()).toEqual('03.11.2017');
    expect(await element(by.css('tbody tr:nth-child(3) td:nth-child(5) div')).getText()).toEqual('N/A');
  });
});

describe('Datagrid Alert and Badges Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-alerts?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show data on the click events', async () => {
    await element(by.css('#datagrid tr:nth-child(1) td:nth-child(9) .tag')).click();

    expect(await element.all(by.css('.toast-title')).count()).toEqual(1);
    expect(await element(by.css('.toast-message')).getText()).toEqual('Tag Data: #210.99');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-tags-badges')).toEqual(0);
    });
  }
});

describe('Datagrid Alert and Badges Frozen Column Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-frozen-columns-with-alert?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-alerts-xs')).toEqual(0);
    });
  }
});

describe('Datagrid Align Header Text Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-align-header-text?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-test-align-header-text')).toEqual(0);
    });
  }
});

describe('Datagrid Align Header Text Toggle Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-align-header-text-toggle?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should toggle filter row', async () => {
    await element.all(by.css('.btn-actions')).first().click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.is-open'))), config.waitsFor);
    await element(by.css('li a[data-option="show-filter-row"')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.has-filterable-columns'))).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await element.all(by.css('.btn-actions')).first().click();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.is-open'))), config.waitsFor);
      await element(by.css('li a[data-option="show-filter-row"')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('.has-filterable-columns'))).toBeTruthy();

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-test-align-header-text-toggle')).toEqual(0);
    });
  }
});

describe('Datagrid page size selector tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-page-size-selector');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
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

describe('Datagrid test post renderer tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-post-renderer-tree?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Render dynamic buttons with onPostRenderCell', async () => {
    const buttons = await element.all(by.css('.datagrid-cell-wrapper .btn-icon')).count();

    expect(buttons).toEqual(7);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-cell-post-renderer')).toEqual(0);
    });
  }
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
  });

  it('Should work with sort', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element.all(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).first().getText()).toEqual('2142201');

    // Sort
    await element(by.css('#datagrid .datagrid-header th:nth-child(4)')).click();
    await browser.driver.sleep(350);
    await element(by.css('#datagrid .datagrid-header th:nth-child(4)')).click();

    expect(await element.all(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).first().getText()).toEqual('2142201');

    await browser.driver.sleep(350);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    await browser.driver.sleep(350);

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element.all(by.css('#datagrid .datagrid-row.is-selected td:nth-child(1) span')).first().getText()).toEqual('2642205');
  });
});

describe('Datagrid spacer row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-spacer-column');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render spacer rows', async () => {
    expect(await element.all(by.css('#datagrid .datagrid-spacer-column')).count()).toEqual(7);
    expect(await element.all(by.css('#datagrid .datagrid-header-spacer-column')).count()).toEqual(1);
  });
});

describe('Datagrid summary row tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-summary-row?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should add up rows', async () => {
    expect(await element(by.css('#datagrid tr.datagrid-summary-row td:nth-child(6)')).getText()).toEqual('1,861.00');
    expect(await element(by.css('#datagrid tr.datagrid-summary-row td:nth-child(7)')).getText()).toEqual('20.53 %');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-summary-row')).toEqual(0);
    });
  }
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

  it('Should toggle sort indicator if set initially', async () => {
    expect(await element(by.css('#datagrid thead th:nth-child(3)')).getAttribute('class')).toContain('is-sorted-asc');
    await element(by.css('#datagrid thead th:nth-child(3) .datagrid-header-text')).click();

    expect(await element(by.css('#datagrid thead th:nth-child(3)')).getText()).toEqual('Product Name');
    await browser.driver.sleep(350);

    expect(await element(by.css('#datagrid thead th:nth-child(3)')).getAttribute('class')).toContain('is-sorted-desc');
    await element(by.css('#datagrid thead th:nth-child(3) .datagrid-header-text')).click();
    await browser.driver.sleep(350);

    expect(await element(by.css('#datagrid thead th:nth-child(3)')).getAttribute('class')).toContain('is-sorted-asc');
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

describe('Datagrid Duplicate Ids Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-duplicate-column-ids?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-dup-ids')).toEqual(0);
    });
  }
});

describe('Datagrid checkbox disabled editor tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-checkboxes?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render correct aria', async () => {
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(6)')).getAttribute('aria-checked')).toEqual('true');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(6)')).getAttribute('aria-readonly')).toEqual('true');

    expect(await element(by.css('#datagrid tbody tr:nth-child(2) td:nth-child(6)')).getAttribute('aria-checked')).toEqual('false');
    expect(await element(by.css('#datagrid tbody tr:nth-child(2) td:nth-child(6)')).getAttribute('aria-readonly')).toBeFalsy();

    expect(await element(by.css('#datagrid tbody tr:nth-child(6) td:nth-child(6)')).getAttribute('aria-checked')).toEqual('true');
    expect(await element(by.css('#datagrid tbody tr:nth-child(6) td:nth-child(6)')).getAttribute('aria-readonly')).toBeFalsy();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-checkbox-disabled')).toEqual(0);
    });
  }
});

describe('Datagrid Lookup Editor', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-lookup');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('should be able to select with typing', async () => {
    const staticCell = '#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)';
    await element(by.css(staticCell)).click();

    const editCell = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCell));
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(inputEl), config.waitsFor);
    await element(by.css(editCell)).sendKeys('2142201');
    await element(by.css(editCell)).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css(staticCell)).getText()).toEqual('2142201');
  });

  it('should be able to select with the dialog when clicking the cell', async () => {
    const staticCell = '#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)';
    await element(by.css(staticCell)).click();
    await element(by.css('.has-editor.is-editing .trigger')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('.lookup-modal tr:nth-child(5) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('.has-editor.is-editing')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css(staticCell)).getText()).toEqual('2542205');
  });
});

describe('Datagrid Lookup Mask Editor', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-lookup-mask');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('should be usable with a Mask', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('aaa');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('');

    await element(by.css(editCellSelector)).sendKeys('12345678');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('1234567');
  });
});

describe('Datagrid Time Editor Test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-time?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be usable with a Mask', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('aaaaa');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('');
    await element(by.css(editCellSelector)).sendKeys('2:40 AM');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('2:40 AM');
  });

  it('should be editable', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await inputEl.sendKeys('2:40 AM');
    await inputEl.sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(2)')).getText()).toEqual('2:40 AM');
  });

  it('Should filter time', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(9);

    await element(by.css('#test-editable-time-datagrid-1-header-filter-1')).sendKeys('1:30 AM');
    await element(by.css('#test-editable-time-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(1);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-time-editor')).toEqual(0);
    });
  }
});

describe('Datagrid editor dropdown source tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editor-dropdown-source');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
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

  it('Should select and filter', async () => {
    expect(await element.all(by.css('#datagrid tbody tr')).count()).toEqual(7);
    const multiselectEl = await element(by.css('.datagrid-filter-wrapper div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await multiselectEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
    const multiselectSearchEl = await element(by.id('dropdown-search'));
    await multiselectSearchEl.click();
    await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await multiselectSearchEl.sendKeys(protractor.Key.SPACE);
    await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await multiselectSearchEl.sendKeys(protractor.Key.SPACE);

    expect(await element.all(by.css('#datagrid tbody tr')).count()).toEqual(4);
  });

  it('Should filter twice in a row and filter', async () => {
    expect(await element.all(by.css('#datagrid tbody tr')).count()).toEqual(7);
    const inputEl = await element(by.id('test-editor-dropdown-source-datagrid-1-header-filter-1'));
    await inputEl.click();
    await inputEl.sendKeys('Com');
    await inputEl.sendKeys(protractor.Key.ENTER);
    await inputEl.sendKeys('Com');
    await inputEl.sendKeys(protractor.Key.ENTER);
    await inputEl.sendKeys('');
    await inputEl.sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.toast-title')).count()).toEqual(3);
  });
});

describe('Datagrid onKeyDown Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-onkeydown?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show toast on keydown', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('j');
    await element(by.css(editCellSelector)).sendKeys(protractor.Key.TAB);
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('#toast-container .toast-message')).last()), config.waitsFor);

    expect(await element.all(by.css('#toast-container .toast-message')).first().getText()).toEqual('You hit j. Event has been vetoed, so nothing will happen.');
    expect(await element.all(by.css('#toast-container .toast-message')).last().getText()).toEqual('You hit Tab. Event has been vetoed, so nothing will happen.');
  });
});

describe('Datagrid Editor Single Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-editable-editor-singleline-rowheight?layout=nofrills');

    const datagridEl = await element(by.css('#readonly-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should render content', async () => {
    expect(await element(by.css('#readonly-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('Bold & Italics');
  });
});

describe('Datagrid Header Alignment with Ellipsis', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-ellipsis-header-align?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-header-align-short-row')).toEqual(0);
    });
  }
});

describe('Datagrid Header Alignment with Ellipsis and Sorting', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-ellipsis-sort-indicator?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-header-align-ellipsis-sort')).toEqual(0);
    });
  }
});

describe('Datagrid Expandable Row with checkboxes', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-expandable-row-checkboxes');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should be able to check the checkboxes in an expandable area', async () => {
    await element(by.css('[aria-rowindex="1"] [aria-colindex="1"] button')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-expandable-row.is-expanded .checkbox')).first().isSelected()).toBeTruthy();
    await element(by.css('.datagrid-expandable-row.is-expanded .inline-checkbox')).click();

    expect(await element.all(by.css('.datagrid-expandable-row.is-expanded .checkbox')).first().isSelected()).toBeFalsy();
  });
});

describe('Datagrid Expandable Row with multiselect', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-expandable-row-multiselect');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should work with shift key', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    const elem = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(9) td:nth-child(1)'));

    // Simulate Shift + Click
    await browser.actions().sendKeys(protractor.Key.SHIFT).perform().then(async () => {
      await elem.click();

      expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(4);
      // Release the shift key by toggling it
      await browser.actions().sendKeys(protractor.Key.SHIFT).perform();
    });
  });

  it('Should work with click key', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(9) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid Empty Card Scrolling', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-card?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should show empty indicator initially', async () => {
    expect(await element.all(by.css('.empty-message')).count()).toEqual(1);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-empty-card')).toEqual(0);
    });
  }
});

describe('Datagrid Empty Message Tests After Load', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-message-after-load?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper'));
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

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.id('show-empty-message')).click();
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-empty-message-after-load')).toEqual(0);
    });
  }
});

describe('Datagrid Empty Message Button', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-message-button?layout=nofrills');

    const button = await element(by.id('reload'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(button), config.waitsFor);
  });

  it('Should be able to click the relaod button', async () => {
    await element(by.id('reload')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('.toast .toast-title')).getText()).toEqual('Retry button clicked');
  });
});

describe('Datagrid Empty Message with two rows', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-message-two-rows?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not show empty indicator on load', async () => {
    expect(await element(by.css('.empty-message')).isDisplayed()).toEqual(false);
  });

  it('Should show empty indicator on filtering zero', async () => {
    await element(by.id('test-empty-message-two-rows-datagrid-1-header-filter-1')).sendKeys('33');
    await element(by.id('test-empty-message-two-rows-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.empty-message')).isDisplayed()).toEqual(true);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(0 of 2 results)');
  });

  it('Should not show empty indicator on filtering one', async () => {
    await element(by.id('test-empty-message-two-rows-datagrid-1-header-filter-1')).sendKeys('22');
    await element(by.id('test-empty-message-two-rows-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.empty-message')).isDisplayed()).toEqual(false);
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(1 of 2 results)');
  });
});

describe('Datagrid Empty Message Tests After Load in Scrollable Flex', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-empty-message-after-load-in-scrollable-flex?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper'));
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

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.id('show-empty-message')).click();
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-empty-message-scroll-flex')).toEqual(0);
    });
  }
});

describe('Datagrid Header Overlapping Sorting Indicator', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-overlapping-sort-indicator?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-header-align-overlapping-sort-indicator')).toEqual(0);
    });
  }
});

describe('Datagrid Dirty and New Row Indicator', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-overlaps-row-cell-indicators?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show a new line indicator', async () => {
    await element(by.id('add-row-top')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1).rowstatus-cell')).isPresent()).toBe(true);
    await utils.checkForErrors();
  });

  it('should show a dirty indicator on existing rows', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    const editCellSelector = '.has-editor.is-editing input';
    const inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('121');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('121');
    await element(by.css(editCellSelector)).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1).is-dirty-cell')).isPresent()).toBe(true);
  });

  it('should not show a dirty indicator on row-status cell with new rows', async () => {
    const cell = num => `#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(${num})`;
    const pseudoScript = sel => `return window.getComputedStyle(document.querySelector('${sel}'), ':before').getPropertyValue('border-width');`;

    await element(by.id('add-row-top')).click();

    await element(by.css(cell(1))).click();
    let editCellSelector = '.has-editor.is-editing input';
    let inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('121');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('121');
    await element(by.css(editCellSelector)).sendKeys(protractor.Key.ENTER);

    await element(by.css(cell(2))).click();
    editCellSelector = '.has-editor.is-editing input';
    inputEl = await element(by.css(editCellSelector));
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);
    await element(by.css(editCellSelector)).sendKeys('122');

    expect(await element(by.css(editCellSelector)).getAttribute('value')).toEqual('122');
    await element(by.css(editCellSelector)).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css(`${cell(1)}.is-dirty-cell`)).isPresent()).toBe(true);
    await browser.executeScript(pseudoScript(`${cell(1)}.is-dirty-cell`)).then((data) => {
      expect(data).toEqual('0px');
    });

    expect(await element(by.css(`${cell(2)}.is-dirty-cell`)).isPresent()).toBe(true);
    await browser.executeScript(pseudoScript(`${cell(2)}.is-dirty-cell`)).then((data) => {
      expect(data).toEqual('4px');
    });
  });
});

describe('Datagrid Frozen Column Card (auto) tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-card-frozen-columns?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render frozen columns', async () => {
    // Check all containers rendered on the header
    expect(await element.all(by.css('.datagrid-header th')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(1);

    // Check all containers rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr:first-child td')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr:first-child td')).count()).toEqual(1);

    // Check all rows rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr')).count()).toEqual(14);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr')).count()).toEqual(7);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-card-frozen-auto')).toEqual(0);
    });
  }
});

describe('Datagrid Frozen Column Card (fixed) tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-card-frozen-columns-fixed-row-height?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render frozen columns', async () => {
    // Check all containers rendered on the header
    expect(await element.all(by.css('.datagrid-header th')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-header.left th')).count()).toEqual(1);

    // Check all containers rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr:first-child td')).count()).toEqual(8);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr:first-child td')).count()).toEqual(1);

    // Check all rows rendered on the body
    expect(await element.all(by.css('.datagrid-wrapper tbody tr')).count()).toEqual(14);
    expect(await element.all(by.css('.datagrid-wrapper.left tbody tr')).count()).toEqual(7);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-card-frozen')).toEqual(0);
    });
  }
});

describe('Datagrid contextmenu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-contextmenu');

    const datagridEl = await element(by.css('#readonly-datagrid .datagrid-wrapper'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isCI() && !utils.isBS()) {
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

    it('Should focus cell on escape', async () => {
      const td = await element(by.css('#readonly-datagrid tr:first-child td:first-child')).getLocation();
      await browser.actions()
        .mouseMove(td)
        .click(protractor.Button.RIGHT)
        .perform();

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#grid-actions-menu'))), config.waitsFor);

      await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
      const cellEl = await browser.driver.switchTo().activeElement();

      expect(await cellEl.getAttribute('aria-colindex')).not.toEqual('');
    });
  }
});

describe('Datagrid Custom Tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-custom-tooltip-dynamic?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show tooltip on text cut off', async () => {
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="1"] td[aria-colindex="4"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    const tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
    expect(await tooltip.getText()).toEqual('Row: 0 Cell: 3 Value: Error');
  });
});

describe('Datagrid custom number format tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-custom-number-formats?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should format numbers correctly', async () => {
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('145000');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(3)')).getText()).toEqual('210.990');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(4)')).getText()).toEqual('$210.99');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(5)')).getText()).toEqual('14,500,000 %');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(6)')).getText()).toEqual('145,000');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(7)')).getText()).toEqual('145,000.00');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(8)')).getText()).toEqual('100.00');
    expect(await element(by.css('#datagrid tbody tr:nth-child(2) td:nth-child(8)')).getText()).toEqual('836.45');
  });

  it('Should format numbers correctly as strings (nl-NL)', async () => {
    await utils.setPage('/components/datagrid/test-custom-number-formats?layout=nofrills&locale=nl-NL');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);

    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(8)')).getText()).toEqual('100,00');
    expect(await element(by.css('#datagrid tbody tr:nth-child(2) td:nth-child(8)')).getText()).toEqual('836,45');
    expect(await element(by.css('#datagrid tbody tr:nth-child(3) td:nth-child(8)')).getText()).toEqual('1.200,12');
    expect(await element(by.css('#datagrid tbody tr:nth-child(4) td:nth-child(8)')).getText()).toEqual('1.200,12');
    expect(await element(by.css('#datagrid tbody tr:nth-child(5) td:nth-child(8)')).getText()).toEqual('10,99');
    expect(await element(by.css('#datagrid tbody tr:nth-child(6) td:nth-child(8)')).getText()).toEqual('130.300,00');
    expect(await element(by.css('#datagrid tbody tr:nth-child(7) td:nth-child(8)')).getText()).toEqual('130.300,00');
  });
});

describe('Datagrid custom date format tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-custom-date-formats?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should format dates correctly', async () => {
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('3/15/2016');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('3/15/2016 12:30:36');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(3)')).getText()).toEqual('3/15/2016 12:30 PM');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(4)')).getText()).toEqual('2016-03-15T12:30:36.120');
    expect(await element(by.css('#datagrid tbody tr:nth-child(2) td:nth-child(4)')).getText()).toEqual('2016-03-15T00:30:36.008');
    expect(await element(by.css('#datagrid tbody tr:nth-child(3) td:nth-child(4)')).getText()).toEqual('2014-07-03T01:00:00.000');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(5)')).getText()).toEqual('3/15/2016');
    expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(6)')).getText()).toEqual('12:30:36 PM');
  });
});

describe('Datagrid filter load data and update columns tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-load-data-update-columns?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should select and filter', async () => {
    expect(await element.all(by.css('#datagrid tbody tr')).count()).toEqual(7);
    const multiselectEl = await element(by.css('.datagrid-filter-wrapper div.dropdown'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(multiselectEl), config.waitsFor);
    await multiselectEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('ul[role="listbox"]'))), config.waitsFor);
    const multiselectSearchEl = await element(by.id('dropdown-search'));
    await multiselectSearchEl.click();
    await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await multiselectSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await multiselectSearchEl.sendKeys(protractor.Key.SPACE);

    expect(await element.all(by.css('#datagrid tbody tr')).count()).toEqual(3);
    await utils.checkForErrors();
  });
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys('23');
    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(1);

    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).clear();
    await element(by.id('test-filter-singleselect-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(8);
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).not.toMatch('is-selected');
  });
});

describe('Datagrid filter lookup custom click function tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-filter-lookup-click-function?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should attempt to open the filter and have the correct popup', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(9);

    await element(by.css('#test-filter-lookup-click-function-datagrid-1-header-1 div.datagrid-filter-wrapper span.lookup-wrapper button.trigger')).click();

    expect(browser.driver.switchTo().alert().getText()).toBe('Grid information found');
    await browser.driver.switchTo().alert().accept();
  });

  it('Should use custom filter conditions for filter button popup', async () => {
    expect(await element.all(by.css('.datagrid-row')).count()).toEqual(9);
    const filterBtn = await element(by.css('#test-filter-lookup-click-function-datagrid-1-header-1 div.datagrid-filter-wrapper .btn-filter'));

    expect(await filterBtn.getAttribute('data-default')).toEqual('equals');
    await filterBtn.click();

    expect(await element(by.css('ul.popupmenu.is-open')).isDisplayed()).toBeTruthy();
    expect(await element(by.css('ul.popupmenu.is-open > li:nth-child(1)')).getText()).toBe('Equals');
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
    await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tbody tr:nth-child(3)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(3)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tr:nth-child(7) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tbody tr:nth-child(7)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tbody tr:nth-child(8)')).getAttribute('class')).not.toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(7)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tbody tr:nth-child(8)')).getAttribute('class')).not.toMatch('is-selected');

    await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tr:nth-child(11) td:nth-child(1)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(1) tr:nth-child(11)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper:nth-child(2) tr:nth-child(11)')).getAttribute('class')).toMatch('is-selected');

    // Expect it marked as selected on both sides (frozenColumns)
    expect(await element.all(by.css('#datagrid .datagrid-wrapper:nth-child(1) .datagrid-row.is-selected')).count()).toEqual(3);
    expect(await element.all(by.css('#datagrid .datagrid-wrapper:nth-child(2) .datagrid-row.is-selected')).count()).toEqual(3);
  });
});

describe('Datagrid grouping aggregators', () => {
  it('Should be to able aggregate an average', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-avg');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(2)')).getText()).toEqual('Avg');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(3)')).getText()).toEqual('1450');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(12) td:nth-child(3)')).getText()).toEqual('1940');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(16) td:nth-child(3)')).getText()).toEqual('3200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(19) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(23) td:nth-child(3)')).getText()).toEqual('3700');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(29) td:nth-child(3)')).getText()).toEqual('3200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(32) td:nth-child(3)')).getText()).toEqual('2200');
  });

  it('Should be to able aggregate a count', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-count');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(2)')).getText()).toEqual('Count (non empty)');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(3)')).getText()).toEqual('2');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(12) td:nth-child(3)')).getText()).toEqual('5');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(16) td:nth-child(3)')).getText()).toEqual('2');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(19) td:nth-child(3)')).getText()).toEqual('1');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(23) td:nth-child(3)')).getText()).toEqual('2');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(29) td:nth-child(3)')).getText()).toEqual('2');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(32) td:nth-child(3)')).getText()).toEqual('1');
  });

  it('Should be able to aggregate as a list', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-list');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(5)')).getText()).toEqual('700PE1PE11041');
  });

  it('Should be able to aggregate a max', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-max');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(2)')).getText()).toEqual('Max');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(3)')).getText()).toEqual('1700');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(12) td:nth-child(3)')).getText()).toEqual('2200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(16) td:nth-child(3)')).getText()).toEqual('3200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(19) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(23) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(29) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(32) td:nth-child(3)')).getText()).toEqual('2200');
  });

  it('Should be able to aggregate a min', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-min');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(2)')).getText()).toEqual('Min');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(3)')).getText()).toEqual('1200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(12) td:nth-child(3)')).getText()).toEqual('1500');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(16) td:nth-child(3)')).getText()).toEqual('3200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(19) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(23) td:nth-child(3)')).getText()).toEqual('3200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(29) td:nth-child(3)')).getText()).toEqual('2200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(32) td:nth-child(3)')).getText()).toEqual('2200');
  });

  it('Should be able to aggregate a sum', async () => {
    await utils.setPage('/components/datagrid/test-grouping-aggregators-sum');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await utils.checkForErrors();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(2)')).getText()).toEqual('Sum');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(3)')).getText()).toEqual('2900');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(12) td:nth-child(3)')).getText()).toEqual('9700');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(16) td:nth-child(3)')).getText()).toEqual('6400');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(19) td:nth-child(3)')).getText()).toEqual('4200');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(23) td:nth-child(3)')).getText()).toEqual('7400');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(29) td:nth-child(3)')).getText()).toEqual('6400');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(32) td:nth-child(3)')).getText()).toEqual('2200');
  });
});

describe('Datagrid hide selection checkbox tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-hide-selection-checkbox');

    const datagridEl = await element(by.css('#datagrid .datagrid-header .datagrid-checkbox'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not show selection checkbox', async () => {
    expect(await element(by.css('#datagrid .datagrid-header .datagrid-checkbox')).isDisplayed()).toBeFalsy();
  });
});

describe('Datagrid icon buttons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-icon-buttons?theme=classic');

    const datagridEl = await element(by.css('#readonly-datagrid .datagrid-wrapper tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.id('readonly-datagrid'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-icon-buttons')).toEqual(0);
    });
  }

  it('Should have disabled buttons', async () => {
    expect(await element.all(by.css('.row-btn[disabled]')).count()).toEqual(4);
  });
});

describe('Datagrid keyword search server side tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-keyword-search-serverside?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show highlights on server side keyword search', async () => {
    await element(by.id('gridfilter')).click();
    await element(by.id('gridfilter')).sendKeys('214');
    await element(by.id('gridfilter')).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(781 results)');
    expect(await element.all(by.css('.datagrid-cell-wrapper i')).count()).toEqual(10);
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.id('clear')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });

  it('Should be able to select and reload and preserve rows', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.id('save')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);
  });
});

describe('Datagrid loaddata clear selected rows tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-loaddata-clear-selected-rows');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should be able to select then update rows, and have no selected rows', async () => {
    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await element(by.id('show-selected')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('toast-container'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.toast-message')).getText()).toEqual('Number selected rows: 7');
    await element(by.css('#toast-container .btn-close')).click();
    await element(by.id('load-other')).click();
    await element(by.id('show-selected')).click();

    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('toast-container'))), config.waitsFor);

    expect(await element.all(by.css('.toast-message')).last().getText()).toEqual('Number selected rows: 0');
  });
});

describe('Datagrid with long cell text', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-long-text?theme=classic&layout=nofrills');

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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-long-text')).toEqual(0);
    });
  }
});

describe('Datagrid disableRowDeactivation setting tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-mixed-selection-disable-row-dectivation');

    const datagridEl = await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should allow activation but not deactivation', async () => {
    expect(await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).getText()).toEqual('52106');
    await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
    await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid-header .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-rowactivated');
  });
});

describe('Datagrid on modal with no default size', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-modal-datagrid-single-column?theme=classic');
    await element(by.id('open-modal')).click();

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-modal-size')).toEqual(0);
    });
  }
});

describe('Datagrid on modal with no default size (two columns)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-modal-datagrid-two-columns?theme=classic');
    await element(by.id('open-modal')).click();

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-modal-size-two')).toEqual(0);
    });
  }
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)')).getAttribute('class')).toMatch('is-selected');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)')).getAttribute('class')).toMatch('is-selected');
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
    expect(await element.all(by.css('.pager-toolbar button[disabled]')).count()).toEqual(2);
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

    expect(await element.all(by.css('.pager-toolbar button[disabled]')).count()).toEqual(4);

    await element(by.id('force-enabled')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.pager-toolbar button[disabled]')).count()).toEqual(2);
  });
});

describe('Datagrid paging multiselect across pages', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-multiselect-select-across-page');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select across pages', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next')).click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1).is-selected'))), config.waitsFor);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid paging multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-multiselect');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and when changing pages the selections reset', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);
  });
});

describe('Datagrid paging indeterminate multiple select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-indeterminate-multiple');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  xit('Should be able to select and have it clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(2);

    await browser.driver.sleep(config.sleep);
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await browser.driver.sleep(config.sleep);
    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid paging indeterminate single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-indeterminate-single?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have it clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-paging-indeterminate-single-first-page')).toEqual(0);
      await element(by.css('.pager-last')).click();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-paging-indeterminate-single-last-page')).toEqual(0);
    });
  }
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);

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
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(10);
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked.is-partial')).isPresent()).toBeFalsy();
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeTruthy();

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(8);
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked.is-partial')).isPresent()).toBeTruthy();
    expect(await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox.is-checked')).isPresent()).toBeTruthy();
  });
});

describe('Datagrid Paging with Summary Row test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-with-summary-row?theme=classic&layout=nofrills');

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

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-summary-row-paging')).toEqual(0);
    });
  }
});

describe('Datagrid paging serverside single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-serverside-single');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to select and have selections clear when paging', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(1);

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);

    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-row.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid save user settings', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-save-settings');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(4)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  afterEach(async () => {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isCI() && !utils.isBS()) {
    it('Should save active page on reload', async () => {
      await element(by.css('li.pager-next .btn-icon')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('.pager-count input')).getAttribute('value')).toEqual('2');
      await browser.refresh();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('.pager-count input')).getAttribute('value')).toEqual('2');
    });

    it('Should save sort on reload', async () => {
      expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('0');
      await element(by.css('#datagrid .datagrid-header th:nth-child(1)')).click();
      await element(by.css('#datagrid .datagrid-header th:nth-child(1)')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('99');
      await browser.refresh();

      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('99');
    });
  }
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('.is-selected.is-active-row')).count()).toEqual(1);
  });
});

describe('Datagrid select and filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-select-filter-issue');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should focus and activate the first row', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);

    await element(by.id('test-select-filter-issue-datagrid-1-header-filter-2')).sendKeys('1');
    await element(by.id('test-select-filter-issue-datagrid-1-header-filter-2')).sendKeys(protractor.Key.ENTER);

    await utils.checkForErrors();

    expect(await element.all(by.css('tbody tr')).count()).toEqual(2);
    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);
    await utils.checkForErrors();

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await utils.checkForErrors();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid select event tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-selected-event');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should fire a toast on select', async () => {
    await element(by.css('#testing-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('toast-container'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#toast-container .toast-message')).getText()).toEqual(['The row #1 containing the product name Compressor triggered a selected event']);
  });
});

describe('Datagrid Targeted Achievement', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-targeted-achievement?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(1)'));
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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-targetted')).toEqual(0);
    });
  }
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

  if (utils.isChrome() && !utils.isCI()) {
    it('Should Render Timezones', async () => {
      expect(await element(by.css('.datagrid tr:nth-child(1) td:nth-child(1)')).getText()).toEqual('03-04-2019');
      let text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(2)')).getText();

      expect(['03-04-2019 00:00 GMT-5', '03-04-2019 00:00 GMT-4', '03-04-2019 00:00 EDT', '03-04-2019 00:00 EST']).toContain(text);
      text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(3)')).getText();

      expect(['03-04-2019 00:00 Eastern-standaardtijd', '03-04-2019 00:00 Eastern-zomertijd']).toContain(text);

      text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(4)')).getText();

      expect(['03-04-2019 00:00 GMT-5', '03-04-2019 00:00 GMT-4', '03-04-2019 00:00 EDT', '03-04-2019 00:00 EST']).toContain(text);

      text = await element(by.css('.datagrid tr:nth-child(1) td:nth-child(5)')).getText();

      expect(['03-04-2019 00:00 GMT-5', '03-04-2019 00:00 GMT-4', '03-04-2019 00:00 EDT', '03-04-2019 00:00 EST']).toContain(text);
    });
  }
});

describe('Datagrid editable tree tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-editable?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should fire is editable going into edit mode', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(8) td:nth-child(5)')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('#toast-container .toast-message')).getText()).toEqual('You initiated edit on id: 8');
    expect(await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(8) td:nth-child(5) input')).isPresent()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-edit-tree')).toEqual(0);
    });
  }
});

describe('Datagrid tree filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-filter?layout=nofrills');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should show empty message on filter', async () => {
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(5 results)');
    expect(await element(by.css('.empty-message')).isDisplayed()).toBeFalsy();

    await element(by.id('test-tree-filter-datagrid-1-header-filter-0')).click();
    await element(by.id('test-tree-filter-datagrid-1-header-filter-0')).sendKeys('I dont exist');
    await element(by.id('test-tree-filter-datagrid-1-header-filter-0')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(0 of 5 results)');
    expect(await element(by.css('.empty-message')).isDisplayed()).toBeTruthy();
  });
});

describe('Datagrid Tree and Frozen Column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-frozen-columns?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.center .datagrid tr:nth-child(10)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should expand tree nodes', async () => {
    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(20);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(26);
    await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(14);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(32);

    await element(by.css('#datagrid tbody tr:nth-child(15) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(0);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(46);
  });

  it('Should collapse tree nodes', async () => {
    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(20);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(26);
    await element(by.css('#datagrid tbody tr:nth-child(7) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(34);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(12);
  });

  it('Should expand last tree nodes', async () => {
    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(20);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(26);

    await element(by.css('#datagrid tbody tr:nth-child(15) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(6);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(40);
  });

  it('Should expand last tree nodes and restore hidden', async () => {
    await element(by.css('#datagrid tbody tr:nth-child(15) td:nth-child(1) button')).click();
    await element(by.css('#datagrid tbody tr:nth-child(18) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(14);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(32);
    await element(by.css('#datagrid tbody tr:nth-child(15) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(20);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(26);

    await element(by.css('#datagrid tbody tr:nth-child(15) td:nth-child(1) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(14);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(32);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-frozen-tree')).toEqual(0);
    });
  }
});

describe('Datagrid tree with grouped header tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-grouped-headers?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('.datagrid tr:nth-child(10)'));
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

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-tree-grouped-headers')).toEqual(0);
    });
  }
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
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(4);
  });

  it('Should partially select root nodes', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);
    expect(await element.all(by.css('.is-partial')).count()).toEqual(1);
  });
});

describe('Datagrid Tree Paging Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-paging-serverside?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should expand/collapse on first page click', async () => {
    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(10);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(13);
    await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(2) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(7);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(16);
  });

  it('Should expand/collapse on second page click', async () => {
    await element(by.css('li.pager-next .btn-icon')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('tr[aria-rowindex="26"]')).count()).toEqual(1);
    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(10);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(13);
    await element(by.css('#datagrid tbody tr:nth-child(1) td:nth-child(2) button')).click();

    expect(await element.all(by.css('tr.is-hidden')).count()).toEqual(7);
    expect(await element.all(by.css('tr:not(.is-hidden)')).count()).toEqual(16);
  });
});

describe('Datagrid tree do not select children tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-dont-select-children');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not select children', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);
  });
});

describe('Datagrid tree select siblings tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-select-siblings');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should select siblings', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(5);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(8) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(3);
  });

  it('Should not de-select siblings', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(5);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(5);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(8) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(3);
  });
});

describe('Datagrid tree single select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-select-single');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should single select', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(await by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(6) td:nth-child(1)')).click();

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(1);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

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
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="3"] td[aria-colindex="9"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    let tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).toContain('is-hidden');

    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="7"] td[aria-colindex="9"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
  });

  it('Should show tooltip on header text cut off with ellipsis', async () => {
    await browser.actions().mouseMove(element(by.css('.datagrid-header th[data-column-id="orderDate"] .datagrid-column-wrapper'))).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    const tooltip = await element(by.css('.grid-tooltip'));

    expect(await element(by.css('.datagrid-header th[data-column-id="orderDate"]')).getAttribute('class')).toContain('text-ellipsis');
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

describe('Datagrid update column tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-update-columns');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should update columns on demand', async () => {
    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1) td')).count()).toEqual(8);
    await element(by.id('update')).click();

    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1) td')).count()).toEqual(3);
    await utils.checkForErrors();
  });
});

describe('Datagrid update column and reset tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-update-columns-empty');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should update columns after reset', async () => {
    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1) td')).count()).toEqual(1);
    await element(by.id('update')).click();

    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1) td')).count()).toEqual(8);
    await element(by.id('reset')).click();

    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1) td')).count()).toEqual(1);
    await utils.checkForErrors();
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
    expect(await element(by.css('.datagrid-result-count')).getText()).toEqual('(11 results)');
    expect(await element(by.css('.pager-toolbar .pager-next .btn-icon')).getAttribute('disabled')).toBeFalsy();

    await element(by.css('.pager-toolbar .pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#datagrid tbody tr:nth-child(1)')).count()).toEqual(1);
  });
});

describe('Datagrid multiselect sorting test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-grouping-multiselect?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid thead th:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    const thEl = await element(by.css('#datagrid thead th:nth-child(2)'));
    await thEl.click();
    await utils.checkForErrors();
  });
});

describe('Datagrid Personalization tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-index?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid thead th:nth-child(2)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);

    await openPersonalizationDialog();
  });

  it('Should render checkboxes for every column', async () => {
    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(8);
  });

  it('Should uncheck for hidden columns', async () => {
    expect(await element(by.css('input[data-column-id="hidden"]')).getAttribute('checked')).toBeFalsy();
  });

  it('Should disable not hideable columns', async () => {
    expect(await element(by.css('input[data-column-id="productId"]')).isEnabled()).toBe(false);
  });

  it('Should filter when typing two chars', async () => {
    await element(by.id('gridfilter')).sendKeys('id');

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(2);
  });

  it('Should filter when typing three chars', async () => {
    await element(by.id('gridfilter')).sendKeys('act');

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(3);

    await element(by.css('svg.icon.close')).click();

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(8);
  });

  it('Should clear filter', async () => {
    await element(by.id('gridfilter')).sendKeys('name');

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(1);
    await element(by.css('svg.icon.close')).click();

    expect(await element.all(by.css('.modal-content input[type="checkbox"]')).count()).toEqual(8);
  });
});

describe('Datagrid Actions Popupmenu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-actions-reload?layout=nofrills');
    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(3)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should open on click', async () => {
    const selector = '#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1) .btn-actions';
    let menuBtn = await element(by.css(selector));
    await menuBtn.click();

    expect(await menuBtn.getAttribute('class')).toContain('is-open');
    await element(by.id('btn-reload')).click();
    menuBtn = await element(by.css(selector));

    expect(await menuBtn.getAttribute('class')).not.toContain('is-open');
    menuBtn = await element(by.css(selector));
    await menuBtn.click();

    expect(await menuBtn.getAttribute('class')).toContain('is-open');
  });
});

describe('Datagrid tree select multiple tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-select-multiple');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should select multiple', async () => {
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5) td:nth-child(1)')).click();

    expect(await element.all(await by.css('tr.is-selected')).count()).toEqual(3);
  });
});

describe('Datagrid horizontal scrolling tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-horizontal-scroll.html?theme=classic&layout=nofrills');

    const datagridEl = await element(by.css('#datagrid-paging-both tr:nth-child(3)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1000, 1500);
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'datagrid-horizontal-scrolling')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Datagrid hide pager on one page tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-hide-pager-if-one-page-filter');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(4)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should hide pager on one page and filter', async () => {
    const selector = {
      rows: '#datagrid .datagrid-wrapper tbody tr[role="row"]',
      filter: '#datagrid .datagrid-header th[data-column-id="3"] .datagrid-filter-wrapper select',
      filterSel: '#datagrid .datagrid-header th[data-column-id="3"] div.dropdown',
      filterOpt: '.dropdown-list .dropdown-option #list-option-0'
    };
    const pagerBar = await element(by.css('.pager-toolbar'));

    expect(await pagerBar.getAttribute('class')).not.toContain('hidden');
    expect(await element.all(by.css(selector.rows)).count()).toEqual(5);

    const filterSel = await element(by.css(selector.filterSel));
    await filterSel.click();
    const filterOpt = await element.all(by.css(selector.filterOpt)).first();
    await filterOpt.click();
    await browser.driver.sleep(config.sleep);

    const pagerClassList = ['.pager-first', '.pager-prev', '.pager-next', '.pager-last', '.pager-count'];

    pagerClassList.forEach(async (pagerClass) => {
      const pe = await pagerBar.all(by.css(pagerClass)).first();
      expect(await pe.getAttribute('class')).toContain('hidden');
    });

    expect(await element.all(by.css(selector.rows)).count()).toEqual(2);
    await filterOpt.click();
    await browser.driver.sleep(config.sleep);

    expect(await pagerBar.getAttribute('class')).not.toContain('hidden');
    expect(await element.all(by.css(selector.rows)).count()).toEqual(5);
  });
});

describe('Datagrid columns width test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-columns-width');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not change columns width after reset layout', async () => {
    const width = [400, 420, 423, 416];
    let elem = await element(by.css('#datagrid thead th:nth-child(5)'));
    await elem.getSize().then((size) => {
      expect(width).toContain(size.width);
    });
    await element.all(by.css('#maincontent .btn-actions')).first().click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.is-open'))), config.waitsFor);
    await element(by.css('li a[data-option="reset-layout"]')).click();
    await browser.driver.sleep(config.sleep);
    elem = await element(by.css('#datagrid thead th:nth-child(5)'));
    await elem.getSize().then((size) => {
      expect(width).toContain(size.width);
    });
  });
});

describe('Datagrid With Recursive Column Data', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-recursive-object');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render rows', async () => {
    expect(await element.all(by.css('#datagrid .datagrid-wrapper tbody tr')).count()).toEqual(7);
  });
});

describe('Datagrid with select rows across pages tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-multiselect-select-across-page');

    const datagridEl = await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(5)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render rows', async () => {
    expect(await element.all(by.css('#datagrid .datagrid-wrapper tbody tr')).count()).toEqual(5);
  });

  it('Should not deselect the selected rows after filter', async () => {
    const filterId = 'test-paging-multiselect-select-across-page-datagrid-1-header-filter-2';
    const allRows = '#datagrid .datagrid-wrapper tbody .datagrid-row';
    const row = '#datagrid .datagrid-wrapper tbody tr:nth-child(2)';
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');
    await element(by.id(filterId)).clear();
    await element(by.id(filterId)).sendKeys('214229');
    await element(by.id(filterId)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css(allRows)).count()).toEqual(1);
    await element(by.id(filterId)).clear();
    await element(by.id(filterId)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');
  });

  it('Should filter on 2nd page', async () => {
    const filterId = 'test-paging-multiselect-select-across-page-datagrid-1-header-filter-2';
    const allRows = '#datagrid .datagrid-wrapper tbody .datagrid-row';
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-next .btn-icon'))), config.waitsFor);

    await element(by.css('.pager-next')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev .btn-icon'))), config.waitsFor);

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    await element(by.id(filterId)).clear();
    await element(by.id(filterId)).sendKeys('214229');
    await element(by.id(filterId)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css(allRows)).count()).toEqual(1);
  });

  xit('Should sync if select/deselect while filtering', async () => {
    const textSel = '.toolbar > div.title.selection-count.has-tooltip';
    const filterId = 'test-paging-multiselect-select-across-page-datagrid-1-header-filter-2';
    const allRows = '#datagrid .datagrid-wrapper tbody .datagrid-row';
    const row = '#datagrid .datagrid-wrapper tbody tr[aria-rowindex="2"]';
    const row2 = '#datagrid .datagrid-wrapper tbody tr[aria-rowindex="10"]';
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-next .btn-icon'))), config.waitsFor);

    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(2)')).click();

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');
    expect(await element.all(by.css(textSel)).first().getText()).toEqual('1 Selected');
    await element(by.id(filterId)).clear();
    await element(by.id(filterId)).sendKeys('214229');
    await element(by.id(filterId)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css(allRows)).count()).toEqual(1);
    await element(by.css('#datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(2)')).click();

    expect(await element.all(by.css(allRows)).count()).toEqual(1);
    expect(await element.all(by.css(textSel)).first().getText()).toEqual('2 Selected');
    await element(by.id(filterId)).clear();
    await element(by.id(filterId)).sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    expect(await element.all(by.css(textSel)).first().getText()).toEqual('2 Selected');
    expect(await element(by.css(row)).getAttribute('class')).toMatch('is-selected');

    await element(by.css('.pager-next')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.elementToBeClickable(await element(by.css('.pager-prev .btn-icon'))), config.waitsFor);

    expect(await element.all(by.css(allRows)).count()).toEqual(5);
    expect(await element.all(by.css(textSel)).first().getText()).toEqual('2 Selected');
    expect(await element(by.css(row2)).getAttribute('class')).toMatch('is-selected');
  });
});

describe('Datagrid treegrid Tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-tree-tooltip?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show tooltip get data with callback', async () => {
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="10"] td[aria-colindex="4"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    const tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
    expect(await tooltip.getText()).toEqual('Ordered at 7:04 AM This is row: 9 and cell: 3');
  });

  it('Should show tooltip on text cut off for indented area', async () => {
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="10"] td[aria-colindex="1"]'))).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.grid-tooltip'))), config.waitsFor);
    const tooltip = await element(by.css('.grid-tooltip'));

    expect(await tooltip.getAttribute('class')).not.toContain('is-hidden');
    expect(await tooltip.getText()).toEqual('Follow up action with Residental New York');
    await browser.actions().mouseMove(element(by.css('tbody tr[aria-rowindex="11"] td[aria-colindex="1"]'))).perform();
    await browser.driver.sleep(config.waitsFor);

    expect(await tooltip.getAttribute('class')).toContain('is-hidden');
  });
});

describe('Datagrid select all for current page only', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-paging-select-clientside-multiple-current-page?layout=nofrills');

    const datagridEl = await element(by.css('#datagrid tbody tr:nth-child(1)'));

    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle select all', async () => {
    const checkboxTd = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('tr.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(10);
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('tr.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
  });

  it('Should only select for active page', async () => {
    let checkbox = await element(by.css('#datagrid tbody tr:nth-child(4) td:nth-child(1) .datagrid-checkbox'));
    await browser.actions().mouseMove(checkbox).perform();
    await browser.actions().click(checkbox).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#datagrid tbody tr.is-selected:nth-child(4)'))), config.waitsFor);

    checkbox = await element(by.css('#datagrid tbody tr:nth-child(5) td:nth-child(1) .datagrid-checkbox'));
    await browser.actions().mouseMove(checkbox).perform();
    await browser.actions().click(checkbox).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#datagrid tbody tr.is-selected:nth-child(5)'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);

    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
    checkbox = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkbox).perform();
    await browser.actions().click(checkbox).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#datagrid tbody tr.is-selected:nth-child(5)'))), config.waitsFor);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(10);
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(10);
    checkbox = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkbox).perform();
    await browser.actions().click(checkbox).perform();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
    await element(by.css('.pager-prev .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(2);
    checkbox = await element(by.css('#datagrid .datagrid-header th .datagrid-checkbox-wrapper'));
    await browser.actions().mouseMove(checkbox).perform();
    await browser.actions().click(checkbox).perform();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
    await element(by.css('.pager-next .btn-icon')).click();
    await browser.driver.sleep(350);

    expect(await element.all(by.css('tr.is-selected')).count()).toEqual(0);
  });
});

describe('Datagrid Formatter Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-all-formatters?layout=nofrills');
    const datagridEl = await element(by.css('#readonly-datagrid tbody tr:nth-child(1)'));

    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render ProcessIndicator', async () => {
    expect(await element.all(by.css('.process-indicator .step')).count()).toEqual(43);
  });
});
