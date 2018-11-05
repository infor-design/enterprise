const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('MonthView index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/example-index');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('button.next'));

    expect(await nextButton.getText()).toEqual('Next Month');
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should be able to change month to previous', async () => {
    const prevButton = await element(by.css('button.prev'));
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await prevButton.click();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() - 1);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await prevButton.getText()).toEqual('Previous Month');
  });
});

describe('MonthView disable day tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/monthview/example-disable-weeks.html');
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
    await utils.setPage('/components/monthview/example-restrict-month-selection.html');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should disable specified days', async () => {
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.monthview-table td.is-disabled'))), config.waitsFor);

    expect(await element.all(by.css('.monthview-table td.is-disabled')).first().getText()).toEqual('1');
  });

  it('Should disable next and previous buttons', async () => {
    const nextButton = await element(by.css('.btn-icon.next'));
    const prevButton = await element(by.css('.btn-icon.prev'));

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeTruthy();

    await nextButton.click();

    expect(await nextButton.getAttribute('disabled')).toBeFalsy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();

    await nextButton.click();

    expect(await nextButton.getAttribute('disabled')).toBeTruthy();
    expect(await prevButton.getAttribute('disabled')).toBeFalsy();
  });
});
