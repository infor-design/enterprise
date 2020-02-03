const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Calendar Toolbar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/example-index?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});

fdescribe('Calendar Toolbar Datepicker tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-datepicker?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});

fdescribe('Calendar Toolbar visual tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar-toolbar/test-visuals?layout=nofrills');
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});
