const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Circlepager Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/circlepager';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('circlepager');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
