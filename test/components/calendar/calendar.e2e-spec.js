const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index?layout=nofrills');
    const dateField = await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('.calendar-monthview button.next'));
    const testDate = new Date();

    expect(await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await utils.checkForErrors();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await nextButton.getText()).toEqual('Next Month');
  });

  it('Should be able to change month to prev', async () => {
    const prevButton = await element(by.css('.calendar-monthview .btn-icon.prev'));
    const testDate = new Date();

    expect(await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    await prevButton.click();
    await utils.checkForErrors();

    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() - 1);
    await testDate.setHours(0);
    await testDate.setMinutes(0);
    await testDate.setSeconds(0);

    expect(await element(by.css('.calendar-monthview #calendar-id-month-view-datepicker')).getText()).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await prevButton.getText()).toEqual('Previous Month');
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('calendar-id-legend-dto')).getAttribute('id')).toEqual('calendar-id-legend-dto');
    expect(await element(by.id('calendar-id-legend-dto')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-legend-dto');
    expect(await element(by.css('#calendar-id-legend-dto + label')).getAttribute('for')).toEqual('calendar-id-legend-dto');

    expect(await element(by.id('calendar-id-legend-admin')).getAttribute('id')).toEqual('calendar-id-legend-admin');
    expect(await element(by.id('calendar-id-legend-admin')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-legend-admin');
    expect(await element(by.id('calendar-id-legend-team')).getAttribute('id')).toEqual('calendar-id-legend-team');
    expect(await element(by.id('calendar-id-legend-team')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-legend-team');
    expect(await element(by.id('calendar-id-legend-sick')).getAttribute('id')).toEqual('calendar-id-legend-sick');
    expect(await element(by.id('calendar-id-legend-sick')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-legend-sick');

    expect(await element(by.id('calendar-id-month-view-btn-prev')).getAttribute('id')).toEqual('calendar-id-month-view-btn-prev');
    expect(await element(by.id('calendar-id-month-view-btn-prev')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-month-view-btn-prev');
    expect(await element(by.id('calendar-id-month-view-btn-next')).getAttribute('id')).toEqual('calendar-id-month-view-btn-next');
    expect(await element(by.id('calendar-id-month-view-btn-next')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-month-view-btn-next');

    expect(await element(by.id('calendar-id-month-view-datepicker')).getAttribute('id')).toEqual('calendar-id-month-view-datepicker');
    expect(await element(by.id('calendar-id-month-view-datepicker')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-month-view-datepicker');

    expect(await element(by.id('calendar-id-month-view-datepicker-trigger')).getAttribute('id')).toEqual('calendar-id-month-view-datepicker-trigger');
    expect(await element(by.id('calendar-id-month-view-datepicker-trigger')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-month-view-datepicker-trigger');

    expect(await element(by.id('calendar-id-month-view-today')).getAttribute('id')).toEqual('calendar-id-month-view-today');
    expect(await element(by.id('calendar-id-month-view-today')).getAttribute('data-automation-id')).toEqual('calendar-automation-id-month-view-today');
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

    expect(await element.all(by.css('.monthview-table .calendar-event-more')).count()).toEqual(1);
    expect(await element.all(by.css('.monthview-table .calendar-event.azure')).count()).toEqual(3);
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
    expect(await element.all(by.css('.calendar-event.slate')).count()).toEqual(1);
    expect(await element.all(by.css('.calendar-event.emerald')).count()).toEqual(1);
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

  it('Should be able to cancel month selector', async () => {
    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('October 2018');

    await element(by.css('.calendar-monthview #monthview-datepicker-field + .trigger'));
    await element(by.css('button.is-cancel'));

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('October 2018');
  });

  it('Should be able to click on events', async () => {
    await element.all(by.css('.calendar-event-title')).first().click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#calendar-popup')), config.waitsFor));

    expect(await element(by.css('#calendar-popup')).isDisplayed()).toBe(true);
    await utils.checkForErrors();
  });

  it('Should render icons on events', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.calendar-event.azure.event-day-start .icon'))), config.waitsFor);

    expect(await element.all(by.css('.calendar-event.azure.event-day-start .icon')).count()).toEqual(1);
  });

  it('Should allow event to span days', async () => {
    expect(await element.all(by.css('.calendar-event.azure.event-day-start')).count()).toEqual(2);
    expect(await element.all(by.css('.calendar-event.azure.event-day-span')).count()).toEqual(9);
    expect(await element.all(by.css('.calendar-event.azure.event-day-end')).count()).toEqual(2);
  });

  it('Should show events on click', async () => {
    await element.all(by.cssContainingText('.monthview-table td', '1')).first().click();

    expect(await element(by.css('.calendar-event-details .accordion-header a')).getText()).toEqual('Team Event');
    expect(await element(by.css('.calendar-event-details .accordion-content')).getText()).toBeTruthy();
  });

  it('Should offer a right click menu', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await browser.actions().mouseMove(event).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('calendar-actions-menu'))), config.waitsFor);

    expect(await element(by.id('calendar-actions-menu')).getAttribute('class')).toContain('is-open');
    await element.all(by.css('#calendar-actions-menu a')).first().click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(16);
  });

  it('Should add new events on click and cancel', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await event.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.css('.calendar-popup .btn-close')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);
  });

  it('Should add new events on click and submit', async () => {
    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);

    const event = await element.all(by.cssContainingText('.monthview-table td', '1')).first();
    await event.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-popup'))), config.waitsFor);

    await element(by.id('subject')).sendKeys('New Event Name');
    await element(by.id('submit')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);
  });

  it('Should be able to add with the modal', async () => {
    await element.all(by.cssContainingText('.monthview-table td', '13')).first().click();
    await browser.actions()
      .doubleClick(await element.all(by.cssContainingText('.monthview-table td', '13')).first())
      .perform();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(17);

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('subject'))), config.waitsFor);
    await element(by.id('subject')).sendKeys('Test Event');
    await element(by.id('submit')).click();

    expect(await element.all(by.css('.calendar-event')).count()).toEqual(19);
  });

  it('Should update datepicker date', async () => {
    const nextButton = await element(by.css('.calendar-monthview button.next'));
    await nextButton.click();
    await nextButton.click();
    await nextButton.click();

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('January 2019');
    await element(by.css('.calendar-monthview #monthview-datepicker-field + .trigger')).click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.id('monthview-popup'))), config.waitsFor);

    expect(await element(by.css('#monthview-popup .month')).getText()).toEqual('January');
    expect(await element(by.css('#monthview-popup .year')).getText()).toEqual('2019');
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
});

describe('Calendar specific locale and language', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-lang');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('Mayo 2020');
    expect(await element(by.css('.calendar-event-types label:first-of-type')).getText()).toEqual('Tiempo libre opcional');
    expect(await element(by.css('.calendar-monthview thead th:first-child')).getText()).toEqual('Lun.');

    await utils.checkForErrors();
  });
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
});

describe('Calendar WeekView settings tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-weekview-settings?layout=nofrills');

    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(dateField), config.waitsFor);
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  it('Should switch to week', async () => {
    expect(await element(by.css('.week-view ')).isDisplayed()).toBe(false);
    const dropdownEl = await element.all(by.css('#month-calendar-view-changer + .dropdown-wrapper div.dropdown')).first();
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

describe('Calendar RTL tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-specific-month.html?locale=ar-SA&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .visibilityOf(await element(by.css('.monthview-table tr th:nth-child(7)'))), config.waitsFor);
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    expect(await element.all(by.css('.monthview-table .calendar-event')).count()).toEqual(2);
    await utils.checkForErrors();
  });

  it('Should be able to go to next and prev month', async () => {
    await element(by.css('.monthview-header .prev')).click();

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('ذو الحجة 1439');
    expect(await element.all(by.css('.monthview-table .calendar-event')).count()).toEqual(5);
    await element(by.css('.monthview-header .next')).click();
    await element(by.css('.monthview-header .next')).click();

    expect(await element(by.css('.calendar-monthview #monthview-datepicker-field')).getText()).toEqual('صفر 1440');
    expect(await element.all(by.css('.monthview-table .calendar-event')).count()).toEqual(21);
  });
});

describe('Calendar allow one pane tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-allow-single-pane');

    const pane = await element.all(by.css('.calendar-event-details .accordion-pane')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(pane), config.waitsFor);
  });

  it('Should only allow one pane open at a time', async () => {
    await utils.checkForErrors();

    expect(await element.all(by.css('.calendar-event-details .accordion-pane.is-expanded')).count()).toEqual(1);

    const buttonEl = await element(by.css('.calendar-event-details > div:nth-child(5) button'));
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.calendar-event-details > div:nth-child(6).is-expanded'))), config.waitsFor);
    await browser.driver.sleep(1000);

    expect(await element.all(by.css('.calendar-event-details .accordion-pane.is-expanded')).count()).toEqual(1);
  });
});

describe('Calendar overlapping events', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-overlaping-events');

    const pane = await element.all(by.css('.calendar-event-spacer')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(pane), config.waitsFor);
  });

  it('Should span overlaping events', async () => {
    await utils.checkForErrors();

    expect(await element.all(by.css('[data-key="20200611"] .calendar-event-spacer')).count()).toEqual(1);
    expect(await element.all(by.css('[data-key="20200613"] .calendar-event-spacer')).count()).toEqual(2);
    expect(await element.all(by.css('[data-key="20200615"] .calendar-event-spacer')).count()).toEqual(2);
    expect(await element.all(by.css('[data-key="20200617"] .calendar-event-spacer')).count()).toEqual(0);
  });
});

describe('Calendar Color Overrides tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/test-event-color-override');
    const dateField = await element(by.css('.calendar-monthview #monthview-datepicker-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateField), config.waitsFor);
  });

  it('Should override event colors correctly', async () => {
    expect(await element.all(by.css('.calendar-event')).get(0).getAttribute('class')).toEqual('calendar-event event-day-start-end has-tooltip');
    // expect(await element.all(by.css('.calendar-event')).get(0).getCssValue('background-color')).toEqual('rgba(173, 219, 235, 1)');
    // expect(await element.all(by.css('.calendar-event')).get(0).getCssValue('border-left-color')).toEqual('rgba(128, 206, 77, 1)');

    expect(await element.all(by.css('.calendar-event')).get(1).getAttribute('class')).toEqual('calendar-event event-day-start-end has-tooltip');
    expect(await element.all(by.css('.calendar-event')).get(1).getCssValue('background-color')).toEqual('rgba(246, 202, 202, 1)');
    expect(await element.all(by.css('.calendar-event')).get(1).getCssValue('border-left-color')).toEqual('rgba(232, 79, 79, 1)');
  });

  it('Should disable weekends', async () => {
    expect(await element.all(by.css('.monthview-table td.is-disabled')).count()).toEqual(12);
  });

  it('Should render day legend', async () => {
    expect(await element.all(by.css('.monthview-table td.is-colored')).count()).toEqual(4);
    expect(await element.all(by.css('.monthview-legend')).count()).toEqual(1);
    expect(await element.all(by.css('.monthview-legend-item')).get(0).getText()).toEqual('Public Holiday');
    expect(await element.all(by.css('.monthview-legend-item')).get(1).getText()).toEqual('Other');
  });
});
