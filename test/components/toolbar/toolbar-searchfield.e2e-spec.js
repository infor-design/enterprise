const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Searchfield IDs
const sfId = 'regular-toolbar-searchfield';

describe('Toolbar Searchfield (no-reinvoke)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbar/test-searchfield-no-reinvoke-update?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(sfId))), config.waitsFor);
  });

  it('can be updated without issues', async () => {
    await element(by.id('update-toolbar')).click();
    await browser.driver.sleep(config.sleep);

    await utils.checkForErrors();
  });
});
