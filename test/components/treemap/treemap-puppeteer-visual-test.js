const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Treemap Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/treemap';

  describe('Treemap Example Index Tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visually regress', async () => {
      const mainContent = await page.$('#maincontent');
      const image = await mainContent.screenshot();
      const config = getConfig('treemap');

      expect(image).toMatchImageSnapshot(config);
    });
  });
});
