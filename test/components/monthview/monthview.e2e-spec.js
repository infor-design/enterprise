const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('MonthView index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/example-index?layout=nofrills');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('button.next'));

    expect(await nextButton.getText()).toEqual('Next Month');
    const testDate = new Date();

    expect(await element(by.id('monthview-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.id('monthview-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should be able to change month to previous', async () => {
    const prevButton = await element(by.css('button.prev'));
    const testDate = new Date();

    expect(await element(by.id('monthview-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await prevButton.click();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() - 1);

    expect(await element(by.id('monthview-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await prevButton.getText()).toEqual('Previous Month');
  });

  fit('Should be able to set id/automation id', async () => {
    expect(await element(by.id('monthview-id-month-view-btn-prev')).getAttribute('id')).toEqual('monthview-id-month-view-btn-prev');
    expect(await element(by.id('monthview-id-month-view-btn-prev')).getAttribute('data-automation-id')).toEqual('monthview-automation-id-btn-prev');
    expect(await element(by.id('monthview-id-btn-next')).getAttribute('id')).toEqual('monthview-id-btn-next');
    expect(await element(by.id('monthview-id-btn-next')).getAttribute('data-automation-id')).toEqual('monthview-automation-id-btn-next');

    expect(await element(by.id('monthview-id-datepicker')).getAttribute('id')).toEqual('monthview-id-datepicker');
    expect(await element(by.id('monthview-id-datepicker')).getAttribute('data-automation-id')).toEqual('monthview-automation-id-datepicker');

    expect(await element(by.id('monthview-id-datepicker-trigger')).getAttribute('id')).toEqual('monthview-id-datepicker-trigger');
    expect(await element(by.id('monthview-id-datepicker-trigger')).getAttribute('data-automation-id')).toEqual('monthview-automation-id-datepicker-trigger');

    expect(await element(by.id('monthview-id-today')).getAttribute('id')).toEqual('monthview-id-today');
    expect(await element(by.id('monthview-id-today')).getAttribute('data-automation-id')).toEqual('monthview-automation-id-today');
  });
});

describe('Monthview keyboard tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/example-index');
  });

  it('Should be able to use arrow down key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() + 7);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_DOWN);

    testDate.setDate(testDate.getDate() + 7);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use arrow up key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() - 7);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_UP);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_UP);

    testDate.setDate(testDate.getDate() - 7);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use arrow left key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() - 1);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_LEFT);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_LEFT);

    testDate.setDate(testDate.getDate() - 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use arrow right key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(testDate.getDate() + 1);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_RIGHT);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.ARROW_RIGHT);

    testDate.setDate(testDate.getDate() + 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use page up key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setMonth(testDate.getMonth() - 1);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_UP);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_UP);

    testDate.setMonth(testDate.getMonth() - 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use page down key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setMonth(testDate.getMonth() + 1);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_DOWN);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());

    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.PAGE_DOWN);

    testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use home key', async () => {
    const testDate = new Date();
    testDate.setHours(0);
    testDate.setMinutes(0);
    testDate.setSeconds(0);
    testDate.setDate(1);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.HOME);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(testDate.getDate().toString());
  });

  it('Should be able to use end key', async () => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    await element(by.css('.monthview-table .is-selected')).click();
    await element(by.css('.monthview-table .is-selected')).sendKeys(protractor.Key.END);

    expect(await element(by.css('.monthview-table .is-selected .day-text')).getText()).toEqual(lastDayOfMonth.getDate().toString());
  });
});

describe('MonthView disable day tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/test-disable-weekends.html?layout=nofrills');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should disable weekends', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    expect(await element.all(by.css('.monthview-table td.is-disabled')).count()).toEqual(12);
  });
});

describe('MonthView disable month selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/test-restrict-month-selection.html');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should disable specified days', async () => {
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.monthview-table td.is-disabled'))), config.waitsFor);

    expect(await element.all(by.css('.monthview-table td.is-disabled')).first().getText()).toEqual('1');
  });

  it('Should disable next and previous buttons moving forward', async () => {
    const nextButton = await element(by.css('.btn-icon.next'));
    const prevButton = await element(by.css('.btn-icon.prev'));

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();

    await nextButton.click();

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();

    await nextButton.click();

    expect(await nextButton.getAttribute('disabled')).toBeTruthy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();
  });

  it('Should disable next and previous buttons moving backward', async () => {
    const nextButton = await element(by.css('.btn-icon.next'));
    const prevButton = await element(by.css('.btn-icon.prev'));

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();

    await prevButton.click();

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeTruthy();
  });
});

describe('MonthView specific locale tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/test-specific-locale');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .visibilityOf(await element(by.css('.monthview-table tr th:nth-child(7)'))), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should render a specific locale', async () => {
    expect(await element(by.id('monthview-datepicker-field')).getText()).toEqual('maj 2019');
    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('I dag');
    expect(await element(by.css('.monthview-table tr th:nth-child(1)')).getText()).toEqual('man');
    expect(await element(by.css('.monthview-table tr th:nth-child(7)')).getText()).toEqual('søn');
  });
});

describe('MonthView specific language tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/test-specific-lang');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should render a specific locale and language', async () => {
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('monthview-datepicker-field')).getText()).toEqual('Juli 2020');
    expect(await element(by.css('.hyperlink.today')).getText()).toEqual('Heute');
    expect(await element(by.css('.monthview-table tr th:nth-child(1)')).getText()).toEqual('Mo');
    expect(await element(by.css('.monthview-table tr th:nth-child(7)')).getText()).toEqual('So');
  });
});

describe('MonthView RTL tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/test-specific-month.html?locale=ar-SA&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .visibilityOf(await element(by.css('.monthview-table tr th:nth-child(7)'))), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to go to next and prev month', async () => {
    await element(by.css('.monthview-header .prev')).click();

    expect(await element(by.id('monthview-datepicker-field')).getText()).toEqual('ذو الحجة 1439');
    await element(by.css('.monthview-header .next')).click();
    await element(by.css('.monthview-header .next')).click();

    expect(await element(by.id('monthview-datepicker-field')).getText()).toEqual('صفر 1440');
  });
});
