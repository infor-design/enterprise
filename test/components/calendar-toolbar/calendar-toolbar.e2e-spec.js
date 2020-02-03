const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar Toolbar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/example-index?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});

describe('Calendar Toolbar Datepicker tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-datepicker?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});

describe('Calendar Toolbar visual tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-visuals?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element.all(by.className('calendar-toolbar')).first();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar-visuals')).toEqual(0);
    });
  }
});
