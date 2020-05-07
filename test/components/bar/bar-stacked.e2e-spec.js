const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bar (Stacked) Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-index?layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have names for the graphs', async () => {
    const namesEl = await element.all(by.css('.axis.y .tick text')).count();

    expect(await namesEl).toBe(3);
  });

  it('Should have bar groups', async () => {
    const groupEl = await element.all(by.css('.group .series-group')).count();

    expect(await groupEl).toBe(2);
  });

  it('Should be a stacked bar', async () => {
    const barEl = await element(by.css('.bar-chart-stacked'));

    expect(await barEl).toBeTruthy();
  });

  it('Should highlight when selected', async () => {
    await element(by.css('.series-group:nth-child(-n+3) .bar:nth-child(1)')).click();

    expect(await element(by.css('.series-group:nth-child(-n+3) .bar:nth-child(1)')).getAttribute('class')).toContain('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-stacked-index')).toEqual(0);
    });
  }
});

describe('Bar (Stacked) Chart example-colors', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-stacked-colors');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should detect that first bar is green', async () => {
    const fGroupEl = await element.all(by.css('.series-group')).get(0);
    const barEl = await fGroupEl.element(by.css('.bar.series-0'));

    expect(await barEl.getCssValue('fill')).toBe('rgb(142, 209, 198)');
  });

  it('Should detect that second bar is violet', async () => {
    const sGroupEl = await element.all(by.css('.series-group')).get(1);
    const barEl = await sGroupEl.element(by.css('.bar.series-0'));

    expect(await barEl.getCssValue('fill')).toBe('rgb(146, 121, 166)');
  });
});

describe('Bar (Stacked) Chart 100% tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-stacked-100?layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-stacked-100')).toEqual(0);
    });
  }
});
