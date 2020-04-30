const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Datepicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open popup on icon click', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await datepickerEl.getAttribute('class')).toContain('is-open');
    expect(await element(by.id('monthview-popup')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keypress(arrow-down)', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await datepickerEl.getAttribute('class')).toContain('is-open');
    expect(await element(by.id('monthview-popup')).isDisplayed()).toBe(true);
  });

  it('Should set todays date from popup to field', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await element(by.css('#date-field-normal + .icon')).click();
    await element(by.css('.hyperlink.today')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

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

  it('Should not be able to show today on a entered date', async () => {
    await element(by.id('date-field-normal')).sendKeys('4/12/2024');
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await element.all(by.css('.monthview-table .is-selected')).count()).toEqual(1);
  });

  it('Should be able to clear a date', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys('4/12/2024');
    await element(by.css('#date-field-normal + .icon')).click();
    await element(by.css('button.is-cancel')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual('');
  });

  if (!utils.isBS()) {
    it('Should be able to select with arrows and enter', async () => {
      const datepickerEl = await element(by.id('date-field-normal'));
      let focusTD = await element(by.css('#monthview-popup td.is-selected'));
      await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
      await focusTD.sendKeys(protractor.Key.ARROW_DOWN);
      focusTD = await element(by.css('#monthview-popup td.is-selected'));
      await focusTD.sendKeys(protractor.Key.ARROW_UP);
      focusTD = await element(by.css('#monthview-popup td.is-selected'));
      await focusTD.sendKeys(protractor.Key.ARROW_LEFT);
      focusTD = await element(by.css('#monthview-popup td.is-selected'));
      await focusTD.sendKeys(protractor.Key.ARROW_RIGHT);
      focusTD = await element(by.css('#monthview-popup td.is-selected'));
      await focusTD.sendKeys(protractor.Key.ENTER);

      const testDate = new Date();
      testDate.setHours(0);
      testDate.setMinutes(0);
      testDate.setSeconds(0);

      expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#date-field-normal')).sendKeys('11/14/2018');
      await element(by.css('#date-field-normal + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-index')).toEqual(0);
    });
  }
});

describe('Datepicker keyboard tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index');
  });

  it('Should be able to use arrow down key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() + 7);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_DOWN);

    expect(await datepickerEl.getAttribute('value')).toEqual('');
    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_DOWN);

    testDate.setDate(testDate.getDate() + 7);

    expect(await datepickerEl.getAttribute('value')).toEqual('');
    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
    await element(by.css('.is-select.btn-primary')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use arrow up key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() - 7);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_UP);

    expect(await datepickerEl.getAttribute('value')).toEqual('');
    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_UP);

    testDate.setDate(testDate.getDate() - 7);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use arrow left key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() - 1);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_LEFT);

    expect(await datepickerEl.getAttribute('value')).toEqual('');
    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_LEFT);

    testDate.setDate(testDate.getDate() - 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use arrow right key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() + 1);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_RIGHT);

    expect(await datepickerEl.getAttribute('value')).toEqual('');
    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_RIGHT);

    testDate.setDate(testDate.getDate() + 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use page up key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setMonth(testDate.getMonth() - 1);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_UP);

    expect(await datepickerEl.getAttribute('value')).toEqual('');

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_UP);

    testDate.setMonth(testDate.getMonth() - 1);

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use page down key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setMonth(testDate.getMonth() + 1);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_DOWN);

    expect(await datepickerEl.getAttribute('value')).toEqual('');

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_DOWN);

    testDate.setMonth(testDate.getMonth() + 1);

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use home key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(1);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.HOME);

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use end key', async () => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.END);

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(lastDayOfMonth.toLocaleDateString('en-US'));
  });

  it('Should be able to use t key', async () => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.css('.monthview-table .is-selected')).sendKeys('t');

    expect(await datepickerEl.getAttribute('value')).toEqual(today.toLocaleDateString('en-US'));

    await datepickerEl.sendKeys(protractor.Key.ENTER);
    await datepickerEl.clear();
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.css('.monthview-table .is-selected')).sendKeys('t');

    expect(await datepickerEl.getAttribute('value')).toEqual(today.toLocaleDateString('en-US'));
  });
});

describe('Datepicker Anniversary tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-anniversary-format');
  });

  it('Should 3 digit month year', async () => {
    const datepickerEl = await element(by.id('MMMyyyy-date'));
    await element(by.css('#MMMyyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
  });

  it('Should populate month day', async () => {
    const datepickerEl = await element(by.id('MMMMd-date'));
    await element(by.css('#MMMMd-date + .icon')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
  });

  it('Should populate month day in en-GB', async () => {
    await utils.setPage('/components/datepicker/example-anniversary-format?locale=en-GB');

    const datepickerEl = await element(by.id('MMMMd-date'));
    await element(by.css('#MMMMd-date + .icon')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    await element(by.css('#monthview-popup td.is-selected')).click();

    const resultDate = `${testDate.toLocaleDateString('en-US', { day: 'numeric' })} ${testDate.toLocaleDateString('en-US', { month: 'long' })}`;

    expect(await datepickerEl.getAttribute('value')).toEqual(resultDate);
  });

  it('Should populate just year', async () => {
    const datepickerEl = await element(by.id('yyyy-date'));
    await element(by.css('#yyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.getFullYear().toString());
  });

  it('Should populate month year', async () => {
    const datepickerEl = await element(by.id('MMMMyyyy-date'));
    await element(by.css('#MMMMyyyy-date + .icon')).click();

    const testDate = new Date();

    await element(by.css('#monthview-popup td.is-selected')).click();

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should populate month/day/year', async () => {
    const datepickerEl = await element(by.id('Mdyyyy-date'));
    await element(by.css('#Mdyyyy-date + .icon')).click();

    const testDate = new Date();
    await element(by.css('#monthview-popup td.is-selected')).click();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

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
    await element(by.css('#monthview-popup td.is-selected')).click();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${(testDate.getMonth() + 1)}/${testDate.getDate().toString()}/${testDate.getFullYear()}`);
  });

  it('Should format ISO Date', async () => {
    const datepickerEl = await element(by.id('date-field-2'));
    await element(by.css('#date-field-2 + .icon')).click();

    const testDate = new Date();
    await element(by.css('#monthview-popup td.is-selected')).click();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getFullYear()}-${testDate.getDate().toString().padStart(2, '0')}-${(testDate.getMonth() + 1).toString().padStart(2, '0')}`);
  });

  it('Should format Full Date', async () => {
    const datepickerEl = await element(by.id('date-field-3'));
    await element(by.css('#date-field-3 + .icon')).click();

    const testDate = new Date();
    await element(by.css('#monthview-popup td.is-selected')).click();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getDate()} ${testDate.toLocaleDateString('en-US', { month: 'short' })} ${testDate.getFullYear()}`);
  });

  it('Should format Custom Date', async () => {
    const datepickerEl = await element(by.id('date-field-4'));
    await element(by.css('#date-field-4 + .icon')).click();

    const testDate = new Date();
    await element(by.css('#monthview-popup td.is-selected')).click();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getDate().toString().padStart(2, '0')}/${(testDate.getMonth() + 1).toString().padStart(2, '0')}/${testDate.getFullYear()}`);
  });
});

describe('Datepicker disabled date tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-disabled-dates?layout=nofrills');
  });
  const sel = {};
  async function setSelector(elemSel) {
    sel.elem = elemSel;
    sel.popup = '#monthview-popup.is-open';
    sel.trigger = `${sel.elem} + .icon`;
    sel.table = `${sel.popup} .monthview-table`;
    sel.firstTr = `${sel.table} tbody tr:first-child`;
    sel.lastTr = `${sel.table} tbody tr:last-child`;
    sel.footer = `${sel.popup} .popup-footer`;
  }
  async function setDateAndOpenPicker(date) {
    await element(by.css(sel.elem)).clear();
    await element(by.css(sel.elem)).sendKeys(date);
    await element(by.css(sel.elem)).sendKeys(protractor.Key.TAB);
    await element(by.css(sel.trigger)).click();
    await browser.driver.wait(
      protractor.ExpectedConditions.visibilityOf(await element(by.css(sel.popup))),
      config.waitsFor
    );
  }
  async function checkDisabled(selector, isDisabled) {
    if (isDisabled) {
      expect(await element(by.css(selector)).getAttribute('class')).toContain('is-disabled');
    } else {
      expect(await element(by.css(selector)).getAttribute('class')).not.toContain('is-disabled');
    }
  }

  it('Should support custom validation', async () => {
    await element(by.css('#date-field + .icon')).click();

    expect(await element.all(by.css('.monthview-table td.is-disabled')).count()).toEqual(12);
    expect(await element.all(by.css('.monthview-table td:not(.is-disabled)')).count()).toEqual(30);

    await element(by.css('.btn-icon.next')).click();

    expect(await element.all(by.css('.monthview-table td.is-disabled')).count()).toEqual(14);
    expect(await element.all(by.css('.monthview-table td:not(.is-disabled)')).count()).toEqual(28);
  });

  it('Should show errors on disabled dates', async () => {
    await element(by.css('#date-field')).clear();
    await element(by.css('#date-field')).sendKeys('5/2/2015');
    await element(by.css('#date-field')).sendKeys(protractor.Key.TAB);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.error-message'))), config.waitsFor);

    expect(await element(by.css('.error-message')).getText()).toEqual('Unavailable Date');
  });

  it('Should show errors on disabled years', async () => {
    await element(by.css('#date-field-2')).clear();
    await element(by.css('#date-field-2')).sendKeys('5/2/2019');
    await element(by.css('#date-field-2')).sendKeys(protractor.Key.TAB);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.error-message'))), config.waitsFor);

    expect(await element(by.css('.error-message')).getText()).toEqual('Unavailable Date');
  });

  it('Should disabled dates for disabled years', async () => {
    await setSelector('#date-field-2');
    await setDateAndOpenPicker('1/2/2020');
    await checkDisabled(`${sel.firstTr} td:nth-child(1)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(2)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(3)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(4)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(5)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(6)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(7)`, false);

    await element(by.css(`${sel.footer} .is-cancel`)).click();
    await setDateAndOpenPicker('12/1/2017');
    await checkDisabled(`${sel.lastTr} td:nth-child(1)`, false);
    await checkDisabled(`${sel.lastTr} td:nth-child(2)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(3)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(4)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(5)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(6)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(7)`, true);
  });

  it('Should disabled dates by callback', async () => {
    await setSelector('#date-field-3');
    await setDateAndOpenPicker('1/2/2020');
    await checkDisabled(`${sel.firstTr} td:nth-child(1)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(2)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(3)`, true);
    await checkDisabled(`${sel.firstTr} td:nth-child(4)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(5)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(6)`, false);
    await checkDisabled(`${sel.firstTr} td:nth-child(7)`, false);

    await element(by.css(`${sel.footer} .is-cancel`)).click();
    await setDateAndOpenPicker('12/1/2017');
    await checkDisabled(`${sel.lastTr} td:nth-child(1)`, false);
    await checkDisabled(`${sel.lastTr} td:nth-child(2)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(3)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(4)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(5)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(6)`, true);
    await checkDisabled(`${sel.lastTr} td:nth-child(7)`, true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#date-field')).sendKeys('11/14/2018');
      await element(by.css('#date-field + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-disabled-dates')).toEqual(0);
    });
  }
});

describe('Datepicker Legend Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-legend?layout=nofrills');
  });

  it('Should render a legend', async () => {
    const datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.monthview-legend-item')).count()).toEqual(5);
    expect(await element.all(by.css('.is-colored')).count()).toEqual(17);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#date-field')).sendKeys('2017-01-03');
      await element(by.css('#date-field + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-legend')).toEqual(0);
    });
  }
});

describe('Datepicker Change Event Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-change-event?layout=nofrills');
  });

  it('Should not trigger change empty and tab', async () => {
    await element(by.id('date-field-1')).sendKeys(protractor.Key.TAB);

    expect(await element.all(by.css('#toast-container')).count()).toEqual(0);
  });

  it('Should not trigger change empty and tab with value', async () => {
    await element(by.id('date-field-2')).sendKeys(protractor.Key.TAB);

    expect(await element.all(by.css('#toast-container')).count()).toEqual(0);
  });

  it('Should trigger 1 change on key and tab', async () => {
    await element(by.css('#date-field-1')).clear();
    await element(by.css('#date-field-1')).sendKeys('5/2/2020');
    await element(by.css('#date-field-1')).sendKeys(protractor.Key.TAB);

    expect(await element.all(by.css('#toast-container')).count()).toEqual(1);
  });

  it('Should trigger 1 change on key and tab with value', async () => {
    await element(by.css('#date-field-2')).clear();
    await element(by.css('#date-field-2')).sendKeys('5/2/2020');
    await element(by.css('#date-field-2')).sendKeys(protractor.Key.TAB);

    expect(await element.all(by.css('#toast-container')).count()).toEqual(1);
  });

  it('Should not trigger change two changes on select and tab', async () => {
    await element(by.css('#date-field-1 + .icon')).click();
    await element(by.css('.hyperlink.today')).click();
    await element(by.css('#date-field-1')).click();
    await element(by.css('#date-field-1')).sendKeys(protractor.Key.TAB);

    expect(await element.all(by.css('#toast-container')).count()).toEqual(1);
  });
});

describe('Datepicker Destroy Mask Tests', () => {
  beforeEach(async () => {
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should not have errors', async () => {
    await utils.setPage('/components/datepicker/test-mask-after-update');
    await utils.checkForErrors();
  });

  it('Should still mask after destroy', async () => {
    await browser.driver.sleep(config.sleepShort);
    await element(by.id('dp1')).clear();
    await element(by.id('dp1')).sendKeys('101020011221AM');

    expect(await element(by.id('dp1')).getAttribute('value')).toEqual('10/10/2001 12:21 AM');
    await element(by.id('dp1')).clear();

    await element(by.id('btn-update')).click();
    await browser.driver.sleep(config.sleepShort);
    await element(by.id('dp1')).sendKeys('101020011221AM');

    expect(await element(by.id('dp1')).getAttribute('value')).toEqual('10/10/2001 12:21 AM');
  });
});

describe('Datepicker Disable Month Year Changer Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-no-month-year-picker');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not have a month year picker', async () => {
    expect(await element(by.css('.monthview-monthyear-pane')).isPresent()).toEqual(false);
    expect(await element(by.css('.btn-monthyear-pane')).isPresent()).toEqual(false);
  });
});

describe('Datepicker No Today Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-no-today?layout=nofrills');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not have a today link year picker', async () => {
    expect(await element(by.css('.hyperlint.today')).isPresent()).toEqual(false);
  });
});

describe('Datepicker Month Year Changer Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index?layout=nofrills');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should be able to change month', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys('10/1/2018');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.id('btn-monthyear-pane')).click();
    await browser.driver.sleep(config.sleep);

    await element(by.cssContainingText('.picklist-item', 'April')).click();
    await element(by.css('.is-select-month-pane')).click();
    await browser.driver.sleep(config.sleep);

    const prevButtonEl = await element(by.css('.prev.btn-icon'));
    await prevButtonEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    const lastButtonEl = await element(by.css('.next.btn-icon'));
    await lastButtonEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    const buttonEl = await element.all(by.css('.monthview-table td:not(.alternate)')).first();
    await buttonEl.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('date-field-normal')).getAttribute('value')).toEqual('4/1/2018');
  });

  it('Should be able to change year', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys('10/1/2018');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.id('btn-monthyear-pane')).click();
    await browser.driver.sleep(config.sleep);

    await element(by.cssContainingText('.picklist-item', '2021')).click();
    await element(by.css('.is-select-month-pane')).click();
    await browser.driver.sleep(config.sleep);

    const prevButtonEl = await element(by.css('.prev.btn-icon'));
    await prevButtonEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    const lastButtonEl = await element(by.css('.next.btn-icon'));
    await lastButtonEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    const buttonEl = await element.all(by.css('.monthview-table td:not(.alternate)')).first();
    await buttonEl.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('date-field-normal')).getAttribute('value')).toEqual('10/1/2021');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress when closed', async () => {
      await element(by.css('#date-field-normal')).sendKeys('10/1/2018');
      await element(by.css('#date-field-normal + .icon')).click();
      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-with-month-year-picker-closed')).toEqual(0);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress when open', async () => {
      await element(by.css('#date-field-normal')).sendKeys('10/1/2018');
      await element(by.css('#date-field-normal + .icon')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.css('#btn-monthyear-pane')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-with-month-year-picker-open')).toEqual(0);
    });
  }
});

describe('Datepicker Month Year Changer Year First Tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index?layout=nofrills&locale=ja-JP');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should be able to change month', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys('2018/01/10');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.id('btn-monthyear-pane')).click();
    await browser.driver.sleep(config.sleep);

    await element(by.cssContainingText('.picklist-item', '4月')).click();
    await element(by.css('.is-select-month-pane')).click();
    await browser.driver.sleep(config.sleep);

    const prevButtonEl = await element(by.css('.prev.btn-icon'));
    await prevButtonEl.sendKeys(protractor.Key.ENTER);

    const lastButtonEl = await element(by.css('.next.btn-icon'));
    await lastButtonEl.sendKeys(protractor.Key.ENTER);

    const buttonEl = await element.all(by.css('.monthview-table td:not(.alternate)')).first();
    await buttonEl.click();

    expect(await element(by.id('date-field-normal')).getAttribute('value')).toEqual('2018/04/01');
  });

  it('Should be able to change year', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await datepickerEl.sendKeys('2019/07/09');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await element(by.id('btn-monthyear-pane')).click();
    await browser.driver.sleep(config.sleep);

    await element(by.cssContainingText('.picklist-item', '2021')).click();
    await element(by.css('.is-select-month-pane')).click();
    await browser.driver.sleep(config.sleep);

    const prevButtonEl = await element(by.css('.prev.btn-icon'));
    await prevButtonEl.sendKeys(protractor.Key.ENTER);

    const lastButtonEl = await element(by.css('.next.btn-icon'));
    await lastButtonEl.sendKeys(protractor.Key.ENTER);

    const buttonEl = await element.all(by.css('.monthview-table td:not(.alternate)')).first();
    await buttonEl.click();

    expect(await element(by.id('date-field-normal')).getAttribute('value')).toEqual('2021/07/01');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress when closed', async () => {
      await element(by.css('#date-field-normal')).sendKeys('2019/07/09');
      await element(by.css('#date-field-normal + .icon')).click();
      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-with-month-year-picker-closed-yearfirst')).toEqual(0);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress when open', async () => {
      await element(by.css('#date-field-normal')).sendKeys('2019/07/09');
      await element(by.css('#date-field-normal + .icon')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.css('#btn-monthyear-pane')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-with-month-year-picker-yearfirst')).toEqual(0);
    });
  }
});

describe('Datepicker Range Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-range');
  });

  it('Should be able to change and set a range', async () => {
    const datepickerEl = await element(by.id('range-novalue'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);
    const button1El = await element.all(by.css('.monthview-table td:not(.alternate)')).first();
    await button1El.click();

    const button2El = await element.all(by.css('.monthview-table td:not(.alternate)')).last();
    await button2El.click();

    const testDate1 = new Date();
    const testDate2 = new Date();
    const testDate3 = new Date(testDate2.getFullYear(), testDate2.getMonth() + 1, 0);
    await testDate2.setDate(testDate3.getDate());

    expect(await element(by.id('range-novalue')).getAttribute('value')).toEqual(`${(testDate1.getMonth() + 1)}/1/${testDate1.getFullYear()} - ${(testDate2.getMonth() + 1)}/${testDate2.getDate()}/${testDate2.getFullYear()}`);
  });
});

describe('Datepicker Timeformat Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-timeformat');
  });

  it('Should set custom pattern time when selected', async () => {
    const datepickerEl = await element(by.id('dp1'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('monthview-popup'))), config.waitsFor);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await element(by.id('dp1')).getAttribute('value')).toEqual(`${testDate.getMonth() + 1}/${testDate.getDate()}/${(testDate.getFullYear())} 12:00 AM`);
  });

  it('Should set locale time to midnight when selected ', async () => {
    const datepickerEl = await element(by.id('dp2'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await element(by.id('dp2')).getAttribute('value')).toEqual(`${(testDate.getMonth() + 1)}/${testDate.getDate()}/${testDate.getFullYear()} 12:00 AM`);
  });

  it('Should set locale time to current time when selected ', async () => {
    const datepickerEl = await element(by.id('dp3'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();
    const value = await element(by.id('dp3')).getAttribute('value');
    const valueDate = new Date(value);

    const testDate = new Date();
    const allowedVariance = 120000; // milliseconds
    const dateDiff = Math.abs(testDate - valueDate); // guarentee its a positive result

    expect(dateDiff).toBeLessThanOrEqual(allowedVariance);
  });

  it('Should work with ko-KO locale', async () => {
    await utils.setPage('/components/datepicker/example-timeformat?locale=ko-KR');
    const datepickerEl = await element(by.id('dp2'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('monthview-popup'))), config.waitsFor);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await element(by.id('dp2')).getAttribute('value')).toEqual(`${(testDate.getFullYear())}-${(testDate.getMonth() + 1).toString().padStart(2, '0')}-${testDate.getDate().toString().padStart(2, '0')} 오전 12:00`);
    expect(await element.all(by.css('.error-text')).count()).toEqual(0);
  });

  it('Should work with zh-TW locale', async () => {
    await utils.setPage('/components/datepicker/example-timeformat?locale=zh-TW');
    const datepickerEl = await element(by.id('dp2'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('monthview-popup'))), config.waitsFor);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await element(by.id('dp2')).getAttribute('value')).toEqual(`${(testDate.getFullYear())}/${(testDate.getMonth() + 1)}/${testDate.getDate()} 上午12:00`);
    expect(await element.all(by.css('.error-text')).count()).toEqual(0);
  });

  it('Should work with hi-IN locale', async () => {
    await utils.setPage('/components/datepicker/example-timeformat?locale=hi-IN');
    const datepickerEl = await element(by.id('dp2'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('monthview-popup'))), config.waitsFor);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await element(by.id('dp2')).getAttribute('value')).toEqual(`${testDate.getDate().toString().padStart(2, '0')}-${(testDate.getMonth() + 1).toString().padStart(2, '0')}-${(testDate.getFullYear())} 12:00 पूर्व`);
    expect(await element.all(by.css('.error-text')).count()).toEqual(0);
  });

  it('Should work with ar-SA locale', async () => {
    await utils.setPage('/components/datepicker/example-timeformat?locale=ar-SA');
    const datepickerEl = await element(by.id('dp1'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('monthview-popup'))), config.waitsFor);

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    // Cant parse the full date so its a loose check
    // If this starts to fail, adjust the year
    const displayedValue = element(by.id('policyNumber')).getAttribute('value');

    expect(displayedValue).toContain('ص');
    expect(displayedValue).toContain('14');

    await utils.checkForErrors();

    expect(await element.all(by.css('.error-text')).count()).toEqual(0);
  });
});

describe('Datepicker Umalqura Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-umalqura');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.datepicker + .icon'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render Umalqura monthview', async () => {
    await await element(by.id('islamic-date')).sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('.popup-footer .is-cancel')).getText()).toEqual('مسح');

    await await element(by.css('.hyperlink.today')).click();
    const value = await element(by.id('islamic-date')).getAttribute('value');

    expect([8, 9, 10]).toContain(value.length);
    await utils.checkForErrors();
  });

  it('Should open popup on icon click', async () => {
    const datepickerEl = await element(by.id('islamic-date'));
    await datepickerEl.sendKeys('1441/09/19');
    await element(by.css('#islamic-date + .icon')).click();

    expect(await datepickerEl.getAttribute('class')).toContain('is-open');
    expect(await element(by.id('monthview-popup')).isDisplayed()).toBe(true);
  });
});

describe('Datepicker Month Year Picker Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-month-year-format?layout=nofrills');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should be able to function as month/year picker', async () => {
    const datepickerEl = await element(by.id('month-year'));
    await datepickerEl.sendKeys('01/2018');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver.sleep(config.sleep);

    await element(by.cssContainingText('.picklist-item', 'April')).click();
    await element(by.css('.picklist-item.down a')).click();
    await element(by.css('.picklist-item.down a')).click();
    await element(by.css('.picklist-item.down a')).click();
    await element(by.cssContainingText('.picklist-item', '2017')).click();

    await element(by.css('.is-select-month')).click();

    expect(await element(by.id('month-year')).getAttribute('value')).toEqual('04/2017');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#month-year')).sendKeys('01/2018');
      await element(by.css('#month-year + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-month-year-picker')).toEqual(0);
    });
  }
});

describe('Datepicker Year Picker Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-month-year-format?layout=nofrills');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should be able to function as year picker', async () => {
    const datepickerEl = await element(by.id('year-only'));
    await datepickerEl.sendKeys('2024');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.css('.picklist-item.down a')).click();
    await element(by.css('.picklist-item.down a')).click();
    await element(by.css('.picklist-item.down a')).click();
    await element(by.cssContainingText('.picklist-item', '2030')).click();

    expect(await element(by.id('year-only')).getAttribute('value')).toEqual('2030');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#year-only')).sendKeys('2024');
      await element(by.css('#year-only + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-year-only-picker')).toEqual(0);
    });
  }
});

describe('Datepicker Month Only Picker Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-month-year-format?layout=nofrills');
    const Date = () => {  //eslint-disable-line
      return new Date(2018, 1, 10);
    };
  });

  it('Should be able to function as month/year picker', async () => {
    const datepickerEl = await element(by.id('month-only'));
    await datepickerEl.sendKeys('March');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.cssContainingText('.picklist-item', 'April')).click();

    expect(await element(by.id('month-only')).getAttribute('value')).toEqual('April');
  });

  it('Should be able to function as month picker', async () => {
    const datepickerEl = await element(by.id('month-only-med'));
    await datepickerEl.sendKeys('Apr');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await element(by.cssContainingText('.picklist-item', 'May')).click();

    expect(await element(by.id('month-only-med')).getAttribute('value')).toEqual('May');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.css('#month-only')).sendKeys('March');
      await element(by.css('#month-only + .icon')).click();

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'datepicker-month-only-picker')).toEqual(0);
    });
  }
});

describe('Datepicker Custom Validation Tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-validation');
  });

  it('Should be able to do default invalid date validation', async () => {
    const datepickerEl = await element(by.id('date-field-1'));
    await datepickerEl.sendKeys('7/18/1');
    await datepickerEl.sendKeys(protractor.Key.ENTER);

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Invalid Date');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });

  it('Should be able to do unavailable date validation', async () => {
    const datepickerEl = await element(by.id('date-field-2'));
    await datepickerEl.sendKeys('10/6/2018');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Unavailable Date');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });

  it('Should be able to do custom validation', async () => {
    expect(await element(by.css('.message-text')).isPresent()).toBe(false);

    const datepicker2El = await element(by.id('date-field-3'));
    await datepicker2El.sendKeys('7/18/2018');
    await datepicker2El.sendKeys(protractor.Key.TAB);

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Test Error - Anything you enter will be wrong');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });

  it('Should be able to do unavailable required and date validation', async () => {
    const datepickerEl = await element(by.id('date-field-4'));
    await datepickerEl.clear();
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Required');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);

    await datepickerEl.clear();
    await datepickerEl.sendKeys('12/01');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Invalid Date');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });
});

describe('Datepicker 12hr Time Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-12hr-time');
  });

  it('Should render ar-ZA time', async () => {
    await utils.setPage('/components/datepicker/test-12hr-time?locale=af-ZA');

    const datepickerEl = await element(by.id('datetime-field-time'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);
    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();
    await datepickerEl.sendKeys(protractor.Key.TAB);

    const value = await element(by.id('datetime-field-time')).getAttribute('value');
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(value).toEqual(`${testDate.getDate()} ${testDate.toLocaleDateString('af-ZA', { month: 'short' })} ${testDate.getFullYear()} 12:00 vm.`);
  });

  it('Should render 12hr time', async () => {
    const datepickerEl = await element(by.id('datetime-field-time'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);
    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const value = await element(by.id('datetime-field-time')).getAttribute('value');
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(value).toEqual(`${testDate.getDate()} ${testDate.toLocaleDateString('en-US', { month: 'short' })} ${testDate.getFullYear()} 12:00 AM`);
  });

  it('Should keep time', async () => {
    const datepickerEl = await element(by.id('datetime-field-time'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);
    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    const value = await element(by.id('datetime-field-time')).getAttribute('value');
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(value).toEqual(`${testDate.getDate()} ${testDate.toLocaleDateString('en-US', { month: 'short' })} ${testDate.getFullYear()} 12:00 AM`);
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    const dropdownEl = await element(by.css('#timepicker-period-timepicker-4-id + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await browser.driver.sleep(config.sleep);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');
    expect(value).toEqual(`${testDate.getDate()} ${testDate.toLocaleDateString('en-US', { month: 'short' })} ${testDate.getFullYear()} 12:00 AM`);
  });
});

describe('Datepicker Umalqura EG Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-ar-eg-umalqura?locale=ar-SA');
  });

  it('Should render umalqura on ar-EG time', async () => {
    const datepickerEl = await element(by.id('islamic-date'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.popup-footer .is-cancel')).getText()).toEqual('مسح');

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();
    const result = await browser.executeScript('return Locale.gregorianToUmalqura(new Date())');

    expect(`${result[0]}/${(result[1] + 1).toString().padStart(2, '0')}/${result[2].toString().padStart(2, '0')}`).toEqual(await datepickerEl.getAttribute('value'));
  });
});

describe('Datepicker Gregorian SA Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-ar-sa-gregorian');
  });

  it('Should render gregorian on ar-SA time', async () => {
    const datepickerEl = await element(by.id('islamic-date'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.popup-footer .is-cancel')).getText()).toEqual('مسح');

    const todayEl = await element(by.css('.hyperlink.today'));
    await todayEl.click();

    await browser.driver.sleep(config.sleep);
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    const value = await element(by.id('islamic-date')).getAttribute('value');

    expect([8, 9, 10]).toContain(value.length);
  });
});

describe('Datepicker Disabled Years Validation Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-disabled-years-validated');
  });

  it('Should Validate Year', async () => {
    const datepickerEl = await element(by.id('date-field'));

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toEqual('Invalid Date');
    expect(await element(by.id('date-field')).getAttribute('value')).toEqual('512');

    await datepickerEl.clear();
    await datepickerEl.sendKeys('2017');
    await datepickerEl.sendKeys(protractor.Key.TAB);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).isPresent()).toBe(false);
    expect(await element(by.id('date-field')).getAttribute('value')).toEqual('2017');
  });
});

describe('Datepicker Invalid Date Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-invalid-dates');
  });

  it('Should Validate Unavailable Dates', async () => {
    const datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys('2/12/');
    await datepickerEl.sendKeys(protractor.Key.TAB);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).isPresent()).toBe(true);
    expect(await element(by.css('.message-text')).getText()).toEqual('Unavailable Date');

    await datepickerEl.clear();
    await datepickerEl.sendKeys('11/11/2018');
    await datepickerEl.sendKeys(protractor.Key.TAB);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('date-field')).getAttribute('value')).toEqual('11/11/2018');
    expect(await element(by.css('.message-text')).isPresent()).toBe(true);
  });
});

describe('Datepicker Modal Test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-modal');
  });

  it('Should work on a modal', async () => {
    await element(by.css('.btn-secondary')).click();
    await browser.driver.sleep(config.sleep);

    const datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    await browser.driver.sleep(config.sleepLonger);
    const focusTD = await element(by.css('#monthview-popup td.is-selected'));
    await focusTD.sendKeys(protractor.Key.ESCAPE);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('modal-1')).isDisplayed()).toBeTruthy();
    await element(by.id('context-name')).sendKeys(protractor.Key.ESCAPE);

    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('modal-1')).isDisplayed()).toBeFalsy();
  });
});

describe('Datepicker Month Format Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-month-formats');
  });

  it('Should Format Long Month', async () => {
    expect(await element(by.id('datetime-field-time2')).getAttribute('value')).toEqual('25 Dec 2016 11:55 PM');
    expect(await element(by.id('datetime-field-time4')).getAttribute('value')).toEqual('25 Dec 2016 23:45');
    expect(await element(by.id('datetime-field-time6')).getAttribute('value')).toEqual('23 Dec 2016 23:45:25');
  });
});

describe('Datepicker restrict month selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-restrict-month-selection');
  });

  it('Should disable months in front and behind', async () => {
    const datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).not.toEqual('true');

    await element(by.css('.monthview-header .next')).click();

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).not.toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).not.toEqual('true');

    await element(by.css('.monthview-header .next')).click();

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).not.toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).toEqual('true');

    await element(by.css('.monthview-header .prev')).click();

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).not.toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).not.toEqual('true');

    await element(by.css('.monthview-header .prev')).click();

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).not.toEqual('true');
  });

  it('Should handle edge case of way out of range', async () => {
    const datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys('04/15/2011');
    await datepickerEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver.sleep(config.sleepShort);

    expect(await element(by.css('.monthview-header .prev')).getAttribute('disabled')).toEqual('true');
    expect(await element(by.css('.monthview-header .next')).getAttribute('disabled')).not.toEqual('true');
  });
});

describe('Datepicker set first day of week tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-set-first-day-of-week');
  });

  it('Should set first day of week', async () => {
    const triggerEl = await element(by.tagName('thead'));
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await element(by.css('.is-focused'))).toBeTruthy();

    const testEl = await triggerEl.all(by.tagName('th')).get(0);

    expect(await testEl.getText()).toEqual('M');
  });
});

describe('Datepicker Set Value Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-set-value');
  });

  it('Should setValue on Various Types', async () => {
    expect(await element(by.id('date-field')).getAttribute('value')).toEqual('5/10/2015');
    expect(await element(by.id('date-field-2')).getAttribute('value')).toEqual('5/10/2015');
    expect(await element(by.id('date-field-3')).getAttribute('value')).toEqual('5/10/2015');
    expect(await element(by.id('date-field-4')).getAttribute('value')).toEqual('5/10/2015');
    expect(await element(by.id('date-field-5')).getAttribute('value')).toEqual('5/10/2015');
  });
});

describe('Datepicker Time in Cs-Cz Format Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-with-time-cs-CZ');
  });

  it('Should be Able Format time with cs-CZ', async () => {
    expect(await element(by.id('dp1')).getAttribute('value')).toEqual('26.02.2016 9:15 PM');
    expect(await element(by.id('dp2')).getAttribute('value')).toEqual('26.02.2016 14:15');
    expect(await element(by.id('dp3')).getAttribute('value')).toEqual('05.04.2018 16:15');
  });
});

describe('Datepicker Body Re Initialize Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-validation-body-reinitialize');
  });

  it('Should Validate after body re-initialize', async () => {
    let datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys('123');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).isPresent()).toBe(true);
    expect(await element(by.css('.message-text')).getText()).toEqual('Invalid Date');

    await datepickerEl.clear();
    await element(by.css('#btn-reinitialize')).click();
    await browser.driver.sleep(config.sleep);

    datepickerEl = await element(by.id('date-field'));
    await datepickerEl.sendKeys('123');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).isPresent()).toBe(true);
    expect(await element(by.css('.message-text')).getText()).toEqual('Invalid Date');
  });
});

describe('Datepicker specific locale/language tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-two-locales-same-page');
  });

  it('Should be able to use current locale', async () => {
    const datepickerEl = await element(by.id('date-field-normal'));
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('Today');
    await element(by.css('.hyperlink.today')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US'));
  });

  it('Should be able to use non current locale', async () => {
    const datepickerEl = await element(by.id('date-field-danish'));
    await element(by.css('#date-field-danish + .icon')).click();

    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('I dag');
    await element(by.css('.hyperlink.today')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getDate().toString().padStart(2, '0')}-${(testDate.getMonth() + 1).toString().padStart(2, '0')}-${testDate.getFullYear()}`);
  });

  it('Should be Able to use non current locale and a different language', async () => {
    const datepickerEl = await element(by.id('date-field-sv-de'));
    await element(by.css('#date-field-sv-de + .icon')).click();

    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('Idag');
    await element(by.css('.hyperlink.today')).click();

    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);

    expect(await datepickerEl.getAttribute('value')).toEqual(`${testDate.getDate().toString().padStart(2, '0')}.${(testDate.getMonth() + 1).toString().padStart(2, '0')}.${testDate.getFullYear()}`);
  });
});

describe('Datepicker specific language tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/test-specific-lang');
  });

  it('Should be able to different language and locale', async () => {
    await element(by.css('#date-field-normal + .icon')).click();

    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('Hoy');
    expect(await element(by.css('#btn-monthyear-pane')).getText()).toEqual('Febrero 2020');
    expect(await element(by.css('.monthview-table thead th:first-child')).getText()).toEqual('L');
  });
});
