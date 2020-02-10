const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = require('../../helpers/e2e-config.js');

const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Locale Format Date Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/locale/test-format-date?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('date-field3'))), config.waitsFor);
  });

  it('Should format dates when set to a specific locale', async () => {
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
