const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Personalization tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/test-state');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should maintain chosen theme after reinitialization', async () => {
    const pageChangerButtonEl = await element.all(by.css('.page-changer'));
    const themeChoices = await element.all(by.css('.popupmenu li.is-selectable a[data-theme]'));
    const arrayLength = await themeChoices.length;
    const randomIndex = await Math.floor(Math.random() * arrayLength);
    const reinitButton = await element(by.id('reinitialize'));

    await pageChangerButtonEl[0].click();
    await themeChoices[randomIndex].click();

    const chosenTheme = await element.all(by.css('.popupmenu li.is-checked a[data-theme]')).getAttribute('data-theme');

    expect(await element.all(by.css('html')).get(0).getAttribute('class')).toContain(chosenTheme[0]);
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('.personalize-overlay'))), config.waitsFor);

    await reinitButton.click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('html')).get(0).getAttribute('class')).toContain(chosenTheme[0]);
  });

  it('Should maintain chosen colors after reinitialization', async () => {
    const reinitButton = await element(by.id('reinitialize'));

    await element(by.css('.page-changer')).click();
    await await element.all(by.css('.popupmenu li.is-selectable a[data-rgbcolor]')).get(4).click();
    await browser.driver.sleep(config.sleep);

    const beforeInitSheet = await element(by.id('soho-personalization')).getText();
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('.personalize-overlay'))), config.waitsFor);

    await reinitButton.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('soho-personalization')).getText()).toEqual(beforeInitSheet);
  });
});

describe('Personalization example-tabs tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-tabs.html?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkScreen('personalize-tabs')).toEqual(0);
    });
  }
});

describe('Personalization form tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-form2.html?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkScreen('personalize-form-tabs')).toEqual(0);
    });
  }
});

describe('Personalization alternae form tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-form3.html?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkScreen('personalize-form-alt-tabs')).toEqual(0);
    });
  }
});
