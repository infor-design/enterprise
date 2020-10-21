const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('WeekView index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/example-index?layout=nofrills');
    const dateField = await element(by.css('.week-view #custom-id-week-view-datepicker'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(8);
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('custom-id-week-view-btn-prev')).getAttribute('id')).toEqual('custom-id-week-view-btn-prev');
    expect(await element(by.id('custom-id-week-view-btn-prev')).getAttribute('data-automation-id')).toEqual('custom-automation-id-week-view-btn-prev');
    expect(await element(by.id('custom-id-week-view-btn-next')).getAttribute('id')).toEqual('custom-id-week-view-btn-next');
    expect(await element(by.id('custom-id-week-view-btn-next')).getAttribute('data-automation-id')).toEqual('custom-automation-id-week-view-btn-next');

    expect(await element(by.id('custom-id-week-view-datepicker')).getAttribute('id')).toEqual('custom-id-week-view-datepicker');
    expect(await element(by.id('custom-id-week-view-datepicker')).getAttribute('data-automation-id')).toEqual('custom-automation-id-week-view-datepicker');

    expect(await element(by.id('custom-id-week-view-datepicker-trigger')).getAttribute('id')).toEqual('custom-id-week-view-datepicker-trigger');
    expect(await element(by.id('custom-id-week-view-datepicker-trigger')).getAttribute('data-automation-id')).toEqual('custom-automation-id-week-view-datepicker-trigger');

    expect(await element(by.id('custom-id-week-view-today')).getAttribute('id')).toEqual('custom-id-week-view-today');
    expect(await element(by.id('custom-id-week-view-today')).getAttribute('data-automation-id')).toEqual('custom-automation-id-week-view-today');
  });
});

describe('WeekView ajax loading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/test-ajax-events');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    await utils.checkForErrors();
  });

  it('Should render ajax loaded dates', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element.all(by.css('.calendar-event')).last()), 4000);

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(6);
  });
});

describe('WeekView specific week tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/test-specific-week?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render correctly', async () => {
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(8);
    await utils.checkForErrors();

    const testDate = new Date();
    await testDate.setDate(1);
    await testDate.setMonth(10);
    await testDate.setFullYear(2019);

    expect(await element(by.css('.week-view #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(weekviewEl, 'week-view-index')).toEqual(0);
    });
  }

  it('should render icons on events', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-event-icon'))), config.waitsFor);

    expect(await element.all(by.css('.calendar-event-icon')).count()).toEqual(1);
  });

  it('should allow event to span days', async () => {
    expect(await element.all(by.css('.calendar-event.azure.calendar-event-start')).count()).toEqual(1);
    expect(await element.all(by.css('.calendar-event.azure.calendar-event-ends')).count()).toEqual(1);
  });
});

describe('WeekView events tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/test-events?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(2);
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(6);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {  //eslint-disable-line
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(weekviewEl, 'week-view-events')).toEqual(0);
    });
  }
});

describe('WeekView Start Week tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/test-start-week?layout=nofrills&locale=de-DE');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(8);
    await utils.checkForErrors();
  });

  it('Should render monday first and sunday last', async () => {
    expect(await element(by.css('.week-view-table th:nth-child(2) span:nth-child(1)')).getText()).toContain('Mo');
    expect(await element(by.css('.week-view-table th:nth-child(8) span:nth-child(1)')).getText()).toContain('So');
  });
});

describe('WeekView updated tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/test-updated?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(15);
    await utils.checkForErrors();
  });

  it('Should render days', async () => {
    expect(await element(by.css('.week-view-table th:nth-child(2) span:nth-child(1)')).getText()).toEqual('16');
    expect(await element(by.css('.week-view-table th:nth-child(2) span:nth-child(2)')).getText()).toEqual('Mon');
    expect(await element(by.css('.week-view-table th:nth-child(15) span:nth-child(1)')).getText()).toContain('29');
    expect(await element(by.css('.week-view-table th:nth-child(15) span:nth-child(2)')).getText()).toContain('Sun');
  });

  it('Should update', async () => {
    await element(by.id('actions')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element.all(by.css('.calendar-event')).last()), 4000);

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(6);
  });
});

describe('WeekView two weeks tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/example-two-weeks?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(15);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {  //eslint-disable-line
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(weekviewEl, 'week-view-two-weeks')).toEqual(0);
    });
  }
});

describe('WeekView one day weeks tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/example-one-day?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(2);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {  //eslint-disable-line
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(weekviewEl, 'week-view-one-day')).toEqual(0);
    });
  }
});

describe('WeekView two day tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/week-view/example-two-day?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {  //eslint-disable-line
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(3);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {  //eslint-disable-line
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(weekviewEl, 'week-view-two-day')).toEqual(0);
    });
  }
});
