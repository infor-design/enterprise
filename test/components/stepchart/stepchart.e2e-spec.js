const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Stepchart example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/stepchart/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id example one', async () => {
    expect(await element(by.id('stepchart-example1-label')).getAttribute('id')).toEqual('stepchart-example1-label');
    expect(await element(by.id('stepchart-example1-label')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-label');

    expect(await element(by.id('stepchart-example1-icon')).getAttribute('id')).toEqual('stepchart-example1-icon');
    expect(await element(by.id('stepchart-example1-icon')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-icon');

    expect(await element(by.id('stepchart-example1-step0')).getAttribute('id')).toEqual('stepchart-example1-step0');
    expect(await element(by.id('stepchart-example1-step0')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step0');
    expect(await element(by.id('stepchart-example1-step1')).getAttribute('id')).toEqual('stepchart-example1-step1');
    expect(await element(by.id('stepchart-example1-step1')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step1');
    expect(await element(by.id('stepchart-example1-step2')).getAttribute('id')).toEqual('stepchart-example1-step2');
    expect(await element(by.id('stepchart-example1-step2')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step2');
    expect(await element(by.id('stepchart-example1-step3')).getAttribute('id')).toEqual('stepchart-example1-step3');
    expect(await element(by.id('stepchart-example1-step3')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step3');
    expect(await element(by.id('stepchart-example1-step4')).getAttribute('id')).toEqual('stepchart-example1-step4');
    expect(await element(by.id('stepchart-example1-step4')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step4');
    expect(await element(by.id('stepchart-example1-step5')).getAttribute('id')).toEqual('stepchart-example1-step5');
    expect(await element(by.id('stepchart-example1-step5')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step5');
    expect(await element(by.id('stepchart-example1-step6')).getAttribute('id')).toEqual('stepchart-example1-step6');
    expect(await element(by.id('stepchart-example1-step6')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example1-step6');
  });

  it('Should be able to set id/automation id example four', async () => {
    expect(await element(by.id('stepchart-example4-label')).getAttribute('id')).toEqual('stepchart-example4-label');
    expect(await element(by.id('stepchart-example4-label')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-label');

    expect(await element(by.id('stepchart-example4-label-small')).getAttribute('id')).toEqual('stepchart-example4-label-small');
    expect(await element(by.id('stepchart-example4-label-small')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-label-small');

    expect(await element(by.id('stepchart-example4-icon')).getAttribute('id')).toEqual('stepchart-example4-icon');
    expect(await element(by.id('stepchart-example4-icon')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-icon');

    expect(await element(by.id('stepchart-example4-step0')).getAttribute('id')).toEqual('stepchart-example4-step0');
    expect(await element(by.id('stepchart-example4-step0')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step0');
    expect(await element(by.id('stepchart-example4-step1')).getAttribute('id')).toEqual('stepchart-example4-step1');
    expect(await element(by.id('stepchart-example4-step1')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step1');
    expect(await element(by.id('stepchart-example4-step2')).getAttribute('id')).toEqual('stepchart-example4-step2');
    expect(await element(by.id('stepchart-example4-step2')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step2');
    expect(await element(by.id('stepchart-example4-step3')).getAttribute('id')).toEqual('stepchart-example4-step3');
    expect(await element(by.id('stepchart-example4-step3')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step3');
    expect(await element(by.id('stepchart-example4-step4')).getAttribute('id')).toEqual('stepchart-example4-step4');
    expect(await element(by.id('stepchart-example4-step4')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step4');
    expect(await element(by.id('stepchart-example4-step5')).getAttribute('id')).toEqual('stepchart-example4-step5');
    expect(await element(by.id('stepchart-example4-step5')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step5');
    expect(await element(by.id('stepchart-example4-step6')).getAttribute('id')).toEqual('stepchart-example4-step6');
    expect(await element(by.id('stepchart-example4-step6')).getAttribute('data-automation-id')).toEqual('automation-id-stepchart-example4-step6');
  });
});
