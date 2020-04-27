const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Lookup example tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-index?layout=nofrills');
  });

  it('should be enabled', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('can be disabled', async () => {
    const lookupEl = await element(by.id('lookup-field-disabled'));

    expect(await lookupEl.isEnabled()).toBe(false);
  });

  it('should display when its trigger is clicked', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('can be cancelled', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });

  it('should set a value when clicking a cell', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });

  it('should be able to reselect', async () => {
    const lookupEl = await element(by.id('product-lookup'));
    await element.all(by.className('trigger')).first().click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');

    await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-wrapper'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await element.all(by.className('trigger')).first().click();
    await browser.driver.sleep(config.sleep);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('2241202');
  });

  it('should be able to validate', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.css('.overlay'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await element.all(by.id('product-lookup')).clear();
    await element.all(by.id('product-lookup')).sendKeys(protractor.Key.TAB);

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.message-text'))), config.waitsFor);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);

    await element.all(by.className('trigger')).first().click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const buttonEl = await element.all(by.className('trigger')).first();
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

      const modalEl = await element(by.className('modal'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(modalEl, 'lookup-index')).toEqual(0);
    });
  }
});

describe('Lookup editable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable');
  });

  it('should show a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });

  it('cells should be editable', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('has-editor'))).toBeTruthy();
  });
});

describe('Lookup editable strict tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable-strict');
  });

  it('input field should be readonly', async () => {
    expect(await element(by.css('.is-not-editable')).getAttribute('readonly')).toBeTruthy();
  });
});

describe('Lookup multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-multiselect?layout=nofrills');
  });

  it('should have a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });

  it('should have a second button for applying changes', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).isEnabled()).toBe(true);
  });

  it('should selections reset on close', async () => {
    await element(by.className('trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element.all(by.css('#lookup-datagrid .datagrid-wrapper tbody tr.is-selected')).count()).toEqual(0);
    const checkboxTd = await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) .datagrid-checkbox'));
    await browser.actions().mouseMove(checkboxTd).perform();
    await browser.actions().click(checkboxTd).perform();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#lookup-datagrid .datagrid-wrapper tbody tr.is-selected')).count()).toEqual(1);
    await element(by.id('modal-button-1')).click();
    await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    await element(by.className('trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('#lookup-datagrid .datagrid-wrapper tbody tr.is-selected')).count()).toEqual(0);
  });
});

describe('Lookup filtering tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-filter-row?layout=nofrills');
  });

  it('should apply a filter', async () => {
    await element(by.css('#product-lookup + .trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element.all(by.css('.datagrid-wrapper tbody .datagrid-row')).count()).toEqual(7);

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    await element(by.id('example-filter-row-lookup-datagrid-1-header-filter-1')).sendKeys('I L');
    await element(by.id('example-filter-row-lookup-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-wrapper tbody .datagrid-row')).count()).toEqual(1);
  });

  it('should reset filter on close', async () => {
    await element(by.css('#product-lookup + .trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await element(by.id('example-filter-row-lookup-datagrid-1-header-filter-1')).sendKeys('I L');
    await element(by.id('example-filter-row-lookup-datagrid-1-header-filter-1')).sendKeys(protractor.Key.ENTER);

    expect(await element.all(by.css('.datagrid-wrapper tbody .datagrid-row')).count()).toEqual(1);
    await element(by.css('#modal-button-2')).click();
    await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
    await element(by.css('#product-lookup + .trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.datagrid-wrapper tbody .datagrid-row')).count()).toEqual(7);
  });
});

describe('Lookup paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-paging');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.trigger'))), config.waitsFor);
  });

  it('should have a pager component', async () => {
    await element(by.css('.trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.pager-toolbar'))), config.waitsFor);

    expect(await element(by.className('pager-toolbar')).isPresent()).toBeTruthy();
  });

  it('should have a search and actions', async () => {
    await element(by.css('.trigger')).click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.searchfield'))), config.waitsFor);
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.btn-actions'))), config.waitsFor);

    expect(await element(by.css('.searchfield')).isPresent()).toBeTruthy();
    expect(await element(by.css('.btn-actions')).isPresent()).toBeTruthy();
  });

  it('should have an enabled next page button', async () => {
    await element(by.css('.trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.pager-next'))), config.waitsFor);

    expect(await element(by.css('.pager-next')).isEnabled()).toBe(true);
  });

  it('should be able to go the next page', async () => {
    await element(by.css('.trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.pager-next'))), config.waitsFor);

    await element(by.css('.pager-next')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.name('pager-pageno')).getAttribute('value')).toEqual('2');
  });

  // TODO: make this choose the next page and THEN choose the value
  it('should be able to choose a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('paging'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220');
  });
});

describe('Lookup custom cancel button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-buttons');
  });

  it('page should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('can have custom buttons', async () => {
    await element.all(by.className('trigger')).first().click();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).getText()).toEqual('Apply It Now');
  });
});

describe('Lookup custom toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-toolbar');
  });

  it('can have a custom toolbar', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    expect(await element(by.className('toolbar'))).toBeTruthy();
    expect(await element(by.className('has-more-button'))).toBeTruthy();
  });
});

describe('Lookup multiselect serverside paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-multiselect-paging-serverside');
  });

  it('Paging lookup should be able to select a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    await element(by.css('.btn-modal-primary')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220,214221');
  });

  it('Paging lookup should be able to go the next page and select', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();
    await browser.driver.sleep(301);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    await browser.driver.sleep(301);
    await element(by.className('pager-next')).click();
    await browser.driver.sleep(301);

    expect(await element(by.name('pager-pageno')).getAttribute('value')).toEqual('2');

    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

    await element(by.css('.btn-modal-primary')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220,214221,214225,214226');
  });
});

describe('Lookup custom matching tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/test-custom-matching');
  });

  it('Paging lookup should work with custom matching', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.css('.overlay'))), config.waitsFor);
    await browser.driver.sleep(301);

    expect(await lookupEl.getAttribute('value')).toEqual('2142201|Compressor');
    await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-wrapper'))), config.waitsFor);
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(3) td:nth-child(1)')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('2342203|Compressor');
  });
});

describe('Lookup modal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/test-modal-lookup');
  });

  it('Paging lookup should work on a modal', async () => {
    const buttonEl = await element.all(by.className('btn-secondary')).first();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('modal-1-text'))), config.waitsFor);
    await element(by.css('#modal-1-text .trigger')).click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    const lookupEl = await element(by.id('product-lookup'));

    await browser.driver.sleep(config.sleep);

    expect(await lookupEl.getAttribute('value')).toEqual('2142201|Compressor');

    await browser.driver.sleep(config.sleep);
    await element(by.css('#modal-1-text .trigger')).click();

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();
    await browser.driver.sleep(config.sleep);

    expect(await lookupEl.getAttribute('value')).toEqual('2241202|Different Compressor');
  });
});

describe('Lookup single select serverside tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/test-single-select-serverside');
  });

  it('should be able to reselect value', async () => {
    const lookupEl = await element(by.id('product-lookup1'));

    expect(await lookupEl.getAttribute('value')).toEqual('214221');
    await element(by.id('product-lookup1')).element(by.xpath('..')).element(by.className('trigger')).click();
    await browser.driver.sleep(1300);

    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220');
  });

  if (!utils.isCI()) {
    it('should be able to keep selected value only one', async () => {
      const lookupEl = await element(by.id('product-lookup2'));
      await element(by.id('product-lookup2')).element(by.xpath('..')).element(by.className('trigger')).click();
      await browser.driver.sleep(1000);

      await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);
      await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(1) td:nth-child(1)')).click();

      expect(await lookupEl.getAttribute('value')).toEqual('214220');

      await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-wrapper'))), config.waitsFor);
      await browser.driver.sleep(301);
      await element(by.id('product-lookup2')).element(by.xpath('..')).element(by.className('trigger')).click();
      await browser.driver.sleep(1000);

      await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)'))), config.waitsFor);
      await element(by.css('#lookup-datagrid .datagrid-wrapper tbody tr:nth-child(2) td:nth-child(1)')).click();

      expect(await lookupEl.getAttribute('value')).toEqual('214221');

      await browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.modal-wrapper'))), config.waitsFor);
      await browser.driver.sleep(301);
      await element(by.id('product-lookup2')).element(by.xpath('..')).element(by.className('trigger')).click();
      await browser.driver.sleep(1000);

      await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('lookup-datagrid'))), config.waitsFor);

      expect(await element.all(by.css('#lookup-datagrid .datagrid-wrapper tbody tr.datagrid-row.is-selected')).count()).toEqual(1);
    });
  }
});

describe('Lookup minWidth tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-minwidth');
  });

  it('Should open the lookup with min width', async () => {
    const buttonEl = await element.all(by.className('trigger')).last();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const buttonEl = await element.all(by.className('trigger')).last();
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

      const modalEl = await element(by.className('modal'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(modalEl, 'lookup-min-width')).toEqual(0);
    });
  }
});
