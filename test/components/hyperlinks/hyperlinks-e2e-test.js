const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Hyperlink index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hyperlinks/example-index?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('should render without any error', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'hyperlinks-index')).toEqual(0);
    });
  }
});
