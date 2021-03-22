const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bar Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.bar.series-1'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have names for the graphs', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.axis.y .tick text'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.axis.y .tick text')).count()).toBe(3);
  });

  it('Should have greyed out bars when not selected', async () => {
    const barEl = await element(by.css('.bar.series-0'));
    const barTestEl = await element(by.css('.bar.series-1'));

    await barEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.is-selected'))), config.waitsFor);

    expect(await barEl.getAttribute('class')).toContain('is-selected');
    expect(await barTestEl.getCssValue('opacity')).toBe('0.6');
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('bar-a-bar')).getAttribute('id')).toEqual('bar-a-bar');
    expect(await element(by.id('bar-a-bar')).getAttribute('data-automation-id')).toEqual('automation-id-bar-a-bar');

    expect(await element(by.id('bar-b-bar')).getAttribute('id')).toEqual('bar-b-bar');
    expect(await element(by.id('bar-b-bar')).getAttribute('data-automation-id')).toEqual('automation-id-bar-b-bar');

    expect(await element(by.id('bar-c-bar')).getAttribute('id')).toEqual('bar-c-bar');
    expect(await element(by.id('bar-c-bar')).getAttribute('data-automation-id')).toEqual('automation-id-bar-c-bar');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-index')).toEqual(0);
    });
  }
});

describe('Bar Chart example-selected tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/test-selected');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.is-selected'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have greyed out bars when not selected', async () => {
    const notSelectedBarEl = await element(by.css('.bar.series-1'));

    expect(await notSelectedBarEl.getCssValue('opacity')).toBe('0.6');
  });
});

describe('Bar Chart example-negative-value tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/example-negative-value');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-1'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have negative values', async () => {
    const valueEl = await element.all(by.css('.axis.x .tick .negative-value')).count();

    expect(await valueEl).toBe(2);
  });
});

describe('Bar Chart example-colors', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/example-colors?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.bar.series-2'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should detect that first bar is blue', async () => {
    const blueEl = await element(by.css('.bar.series-0'));

    expect(await blueEl.getCssValue('fill')).toBe('rgb(29, 95, 138)');
  });

  it('Should detect that second bar is green', async () => {
    const blueEl = await element(by.css('.bar.series-1'));

    expect(await blueEl.getCssValue('fill')).toBe('rgb(142, 209, 198)');
  });

  it('Should detect that third bar is violet', async () => {
    const blueEl = await element(by.css('.bar.series-2'));

    expect(await blueEl.getCssValue('fill')).toBe('rgb(146, 121, 166)');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-color')).toEqual(0);
    });
  }
});

describe('Bar Chart alignment tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/test-alignment?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-1'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-alignment')).toEqual(0);
    });
  }
});

describe('Bar Chart axis adjust tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/test-axis-adjust?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-1'))), config.waitsFor);
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

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-axis-adjust')).toEqual(0);
    });
  }
});

describe('Bar Chart axis formatter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/test-axis-formatter?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.bar.series-1'))), config.waitsFor);
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

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-axis-formatter')).toEqual(0);
    });
  }
});

describe('Bar Chart several on page tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar/test-several-on-page?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.axis.y .tick text'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not overwritten labels', async () => {
    const checkText = async (svgId, tickNum, text) => {
      expect(await element.all(by.css(`${svgId} .axis.y .tick text`)).get(tickNum).getText()).toEqual(text);
    };

    expect(await element.all(by.css('.bar-chart svg')).count()).toBe(2);
    expect(await element.all(by.css('#bar-example1 .axis.y .tick text')).count()).toBe(3);
    expect(await element.all(by.css('#bar-example2 .axis.y .tick text')).count()).toBe(3);

    await checkText('#bar-example1', 0, 'Category A');
    await checkText('#bar-example1', 1, 'Category B');
    await checkText('#bar-example1', 2, 'Category C');

    await checkText('#bar-example2', 0, 'Category D');
    await checkText('#bar-example2', 1, 'Category E');
    await checkText('#bar-example2', 2, 'Category F');
  });
});
