const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Masthead tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/masthead/example-index?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-classic')).toEqual(0);
    });

    it('Should not visual regress on new theme', async () => {
      await utils.setPage('/components/masthead/example-index?theme=new&mode=dark&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-new')).toEqual(0);
    });

    it('Should not visual regress on classic theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-soho-images')).toEqual(0);
    });

    it('Should not visual regress on new theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=new&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-new-images')).toEqual(0);
    });
  }
});
