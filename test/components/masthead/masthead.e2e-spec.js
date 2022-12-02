const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Masthead tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/masthead/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress on soho theme', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-classic')).toEqual(0);
    });

    it('Should not visual regress on new theme', async () => {
      await utils.setPage('/components/masthead/example-index?theme=new&mode=dark&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-new')).toEqual(0);
    });

    it('Should not visual regress on classic theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-soho-images')).toEqual(0);
    });

    xit('Should not visual regress on new theme for images', async () => {
      await utils.setPage('/components/masthead/example-photos?theme=new&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'masthead-new-images')).toEqual(0);
    });
  }
});
