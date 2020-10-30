const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const ddSelector = function (dropdown) {
  return `#timepicker-popup select.dropdown.${dropdown} + .dropdown-wrapper div.dropdown`;
};

describe('Timepicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const timepickerSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(timepickerSection), config.waitsFor);
      await element(by.css('.timepicker + .icon')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(timepickerSection, 'timepicker-open')).toEqual(0);
    });
  }

  it('Should open popup on icon click', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element.all(by.className('is-open')).first().isDisplayed()).toBe(true);
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

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('timepicker-id-1')).getAttribute('id')).toEqual('timepicker-id-1');
    expect(await element(by.id('timepicker-id-1')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1');

    expect(await element(by.id('timepicker-id-1-trigger')).getAttribute('id')).toEqual('timepicker-id-1-trigger');
    expect(await element(by.id('timepicker-id-1-trigger')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1-trigger');
  });

  it('Should be able to set id/automation id on hours, minutes, seconds, and button', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element(by.id('timepicker-id-1-hours')).getAttribute('id')).toEqual('timepicker-id-1-hours');
    expect(await element(by.id('timepicker-id-1-hours')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1-hours');

    expect(await element(by.id('timepicker-id-1-minutes')).getAttribute('id')).toEqual('timepicker-id-1-minutes');
    expect(await element(by.id('timepicker-id-1-minutes')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1-minutes');

    expect(await element(by.id('timepicker-id-1-seconds')).getAttribute('id')).toEqual('timepicker-id-1-seconds');
    expect(await element(by.id('timepicker-id-1-seconds')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1-seconds');

    expect(await element(by.id('timepicker-id-1-btn')).getAttribute('id')).toEqual('timepicker-id-1-btn');
    expect(await element(by.id('timepicker-id-1-btn')).getAttribute('data-automation-id')).toEqual('timepicker-automation-id-1-btn');
  });

  // Test has strange behavior on CI, so isolating this to local
  if (!utils.isCI()) {
    it('Should pick time from picker and set to field', async () => {
      const timepickerEl = await element(by.id('timepicker-main'));
      await element(by.css('.timepicker + .icon')).click();
      let dropdownEl = await element(by.css(ddSelector('hours')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);

      expect(await dropdownEl.getText()).toEqual('3');
      dropdownEl = await element(by.css(ddSelector('minutes')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);

      expect(await dropdownEl.getText()).toEqual('10');
      dropdownEl = await element(by.css(ddSelector('period')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);

      expect(await dropdownEl.getText()).toEqual('PM');
      await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

      expect(await timepickerEl.getAttribute('value')).toEqual('3:10 PM');
    });
  }

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
    await utils.setPage('/components/timepicker/test-24-hour');
  });

  it('Should open popup on icon click for 24 Hour', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element.all(by.className('is-open')).first().isDisplayed()).toBe(true);
  });

  if (!utils.isBS() && !utils.isCI()) {
    it('Should pick time from picker and set to field for 24 Hour', async () => {
      const timepickerEl = await element(by.id('timepicker-24hrs'));
      await timepickerEl.sendKeys('19:15');
      await element(by.css('.timepicker + .icon')).click();
      let dropdownEl = await element(by.css(ddSelector('hours')));
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);

      dropdownEl = await element(by.css(ddSelector('minutes')));
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);

      await element(by.className('set-time')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.css('.timepicker + .icon')).click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.id('timepicker-24hrs')).getAttribute('value')).toEqual('21:25');
    });
  }
});

describe('Timepicker with seconds example tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/test-seconds-picker');
  });

  it('Should open popup on icon click with seconds', async () => {
    await element(by.css('.timepicker + .icon')).click();

    expect(await element.all(by.className('is-open')).first().isDisplayed()).toBe(true);
  });

  it('Should set time from popup to field with seconds', async () => {
    const timepickerEl = await element(by.id('time-field'));
    await element(by.css('.timepicker + .icon')).click();
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('01:00:00 AM');
  });

  if (!utils.isBS()) {
    it('Should pick time from picker and set to field with seconds', async () => {
      const timepickerEl = await element(by.id('time-field'));
      await element(by.css('.timepicker + .icon')).click();
      let dropdownEl = await element(by.css(ddSelector('hours')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);

      expect(await dropdownEl.getText()).toEqual('03');
      dropdownEl = await element(by.css(ddSelector('minutes')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);

      expect(await dropdownEl.getText()).toEqual('10');
      dropdownEl = await element(by.css(ddSelector('seconds')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);

      expect(await dropdownEl.getText()).toEqual('15');
      dropdownEl = await element(by.css(ddSelector('period')));
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.SPACE);
      await browser.driver.sleep(config.sleep);

      expect(await dropdownEl.getText()).toEqual('PM');
      await element(by.css('.set-time')).click();
      await browser.driver.sleep(config.sleep);

      expect(await timepickerEl.getAttribute('value')).toEqual('03:10:15 PM');
    });
  }

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
    await utils.setPage('/components/timepicker/test-intervals');
  });

  it('Should pick time from picker with 10 minute intervals', async () => {
    const timepickerEl = await element(by.id('time-intervals'));
    await element(by.css('.timepicker + .icon')).click();
    let dropdownEl = await element(by.css(ddSelector('hours')));
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('2');
    dropdownEl = await element(by.css(ddSelector('minutes')));
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('10');
    dropdownEl = await element(by.css(ddSelector('period')));
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.SPACE);

    expect(await dropdownEl.getText()).toEqual('PM');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('dropdown-list'))), config.waitsFor);

    expect(await timepickerEl.getAttribute('value')).toEqual('2:10 PM');
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
    await utils.setPage('/components/timepicker/test-states');
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

describe('Timepicker Custom Validation Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/example-validation');
  });

  it('Should be able to do default invalid time validation', async () => {
    const datepickerEl = await element(by.id('timepicker-1'));
    await datepickerEl.clear();
    await datepickerEl.sendKeys('1:');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Invalid Time');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });

  it('Should be able to do custom validation', async () => {
    expect(await element(by.css('.message-text')).isPresent()).toBe(false);

    const datepicker2El = await element(by.id('timepicker-2'));
    await datepicker2El.sendKeys(protractor.Key.TAB);

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Test Error - Anything you enter will be wrong');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });

  it('Should be able to do required and time validation', async () => {
    const datepickerEl = await element(by.id('timepicker-3'));
    await datepickerEl.clear();
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Required');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);

    await datepickerEl.clear();
    await datepickerEl.sendKeys('1:');
    await datepickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).last().getText()).toEqual('Invalid Time');
    expect(await element.all(by.css('.message-text')).last(1).isPresent()).toBe(true);
  });
});

describe('Timepicker specific locale/language tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/timepicker/test-specific-locale');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should set time and lanuage independently', async () => {
    let timepickerEl = await element(by.id('timepicker-1'));
    await element(by.css('#timepicker-1 + .icon')).click();

    expect(await element(by.css('.btn-modal-primary')).getText()).toEqual('Indstil tid');

    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('01.00');

    timepickerEl = await element(by.id('timepicker-2'));
    await element(by.css('#timepicker-2 + .icon')).click();

    expect(await element(by.css('.btn-modal-primary')).getText()).toEqual('Ange tid');
    await element(by.css('.set-time')).sendKeys(protractor.Key.SPACE);

    expect(await timepickerEl.getAttribute('value')).toEqual('01:00');
  });
});
