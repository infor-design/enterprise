const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('About Visual Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/about/example-index?theme=new&layout=nofrills');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const buttonEl = await element(by.id('about-trigger'));
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);

      const containerEl = await element(by.className('no-frills'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'about-index')).toEqual(0);
    });
  }
});
