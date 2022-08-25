const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

describe('Fieldset Tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on index', async () => {
      await utils.setPage('/components/fieldset/example-index.html?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'fieldset-index')).toEqual(0);
    });

    it('Should be able to set id/automation id', async () => {
      await utils.setPage('/components/fieldset/example-index.html?theme=classic&layout=nofrills');
      await browser.driver.sleep(config.sleep);

      expect(await element(by.id('fieldset')).getAttribute('id')).toEqual('fieldset');
      expect(await element(by.id('fieldset')).getAttribute('data-automation-id')).toEqual('fieldset-automation-id');
    });

    it('Should not visual regress on short layouts', async () => {
      await utils.setPage('/components/fieldset/example-short.html?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'fieldset-short-layout')).toEqual(0);
    });
  }
});
