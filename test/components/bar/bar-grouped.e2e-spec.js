const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Grouped Bar Chart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/example-index?layout=nofrills');
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
    await browser.driver.sleep(config.sleep);
    await element(by.css('.series-group:nth-child(-n+3)')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.series-group:nth-child(-n+3)')).getAttribute('class')).toContain('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-grouped-index')).toEqual(0);
    });
  }
});

describe('Grouped Bar formatter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/example-formatter?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-grouped-formatter')).toEqual(0);
    });
  }
});

describe('Grouped Bar many groups tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/bar-grouped/test-many-groups?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'bar-grouped-many-groups')).toEqual(0);
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
    await utils.setPage('/components/bar-grouped/test-selected');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be highlighted when selected', async () => {
    await browser.driver.sleep(config.sleep);
    const fGroupEl = await element.all(by.css('.group .series-group')).get(0);

    expect(await fGroupEl.getAttribute('class')).toContain('is-selected');
  });
});
