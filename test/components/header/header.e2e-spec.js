const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Header Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/header/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display header text', async () => {
    expect(await element(by.css('.title')).getText()).toEqual('Page Title');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'header-index')).toEqual(0);
    });
  }
});

describe('Header toolbar categories tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/header/example-toolbar-flex-with-categories.html?theme=classic&mode=light&layout=nofrills');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const searchCategories = await element(by.className('search-categories'));
      const searchfieldInput = await element(by.className('searchfield'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(searchCategories), config.waitsFor);

      await searchfieldInput.clear();
      await searchfieldInput.sendKeys('ea');
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(searchCategories, 'close-icon-in-classic')).toEqual(0);
    });
  }
});
