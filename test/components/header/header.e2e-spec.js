const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Header Index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/header/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display header text', async () => {
    expect(await element(by.css('.title')).getText()).toEqual('Page Title');
  });
});
