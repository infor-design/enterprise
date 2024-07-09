const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');

describe.skip('Swipe Action example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/swipe-action/example-index?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('swipe-action')).toEqual(0);
    });
  }
});
