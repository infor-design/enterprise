const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Line Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/line/example-index?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'line')).toEqual(0);
    });
  }

  it('should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('line-a-jan-dot')).getAttribute('id')).toEqual('line-a-jan-dot');
    expect(await element(by.id('line-a-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-jan-dot');
    expect(await element(by.id('line-a-feb-dot')).getAttribute('id')).toEqual('line-a-feb-dot');
    expect(await element(by.id('line-a-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-feb-dot');
    expect(await element(by.id('line-a-mar-dot')).getAttribute('id')).toEqual('line-a-mar-dot');
    expect(await element(by.id('line-a-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-mar-dot');
    expect(await element(by.id('line-a-apr-dot')).getAttribute('id')).toEqual('line-a-apr-dot');
    expect(await element(by.id('line-a-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-apr-dot');
    expect(await element(by.id('line-a-may-dot')).getAttribute('id')).toEqual('line-a-may-dot');
    expect(await element(by.id('line-a-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-may-dot');
    expect(await element(by.id('line-a-jun-dot')).getAttribute('id')).toEqual('line-a-jun-dot');
    expect(await element(by.id('line-a-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-a-jun-dot');

    expect(await element(by.id('line-b-jan-dot')).getAttribute('id')).toEqual('line-b-jan-dot');
    expect(await element(by.id('line-b-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-jan-dot');
    expect(await element(by.id('line-b-feb-dot')).getAttribute('id')).toEqual('line-b-feb-dot');
    expect(await element(by.id('line-b-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-feb-dot');
    expect(await element(by.id('line-b-mar-dot')).getAttribute('id')).toEqual('line-b-mar-dot');
    expect(await element(by.id('line-b-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-mar-dot');
    expect(await element(by.id('line-b-apr-dot')).getAttribute('id')).toEqual('line-b-apr-dot');
    expect(await element(by.id('line-b-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-apr-dot');
    expect(await element(by.id('line-b-may-dot')).getAttribute('id')).toEqual('line-b-may-dot');
    expect(await element(by.id('line-b-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-may-dot');
    expect(await element(by.id('line-b-jun-dot')).getAttribute('id')).toEqual('line-b-jun-dot');
    expect(await element(by.id('line-b-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-b-jun-dot');

    expect(await element(by.id('line-c-jan-dot')).getAttribute('id')).toEqual('line-c-jan-dot');
    expect(await element(by.id('line-c-jan-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-jan-dot');
    expect(await element(by.id('line-c-feb-dot')).getAttribute('id')).toEqual('line-c-feb-dot');
    expect(await element(by.id('line-c-feb-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-feb-dot');
    expect(await element(by.id('line-c-mar-dot')).getAttribute('id')).toEqual('line-c-mar-dot');
    expect(await element(by.id('line-c-mar-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-mar-dot');
    expect(await element(by.id('line-c-apr-dot')).getAttribute('id')).toEqual('line-c-apr-dot');
    expect(await element(by.id('line-c-apr-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-apr-dot');
    expect(await element(by.id('line-c-may-dot')).getAttribute('id')).toEqual('line-c-may-dot');
    expect(await element(by.id('line-c-may-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-may-dot');
    expect(await element(by.id('line-c-jun-dot')).getAttribute('id')).toEqual('line-c-jun-dot');
    expect(await element(by.id('line-c-jun-dot')).getAttribute('data-automation-id')).toEqual('automation-id-line-c-jun-dot');

    expect(await element(by.id('line-comp-a-line')).getAttribute('id')).toEqual('line-comp-a-line');
    expect(await element(by.id('line-comp-a-line')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-a-line');
    expect(await element(by.id('line-comp-b-line')).getAttribute('id')).toEqual('line-comp-b-line');
    expect(await element(by.id('line-comp-b-line')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-b-line');
    expect(await element(by.id('line-comp-c-line')).getAttribute('id')).toEqual('line-comp-c-line');
    expect(await element(by.id('line-comp-c-line')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-c-line');

    expect(await element(by.id('line-comp-a-legend-0')).getAttribute('id')).toEqual('line-comp-a-legend-0');
    expect(await element(by.id('line-comp-a-legend-0')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-a-legend-0');
    expect(await element(by.id('line-comp-b-legend-1')).getAttribute('id')).toEqual('line-comp-b-legend-1');
    expect(await element(by.id('line-comp-b-legend-1')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-b-legend-1');
    expect(await element(by.id('line-comp-c-legend-2')).getAttribute('id')).toEqual('line-comp-c-legend-2');
    expect(await element(by.id('line-comp-c-legend-2')).getAttribute('data-automation-id')).toEqual('automation-id-line-comp-c-legend-2');
  });
});

describe('Line Localization tests', () => {
  it('should Localize Numbers - en-US', async () => {
    await utils.setPage('/components/line/example-localize.html');
    await utils.checkForErrors();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.y .tick text')).get(0).getText()).toEqual('0');
    expect(await element.all(by.css('.y .tick text')).get(1).getText()).toEqual('5,000');
    expect(await element.all(by.css('.y .tick text')).get(2).getText()).toEqual('10,000');
  });

  it('should Localize Numbers - de-DE', async () => {
    await utils.setPage('/components/line/example-localize.html?locale=de-DE');
    await utils.checkForErrors();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.y .tick text')).get(0).getText()).toEqual('0');
    expect(await element.all(by.css('.y .tick text')).get(1).getText()).toEqual('5.000');
    expect(await element.all(by.css('.y .tick text')).get(2).getText()).toEqual('10.000');
  });
});

describe('Line Chart Zero Millions tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/line/example-zero-millions?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'line-millions')).toEqual(0);
    });
  }
});

describe('Line Chart Two Line tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/line/example-two-lines.html?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'line-twoline')).toEqual(0);
    });
  }
});

describe('Line Chart Axis Label tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/line/example-axis-labels.html?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'line-axis-labels')).toEqual(0);
    });
  }
});

describe('Line Chart Axis Rotate tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/line/example-rotate.html?theme=classic&layout=nofrills');
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

      expect(await browser.imageComparison.checkElement(containerEl, 'line-rotate')).toEqual(0);
    });
  }
});
