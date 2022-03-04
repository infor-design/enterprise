const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Donut Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/donut/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    expect(await element(by.id('comp-a-slice-0')).getAttribute('id')).toEqual('comp-a-slice-0');
    expect(await element(by.id('comp-a-slice-0')).getAttribute('data-automation-id')).toEqual('comp-a-automation-id-slice-0');
    expect(await element(by.id('comp-a-legend-0')).getAttribute('id')).toEqual('comp-a-legend-0');
    expect(await element(by.id('comp-a-legend-0')).getAttribute('data-automation-id')).toEqual('comp-a-automation-id-legend-0');
  });
});
