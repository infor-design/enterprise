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

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css(tooltipContentSel))), config.waitsFor); // eslint-disable-line

    expect(await element(by.css(tooltipContentSel)).getText()).toEqual(tooltipText);
  });

  it('Should not display tooltip when hovering to specific column node', async () => {
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
