const config = require('../../helpers/e2e-config.js');

const utils = requireHelper('e2e-utils');
requireHelper('rejection');

describe('Locale Format Date Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/locale/test-format-date?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('date-field3'))), config.waitsFor);
  });

  it('should format dates when set to a specific locale', async () => {
    expect(await element(by.css('[for="date-field0"]')).getText()).toEqual('en-US (MMM d, yyyy)');
    expect(await element(by.id('date-field0')).getAttribute('value')).toEqual('Dec 5, 2019');
    expect(await element(by.css('[for="date-field1"]')).getText()).toEqual('en-GB (dd/MM/yyyy)');
    expect(await element(by.id('date-field1')).getAttribute('value')).toEqual('05/12/2019');
    expect(await element(by.css('[for="date-field2"]')).getText()).toEqual('es-US (M/d/yyyy)');
    expect(await element(by.id('date-field2')).getAttribute('value')).toEqual('12/5/2019');
    expect(await element(by.css('[for="date-field3"]')).getText()).toEqual('da-DK (dd-MM-yyyy)');
    expect(await element(by.id('date-field3')).getAttribute('value')).toEqual('05-12-2019');
    expect(await element(by.css('[for="date-field4"]')).getText()).toEqual('pt-BR (dd/MM/yyyy)');
    expect(await element(by.id('date-field4')).getAttribute('value')).toEqual('05/12/2019');
  });
});

describe('Locale Set Value Tests', () => {
  it('should format dates in en-US', async () => {
    await utils.setPage('/components/locale/test-set-value?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('output-date-field-time'))), config.waitsFor);

    expect(await element(by.id('date-field-yyyyMMdd')).getAttribute('value')).toEqual('2/29/2020');
    expect(await element(by.id('date-field-MMdd')).getAttribute('value')).toEqual('February 29');
    expect(await element(by.id('date-field-yyyyMM')).getAttribute('value')).toEqual('February 2020');
    expect(await element(by.id('date-field-yyyy')).getAttribute('value')).toEqual('2020');
    expect(await element(by.id('date-field-timestamp')).getAttribute('value')).toEqual('2/29/2020 10:45:30 AM');

    expect(await element(by.id('output-date-field-yyyyMMdd')).getAttribute('value')).toEqual('20200229');
    expect(await element(by.id('output-date-field-MMdd')).getAttribute('value')).toEqual('0229');
    expect(await element(by.id('output-date-field-yyyyMM')).getAttribute('value')).toEqual('202002');
    expect(await element(by.id('output-date-field-yyyy')).getAttribute('value')).toEqual('2020');
    expect(await element(by.id('output-date-field-timestamp')).getAttribute('value')).toEqual('20200229104530');
    expect(await element(by.id('output-date-field-time')).getAttribute('value')).toEqual('104530');
  });
});

describe('Locale tests', () => {
  it('Loads without errors if D3 is not present', async () => {
    await utils.setPage('/components/locale/test-translated-strings?layout=nofrills&noD3=true');
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('translation-string-container'))), config.waitsFor);
    await utils.checkForErrors();
  });
});
