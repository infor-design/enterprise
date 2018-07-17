const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Datepicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index');
  });

  it('Should open popup on icon click', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await datepickerEl.getAttribute('class')).toContain('is-open');
    expect(await element(by.id('calendar-popup')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keypress(arrow-down)', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await datepickerEl.getAttribute('class')).toContain('is-open');
    expect(await element(by.id('calendar-popup')).isDisplayed()).toBe(true);
  });

  it('Should set todays date from popup to field', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await element(by.css('#date-field-normal + .icon')).click();
    await element(by.css('#calendar-popup button.is-today')).click();

    const testDate = new Date();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should not be able to pick a date from readonly and disabled datepicker', async () => {
    let datepickerEl = await element(by.id('date-field-disabled'));
    await element(by.css('#date-field-disabled + .icon')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual('10/31/2014');

    datepickerEl = await element(by.id('date-field-readonly'));
    await element(by.css('#date-field-readonly + .icon')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual('10/31/2014');
  });

  it('Should be able to select with arrows and enter', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    let focusTD = await element(by.css('#calendar-popup td.is-selected'));

    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await focusTD.sendKeys(protractor.Key.ARROW_DOWN);
    focusTD = await element(by.css('#calendar-popup td.is-selected'));
    await focusTD.sendKeys(protractor.Key.ARROW_UP);
    focusTD = await element(by.css('#calendar-popup td.is-selected'));
    await focusTD.sendKeys(protractor.Key.ARROW_LEFT);
    focusTD = await element(by.css('#calendar-popup td.is-selected'));
    await focusTD.sendKeys(protractor.Key.ARROW_RIGHT);
    focusTD = await element(by.css('#calendar-popup td.is-selected'));
    await focusTD.sendKeys(protractor.Key.ENTER);

    const testDate = new Date();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });
});

describe('Datepicker Anniversay tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-anniversay-format');
  });

  it('Should 3 digit month year', async () => {
    const datepickerEl = await element(by.id('MMMyyyy-date'));
    await element(by.css('#MMMyyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
  });

  it('Should populate month day', async () => {
    const datepickerEl = await element(by.id('MMMMd-date'));
    await element(by.css('#MMMMd-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
  });

  it('Should populate just year', async () => {
    const datepickerEl = await element(by.id('yyyy-date'));
    await element(by.css('#yyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.getFullYear().toString());
  });

  it('Should populate month year', async () => {
    const datepickerEl = await element(by.id('MMMMyyyy-date'));
    await element(by.css('#MMMMyyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should populate month/day/year', async () => {
    const datepickerEl = await element(by.id('Mdyyyy-date'));
    await element(by.css('#Mdyyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getMonth() + 1}/${testDate.getDate()}/${testDate.getFullYear()}`);
  });
});

describe('Datepicker custom format tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-custom-format');
  });

  it('Should use Locale', async () => {
    const datepickerEl = await element(by.id('date-field-1'));
    await element(by.css('#date-field-1 + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(`${(testDate.getMonth() + 1)}/${testDate.getDate().toString()}/${testDate.getFullYear()}`);
  });

  it('Should format ISO Date', async () => {
    const datepickerEl = await element(by.id('date-field-2'));
    await element(by.css('#date-field-2 + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getFullYear()}-${testDate.getDate().toString().padStart(2, '0')}-${(testDate.getMonth() + 1).toString().padStart(2, '0')}`);
  });

  it('Should format Full Date', async () => {
    const datepickerEl = await element(by.id('date-field-3'));
    await element(by.css('#date-field-3 + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(',', ''));
  });

  it('Should format Custom Date', async () => {
    const datepickerEl = await element(by.id('date-field-4'));
    await element(by.css('#date-field-4 + .icon')).click();

    const testDate = new Date();

    await element(by.css('#calendar-popup .is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getDate().toString().padStart(2, '0')}/${(testDate.getMonth() + 1).toString().padStart(2, '0')}/${testDate.getFullYear()}`);
  });
});

describe('Datepicker custom validation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-disabled-dates');
  });

  it('Should support custom validation', async () => {
    await element(by.css('#date-field + .icon')).click();

    expect(await element.all(by.css('.calendar-table td.is-disabled')).count()).toEqual(12);
    expect(await element.all(by.css('.calendar-table td:not(.is-disabled)')).count()).toEqual(30);

    await element(by.css('.btn-icon.next')).click();

    expect(await element.all(by.css('.calendar-table td.is-disabled')).count()).toEqual(14);
    expect(await element.all(by.css('.calendar-table td:not(.is-disabled)')).count()).toEqual(28);
  });
});
