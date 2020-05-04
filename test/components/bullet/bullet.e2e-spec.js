const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bullet example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/example-index?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bullet .range'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('bullet')).toEqual(0);
    });
  }
});

describe('Bullet data group tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/example-data-group?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('bullet-data-group')).toEqual(0);
    });
  }
});

describe('Bullet negative positive tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/test-negative-positive-value?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('bullet-negative-positive')).toEqual(0);
    });
  }
});

describe('Bullet negative values tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/test-negative-value?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('bullet-negative-value')).toEqual(0);
    });
  }
});
