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

    expect(await modalButtonPrimaryEl.getAttribute('class')).toContain('hide-focus');

    const modalButtonEl = await element(by.css('.btn-modal'));

    await modalButtonEl.sendKeys(protractor.Key.TAB);

    expect(await modalButtonEl.getAttribute('class')).toContain('hide-focus');
  });
});
