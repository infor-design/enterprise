/* eslint-disable compat/compat */
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Bubble Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bubble';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');
      const img = await page.screenshot();
      const sConfig = getConfig('bubble');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
