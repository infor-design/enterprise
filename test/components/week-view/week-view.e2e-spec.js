const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('WeekView index tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/week-view/example-index?layout=nofrills');
    const dateField = await element(by.css('.week-view #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.week-view-table th')).count()).toEqual(8);
    await utils.checkForErrors();
  });
});

describe('WeekView ajax loading tests', () => { //eslint-disable-line
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

describe('WeekView specific week tests', () => {  //eslint-disable-line
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
    await testDate.setMonth(11);
    await testDate.setFullYear(2019);

    expect(await element(by.css('.week-view #monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const weekviewEl = await element(by.className('week-view'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(weekviewEl, 'week-view-index')).toEqual(0);
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

describe('WeekView events tests', () => {  //eslint-disable-line
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

      expect(await browser.protractorImageComparison.checkElement(weekviewEl, 'week-view-events')).toEqual(0);
    });
  }
});

describe('WeekView Start Week tests', () => {  //eslint-disable-line
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
    expect(await element(by.css('.week-view-table th:nth-child(2)')).getText()).toContain('Montag');
    expect(await element(by.css('.week-view-table th:nth-child(8)')).getText()).toContain('Sonntag');
  });
});

describe('WeekView updated tests', () => {  //eslint-disable-line
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
    expect(await element(by.css('.week-view-table th:nth-child(2)')).getText()).toEqual('16 Monday');
    expect(await element(by.css('.week-view-table th:nth-child(15)')).getText()).toContain('29 Sunday');
  });

  it('Should update', async () => {
    await element(by.id('actions')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element.all(by.css('.calendar-event')).last()), 4000);

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(6);
  });
});

describe('WeekView two weeks tests', () => {  //eslint-disable-line
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

      expect(await browser.protractorImageComparison.checkElement(weekviewEl, 'week-view-two-weeks')).toEqual(0);
    });
  }
});

describe('WeekView one day weeks tests', () => {  //eslint-disable-line
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

      expect(await browser.protractorImageComparison.checkElement(weekviewEl, 'week-view-one-day')).toEqual(0);
    });
  }
});

describe('WeekView two day tests', () => {  //eslint-disable-line
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

      expect(await browser.protractorImageComparison.checkElement(weekviewEl, 'week-view-two-day')).toEqual(0);
    });
  }
});
