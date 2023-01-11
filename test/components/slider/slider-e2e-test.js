const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Slider example-index tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-index?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('slider')).toEqual(0);
    });
  }

  it('should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('slider-id-1')).getAttribute('id')).toEqual('slider-id-1');
    expect(await element(by.id('slider-id-1')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1');

    expect(await element(by.id('slider-id-1-wrapper')).getAttribute('id')).toEqual('slider-id-1-wrapper');
    expect(await element(by.id('slider-id-1-wrapper')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-wrapper');

    expect(await element(by.id('slider-id-1-hitarea')).getAttribute('id')).toEqual('slider-id-1-hitarea');
    expect(await element(by.id('slider-id-1-hitarea')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-hitarea');

    expect(await element(by.id('slider-id-1-range')).getAttribute('id')).toEqual('slider-id-1-range');
    expect(await element(by.id('slider-id-1-range')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-range');

    expect(await element(by.id('slider-id-1-handle')).getAttribute('id')).toEqual('slider-id-1-handle');
    expect(await element(by.id('slider-id-1-handle')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-handle');

    expect(await element(by.id('slider-id-1-tick-1')).getAttribute('id')).toEqual('slider-id-1-tick-1');
    expect(await element(by.id('slider-id-1-tick-1')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-tick-1');

    expect(await element(by.id('slider-id-1-tick-2')).getAttribute('id')).toEqual('slider-id-1-tick-2');
    expect(await element(by.id('slider-id-1-tick-2')).getAttribute('data-automation-id')).toEqual('slider-automation-id-1-tick-2');
  });
});

describe('Slider Vertical tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/slider/example-vertical?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
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
    await utils.setPage('/components/slider/example-short?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
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
    await utils.setPage('/components/slider/example-tooltip-position?theme=classic');
  });

  it('should show the tooltip on top', async () => {
    const sliderEl = await element(by.className('slider-handle'));
    await sliderEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.tooltip.top.is-open'))), config.waitsFor);

    expect(await element(by.css('.tooltip.top.is-open')).isDisplayed()).toBeTruthy();
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const sliderEl = await element(by.className('slider-handle'));
      await sliderEl.click();

      const mainContent = await element(by.id('maincontent'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(mainContent, 'slider-tooltip-position-top')).toEqual(0);
    });
  }
});
