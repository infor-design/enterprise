const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Datagrid index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/example-index');

    const datagridEl = await element(by.id('datagrid'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
    const tabElTriggerStart = await element(by.id('header-searchfield'));
    await tabElTriggerStart.click();
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show results', async () => {
    expect(await element(by.className('datagrid-result-count')).getText()).toBe('(7 Results)');
  });

  it('Should navigate with arrow keys', async () => {
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

    let cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('2');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');

    await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
    cellEl = await browser.driver.switchTo().activeElement();

    expect(await cellEl.getAttribute('aria-colindex')).toBe('1');
  });
});

describe('Datagrid contextmenu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-contextmenu');

    const datagridEl = await element(by.id('readonly-datagrid'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(datagridEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show context menu', async () => {
    const td = await element(by.css('#readonly-datagrid tr:first-child td:first-child')).getLocation();
    await browser.actions()
      .mouseMove(td)
      .click(protractor.Button.RIGHT)
      .perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#grid-actions-menu'))), config.waitsFor);

    expect(await element(by.css('#grid-actions-menu > li:nth-child(1)')).getText()).toBe('Action One');
    expect(await element(by.css('#grid-actions-menu > li:nth-child(1)')).isDisplayed()).toBeTruthy();

    expect(await element(by.css('#grid-actions-menu > li:nth-child(3)')).getText()).toBe('Action Three');
    expect(await element(by.css('#grid-actions-menu > li:nth-child(3)')).isDisplayed()).toBeTruthy();

    expect(await element(by.css('#grid-actions-menu .submenu .popupmenu')).isDisplayed()).toBeFalsy();

    browser.actions().mouseMove(element(by.css('#grid-actions-menu .submenu'))).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#grid-actions-menu .submenu .popupmenu'))), config.waitsFor);

    expect(await element(by.css('#grid-actions-menu .submenu ul > li:nth-child(1)')).getText()).toBe('Action Four');
    expect(await element(by.css('#grid-actions-menu .submenu ul > li:nth-child(1)')).isDisplayed()).toBeTruthy();
  });
});
