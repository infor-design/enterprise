const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Application Menu role switcher tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-personalized-role-switcher-long-title');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should have a working role switcher with long title', async () => {
    const btnSel = '.application-menu-switcher-trigger';
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css(btnSel)).last()), config.waitsFor); // eslint-disable-line

    const btnEl = await element(by.css(btnSel));
    await btnEl.click();

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeTruthy();
  });

  it('should assign proper aria roles to the trigger button', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('trigger-btn'))), config.waitsFor);

    expect(element(by.id('trigger-btn')).getAttribute('aria-controls')).toBe('expandable-area-0-content');
    expect(element(by.id('trigger-btn')).getAttribute('aria-expanded')).toBe('false');

    await element(by.id('trigger-btn')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('trigger-btn')).getAttribute('aria-expanded')).toBe('true');
  });

  it('can dismiss the role switcher by pressing Escape', async () => {
    const btnSel = '.application-menu-switcher-trigger';
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css(btnSel)).last()), config.waitsFor); // eslint-disable-line

    const btnEl = await element(by.css(btnSel));
    await btnEl.click();

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeTruthy();

    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.application-menu-switcher-panel')).isDisplayed()).toBeFalsy();
  });
});

describe('Application Menu custom search tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-custom');
  });

  it('should show the search even though filterable is false', async () => {
    expect(await element(by.css('#application-menu-searchfield')).isPresent()).toBeTruthy();
  });

  it('should have a search but not filter the menu when filterable is false', async () => {
    const button = await element(by.css('#application-menu-searchfield'));
    await button.sendKeys('Role');
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.accordion-header.filtered')).count()).toEqual(0);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu Many Items tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-filterable-many-items');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });
});

describe('Application Menu Event Propagation Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-click-event-propagation');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#application-menu.is-open'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should fire a toast when its accordion headers are clicked', async () => {
    const thirdHeader = await element(by.css('#application-menu > div > div:nth-child(3)'));
    await thirdHeader.click();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.id('toast-container'))).toBeTruthy();
  });
});

describe('Application Menu Manual Init Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/applicationmenu/test-manual-init');
  });

  it('should open when the hamburger button is clicked', async () => {
    const button = await element(by.css('.application-menu-trigger'));
    await button.click();
    await browser.driver.sleep(config.sleepLonger);
    await utils.checkForErrors();

    expect(await element(by.id('application-menu')).isDisplayed()).toBeTruthy();
  });
});
