const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Applicationmenu index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-index');
  });

  it('Should show the app menu', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const button = await element(by.css('.application-menu-trigger'));
      await button.click();

      const section = await element(by.css('body.no-scroll'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(section, 'applicationmenu')).toEqual(0);
    });
  }
});

describe('Applicationmenu filter tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-filterable');
  });

  it('Should filter', async () => {
    const button = await element(by.css('#application-menu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.has-filtered-children')).last()), config.waitsFor);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(8);
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(19);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu menubutton tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-menubutton');
  });

  it('Should have a working menu button', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.btn-menu')).last()), config.waitsFor);

    const menuButton = await element(by.css('.btn-menu'));
    await menuButton.click();

    expect(await element(by.id('popupmenu-2')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu open on large tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/example-open-on-large');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('application-menu'))), config.waitsFor);
  });

  it('Should have menu open', async () => {
    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Applicationmenu container tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-container');
  });

  it('Should show the app menu', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
    expect(await element.all(by.css('.accordion-header')).count()).toEqual(17);
    expect(await element.all(by.css('.accordion-header')).first().isDisplayed()).toBeTruthy();
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});
