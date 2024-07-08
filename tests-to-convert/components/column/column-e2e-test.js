const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Column empty tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column/test-empty');
    const emptyEl = await element(by.css('.empty-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emptyEl), config.waitsFor);
  });

  it('should show the empty area', async () => {
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

  it('should display custom tooltip when hovering to all column nodes default method', async () => {
    const tooltipText = 'Name: Other\nValue: 7';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-6')))
      .perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('should display custom tooltip when hovering to specific column node as string', async () => {
    const tooltipText = 'Info: Extra Info about New Automotive\nName: Auto\nValue: 7';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-0')))
      .perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('should display custom tooltip when hovering to specific column node as method', async () => {
    const tooltipText = 'Name: Distribution\nShort Name: Dist\nValue: 10';
    await browser.actions()
      .mouseMove(await element(by.css('.bar.series-1')))
      .perform();
    await browser.driver.sleep(config.sleepShort);

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('should not display tooltip when hovering to specific column node', async () => {
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
    await utils.setPage('/components/column/example-index?theme=classic');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('column-auto-bar')).getAttribute('id')).toEqual('column-auto-bar');
    expect(await element(by.id('column-auto-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-auto-bar');

    expect(await element(by.id('column-dist-bar')).getAttribute('id')).toEqual('column-dist-bar');
    expect(await element(by.id('column-dist-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-dist-bar');

    expect(await element(by.id('column-equip-bar')).getAttribute('id')).toEqual('column-equip-bar');
    expect(await element(by.id('column-equip-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-equip-bar');

    expect(await element(by.id('column-fash-bar')).getAttribute('id')).toEqual('column-fash-bar');
    expect(await element(by.id('column-fash-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-fash-bar');

    expect(await element(by.id('column-food-bar')).getAttribute('id')).toEqual('column-food-bar');
    expect(await element(by.id('column-food-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-food-bar');

    expect(await element(by.id('column-health-bar')).getAttribute('id')).toEqual('column-health-bar');
    expect(await element(by.id('column-health-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-health-bar');

    expect(await element(by.id('column-other-bar')).getAttribute('id')).toEqual('column-other-bar');
    expect(await element(by.id('column-other-bar')).getAttribute('data-automation-id')).toEqual('automation-id-column-other-bar');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('widget'));
      await browser.driver.sleep(config.sleepLonger);

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-index')).toEqual(0);
    });
  }
});

describe('Column Chart balance tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/column/example-balance?theme=classic');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('widget'));
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
    await utils.setPage('/components/column-grouped/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
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
    await utils.setPage('/components/column-stacked/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'column-stacked')).toEqual(0);
    });
  }
});
