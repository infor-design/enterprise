const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Message tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/message/example-index');
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should not be able to tab out of message modal', async () => {
    const buttonEl = await element(by.id('show-delete-confirmation'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

    const modalEl = await element(by.id('show-delete-confirmation'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);

    expect(await element(by.id('modal-button-10')).getAttribute('class')).not.toContain('hide-focus');
    await element(by.id('modal-button-10')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('modal-button-9')).getAttribute('class')).not.toContain('hide-focus');
    await element(by.id('modal-button-9')).sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('modal-button-10')).getAttribute('class')).not.toContain('hide-focus');
    await element(by.id('modal-button-10')).sendKeys(protractor.Key.TAB);
  });
});
