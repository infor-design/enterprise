const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Homepage example hero widget tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-hero-widget.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('body'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('homepage-hero-widget')).toEqual(0);
    });
  }
});

describe('Homepage example editable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/homepage/example-editable.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('body'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      browser.actions().mouseMove(element(by.css('.widget'))).perform();

      expect(await browser.imageComparison.checkScreen('homepage-editable')).toEqual(0);
    });
  }
});
