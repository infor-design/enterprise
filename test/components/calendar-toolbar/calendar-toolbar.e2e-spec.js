const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Calendar Toolbar index tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/example-index?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element.all(by.className('calendar-toolbar')).first();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar')).toEqual(0);
    });
  }
});

describe('Calendar Toolbar Datepicker tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-datepicker?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element.all(by.className('calendar-toolbar')).first();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar-datepicker')).toEqual(0);
    });
  }
});
