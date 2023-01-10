const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Error Page Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/error-page';

  describe('Error Page example-index tests', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.error-page-content')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('error-page-index');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
