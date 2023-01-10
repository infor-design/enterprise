const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Colors Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/colors';

  describe('Colors Classic Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-classic');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Colors New Theme Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-new-theme');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
