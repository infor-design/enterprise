const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Datagrid example-index tests', () => { //eslint-disable-line
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

  it('Should show results', async () => {
    expect(await element(by.className('datagrid-result-count')).getText()).toBe('(7 Results)');
  });

  it('Should navigate with arrow keys', async () => {
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

    const cellEl = await browser.driver.switchTo().activeElement();

    expect(cellEl.getAttribute('aria-colindex')).toBe('1');
    expect(cellEl.parentElementArrayFinder.getAttribute('aria-colindex')).toBe(1);
  });
});
