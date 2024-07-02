const utils = requireHelper('e2e-utils');

requireHelper('rejection');

describe('Expandable Area Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/expandablearea/example-index?theme=classic&layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.className('expandable-expander'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to toggle', async () => {
    const pane = await element(by.id('expandablearea-id-1-content'));
    const trigger = await element.all(by.className('expandable-expander')).first();

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'expandablearea-index')).toEqual(0);
    });
  }

  it('should be able to set ids/automations ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('expandablearea-id-1')).getAttribute('id')).toEqual('expandablearea-id-1');
    expect(await element(by.id('expandablearea-id-1')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-1');
    expect(await element(by.id('expandablearea-id-1-header')).getAttribute('id')).toEqual('expandablearea-id-1-header');
    expect(await element(by.id('expandablearea-id-1-header')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-1-header');
    expect(await element(by.id('expandablearea-id-1-content')).getAttribute('id')).toEqual('expandablearea-id-1-content');
    expect(await element(by.id('expandablearea-id-1-content')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-1-content');
    expect(await element(by.id('expandablearea-id-1-expander')).getAttribute('id')).toEqual('expandablearea-id-1-expander');
    expect(await element(by.id('expandablearea-id-1-expander')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-1-expander');
    expect(await element(by.id('expandablearea-id-1-footer')).getAttribute('id')).toEqual('expandablearea-id-1-footer');
    expect(await element(by.id('expandablearea-id-1-footer')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-1-footer');

    expect(await element(by.id('expandablearea-id-2')).getAttribute('id')).toEqual('expandablearea-id-2');
    expect(await element(by.id('expandablearea-id-2')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-2');
    expect(await element(by.id('expandablearea-id-2-header')).getAttribute('id')).toEqual('expandablearea-id-2-header');
    expect(await element(by.id('expandablearea-id-2-header')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-2-header');
    expect(await element(by.id('expandablearea-id-2-content')).getAttribute('id')).toEqual('expandablearea-id-2-content');
    expect(await element(by.id('expandablearea-id-2-content')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-2-content');
    expect(await element(by.id('expandablearea-id-2-expander')).getAttribute('id')).toEqual('expandablearea-id-2-expander');
    expect(await element(by.id('expandablearea-id-2-expander')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-2-expander');
    expect(await element(by.id('expandablearea-id-2-footer')).getAttribute('id')).toEqual('expandablearea-id-2-footer');
    expect(await element(by.id('expandablearea-id-2-footer')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-2-footer');

    expect(await element(by.id('expandablearea-id-3')).getAttribute('id')).toEqual('expandablearea-id-3');
    expect(await element(by.id('expandablearea-id-3')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-3');
    expect(await element(by.id('expandablearea-id-3-header')).getAttribute('id')).toEqual('expandablearea-id-3-header');
    expect(await element(by.id('expandablearea-id-3-header')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-3-header');
    expect(await element(by.id('expandablearea-id-3-content')).getAttribute('id')).toEqual('expandablearea-id-3-content');
    expect(await element(by.id('expandablearea-id-3-content')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-3-content');
    expect(await element(by.id('expandablearea-id-3-expander')).getAttribute('id')).toEqual('expandablearea-id-3-expander');
    expect(await element(by.id('expandablearea-id-3-expander')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-3-expander');
    expect(await element(by.id('expandablearea-id-3-footer')).getAttribute('id')).toEqual('expandablearea-id-3-footer');
    expect(await element(by.id('expandablearea-id-3-footer')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-3-footer');

    expect(await element(by.id('expandablearea-id-4')).getAttribute('id')).toEqual('expandablearea-id-4');
    expect(await element(by.id('expandablearea-id-4')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-4');
    expect(await element(by.id('expandablearea-id-4-header')).getAttribute('id')).toEqual('expandablearea-id-4-header');
    expect(await element(by.id('expandablearea-id-4-header')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-4-header');
    expect(await element(by.id('expandablearea-id-4-content')).getAttribute('id')).toEqual('expandablearea-id-4-content');
    expect(await element(by.id('expandablearea-id-4-content')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-4-content');
    expect(await element(by.id('expandablearea-id-4-expander')).getAttribute('id')).toEqual('expandablearea-id-4-expander');
    expect(await element(by.id('expandablearea-id-4-expander')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-4-expander');
    expect(await element(by.id('expandablearea-id-4-footer')).getAttribute('id')).toEqual('expandablearea-id-4-footer');
    expect(await element(by.id('expandablearea-id-4-footer')).getAttribute('data-automation-id')).toEqual('expandablearea-automation-id-4-footer');
  });
});

describe('Expandable Custom Toggle Button Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/expandablearea/test-toggle-button?theme=classic&layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.className('expandable-pane'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to toggle', async () => {
    const pane = await element(by.id('expandable-area-0-content'));
    const trigger = await element(by.id('trigger-btn'));

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'expandablearea-toggle')).toEqual(0);
    });
  }
});
