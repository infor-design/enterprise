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
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#contextual-action-modal-1')).isDisplayed()).toBe(true);
  });

  it('Should not overflow buttons uneccessarily', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#modal-button-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#modal-button-3')).isDisplayed()).toBe(true);
  });
});

describe('CAP trigger context tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/example-trigger.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open popup on click', async () => {
    await element(by.id('manual-contextual-panel')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#contextual-action-modal-xyz')).isDisplayed()).toBe(true);
  });
});

describe('CAP jquery context tests no-flex', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/test-jquery-no-flex.html');
  });

  it('Should open popup on click no-flex', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#contextual-action-modal-1')).isDisplayed()).toBe(true);
  });

  it('Should not overflow buttons uneccessarily no-flex', async () => {
    await element(by.id('js-contextual-panel')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#modal-button-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#modal-button-3')).isDisplayed()).toBe(true);
  });
});

describe('Contextual Action Panel example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/example-index?layout=nofrills');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const actionButtonEl = await element(by.css('.btn-secondary'));
      await actionButtonEl.click();

      const panelEl = await element(by.className('modal'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.protractorImageComparison.checkElement(panelEl, 'contextual-action-index')).toEqual(0);
    });
  }
});

describe('Contextual Action Panel example-workspace tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/example-workspaces.html');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open popup on click', async () => {
    await element(by.id('workspace-cap')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#contextual-action-modal-1')).isDisplayed()).toBe(true);
  });
});

describe('Contextual Action Panel "always" fullsize tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/test-fullsize-always.html');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('always should not visual regress', async () => {
      await browser.driver.manage().window().setSize(1200, 800);
      await element(by.id('trigger-1')).click();
      await browser.driver.sleep(config.sleep);
      const panelEl = await element(by.css('#panel-1'));

      expect(await browser.protractorImageComparison.checkElement(panelEl, 'contextual-action-fullsize-always')).toEqual(0);
    });
  }

  it('should always show the CAP as a full screen sheet', async () => {
    await element(by.id('trigger-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#panel-1.display-fullsize')).isDisplayed()).toBe(true);
  });
});

describe('Contextual Action Panel "responsive" fullsize tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/test-fullsize-responsive.html');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('responsive should not visual regress', async () => {
      await browser.driver.manage().window().setSize(766, 600);
      await element(by.id('trigger-1')).click();
      await browser.driver.sleep(config.sleep);
      const panelEl = await element(by.css('#panel-1'));

      expect(await browser.protractorImageComparison.checkElement(panelEl, 'contextual-action-fullsize-responsive')).toEqual(0);
    });
  }

  it('should show the CAP as a full screen sheet when resizing the page to below the `phone-to-tablet` breakpoint size', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await element(by.id('trigger-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#panel-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#panel-1')).getAttribute('class')).not.toContain('display-fullsize');

    // Resize the page
    await browser.driver.manage().window().setSize(766, 600);
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#panel-1.display-fullsize')).isDisplayed()).toBe(true);
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Contextual Action Panel Locale Tests', () => {
  it('should show the CAP in de-DE locale', async () => {
    await utils.setPage('/components/contextualactionpanel/test-locale?locale=de-DE');
    await element(by.id('trigger-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#panel-1')).isDisplayed()).toBe(true);
    const value = await element(by.id('notes')).getAttribute('value');

    expect(value.replace(/[\s\r\n]+/g, '')).toEqual('Locale:de-DELang:deNumber:10.11.2019Date:1.000,00');
    await utils.checkForErrors();
  });

  it('should show the CAP in default locale', async () => {
    await utils.setPage('/components/contextualactionpanel/test-locale');
    await element(by.id('trigger-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#panel-1')).isDisplayed()).toBe(true);
    const value = await element(by.id('notes')).getAttribute('value');

    expect(value.replace(/[\s\r\n]+/g, '')).toEqual('Locale:en-USLang:enNumber:11/10/2019Date:1,000.00');
    await utils.checkForErrors();
  });
});

describe('Contextual Action Panel Nested tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextualactionpanel/test-nested?layout=nofrills');
  });

  it('Should open two caps on a page', async () => {
    await element(by.id('button-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#cap-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#cap-1 .title')).getText()).toEqual('Company Information');
    await element(by.css('#cap-1 #close-button')).click();
    await browser.driver.sleep(config.sleepLonger);

    await element(by.id('button-2')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#cap-2')).isDisplayed()).toBe(true);
    expect(await element(by.css('#cap-2 .title')).getText()).toEqual('Supplier Information');
    await element(by.css('#cap-2 #close-button')).click();
  });

  it('Should open nested caps on a page', async () => {
    await element(by.id('button-1')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#cap-1')).isDisplayed()).toBe(true);
    expect(await element(by.css('#cap-1 .title')).getText()).toEqual('Company Information');
    await element(by.id('trigger-2')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.css('#cap-2')).isDisplayed()).toBe(true);
    expect(await element(by.css('#cap-2 .title')).getText()).toEqual('Supplier Information');
    await element(by.css('#cap-2 #close-button')).click();
  });
});
