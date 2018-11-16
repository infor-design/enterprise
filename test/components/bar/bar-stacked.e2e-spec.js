const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Stacked Bar Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-index?nofrills=true');
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
    const fGroupEl = await element.all(by.css('.series-group')).get(0);
    const fBarEl = await fGroupEl.element(by.css('.bar.series-0'));
    const sGroupEl = await element.all(by.css('.series-group')).get(1);
    const sBarEl = await sGroupEl.element(by.css('.bar.series-0'));

    await fBarEl.click();

    expect(await fBarEl.getAttribute('class')).toContain('is-selected');

    expect(await sBarEl.getAttribute('class')).toContain('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'bar-stacked-index')).toEqual(0);
    });
  }
});

describe('Stacked Bar Chart example-colors', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-stacked/example-stacked-colors');
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
