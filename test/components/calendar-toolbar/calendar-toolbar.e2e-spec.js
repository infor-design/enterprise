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

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar-toolbar'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar')).toEqual(0);
    });

    it('Should not visual regress in RTL', async () => {
      await utils.setPage('/components/calendar-toolbar/example-index?layout=nofrills&locale=ar-SA');
      const calendarEl = await element(by.className('calendar-toolbar'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar-rtl')).toEqual(0);
    });
  }
});

describe('Calendar Toolbar Datepicker tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-datepicker?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const calendarEl = await element(by.className('calendar-toolbar'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar-datepicker')).toEqual(0);
    });

    it('Should not visual regress in RTL', async () => {
      await utils.setPage('/components/calendar-toolbar/example-index?layout=nofrills&locale=ar-SA');
      const calendarEl = await element(by.className('calendar-toolbar'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(calendarEl, 'calendar-toolbar-datepicker-rtl')).toEqual(0);
    });
  }
});
