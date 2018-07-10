const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Validation example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/example-index');
  });

  it('Should check a required rule', async () => {
    const emailEl = await element(by.id('email-address-ok'));
    await emailEl.clear();

    expect(await emailEl.getAttribute('value')).toEqual('');

    await emailEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);
    expect(await emailEl.getAttribute('class')).toContain('error');
  });
});

describe('Validation disabled form tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-validation-form-manual');
  });

  it('Should be able to disable validation', async () => {
    const submit = await element(by.id('submit'));
    await submit.click();

    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).count()).toEqual(1);
    expect(await element.all(by.css('.icon-error')).count()).toEqual(1);
  });
});

describe('Validation multiple error tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/example-multiple-errors');
  });

  it('Should be able to show multiple errors', async () => {
    const showlEl = await element(by.id('show'));
    await showlEl.click();
    await browser.driver.sleep(config.sleep);

    const list = $$('.message-text');

    expect(list.count()).toBe(3);
  });
});

describe('Validation submit error tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/example-validate-on-submit');
  });

  it('Should be able to validate on submit', async () => {
    const showlEl = await element(by.id('test1'));
    await showlEl.click();

    const list = $$('.message-text');

    expect(list.count()).toBe(2);
  });
});

describe('Validation form submit button', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/example-validation-form');
  });

  it('Should be able to enable submit', async () => {
    const cardEl = await element(by.id('credit-card'));
    await cardEl.sendKeys('1000');
    await cardEl.sendKeys(protractor.Key.TAB);

    const car2dEl = await element(by.id('credit-code2'));
    await car2dEl.sendKeys('1000');
    await car2dEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    const submitButton = await element(by.id('submit'));

    expect(submitButton.isEnabled()).toBe(false);

    const dropdownEl = await element.all(by.css('div[aria-controls="dropdown-list"]')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await dropdownEl.click();
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownEl.sendKeys(protractor.Key.ENTER);

    await browser.driver.sleep(config.sleep);

    const submitButton2 = await element(by.id('submit'));

    expect(await submitButton2.isEnabled()).toBe(true);
  });
});

describe('Validation alert types', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-alert-types');
  });

  it('Should render different alert types', async () => {
    await browser.driver.sleep(config.sleep);
    const elem = await element(by.css('.error-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(elem), config.waitFor);

    expect(await element(by.css('.error-message')).isPresent()).toBe(true);
    expect(await element(by.css('.alert-message')).isPresent()).toBe(true);
    expect(await element(by.css('.confirm-message')).isPresent()).toBe(true);
    expect(await element(by.css('.info-message')).isPresent()).toBe(true);
    expect(await element(by.css('.custom-icon-message')).isPresent()).toBe(true);
  });
});

describe('Validation alert on parent', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-error-icon-on-parent');
  });

  it('Should render icon on parent', async () => {
    const expander = await element(by.css('.expandable-expander'));
    expander.click();

    const emailEl = await element(by.id('date-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emailEl), config.waitsFor);

    emailEl.click();
    await emailEl.sendKeys('10');
    await emailEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.title .icon-error')).isPresent()).toBe(true);
  });
});

describe('Validation alert on tab', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-error-on-tab');
  });

  it('Should render icon on tab', async () => {
    const tabElTrigger = await element.all(by.className('tab')).get(1);
    await tabElTrigger.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element.all(by.className('tab-panel')).get(1)), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    const emailEl = await element(by.id('email-address-ok'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(emailEl), config.waitsFor);

    await emailEl.clear();
    await emailEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.tab .icon-error')).isPresent()).toBe(true);
  });
});

describe('Validation on date year', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-invalid-date-events');
  });

  it('Should validate just year', async () => {
    const dateEl = await element(by.id('date-field'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateEl), config.waitsFor);

    await dateEl.clear();
    await dateEl.sendKeys('2016');
    await dateEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Unavailable Date');

    await dateEl.clear();
    await dateEl.sendKeys('2017');
    await dateEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(false);
  });
});

describe('Validation Legacy Tooltip', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-legacy-tooltip');
  });

  it('Should render legacy validation tooltip', async () => {
    const dateEl = await element(by.id('email-address-ok'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dateEl), config.waitsFor);

    await dateEl.clear();
    await dateEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#validation-tooltip .tooltip-content')).getText()).toBe('Custom Error');
    expect(await element(by.css('#validation-tooltip')).isDisplayed()).toBe(true);
  });
});

describe('Validation on Accordion', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-on-accordion');
  });

  it('Should validate on an accordion', async () => {
    const header = await element(by.css('.alternate .accordion-header'));
    await header.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(header), config.waitsFor);

    const nameEl = await element(by.id('last-name2'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(nameEl), config.waitsFor);

    await nameEl.clear();
    await nameEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.error-message')).isPresent()).toBe(true);
  });
});

describe('No Validation on Readonly', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-readonly');
  });

  it('Should not validate when readonly', async () => {
    const email = await element(by.id('ro-email-address-ok'));

    await email.click();
    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(false);

    const toggle = await element(by.id('toggle'));
    toggle.click();

    await browser.driver.sleep(config.sleep);
    await email.click();
    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).first().getText()).toBe('Required');
    const messages = element.all(by.css('.error-message')).count();

    expect(messages).toBe(2);
  });
});

describe('Validation Async', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-validation-form-async');
  });

  it('Should validate async', async () => {
    const email = await element(by.id('credit-code'));

    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(true);
    const messageList = element.all(by.css('.message-text'));

    expect(await messageList.get(0).getText()).toBe('Required');
    expect(await messageList.get(1).getText()).toBe('Async Error');
  });
});

describe('Validation Emails', () => {
  beforeEach(async () => {
    await utils.setPage('/components/validation/test-email-validation');
  });

  it('can validate required with email', async () => {
    const email = await element(by.id('email-address'));

    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(true);
    const messageList = element.all(by.css('.message-text'));

    expect(await messageList.get(0).getText()).toBe('Required');
  });

  it('can validate an invalid email', async () => {
    const email = await element(by.id('email-address'));

    await email.click();
    await email.sendKeys('test@test');
    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(true);
    const messageList = element.all(by.css('.message-text'));

    expect(await messageList.get(0).getText()).toBe('Email address not valid');
  });

  it('can indicate a valid email', async () => {
    const email = await element(by.id('email-address-ok'));

    await email.sendKeys('test@test.com');
    await email.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.error-message')).isPresent()).toBe(false);
    expect(await element(by.css('.icon-confirm')).isPresent()).toBe(true);
  });
});
