const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Message tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/message/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not be able to tab out of message modal', async () => {
    const buttonEl = await element(by.id('show-delete-confirmation'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.btn-modal-primary'))), config.waitsFor);

    const modalButtonPrimaryEl = await element(by.css('.btn-modal-primary'));

    await modalButtonPrimaryEl.sendKeys(protractor.Key.TAB);

    expect(['hide-focus', 'btn-modal-primary', 'btn-modal-primary hide-focus']).toContain(await modalButtonPrimaryEl.getAttribute('class'));

    const modalButtonEl = await element(by.css('.btn-modal'));

    await modalButtonEl.sendKeys(protractor.Key.TAB);

    expect(['hide-focus', 'btn-modal', 'btn-modal hide-focus']).toContain(await modalButtonEl.getAttribute('class'));
  });
});

describe('Message xss tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/message/test-escaped-title');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not be able to tab out of message modal', async () => {
    const buttonEl = await element(by.id('show-message'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.message.modal'))), config.waitsFor);

    expect(await element(by.css('.message.modal .modal-title')).getText()).toEqual('<script>alert("menuXSS")</script>');
  });
});
