const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Hyperlink index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hyperlinks/example-index?layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without any error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'hyperlinks-index')).toEqual(0);
    });
  }
});
