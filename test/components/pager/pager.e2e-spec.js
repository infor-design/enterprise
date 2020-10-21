const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Pager Standalone Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/pager/example-standalone');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    const btnEl = await element(by.css('[for="toggle-pagesize"]'));
    await btnEl.click();

    expect(await element(by.id('standalone-pager-btn-first')).getAttribute('id')).toEqual('standalone-pager-btn-first');
    expect(await element(by.id('standalone-pager')).getAttribute('id')).toEqual('standalone-pager');
    expect(await element(by.id('standalone-pager-btn-first')).getAttribute('id')).toEqual('standalone-pager-btn-first');
    expect(await element(by.id('standalone-pager-btn-prev')).getAttribute('id')).toEqual('standalone-pager-btn-prev');
    expect(await element(by.id('standalone-pager-btn-next')).getAttribute('id')).toEqual('standalone-pager-btn-next');
    expect(await element(by.id('standalone-pager-btn-last')).getAttribute('id')).toEqual('standalone-pager-btn-last');
    expect(await element(by.id('standalone-pager-btn-pagesize')).getAttribute('id')).toEqual('standalone-pager-btn-pagesize');
    expect(await element(by.id('standalone-pager-pagesize-opt-10')).getAttribute('id')).toEqual('standalone-pager-pagesize-opt-10');
    expect(await element(by.id('standalone-pager-pagesize-opt-20')).getAttribute('id')).toEqual('standalone-pager-pagesize-opt-20');
    expect(await element(by.id('standalone-pager-pagesize-opt-30')).getAttribute('id')).toEqual('standalone-pager-pagesize-opt-30');
    expect(await element(by.id('standalone-pager-pagesize-opt-40')).getAttribute('id')).toEqual('standalone-pager-pagesize-opt-40');
  });
});
