const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Error Page example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/error-page/example-index');
    const modalEl = await element(by.id('modal-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open error page modal on tab and enter', async () => {
    const modalEl = await element(by.id('modal-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
    
    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });

  it('Should close the error page modal on click', async () => {
    const modalBtn = await element(by.id('modal-context'));
    await modalBtn.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.modal-engaged'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');

    await browser.driver.sleep(config.sleep);
    const returnBtn = await element(by.css('.error-page-button button'));
    await returnBtn.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(element(by.css('.modal-engaged'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  it('Should close error page modal on tab and escape', async () => {
    const modalEl = await element(by.id('modal-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.modal.is-visible'))), config.waitsFor);
    
    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');

    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);

    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.css('.modal'))), config.waitsFor);
    
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkScreen('error-page-message')).toEqual(0);
    });
  }
});
