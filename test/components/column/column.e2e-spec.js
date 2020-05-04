const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Column empty tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column/test-empty');
    const emptyEl = await element(by.css('.empty-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emptyEl), config.waitsFor);
  });

  it('Should show the empty area', async () => {
    expect(await element(by.css('.empty-message'))).toBeTruthy();
    expect(await element(by.css('.empty-title')).getText()).toEqual('No Data Found');
  });
});

describe('Custom Tooltips page tests', () => {
  const tooltipContentSel = '#svg-tooltip .tooltip-content';

  beforeEach(async () => {
    await utils.setPage('/components/column/test-custom-tooltips.html');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.bar.series-6'))), config.waitsFor);
  });

  it('Should display custom tooltip when hovering to all column nodes default method', async () => {
    const tooltipText = 'Name: Other\nValue: 7';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-6')))
      .perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('Should display custom tooltip when hovering to specific column node as string', async () => {
    const tooltipText = 'Info: Extra Info about New Automotive\nName: Auto\nValue: 7';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-0')))
      .perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('Should display custom tooltip when hovering to specific column node as method', async () => {
    const tooltipText = 'Name: Distribution\nShort Name: Dist\nValue: 10';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-1')))
      .perform();
    await browser.driver.sleep(config.sleepShort);

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('Should not display tooltip when hovering to specific column node', async () => {
    await browser.driver.sleep(config.sleep);
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-2')))
      .perform();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css(tooltipContentSel)).isDisplayed()).toBe(false);
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-4')))
      .perform();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css(tooltipContentSel)).isDisplayed()).toBe(true);
  });
});

describe('Column Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column/example-index?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-index')).toEqual(0);
    });
  }
});

describe('Column Chart balance tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column/example-balance?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-balance')).toEqual(0);
    });
  }
});

describe('Grouped Column Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column-grouped/example-index?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-grouped')).toEqual(0);
    });
  }
});

describe('Stacked Column Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column-stacked/example-index?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-stacked')).toEqual(0);
    });
  }
});
