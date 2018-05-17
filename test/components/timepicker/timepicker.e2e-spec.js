// TODO: Write WCAG tests

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Get dropdown selector string
const ddSelector = function (dropdown) {
  return `#timepicker-popup select.dropdown.${dropdown} + .dropdown-wrapper div[aria-controls="dropdown-list"]`;
};

// Set page to test by url
const setPage = async function (url) {
  const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(pageurl);
};

let timepickerEl;

describe('TimePicker example-index tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-index');
    timepickerEl = await element(by.id('timepicker-main'));
  });

  it('Should open popup on icon click', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keypress(arrow-down)', async () => {
    await timepickerEl.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await timepickerEl.getAttribute('class')).toContain('is-open');
  });

  it('Should set time from popup to field', async () => {
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('1:00 AM');
  });

  it('Should pick time from picker and set to field', async () => {
    await element(by.css('.timepicker + .icon')).click();

    // Set hours
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('3');

    // Set minutes
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('10');

    // Set period
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');

    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('3:10 PM');
  });

  it('Should not pick date from picker', async () => {
    await timepickerEl.sendKeys('2:20 AM');
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:20 AM');
  });
});

describe('TimePicker 24 Hour tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-24-hour');
    timepickerEl = await element(by.id('timepicker-24hrs'));
  });

  it('Should open popup on icon click for 24 Hour', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should pick time from picker and set to field for 24 Hour', async () => {
    // Set some time
    await timepickerEl.sendKeys('19:15');

    // Open popup
    await element(by.css('.timepicker + .icon')).click();

    // Set hours
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('21');

    // Set minutes
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('25');

    // Set selected time to timepicker element
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('21:25');
  });
});

describe('TimePicker with seconds example tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-seconds-picker');
    timepickerEl = await element(by.id('time-field'));
  });

  it('Should open popup on icon click with seconds', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should set time from popup to field with seconds', async () => {
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('01:00:00 AM');
  });

  it('Should pick time from picker and set to field with seconds', async () => {
    // Open popup
    await element(by.css('.timepicker + .icon')).click();

    // Set hours
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('03');

    // Set minutes
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('10');

    // Set seconds
    dropdownEl = await element(by.css(ddSelector('seconds')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('15');

    // Set period
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');

    // Set selected time to timepicker element
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('03:10:15 PM');
  });

  it('Should not pick date from picker with seconds', async () => {
    await timepickerEl.sendKeys('02:20:35 PM');
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await timepickerEl.getAttribute('value')).toEqual('02:20:35 PM');
  });
});

describe('TimePicker Intervals tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-intervals');
    timepickerEl = await element(by.id('time-intervals'));
  });

  it('Should pick time from picker with 10 minute intervals', async () => {
    // Open popup
    await element(by.css('.timepicker + .icon')).click();

    // Set hours
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('3');

    // Set minutes
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('20');

    // Set period
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.sendKeys(protractor.Key.SPACE);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');

    // Set selected time to timepicker element
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('3:20 PM');
  });

  it('Should rounds minutes to the nearest interval', async () => {
    await timepickerEl.sendKeys('2:24 AM');
    await timepickerEl.sendKeys(protractor.Key.TAB);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:20 AM');
  });
});

describe('TimePicker states tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-states');
    timepickerEl = await element(by.id('timepicker-test'));
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
    // Make readonly
    await element(by.id('btn-readonly')).click();

    expect(await element(by.css('.timepicker[readonly]')).isDisplayed()).toBe(true);

    // Do enable
    await element(by.id('btn-enable')).click();

    expect(await element(by.css('.timepicker')).getAttribute('readonly')).toEqual(null);

    // Make disable
    await element(by.id('btn-disable')).click();

    expect(await element(by.css('.timepicker')).isEnabled()).toBeFalsy();

    // Do enable
    await element(by.id('btn-enable')).click();

    expect(await element(by.css('.timepicker')).getAttribute('readonly')).toEqual(null);
    expect(await element(by.css('.timepicker')).getAttribute('disabled')).toEqual(null);
    expect(await element(by.css('.timepicker')).isEnabled()).toBeTruthy();
  });
});

describe('TimePicker validation tests', () => {
  beforeEach(async () => {
    setPage('/components/timepicker/example-with-validation');
    timepickerEl = await element(by.id('timepicker-main'));
  });

  it('Should have required css class in markup', async () => {
    expect(await element(by.css('.timepicker.required')).isDisplayed()).toBe(true);
  });

  it('Should check required rule', async () => {
    await timepickerEl.clear();

    expect(await timepickerEl.getAttribute('value')).toEqual('');

    await timepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);
    expect(await timepickerEl.getAttribute('class')).toContain('error');
  });

  it('Should check for invalid time rule', async () => {
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
