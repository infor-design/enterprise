const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Lookup example-custom-buttons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-buttons');
  });

  it('Should custom-buttons lookup field be enabled', async () => {
    const lookupEl = await element(by.id('custom'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display lookup modal with custom button', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup modal has custom button', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    expect(await element(by.className('btn-modal-primary')).getText()).toEqual('Apply It Now');
  });

  it('Should custom-buttons lookup field set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('custom'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });

  it('Should lookup modal apply button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal-primary'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).isEnabled()).toBe(true);
  });
});

describe('Lookup example-custom-toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-toolbar');
  });

  it('Should custom-toolbar lookup field be enabled', async () => {
    const lookupEl = await element(by.id('custom'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display lookup modal with custom toolbar', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup modal has custom toolbar', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    expect(await element(by.className('toolbar'))).toBeTruthy();
    expect(await element(by.className('has-more-button'))).toBeTruthy();
  });

  it('Should custom-toolbar lookup field set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('custom'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });

  it('Should lookup with custom toolbar cancel button enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });
});

describe('Lookup example-editable-strict tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable-strict');
  });

  it('Should editable-strict lookup field be enabled', async () => {
    const lookupEl = await element(by.id('lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display editable-strict lookup modal', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should editable-strict lookup modal has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });

  it('Should editable-strict lookup field be editable', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('has-editor'))).toBeTruthy();
  });

  it('Should editable-strict lookup modal cancel button enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });

  it('Should editable-strict lookup modal apply button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).isEnabled()).toBe(true);
  });
});

describe('Lookup example-editable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable');
  });

  it('Should editable lookup field be enabled', async () => {
    const lookupEl = await element(by.id('lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display editable lookup modal', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should editable lookup modal has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });

  it('Should editable lookup modal field be editable', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('has-editor'))).toBeTruthy();
  });

  it('Should editable lookup modal cancel button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });

  it('Should editable lookup modal apply button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).isEnabled()).toBe(true);
  });
});

describe('Lookup example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-index');
  });

  it('Should index product lookup field be enabled', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should index lookup-small field be enabled', async () => {
    const lookupEl = await element(by.id('lookup-field-small'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should index lookup field be disabled', async () => {
    const lookupEl = await element(by.id('lookup-field-disabled'));

    expect(await lookupEl.isEnabled()).toBe(false);
  });

  it('Should display index lookup modal', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should index lookup modal cancel button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });

  it('Should index lookup field set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('product-lookup'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });
});

describe('Lookup example-multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-multiselect');
  });

  it('Should multiselect lookup field be enabled', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display multiselect lookup modal', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should multiselect lookup modal has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);

    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });

  it('Should multiselect lookup modal cancel button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });

  it('Should multiselect lookup modal apply button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('btn-modal-primary')).isEnabled()).toBe(true);
  });
});

describe('Lookup example-paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-paging');
  });

  it('Should paging lookup field be enabled', async () => {
    const lookupEl = await element(by.id('paging'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should display paging lookup modal', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should paging lookup modal has a paging section', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-toolbar'))), config.waitsFor);

    expect(await element(by.className('pager-toolbar'))).toBeTruthy();
  });

  it('Should paging lookup modal have components', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('searchfield'))), config.waitsFor);
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-actions'))), config.waitsFor);

    expect(await element(by.className('searchfield'))).toBeTruthy();
    expect(await element(by.className('btn-actions'))).toBeTruthy();
  });

  it('Should paging lookup field set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('paging'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220');
  });

  it('Should paging lookup modal pager be enabled', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-next'))), config.waitsFor);

    expect(await element(by.className('pager-next')).isEnabled()).toBe(true);
  });

  it('Should paging lookup modal pager turn on next page', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-next'))), config.waitsFor);
    await element(by.className('pager-next')).click();

    expect(await element(by.name('pager-pageno')).getAttribute('value')).toEqual('2');
  });

  it('Should paging lookup modal cancel button be enabled', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('btn-modal'))), config.waitsFor);

    expect(await element(by.className('btn-modal')).isEnabled()).toBe(true);
  });
});
