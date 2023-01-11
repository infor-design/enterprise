const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

describe('Tabs Multi tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-multi/example-index');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isBS() && !utils.isCI()) {
    it('should display a tooltip when hovering a tab with cut-off text', async () => {
      await browser.driver.sleep(config.sleepShort);
      await browser.actions()
        .mouseMove(await element(by.id('tabs-one-contracts-1')))
        .perform();
      await browser.driver.sleep(config.sleepShort);

      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('tooltip'))), config.waitsFor);
      await browser.driver.sleep(config.sleepShort);

      expect(await element(by.id('tooltip')).getAttribute('class')).not.toContain('is-hidden');
      expect(await element(by.id('tooltip')).getText()).toEqual('Contracts (and then a few more Contracts)');
    });
  }
});
