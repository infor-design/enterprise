const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

fdescribe('Column empty tests', () => {  //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/column/test-empty');
  });

  it('Should show the empty area', async () => {
    expect(await element(by.css('.empty-message'))).toBeTruthy();
    expect(await element(by.css('.empty-title')).getText()).toEqual('No Data Found');
  });
});
