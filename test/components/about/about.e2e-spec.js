const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('About index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/about/example-index');
  });

  it('Should show the about dialog', async () => {
    const buttonEl = await element(by.id('about-trigger'));
    await buttonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);

    expect(await element(by.id('about-modal')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const button = await element(by.id('about-trigger'));
      await button.click();

      const searchfieldSection = await element(by.id('maincontent'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(searchfieldSection, 'about-open')).toEqual(0);
    });
  }

  it('should destroy and reinvoke properly', async () => {
    // Open the About dialog
    await element(by.id('about-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);

    expect(await element(by.id('about-modal')).isDisplayed()).toBeTruthy();

    // Press the ESCAPE key to close the About Dialog (via modal manager)
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('about-modal'))), config.waitsFor);

    // Reopen the About Dialog (creates a new instance)
    await element(by.id('about-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);

    expect(await element(by.id('about-modal')).isDisplayed()).toBeTruthy();
  });
});

describe('About translation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/about/example-index?locale=uk-UA');
  });

  it('Should show the about dialog in ukranian', async () => {
    const buttonEl = await element(by.id('about-trigger'));
    await buttonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);

    const ukText = `Авторські права © Infor, ${new Date().getFullYear()}. Усі права збережено. Усі зазначені у цьому документі назви та дизайн елементів є товарними знаками або захищеними товарними знаками Infor та/або афілійованих організацій і філіалів Infor. Усі права збережено. Усі інші товарні знаки, перелічені тут, є власністю відповідних власників. www.infor.com.`;

    expect(await element(by.css('.additional-content + p')).getText()).toEqual(ukText);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('About Event tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/about/test-close-event-index');
  });

  it('Should fire the close event', async () => {
    await element(by.id('about-trigger')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('about-modal'))), config.waitsFor);
    await element(by.css('.close-container button')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#toast-container .toast-title')).getText()).toEqual('Close Event Triggered');
    await utils.checkForErrors();
  });
});
