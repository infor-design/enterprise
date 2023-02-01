const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

describe('Message visual regression tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on lists example?theme=classic&layout=nofrills', async () => {
      await utils.setPage('/components/message/test-lists.html');
      await browser.driver.sleep(config.sleep);
      const container = await element(by.id('maincontent'));
      await element(by.id('show-message')).click();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(container, 'message-open-list')).toEqual(0);
    });

    it('should not visually regress on error example', async () => {
      await utils.setPage('/components/message/example-index.html?theme=classic');
      await browser.driver.sleep(config.sleep);
      const container = await element(by.id('maincontent'));
      await element(by.id('show-application-error')).click();
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(container, 'message-open')).toEqual(0);
    });
  }
});
