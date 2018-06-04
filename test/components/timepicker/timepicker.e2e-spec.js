const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const ddSelector = function (dropdown) {
  return `#timepicker-popup select.dropdown.${dropdown} + .dropdown-wrapper div[aria-controls="dropdown-list"]`;
};

describe('Timepicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-index');
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

  it('Should pick time from picker and set to field', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await element(by.css('.timepicker + .icon')).click();
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('3');
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('10');
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('3:10 PM');
  });

  it('Should not pick date from picker', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await timepickerEl.sendKeys('2:20 AM');
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:20 AM');
  });
});

describe('Timepicker 24 Hour tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-24-hour');
  });

  it('Should open popup on icon click for 24 Hour', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should pick time from picker and set to field for 24 Hour', async () => {
    const timepickerEl = await element(by.id('timepicker-24hrs'));
    await timepickerEl.sendKeys('19:15');
    await element(by.css('.timepicker + .icon')).click();
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('21');
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('25');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.timepicker.is-open'))), config.waitsFor);

    expect(await element(by.id('timepicker-24hrs')).getAttribute('value')).toEqual('21:25');
  });
});

describe('Timepicker with seconds example tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-seconds-picker');
  });

  it('Should open popup on icon click with seconds', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should set time from popup to field with seconds', async () => {
    const timepickerEl = await element(by.id('time-field'));
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('01:00:00 AM');
  });

  it('Should pick time from picker and set to field with seconds', async () => {
    const timepickerEl = await element(by.id('time-field'));
    await element(by.css('.timepicker + .icon')).click();
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('03');
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('10');
    dropdownEl = await element(by.css(ddSelector('seconds')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('15');
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('03:10:15 PM');
  });

  it('Should not pick date from picker with seconds', async () => {
    const timepickerEl = await element(by.id('time-field'));
    await timepickerEl.sendKeys('02:20:35 PM');
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await timepickerEl.getAttribute('value')).toEqual('02:20:35 PM');
  });
});

describe('Timepicker Intervals tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-intervals');
  });

  it('Should pick time from picker with 10 minute intervals', async () => {
    const timepickerEl = await element(by.id('time-intervals'));
    await element(by.css('.timepicker + .icon')).click();
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('3');
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('20');
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('3:20 PM');
  });

  it('Should rounds minutes to the nearest interval', async () => {
    const timepickerEl = await element(by.id('time-intervals'));
    await timepickerEl.sendKeys('2:24 AM');
    await timepickerEl.sendKeys(protractor.Key.TAB);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:20 AM');
  });
});

describe('Timepicker states tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-states');
  });

  it('Should check to make readonly', async () => {
    await element(by.id('btn-readonly')).click();

    expect(await element(by.css('.timepicker[readonly]')).isDisplayed()).toBe(true);
  });

  it('Should check to make disable', async () => {
    await element(by.id('btn-disable')).click();

    expect(await element(by.css('.timepicker')).isEnabled()).toBeFalsy();
  });

  it('Should check to make enable', async () => {
    await element(by.id('btn-readonly')).click();

    expect(await element(by.css('.timepicker[readonly]')).isDisplayed()).toBe(true);
    await element(by.id('btn-enable')).click();

    expect(await element(by.css('.timepicker')).getAttribute('readonly')).toEqual(null);
    await element(by.id('btn-disable')).click();

    expect(await element(by.css('.timepicker')).isEnabled()).toBeFalsy();
    await element(by.id('btn-enable')).click();

    expect(await element(by.css('.timepicker')).getAttribute('readonly')).toEqual(null);
    expect(await element(by.css('.timepicker')).getAttribute('disabled')).toEqual(null);
    expect(await element(by.css('.timepicker')).isEnabled()).toBeTruthy();
  });
});

describe('Timepicker validation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-with-validation');
  });

  it('Should have required css class in markup', async () => {
    expect(await element(by.css('.timepicker.required')).isDisplayed()).toBe(true);
  });

  it('Should check required rule', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await timepickerEl.clear();

    expect(await timepickerEl.getAttribute('value')).toEqual('');

    await timepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);
    expect(await timepickerEl.getAttribute('class')).toContain('error');
  });

  it('Should check for invalid time rule', async () => {
    const timepickerEl = await element(by.id('timepicker-main'));
    await timepickerEl.clear();
    await timepickerEl.sendKeys('1:00 A');

    expect(await timepickerEl.getAttribute('value')).toEqual('1:00 A');

    await timepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Invalid Time');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);
    expect(await timepickerEl.getAttribute('class')).toContain('error');
  });
});
