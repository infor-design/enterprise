const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index?nofrills=true');
    const dateField = await element(by.id('monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('button.next'));
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await utils.checkForErrors();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await nextButton.getText()).toEqual('Next Month');
  });

  it('Should be able to change month to prev', async () => {
    const prevButton = await element(by.css('.btn-icon.prev'));
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    await prevButton.click();
    await utils.checkForErrors();

    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() - 1);
    await testDate.setHours(0);
    await testDate.setMinutes(0);
    await testDate.setSeconds(0);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await prevButton.getText()).toEqual('Previous Month');
  });
});

describe('Calendar ajax loading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-ajax-events');
    const dateField = await element(by.id('monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();

    const testDate = new Date();
    await testDate.setDate(1);
    await testDate.setMonth(7);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should render ajax loaded dates for august 2018', async () => {
    const eventMore = await element(by.css('.calendar-event-more'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(eventMore), config.waitsFor);

    expect(await element.all(by.css('.calendar-event-more')).count()).toEqual(1);
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(4);
  });

  it('Should render ajax loaded dates for october 2018', async () => {
    const eventMore = await element(by.css('.monthview-header .next'));
    await eventMore.click();

    const event = await element(by.css('.calendar-event.graphite'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(event), config.waitsFor);

    expect(await element.all(by.css('.calendar-event-more')).count()).toEqual(0);
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(2);
  });
});

describe('Calendar specific month tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-month');
    const dateField = await element(by.id('monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render correctly', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();

    const testDate = new Date();
    await testDate.setDate(1);
    await testDate.setMonth(9);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-index')).toEqual(0);
    });
  }

  it('should render icons on events', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.calendar-event.emerald.event-day-start .icon'))), config.waitsFor);

    expect(await element.all(by.css('.calendar-event.emerald.event-day-start .icon')).count()).toEqual(1);
  });

  it('should allow event to span days', async () => {
    expect(await element.all(by.css('.calendar-event.emerald.event-day-start')).count()).toEqual(2);
    expect(await element.all(by.css('.calendar-event.emerald.event-day-span')).count()).toEqual(9);
    expect(await element.all(by.css('.calendar-event.emerald.event-day-end')).count()).toEqual(2);
  });

  it('should show events on click', async () => {
    await element.all(by.cssContainingText('.monthview-table td', '1')).first().click();

    expect(await element(by.css('.calendar-event-header')).getText()).toEqual('Team Event');
    expect(await element(by.css('.calendar-event-body')).getText()).toBeTruthy();
  });
});
