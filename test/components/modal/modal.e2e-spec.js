const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Modal init example-modal tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/modal/example-index?theme=${browser.params.theme}`);
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
  });

  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations on example-modal', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  it('Should have modal closed by default', async () => {
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  it('Should open modal on tab, and enter', async () => {
    const modalEl = await element(by.id('add-context'));
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

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });

  it('Should close modal on tab, and escape', async () => {
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);

    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('modal-engaged')).isPresent()).toBeTruthy();
    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');

    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);

    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  it('Should have focus remain in the dialog on outside click', async () => {
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);

    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('modal-engaged')).isPresent()).toBeTruthy();
    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');

    await browser.driver.actions().mouseMove(modalEl).click().perform();

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });
});

describe('Modal open example-modal tests on click', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/modal/example-index?theme=${browser.params.theme}`);
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.click();
    await browser.driver.sleep(config.sleep);
  });

  if (!utils.isIE()) {
    it('Should be accessible on open with no WCAG 2AA violations on example-modal', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  it('Should open modal on click', async () => {
    expect(await element(by.className('modal-engaged')).isPresent()).toBeTruthy();
    expect(await element(by.css('.modal.is-visible')).isDisplayed()).toBeTruthy();
  });
});

describe('Modal example-validation tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/modal/example-validation?theme=${browser.params.theme}`);
    const modalEl = await element(by.css('button[data-modal="modal-1"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);
  });

  it('Should focus on first focusable item in modal', async () => {
    const dropdownEl = await element(by.css('div.dropdown'));

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
    expect(await dropdownEl.getAttribute('class')).toEqual(await browser.driver.switchTo().activeElement().getAttribute('class'));
  });

  it('Should show validation errors in modal', async () => {
    await element(by.id('context-name')).click();
    await browser.driver.switchTo().activeElement().sendKeys('to');
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
    expect(await element(by.id('context-name')).getAttribute('class')).toContain('error');
    expect(await element(by.css('.message-text')).getText()).toEqual('Email address not valid');

    await element(by.id('context-desc')).click();
    await element(by.id('context-name')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('context-desc')).getAttribute('class')).toContain('error');
    expect(await element.all(by.css('.message-text')).get(1).getText()).toEqual('Required');
  });
});
