const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Badges Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/badges';

  describe.skip('Badges/Tag accessibility color tests for New Theme', () => {
    const url = `${baseUrl}/example-index.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should run visual test new  theme', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.waitForSelector('.twelve');
      const img = await page.screenshot();
      const config = getConfig('badges-new');
      expect(img).toMatchImageSnapshot(config);
    });
  });

  describe.skip('Badges/Tag accessibility color tests for Classic Theme', () => {
    const url = `${baseUrl}/example-index.html?theme=classic&mode=light&colors=2578a9`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should run visual test new  theme classic', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.waitForSelector('.twelve');
      const img2 = await page.screenshot();
      const config = getConfig('badges-classic');
      expect(img2).toMatchImageSnapshot(config);
    });
  });
});
