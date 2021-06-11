const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Cards example-expandable-cards tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/cards/example-expandable-cards?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.className('card-pane'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be expandable card', async () => {
    expect(await element(by.className('expandable-card')).isPresent()).toBeTruthy();
    expect(await element(by.className('expandable-card-header')).isPresent()).toBeTruthy();
  });

  it('should be able to expand after clicked', async () => {
    const pane = await element(by.id('card-id-1-content'));
    const trigger = await element(by.id('card-id-1-expander'));

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'card-expandable')).toEqual(0);
    });
  }

  it('should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('card-id-1-card')).getAttribute('id')).toEqual('card-id-1-card');
    expect(await element(by.id('card-id-1-card')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-card');

    expect(await element(by.id('card-id-1-expander')).getAttribute('id')).toEqual('card-id-1-expander');
    expect(await element(by.id('card-id-1-expander')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-expander');

    expect(await element(by.id('card-id-1-action')).getAttribute('id')).toEqual('card-id-1-action');
    expect(await element(by.id('card-id-1-action')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-action');

    expect(await element(by.id('card-id-1-content')).getAttribute('id')).toEqual('card-id-1-content');
    expect(await element(by.id('card-id-1-content')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-content');
  });
});
