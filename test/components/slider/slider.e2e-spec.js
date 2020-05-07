const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Slider example-index tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('slider')).toEqual(0);
    });
  }
});

describe('Slider Vertical tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-vertical?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('slider-vertical')).toEqual(0);
    });
  }
});

describe('Slider short tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-short?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('slider-short')).toEqual(0);
    });
  }
});

describe('Slider tooltip position test', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-tooltip-position');
  });

  it('Should show the tooltip on top', async () => {
    const sliderEl = await element(by.className('slider-handle'));
    await sliderEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.tooltip.top.is-open'))), config.waitsFor);

    expect(await element(by.css('.tooltip.top.is-open')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const sliderEl = await element(by.className('slider-handle'));
      await sliderEl.click();

      const mainContent = await element(by.id('maincontent'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(mainContent, 'slider-tooltip-position-top')).toEqual(0);
    });
  }
});
