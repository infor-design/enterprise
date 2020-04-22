const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Empty Message Modal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/emptymessage/example-modal-empty-message');
    const emptyMessageEl = await element(by.id('show-empty-state-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emptyMessageEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should close the modal by default', async () => {
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  it('Should open modal on tab and enter', async () => {
    const emptyMessageEl = await element(by.id('show-empty-state-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emptyMessageEl), config.waitsFor);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await emptyMessageEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });

  it('Should close modal on tab and escape', async () => {
    const emptyMessageEl = await element(by.id('show-empty-state-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emptyMessageEl), config.waitsFor);
    await emptyMessageEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-engaged'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });

  if (utils.isChrome()) {
    it('Should focus remain in the dialog on outside click', async () => {
      const emptyMessageEl = await element(by.id('show-empty-state-message'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(emptyMessageEl), config.waitsFor);

      await emptyMessageEl.sendKeys(protractor.Key.ENTER);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.modal-wrapper'))), config.waitsFor);

      expect(await element(by.css('body')).getAttribute('class').toContain('modal-engaged'));
      await browser.driver.actions().mouseMove(emptyMessageEl).click().perform();
      await browser.driver.sleep(config.sleep);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-modal-empty-message', async () => {
      const bodyEl = await element(by.className('moda-engaged'));

      expect(await browser.protractorImageComparison.checkElement(bodyEl, 'modal-open')).toEqual(0);
    });
  }
});
