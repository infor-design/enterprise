const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Lookup example-custom-buttons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-buttons');
  });

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('custom'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has custom button', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    expect(await element(by.className('btn-modal-primary')).getText()).toEqual('Apply It Now');
  });

  it('Should lookup set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('custom'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });
});

describe('Lookup example-custom-toolbar tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-custom-toolbar');
  });

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('custom'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has custom toolbar', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    expect(await element(by.className('toolbar'))).toBeTruthy();
    expect(await element(by.className('has-more-button'))).toBeTruthy();
  });

  it('Should lookup set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('custom'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('2142201');
  });
});

describe('Lookup example-editable-strict tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable-strict');
  });

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);
    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });
});

describe('Lookup example-editable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-editable');
  });

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);
    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });
});

describe('Lookup example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-index');
  });

  it('Should product lookup enabled', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup-small enabled', async () => {
    const lookupEl = await element(by.id('lookup-field-small'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup disabled', async () => {
    const lookupEl = await element(by.id('lookup-field-disabled'));

    expect(await lookupEl.isEnabled()).toBe(false);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup set a value', async () => {
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

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('product-lookup'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has a checkbox', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-checkbox-wrapper'))), config.waitsFor);
    expect(await element(by.className('datagrid-checkbox-wrapper'))).toBeTruthy();
  });
});

describe('Lookup example-paging tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/lookup/example-paging');
  });

  it('Should lookup enabled', async () => {
    const lookupEl = await element(by.id('paging'));

    expect(await lookupEl.isEnabled()).toBe(true);
  });

  it('Should lookup display', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-content'))), config.waitsFor);
    expect(await element(by.className('modal-content'))).toBeTruthy();
  });

  it('Should lookup has a paging', async () => {
    const buttonEl = await element(by.className('trigger'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('pager-toolbar'))), config.waitsFor);
    expect(await element(by.className('pager-toolbar'))).toBeTruthy();
  });

  it('Should lookup modal components', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('paging'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('searchfield'))), config.waitsFor);
    expect(await element(by.className('searchfield'))).toBeTruthy();
    expect(await element(by.className('btn-actions'))).toBeTruthy();
  });

  it('Should lookup set a value', async () => {
    const buttonEl = await element.all(by.className('trigger')).first();
    const lookupEl = await element(by.id('paging'));

    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('datagrid-cell-wrapper'))), config.waitsFor);
    await element.all(by.className('datagrid-cell-wrapper')).first().click();

    expect(await lookupEl.getAttribute('value')).toEqual('214220');
  });
});
