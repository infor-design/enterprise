const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('CAP jquery context tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/example-jquery.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open popup on click', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#contextual-action-modal-1')).isDisplayed()).toBe(true);
  });

  it('Should not overflow buttons uneccessarily', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#modal-button-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#modal-button-3')).isDisplayed()).toBe(true);
  });
});

describe('CAP jquery context tests no-flex', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/test-jquery-no-flex.html');
  });

  it('Should open popup on click no-flex', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#contextual-action-modal-1')).isDisplayed()).toBe(true);
  });

  it('Should not overflow buttons uneccessarily no-flex', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#modal-button-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#modal-button-3')).isDisplayed()).toBe(true);
  });
});

describe('ContextualActionPanel example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/example-index?nofrills=true');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const actionButtonEl = await element(by.css('.btn-secondary'));
      await actionButtonEl.click();

      const panelEl = await element(by.className('modal'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(panelEl, 'contextual-action-index')).toEqual(0);
    });
  }
});
