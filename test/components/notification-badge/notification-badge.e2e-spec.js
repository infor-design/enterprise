const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Notification Badge example-badge-placement tests', () => {
  beforeEach(async() => {
    await utils.setPage('/components/notification-badge/example-badge-placement?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));

      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'notification-badge-placement')).toEqual(0);
    });
  }
});
