const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Grouped Bar Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/example-index?nofrills=true');
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

    expect(await groupEl).toBe(3);
  });

  it('Should highlight when selected', async () => {
    const fGroupEl = await element.all(by.css('.group .series-group')).get(0);

    await fGroupEl.click();

    expect(await fGroupEl.getAttribute('class')).toContain('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'bar-grouped-index')).toBeLessThan(1);
    });
  }
});

describe('Grouped Bar Chart example-negative-value tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/example-negative');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should have negative values', async () => {
    const valueEl = await element.all(by.css('.axis.x .tick .negative-value')).count();

    expect(await valueEl).toBe(2);
  });
});

describe('Grouped Bar Chart example-selected tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/example-selected');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be highlighted when selected', async () => {
    const fGroupEl = await element.all(by.css('.group .series-group')).get(0);

    expect(await fGroupEl.getAttribute('class')).toContain('is-selected');
  });
});
