const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Empty message example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/emptymessage/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automations', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('error-loading')).getAttribute('id')).toEqual('error-loading');
    expect(await element(by.id('error-loading')).getAttribute('data-automation-id')).toEqual('automation-id-error-loading');
  });
});

describe('Empty message test-button-click tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/emptymessage/test-button-click');
  });

  it('Should be able to set id/automations in root component', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('test-emptymessage-id')).getAttribute('id')).toEqual('test-emptymessage-id');
    expect(await element(by.id('test-emptymessage-id')).getAttribute('data-automation-id')).toEqual('test-automation-emptymessage');
  });

  it('Should be able to set id/automations in button', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('test-emptymessage-id-btn')).getAttribute('id')).toEqual('test-emptymessage-id-btn');
    expect(await element(by.id('test-emptymessage-id-btn')).getAttribute('data-automation-id')).toEqual('test-automation-emptymessage-btn');
  });
});
