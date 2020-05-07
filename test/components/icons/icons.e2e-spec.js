const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Icon Soho (Subtle) tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/icons/example-index?layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without any error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on soho (subtle)', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'icons-subtle')).toEqual(0);
    });
  }
});

describe('Icon Uplift (Vibrant)  tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/icons/example-index?theme=uplift&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on uplift (vibrant)', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'icons-vibrant')).toEqual(0);
    });
  }
});
