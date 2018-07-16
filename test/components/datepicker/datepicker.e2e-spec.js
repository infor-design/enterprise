const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Datepicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datepicker/example-index');
  });

  it('Should open popup on icon click', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keypress(arrow-down)', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await timepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await timepickerEl.getAttribute('class')).toContain('is-open');
  });

  it('Should set time from popup to field', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('1:00 AM');
  });

  it('Should pick date from picker and set to field', async () => {
  });

  it('Should not be able to pick a date from readonly and disabled datepicker', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await timepickerEl.sendKeys('2:20 AM');
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:20 AM');
  });
});
