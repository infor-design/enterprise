const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index');
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
    await utils.setPage('/components/calendar/example-ajax-events');
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
