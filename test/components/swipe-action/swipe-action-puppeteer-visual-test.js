const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Swipe Action Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/swipe-action';

  describe('Swipe Action Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntl: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#maincontent', { visible: true });

      await page.waitForTimeout(300);

      const mainContent = await page.$('#maincontent');
      const image = await mainContent.screenshot();
      const config = getConfig('swipe-action');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
