const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Toolbar (overflow)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-category-searchfield-go-button-home.html');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('module-tab-panel-container'))), config.waitsFor);
  });

  it('should not have any errors', async () => {
    await utils.checkForErrors();
  });
});
