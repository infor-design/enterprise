const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Completion Chart variations tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/completion-chart/example-variations?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to set id/automation id example one', async () => {
    expect(await element(by.id('completion-chart-example1-name')).getAttribute('id')).toEqual('completion-chart-example1-name');
    expect(await element(by.id('completion-chart-example1-name')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-name');

    expect(await element(by.id('completion-chart-example1-total-value')).getAttribute('id')).toEqual('completion-chart-example1-total-value');
    expect(await element(by.id('completion-chart-example1-total-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-total-value');

    expect(await element(by.id('completion-chart-example1-total-bar')).getAttribute('id')).toEqual('completion-chart-example1-total-bar');
    expect(await element(by.id('completion-chart-example1-total-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-total-bar');

    expect(await element(by.id('completion-chart-example1-remaining-bar')).getAttribute('id')).toEqual('completion-chart-example1-remaining-bar');
    expect(await element(by.id('completion-chart-example1-remaining-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-remaining-bar');
    expect(await element(by.id('completion-chart-example1-remaining-value')).getAttribute('id')).toEqual('completion-chart-example1-remaining-value');
    expect(await element(by.id('completion-chart-example1-remaining-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-remaining-value');
    expect(await element(by.id('completion-chart-example1-remaining-text')).getAttribute('id')).toEqual('completion-chart-example1-remaining-text');
    expect(await element(by.id('completion-chart-example1-remaining-text')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-remaining-text');

    expect(await element(by.id('completion-chart-example1-completed-bar')).getAttribute('id')).toEqual('completion-chart-example1-completed-bar');
    expect(await element(by.id('completion-chart-example1-completed-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-completed-bar');
    expect(await element(by.id('completion-chart-example1-completed-value')).getAttribute('id')).toEqual('completion-chart-example1-completed-value');
    expect(await element(by.id('completion-chart-example1-completed-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-completed-value');
    expect(await element(by.id('completion-chart-example1-completed-text')).getAttribute('id')).toEqual('completion-chart-example1-completed-text');
    expect(await element(by.id('completion-chart-example1-completed-text')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example1-completed-text');
  });

  it('should be able to set id/automation id example seven', async () => {
    expect(await element(by.id('completion-chart-example7-info-value')).getAttribute('id')).toEqual('completion-chart-example7-info-value');
    expect(await element(by.id('completion-chart-example7-info-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-info-value');
    expect(await element(by.id('completion-chart-example7-info-text')).getAttribute('id')).toEqual('completion-chart-example7-info-text');
    expect(await element(by.id('completion-chart-example7-info-text')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-info-text');

    expect(await element(by.id('completion-chart-example7-total-bar')).getAttribute('id')).toEqual('completion-chart-example7-total-bar');
    expect(await element(by.id('completion-chart-example7-total-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-total-bar');

    expect(await element(by.id('completion-chart-example7-remaining-bar')).getAttribute('id')).toEqual('completion-chart-example7-remaining-bar');
    expect(await element(by.id('completion-chart-example7-remaining-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-remaining-bar');

    expect(await element(by.id('completion-chart-example7-completed-bar')).getAttribute('id')).toEqual('completion-chart-example7-completed-bar');
    expect(await element(by.id('completion-chart-example7-completed-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-completed-bar');
    expect(await element(by.id('completion-chart-example7-completed-value')).getAttribute('id')).toEqual('completion-chart-example7-completed-value');
    expect(await element(by.id('completion-chart-example7-completed-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-completed-value');
    expect(await element(by.id('completion-chart-example7-completed-text')).getAttribute('id')).toEqual('completion-chart-example7-completed-text');
    expect(await element(by.id('completion-chart-example7-completed-text')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-completed-text');

    expect(await element(by.id('completion-chart-example7-targetline-bar')).getAttribute('id')).toEqual('completion-chart-example7-targetline-bar');
    expect(await element(by.id('completion-chart-example7-targetline-bar')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-targetline-bar');
    expect(await element(by.id('completion-chart-example7-targetline-value')).getAttribute('id')).toEqual('completion-chart-example7-targetline-value');
    expect(await element(by.id('completion-chart-example7-targetline-value')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-targetline-value');
    expect(await element(by.id('completion-chart-example7-targetline-text')).getAttribute('id')).toEqual('completion-chart-example7-targetline-text');
    expect(await element(by.id('completion-chart-example7-targetline-text')).getAttribute('data-automation-id')).toEqual('automation-id-completion-chart-example7-targetline-text');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('completion-chart')).toEqual(0);
    });
  }
});

describe('Completion Chart color tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/completion-chart/example-colors?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('completion-chart-colors')).toEqual(0);
    });
  }
});

describe('Completion Chart Short Field tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/completion-chart/example-short.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('completion-chart-short')).toEqual(0);
    });
  }
});
