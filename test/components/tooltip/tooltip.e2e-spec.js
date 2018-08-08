const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tooltips on icons', () => {
  beforeEach(async () => {
    await utils.setPage('/components/icons/example-tooltips');
  });

  it('should display when hovering the icon', async () => {
    await browser.actions()
      .mouseMove(await element(by.id('standalone-delete-icon')))
      .perform();

    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.tooltip')).getText()).toEqual('Send to Trashcan');
  });
});
