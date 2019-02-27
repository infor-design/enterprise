const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index?layout=nofrills');
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
    await testDate.setFullYear(2018);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should render ajax loaded dates for august 2018', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.calendar-event-more'))), 4000);

    expect(await element.all(by.css('.calendar-event-more')).count()).toEqual(1);
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(4);
  });

  it('Should render ajax loaded dates for sept 2018', async () => {
    const eventMore = await element(by.css('.monthview-header .next'));
    await eventMore.click();
    await browser.driver.sleep(1000);

    const testDate = new Date();
    await testDate.setDate(1);
    await testDate.setMonth(8);
    await testDate.setFullYear(2018);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
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
    await testDate.setFullYear(2018);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);
      await element.all(by.cssContainingText('.monthview-table td', '2')).first().click();

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-index')).toBeLessThan(1);
    });
  }

  it('should render icons on events', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.calendar-event.azure.event-day-start .icon'))), config.waitsFor);

    expect(await element.all(by.css('.calendar-event.azure.event-day-start .icon')).count()).toEqual(1);
  });

  it('should allow event to span days', async () => {
    expect(await element.all(by.css('.calendar-event.azure.event-day-start')).count()).toEqual(2);
    expect(await element.all(by.css('.calendar-event.azure.event-day-span')).count()).toEqual(9);
    expect(await element.all(by.css('.calendar-event.azure.event-day-end')).count()).toEqual(2);
  });

  it('should show events on click', async () => {
    await element.all(by.cssContainingText('.monthview-table td', '1')).first().click();

    expect(await element(by.css('.calendar-event-details .accordion-header a')).getText()).toEqual('Team Event');
    expect(await element(by.css('.calendar-event-details .accordion-content')).getText()).toBeTruthy();
  });

  it('should offer a right click menu', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await browser.actions().mouseMove(event).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('calendar-actions-menu'))), config.waitsFor);

    expect(await element(by.id('calendar-actions-menu')).getAttribute('class')).toContain('is-open');
    await element.all(by.css('#calendar-actions-menu a')).first().click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(15);
  });

  it('should add new events on double click and cancel', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);

    const event = await element.all(by.cssContainingText('.monthview-table td', '2')).first();
    await browser.actions().click(event).perform();
    await browser.actions().doubleClick(event).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.css('.calendar-popup .btn-close')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);
  });

  it('should add new events on double click and submit', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);

    const event = await element.all(by.cssContainingText('.monthview-table td', '2')).first();
    await browser.actions().click(event).perform();
    await browser.actions().doubleClick(event).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.id('submit')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);
  });
});
