const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Header Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/header';

  describe('Header Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      expect(await page.waitForSelector('.container', { visible: true })).toBeTruthy();
      const header = await page.$('.header');
      const img = await header.screenshot();
      const config = getConfig('header-title');
      expect(img).toMatchImageSnapshot(config);
    });
  });

  describe('Header Toolbar Categories Tests', () => {
    const url = `${baseUrl}/example-toolbar-flex-with-categories.html?theme=classic&mode=light&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.search-categories');
      await page.waitForSelector('.searchfield');
      await page.type('.searchfield', 'ea');
      const img = await page.screenshot();
      const config = getConfig('header-search');

      expect(img).toMatchImageSnapshot(config);
    });
  });
});
