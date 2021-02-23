const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('ColorPicker tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colors/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1100, 1100);
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'colors')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Color New Theme tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colors/example-index?theme=new&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1100, 1100);
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'colors-new')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});
