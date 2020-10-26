const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Splitter example-index test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/splitter/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('splitter-id-1')).getAttribute('id')).toEqual('splitter-id-1');
    expect(await element(by.id('splitter-id-1')).getAttribute('data-automation-id')).toEqual('splitter-automation-id-1');

    expect(await element(by.id('splitter-id-1-handle')).getAttribute('id')).toEqual('splitter-id-1-handle');
    expect(await element(by.id('splitter-id-1-handle')).getAttribute('data-automation-id')).toEqual('splitter-automation-id-1-handle');

    expect(await element(by.id('splitter-id-1-icon')).getAttribute('id')).toEqual('splitter-id-1-icon');
    expect(await element(by.id('splitter-id-1-icon')).getAttribute('data-automation-id')).toEqual('splitter-automation-id-1-icon');
  });
});