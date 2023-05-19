const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Targeted Achievement Visual Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/targeted-achievement';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should not visually regress', async () => {
      expect(await page.waitForSelector('.chart-targeted-achievement', { visible: true })).toBeTruthy();

      const mainContent = await page.waitForSelector('#maincontent', { visible: true });
      const image = await mainContent.screenshot();
      const config = getConfig('targeted-achievement');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Links and icons', () => {
    const url = `${baseUrl}/example-links-icons?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 600 });
    });

    it('should not visually regress', async () => {
      const mainContent = await page.waitForSelector('body', { visible: true });
      const image = await mainContent.screenshot();
      const config = getConfig('targeted-achievement-links-icons');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
