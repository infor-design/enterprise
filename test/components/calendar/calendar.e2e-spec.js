const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index?layout=nofrills');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to cancel month selector', async () => {
    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('November 2019');

    await element(by.css('.calendar-monthview #monthview-datepicker-field + .icon'));
    await element(by.css('button.is-cancel'));

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('November 2019');
  });

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('.calendar-monthview button.next'));
    const testDate = new Date();

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await utils.checkForErrors();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await nextButton.getText()).toEqual('Next Month');
  });

  it('Should be able to change month to prev', async () => {
    const prevButton = await element(by.css('.calendar-monthview .btn-icon.prev'));
    const testDate = new Date();

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    await prevButton.click();
    await utils.checkForErrors();

    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() - 1);
    await testDate.setHours(0);
    await testDate.setMinutes(0);
    await testDate.setSeconds(0);

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await prevButton.getText()).toEqual('Previous Month');
  });
});

describe('Calendar ajax loading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-ajax-events');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
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

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
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

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await element.all(by.css('.calendar-event-more')).count()).toEqual(0);
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(2);
  });
});

describe('Calendar specific month tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-month');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
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

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  });

  it('Should be able to click on events', async () => {
    await element.all(by.css('.calendar-event-title')).first().click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#calendar-popup')), config.waitsFor));

    expect(await element(by.css('#calendar-popup')).isDisplayed()).toBe(true);
    await utils.checkForErrors();
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

  it('Should add new events on click and cancel', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await event.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.css('.calendar-popup .btn-close')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);
  });

  it('Should add new events on click and submit', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await event.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.id('submit')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);
  });

  it('Should be able to add with the modal', async () => {
    const beforeCount = await element.all(by.css('.calendar-monthview .calendar-event')).count();
    await element.all(by.cssContainingText('.monthview-table td', '13')).first().click();
    await browser.actions()
      .doubleClick(await element.all(by.cssContainingText('.monthview-table td', '13')).first())
      .perform();

    expect(beforeCount).toEqual(16);

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('subject'))), config.waitsFor);
    await element(by.id('subject')).sendKeys('Test Event');
    await element(by.id('submit')).click();

    const afterCount = await element.all(by.css('.calendar-event')).count();

    expect(afterCount).toEqual(beforeCount + 1);
  });
});

describe('Calendar only calendar', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-only-calendar');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to click on events', async () => {
    await element.all(by.css('.calendar-event-title')).first().click();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('toast-container'))), config.waitsFor);

    expect(await element.all(by.css('.toast-message')).first().getText()).toEqual('Event "Out of Office" Clicked');
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);
      await element.all(by.cssContainingText('.monthview-table td', '2')).first().click();

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-only-monthview')).toBeLessThan(1);
    });
  }
});

describe('Calendar specific locale', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-locale');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);
      await element.all(by.cssContainingText('.monthview-table td', '2')).first().click();

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-specific-locale')).toBeLessThan(1);
    });
  }
});

describe('Calendar specific locale and language', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-locale-lang');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);
      await element.all(by.cssContainingText('.monthview-table td', '2')).first().click();

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-specific-locale-lang')).toBeLessThan(1);
    });
  }
});

describe('Calendar only monthview and legend', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-only-calendar-legend');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar'));
      await browser.driver.sleep(config.sleep);
      await element.all(by.cssContainingText('.monthview-table td', '2')).first().click();

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-only-monthview-legend')).toBeLessThan(1);
    });
  }
});

describe('Calendar WeekView settings tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-weekview-settings?layout=nofrills');

    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(14);
    await utils.checkForErrors();
  });

  it('Should switch to week', async () => {
    expect(await element(by.css('.week-view ')).isDisplayed()).toBe(false);
    const dropdownEl = await element.all(by.css('#calendar-view-changer + .dropdown-wrapper div.dropdown')).first();
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);

    expect(await element(by.css('.week-view ')).isDisplayed()).toBe(true);
  });
});
