const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Bar (Stacked) Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-index?theme=classic&layout=nofrills');
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
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.series-group:nth-child(-n+3) .bar:nth-child(1)')).getAttribute('class')).toContain('is-selected');
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('barstacked-s1-2008-bar')).getAttribute('id')).toEqual('barstacked-s1-2008-bar');
    expect(await element(by.id('barstacked-s1-2008-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s1-2008-bar');
    expect(await element(by.id('barstacked-s1-2009-bar')).getAttribute('id')).toEqual('barstacked-s1-2009-bar');
    expect(await element(by.id('barstacked-s1-2009-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s1-2009-bar');
    expect(await element(by.id('barstacked-s1-2010-bar')).getAttribute('id')).toEqual('barstacked-s1-2010-bar');
    expect(await element(by.id('barstacked-s1-2010-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s1-2010-bar');

    expect(await element(by.id('barstacked-s2-2008-bar')).getAttribute('id')).toEqual('barstacked-s2-2008-bar');
    expect(await element(by.id('barstacked-s2-2008-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s2-2008-bar');
    expect(await element(by.id('barstacked-s2-2009-bar')).getAttribute('id')).toEqual('barstacked-s2-2009-bar');
    expect(await element(by.id('barstacked-s2-2009-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s2-2009-bar');
    expect(await element(by.id('barstacked-s2-2010-bar')).getAttribute('id')).toEqual('barstacked-s2-2010-bar');
    expect(await element(by.id('barstacked-s2-2010-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-s2-2010-bar');

    expect(await element(by.id('barstacked-series1-legend')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-series1-legend-0');
    expect(await element(by.id('barstacked-series2-legend')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-series2-legend-1');
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

    expect(await barEl.getCssValue('fill')).toBe('rgb(168, 225, 225)');
  });

  it('Should detect that second bar is violet', async () => {
    const sGroupEl = await element.all(by.css('.series-group')).get(1);
    const barEl = await sGroupEl.element(by.css('.bar.series-0'));

    expect(await barEl.getCssValue('fill')).toBe('rgb(121, 40, 225)');
  });
});

describe('Bar (Stacked) Chart 100% tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-stacked-100?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('barstacked-c1-2014-bar')).getAttribute('id')).toEqual('barstacked-c1-2014-bar');
    expect(await element(by.id('barstacked-c1-2014-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-c1-2014-bar');
    expect(await element(by.id('barstacked-c1-2015-bar')).getAttribute('id')).toEqual('barstacked-c1-2015-bar');
    expect(await element(by.id('barstacked-c1-2015-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-c1-2015-bar');

    expect(await element(by.id('barstacked-c2-2014-bar')).getAttribute('id')).toEqual('barstacked-c2-2014-bar');
    expect(await element(by.id('barstacked-c2-2014-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-c2-2014-bar');
    expect(await element(by.id('barstacked-c2-2015-bar')).getAttribute('id')).toEqual('barstacked-c2-2015-bar');
    expect(await element(by.id('barstacked-c2-2015-bar')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-c2-2015-bar');

    expect(await element(by.id('barstacked-comp1-legend-0')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-comp1-legend-0');
    expect(await element(by.id('barstacked-comp2-legend-1')).getAttribute('data-automation-id')).toEqual('automation-id-barstacked-comp2-legend-1');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-stacked-100')).toEqual(0);
    });
  }
});
