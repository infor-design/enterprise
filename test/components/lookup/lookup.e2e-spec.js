const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Lookup', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-index');
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
});

describe('Lookup (editable)', () => {
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

describe('Lookup (editable strict)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable-strict');
  });

  it('input field should be readonly', async () => {
    expect(await element(by.css('.is-not-editable')).getAttribute('readonly')).toBeTruthy();
  });
});

describe('Lookup (multiselect)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-multiselect');
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
});

describe('Lookup (paging)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-paging');
  });

  it('should have a pager component', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-toolbar'))), config.waitsFor);

    expect(await element(by.className('pager-toolbar'))).toBeTruthy();
  });

  it('should have a search and actions', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('searchfield'))), config.waitsFor);
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-actions'))), config.waitsFor);

    expect(await element(by.className('searchfield'))).toBeTruthy();
    expect(await element(by.className('btn-actions'))).toBeTruthy();
  });

  it('should have an enabled next page button', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-next'))), config.waitsFor);

    expect(await element(by.className('pager-next')).isEnabled()).toBe(true);
  });

  it('should be able to go the next page', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-next'))), config.waitsFor);
    await element(by.className('pager-next')).click();

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

describe('Lookup (custom cancel button)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-buttons');
  });

  it('page should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('can have custom buttons', async () => {
    await element.all(by.className('trigger')).first().click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).getText()).toEqual('Apply It Now');
  });
});

describe('Lookup (custom toolbar)', () => {
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

fdescribe('Lookup multiselect serverside paging tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-multiselect-paging-serverside');
  });

  it('Paging lookup should be able to select a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    await element(by.css('.btn-modal-primary')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220,214221');
  });

  it('Paging lookup should be able to go the next page and select', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-next'))), config.waitsFor);
    await element(by.className('pager-next')).click();

    expect(await element(by.name('pager-pageno')).getAttribute('value')).toEqual('2');

    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(1) td:nth-child(1)')).click();
    await element(by.css('#lookup-datagrid .datagrid-body tbody tr:nth-child(2) td:nth-child(1)')).click();

    await element(by.css('.btn-modal-primary')).click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220,214221,214225,214226');
  });
});
