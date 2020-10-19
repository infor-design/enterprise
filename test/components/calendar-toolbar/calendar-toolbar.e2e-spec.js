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

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('calendar-toolbar-id-month-view-btn-prev')).getAttribute('id')).toEqual('calendar-toolbar-id-month-view-btn-prev');
    expect(await element(by.id('calendar-toolbar-id-month-view-btn-prev')).getAttribute('data-automation-id')).toEqual('calendar-toolbar-automation-id-month-view-btn-prev');
    expect(await element(by.id('calendar-toolbar-id-month-view-btn-next')).getAttribute('id')).toEqual('calendar-toolbar-id-month-view-btn-next');
    expect(await element(by.id('calendar-toolbar-id-month-view-btn-next')).getAttribute('data-automation-id')).toEqual('calendar-toolbar-automation-id-month-view-btn-next');

    expect(await element(by.id('calendar-toolbar-id-month-view-datepicker')).getAttribute('id')).toEqual('calendar-toolbar-id-month-view-datepicker');
    expect(await element(by.id('calendar-toolbar-id-month-view-datepicker')).getAttribute('data-automation-id')).toEqual('calendar-toolbar-automation-id-month-view-datepicker');

    expect(await element(by.id('calendar-toolbar-id-month-view-datepicker-trigger')).getAttribute('id')).toEqual('calendar-toolbar-id-month-view-datepicker-trigger');
    expect(await element(by.id('calendar-toolbar-id-month-view-datepicker-trigger')).getAttribute('data-automation-id')).toEqual('calendar-toolbar-automation-id-month-view-datepicker-trigger');

    expect(await element(by.id('calendar-toolbar-id-month-view-today')).getAttribute('id')).toEqual('calendar-toolbar-id-month-view-today');
    expect(await element(by.id('calendar-toolbar-id-month-view-today')).getAttribute('data-automation-id')).toEqual('calendar-toolbar-automation-id-month-view-today');
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
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'calendar-toolbar-visuals')).toEqual(0);
    });
  }
});
