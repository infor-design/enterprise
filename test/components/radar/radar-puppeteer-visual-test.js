const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe.skip('Radar Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/radar';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.widget');
      const widgeContainer = await page.$('.widget');
      const img = await widgeContainer.screenshot();
      const config = getConfig('radar');

      expect(img).toMatchImageSnapshot(config);
    });
  });
});
