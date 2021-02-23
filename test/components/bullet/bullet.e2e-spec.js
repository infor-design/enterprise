const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bullet example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bullet .range'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id single', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('bullet-example1-title')).getAttribute('id')).toEqual('bullet-example1-title');
    expect(await element(by.id('bullet-example1-title')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-title');

    expect(await element(by.id('bullet-example1-subtitle')).getAttribute('id')).toEqual('bullet-example1-subtitle');
    expect(await element(by.id('bullet-example1-subtitle')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-subtitle');

    expect(await element(by.id('bullet-example1-difference')).getAttribute('id')).toEqual('bullet-example1-difference');
    expect(await element(by.id('bullet-example1-difference')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-difference');

    expect(await element(by.id('bullet-example1-marker')).getAttribute('id')).toEqual('bullet-example1-marker');
    expect(await element(by.id('bullet-example1-marker')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-marker');

    expect(await element(by.id('bullet-example1-measure0')).getAttribute('id')).toEqual('bullet-example1-measure0');
    expect(await element(by.id('bullet-example1-measure0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-measure0');
    expect(await element(by.id('bullet-example1-measure1')).getAttribute('id')).toEqual('bullet-example1-measure1');
    expect(await element(by.id('bullet-example1-measure1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-measure1');

    expect(await element(by.id('bullet-example1-range0')).getAttribute('id')).toEqual('bullet-example1-range0');
    expect(await element(by.id('bullet-example1-range0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-range0');
    expect(await element(by.id('bullet-example1-range1')).getAttribute('id')).toEqual('bullet-example1-range1');
    expect(await element(by.id('bullet-example1-range1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-range1');
    expect(await element(by.id('bullet-example1-range2')).getAttribute('id')).toEqual('bullet-example1-range2');
    expect(await element(by.id('bullet-example1-range2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-range2');
    expect(await element(by.id('bullet-example1-range3')).getAttribute('id')).toEqual('bullet-example1-range3');
    expect(await element(by.id('bullet-example1-range3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-range3');
    expect(await element(by.id('bullet-example1-range4')).getAttribute('id')).toEqual('bullet-example1-range4');
    expect(await element(by.id('bullet-example1-range4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-example1-range4');
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
    await utils.setPage('/components/bullet/example-data-group?theme=classic&layout=nofrills');
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

describe('Bullet data group automation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/test-data-group-automation?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id grouped', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('bullet-group-example1-title-group0')).getAttribute('id')).toEqual('bullet-group-example1-title-group0');
    expect(await element(by.id('bullet-group-example1-title-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-title-group0');
    expect(await element(by.id('bullet-group-example1-title-group1')).getAttribute('id')).toEqual('bullet-group-example1-title-group1');
    expect(await element(by.id('bullet-group-example1-title-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-title-group1');
    expect(await element(by.id('bullet-group-example1-title-group2')).getAttribute('id')).toEqual('bullet-group-example1-title-group2');
    expect(await element(by.id('bullet-group-example1-title-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-title-group2');
    expect(await element(by.id('bullet-group-example1-title-group3')).getAttribute('id')).toEqual('bullet-group-example1-title-group3');
    expect(await element(by.id('bullet-group-example1-title-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-title-group3');
    expect(await element(by.id('bullet-group-example1-title-group4')).getAttribute('id')).toEqual('bullet-group-example1-title-group4');
    expect(await element(by.id('bullet-group-example1-title-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-title-group4');

    expect(await element(by.id('bullet-group-example1-subtitle-group0')).getAttribute('id')).toEqual('bullet-group-example1-subtitle-group0');
    expect(await element(by.id('bullet-group-example1-subtitle-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-subtitle-group0');
    expect(await element(by.id('bullet-group-example1-subtitle-group1')).getAttribute('id')).toEqual('bullet-group-example1-subtitle-group1');
    expect(await element(by.id('bullet-group-example1-subtitle-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-subtitle-group1');
    expect(await element(by.id('bullet-group-example1-subtitle-group2')).getAttribute('id')).toEqual('bullet-group-example1-subtitle-group2');
    expect(await element(by.id('bullet-group-example1-subtitle-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-subtitle-group2');
    expect(await element(by.id('bullet-group-example1-subtitle-group3')).getAttribute('id')).toEqual('bullet-group-example1-subtitle-group3');
    expect(await element(by.id('bullet-group-example1-subtitle-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-subtitle-group3');
    expect(await element(by.id('bullet-group-example1-subtitle-group4')).getAttribute('id')).toEqual('bullet-group-example1-subtitle-group4');
    expect(await element(by.id('bullet-group-example1-subtitle-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-subtitle-group4');

    expect(await element(by.id('bullet-group-example1-difference-group0')).getAttribute('id')).toEqual('bullet-group-example1-difference-group0');
    expect(await element(by.id('bullet-group-example1-difference-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-difference-group0');
    expect(await element(by.id('bullet-group-example1-difference-group1')).getAttribute('id')).toEqual('bullet-group-example1-difference-group1');
    expect(await element(by.id('bullet-group-example1-difference-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-difference-group1');
    expect(await element(by.id('bullet-group-example1-difference-group2')).getAttribute('id')).toEqual('bullet-group-example1-difference-group2');
    expect(await element(by.id('bullet-group-example1-difference-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-difference-group2');
    expect(await element(by.id('bullet-group-example1-difference-group3')).getAttribute('id')).toEqual('bullet-group-example1-difference-group3');
    expect(await element(by.id('bullet-group-example1-difference-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-difference-group3');
    expect(await element(by.id('bullet-group-example1-difference-group4')).getAttribute('id')).toEqual('bullet-group-example1-difference-group4');
    expect(await element(by.id('bullet-group-example1-difference-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-difference-group4');

    expect(await element(by.id('bullet-group-example1-marker-group0')).getAttribute('id')).toEqual('bullet-group-example1-marker-group0');
    expect(await element(by.id('bullet-group-example1-marker-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-marker-group0');
    expect(await element(by.id('bullet-group-example1-marker-group1')).getAttribute('id')).toEqual('bullet-group-example1-marker-group1');
    expect(await element(by.id('bullet-group-example1-marker-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-marker-group1');
    expect(await element(by.id('bullet-group-example1-marker-group2')).getAttribute('id')).toEqual('bullet-group-example1-marker-group2');
    expect(await element(by.id('bullet-group-example1-marker-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-marker-group2');
    expect(await element(by.id('bullet-group-example1-marker-group3')).getAttribute('id')).toEqual('bullet-group-example1-marker-group3');
    expect(await element(by.id('bullet-group-example1-marker-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-marker-group3');
    expect(await element(by.id('bullet-group-example1-marker-group4')).getAttribute('id')).toEqual('bullet-group-example1-marker-group4');
    expect(await element(by.id('bullet-group-example1-marker-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-marker-group4');

    expect(await element(by.id('bullet-group-example1-measure0-group0')).getAttribute('id')).toEqual('bullet-group-example1-measure0-group0');
    expect(await element(by.id('bullet-group-example1-measure0-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure0-group0');
    expect(await element(by.id('bullet-group-example1-measure1-group0')).getAttribute('id')).toEqual('bullet-group-example1-measure1-group0');
    expect(await element(by.id('bullet-group-example1-measure1-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure1-group0');
    expect(await element(by.id('bullet-group-example1-measure0-group1')).getAttribute('id')).toEqual('bullet-group-example1-measure0-group1');
    expect(await element(by.id('bullet-group-example1-measure0-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure0-group1');
    expect(await element(by.id('bullet-group-example1-measure1-group1')).getAttribute('id')).toEqual('bullet-group-example1-measure1-group1');
    expect(await element(by.id('bullet-group-example1-measure1-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure1-group1');
    expect(await element(by.id('bullet-group-example1-measure0-group2')).getAttribute('id')).toEqual('bullet-group-example1-measure0-group2');
    expect(await element(by.id('bullet-group-example1-measure0-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure0-group2');
    expect(await element(by.id('bullet-group-example1-measure1-group2')).getAttribute('id')).toEqual('bullet-group-example1-measure1-group2');
    expect(await element(by.id('bullet-group-example1-measure1-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure1-group2');
    expect(await element(by.id('bullet-group-example1-measure0-group3')).getAttribute('id')).toEqual('bullet-group-example1-measure0-group3');
    expect(await element(by.id('bullet-group-example1-measure0-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure0-group3');
    expect(await element(by.id('bullet-group-example1-measure1-group3')).getAttribute('id')).toEqual('bullet-group-example1-measure1-group3');
    expect(await element(by.id('bullet-group-example1-measure1-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure1-group3');
    expect(await element(by.id('bullet-group-example1-measure0-group4')).getAttribute('id')).toEqual('bullet-group-example1-measure0-group4');
    expect(await element(by.id('bullet-group-example1-measure0-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure0-group4');
    expect(await element(by.id('bullet-group-example1-measure1-group4')).getAttribute('id')).toEqual('bullet-group-example1-measure1-group4');
    expect(await element(by.id('bullet-group-example1-measure1-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-measure1-group4');

    expect(await element(by.id('bullet-group-example1-range0-group0')).getAttribute('id')).toEqual('bullet-group-example1-range0-group0');
    expect(await element(by.id('bullet-group-example1-range0-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range0-group0');
    expect(await element(by.id('bullet-group-example1-range1-group0')).getAttribute('id')).toEqual('bullet-group-example1-range1-group0');
    expect(await element(by.id('bullet-group-example1-range1-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range1-group0');
    expect(await element(by.id('bullet-group-example1-range2-group0')).getAttribute('id')).toEqual('bullet-group-example1-range2-group0');
    expect(await element(by.id('bullet-group-example1-range2-group0')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range2-group0');
    expect(await element(by.id('bullet-group-example1-range0-group1')).getAttribute('id')).toEqual('bullet-group-example1-range0-group1');
    expect(await element(by.id('bullet-group-example1-range0-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range0-group1');
    expect(await element(by.id('bullet-group-example1-range1-group1')).getAttribute('id')).toEqual('bullet-group-example1-range1-group1');
    expect(await element(by.id('bullet-group-example1-range1-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range1-group1');
    expect(await element(by.id('bullet-group-example1-range2-group1')).getAttribute('id')).toEqual('bullet-group-example1-range2-group1');
    expect(await element(by.id('bullet-group-example1-range2-group1')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range2-group1');
    expect(await element(by.id('bullet-group-example1-range0-group2')).getAttribute('id')).toEqual('bullet-group-example1-range0-group2');
    expect(await element(by.id('bullet-group-example1-range0-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range0-group2');
    expect(await element(by.id('bullet-group-example1-range1-group2')).getAttribute('id')).toEqual('bullet-group-example1-range1-group2');
    expect(await element(by.id('bullet-group-example1-range1-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range1-group2');
    expect(await element(by.id('bullet-group-example1-range2-group2')).getAttribute('id')).toEqual('bullet-group-example1-range2-group2');
    expect(await element(by.id('bullet-group-example1-range2-group2')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range2-group2');
    expect(await element(by.id('bullet-group-example1-range0-group3')).getAttribute('id')).toEqual('bullet-group-example1-range0-group3');
    expect(await element(by.id('bullet-group-example1-range0-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range0-group3');
    expect(await element(by.id('bullet-group-example1-range1-group3')).getAttribute('id')).toEqual('bullet-group-example1-range1-group3');
    expect(await element(by.id('bullet-group-example1-range1-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range1-group3');
    expect(await element(by.id('bullet-group-example1-range2-group3')).getAttribute('id')).toEqual('bullet-group-example1-range2-group3');
    expect(await element(by.id('bullet-group-example1-range2-group3')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range2-group3');
    expect(await element(by.id('bullet-group-example1-range0-group4')).getAttribute('id')).toEqual('bullet-group-example1-range0-group4');
    expect(await element(by.id('bullet-group-example1-range0-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range0-group4');
    expect(await element(by.id('bullet-group-example1-range1-group4')).getAttribute('id')).toEqual('bullet-group-example1-range1-group4');
    expect(await element(by.id('bullet-group-example1-range1-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range1-group4');
    expect(await element(by.id('bullet-group-example1-range2-group4')).getAttribute('id')).toEqual('bullet-group-example1-range2-group4');
    expect(await element(by.id('bullet-group-example1-range2-group4')).getAttribute('data-automation-id')).toEqual('automation-id-bullet-group-example1-range2-group4');
  });
});

describe('Bullet negative positive tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bullet/test-negative-positive-value?theme=classic&layout=nofrills');
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
    await utils.setPage('/components/bullet/test-negative-value?theme=classic&layout=nofrills');
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
