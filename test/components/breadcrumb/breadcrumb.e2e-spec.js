const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Breadcrumb example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/breadcrumb/example-index?layout=nofrills');
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
    await utils.setPage('/components/breadcrumb/example-current-as-link?layout=nofrills');
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
    await utils.setPage('/components/breadcrumb/example-navigation-breadcrumbs-alternate?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    fit('Should not visual regress', async () => {
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
    await utils.setPage('/components/breadcrumb/example-navigation-breadcrumbs?layout=nofrills');
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
