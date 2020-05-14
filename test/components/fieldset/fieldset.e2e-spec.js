const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Fieldset Tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on index', async () => {
      await utils.setPage('/components/fieldset/example-index.html?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'fieldset-index')).toEqual(0);
    });

    it('Should not visual regress on short layouts', async () => {
      await utils.setPage('/components/fieldset/example-short.html?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'fieldset-short-layout')).toEqual(0);
    });
  }
});
