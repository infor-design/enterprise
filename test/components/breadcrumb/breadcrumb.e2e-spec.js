const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
const axePageObjects = requireHelper('axe-page-objects');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Breadcrumb example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.breadcrumb'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('breadcrumb')).toEqual(0);
    });
  }
});

describe('Breadcrumb as text tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-current-as-link?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('breadcrumb-text')).toEqual(0);
    });
  }
});

describe('Breadcrumb navigation alternate tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-navigation-breadcrumbs-alternate?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('breadcrumb-alternate')).toEqual(0);
    });
  }
});

describe('Breadcrumb navigation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-navigation-breadcrumbs?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[class=row]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('blockgrid-text')).toEqual(0);
    });
  }
});

describe('Disabled breadcrumb navigation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-disabled?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('blockgrid-text')).toEqual(0);
    });
  }
});

describe('Breadcrumb automation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-from-settings?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should create automation IDs from settings', async () => {
    expect(await element(by.id('test-breadcrumb-home')).getAttribute('data-automation-id')).toEqual('test-breadcrumb-home');
    expect(await element(by.css('.breadcrumb-item.current a')).getAttribute('data-automation-id')).toEqual('test-breadcrumb-fourth');
  });
});

describe('Breadcrumb should be accessible with no WCAG 2AA violations', async () => {
  if (!utils.isIE()) {
    await utils.setPage(`/components/breadcrumb/example-disabled?theme=classic&layout=nofrills`);
    it('Should be accessible with no WCAG 2AA violations', async () => {
      const res = await axePageObjects(browser.params.theme);
      expect(res.violations.length).toEqual(0);
    });
  }
});
