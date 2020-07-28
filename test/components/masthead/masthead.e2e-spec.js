const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Masthead tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/masthead/example-index?theme=soho&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isIE()) {
    it('Should be accessible with no WCAG 2AA violations', async () => {
      await browser.driver.sleep(config.sleep);
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on soho theme', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-soho')).toEqual(0);
    });

    it('Should not visual regress on uplift theme', async () => {
      await utils.setPage('/components/masthead/example-index?theme=uplift&variant=dark&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-uplift')).toEqual(0);
    });

    it('Should not visual regress on soho theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=soho&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-soho-images')).toEqual(0);
    });

    it('Should not visual regress on uplift theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=uplift&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-uplift-images')).toEqual(0);
    });
  }
});
